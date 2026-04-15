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
  hue,
  transformedNormalWorld,
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

function Base() {
  const { camera,gl, scene } = useThree();
  camera.position.set(0, 4, 10);
  // scene.background = new THREE.Color(0xeeeeee)

  const render = gl as unknown as THREE.WebGPURenderer

  const mat = useMemo(() => {
    const uf = {
      levelNum: uniform(10),
      levelHeight: uniform(0.2),
      noiseScale: uniform(.5),
      color: uniform(vec3(1,0,0)),
      colorScale: uniform(.5),
    };


    const getLevel = Fn(([height]: [THREE.Node<'float'>]) => {
      const level = height.mul(uf.levelNum).floor()
      return level
    })

    const vLevel = varying(float(0));
    const vPos = varying(vec3(0))

    const getDisplacedPos = Fn(([basePos]: [THREE.Node<'vec3'>]) => {
      const noisePos = basePos.xy.mul(uf.noiseScale);
      const height = mx_noise_float(noisePos).mul(0.5).add(0.5);

      const level = getLevel(height)
      vLevel.assign(level)
      const levelHeight = level.mul(uf.levelHeight);

      return basePos.add(vec3(0, 0, levelHeight));
    });

    

    const positionNode = Fn(() => {
      const displacePos = getDisplacedPos(positionLocal)

      // vLevel.assign(getLevel(positionLocal.xy))
      // vPos.assign(displacePos)

      return displacePos;
    })();


    const normalNode = Fn(() => {
      const p = positionLocal;
      const f = getDisplacedPos(p).toVar(); // 当前点的最终位置

      const eps = vec2(.001,0); 

      const pX = getDisplacedPos(p.add(eps.xyy));
      const pY = getDisplacedPos(p.add(eps.yxy));

      const tangent = pX.sub(f).normalize();
      const bitangent = pY.sub(f).normalize();

      const nor = tangent.cross(bitangent).normalize();
      return nor
    })();

    const colorNode = Fn(() => {

      const hueOffset = vLevel.mul(uf.colorScale);
      const col = hue(uf.color, hueOffset);

      // const currentNormal = transformedNormalWorld;
      // const col = currentNormal

      return col
    })();

    return { positionNode, uf, colorNode, normalNode };
  }, []);

  const { pane } = usePane();
  useEffect(() => {
    pane.addBinding(mat.uf.levelNum, "value", { label: "levelNum", min: 1, max: 20, step: 1 });
    pane.addBinding(mat.uf.levelHeight, "value", { label: "levelHeight", min: 0.01, max: 1 });
    pane.addBinding(mat.uf.noiseScale, "value", { label: "noiseScale", min: 0.01, max: 1, step: .01 });
    pane.addBinding({col: {r:1,g:0,b:0}}, "col", { label: "color", color:{type: 'float'} }).on('change', ({value:{r,g,b}}) => {
      mat.uf.color.value.set(r,g,b)
    });
    pane.addBinding(mat.uf.colorScale, "value", { label: "colorScale", min: 0.01, max: 2 });
  }, []);

  return (
    <mesh rotation-x={-Math.PI/2}>
      <planeGeometry args={[10, 10, 200, 200]} />
      <meshBasicNodeMaterial
        // wireframe={true}
        // metalness={.0}
        // roughness={1.}
        colorNode={mat.colorNode}
        positionNode={mat.positionNode}
        // normalNode={mat.normalNode}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1}/>
      <directionalLight position={[0, 10, 10]} intensity={1.1} />
      <axesHelper args={[20]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        {/* <WebGPUEffects /> */}
      </Suspense>
    </WebGPUCanvas>
  );
}
