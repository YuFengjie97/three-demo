import { Loader, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { asset } from '~/utils/asset'
import { useControls } from 'leva'

const { random, floor, PI } = Math

function Demo() {
  const { nodes, materials } = useGLTF(asset('/model/skull-transformed.glb'))
  // 使用 useMemo 防止每次渲染都重新计算
  const processedGeo = useMemo(() => {
    // 1. 获取原始几何体
    // @ts-ignore
    let geo = nodes.Object_2.geometry

    // 2. 【关键步骤】转换为非索引几何体
    // 这会将共享顶点拆分，使三角形独立 (Vertex count 会变大)
    geo = geo.toNonIndexed()

    const count = geo.attributes.position.count
    const centers = new Float32Array(count * 3)

    // 3. 计算重心坐标 (现在的逻辑就是安全的了)
    for (let i = 0; i < count; i++) {
      // 0, 1, 2 -> (1,0,0), (0,1,0), (0,0,1)
      // 3, 4, 5 -> (1,0,0), (0,1,0), (0,0,1)
      // ...
      const vectorIndex = i % 3

      const i3 = i * 3
      if (vectorIndex === 0) {
        // (1, 0, 0)
        centers[i3] = 1
        centers[i3 + 1] = 0
        centers[i3 + 2] = 0
      } else if (vectorIndex === 1) {
        // (0, 1, 0)
        centers[i3] = 0
        centers[i3 + 1] = 1
        centers[i3 + 2] = 0
      } else {
        // (0, 0, 1)
        centers[i3] = 0
        centers[i3 + 1] = 0
        centers[i3 + 2] = 1
      }
    }

    geo.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3))

    return geo
  }, [nodes])

  const uniforms = {
    uThickness: new THREE.Uniform(2.)
  }

  const {thickness} = useControls({
    thickness: {
      value: uniforms.uThickness.value,
      min:.1,
      max: 10,
      // onChange(val) {
      //   uniforms.uThickness.value = val
      // }
    }
  })
  uniforms.uThickness.value = thickness



  return (
    <mesh geometry={processedGeo} rotation-x={-PI / 2} scale={2}>
      <CustomShaderMaterial
        baseMaterial={THREE.MeshBasicMaterial}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        side={THREE.DoubleSide}
        transparent={true}
      />
    </mesh>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{position: [0,0,0.1]}}>
        <ambientLight />
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />
        <Suspense fallback={null}>
          <Demo />
        </Suspense>

      </Canvas>
      <Loader/>
    </div>
  )
}
