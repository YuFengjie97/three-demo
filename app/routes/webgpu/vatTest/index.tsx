import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  uniformArray,
  ceil,
  distance,
  billboarding,
  vertexIndex,
  Loop,
  Discard,
  frameId,
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
import { useMouseRay } from "~/hook/useMouseRay";
import { LineGeometry, MeshSurfaceSampler } from "three/examples/jsm/Addons.js";
import mitt from "mitt";

function Base() {
  const frameCount = uniform(0);
  const vatFrames = uniform(100)

  useFrame((_,delta) => {
    frameCount.value += delta * 30;
  });

  const { nodes, materials } = useGLTF(asset("/model/vatTest/cube.glb"));
  // @ts-ignore
  const geo = nodes.cube_vat.geometry as THREE.BufferGeometry;
  console.log(geo);

  const vat = useTexture(asset("/model/vatTest/cube_vat.png"));
  vat.minFilter = vat.magFilter = THREE.NearestFilter;
  vat.generateMipmaps = false;


  const { posNode, norNode, colNode } = useMemo(() => {

    const posNode = Fn(() => {
      const u = uv(1).x;
      const currentFrame = float(frameCount).mod(vatFrames).floor();
      const vPos = currentFrame.add(0.5).div(vatFrames.mul(2));
      const posOffset = texture(vat, vec2(u, vPos)).rgb;
      return positionLocal.add(posOffset)
    })();

    const norNode = Fn(() => {
      const u = uv(1).x;
      const currentFrame = float(frameCount).mod(vatFrames).floor();
      const vPos = currentFrame.add(0.5).div(vatFrames.mul(2));

      const rawNormal = texture(vat, vec2(u, vPos.add(.5))).rgb;
      const decodedNormal = rawNormal.mul(2.0).sub(1.0).normalize();
      return decodedNormal
    })()

    const colNode = Fn(() => {
      return norNode
    })()

    return { posNode, norNode, colNode };
  }, [vat]); // 这里的依赖项加上 vat 确保纹理加载后更新

  return (
    <mesh geometry={geo}>
      <meshNormalNodeMaterial positionNode={posNode}  colorNode={colNode}/>
    </mesh>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={0.4} />
      {/* <axesHelper args={[20]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <Environment
          background
          blur={0.4}
          backgroundIntensity={0.1}
          path={asset("/img/skybox/sky_98_cubemap_2k")}
        />
      </Suspense>
    </WebGPUCanvas>
  );
}
