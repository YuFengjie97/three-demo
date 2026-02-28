import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { Canvas } from '@react-three/fiber'
import { Loader, OrbitControls } from '@react-three/drei'
import CustomShaderMaterial from 'three-custom-shader-material'
import { useUniformTime } from '~/hook/useUniformTime'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Perf } from 'r3f-perf'

function Plane() {
  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
  }

  const {geo} = useMemo(() => {
    const detail = 400
    const geo = new THREE.PlaneGeometry(1,1,detail, detail)
    geo.computeTangents()
    console.log(geo);
    
    return {geo}
  }, [])

  return (
    <mesh geometry={geo} scale={2} rotation-x={-Math.PI / 2}>
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.MeshStandardMaterial}
        vertexShader={vertex}
        fragmentShader={fragment}
        roughness={.1}
        metalness={.5}
      />
    </mesh>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [0, 6, 6] }}>
        {/* <Perf position='top-left'/> */}
        {/* <axesHelper args={[20]} /> */}
        <OrbitControls />
        <ambientLight />
        <Suspense fallback={null}>
          <pointLight position={[0,6,0]}  intensity={10}/>
          <Plane />
        </Suspense>

      </Canvas>
      <Loader/>
    </div>
  )
}
