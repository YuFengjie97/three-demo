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
import Earth from "./Eearth";
import BaseContext from "./baseContext";

function Base() {
  const pane = new Pane();
  const colSeed = useMemo(() => uniform(vec3(3, 2, 1)), []);

  useEffect(() => {
    pane.addBinding(colSeed, "value", { min: 0, max: 20 });
  }, []);

  return (
    <BaseContext value={{ pane, colSeed }}>
      <Earth />
    </BaseContext>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={0.1} />
      {/* <hemisphereLight args={[0xff0000, 0x00ff00]} intensity={1}/> */}
      <directionalLight position={[-10, 10, 10]} intensity={1.1} />
      <axesHelper args={[10]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        {/* <WebGPUEffects /> */}
        <Environment background blur={0.4} path={asset("/img/skybox/sky_98_cubemap_2k")} />
      </Suspense>
    </WebGPUCanvas>
  );
}
