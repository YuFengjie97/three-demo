import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  agxToneMapping,
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
  Loop,
  cameraPosition,
  positionWorld,
  acesFilmicToneMapping,
  Break,
  exp,
  reflector,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, expToneMapping, lookAt, palette, rayBoxDist, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { sdBoxFrame } from "~/utils/tslSDF";
import { usePane } from "~/hook/usePane";

function Matrix(props) {
  const mat = useMemo(() => {
    const range = 30; // 要偶数
    const r = Math.floor(range / 2);
    const count = Math.pow(r * 2 + 1, 3);
    const positionArr = new Float32Array(count * 3);
    let i = 0;
    for (let x = -r; x <= r; x += 1) {
      for (let y = -r; y <= r; y += 1) {
        for (let z = -r; z <= r; z += 1) {
          const i3 = i * 3;
          positionArr[i3 + 0] = x * 0.4;
          positionArr[i3 + 1] = y * 0.4;
          positionArr[i3 + 2] = z * 0.4;
          i += 1;
        }
      }
    }

    const uf = {
      noiseScale: uniform(0.3),
      noiseSpeed: uniform(1),
      colorSeed: uniform(vec3(3, 2, 1)),
      colorScale: uniform(1),
      colorAmp: uniform(0.4),
      alpha: uniform(0.3),
      minLen: uniform(0.8),
      maxLen: uniform(3),
    };

    const positionBuffer = instancedArray(positionArr, "vec3");
    const directionBuffer = instancedArray(count, "vec3");
    const lengthBuffer = instancedArray(count, "vec3");

    const positionNode = Fn(() => {
      const idx = instanceIndex;
      const dir = directionBuffer.element(idx).toVar();
      const pos = positionBuffer.element(idx).toVar();
      const len = lengthBuffer.element(idx).toVar();
      const rot = lookAt(dir);

      // 1. 先进行局部缩放 (只在 Z 轴缩放 len 倍)
      const scaledPos = positionLocal.mul(vec3(len));
      // 2. 将中心点移动到根部 (因为 Box 原本中心在 0, 缩放后长度变为 len)
      // 底部对齐需要沿 Z 轴移动 len / 2
      const offsetPos = scaledPos.add(vec3(0, 0, len.div(2)));
      // 3. 应用旋转，最后加上世界坐标平移
      return rot.mul(offsetPos).add(pos);
      // return positionLocal.add(pos)
    })();

    const colorNode = Fn(() => {
      const pos = positionBuffer.element(instanceIndex).toVar();
      const dir = positionBuffer.element(instanceIndex).toVar();
      const col = sin3(uf.colorSeed.add(dot(dir.mul(uf.colorScale), vec3(uf.colorAmp))))
        .mul(0.5)
        .add(0.5);

      return vec4(col, uf.alpha);
    })();

    const computeUpdate = Fn(() => {
      const idx = instanceIndex;
      const pos = positionBuffer.element(idx).toVar();

      const noiseInput = pos.mul(uf.noiseScale).add(vec3(0, time.mul(uf.noiseSpeed), 0));

      const dir = mx_noise_vec3(noiseInput).normalize();
      const len = mx_noise_float(noiseInput);
      len.assign(smoothstep(0, 1, len).mul(uf.maxLen).add(uf.minLen));

      directionBuffer.element(idx).assign(dir);
      lengthBuffer.element(idx).assign(len);
    })().compute(count);

    return { count, positionNode, computeUpdate, colorNode, uf };
  }, []);

  const { pane } = usePane();
  useEffect(() => {
    pane.addBinding(mat.uf.noiseScale, "value", { label: "noiseScale", min: 0, max: 2 });
    pane.addBinding(mat.uf.noiseSpeed, "value", { label: "noiseSpeed", min: 0, max: 2 });
    pane.addBinding(mat.uf.colorSeed, "value", { label: "colorScale", min: 0, max: 10 });
    pane.addBinding(mat.uf.colorScale, "value", { label: "colorScale", min: 0, max: 2 });
    pane.addBinding(mat.uf.colorAmp, "value", { label: "colorAmp", min: 0, max: 2 });
    pane.addBinding(mat.uf.minLen, "value", { label: "minLen", min: 0, max: 2 });
    pane.addBinding(mat.uf.maxLen, "value", { label: "maxLen", min: 2, max: 8 });
    // pane.addBinding(mat.uf.alpha, "value", { label: "alpha", min: 0, max: 1 });
  }, []);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(mat.computeUpdate);
  });


  const instancedRef = useRef<THREE.InstancedMesh>(null);
  useFrame(({ clock }, delta) => {
    if (!instancedRef.current) return;
    const t = clock.getElapsedTime();
    instancedRef.current.rotation.x += delta * 0.2;
    instancedRef.current.rotation.z += delta * 0.2;
  });

  return (
    <instancedMesh ref={instancedRef} {...props} args={[undefined, undefined, mat.count]}>
      <boxGeometry args={[0.1, 0.1, 1]} />
      <meshBasicNodeMaterial
        // transmission={.8}
        // opacity={1}
        // ior={1.5}
        // metalness={0.}
        // roughness={0}
        // attenuationColorNode={mat.colorNode}
        // attenuationDistance={.1}
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        // transparent={true}
        // depthWrite={false}
        // blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

function Plane(props) {
  const { scene } = useThree();

  const { emissiveNode } = useMemo(() => {
    const reflection = reflector({ resolutionScale: 1 });
    reflection.target.rotateX(-Math.PI / 2);

    const emissiveNode = Fn(() => {
      return reflection.mul(0.7);
    })();
    scene.add(reflection.target);

    return { emissiveNode };
  }, []);

  return (
    <mesh {...props} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardNodeMaterial color={new THREE.Color(0x0abde3)} emissiveNode={emissiveNode} />
    </mesh>
  );
}

function Base() {
  const { camera } = useThree();
  camera.position.set(0, 25, 20);
  camera.lookAt(new THREE.Vector3(0, 10, 0));

  return (
    <>
      <Matrix position={[0, 10, 0]} />
      <Plane />
    </>
  );
}

function Fog() {
  const { scene, camera } = useThree();
  const { pane } = usePane();

  useEffect(() => {
    const col = new THREE.Color(0x8fdb5d);
    scene.fog = new THREE.FogExp2(col, 0.01);
    scene.background = new THREE.Color(col);

    const f = pane.addFolder({ title: "fog" });

    f.addBinding(scene.fog, "density", { label: "density" });
    f.addBinding({ col: col.getHex() }, "col", { label: "col", view: "color" }).on(
      "change",
      ({ value }) => {
        const c = new THREE.Color(value);
        scene.fog && (scene.fog.color = c);
        scene.background = c;
      },
    );
  }, []);

  return null;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 0, 20]} intensity={40.1} />
      {/* <axesHelper args={[20]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Fog />
        <Base />
        {/* <Environment preset='apartment' background/> */}
      </Suspense>
    </WebGPUCanvas>
  );
}
