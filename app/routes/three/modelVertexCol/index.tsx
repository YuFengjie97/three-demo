import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { asset } from '~/utils/asset'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'

function Base() {
  const { nodes, materials } = useGLTF(
    asset('/model/plane-pic-vertexCol-transformed.glb'),
  )
  // @ts-ignore
  const geo = nodes.plane.geometry
  console.log(geo)

  const tex = useTexture(asset('/img/texture/particle/star_09.png'))
  const uniforms = {
    tex: new THREE.Uniform(tex)
  }

  return (
    // <mesh geometry={geo} rotation-x={Math.PI/2.}>
    //   <meshBasicMaterial vertexColors={true}/>
    // </mesh>
    <points geometry={geo} scale={2.} rotation-x={Math.PI/2.}>
      <CustomShaderMaterial
        baseMaterial={THREE.PointsMaterial}
        uniforms={uniforms}
        // vertexColors={true}
        vertexShader={vertex}
        fragmentShader={fragment}
        size={.05}
        transparent={true}
        // alphaTest={.1}
        // depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        <axesHelper args={[10]} />
        <OrbitControls />

        <Base />
      </Canvas>
    </div>
  )
}
