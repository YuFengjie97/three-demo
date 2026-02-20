import { OrbitControls, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import pointsVertex from './points.vertex.glsl'
import pointsFragment from './points.fragment.glsl'
import { Perf } from 'r3f-perf'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useUniformTime } from '~/hook/useUniformTime'
import { asset } from '~/utils/asset'

const { random, ceil, floor, sin } = Math

function Particle({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const refs = useRef<THREE.Mesh[]>([])
  const count = 10
  const progressData = useMemo(() => {
    const arr = Array.from({ length: count }, (item) => {
      return random()
    })
    return arr
  }, [count])

  useFrame(({ clock }, delta) => {
    progressData.forEach((item, i) => {
      progressData[i] += delta * 0.02
      const p = progressData[i] % 1
      const pos = curve.getPointAt(p)
      refs.current[i] && refs.current[i].position.set(...pos.toArray())
    })
  })

  return progressData.map((item, i) => {
    return (
      <mesh
        key={i}
        ref={(el) => {
          // @ts-ignore
          refs.current[i] = el
        }}
        scale={0.1}
      >
        <icosahedronGeometry />
        <meshNormalMaterial />
      </mesh>
    )
  })
}

function Points({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const count = 1000
  const { data, geo } = useMemo(() => {
    const ndx = new Float32Array(count)
    const data = Array.from({ length: count }, (item, i) => {
      ndx[i] = i
      return { progress: random() }
    })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    )
    geo.setAttribute(
      'life',
      new THREE.BufferAttribute(new Float32Array(count), 1)
    )
    geo.setAttribute(
      'ndx',
      new THREE.BufferAttribute(ndx, 1)
    )

    return {
      data,
      geo,
    }
  }, [count])

  useEffect(() => {
    return () => {
      geo.dispose()
    }
  }, [geo])

  useFrame((_, delta) => {
    const posAttr = geo.getAttribute('position')
    const posArr = posAttr.array

    const lifeAttr = geo.getAttribute('life')
    const lifeArr = lifeAttr.array
    data.forEach((item, i) => {
      item.progress += delta * 0.01
      const p = item.progress % 1
      const pos = curve.getPointAt(p)
      const i3 = i * 3
      posArr[i3 + 0] = pos.x
      posArr[i3 + 1] = pos.y
      posArr[i3 + 2] = pos.z

      lifeArr[i] = p
    })

    posAttr.needsUpdate = true
    lifeAttr.needsUpdate = true
  })

  const tex = useTexture(asset('/img/texture/particle/star_09.png'))
  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    tex: new THREE.Uniform(tex)
  }

  return (
    <points geometry={geo}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={pointsVertex}
        fragmentShader={pointsFragment}
        depthWrite={false}
        depthTest={true}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Base() {
  const tubularSegments = 2000
  const radialSegments = 10

  const { geo, curve } = useMemo(() => {
    const points: THREE.Vector3[] = []
    const icoGeo = new THREE.IcosahedronGeometry(2, 0)
    const icoEdgeGeo = new THREE.EdgesGeometry(icoGeo)
    // icoEdgeGeo.scale(2,2,2)
    const { count, array } = icoEdgeGeo.getAttribute('position')
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = array[i3 + 0]
      const y = array[i3 + 1]
      const z = array[i3 + 2]
      points.push(new THREE.Vector3(x, y, z))
    }

    const curve = new THREE.CatmullRomCurve3(points, true)

    const geo = new THREE.TubeGeometry(
      curve,
      tubularSegments,
      0.1,
      radialSegments,
      false,
    )

    return { geo, curve }
  }, [])

  return (
    <>
      <mesh geometry={geo}>
        <meshBasicMaterial
          color={0xb089ff}
          transparent={true}
          opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={true}
        />
      </mesh>
      {/* <Particle curve={curve}/> */}
      <Points curve={curve} />
    </>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        <Perf position='top-left' />
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />
        <ambientLight />
        <pointLight intensity={40} position={[0, 4, 0]} />
        <Base />
        <EffectComposer>
          <Bloom/>
        </EffectComposer>
      </Canvas>
    </div>
  )
}
