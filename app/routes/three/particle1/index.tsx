import { OrbitControls, Point, Points, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import CustomShaderMaterial from 'three-custom-shader-material'
import { useUniformTime } from '~/hook/useUniformTime'
import { Perf } from 'r3f-perf'
import { useMemo } from 'react'
import { asset } from '~/utils/asset'

const {random, PI} = Math

function Base() {
  const uniformTime = useUniformTime()
  const uniforms = { ...uniformTime }
  // const count = 2
  // const positionBuffer = useMemo(() => {
  //   const position = new Float32Array(count*3)
  //   for(let i=0.;i<count;i++){
  //     const i3 = i*3
  //     position[i3+0] = (random()-.5)*10
  //     position[i3+1] = (random()-.5)*10
  //     position[i3+2] = (random()-.5)*10
  //   }
  //   return position
  // }, [count])

  const { nodes, materials } = useGLTF(asset('/model/skull-transformed.glb'))
  const positionBuffer = (nodes.Object_2.geometry as THREE.BufferGeometry).getAttribute('position').array
  

  return (
    <Points positions={positionBuffer} scale={2.} rotation-x={-PI/2}>
      <CustomShaderMaterial
        baseMaterial={THREE.PointsMaterial}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent={true}
        alphaTest={.2}
        depthWrite={false}
        size={.1}
      />
      {/* <Point position={[0,2,0]}/> */}
    </Points>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        {/* <Perf position='top-left'/> */}
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />
        <ambientLight />

        <Base />
      </Canvas>
    </div>
  )
}
