import { createInstances, InstancedAttribute, Loader, OrbitControls, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { asset } from "~/utils/asset";
import * as THREE from 'three'
import CustomShaderMaterial from "three-custom-shader-material";
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useUniformTime } from "~/hook/useUniformTime";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense } from "react";


const{random, PI, cos, sin} = Math

interface FuLuAttribute {
  ndx: number
}

function FuLu(){
  const tex1 = useTexture(asset('/img/texture/fulu/1.jpg'))
  const tex2 = useTexture(asset('/img/texture/fulu/2.jpg'))
  const tex3 = useTexture(asset('/img/texture/fulu/3.jpg'))

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    uTex1: new THREE.Uniform(tex1),
    uTex2: new THREE.Uniform(tex2),
    uTex3: new THREE.Uniform(tex3),
  }


  const [Runes, Rune] = createInstances<FuLuAttribute>()
  const count = 1000
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
        // blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
      <InstancedAttribute name='ndx' defaultValue={0} />

      {
        Array.from({length: count}).map((item, i) => {
          const the = random() * PI
          const phi = random() * PI * 2.
          const r = random() * 5 + 3
          const x = r * sin(the) * cos(phi)
          const y = r * sin(the) * sin(phi)
          const z = r * cos(the)

          const pos = new THREE.Vector3(
            x,
            y,
            z,
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
      <Canvas camera={{position: [1,1,1]}}>
        <axesHelper args={[10]}/>
        <OrbitControls
          makeDefault 
          minPolarAngle={.5}
          maxPolarAngle={Math.PI-.5}
        />
        <ambientLight />

        <Suspense fallback={null}>
          <FuLu />
        </Suspense>

        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
      <Loader />
    </div>
  )
}