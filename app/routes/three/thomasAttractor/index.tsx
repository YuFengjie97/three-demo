import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import CustomShaderMaterial from 'three-custom-shader-material'
import * as THREE from 'three'
import particleVS from './particle.vs.glsl'
import particleFS from './particle.fs.glsl'
import particleGPU from './particle.gpu.glsl'
import { createContext, useContext, useMemo } from 'react'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import { useUniformTime } from '~/hook/useUniformTime'
import { useControls } from 'leva'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

interface BaseContext {
  count: number
  size: number
}
const BaseContext = createContext<BaseContext>({
  count: 0,
  size: 1,
})

const { ceil, sqrt, random, floor } = Math

function fillPosTex(dataTex: THREE.DataTexture, size: number) {
  const data = dataTex.image.data!
  for (let i = 0; i < size * size; i++) {
    const i4 = i * 4
    data[i4 + 0] = (random() - 0.5) * 10
    data[i4 + 1] = (random() - 0.5) * 10
    data[i4 + 2] = (random() - 0.5) * 10
    data[i4 + 3] = random()
  }
}

function useGPU() {
  const { size } = useContext(BaseContext)
  const { gl } = useThree()
  const uniformTime = useUniformTime()

  const { gpu, posVar } = useMemo(() => {
    const gpu = new GPUComputationRenderer(size, size, gl)
    const posTex = gpu.createTexture()
    fillPosTex(posTex, size)
    const posVar = gpu.addVariable('posTex', particleGPU, posTex)
    gpu.setVariableDependencies(posVar, [posVar])
    posVar.material.uniforms = {
      ...uniformTime,
      speed: new THREE.Uniform(2.5),
      bFactor: new THREE.Uniform(0.208186)
    }
    gpu.init()

    return { posVar, gpu }
  }, [])

  useControls({
    speed: {
      value: 2.5,
      min: 0.1,
      max: 20,
      step: 0.01,
      onChange(v){
        posVar.material.uniforms.speed.value = v
      }
    },
    // bFactor: {
    //   value: 0.208186,
    //   min: 0.,
    //   max: 1,
    //   step: 0.000001,
    //   onChange(v){
    //     posVar.material.uniforms.bFactor.value = v
    //   }
    // },
  })

  return { gpu, posVar }
}

function Particles() {
  const { count, size } = useContext(BaseContext)

  const { geo } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const position = new Float32Array(count * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))

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
  }, [count])

  const { posVar, gpu } = useGPU()

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    posTex: new THREE.Uniform(gpu.getCurrentRenderTarget(posVar).texture),
  }
  useFrame(() => {
    gpu.compute()
  })

  return (
    <points geometry={geo}>
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.PointsMaterial}
        vertexShader={particleVS}
        fragmentShader={particleFS}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        size={.1}
      />
    </points>
  )
}

function Base() {
  const count = 10000
  const size = ceil(sqrt(count))

  return (
    <BaseContext value={{ count, size }}>
      <Particles />
    </BaseContext>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        <axesHelper args={[10]} />
        <OrbitControls />
        <Base />

        <EffectComposer>
          <Bloom/>
        </EffectComposer>
      </Canvas>
    </div>
  )
}
