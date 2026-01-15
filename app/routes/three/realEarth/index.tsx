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
  const texNor = useLoader(THREE.TextureLoader, '/img/texture/earth_2k/2k_earth_normal_map.jpg')
  const texSpe = useLoader(THREE.TextureLoader, '/img/texture/earth_2k/2k_earth_specular_map.jpg')
  

  const sunPos: [number, number, number] = [2, 0, 0]
  const sunRef = useRef<THREE.Mesh>(null!)

  const uniforms = useMemo(() => {
    return {
      ...uniformTime,
      uTexDay: new THREE.Uniform(texDay),
      uTexNight: new THREE.Uniform(texNight),
      uTexCloud: new THREE.Uniform(texCloud),
      uTexSpe: new THREE.Uniform(texSpe),
      uSunPos: new THREE.Uniform(new THREE.Vector3(...sunPos)),
      uCloudVal: new THREE.Uniform(0.2),
      uAtomsphereDayCol: new THREE.Uniform(new THREE.Color(0x00aaff)),
      uAtomsphereToNightCol: new THREE.Uniform(new THREE.Color(0xff6600)),
    }
  }, [])

  const { cloudVal, dayCol, toNightCol } = useControls({
    cloudVal: {
      value: uniforms.uCloudVal.value,
      min: 0,
      max: .4,
    },
    dayCol: { value: '#' + uniforms.uAtomsphereDayCol.value.getHexString() },
    toNightCol: {
      value: '#' + uniforms.uAtomsphereToNightCol.value.getHexString(),
    },
  })
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
