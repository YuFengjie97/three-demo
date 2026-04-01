import { Loader, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import * as THREE from 'three/webgpu'
import {
  Fn, sin, dot, time, vec3, vec4,
  instanceIndex, instancedArray, uniform,
  mx_noise_vec3, positionGeometry,
  cameraProjectionMatrix, modelViewMatrix,
} from 'three/tsl'
import { useControls } from 'leva'
import { ResourceTracker } from '~/utils/resourceTracker'

function Base() {
  const rt = useMemo(() => new ResourceTracker(), [])

  // 1. 必须将 Uniforms 放入 useMemo，防止 React 重渲染时重新创建节点
  const uniforms = useMemo(() => ({
    uHeight: uniform(9),
    uNoiseScale: uniform(0.1),
    uColScale: uniform(2),
    uMetalness: uniform(0.5),
    uRoughness: uniform(0.5),
  }), [])

  // Leva 控制 Uniform 的 .value (这样不会触发组件 re-render 即可更新着色器)
  useControls({
    uHeight: { value: 9, min: 0.1, max: 40, step: 0.01, onChange: (v) => { uniforms.uHeight.value = v } },
    uNoiseScale: { value: 0.1, min: 0.01, max: 2, step: 0.01, onChange: (v) => { uniforms.uNoiseScale.value = v } },
    uColScale: { value: 2, min: 0.01, max: 5, step: 0.01, onChange: (v) => { uniforms.uColScale.value = v } },
    uMetalness: { value: 0.5, min: 0.01, max: 1, step: 0.01, onChange: (v) => { uniforms.uMetalness.value = v } },
    uRoughness: { value: 0.5, min: 0.01, max: 1, step: 0.01, onChange: (v) => { uniforms.uRoughness.value = v } },
  })

  // 2. 主体逻辑放入 useMemo
  const { mesh, computeInit, computeUpdate } = useMemo(() => {
    const size = 80
    const cellNum = 80
    const cellSize = (size / cellNum) * 0.8
    
    // 生成网格坐标后立即释放内存
    const geoBase = new THREE.PlaneGeometry(size, size, cellNum, cellNum)
    geoBase.rotateX(-Math.PI / 2)
    const position = geoBase.getAttribute('position')
    const count = position.count
    const positionArray = new Float32Array(position.array)
    geoBase.dispose() // <--- 重要：用完基础网格立刻清理

    const positionBuffer = instancedArray(positionArray, 'vec3')
    const heightBuffer = instancedArray(count, 'float')

    const computeInit = Fn(() => {
      heightBuffer.element(instanceIndex).assign(4)
    })().compute(count)

    const computeUpdate = Fn(() => {
      const idx = instanceIndex
      const h = mx_noise_vec3(positionBuffer.element(idx).mul(uniforms.uNoiseScale).add(time))
        .mul(0.5)
        .add(0.5)
        .mul(uniforms.uHeight)
      heightBuffer.element(idx).assign(h)
    })().compute(count)

    const sin3 = Fn(([v3]) => vec3(sin(v3.x), sin(v3.y), sin(v3.z)))

    const mat = new THREE.MeshStandardNodeMaterial()
    rt.track(mat)

    mat.colorNode = Fn(() => {
      const pos = positionBuffer.element(instanceIndex)
      const col = sin3(vec3(3, 2, 1).add(dot(sin3(pos), vec3(uniforms.uColScale)))).mul(0.5).add(0.5)
      return col
    })()
    
    mat.metalnessNode = uniforms.uMetalness
    mat.roughnessNode = uniforms.uRoughness

    mat.vertexNode = Fn(() => {
      const idx = instanceIndex
      const height = heightBuffer.element(idx)
      
      // 3. 修复变换矩阵的乘法顺序 (先自身缩放，再加全局位移)
      const pos = positionGeometry
        .add(vec3(0, cellSize / 2, 0)) // 步骤1: 坐标系原点移到底部
        .mul(vec3(1, height, 1))       // 步骤2: 基于底部进行 Y 轴高度缩放
        .add(positionBuffer.element(idx)) // 步骤3: 将缩放完的实例移动到它该在的网格位置

      return cameraProjectionMatrix.mul(modelViewMatrix.mul(vec4(pos, 1)))
    })()

    const geo = new THREE.BoxGeometry(cellSize, cellSize, cellSize)
    rt.track(geo)
    
    const mesh = new THREE.InstancedMesh(geo, mat, count)
    rt.track(mesh)

    return { mesh, computeInit, computeUpdate }
  }, [rt, uniforms]) // 依赖项加上 uniforms

  const renderer = useThree().gl as unknown as THREE.WebGPURenderer

  useEffect(() => {
    renderer.compute(computeInit)
    return () => {
      rt.dispose()
    }
  }, [renderer, computeInit, rt])

  useFrame(() => {
    renderer.compute(computeUpdate)
  })

  return <primitive object={mesh} />
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