import { Loader, OrbitControls } from '@react-three/drei'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { Suspense } from 'react'
import CustomShaderMaterial from 'three-custom-shader-material'
import * as THREE from 'three'
import vs from './vs.glsl'
import fs from './fs.glsl'
import { useUniformTime } from '~/hook/useUniformTime'

function Base() {
  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    uMouse: new THREE.Uniform(new THREE.Vector2(0, 0)),
  }

  function handlePointerMove(e: ThreeEvent<PointerEvent>) {
    const { uv } = e
    if (uv) {
      const { x, y } = uv
      uniforms.uMouse.value.set(x, y)
    }
  }

  return (
    <mesh onPointerMove={handlePointerMove}>
      <planeGeometry args={[100, 100, 1, 1]} />
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.MeshBasicMaterial}
        vertexShader={vs}
        fragmentShader={fs}
        side={THREE.DoubleSide}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
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
