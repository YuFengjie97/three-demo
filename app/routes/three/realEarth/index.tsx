import { Loader, OrbitControls, useHelper } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useControls } from 'leva'

import atomVertex from './atomVertex.glsl'
import atomFragment from './atomFragment.glsl'
import { useUniformTime } from '~/hook/useUniformTime'
import { asset } from '~/utils/asset'



function Earth() {
  const texDay = useLoader(
    THREE.TextureLoader,
    asset('/img/texture/earth_2k/2k_earth_daymap.jpg')
  )
  const texNight = useLoader(
    THREE.TextureLoader,
    asset('/img/texture/earth_2k/2k_earth_nightmap.jpg')
  )
  const texCloud = useLoader(
    THREE.TextureLoader,
    asset('/img/texture/earth_2k/2k_earth_clouds.jpg')
  )
  useEffect(() => {
    texDay.colorSpace = THREE.SRGBColorSpace
    texNight.colorSpace = THREE.SRGBColorSpace
    texCloud.colorSpace = THREE.SRGBColorSpace
    texDay.anisotropy = 8
    texNight.anisotropy = 8
    texCloud.anisotropy = 8
  }, [texDay,texNight,texCloud])
  
  const texSpe = useLoader(
    THREE.TextureLoader,
    asset('/img/texture/earth_2k/2k_earth_specular_map.jpg')
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
  const sunSph = useMemo(() => new THREE.Spherical(), [])
  const sunPos = useMemo(() => new THREE.Vector3(), [])
  
  const uniformTime = useUniformTime()

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
    // sunRef.current.position.set(...sunPos.toArray())
    // uniforms.uSunPos.value.set(...sunPos.toArray())
    sunRef.current.position.copy(sunPos)
    uniforms.uSunPos.value.copy(sunPos)
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
          {/* <Perf position='top-left' showGraph /> */}
          <OrbitControls />
          <ambientLight />
          {/* <axesHelper args={[10]} /> */}

          <Suspense fallback={null}>
            <Earth />
          </Suspense>

        </Canvas>
        <Loader/>
      </div>
    </>
  )
}
