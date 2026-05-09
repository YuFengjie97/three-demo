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
  billboarding,
  cameraPosition,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { Pane } from "tweakpane";
import { useMouseRay } from "~/hook/useMouseRay";

const mousePos = uniform(new THREE.Vector3(0, 0, 0));
const mouseDataLen = 60*3; // 存储鼠标位置的数据长度, 也可以理解为帧数量,帧速度
const frameCount = uniform(0);

function Surface() {
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
    <mesh ref={meshRef} visible={false}>
      {/* <planeGeometry args={[20, 20]} /> */}
      <icosahedronGeometry args={[20,2]}/>
      <meshBasicMaterial wireframe side={THREE.DoubleSide}/>
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
    const vH = varying(float(0))


    const positionNode = Fn(() => {
    const h01 = positionLocal.y.add(0.5);
    
    // --- 1. 定位索引 ---
    const latestIdx = frameCount.sub(1).add(mouseDataLen).mod(mouseDataLen);
    const hIdx = latestIdx.sub(floor(h01.mul(mouseDataLen - 1))).add(mouseDataLen).mod(mouseDataLen);
    
    // 获取当前点和下一个点（用于计算方向）
    const pos = mousePosHistoryBuffer.element(hIdx).toVar();
    const nextIdx = hIdx.add(1).mod(mouseDataLen); // 采样前一个历史点来计算切线
    const nextPos = mousePosHistoryBuffer.element(nextIdx).toVar();

    // --- 2. 构建坐标系 (LookAt 逻辑) ---
    // 切线：指向下一个点的方向
    const T = (pos.sub(nextPos)).normalize(); 
    
    // 副法线：为了让侧面面向相机，我们利用相机位置
    // cameraPosition 是 Three.js 默认提供的 Uniform 节点
    const dirToCamera = (cameraPosition.sub(pos)).normalize();
    const B = (cross(T, dirToCamera)).normalize();
    
    // 法线：垂直于 T 和 B
    const N = (cross(B, T)).normalize();

    // --- 3. 变换顶点 ---
    // 我们只想要圆柱体的横截面坐标 (x, z)，原本高度 y 是指向切线的
    // positionLocal.x 沿着副法线 B 偏移
    // positionLocal.z 沿着法线 N 偏移
    // 注意：我们将原本的 Y 轴完全替换为路径位置，不保留 positionLocal.y
    const vOffset = B.mul(positionLocal.x).add(N.mul(positionLocal.z));

    vCol.assign(sin(vec3(3,2,1).add(h01.mul(10))).mul(.5).add(.5))

    return pos.add(vOffset);
})();

  

    const colorNode = Fn(() => {
      // return vec3(1,0,0)
      const fade = smoothstep(.5,0.,vH);
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
      <cylinderGeometry args={[1, 1, 1, 12, 60*3]} />
      {/* <planeGeometry args={[1,2,1,50]}/> */}
      <meshBasicNodeMaterial
        // roughness={0.9}
        // metalness={0.}
        // wireframe
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function Base() {
  useFrame(() => {
    frameCount.value = (frameCount.value + 1) % mouseDataLen;
  });

  return (
    <>
      <Surface />
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
      <directionalLight position={[0, 0, 10]} intensity={4.1} />
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
