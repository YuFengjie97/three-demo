import {
  Environment,
  InstancedAttribute,
  OrbitControls,
  useGLTF,
  useTexture,
} from "@react-three/drei";
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
  transformedNormalView,
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
import { LineGeometry, MeshSurfaceSampler } from "three/examples/jsm/Addons.js";
import mitt from "mitt";

const emitter = mitt();
const sampleCount = 2000;

const uf = {
  speed: uniform(1),
  lenScale: uniform(2.3),
  posScale: uniform(.2),
  offsetAmp: uniform(7),

  colEndPosScale: uniform(.3),
  colPosScale: uniform(.2),
  colSpeed: uniform(1),
  colSeed: uniform(vec3(3,2,1)),
  alpha: uniform(float(.05)),
  glowCol: uniform(vec3(0.7,0,1))
}

function Base() {
  const {camera,gl} = useThree()
  camera.position.set(0,0,20)
  gl.toneMapping = THREE.NeutralToneMapping
  gl.toneMappingExposure = 1.2

  const { posArr } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(5, 1);
    const mat = new THREE.MeshBasicNodeMaterial({ wireframe: true });
    const mesh = new THREE.Mesh(geo, mat);

    const posArr = new Float32Array(sampleCount * 3);
    const sampler = new MeshSurfaceSampler(mesh).build();
    const point = new THREE.Vector3();
    for (let i = 0; i < sampleCount; i++) {
      sampler.sample(point);
      posArr[i * 3 + 0] = point.x;
      posArr[i * 3 + 1] = point.y;
      posArr[i * 3 + 2] = point.z;
    }
    return { posArr };
  }, [sampleCount]);

  const { geo, posNode, colNode } = useMemo(() => {
    const endPosBuffer = instancedArray(posArr, "vec3");

    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 10),
    ]);
    const tubularSegments = 50;
    const radialSegments = 6;
    const geo = new THREE.TubeGeometry(path, tubularSegments - 1, 0.08, radialSegments - 1);

    const vCol = varying(vec3(0));

    const posNode = Fn(() => {
      const seg01 = float(vertexIndex).div(radialSegments).div(tubularSegments);
      const endPos = endPosBuffer.element(instanceIndex);

      const rot = lookAt(endPos.normalize());
      const n = mx_noise_vec3(seg01.mul(uf.lenScale).add(endPos.mul(uf.posScale)).sub(time.mul(uf.speed)));
      const offset = smoothstep(0.0, 0.5, seg01).mul(n).mul(uf.offsetAmp);

      const col = sin(
        uf.colSeed
        .add(dot(endPos, vec3(uf.colEndPosScale)))
        .add(dot(positionLocal, vec3(uf.colPosScale)))
        .add(time.mul(uf.colSpeed))
      )
        .mul(0.5)
        .add(0.5)
      // const glow = smoothstep(0.2,.0,abs(sin(seg01.mul(PI).add(time))))
      const glow = (float(.1).div(abs(sin(seg01.mul(PI).add(time)))))
      col.assign(mix(col, uf.glowCol, glow))

      vCol.assign(col);

      return rot.mul(positionLocal).add(offset);
    })();

    const colNode = Fn(() => {
      // return vec4(vCol, uf.alpha);
      return vec4(vCol, 1);
    })();
    return { geo, posNode, colNode };
  }, []);


  useEffect(() => {
    const pane = new Pane()
    const f1 = pane.addFolder({title: 'noise'})
    f1.addBinding(uf.speed, 'value', {label: 'speed', min:.1, max: 5})
    f1.addBinding(uf.lenScale, 'value', {label: 'lenScale', min:.1, max: 5})
    f1.addBinding(uf.posScale, 'value', {label: 'posScale', min:.1, max: 5})
    f1.addBinding(uf.offsetAmp, 'value', {label: 'offsetAmp', min:.1, max: 10})
  
    const f2 = pane.addFolder({title: 'color'})
    f2.addBinding(uf.colEndPosScale, 'value', {label: 'endPosScale', min:.01, max: 1})
    f2.addBinding(uf.colPosScale, 'value', {label: 'posScale', min:.01, max: 1})
    f2.addBinding(uf.colSpeed, 'value', {label: 'speed', min:.1, max: 5})
    f2.addBinding(uf.colSeed, 'value', {label: 'seed', min:0, max: 10})
    // f2.addBinding(uf.alpha, 'value', {label: 'alpha', min:0.01, max: 1})
    f2.addBinding({c: {r:.7, g:0, b:1}}, 'c', {label:'glowCol', color: {type: 'float'}}).on('change', ({value})=>{
      const {r,g,b} = value
      uf.glowCol.value.set(r,g,b)
    })
  }, [])


  return (
    <instancedMesh args={[geo, undefined, sampleCount]}>
      <meshStandardNodeMaterial
        colorNode={colNode}
        positionNode={posNode}
        normalNode={transformedNormalView}
        metalness={0}
        roughness={1.}

        // side={THREE.DoubleSide}
        // transparent
        // opacity={.8}
        // depthWrite={false}
        // blending={THREE.AdditiveBlending}
        
        // transparent
        // opacity={1}
        // metalness={0}
        // roughness={.5}
        // transmission={1}
        // ior={1.5}
        // thickness={2}

        // sheen={1}
        // sheenColor={new THREE.Color(0x666666)}
        // sheenRoughness={1}
      />
    </instancedMesh>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1.2} />
      {/* <axesHelper args={[10]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <Environment
          background
          blur={0.4}
          backgroundIntensity={.6}
          path={asset("/img/skybox/sky_98_cubemap_2k")}
        />
      </Suspense>
    </WebGPUCanvas>
  );
}
