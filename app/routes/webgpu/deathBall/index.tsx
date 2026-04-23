import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo } from "react";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  abs,
  asin,
  atan,
  cross,
  deltaTime,
  dot,
  float,
  floor,
  Fn,
  fract,
  fwidth,
  hash,
  If,
  instancedArray,
  instanceIndex,
  length,
  mat3,
  max,
  min,
  mix,
  mx_noise_float,
  mx_noise_vec3,
  mx_noise_vec4,
  normalLocal,
  oneMinus,
  PI,
  positionLocal,
  pow,
  pow3,
  rotateUV,
  select,
  smoothstep,
  step,
  storage,
  texture,
  time,
  TWO_PI,
  uniform,
  uv,
  varying,
  vec2,
  cos,
  vec3,
  vec4,
  pass,
  acos,
  sin,
  sqrt,
  hue,
  attribute,
  transmission,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, palette, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { Pane } from "tweakpane";

let pane: Pane

function Base(){
  const {camera, scene} = useThree()
  // scene.background = new THREE.Color(0xbadc58)
  camera.position.set(0,0,12)


  const dirLig = new THREE.DirectionalLight()
  dirLig.position.set(0,0,10)
  dirLig.intensity = 4
  const potLig = new THREE.PointLight()
  potLig.intensity = 4
  scene.add(dirLig)
  scene.add(potLig)


  const { nodes } = useGLTF(asset('/model/deathBall-transformed.glb'))
  
  // @ts-ignore
  const geo = nodes.ball2.geometry as THREE.BufferGeometry
  console.log(geo);

  const mat = useMemo(() => {
    const facePos = attribute<'vec3'>('_facepos', 'vec3')
    const faceType = attribute<'float'>('_facetype', 'float')
    
    const uf = {
      noiseSpeed: uniform(float(.4)),
      colorSeed: uniform(vec3(3,2,1)),

      clearcoat: uniform(float(.6)),
      clearcoatRoughness: uniform(float(.3)),

      roughness: uniform(float(.1)),
      metalness: uniform(float(.6)),
      ior: uniform(float(1.)),
      transmission: uniform(float(.6)),

      bloomUp: uniform(float(0))
    }

    const vCol = varying(vec3(0))
    const positionNode = Fn(() => {

      const col = sin3(uf.colorSeed.add(     faceType.mul(2.4)    .add(dot(facePos, vec3(.3)))    )).mul(.5).add(.5)
      // col.assign(mix(col, vec3(0), smoothstep(-1.,1.,mx_noise_float(facePos.mul(2)))))

      const bloomUp = step(0.,mx_noise_float(facePos)).mul(uf.bloomUp).add(1)

      vCol.assign(col.mul(bloomUp))

      return positionLocal
    })()

    const colorNode = Fn(() => {
      return vec4(vCol, .5)
    })()


    return {colorNode, positionNode, uf}
  }, [])

  useEffect(() => {
    pane = new Pane()
    pane.addBinding(mat.uf.colorSeed, "value", { label: "colorSeed", min: -10., max: 10 });
    
    const f1 = pane.addFolder({title: 'material'})
    f1.addBinding(mat.uf.metalness, "value", { label: "metalness", min:  0, max: 1 });
    f1.addBinding(mat.uf.roughness, "value", { label: "roughness", min:  0, max: 1 });
    f1.addBinding(mat.uf.ior, "value", { label: "ior", min: 0., max: 3});
    f1.addBinding(mat.uf.transmission, "value", { label: "transmission", min:  0, max: 1 });

    const f2 = pane.addFolder({title: 'light'})
    f2.addBinding(dirLig, "intensity", { label: "direction", min:  0, max: 10 });
    f2.addBinding(potLig, "intensity", { label: "point", min:  0, max: 10 });

    pane.addBinding(mat.uf.bloomUp, "value", { label: "bloomUp", min:  0, max: 10 });
  },[])
  
  return(
    <mesh geometry={geo} rotation-x={Math.PI/2}>
      <meshPhysicalNodeMaterial
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        side={THREE.DoubleSide}
        // clearcoatNode={mat.uf.clearcoat}
        // clearcoatRoughnessNode={mat.uf.clearcoatRoughness}
        

        roughnessNode={mat.uf.roughness}
        metalnessNode={mat.uf.metalness}
        iorNode={mat.uf.ior}
        transmissionNode={mat.uf.transmission}

        // transparent={true}
        // depthWrite={false}
        // blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// function Skybox(){
//   const map = useTexture(asset('/img/skybox/76_74268d539f6e2f2f74ef2e7aab07a03f_file.jpg'))
//   return (
//     <mesh>
//       <sphereGeometry args={[50,32,16]} />
//       <meshBasicMaterial 
//         map={map}
//         side={THREE.DoubleSide}
//       />
//     </mesh>
//   )
// }


function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();
  gl.toneMapping = THREE.NeutralToneMapping

  const {renderPipeline, bloomPass} = useMemo(() => {
    const renderer = gl as unknown as THREE.WebGPURenderer;
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, .1, 0.1, 1);
    renderPipeline.outputNode = scenePassColor.add(bloomPass);


    return {renderPipeline, bloomPass};
  }, [gl, scene, camera]);

  useEffect(() => {
    const f = pane.addFolder({title: 'bloom'})
    f.addBinding(bloomPass.strength, 'value', {label: 'strength', min:0, max: 1})
    f.addBinding(bloomPass.radius, 'value', {label: 'radius', min:0, max: 1})
    f.addBinding(bloomPass.threshold, 'value', {label: 'threshold', min:0, max: 1})
  }, [])



  // 接管渲染，优先级设为 1 覆盖默认渲染
  useFrame(() => {
    renderPipeline.render();
  }, 1);

  return null;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={.1}/>
      {/* <pointLight intensity={4}/>
      <directionalLight position={[0, 0, 10]} intensity={4.1} /> */}
      {/* <directionalLight position={[0, 0, -10]} intensity={3.1} /> */}
      {/* <axesHelper args={[10]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <WebGPUEffects />
        {/* <Skybox /> */}
        <Environment background blur={0.4} path={asset("/img/skybox/sky_98_cubemap_2k")} />
      </Suspense>
    </WebGPUCanvas>
  );
}
