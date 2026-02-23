import { OrbitControls, PivotControls, Trail } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { asset } from '~/utils/asset'

function Trails() {
  const count = 100
  const tex = useLoader(THREE.TextureLoader, asset('/img/texture/matcap/3B6E10_E3F2C3_88AC2E_99CE51.png'))

  const mat = useMemo(() => {
    // const mat = new THREE.MeshNormalMaterial({ flatShading: true })
    const mat = new THREE.MeshMatcapMaterial({matcap: tex, flatShading: true})
    return mat
  }, [])
  const geo = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(1, 1)
    return geo
  }, [])

  const positions = useMemo(() => {
    const range = 5
    return [...Array(count)].map((item, ndx) => {
      const x = (Math.random() - 0.5) * range
      const y = (Math.random() - 0.5) * range
      const z = (Math.random() - 0.5) * range
      return new THREE.Vector3(x, y, z)
    })
  }, [])

  const groupRefs = useRef<THREE.Group[]>([])

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    groupRefs.current.forEach((item, ndx) => {
      item.rotation.x += delta * (2 * (ndx % 2 + 1) / 2 + 1)
      item.rotation.y += delta * (2 * (ndx % 2 + 1) / 2 + 1)

      // item.traverse(obj => {
      //   if(obj.name === 'ball') {
      //     obj.rotation.x += delta*10.
      //     obj.rotation.z += delta*10.
      //   }
      // })
    })
  })


  // const outGeoRef = useRef<THREE.OctahedronGeometry>(null!)
  // const outMatRef = useRef<THREE.MeshMatcapMaterial>(null!)

  return (
    <>
      {/* <octahedronGeometry ref={outGeoRef} args={[1,1]} />
      <meshMatcapMaterial ref={outMatRef} matcap={tex} /> */}
      {positions.map((item, ndx) => {
        return (
          <group key={ndx} ref={(el) => el && (groupRefs.current[ndx] = el)}>
            <Trail color={'#55efc4'} width={3} interval={1} length={2} attenuation={(w) => w}>
              <mesh name='ball' scale={0.2} position={item} geometry={geo} material={mat} />
            
            {/* <mesh scale={.2} position={item}> */}
              {/* <octahedronGeometry args={[1, 1]}/> */}
              {/* <meshBasicMaterial /> */}
            {/* </mesh> */}

            {/* <mesh scale={0.2} position={item} geometry={outGeoRef.current} material={outMatRef.current}></mesh> */}
            </Trail>
          </group>
        )
      })}
    </>
  )
}

export default function main() {
  return (
    <div className='h-screen'>
      <Canvas>
        {/* <Perf position='top-left' /> */}
        <OrbitControls makeDefault />
        <ambientLight />
        <pointLight />
        <Trails />
      </Canvas>
    </div>
  )
}
