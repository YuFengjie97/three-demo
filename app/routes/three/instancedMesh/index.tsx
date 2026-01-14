import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'

// instancedMesh
function SkullsMesh() {
  const model = useLoader(GLTFLoader, '/model/skull_downloadable/scene.gltf')
  const tex = useLoader(
    THREE.TextureLoader,
    '/img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png'
  )

  const geo = useMemo(() => {
    const geos: THREE.BufferGeometry[] = []
    model.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        // obj.updateWorldMatrix(true, false)
        // const g = obj.geometry.clone()
        // g.applyMatrix4(obj.matrixWorld)

        geos.push(obj.geometry)
      }
    })
    const geo = mergeGeometries(geos)
    return geo
  }, [model])

  const skullsRef = useRef<THREE.InstancedMesh>(null!)

  const count = 10
  const dummy = new THREE.Object3D()
  useEffect(() => {
    const range = 5
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * range
      const y = (Math.random() - 0.5) * range
      const z = (Math.random() - 0.5) * range
      dummy.position.set(x, y, z)
      dummy.rotation.x = Math.random() * 10
      dummy.rotation.y = Math.random() * 10
      dummy.rotation.z = Math.random() * 10

      let s = Math.random() + 0.1
      dummy.scale.set(s, s, s)

      dummy.updateMatrix()

      skullsRef.current.setMatrixAt(i, dummy.matrix)
    }
  }, [])

  return (
    <>
      <instancedMesh ref={skullsRef} args={[geo, undefined, count]}>
        <meshMatcapMaterial matcap={tex} />
      </instancedMesh>
    </>
  )
}

function Skulls() {
  const model = useLoader(GLTFLoader, '/model/skull_downloadable/scene.gltf')
  const geo = useMemo(() => {
    const geos: THREE.BufferGeometry[] = []
    model.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const geo = obj.geometry
        geos.push(geo)
      }
    })
    return mergeGeometries(geos)
  }, [model])

  const { count } = useControls({
    count: { value: 100, min: 1, max: 200, step: 1 },
  })

  const texs = [
    useLoader(
      THREE.TextureLoader,
      '/img/texture/matcap/2A2A2A_B3B3B3_6D6D6D_848C8C.png'
    ),
    useLoader(
      THREE.TextureLoader,
      '/img/texture/matcap/6D1616_E6CDBA_DE2B24_230F0F.png'
    ),
    useLoader(
      THREE.TextureLoader,
      '/img/texture/matcap/3B6E10_E3F2C3_88AC2E_99CE51.png'
    ),
    useLoader(
      THREE.TextureLoader,
      '/img/texture/matcap/3E95CC_65D9F1_A2E2F6_679BD4.png'
    ),
    useLoader(
      THREE.TextureLoader,
      '/img/texture/matcap/3E2335_D36A1B_8E4A2E_2842A5.png'
    ),
  ]

  const groupRef = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    groupRef.current.children.forEach(child => {
      child.rotation.x += .5 *delta
      child.rotation.y += .5 *delta
    })
  })

  return (
    <group ref={groupRef}>

      {[...Array(count)].map((item, ndx) => {
        
        const tex = texs[ndx % texs.length]
        const x = (Math.random() - 0.5) * 10
        const y = (Math.random() - 0.5) * 10
        const z = (Math.random() - 0.5) * 10

        const rx = Math.random() * 6
        const ry = Math.random() * 6
        const rz = Math.random() * 6

        const s = Math.random() * 0.5 + 0.2

        return (
          <mesh
            key={ndx}
            geometry={geo}
            position={[x, y, z]}
            rotation={[rx, ry, rz]}
            scale={s}
          >
            <meshMatcapMaterial matcap={tex} />
          </mesh>
        )
      })}
    </group>
  )
}

export default function main() {
  return (
    <>
      <div className='h-screen'>
        <Canvas>
          <Perf position='top-left'/>
          <ambientLight />
          <hemisphereLight args={['#74b9ff', '#fdcb6e', 1]} />
          <OrbitControls />
          {/* <axesHelper args={[10]} /> */}
          {/* <SkullsMesh /> */}
          <Skulls />
        </Canvas>
      </div>
    </>
  )
}
