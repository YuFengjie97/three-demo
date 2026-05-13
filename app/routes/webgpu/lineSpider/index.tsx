import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  billboarding,
  vertexIndex,
  Loop,
  Discard,
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
import { LineGeometry } from "three/examples/jsm/Addons.js";
import { mx_perlin_noise_vec3_0, mx_perlin_noise_vec3_1 } from "three/src/nodes/materialx/lib/mx_noise.js";


const globalUf = {
  dotCol: uniform(vec3(1,0,0)),
  headCol: uniform(vec3(0,1,0)),
  tailCol: uniform(vec3(1,0,0)),
  glowCol: uniform(vec3(0,1,1))
}


function Thread({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
  const count = 100;

  const mat = useMemo(() => {
    const lineGeo = new THREE.BufferGeometry();

    const uf = {
      uStart: uniform(start),
      uEnd: uniform(end),
    };

    const posArr = new Float32Array(count * 3);
    const posBuffer = storage(new THREE.StorageBufferAttribute(posArr, 3), "vec3", count);

    lineGeo.setAttribute("position", new THREE.BufferAttribute(posArr, 3));

    const updatePos = Fn(() => {
      const idx = instanceIndex;
      const idx01 = float(idx).div(count);
      const pos = posBuffer.element(idx).toVar();

      const tarPos = mix(uf.uStart, uf.uEnd, idx01);
      const n = mx_noise_vec3(tarPos.mul(0.4).add(time.mul(0.1)))
        .mul(2) // 加强
        .mul(smoothstep(0.1, 1, idx01)); // 终点不要噪音摆动
      tarPos.addAssign(n);

      pos.assign(mix(pos, tarPos, 0.8));

      posBuffer.element(idx).assign(pos);
    })().compute(count);

    const vCol = varying(vec3(0));
    const positionNode = Fn(() => {
      const idx = vertexIndex;
      const idx01 = float(idx).div(count)
      const pos = posBuffer.element(idx).toVar();

      vCol.assign(mix(globalUf.tailCol, globalUf.headCol, idx01));

      const glow = pow(float(.1).div(abs(sin(idx01.mul(PI).add(instanceIndex.mul(.2)).add(time)))), 2)
      vCol.assign(mix(vCol, globalUf.glowCol, glow))

      return pos;
    })();

    const colorNode = Fn(() => {
      return vCol;
    })();

    return { lineGeo, posBuffer, positionNode, updatePos, colorNode };
  }, []);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(mat.updatePos);
  });

  return (
    // @ts-ignore
    <line geometry={mat.lineGeo}>
      <lineBasicNodeMaterial
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

function Points({ points, sampleIndArr }: { points: THREE.Vector3[]; sampleIndArr: number[] }) {
  const count = points.length;
  const posArr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    posArr[i * 3 + 0] = points[i].x;
    posArr[i * 3 + 1] = points[i].y;
    posArr[i * 3 + 2] = points[i].z;
  }

  const mat = useMemo(() => {
    const posBuffer = instancedArray(posArr, "vec3");
    const uf = {
      uSampleIndArr: uniformArray(sampleIndArr),
    };

    const vIncluded = varying(float(0));
    const positionNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar();

      Loop(count, ({ i }) => {
        const targetIdx = uf.uSampleIndArr.element(i);

        If(targetIdx.equal(instanceIndex), () => {
          vIncluded.assign(1);
        });
      });

      return pos;
    })();

    const colorNode = Fn(() => {
      const d = length(uv().sub(0.5));
      const glow = pow(float(0.1).div(d), 2);
      // const glow = float(.1).div(d)

      return vec4(globalUf.dotCol.mul(.1).mul(glow), vIncluded.mul(glow));
    })();

    return { positionNode, colorNode };
  }, []);

  return (
    <instancedMesh args={[undefined, undefined, count]}>
      <planeGeometry />
      <spriteNodeMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        scaleNode={float(1)}
      />
    </instancedMesh>
  );
}

function Base() {
  const {camera} = useThree()
  camera.position.set(0,0,2)


  const count = 1000;
  const { points } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      points.push(new THREE.Vector3(x, y, z));
    }

    return { points };
  }, [count]);

  const sampleCount = 50;
  const sampleArr: THREE.Vector3[] = useMemo(
    () => Array.from({ length: sampleCount }).map((item) => new THREE.Vector3(0, 0, 0)),
    [],
  );
  const sampleIndArr: number[] = useMemo(
    () => Array.from({ length: sampleCount }).map((item) => 0),
    [],
  );
  const hitPos = new THREE.Vector3(0, 0, 0);

  function reSample() {
    // for (let i = 0; i < sampleCount; i++) {
    //   const ind = Math.floor(Math.random() * count);
    //   const p = points[ind];
    //   sampleArr[i].copy(p);
    //   sampleIndArr[i] = ind;
    // }

    let idx = 0;
    for (let i = 0; i < count; i++) {
      const p = points[i];
      const dist = p.distanceTo(hitPos);
      if (dist < 3) {
        sampleArr[idx].copy(p);
        sampleIndArr[idx] = i
        idx++;
      }
      if (idx === sampleCount) {
        break;
      }
    }
  }

  const { rayCaster } = useMouseRay();
  const surfaceRef = useRef<THREE.Mesh>(null);
  const cellSize = 1.5;
  const cellPos = hitPos.clone().divideScalar(cellSize).floor();

  useFrame(() => {
    if (!surfaceRef.current) return;
    const intersect = rayCaster.intersectObject(surfaceRef.current);
    if (intersect.length > 0) {
      hitPos.copy(intersect[0].point);
      const hitCellPos = hitPos.clone().divideScalar(cellSize).floor();

      if (hitCellPos.x !== cellPos.x || hitCellPos.y !== cellPos.y || hitCellPos.z !== cellPos.z) {
        reSample();
        cellPos.copy(hitCellPos);
      }
    }
  });


  const pane = new Pane()
  useEffect(() => {
    pane.addBinding({col: {r:1,g:0,b:0}}, 'col', {label: 'dotCol', color: {type: 'float'}}).on('change', ({value}) => {
      const {r,g,b} = value
      globalUf.dotCol.value.set(r,g,b)
    })
    pane.addBinding({col: {r:0,g:1,b:0}}, 'col', {label: 'headCol', color: {type: 'float'}}).on('change', ({value}) => {
      const {r,g,b} = value
      globalUf.headCol.value.set(r,g,b)
    })
    pane.addBinding({col: {r:1,g:0,b:0}}, 'col', {label: 'tailCol', color: {type: 'float'}}).on('change', ({value}) => {
      const {r,g,b} = value
      globalUf.tailCol.value.set(r,g,b)
    })
    pane.addBinding({col: {r:0,g:1,b:1}}, 'col', {label: 'glowCol', color: {type: 'float'}}).on('change', ({value}) => {
      const {r,g,b} = value
      globalUf.glowCol.value.set(r,g,b)
    })
  }, [])

  return (
    <>
      <mesh ref={surfaceRef} visible={false}>
        <boxGeometry args={[10, 10, 10]} />
        <meshBasicNodeMaterial side={THREE.BackSide} />
      </mesh>
      <Points points={points} sampleIndArr={sampleIndArr} />
      {sampleArr.map((item, i) => {
        return <Thread start={item} end={hitPos} key={i} />;
      })}
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
      {/* <axesHelper args={[20]} /> */}
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
