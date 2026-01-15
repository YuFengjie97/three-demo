import { OrbitControls, useHelper } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import CustomShaderMaterial from 'three-custom-shader-material'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useEffect, useMemo, useRef } from 'react'
import { useControls } from 'leva'

import atomVertex from './atomVertex.glsl'
import atomFragment from './atomFragment.glsl'

const uniformTime = {
  uTime: new THREE.Uniform(0),
  uDelta: new THREE.Uniform(0),
}

function UniformTime() {
  useFrame((state, delta) => {
    const { clock } = state
    uniformTime.uTime.value = clock.getElapsedTime()
    uniformTime.uDelta.value = delta
  })
  return <></>
}

function Earth() {
  const texDay = useLoader(
    THREE.TextureLoader,
    '/img/texture/earth_2k/2k_earth_daymap.jpg'
  )
  const texNight = useLoader(
    THREE.TextureLoader,
    '/img/texture/earth_2k/2k_earth_nightmap.jpg'
  )
  const texCloud = useLoader(
    THREE.TextureLoader,
    '/img/texture/earth_2k/2k_earth_clouds.jpg'
  )
  texDay.colorSpace = THREE.SRGBColorSpace
  texNight.colorSpace = THREE.SRGBColorSpace
  texCloud.colorSpace = THREE.SRGBColorSpace
  texDay.anisotropy = 8
  texNight.anisotropy = 8
  texCloud.anisotropy = 8
  const texSpe = useLoader(
    THREE.TextureLoader,
    '/img/texture/earth_2k/2k_earth_specular_map.jpg'
  )

  const { r, phi, theta, cloudVal, dayCol, toNightCol } = useControls({
    r: { value: 1.5, min: 1, max: 3 },
    phi: { value: 1.57, min: -3.15, max: 3.15 },
    theta: { value: 1.57, min: -3.15, max: 3.15 },
    cloudVal: {
      value: .2,
      min: 0,
      max: 0.4,
    },
    dayCol: { value: '#00aaff' },
    toNightCol: { value: '#ff6600'},
  })
  
  const sunRef = useRef<THREE.Mesh>(null!)
  const sunSph = new THREE.Spherical().set(r, phi, theta)
  const sunPos = new THREE.Vector3().setFromSpherical(sunSph)
  

  const uniforms = useMemo(() => {
    return {
      ...uniformTime,
      uTexDay: new THREE.Uniform(texDay),
      uTexNight: new THREE.Uniform(texNight),
      uTexCloud: new THREE.Uniform(texCloud),
      uTexSpe: new THREE.Uniform(texSpe),
      uSunPos: new THREE.Uniform(sunPos),
      uCloudVal: new THREE.Uniform(cloudVal),
      uAtomsphereDayCol: new THREE.Uniform(new THREE.Color(dayCol)),
      uAtomsphereToNightCol: new THREE.Uniform(new THREE.Color(toNightCol)),
    }
  }, [])


  useEffect(() => {
    sunSph.set(r, phi, theta)
    sunPos.setFromSpherical(sunSph)
    sunRef.current.position.set(...sunPos.toArray())
    uniforms.uSunPos.value.set(...sunPos.toArray())
  }, [r, phi, theta])


  useEffect(() => {
    uniforms.uCloudVal.value = cloudVal
    uniforms.uAtomsphereDayCol.value.set(dayCol)
    uniforms.uAtomsphereToNightCol.value.set(toNightCol)
  }, [cloudVal, dayCol, toNightCol])

  const earthRef = useRef<THREE.Mesh>(null!)
  useFrame((_, delta) => {
    earthRef.current.rotation.y += delta * 0.1
  })

  const geo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 20)
    return geo
  }, [])

  return (
    <>
      {/* 太阳 */}
      <mesh ref={sunRef} position={sunPos}>
        <icosahedronGeometry args={[0.1, 10]} />
        <meshBasicMaterial color={0xff0000} />
      </mesh>

      {/* 地球 */}
      <mesh ref={earthRef} geometry={geo}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
        />
      </mesh>

      {/* 透明大气层 */}
      <mesh geometry={geo} scale={1.05}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={atomVertex}
          fragmentShader={atomFragment}
          side={THREE.BackSide}
          transparent
        />
      </mesh>
    </>
  )
}

export default function main() {
  return (
    <>
      <div className='h-screen'>
        <Canvas
          camera={{
            position: [0, 0, 2],
            fov: 75,
            near: 0.1,
            far: 10,
          }}
        >
          <UniformTime />
          <Perf position='top-left' showGraph />
          <OrbitControls />
          <ambientLight />
          <axesHelper args={[10]} />

          <Earth />
        </Canvas>
      </div>
    </>
  )
}
