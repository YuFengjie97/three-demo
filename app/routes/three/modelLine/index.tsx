import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import CustomShaderMaterial from 'three-custom-shader-material'
import * as THREE from 'three'
import { asset } from '~/utils/asset'
import { useMemo } from 'react'
import { LineMaterial, MeshSurfaceSampler } from 'three/examples/jsm/Addons.js'

const { PI } = Math

function Base() {
  const { nodes, materials } = useGLTF(asset('/model/iron_man-transformed.glb'))
  // @ts-ignore
  const geo = nodes.Object_3.geometry as THREE.BufferGeometry
  geo.setIndex(null)
  geo.setDrawRange(100, 1000)
  const posAttr = geo.getAttribute('position')
  const count = posAttr.count
  
  const position = posAttr.array

  const { curve, tubeGeo } = useMemo(() => {
    const sampleCount = 70000
    const sampleGap = 1
    const points: THREE.Vector3[] = []
    for (let i = 0; i < sampleCount; i++) {
      const ndx = i * sampleGap
      const ndx3 = ndx * 3
      if(ndx >= count) {
        break
      }
      
      const x = position[ndx3 + 0]
      const y = position[ndx3 + 1]
      const z = position[ndx3 + 2]
      points.push(new THREE.Vector3(x, y, z))
    }
    
    const curve = new THREE.CatmullRomCurve3(points)
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 2., 16)

    return { curve, tubeGeo }
  }, [count, position])


  return (
    <group rotation-x={-PI/2} scale={.002}>
      <line geometry={geo}>
        <lineBasicMaterial />
      </line>
      {/* <mesh geometry={tubeGeo}>
        <meshBasicMaterial />
      </mesh> */}

      {/* <points geometry={geo}>
        <CustomShaderMaterial baseMaterial={THREE.PointsMaterial} size={0.01} />
      </points> */}
    </group>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        <Perf />
        <axesHelper args={[10]} />
        <OrbitControls />
        <Base />
      </Canvas>
    </div>
  )
}
