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
  frameId,
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
import { attachPointerSplats, FluidSimulation } from 'three-fluid-fx/tsl'


function Base(){
  const size = 100
  const count = size*size
  const {gl,size: stageSize} = useThree()
  const renderer = gl as unknown as THREE.WebGPURenderer


  const {fluid, posNode, updatePos} = useMemo(() => {
    const fluid = new FluidSimulation(renderer, {
      profile: 'balanced',
      splatRadius: 0.001,
      splatForce: 6,
    })
    fluid.enableDye = true
    fluid.resize(stageSize.width, stageSize.height)
    const detachPointer = attachPointerSplats(renderer.domElement, fluid)


    const radius = 5
    const geo = new THREE.IcosahedronGeometry(radius, 6)
    const posArr = geo.getAttribute('position').array as Float32Array


    const posBuffer = instancedArray(posArr, 'vec3')

    const posNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar()
      return positionLocal.add(pos)
    })()

    const updatePos = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar()

      const phi = atan(pos.y, pos.x); 
      const u = phi.div(Math.PI * 2).add(0.5);
      const theta = acos(pos.z.div(radius).clamp(-1, 1)); 
      const v = theta.div(Math.PI)
      const uv = vec2(u,v)

      const vel = texture(fluid.velocityNode, uv).xyz
      pos.addAssign(vel.mul(deltaTime).mul(3))
      posBuffer.element(instanceIndex).assign(pos)
    })().compute(count)

    return {fluid, posNode, updatePos}
  }, [])


  useFrame((_,delta)=>{
    fluid.step(delta)
    renderer.compute(updatePos)
  })


  return(
    <instancedMesh args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[.1, 1]}/>
      <meshBasicNodeMaterial positionNode={posNode}/>
    </instancedMesh>
  )
}


export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={0.4} />
      <axesHelper args={[10]} /> 
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
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
