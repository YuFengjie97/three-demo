import { Loader, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three/webgpu'
import {
  Fn,
  sin,
  length,
  mul,
  add,
  div,
  pow,
  float,
  abs,
  time,
  positionLocal,
  vec3,
  vec4,
  smoothstep,
  texture,
  instanceIndex,
  instancedArray,
  hash,
  uniform,
  storage,
  deltaTime,
  fract,
  If,
  PI,
  mx_noise_vec3,
  mx_noise_vec4,
  hue,
  color,
  dot,
  positionGeometry,
  cameraProjectionMatrix,
  modelViewMatrix,
} from 'three/tsl'
import { useControls } from 'leva'

function Base() {
  const uHeight = uniform(9)
  const uNoiseScale = uniform(0.1)
  const uColScale = uniform(2)
  const uMetalness = uniform(.5)
  const uRoughness = uniform(.5)
  useControls({
    uHeight: {
      value: uHeight.value,
      min: 0.1,
      max: 40,
      step: 0.01,
      onChange(v) {
        uHeight.value = v
      },
    },
    uNoiseScale: {
      value: uNoiseScale.value,
      min: 0.01,
      max: 2,
      step: 0.01,
      onChange(v) {
        uNoiseScale.value = v
      },
    },
    uColScale: {
      value: uColScale.value,
      min: 0.01,
      max: 5,
      step: 0.01,
      onChange(v) {
        uColScale.value = v
      },
    },
    uMetalness: {
      value: uMetalness.value,
      min: 0.01,
      max: 1,
      step: 0.01,
      onChange(v) {
        uMetalness.value = v
      },
    },
    uRoughness: {
      value: uRoughness.value,
      min: 0.01,
      max: 1,
      step: 0.01,
      onChange(v) {
        uRoughness.value = v
      },
    },
  })

  const { mesh, computeInit, computeUpdate } = useMemo(() => {
    const size = 80
    const cellNum = 80
    const cellSize = (size / cellNum) * 0.8
    const geoBase = new THREE.PlaneGeometry(size, size, cellNum, cellNum)
    geoBase.rotateX(-Math.PI / 2)

    const position = geoBase.getAttribute('position')
    const count = position.count

    const positionBuffer = instancedArray(
      position.array as Float32Array,
      'vec3',
    )
    const heightBuffer = instancedArray(count, 'float')
    const computeInit = Fn(() => {
      const idx = instanceIndex
      heightBuffer.element(idx).assign(4)
    })().compute(count)
    const computeUpdate = Fn(() => {
      const idx = instanceIndex
      // const h = mx_noise_vec4(vec4(positionBuffer.element(idx),time)).mul(.5).add(.5).mul(4)
      const h = mx_noise_vec3(positionBuffer.element(idx).mul(uNoiseScale).add(time))
        .mul(0.5)
        .add(0.5)
        .mul(uHeight)
      heightBuffer.element(idx).assign(h)
    })().compute(count)

    const sin3 = Fn(([v3]) => {
      return vec3(sin(v3.x), sin(v3.y), sin(v3.z))
    })

    const mat = new THREE.MeshStandardNodeMaterial()
    mat.colorNode = Fn(() => {
      // return vec3(1, 0, 0)
      const idx = instanceIndex
      const pos = positionBuffer.element(idx)
      const col = sin3(vec3(3,2,1).add(dot(sin3(pos), vec3(uColScale)))).mul(.5).add(.5)
      return col
    })()
    mat.metalnessNode = uMetalness
    mat.roughnessNode = uRoughness
    // mat.transparent = true
    // mat.opacity = .8

    mat.vertexNode = Fn(() => {
      const idx = instanceIndex
      const height = heightBuffer.element(idx)
      const pos = positionGeometry
        .add(vec3(0, cellSize / 2, 0)) // 先平移到底部，为了缩放可以以底部为基准缩放
        .add(positionBuffer.element(idx)) // 实例位置位移到目标位置
        .mul(vec3(1, height, 1)) // 按照高度缩放

      const pos4 = vec4(pos, 1) // 齐次坐标

      const res = cameraProjectionMatrix.mul(modelViewMatrix.mul(pos4)) // mvp矩阵
      return res
    })()
    const geo = new THREE.BoxGeometry(cellSize, cellSize, cellSize)
    const mesh = new THREE.InstancedMesh(geo, mat, count)
    return { mesh, computeInit, computeUpdate }
  }, [])

  const renderer = useThree().gl as unknown as THREE.WebGPURenderer
  renderer.compute(computeInit)
  useFrame(() => {
    renderer.compute(computeUpdate)
  })

  return <primitive object={mesh} />
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas
        camera={{ position: [0, 17, 20] }}
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props as any)
          await renderer.init()
          return renderer
        }}
      >
        <ambientLight />
        {/* <pointLight position={[0,20,0]} intensity={1000} /> */}
        <directionalLight position={[5,10,0]} intensity={2} />
        <axesHelper args={[10]} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Base />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}
