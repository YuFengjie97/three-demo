import {
  OrbitControls,
  PointMaterial,
  useGLTF,
  useMask,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import ringVertex from './ring.vertex.glsl'
import ringFragment from './ring.fragment.glsl'
import ringGpu from './ring.gpu.glsl'
import centerVertex from './center.vertex.glsl'
import centerFragment from './center.fragment.glsl'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { Perf } from 'r3f-perf'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import { useUniformTime } from '~/hook/useUniformTime'
import { useControls } from 'leva'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { gsap } from 'gsap/gsap-core'
import { asset } from '~/utils/asset'

const { PI, ceil, floor, random, sqrt, cos, sin, pow } = Math

function useGpu(geo: THREE.BufferGeometry) {
  const posAttr = geo.getAttribute('position')
  const posArr = posAttr.array
  const count = posAttr.count
  const size = ceil(sqrt(count))
  const { gl } = useThree()

  const fillPosTex = (tex: THREE.DataTexture) => {
    const data = tex.image.data!
    for (let i = 0; i < count; i++) {
      const i4 = i * 4
      const i3 = i * 3
      data[i4 + 0] = posArr[i3 + 0]
      data[i4 + 1] = posArr[i3 + 1]
      data[i4 + 2] = posArr[i3 + 2]
      data[i4 + 3] = random()
    }
  }

  const uniformTime = useUniformTime()

  const { gpu, posVar } = useMemo(() => {
    const gpu = new GPUComputationRenderer(size, size, gl)
    const posTex = gpu.createTexture()
    fillPosTex(posTex)
    const posVar = gpu.addVariable('posTex', ringGpu, posTex)
    gpu.setVariableDependencies(posVar, [posVar])
    posVar.material.uniforms = {
      ...uniformTime,
      defPos: new THREE.Uniform(posTex),
      lifeSpeed: new THREE.Uniform(1),
      particleVel: new THREE.Uniform(1.5),
    }
    gpu.init()

    return { gpu, posVar }
  }, [size])

  useControls({
    lifeSpeed: {
      value: posVar.material.uniforms.lifeSpeed.value,
      min: 0.1,
      max: 4,
      step: 0.01,
      onChange(v) {
        posVar.material.uniforms.lifeSpeed.value = v
      },
    },
    particleVel: {
      value: 1.5,
      min: 0.1,
      max: 10,
      step: 0.01,
      onChange(v) {
        posVar.material.uniforms.particleVel.value = v
      },
    },
  })

  return { gpu, posVar, count, size }
}

// 通过固定的形状来构造geo
function getGeo() {
  const geos: THREE.BufferGeometry[] = []
  for (let i = 1; i < 5; i++) {
    // const geo = new THREE.TorusGeometry(1*i, 0.2*i, 10*i, 40*i)
    const gap = i * 1
    const innerR = 0.2 * i + gap
    const outerR = innerR + 0.2 * i
    const geo = new THREE.RingGeometry(innerR, outerR, 300 * i, 8 * i)
    geo.translate(0, 0, i * 0.2)
    geos.push(geo)
  }
  const geo = mergeGeometries(geos)
  geo.rotateX(-PI / 2)
  geo.rotateZ(0.3)
  return geo
}

// 随机位置
function getGeo2() {
  const geo = new THREE.BufferGeometry()
  const count = 60000
  const position = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const ang = random() * PI * 2
    const r = random() * 4 + 0.3
    const x = cos(ang) * r
    const z = sin(ang) * r
    const y = (4 / sqrt(pow(x, 2) + pow(z, 2))) * (random() - 0.5)
    position[i3 + 0] = x
    position[i3 + 1] = y
    position[i3 + 2] = z
  }
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
  return geo
}

// blender导出模型弯曲带子
function getGeo3() {
  const { nodes, materials } = useGLTF(asset('/model/universe-transformed.glb'))
  // @ts-ignore
  const geo = nodes.universe.geometry as THREE.BufferGeometry
  geo.setIndex(null)
  return geo
}

// 周围环形点云
function Part1() {
  const { geo } = useMemo(() => {
    const geo = getGeo3()
    const posAttr = geo.getAttribute('position')
    const count = posAttr.count
    const size = ceil(sqrt(count))

    const pCoord = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      const y = floor(i / size)
      const x = i - y * size
      const i2 = i * 2
      pCoord[i2 + 0] = (x + 0.5) / size
      pCoord[i2 + 1] = (y + 0.5) / size
    }
    geo.setAttribute('pCoord', new THREE.BufferAttribute(pCoord, 2))

    return { geo }
  }, [])

  const { gpu, posVar } = useGpu(geo)

  const uniforms = {
    size: new THREE.Uniform(10),
    gpuPos: new THREE.Uniform(gpu.getCurrentRenderTarget(posVar).texture),
  }

  useFrame(() => {
    gpu.compute()
  })

  return (
    <points geometry={geo} scale={10}>
      {/* <PointMaterial size={0.01} /> */}
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={ringVertex}
        fragmentShader={ringFragment}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// 中心球
function Part2() {
  return (
    <mesh>
      <icosahedronGeometry args={[0.1, 2]} />
      <meshBasicMaterial toneMapped={false} color={[10, 10, 10]} />
    </mesh>
  )
}

// 中心激光
function Part3() {
  const geo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const count = 300
    const position = new Float32Array(count * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
    const life = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      life[i] = random()
    }
    geo.setAttribute('aLife', new THREE.BufferAttribute(life, 1))
    return geo
  }, [])

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    size: new THREE.Uniform(100.),
  }

  return (
    <points geometry={geo}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={centerVertex}
        fragmentShader={centerFragment}
        transparent={true}
        depthWrite={false}
      />
    </points>
  )
}

function Base() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    groupRef.current.rotation.y -= delta * 0.1
  })

  return (
    <group ref={groupRef} rotation={[0.4, 0, -0.5]}>
      <Part1 />
      <Part2 />
      <Part3 />
    </group>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [0, 2, 6] }}>
        <Perf position='top-left' />
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls target={[0, 1, 0]} />
        <Base />

        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
