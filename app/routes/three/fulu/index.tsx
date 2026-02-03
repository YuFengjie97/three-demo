import { createInstances, InstancedAttribute, Loader, OrbitControls, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { asset } from "~/utils/asset";
import * as THREE from 'three'
import CustomShaderMaterial from "three-custom-shader-material";
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useUniformTime } from "~/hook/useUniformTime";
import { Bloom, EffectComposer } from "@react-three/postprocessing";


const{random} = Math

interface FuLuAttribute {
  ndx: number
}

function FuLu(){
  const tex = useTexture(asset('/img/texture/fulu.jpg'))

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    uTex: new THREE.Uniform(tex)
  }


  const [Runes, Rune] = createInstances<FuLuAttribute>()
  const count = 200
  return (
    <Runes>
      <planeGeometry args={[1,1,10,10]} scale={2}/>
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.MeshBasicMaterial}
        side={THREE.DoubleSide}
        vertexShader={vertex}
        fragmentShader={fragment}
        // map={tex}
        transparent={true}
        alphaTest={.01}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
      <InstancedAttribute name='ndx' defaultValue={0} />

      {
        Array.from({length: count}).map((item, i) => {
          const pos = new THREE.Vector3(
            (random()-.5)*10,
            (random()-.5)*10,
            (random()-.5)*10,
          ) 
          return (
            <Rune key={i} ndx={i} position={pos}/>
          )
        })
      }
    </Runes>
  )
}

export default function(){
  return (
    <div className="h-screen">
      <Canvas>
        <axesHelper args={[10]}/>
        <OrbitControls />
        <ambientLight />

        <FuLu />

        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
      <Loader />
    </div>
  )
}