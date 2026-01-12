import { Canvas, useFrame } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import CustomShaderMaterial from 'three-custom-shader-material'
import { OrbitControls, useHelper } from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { metalness, roughness } from 'three/tsl'

function CSM() {
  const geo = useMemo(() => {
    let geo: THREE.BufferGeometry = new THREE.PlaneGeometry(10, 10, 200, 200)
    console.log(geo.attributes.position.count)
    geo = mergeVertices(geo)
    geo.computeTangents()
    console.log(geo)

    return geo
  }, [])

  const uniforms = {
    uTime: { value: 0 },
    uDelta: { value: 0 },
    uDepthCol: {value: new THREE.Color(0xff0000)},
    uSurfaceCol: {value: new THREE.Color(0x00ff00)}
  }
  useFrame((state, delta) => {
    const { clock } = state
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uDelta.value = delta
  })

  const {depthCol, surfaceCol} = useControls({
    surfaceCol: '#00ff00',
    depthCol: '#ff0000'
  })
  uniforms.uDepthCol.value.set(depthCol)
  uniforms.uSurfaceCol.value.set(surfaceCol)

  const {metalness, roughness} = useControls({
    metalness:{value: 0., min: 0., max: 1.},
    roughness: {value: 1, min: 0., max: 1.}
  })
  

  return (
    <>
      <mesh
        geometry={geo}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <CustomShaderMaterial
          baseMaterial={THREE.MeshPhysicalMaterial}
          vertexShader={vertex}
          fragmentShader={fragment}
          uniforms={uniforms}
          side={THREE.DoubleSide}
          // wireframe
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>
    </>
  )
}

function Light() {
  const lightRef = useRef<THREE.DirectionalLight>(null!)
  useHelper(lightRef, THREE.DirectionalLightHelper, 1)
  useFrame((state, delta) => {
    const { clock } = state
    const t = clock.getElapsedTime()
    lightRef.current.position.x = Math.cos(t) * 3
    lightRef.current.position.z = Math.sin(t) * 3
  })

  return (
    <>
      <directionalLight ref={lightRef} position={[0, 2, 0]} castShadow />
    </>
  )
}

export default function main() {
  return (
    <>
      <Leva />
      <div className='h-screen'>
        <Canvas
          shadows={{
            type: THREE.PCFSoftShadowMap,
            enabled: false,
          }}
          camera={{position: [0, 2, 4]}}
        >
          <ambientLight />
          <Light />
          <axesHelper args={[20]} />
          <OrbitControls />
          <CSM />
        </Canvas>
      </div>
    </>
  )
}
