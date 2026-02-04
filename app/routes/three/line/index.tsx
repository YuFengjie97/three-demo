import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

const { random, floor } = Math

function Demo() {
  const { geo } = useMemo(() => {
    const count = 30
    const position = new Float32Array(count * 3)
    const centers = new Float32Array(count * 3)
    const vectors = [
      new THREE.Vector3( 1, 0, 0 ),
      new THREE.Vector3( 0, 1, 0 ),
      new THREE.Vector3( 0, 0, 1 )
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i*3
      position[i3+0] = (random() - 0.5) * 10
      position[i3+1] = (random() - 0.5) * 10
      position[i3+2] = (random() - 0.5) * 10
    
      centers[i3+0] = vectors[i%3].x
      centers[i3+1] = vectors[i%3].y
      centers[i3+2] = vectors[i%3].z
    }
    
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geo.setAttribute('aCenter', new THREE.BufferAttribute(centers, 3))
    return { geo }
  }, [])

  return (
    <mesh geometry={geo}>
      <CustomShaderMaterial
        baseMaterial={THREE.MeshBasicMaterial}
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
      <Canvas>
        <ambientLight />
        <axesHelper args={[10]} />
        <OrbitControls />

        <Demo />
      </Canvas>
    </div>
  )
}
