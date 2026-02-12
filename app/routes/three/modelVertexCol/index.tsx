import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { asset } from '~/utils/asset'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

function Base() {
  // const { nodes, materials, animations } = useGLTF('/model/guangzhuzi.glb')
  const { nodes, materials, animations } = useGLTF('/model/guangzhuzi-transformed.glb')
  

  const geos: THREE.BufferGeometry[] = []
  ;(nodes.Scene as THREE.Scene).traverse((obj) => {
    if(obj instanceof THREE.Mesh && obj.geometry){
      geos.push(obj.geometry)
    }
  })

  const geo = mergeGeometries(geos)  


  const tex = useTexture(asset('/img/texture/particle/star_09.png'))
  const uniforms = {
    tex: new THREE.Uniform(tex)
  }

  return (
    <points geometry={geo} scale={.01} rotation-x={-Math.PI/2-.1}>
      <CustomShaderMaterial
        baseMaterial={THREE.PointsMaterial}
        uniforms={uniforms}
        // vertexColors={true}
        vertexShader={vertex}
        fragmentShader={fragment}
        size={.02}
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
