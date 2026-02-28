import {
  Loader,
  OrbitControls,
  PointMaterial,
  useGLTF,
  useMask,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import ringVertex from './ring.vertex.glsl'
import ringFragment from './ring.fragment.glsl'
import ringGpu from './ring.gpu.glsl'
import { Perf } from 'r3f-perf'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import { useUniformTime } from '~/hook/useUniformTime'
import { useControls } from 'leva'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
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

// blender导出模型
function getGeo3() {
  const { nodes, materials } = useGLTF(asset('/model/storm-transformed.glb'))
  // @ts-ignore
  const geo = nodes.Spiral002.geometry as THREE.BufferGeometry
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

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
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



function Base() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((_, delta) => {
    // groupRef.current.rotation.y -= delta * 0.1
  })

  return (
    // <group ref={groupRef} rotation={[0.4, 0, -0.5]}>
    <group ref={groupRef} scale={.01}>
      <Part1 />
    </group>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [0, 0, 4] }}>
        {/* <Perf position='top-left' /> */}
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls target={[0, 0, 0]} />
        <Suspense fallback={null}>
          <Base />
        </Suspense>

        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
      <Loader/>
    </div>
  )
}
