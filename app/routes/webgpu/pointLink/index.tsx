import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
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

function Base(){
  const { nodes } = useGLTF(asset('/model/ballAndLine-transformed.glb'))
  // @ts-ignore
  const geo = nodes.geo.geometry as THREE.BufferGeometry
  console.log(geo);

  const mat = useMemo(() => {
    const pos = attribute<'vec3'>('_pos', 'vec3')
    
    const uf = {

    }

    const positionNode = Fn(() => {

      const dir = mx_noise_vec3(pos.mul(1))
      const strength = smoothstep(0.,1.,mx_noise_float(pos.add(time)))

      return positionLocal.add(dir.mul(strength))
    })()

    const colorNode = Fn(() => {
      const col = sin3(vec3(3,2,1).add(dot(pos, vec2(2)))).mul(.5).add(.5)
      return vec4(col, 1)
    })()

    return {colorNode, positionNode}
  }, [])
  
  return(
    <mesh geometry={geo}>
      <meshBasicNodeMaterial
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        // roughness={.1}
        // metalness={.5}
        transparent={true}
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}


function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();
  // gl.toneMapping = THREE.AgXToneMapping

  const renderPipeline = useMemo(() => {
    const renderer = gl as unknown as THREE.WebGPURenderer;
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, .5, 0.1, .1);
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
      <ambientLight intensity={1}/>
      <pointLight intensity={10}/>
      {/* <directionalLight position={[0, 0, 20]} intensity={1.1} /> */}
      <axesHelper args={[10]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <WebGPUEffects />
      </Suspense>
    </WebGPUCanvas>
  );
}
