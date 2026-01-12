import { OrbitControls, Line } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import CustomShaderMaterialVanilla from 'three-custom-shader-material/vanilla'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import lineFragment from './lineFragment.glsl'

function MyPoints() {
  const uniforms: { [k in string]: THREE.Uniform } = {
    uTime: new THREE.Uniform(0),
    uDelta: new THREE.Uniform(0),
  }

  useFrame((state, delta) => {
    const { clock } = state
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uDelta.value = delta
  })

  const geo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 10)
    return geo
  }, [])
  // const { geo, points } = useMemo(() => {
  //   const geo = new THREE.IcosahedronGeometry(2, 10)
  //   // geo.setIndex(null)
  //   const positions = geo.getAttribute('position')
  //   const points: [number, number, number][] = []
  //   for (let i = 0; i < positions.count; i++) {
  //     const x = positions.getX(i)
  //     const y = positions.getY(i)
  //     const z = positions.getZ(i)
  //     points.push([x, y, z])
  //   }
  //   return { geo, points }
  // }, [])


  return (
    <>
      <lineSegments geometry={geo}>
        <CustomShaderMaterial
          uniforms={uniforms}
          baseMaterial={THREE.MeshBasicMaterial}
          vertexShader={vertex}
          fragmentShader={lineFragment}
          transparent={true}
        />
      </lineSegments>
      <points geometry={geo}>
        <CustomShaderMaterial
          baseMaterial={THREE.PointsMaterial}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          color={0xff0000}
          size={0.3}
          sizeAttenuation={true}
          transparent={true}
          blending={THREE.AdditiveBlending}
          alphaTest={0.01}
          depthWrite={false}
        />
      </points>
    </>
  )
}

export default function main() {
  return (
    <>
      <div className='h-screen'>
        <Canvas camera={{ position: [0, 0, 4] }}>
          <OrbitControls />
          <axesHelper args={[20]} />
          <ambientLight />

          <MyPoints />
        </Canvas>
      </div>
    </>
  )
}
