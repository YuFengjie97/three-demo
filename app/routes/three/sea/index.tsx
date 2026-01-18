import { Canvas, useFrame } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import CustomShaderMaterial from 'three-custom-shader-material'
import { OrbitControls, useHelper } from '@react-three/drei'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useUniformTime } from '~/hook/useUniformTime'
import { Perf } from 'r3f-perf'

function CSM() {
  const geo = useMemo(() => {
    const baseGeo: THREE.BufferGeometry = new THREE.PlaneGeometry(10, 10, 300, 300)
    const geo = mergeVertices(baseGeo)
    geo.computeTangents()

    baseGeo.dispose()

    return geo
  }, [])

  const uniformTime = useUniformTime()

  const uniforms = useMemo(() => {
    return {
      ...uniformTime,
      uDepthCol: { value: new THREE.Color(0x161e43) },
      uSurfaceCol: { value: new THREE.Color(0x00dbff) },
    }
  }, [])
  const { depthCol, surfaceCol, metalness, roughness } = useControls({
    surfaceCol: '#' + uniforms.uSurfaceCol.value.getHexString(),
    depthCol: '#' + uniforms.uDepthCol.value.getHexString(),
    metalness: { value: 0.5, min: 0, max: 1 },
    roughness: { value: 0, min: 0, max: 1 },
  })

  useEffect(() => {
    uniforms.uDepthCol.value.set(depthCol)
    uniforms.uSurfaceCol.value.set(surfaceCol)
  }, [depthCol, surfaceCol])

  return (
    <>
      <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]}>
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
      <directionalLight ref={lightRef} position={[0, 2, 0]} />
    </>
  )
}

export default function main() {
  return (
    <>
      <div className='h-screen'>
        <Canvas camera={{ position: [0, 2, 4] }}>
          <Perf position='top-left' />
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
