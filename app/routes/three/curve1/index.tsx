import { Center, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { useMemo, useRef } from 'react'
import { createNoise4D } from 'simplex-noise'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import threadVertex from './thread.vertex.glsl'
import threadFragment from './thread.fragment.glsl'
import pointsVertex from './points.vertex.glsl'
import pointsFragment from './points.fragment.glsl'
import { useUniformTime } from '~/hook/useUniformTime'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

const noise = createNoise4D()
const { sin, random, PI } = Math

interface ThreadProp {
  ndx: number
  start: THREE.Vector3
  pointsGeo: THREE.BufferGeometry
  sampleCount: number
  sampleXGap: number
  positionCount: number
  noiseScale: { x: number; y: number; z: number }
  noiseAmp: number
  pointSpeed: number
}

function Thread({
  ndx,
  start,
  pointsGeo,
  sampleCount,
  sampleXGap,
  positionCount,
  noiseScale,
  noiseAmp,
  pointSpeed,
}: ThreadProp) {
  const uniformTime = useUniformTime()
  const { colorScale, colorOffset } = useControls({
    colorScale: {
      value: 1,
      min: 0.1,
      max: 4,
      step: 0.01,
    },
    colorOffset: {
      x: 3,
      y: 2,
      z: 1,
    },
  })
  const uniforms = {
    ...uniformTime,
    ndx: new THREE.Uniform(ndx),
    colorScale: new THREE.Uniform(colorScale),
    colorOffset: new THREE.Uniform(
      new THREE.Vector3(...Object.values(colorOffset)),
    ),
  }

  const { curve, geo } = useMemo(() => {
    const prePoint = start.clone()

    const noiseScaleV3 = new THREE.Vector3(
      noiseScale.x,
      noiseScale.y,
      noiseScale.z,
    )

    // 噪音创建采样节点
    const points: THREE.Vector3[] = []

    for (let i = 0; i < sampleCount; i++) {
      const x = start.x + sampleXGap * i
      const y =
        noise(...prePoint.multiply(noiseScaleV3).toArray(), 0 + ndx * 0.1) *
        noiseAmp
      const z =
        start.z +
        noise(...prePoint.multiply(noiseScaleV3).toArray(), 1 + ndx * 0.1) *
          noiseAmp
      const p = new THREE.Vector3(x, y, z)
      points.push(p)
      prePoint.copy(p)
    }

    // 点 -> curve
    const curve = new THREE.CatmullRomCurve3(points)

    // 曲线重新采样 -> 线顶点
    const position = new Float32Array(positionCount * 3)
    for (let i = 0; i < positionCount; i++) {
      const progress = i / positionCount
      const p = curve.getPointAt(progress)
      const i3 = i * 3
      position[i3 + 0] = p.x
      position[i3 + 1] = p.y
      position[i3 + 2] = p.z
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))

    return { curve, geo }
  }, [start, sampleCount, positionCount, sampleXGap, noiseScale, noiseAmp])

  useFrame((_, delta) => {
    const lifeAttr = pointsGeo.getAttribute('life')
    const life = (lifeAttr.array[ndx] + delta * (pointSpeed+sin(ndx*.2)*.1+.1)) % 1
    lifeAttr.array[ndx] = life

    const p = curve.getPointAt(life)
    const posAttr = pointsGeo.getAttribute('position')
    posAttr.array[ndx * 3 + 0] = p.x
    posAttr.array[ndx * 3 + 1] = p.y
    posAttr.array[ndx * 3 + 2] = p.z
  })

  return (
    // @ts-ignore
    <line geometry={geo}>
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.MeshBasicMaterial}
        vertexShader={threadVertex}
        fragmentShader={threadFragment}
        blending={THREE.AdditiveBlending}
        transparent={true}
        depthWrite={false}
      />
    </line>
  )
}

function Base() {
  const { count, gap } = useControls({
    count: { value: 100, min: 5, max: 200, step: 1 },
    gap: { value: 0.1, min: 0.01, max: 2, step: 0.01 },
  })

  const threadData = useMemo(() => {
    const threadData = Array.from({ length: count }, (item, i) => {
      const z = i * gap
      const start = new THREE.Vector3(0, 0, z)
      return {
        start,
        ndx: i,
        pointProgress: random(),
      }
    })
    return threadData
  }, [count, gap])

  const {
    sampleCount,
    sampleXGap,
    positionCount,
    noiseScale,
    noiseAmp,
    pointSpeed,
  } = useControls({
    sampleCount: { value: 10, min: 5, max: 20, step: 1 },
    sampleXGap: { value: 4, min: 1, max: 10 },
    positionCount: { value: 200, min: 50, max: 200, step: 1 },
    noiseScale: { x: 0.5, y: 0.5, z: 0.5 },
    noiseAmp: { value: 1, min: 0.1, max: 5 },
    pointSpeed: { value: 0.1, min: 0.01, max: 2, step: 0.01 },
  })

  /**
   * 点云粒子会把自己的geo按照ndx分发给thread
   * thread会更新geo position中对应它的点云位置
   */
  const { pointsGeo } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const position = new Float32Array(count * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
    const life = new Float32Array(count)
    const ndx = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      life[i] = random()
      ndx[i] = i
    }
    geo.setAttribute('life', new THREE.BufferAttribute(life, 1))
    geo.setAttribute('ndx', new THREE.BufferAttribute(ndx, 1))
    return {
      pointsGeo: geo,
    }
  }, [count])

  // thread会通过curve更新点云顶点位置,在这里统一更新
  useFrame((_, delta) => {
    pointsGeo.getAttribute('position').needsUpdate = true
    pointsGeo.getAttribute('life').needsUpdate = true
  })

  return (
    <>
      <points geometry={pointsGeo}>
        <CustomShaderMaterial
          baseMaterial={THREE.PointsMaterial}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          size={0.3}
        />
      </points>
      {threadData.map((item) => {
        return (
          <Thread
            key={item.ndx}
            ndx={item.ndx}
            start={item.start}
            pointsGeo={pointsGeo}
            sampleCount={sampleCount}
            sampleXGap={sampleXGap}
            positionCount={positionCount}
            noiseScale={noiseScale}
            noiseAmp={noiseAmp}
            pointSpeed={pointSpeed}
          />
        )
      })}
    </>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [0, 0, 10] }}>
        {/* <Perf position='top-left' /> */}
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />

        <group rotation={[.4,-.3,-.0]}>
          <Center>
            <Base />
          </Center>
        </group>

        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
