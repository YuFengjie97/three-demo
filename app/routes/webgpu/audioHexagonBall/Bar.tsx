import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useContext, useMemo } from "react";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { abs, asin, atan, cross, deltaTime, dot, float, floor, Fn, fract, fwidth, hash, If, instancedArray, instanceIndex, length, mat3, max, min, mix, mx_noise_float, mx_noise_vec3, mx_noise_vec4, normalLocal, oneMinus, PI, positionLocal, pow, pow3, rotateUV, select, smoothstep, step, storage, texture, time, TWO_PI, uniform, uv, varying, vec2, vec3, vec4, pass, acos, sin, attribute } from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, palette, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import BaseContext from "./context";

export default function Ball(){
  const {pane, aa, colSeed} = useContext(BaseContext);

  const { nodes, materials } = useGLTF(asset('/model/hexagonBar-transformed.glb'))
  // @ts-ignore
  const geo:THREE.BufferGeometry = nodes.bar.geometry
  
  const pos = attribute<'vec3'>('_pos', 'vec3')
  const vCol = varying(vec4(0))

  const mat = useMemo(() => {

    const positionNode = Fn(() => {
      const offsetRange = smoothstep(0., 1, mx_noise_float(pos.add(aa!.subBeatControl.beatAcc.mul(1.1))))
      const beatActive = aa!.subBeatControl.beatActive
      const len = 10
      const offsetStrength = beatActive.mul(len)
      const offsetDir = pos
      const offset = offsetDir.mul(offsetStrength).mul(offsetRange)

      const p = positionLocal.add(offset)
      const dist = length(p).sub(3).div(len) // 这里的减数来自建模初始大小
      
      const col = (sin3(colSeed.add(  dot(pos, vec3(2.))  )).mul(.5).add(.5)).mul(2)

      col.assign(mix(vec4(col, 0),   vec4(col.mul(20), 1),   smoothstep(.7,.9,dist)))
      vCol.assign(col)

      return positionLocal.add(offset)
    })()
    const colorNode = Fn(() => {
      return vCol
    })()
    return {positionNode, colorNode}
  }, [])

  return (
    <mesh geometry={geo} renderOrder={1}>
      <meshStandardNodeMaterial 
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        transparent={true}
      />
    </mesh>
  )
}