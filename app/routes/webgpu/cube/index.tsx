import { OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef } from "react";
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
  reflect,
  reflector,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, palette, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { usePane } from "~/hook/usePane";
import { Pane } from "tweakpane";

function Plane() {
  const { reflection } = useMemo(() => {
    const reflection = reflector({ resolutionScale: 0.7 });
    reflection.target.rotateX(-Math.PI / 2);

    return { reflection };
  }, []);
  const { scene } = useThree();
  useEffect(() => {
    scene.add(reflection.target);
    return () => {
      scene.remove(reflection.target);
    };
  });

  const { pane } = usePane();

  const { uf, colorNode, emissiveNode } = useMemo(() => {
    const uf = {
      metaless: uniform(0.9),
      roughness: uniform(0.1),
    };

    const colorNode = Fn(() => {
      const col = vec3(0.1);
      return col;
    })();

    const emissiveNode = Fn(() => {
      return reflection.mul(0.7);
    })();

    return { uf, colorNode, emissiveNode };
  }, []);

  useEffect(() => {
    pane.addBinding(uf.metaless, "value", { label: "metalness", min: 0, max: 1 });
    pane.addBinding(uf.roughness, "value", { label: "roughness", min: 0, max: 1 });
  }, []);

  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[100, 100]} />
      <meshPhysicalNodeMaterial colorNode={colorNode} emissiveNode={emissiveNode} metalnessNode={uf.metaless} roughnessNode={uf.roughness} />
    </mesh>
  );
}

function Ring() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_) => {
    if (!meshRef.current) return;
    const t = _.clock.getElapsedTime();
    meshRef.current.rotation.x = t;
    meshRef.current.rotation.z = t;
  });
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[3, 0.05, 12, 64]} />
      <meshNormalNodeMaterial />
    </mesh>
  );
}

function Cube() {
  const { pane } = usePane();

  const { colorNode, uf } = useMemo(() => {
    const uf = {
      col: uniform(new THREE.Color(0x00ffee)),
      pos: uniform(new THREE.Vector3(0, 3, 0)),
      floatRange: uniform(0.5),
      roughness: uniform(0.5),
      metalness: uniform(0.5),
    };

    const colorNode = Fn(() => {
      return uf.col;
    })();

    return { uf, colorNode };
  }, []);

  useEffect(() => {
    pane.addBinding(uf.col, "value", { label: "col", color: { type: "float" } });
    pane.addBinding(uf.pos, "value", { label: "pos" });
    pane.addBinding(uf.floatRange, "value", { label: "float", min: 0, max: 2, step: 0.01 });
    pane.addBinding(uf.metalness, "value", { label: "meta", min: 0, max: 1 });
    pane.addBinding(uf.roughness, "value", { label: "rough", min: 0, max: 1 });
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, deltaTime) => {
    if (!groupRef.current) return;
    const t = _.clock.getElapsedTime();
    let [x, y, z] = uf.pos.value.toArray();
    y += Math.sin(t) * uf.floatRange.value;
    groupRef.current.position.set(x, y, z);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusKnotGeometry args={[1, 0.3, 200, 30]} />
        <meshPhysicalNodeMaterial colorNode={colorNode} metalnessNode={uf.metalness} roughnessNode={uf.roughness} />
      </mesh>
      <Ring />
    </group>
  );
}

function Base() {
  const { scene, camera } = useThree();
  camera.position.set(0, 4, 10);
  const { pane } = usePane();

  useEffect(() => {
    const col = new THREE.Color(0x111111);
    scene.fog = new THREE.FogExp2(col, 0.07);
    scene.background = new THREE.Color(col);
    pane.addBinding(scene.fog, "density", { label: "fog density" });
    pane.addBinding({ col: col.getStyle() }, "col", { label: "fog col" }).on("change", ({ value }) => {
      const c = new THREE.Color(value);
      scene.fog && (scene.fog.color = c);
      scene.background = c;
    });
  }, []);

  return (
    <>
      <Plane />
      <Cube />
    </>
  );
}

function WebGPUEffects() {
  const { gl, scene, camera } = useThree();

  const renderer = gl as unknown as THREE.WebGPURenderer;

  const { renderPipeline } = useMemo(() => {
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);

    renderPipeline.outputNode = scenePass;

    return { renderPipeline };
  }, [renderer]);

  useFrame(() => {
    renderPipeline.render();
  }, 1);

  return null;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1} />
      <directionalLight position={[1, 10, 1]} intensity={1.1} />
      {/* <axesHelper args={[20]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <WebGPUEffects />
      </Suspense>
    </WebGPUCanvas>
  );
}
