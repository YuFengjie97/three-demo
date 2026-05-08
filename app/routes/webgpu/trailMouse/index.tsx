import { Environment, Html, OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useContext, useEffect, useMemo, useRef } from "react";
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
  mod,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { Pane } from "tweakpane";
import { useMouseRay } from "~/hook/useMouseRay";
import { sin3 } from "~/utils/tsl";

const mousePos = uniform(new THREE.Vector3(0, 0, 0));
const mouseDataLen = 200;
const frameCount = uniform(0);

function Plane() {
  const { rayCaster } = useMouseRay();

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;

    const intersect = rayCaster.intersectObject(meshRef.current);

    if (intersect.length > 0) {
      mousePos.value.copy(intersect[0].point);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial wireframe />
    </mesh>
  );
}

function Trail() {
  const mat = useMemo(() => {
    const mousePosHistoryBuffer = storage(
      // new THREE.BufferAttribute(new Float32Array(mouseDataLen * 3), 3),
      new THREE.StorageInstancedBufferAttribute(new Float32Array(mouseDataLen * 3), 3),
      "vec3",
      mouseDataLen,
    );

    const computedMouseHistory = Fn(() => {
      mousePosHistoryBuffer.element(frameCount).assign(mousePos);
    })().compute(1);

    const vCol = varying(vec3(0, 0, 0));

    const positionNode = Fn(() => {
      const h01 = positionLocal.y.add(0.5);

      const hIdx = mod(floor(h01.mul(mouseDataLen)).add(0), mouseDataLen);

      const pos = mousePosHistoryBuffer.element(hIdx).toVar();

      vCol.assign(sin(vec3(3,2,1).add(h01.mul(10))).mul(.5).add(.5));

      return positionLocal.add(pos);
    })();


    const colorNode = Fn(() => {
      return vCol;
    })();

    return { positionNode, colorNode, computedMouseHistory };
  }, []);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(mat.computedMouseHistory);
  });

  return (
    <mesh>
      <cylinderGeometry args={[0.1, 0.5, 1, 16, 50]} />
      <meshBasicNodeMaterial wireframe positionNode={mat.positionNode} colorNode={mat.colorNode} />
    </mesh>
  );
}

function Base() {
  useFrame(() => {
    frameCount.value = (frameCount.value + 1) % mouseDataLen;
  });

  return (
    <>
      <Plane />
      <Trail />
    </>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={0.5} />

      {/* <pointLight position={[0,7,0]} intensity={4}/>
      // <pointLight position={[0,0,0]} intensity={4}/> */}
      {/* <directionalLight position={[0, 0, 10]} intensity={4.1} /> */}
      {/* <directionalLight position={[0, 0, -10]} intensity={4.1} /> */}
      <axesHelper args={[10]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />

        {/* <Environment background blur={0.4} path={asset("/img/skybox/sky_98_cubemap_2k")} /> */}
      </Suspense>
    </WebGPUCanvas>
  );
}
