import { Loader, OrbitControls } from '@react-three/drei'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import * as THREE from 'three/webgpu'
import {
  Fn,
  sin,
  dot,
  time,
  vec3,
  vec4,
  instanceIndex,
  instancedArray,
  uniform,
  mx_noise_vec3,
  positionGeometry,
  cameraProjectionMatrix,
  modelViewMatrix,
  float,
} from 'three/tsl'
import { useControls } from 'leva'

declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any)

function Base() {
  const uniforms = useMemo(
    () => ({
      uHeight: uniform(9),
      uNoiseScale: uniform(0.1),
      uColScale: uniform(2),
      uMetalness: uniform(0.5),
      uRoughness: uniform(0.5),
    }),
    [],
  )

  useControls({
    uHeight: {
      value: 9,
      min: 0.1,
      max: 40,
      step: 0.01,
      onChange: (v) => {
        uniforms.uHeight.value = v
      },
    },
    uNoiseScale: {
      value: 0.1,
      min: 0.01,
      max: 2,
      step: 0.01,
      onChange: (v) => {
        uniforms.uNoiseScale.value = v
      },
    },
    uColScale: {
      value: .1,
      min: 0.01,
      max: 2,
      step: 0.01,
      onChange: (v) => {
        uniforms.uColScale.value = v
      },
    },
    // uMetalness: {
    //   value: 0.5,
    //   min: 0.01,
    //   max: 1,
    //   step: 0.01,
    //   onChange: (v) => {
    //     uniforms.uMetalness.value = v
    //   },
    // },
    // uRoughness: {
    //   value: 0.5,
    //   min: 0.01,
    //   max: 1,
    //   step: 0.01,
    //   onChange: (v) => {
    //     uniforms.uRoughness.value = v
    //   },
    // },
  })

  const renderer = useThree().gl as unknown as THREE.WebGPURenderer

  const size = 80
  const cellNum = 80
  const cellSize = (size / cellNum) * 0.8

  const { positionArray, count } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, cellNum, cellNum)
    geo.rotateX(-Math.PI / 2)
    const position = geo.getAttribute('position')
    const count = position.count
    const positionArray = new Float32Array(position.array)
    geo.dispose()
    return { positionArray, count }
  }, [])

  const { positionBuffer, computeInit, computeUpdate, getColor, vertexNode } =
    useMemo(() => {
      const positionBuffer = instancedArray(positionArray, 'vec3')
      const heightBuffer = instancedArray(count, 'float')

      const computeInit = Fn(() => {
        heightBuffer.element(instanceIndex).assign(4)
      })().compute(count)

      const computeUpdate = Fn(() => {
        const idx = instanceIndex
        const h = mx_noise_vec3(
          positionBuffer.element(idx).mul(uniforms.uNoiseScale).add(time),
        ).x
        .mul(0.5)
        .add(0.5)
        .mul(uniforms.uHeight)
        heightBuffer.element(idx).assign(h)
      })().compute(count)


      const getColor = Fn(() => {

        const pos = positionBuffer.element(instanceIndex)
        const height = heightBuffer.element(instanceIndex)
        const col = (mx_noise_vec3(pos.add(height).mul(uniforms.uColScale)).mul(10))
        col.x.assign(sin(col.x).mul(.5).add(.5))
        col.y.assign(sin(col.y).mul(.5).add(.5))
        col.z.assign(sin(col.z).mul(.5).add(.5))
        return col
      })

      const vertexNode = Fn(() => {
        const idx = instanceIndex
        const height = heightBuffer.element(idx)

        // 3. 修复变换矩阵的乘法顺序 (先自身缩放，再加全局位移)
        const pos = positionGeometry
          .add(vec3(0, cellSize / 2, 0)) // 步骤1: 坐标系原点移到底部
          .mul(vec3(1, height, 1)) // 步骤2: 基于底部进行 Y 轴高度缩放
          .add(positionBuffer.element(idx)) // 步骤3: 将缩放完的实例移动到它该在的网格位置

        return cameraProjectionMatrix.mul(modelViewMatrix.mul(vec4(pos, 1)))
      })

      return {
        positionBuffer,
        computeInit,
        computeUpdate,
        getColor,
        vertexNode,
      }
    }, [count])

  useEffect(() => {
    renderer.compute(computeInit)
  }, [renderer, computeInit])

  useFrame(() => {
    renderer.compute(computeUpdate)
  })

  // return <primitive object={mesh} />
  return (
    <instancedMesh args={[undefined, undefined, count]}>
      <boxGeometry args={[cellSize, cellSize, cellSize]} />
      <meshPhongNodeMaterial
        vertexNode={vertexNode()}
        // positionNode={positionBuffer.toAttribute()}
        colorNode={getColor()}
        // metalnessNode={uniforms.uMetalness}
        // roughnessNode={uniforms.uRoughness}
      />
    </instancedMesh>
  )
}

export default function App() {
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
        <directionalLight position={[5, 10, 0]} intensity={2} />
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
