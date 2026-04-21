import { OrbitControls, useTexture } from "@react-three/drei";
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

function Base() {
  const {camera,scene} = useThree()
  camera.position.set(0,0,10)
  // scene.background = new THREE.Color(0x223322)

  const mapNoise1 = useTexture(asset('/img/texture/noise/Cracks 8 - 512x512.png'))
  const mapNoise2 = useTexture(asset('/img/texture/noise/Swirl 1 - 512x512.png'))
  const mapNoise3 = useTexture(asset('/img/texture/noise/Techno 5 - 512x512.png'))

  const mat = useMemo(() => {

    const uf = {
      fishNum: uniform(3),
      speed: uniform(1),
      col1: uniform(new THREE.Color(0xdbbc5b)),
      col2: uniform(new THREE.Color(0x5df54e)),
      col3: uniform(new THREE.Color(0x6cc3f5)),
      col4: uniform(new THREE.Color(0xe66ef2)),
    }


    const colorNode = Fn(() => {
      const n1 = texture(mapNoise2, uv()).r
      const uv2 = mix(uv(), vec2(n1), fract(time))
      const n2 = texture(mapNoise1, uv2).r

      const d = smoothstep(0.5,1,n2)

      const col = vec3(1,0,0)
      return vec4(col.mul(d),d)
    })()
    
    
    return {  uf , colorNode};
  }, []);


  const pane = new Pane();
  useEffect(() => {
    pane.addBinding(mat.uf.speed, "value", { label: "speed", min: 0, max: 20 });
    pane.addBinding(mat.uf.fishNum, "value", { label: "fishNum", min: 1, max: 4, step: 1 });
    
    return () => {
      pane.dispose();
    };
  }, []);

  return (
    <>
      <mesh>
        {/* <icosahedronGeometry args={[6,5]}/> */}
        {/* <torusKnotGeometry args={[6,1,100,6]}/> */}
        <boxGeometry args={[6,6,6]}/>
        <meshBasicNodeMaterial
          colorNode={mat.colorNode}
          side={THREE.DoubleSide}
          transparent={true}
          depthWrite={false}
          blendAlpha={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();
  // gl.toneMapping = THREE.AgXToneMapping


  const renderPipeline = useMemo(() => {
    const renderer = gl as unknown as THREE.WebGPURenderer;
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, 2.1, .5, .1);
    renderPipeline.outputNode = scenePassColor.add(bloomPass);

    return renderPipeline;
  }, [gl, scene, camera]);

  // 接管渲染，优先级设为 1 覆盖默认渲染
  useFrame(() => {
    renderPipeline.render();
  }, 1);

  return null;
}

export default function App() {
  return (
    <WebGPUCanvas>
      {/* <ambientLight intensity={1}/> */}
      {/* <directionalLight position={[0, 0, 20]} intensity={1.1} /> */}
      {/* <axesHelper args={[20]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        {/* <WebGPUEffects /> */}
      </Suspense>
    </WebGPUCanvas>
  );
}
