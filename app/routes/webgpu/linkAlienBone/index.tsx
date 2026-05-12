import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef } from "react";
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

function Bones({
  tarPos,
  freeDirRange,
}: {
  tarPos: THREE.Vector3;
  freeDirRange: number;
}) {
  const count = 100;
  const seed = Math.random() * 100;

  const { nodes, materials } = useGLTF(asset("/model/alienBone-transformed.glb"));
  // @ts-ignore
  const geo = nodes.base001.geometry;
  console.log(geo);

  const mat = useMemo(() => {
    const totalInstances = float(count);
    const posArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = i * 0.5;
      const y = 0;
      const z = 0;
      posArr[i * 3 + 0] = x;
      posArr[i * 3 + 1] = y;
      posArr[i * 3 + 2] = z;
    }

    const uf = {
      tarPos: uniform(tarPos),
      gap: uniform(float(0.02)),
    };

    const posBuffer = instancedArray(posArr, "vec3");
    const dirBuffer = instancedArray(count, "vec3");

    const computePos = Fn(() => {
      let curIdx = instanceIndex;
      let preIdx = int(max(0, float(curIdx).sub(1)));
      let curPos = posBuffer.element(curIdx).toVar();
      let prePos = posBuffer.element(preIdx).toVar();
      let ufTarPos = uf.tarPos.add(
        mx_noise_vec3(uf.tarPos.mul(0.2).sub(seed).add(time.mul(0.3))).mul(freeDirRange),
      );

      let tarPos = select(curIdx.equal(0), ufTarPos, prePos);
      If(distance(curPos, tarPos).greaterThan(uf.gap), () => {
        curPos.assign(mix(curPos, tarPos, 0.3));
      });
      posBuffer.element(curIdx).assign(curPos);
      dirBuffer.element(curIdx).assign(tarPos.sub(curPos).normalize());
    })().compute(count);

    const vCol = varying(vec3(0));

    const positionNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar();
      const dir = dirBuffer.element(instanceIndex).toVar();

      // const col = sin(vec3(3,2,1).add(float(seed).mul(10).add(time))).mul(.5).add(.5)
      // vCol.assign(mix(col, vec3(0, 0, 0), float(instanceIndex).div(totalInstances)));

      const lookAtRot = lookAt(dir);
      const scale = smoothstep(1, 0.0, float(instanceIndex).div(count));

      return lookAtRot.mul(positionLocal.mul(scale)).add(pos);
    })();

    const colorNode = Fn(() => {
      const uv1 = abs(uv().sub(vec2(0.2, 0)));
      // const d = length(uv1)
      const d = min(abs(uv1.x), abs(uv1.y));
      const glow = float(0.1).div(d).mul(2);

      return vec4(vec3(1).mul(glow), .8);
    })();

    return { colorNode, positionNode, computePos, uf };
  }, []);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(mat.computePos);
  });

  // const pane = new Pane()
  useEffect(() => {
    // pane.addBinding(mat.uf.gap, 'value', {label:'gap', min:.1, max:2})
  }, []);

  return (
    <instancedMesh args={[geo, undefined, count]}>
      <meshPhysicalNodeMaterial
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        transmission={1}
        ior={1.5}
        thickness={1}
        metalness={0}
        roughness={0}
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
      />
    </instancedMesh>
  );
}

function Base() {
  const { camera } = useThree();
  camera.position.set(0, 0, 0.1);

  const mouseHit = new THREE.Vector3(0, 0, 0);
  const surfaceRef = useRef<THREE.Mesh>(null);

  const { rayCaster } = useMouseRay();
  useFrame(() => {
    if (!surfaceRef.current) return;
    const intersetObj = rayCaster.intersectObject(surfaceRef.current);
    if (intersetObj.length > 0) {
      const hitPos = intersetObj[0].point;
      mouseHit.copy(hitPos);
    }
  });


  return (
    <>
      <mesh ref={surfaceRef} visible={false}>
        <icosahedronGeometry args={[15, 1]} />
        <meshBasicNodeMaterial side={THREE.BackSide} />
      </mesh>
      <Bones tarPos={mouseHit} freeDirRange={5} />
      <Bones tarPos={mouseHit} freeDirRange={15} />
      <Bones tarPos={mouseHit} freeDirRange={25} />
    </>
  );
}

function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();
  // gl.toneMapping = THREE.NoToneMapping
  // gl.toneMapping = THREE.AgXToneMapping
  const renderer = gl as unknown as THREE.WebGPURenderer;

  let renderPipeline: THREE.RenderPipeline;
  useEffect(() => {
    renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, 0.5, 0.5, 0.3);
    renderPipeline.outputNode = scenePassColor.add(bloomPass);

    // const f = pane!.addFolder({title: 'bloom'})
    // f!.addBinding(bloomPass.strength, 'value', {label: 'strength', min: 0, max:1})
    // f!.addBinding(bloomPass.radius, 'value', {label: 'radius', min: 0, max:1})
    // f!.addBinding(bloomPass.threshold, 'value', {label: 'threshold', min: 0, max:1})
  }, []);

  // 接管渲染，优先级设为 1 覆盖默认渲染
  useFrame(() => {
    renderPipeline && renderPipeline.render();
  }, 1);

  return null;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={0.4} />
      {/* <hemisphereLight args={[0xff0000, 0x00ff00]} intensity={1}/> */}
      <pointLight intensity={1} />
      {/* <directionalLight position={[-10, 10, 10]} intensity={4.1} /> */}
      {/* <directionalLight position={[10, -10, -10]} intensity={2.5} /> */}
      <axesHelper args={[20]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        {/* <WebGPUEffects /> */}
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
