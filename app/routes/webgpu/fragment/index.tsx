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

function Lightning({ surface }: { surface: THREE.Mesh }) {
  const count = 2;
  
  const map = useTexture(asset("/img/texture/particle/spark_05.png"));

  const mat = useMemo(() => {
    const sampler = new MeshSurfaceSampler(surface).setWeightAttribute("uv").build();
    const position = new THREE.Vector3(0, 0, 0);
    const positionArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      sampler.sample(position);
      const i3 = i * 3;
      positionArr[i3 + 0] = position.x;
      positionArr[i3 + 1] = position.y;
      positionArr[i3 + 2] = position.z;
    }

    const posBuffer = instancedArray(positionArr, "vec3");
    const positionNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar();
      const n = mx_noise_vec3(
        positionLocal.mul(.4).add(1.).add(float(instanceIndex).mul(11.34)),
      ).mul(2);
      const rot = rotate(pos, n)
      return rot.mul(positionLocal).add(pos);
    })();

    const colorNode = Fn(() => {

      const uv2 = uv()
      const noise = mx_noise_vec3(uv2.mul(20.1)).xy.mul(.5).add(.5)
      // uv2.assign(mix(uv2, noise, .0))

      const tex = texture(map, uv2).r;
      const col = vec3(uv2, 0);

      return vec4(col, 1);
    })();
    return { positionNode, colorNode };
  }, [surface, count]);
  return (
    <instancedMesh args={[undefined, undefined, count]}>
      <planeGeometry args={[4, 4, 30, 30]} />
      <meshBasicMaterial
        side={THREE.DoubleSide}
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

function Model() {
  const { nodes, materials } = useGLTF(asset("/model/ball_suipian-transformed.glb"));

  // @ts-ignore
  const geo = nodes.plane.geometry as THREE.BufferGeometry;
  const {mesh, uf} = useMemo(() => {
    const uf = {
      colSeed: uniform(vec3(3, 2, 1)),
    };

    const colorNode = Fn(() => {
      const pos = positionLocal.toVar();
      const col = sin3(uf.colSeed.add(dot(pos, vec3(0.15)).mul(2)))
        .mul(0.5)
        .add(0.5);
      // return col
      return vec3(1);
    })();

    const mat = new THREE.MeshPhysicalNodeMaterial()
    mat.colorNode = colorNode
    mat.roughness = .1
    mat.metalness = 1.
    const mesh = new THREE.Mesh(geo, mat)
    mesh.rotation.z = Math.PI / 2
    return { mesh, uf };
  }, []);

  const pane = new Pane();
  useEffect(() => {
    pane.addBinding(uf.colSeed, "value", { label: "colSeed", min: 0, max: 10 });

    return () => {
      pane.dispose();
    };
  }, []);

  return (
    <>
      <primitive object={mesh} />
      <Lightning surface={mesh}/>
    </>
  ) 
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

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 10]} intensity={2.1} />
      <axesHelper args={[20]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <Environment background blur={0.4} path={asset("/img/skybox/sky_98_cubemap_2k")} />
        {/* <SkyboxFairyForestDay /> */}
      </Suspense>
    </WebGPUCanvas>
  );
}
