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

function Base() {
  const {camera} = useThree()
  camera.position.set(0,10,20)

  const { nodes } = useGLTF(asset("/model/hexagonPlane-transformed.glb"));
  // @ts-ignore
  const baseGeo: THREE.BufferGeometry = nodes.base.geometry;
  const posAttr = baseGeo.getAttribute("position");
  const posArr = new Float32Array(posAttr.array);
  
  const count = posAttr.count;
  console.log(posArr, count);
  

  const { nodes: n } = useGLTF(asset("/model/hexagon-transformed.glb"));
  // @ts-ignore
  const geo: THREE.BufferGeometry = n.hexagon.geometry;
  console.log(geo);
  

  const mat = useMemo(() => {
    const posBuffer = instancedArray(posArr, 'vec3')

    
    
    const positionNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar()
      const mask = step(0, mx_noise_float(pos.mul(vec3(.1,.1,.2)).add(time.mul(.1))))
      let scale = smoothstep(0, 1, mx_noise_float(pos.mul(vec3(.2,.2,.2)).add(time)))

      return positionLocal.mul(mask).add(pos)
    })()

    
    const colorNode = Fn(() => {
      return vec3(1,0,0)
    })()
    return {positionNode, colorNode}
  }, [])

  return (
    <instancedMesh args={[geo, undefined, count]} rotation-x={-Math.PI/2}>
    {/* <instancedMesh args={[geo, undefined, count]}> */}
      <meshStandardNodeMaterial 
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        roughness={.9}
        metalness={.1}
      />
    </instancedMesh>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={0.4} />
      {/* <hemisphereLight args={[0xff0000, 0x00ff00]} intensity={1}/> */}
      <pointLight intensity={4} />
      <directionalLight position={[-10, 10, 10]} intensity={4.1} />
      <directionalLight position={[10, -10, -10]} intensity={2.5} />
      <axesHelper args={[20]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        {/* <WebGPUEffects /> */}
        {/* <Environment background blur={0.4} path={asset("/img/skybox/sky_98_cubemap_2k")} /> */}
      </Suspense>
    </WebGPUCanvas>
  );
}
