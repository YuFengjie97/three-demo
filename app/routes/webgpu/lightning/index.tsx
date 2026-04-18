import { OrbitControls, useTexture } from "@react-three/drei";
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
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, palette, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { Pane } from "tweakpane";

function Thread({
  noiseScale,
  speed,
  lifeSpeed,
}: {
  noiseScale: THREE.Node<"vec3">;
  speed: number;
  lifeSpeed: number;
}) {
  const map = useTexture(asset("/img/texture/particle/circle_05.png"));

  const mat = useMemo(() => {
    const count = 1000;
    const len = 10;
    const positionArr = new Float32Array(count * 3);
    const lifeArr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const x = (i / count) * len;
      const y = 0;
      const z = 0;
      const i3 = i * 3;
      positionArr[i3 + 0] = x;
      positionArr[i3 + 1] = y;
      positionArr[i3 + 2] = z;
      lifeArr[i] = Math.random();
    }

    const uf = {
      seed: float(uniform(Math.random() * 11.31)),
      noiseScale: uniform(noiseScale),
      speed: uniform(speed),
      lifeSpeed: uniform(lifeSpeed),
    };

    const posBuffer = instancedArray(positionArr, "vec3");
    const posOrgBuffer = instancedArray(positionArr, "vec3");
    const lifeBuffer = instancedArray(lifeArr, "float");

    const updatePos = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar();
      const vel = curlNoise3d(
        pos
          .mul(uf.noiseScale)
          .add(uf.seed)
          .add(vec3(0, 0, time)),
      );
      pos.addAssign(vel.mul(uf.speed).mul(deltaTime));
      const life = lifeBuffer.element(instanceIndex).toVar();
      life.addAssign(uf.lifeSpeed.mul(deltaTime));

      If(life.greaterThan(1), () => {
        life.assign(fract(life));
        pos.assign(posOrgBuffer.element(instanceIndex).toVar());
      });

      posBuffer.element(instanceIndex).assign(pos);
      lifeBuffer.element(instanceIndex).assign(life);
    })().compute(count);

    const vLife = varying(float(0));
    const positionNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar();
      const life = lifeBuffer.element(instanceIndex).toVar();
      vLife.assign(life);
      return pos;
    })();
    const colorNode = Fn(() => {
      // const d = texture(map, uv()).r
      const d = smoothstep(0.5, 0.49, length(uv().sub(0.5)));
      const col = vec3(1, 0, 0);
      return vec3(col.mul(d), d);
    })();
    const scaleNode = Fn(() => {
      const life = lifeBuffer.element(instanceIndex).toVar();
      return smoothstep(0, 1, life);
    })();

    return { count, uf, positionNode, colorNode, updatePos, scaleNode };
  }, []);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(mat.updatePos);
  });

  // const pane = new Pane()
  // useEffect(() => {
  //   pane.addBinding(mat.uf.noiseScale,'value', {label: 'noiseScale', min:0.01, max:1})
  //   pane.addBinding(mat.uf.lifeSpeed,'value', {label: 'lifeSpeed', min:0.01, max:4})
  //   pane.addBinding(mat.uf.speed,'value', {label: 'speed', min:0.01, max:4})

  //   return() => {
  //     pane.dispose()
  //   }
  // },[])

  return (
    <instancedMesh args={[undefined, undefined, mat.count]}>
      <planeGeometry args={[0.2, 0.2]} />
      <spriteNodeMaterial
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        scaleNode={mat.scaleNode}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  );
}

function Base() {
  return (
    <>
    <Thread noiseScale={vec3(.2,2,2)} speed={2} lifeSpeed={2}/>
    {/* <Thread noiseScale={vec3(.2,2,2)} speed={4} lifeSpeed={1.5}/> */}
    {/* <Thread noiseScale={vec3(.1,8,8)} speed={6} lifeSpeed={1.1}/>
    <Thread noiseScale={vec3(.4,16,16)} speed={8} lifeSpeed={.8}/> */}
    </>
  )
}

function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();
  // gl.toneMapping = THREE.AgXToneMapping

  const renderPipeline = useMemo(() => {
    const renderer = gl as unknown as THREE.WebGPURenderer;
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    // const bloomPass = bloom(scenePassColor, 1.1, 0.5, .1);
    const bloomPass = bloom(scenePassColor, 0.1, 0.1, 0.1);
    renderPipeline.outputNode = scenePassColor.add(bloomPass);

    return renderPipeline;
  }, []);

  // 接管渲染，优先级设为 1 覆盖默认渲染
  useFrame(() => {
    renderPipeline.render();
  }, 1);

  return null;
}

export default function App() {
  return (
    <WebGPUCanvas>
      {/* <ambientLight intensity={1}/> */}
      {/* <directionalLight position={[0, 0, 20]} intensity={1.1} /> */}
      <axesHelper args={[20]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <WebGPUEffects />
      </Suspense>
    </WebGPUCanvas>
  );
}
