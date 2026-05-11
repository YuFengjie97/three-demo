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
import { lookAt } from "~/utils/tsl";

const mousePos = uniform(new THREE.Vector3(0, 0, 0));
const mouseDataLen = 60;

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
      <icosahedronGeometry args={[20, 2]} />
      <meshBasicMaterial wireframe side={THREE.DoubleSide} />
    </mesh>
  );
}

function Trail() {
  const mat = useMemo(() => {

    const mousePosHistoryBuffer = instancedArray(new Float32Array(mouseDataLen * 3), "vec3");
    const posBuffer = instancedArray(new Float32Array(mouseDataLen * 3), "vec3");

    // 更新位置
    const computedPos = Fn(() => {
      const curIdx = instanceIndex

      If(curIdx.equal(0),() => {
        mousePosHistoryBuffer.element(0).assign(mousePos)
      })
      .Else(() => {
        const leaderIdx = curIdx.sub(1); 
        const newPos = mousePosHistoryBuffer.element(leaderIdx).toVar();
        mousePosHistoryBuffer.element(curIdx).assign(newPos);
      })

      const pos = posBuffer.element(instanceIndex).toVar()
      const tarPos = mousePosHistoryBuffer.element(instanceIndex).toVar()
      // const velNoise = mx_noise_vec3(pos.mul(.1))
      // const toTar = tarPos.sub(pos).normalize()
      // const vel = mix(velNoise, toTar, .9)
      // pos.addAssign(vel.mul(deltaTime).mul(20))

      pos.assign(mix(pos, tarPos, .1))

      posBuffer.element(instanceIndex).assign(pos)

    })().compute(mouseDataLen)

    const vCol = varying(vec3(0, 0, 0));

    const positionNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar()

      const billboardRot = lookAt(cameraPosition.sub(pos).normalize())

      vCol.assign(
        sin(vec3(3, 2, 1).add(instanceIndex.mul(.2)))
          .mul(0.5)
          .add(0.5),
      );

      return billboardRot.mul(positionLocal).add(pos)
    })();

    const colorNode = Fn(() => {
      return vCol;
    })();

    return { positionNode, colorNode, computedPos };
  }, []);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(mat.computedPos)
  });

  return (
    <instancedMesh args={[undefined, undefined, mouseDataLen]}>
      <planeGeometry args={[0.4, 0.4]} />
      <meshBasicNodeMaterial
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

function Base() {
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
