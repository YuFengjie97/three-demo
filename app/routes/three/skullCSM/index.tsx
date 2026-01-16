import { OrbitControls, useHelper, useMask } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { useEffect, useMemo, useRef } from 'react'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { useControls } from 'leva'
import { metalness } from 'three/tsl'
import { asset } from '~/utils/asset'

const uTime = new THREE.Uniform(0)
const uDelta = new THREE.Uniform(0.)

function Skull() {
  const model = useLoader(GLTFLoader, asset('/model/skull_downloadable/scene.gltf'))

  const uniforms = {
    uTime,
    uUseFSCol: new THREE.Uniform(1.),
  }

  const { metalness, roughness, color, useFSCol } = useControls({
    metalness: { value: 0, min: 0, max: 1 },
    roughness: { value: 0, min: 0, max: 1 },
    useFSCol: { value: uniforms.uUseFSCol.value > 0.5 },
    color: { value: '#ffff00', render: (get) => !get('useFSCol') },
  })

  type PhysicalCSM = CustomShaderMaterial<typeof THREE.MeshPhysicalMaterial> &
    THREE.MeshPhysicalMaterial

  const mat = useMemo(() => {
    const mat = new CustomShaderMaterial<typeof THREE.MeshPhysicalMaterial>({
      baseMaterial: THREE.MeshPhysicalMaterial,
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      metalness,
      roughness,
      color: new THREE.Color(color),
    }) as PhysicalCSM
    return mat
  }, [])

  useEffect(() => {
    model.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material = mat
      }
    })
  }, [])

  useEffect(() => {
    mat.metalness = metalness
    mat.roughness = roughness
    mat.color.set(color)
    mat.uniforms.uUseFSCol.value = useFSCol ? 1 : 0
  }, [metalness, roughness, color, useFSCol, mat])

  return (
    <>
      <primitive object={model.scene} />
    </>
  )
}

function Light() {
  const lightRef = useRef<THREE.DirectionalLight>(null!)
  useHelper(lightRef, THREE.DirectionalLightHelper, 1)
  useFrame((state, delta) => {
    const { clock } = state
    const t = clock.getElapsedTime()
    lightRef.current.position.x = Math.cos(t) * 2
    lightRef.current.position.z = Math.sin(t) * 2
  })

  const { intensity } = useControls({
    intensity: { value: 1, min: 0, max: 40 },
  })

  return (
    <directionalLight
      ref={lightRef}
      position={[2, 1, 2]}
      intensity={intensity}
    ></directionalLight>
  )
}

function UTime() {
  useFrame((state, delta) => {
    const { clock } = state
    uTime.value = clock.getElapsedTime()
    uDelta.value = delta
  })
  return null
}

export default function main() {
  return (
    <div className='h-screen'>
      <Canvas>
        <UTime />
        <axesHelper args={[10]} />
        <OrbitControls />

        <ambientLight />
        <Light />
        <Skull />
      </Canvas>
    </div>
  )
}
