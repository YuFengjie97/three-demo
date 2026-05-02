import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo } from "react";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  abs,
  int,
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
  vec3,
  vec4,
  pass,
  acos,
  sin,
  hue,
  transformedNormalWorld,
  rotate,
  mx_rotate3d,
  attribute,
  color,
  roughness,
  metalness,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, lookAt, lookAt2, palette, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { usePane } from "~/hook/usePane";
import { Pane } from "tweakpane";
import { godrays } from "three/examples/jsm/tsl/display/GodraysNode.js";
import { bilateralBlur } from "three/examples/jsm/tsl/display/BilateralBlurNode.js";
import { depthAwareBlend } from "three/examples/jsm/tsl/display/depthAwareBlend.js";
import Ground from './Groud'
import BaseContext from "./baseContext";


function Base(){
  const{camera, scene, gl} = useThree()
  camera.position.set(0,0,15)
  // scene.background = new THREE.Color(0x6ab04c)
  // gl.toneMapping = THREE.ACESFilmicToneMapping
  // gl.toneMappingExposure = .5

  const pane = new Pane()
  return (
    <BaseContext value={{pane, colSeed: uniform(vec3(3,2,1))}}>
      <Ground />
    </BaseContext>
  )
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={.1} />
      {/* <hemisphereLight args={[0xff0000, 0x00ff00]} intensity={1}/> */}
      <directionalLight position={[0, 0, 10]} intensity={1.1} />
      {/* <directionalLight position={[0, 0, -10]} intensity={.1} /> */}
      {/* <axesHelper args={[10]} /> */}
      <OrbitControls />
      <Base />
      {/* <WebGPUEffects /> */}
      <Environment background blur={.9} path={asset("/img/skybox/sky_98_cubemap_2k")} />
      {/* <Environment background blur={.9} files={asset("/img/hdr/potsdamer_platz_1k.hdr")} /> */}
    </WebGPUCanvas>
  );
}
