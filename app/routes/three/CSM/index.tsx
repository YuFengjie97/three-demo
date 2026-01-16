import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { OrbitControls, useHelper, Environment } from '@react-three/drei'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useControls, Leva } from 'leva'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { asset } from '~/utils/asset'

function RotateCube({ castShadow }: { castShadow: boolean }) {
  const boxRef = useRef<THREE.Mesh>(null!)

  useFrame((_state, delta) => {
    boxRef.current.rotation.y += delta * 1
    boxRef.current.rotation.x += delta * 1
  })

  const tex_matCap = useLoader(
    THREE.TextureLoader,
    asset('/img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png')
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

  const { intensity } = useControls({
    intensity: {
      value: 1,
      min: 0,
      max: 10,
      step: 0.1,
    },
  })

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
        intensity={intensity}
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

function CSM() {
  const csmRef = useRef(null!)

  const uniforms = {
    uTime: { value: 0 },
    uDelta: { value: 0 },
    uUseNoise4D: {value: true}
  }

  useFrame((state, delta) => {
    const { clock } = state
    const elapsed = clock.getElapsedTime()
    uniforms.uDelta.value = delta
    uniforms.uTime.value = elapsed
  })

  const matControl = useControls({
    wireframe: false,
    flatShading: false,
    metalness: { value: 0, min: 0, max: 1 },
    roughness: { value: 0.2, min: 0, max: 1 },
    ior: { value: 1.5, min: 0, max: 2.33 },
    transparent: false,
    opacity: { value: 0, min: 0, max: 1, render: (get) => get('transparent') },
    transmission: { value: 0, min: 0, max: 1 },
  })

  const { detail } = useControls({
    detail: { value: 20, min: 4, max: 40, step: 1, order: -2 },
  })

  const geo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, detail)
    const merged = mergeVertices(geo)
    merged.computeTangents()
    return merged
  }, [detail])

  const vertexCount = geo.attributes.position.count
  const [, set] = useControls(() => ({
    vertices: {
      value: 0,
      disabled: true,
      order: -1,
    },
  }))
  useEffect(() => {
    set({ vertices: vertexCount })
  }, [vertexCount])


  const { shape } = useControls({
    shape: {
      options: {
        turbulance: false,
        noise4D: true,
      },
      value: true,
    },
  })
  uniforms.uUseNoise4D.value = shape

  return (
    <>
      <mesh geometry={geo}>
        <CustomShaderMaterial
          baseMaterial={THREE.MeshPhysicalMaterial}
          ref={csmRef}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          wireframe={matControl.wireframe}
          metalness={matControl.metalness}
          roughness={matControl.roughness}
          ior={matControl.ior}
          transparent={matControl.transparent}
          opacity={matControl.opacity}
          transmission={matControl.transmission}
          // flatShading={flatShading}
        ></CustomShaderMaterial>
      </mesh>
    </>
  )
}

export default function main() {
  const envHdrPath = asset('/img/env/hdr/sunny_rose_garden_1k.hdr')

  return (
    <>
      <Leva />
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

          <CSM />
        </Canvas>
      </div>
    </>
  )
}
