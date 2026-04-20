import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  attribute,
  cos,
  roughness,
  metalness,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, lookAt, lookAt2, palette, sin3, smoothRange } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { usePane } from "~/hook/usePane";
import { Pane } from "tweakpane";
import { SkyboxFairyForestDay } from "~/components/model/SkyboxFairyForestDay";
import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js";
import { afterImage } from "three/examples/jsm/tsl/display/AfterImageNode.js";
import { anamorphic } from "three/examples/jsm/tsl/display/AnamorphicNode.js";
import { boxBlur } from "three/examples/jsm/tsl/display/boxBlur.js";
import { chromaticAberration } from "three/examples/jsm/tsl/display/ChromaticAberrationNode.js";
import { denoise } from "three/examples/jsm/tsl/display/DenoiseNode.js";

function Model() {
  const { nodes } = useGLTF(asset("/model/starFragment-transformed.glb"));

  // @ts-ignore
  const geo = nodes.plane.geometry as THREE.BufferGeometry;
  console.log(geo);
  
  const mat = useMemo(() => {
    const blockPos = attribute<'vec3'>('_blockpos', 'vec3') 
    const id = attribute<'vec3'>('_id', 'vec3') 

    const uf = {
      colSeed: uniform(vec3(3,2,1)),
      roughness: uniform(.5),
      metalness: uniform(.6)
    }

    const positionNode = Fn(() => {
      const offset = smoothstep(0., 1., mx_noise_float(blockPos.mul(.4).add(time.mul(2.))))
      const offsetDir = blockPos.normalize()

      return positionLocal.add(offsetDir.mul(offset))
    })()
    const colorNode = Fn(() => {
      const col = sin3(uf.colSeed.add(blockPos)).mul(.5).add(.5)
      return vec4(col, .5)
    })()

    return { colorNode, positionNode, uf }

  }, []);

  const pane = new Pane();
  useEffect(() => {
    pane.addBinding(mat.uf.colSeed, "value", { label: "colSeed", min: -10, max: 10 });
    pane.addBinding(mat.uf.metalness, "value", { label: "metalness", min: 0, max: 1 });
    pane.addBinding(mat.uf.roughness, "value", { label: "roughness", min: 0, max: 1 });

    return () => {
      pane.dispose();
    };
  }, []);

  return (
    <mesh geometry={geo}>
      <meshPhysicalNodeMaterial 
        roughnessNode={mat.uf.roughness}
        metalnessNode={mat.uf.metalness}
        positionNode={mat.positionNode}
        // emissiveNode={mat.colorNode}
        colorNode={mat.colorNode} 
        // transparent={true}
        // blending={THREE.AdditiveBlending}
        // depthWrite={false}
        // colorNode={vec3(1,0,0)} 
        />
    </mesh>
  );
}

function Base() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t);
  });

  return (
    <group ref={groupRef}>
      <Model />
    </group>
  );
}

function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();
  gl.toneMapping = THREE.AgXToneMapping
  camera.position.set(0,0,16)


  const renderPipeline = useMemo(() => {
    const renderer = gl as unknown as THREE.WebGPURenderer;
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, 1., 0.2, .4);

    renderPipeline.outputNode = scenePassColor.add(bloomPass)
    // renderPipeline.outputNode = afterImage(scenePass,.5)
    // renderPipeline.outputNode = anamorphic(scenePass)
    // renderPipeline.outputNode = boxBlur(scenePass)
    // renderPipeline.outputNode = chromaticAberration(scenePass)

    

    return renderPipeline;
  }, [gl, scene, camera]);

  // 接管渲染，优先级设为 1 覆盖默认渲染
  useFrame(() => {
    renderPipeline.render();
  }, 1);

  return null;
}
export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={2} />
      {/* <pointLight position={[0,0,-2]} intensity={4} /> */}
      <directionalLight position={[-5, 5, 5]} intensity={2.1} />
      {/* <axesHelper args={[20]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        {/* <WebGPUEffects /> */}
        <Environment background blur={0.4} path={asset("/img/skybox/sky_98_cubemap_2k")} />
        {/* <SkyboxFairyForestDay /> */}
      </Suspense>
    </WebGPUCanvas>
  );
}
