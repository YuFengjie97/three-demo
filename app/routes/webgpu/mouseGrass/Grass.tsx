import { useFBO, useGLTF } from "@react-three/drei";
import { useContext, useEffect, useMemo, useRef } from "react";
import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js";
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
  distance,
  mat4,
  cos,
} from "three/tsl";
import * as THREE from "three/webgpu";
import { asset } from "~/utils/asset";
import { cos3, lookAt, lookAt2 } from "~/utils/tsl";
import BaseContext from "./baseContext";
import {curlNoise3d} from '~/utils/tsl/curlNoise3d'
import { useFrame, useThree } from "@react-three/fiber";

export default function Grass({surface, grassGeo, mousePos}: {surface: THREE.Mesh, grassGeo: THREE.BufferGeometry, mousePos: THREE.UniformNode<"vec3", THREE.Vector3>}){
  const count = 60000
  const {pane} = useContext(BaseContext)



  const mat = useMemo(() => {
    const sampler = new MeshSurfaceSampler(surface)
      // .setWeightAttribute("uv")
      .build();
    const posArr = new Float32Array(count * 3);
    const norArr = new Float32Array(count * 3)
    const rotArr = new Float32Array(count)
    const scaleArr = new Float32Array(count)
    const pos = new THREE.Vector3(0, 0, 0);
    const nor = new THREE.Vector3(0, 0, 0);
    
    for (let i = 0; i < count; i++) {
      sampler.sample(pos, nor);
      const i3 = i * 3;
      posArr[i3 + 0] = pos.x;
      posArr[i3 + 1] = pos.y;
      posArr[i3 + 2] = pos.z;
      norArr[i3 + 0] = nor.x;
      norArr[i3 + 1] = nor.y;
      norArr[i3 + 2] = nor.z;

      rotArr[i] = Math.random() * 12
      scaleArr[i] = Math.max(.1, Math.random())
    }

    const uf = {
      grassCol0: uniform(vec3(0.0,0.4,0.13)),
      grassCol1: uniform(vec3(0.11,0.8,0.08)),
      scale: uniform(float(1.8)),
      influenceRadius: uniform(float(4)),
      windScale: uniform(float(2)),
      windSpeed: uniform(float(4)),
      windAmp: uniform(float(.1))
    }


    const posBuffer = instancedArray(posArr, 'vec3')
    const norBuffer = instancedArray(norArr, 'vec3')
    const rotBuffer = instancedArray(rotArr, 'float')
    const scaleOrgBuffer = instancedArray(scaleArr, 'float')
    const scaleBuffer = instancedArray(scaleArr, 'float')

    const vCol = varying(vec3(0))

    const positionNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar();
      const nor = norBuffer.element(instanceIndex).toVar();
      const rndRot = rotBuffer.element(instanceIndex).toVar()
      const rndScl = scaleBuffer.element(instanceIndex).toVar()

      let p = positionLocal.toVar();

      const rootDist = smoothstep(.1, .51, length(p))
      vCol.assign(mix(uf.grassCol0, uf.grassCol1, rootDist))
      
      p.assign(p.mul(rndScl.mul(uf.scale)));                // 随机缩放
      p.assign(rotate(p, vec3(0, 0, rndRot))) // 随机旋转

      p.assign(lookAt(nor).mul(p).add(pos))   // 草按照取样表面的法线改变朝向

      // 风
      // const n = curlNoise3d(p.mul(.1).add(vec3(0,0,time))).mul(.1)
      const n = cos3(p.zxy.mul(uf.windScale).add(vec3(time.mul(uf.windSpeed)))).mul(uf.windAmp)
      p.addAssign(n)

      return p
    })();

    const computeUpdate = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar()
      const scale = scaleBuffer.element(instanceIndex).toVar()
      const scaleOrg = scaleOrgBuffer.element(instanceIndex).toVar()

      // 1. 计算鼠标影响因子 (0 代表无影响，1 代表完全缩减)
      const dist = length(pos.sub(mousePos))
      const influence = smoothstep(uf.influenceRadius, 0.0, dist) 

      // 2. 确定目标缩放值
      // 当 influence 为 1 时，目标是 0；当 influence 为 0 时，目标是 scaleOrg
      const targetScale = mix(scaleOrg, float(0), influence)

      // 3. 平滑过渡 (类似 PID 或简易 Lerp)
      const nextScale = mix(scale, targetScale, fract(deltaTime.mul(4.0)))

      scaleBuffer.element(instanceIndex).assign(nextScale)
    })().compute(count)

    const colorNode = Fn(() => {
      // return vec3(.1,.8,0)
      return vCol
    })()

    return {positionNode, colorNode, uf, computeUpdate}
  }, [])

  const {gl} = useThree()
  const renderer = gl as unknown as THREE.WebGPURenderer
  useFrame(() => {
    renderer.compute(mat.computeUpdate)
  })


  useEffect(() => {
    pane?.addBinding({col: {r:0.0,g:0.4,b:0.13}}, 'col', {label: 'grass0', color: {type: 'float'}}).on('change',({value}) => {
      const {r,g,b} = value
      mat.uf.grassCol0.value.set(r,g,b)
    })
    pane?.addBinding({col: {r:0.22,g:0.96,b:0.18}}, 'col', {label: 'grass1', color: {type: 'float'}}).on('change',({value}) => {
      const {r,g,b} = value
      mat.uf.grassCol1.value.set(r,g,b)
    })
    pane?.addBinding(mat.uf.scale, 'value', {label: 'grassScale', min: 0, max: 6})
    pane?.addBinding(mat.uf.influenceRadius, 'value', {label: 'influenceRadius', min: 0, max: 10})
    pane?.addBinding(mat.uf.windScale, 'value', {label: 'windScale', min: 0.01, max: 5})
    pane?.addBinding(mat.uf.windSpeed, 'value', {label: 'windSpeed', min: 0.01, max: 10})
    pane?.addBinding(mat.uf.windAmp, 'value', {label: 'windAmp', min: 0.01, max: .6})
  }, [])



  return (
    // <mesh geometry={grassGeo}>
    //   <meshBasicMaterial  side={THREE.DoubleSide}/>
    // </mesh>
    <instancedMesh args={[grassGeo,undefined,count]}>
      <meshStandardNodeMaterial
        side={THREE.DoubleSide}
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        metalness={0}
        roughness={1}
      />
    </instancedMesh>
  )
}