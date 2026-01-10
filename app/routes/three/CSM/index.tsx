import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls, useHelper, Environment } from '@react-three/drei'
import * as THREE from 'three'

const baseUrl = import.meta.env.BASE_URL

function RotateCube({ castShadow }: { castShadow: boolean }) {
  const boxRef = useRef<THREE.Mesh>(null!)

  useFrame((_state, delta) => {
    boxRef.current.rotation.y += delta * 1
    boxRef.current.rotation.x += delta * 1
  })

  const tex_matCap = useLoader(
    THREE.TextureLoader,
    baseUrl + 'img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png'
  )

  return (
    <>
      <mesh ref={boxRef} castShadow={castShadow} position={[4, 0, 0]}>
        <boxGeometry />
        {/* <meshBasicMaterial color={0xff0000} /> */}
        <meshMatcapMaterial matcap={tex_matCap} />
      </mesh>
    </>
  )
}

function DirectionLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null!)

  useFrame((state) => {
    const { clock } = state
    const t = clock.getElapsedTime()

    lightRef.current.position.x = Math.sin(t) * 2
    lightRef.current.position.z = Math.cos(t) * 2
  })

  useHelper(lightRef, THREE.DirectionalLightHelper, 1)

  return (
    <>
      <directionalLight
        ref={lightRef}
        position={[3, 3, 0]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
    </>
  )
}

function Plane() {
  return (
    <>
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshPhongMaterial color={0xffffff} />
      </mesh>
    </>
  )
}

export default function main() {
  const envHdrPath = baseUrl + 'img/env/hdr/sunny_rose_garden_1k.hdr'

  return (
    <>
      <div className='h-screen'>
        <Canvas
          shadows={{
            type: THREE.PCFShadowMap,
            enabled: true,
          }}
        >
          {/* <Environment preset="forest" background backgroundBlurriness={0.5} /> */}
          <Environment files={envHdrPath} background />
          {/* <perspectiveCamera /> */}
          <OrbitControls />
          <ambientLight intensity={1} />
          <DirectionLight />
          <axesHelper args={[20]} />

          <RotateCube castShadow={true} />
          <Plane />
        </Canvas>
      </div>
    </>
  )
}
