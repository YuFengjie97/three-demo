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
  vec3,
  vec4,
  pass,
  acos,
  sin,
  hue,
  transformedNormalWorld,
  rotate,
  mx_rotate3d,
  positionGeometry,
  normalGeometry,
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

type Vector3 = [number, number, number];

interface GoldbergFace {
  pos: Vector3;
  type: "pentagon" | "hexagon";
  tangent: Vector3;
}


function Cloud() {
  const {camera} = useThree()
  camera.position.set(0,10,20)

  const { nodes } = useGLTF(asset('/model/hexagonSphereMesh.glb'))
  console.log(nodes);
  
  // @ts-ignore
  const geo = nodes.ball.geometry as THREE.BufferGeometry
  console.log(geo);
  
  const positionArr = geo.getAttribute('position').array as Float32Array
  const normalArr = geo.getAttribute('normal').array as Float32Array
  
  

  const mat = useMemo(() => {

    const positionNode = Fn(() => {
      const h = mx_noise_vec3(normalLocal.mul(.4))
      const offset = h.mul(normalGeometry)
      return positionLocal.add(offset)
    })()

    const colorNode = Fn(() => {
      const pos = positionLocal.toVar()
      // const nor = normalLocal.toVar()
      const col = sin3(vec3(3, 2, 1).add(pos))
        .mul(0.5)
        .add(0.5);
      return col;
    })();


    return { positionNode, colorNode };
  }, []);
  return (
    <mesh args={[geo]}>
      {/* <cylinderGeometry args={[1, 1, 0.5, 6]} /> */}
      <meshStandardNodeMaterial
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        // side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Base() {
  return <Cloud />;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 10]} intensity={1.1} />
      <axesHelper args={[20]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
      </Suspense>
    </WebGPUCanvas>
  );
}
