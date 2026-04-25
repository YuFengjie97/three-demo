import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useContext, useEffect, useMemo } from "react";
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

  const { nodes, materials } = useGLTF(asset('/model/hexagonBall-transformed.glb'))
  // @ts-ignore
  const geo:THREE.BufferGeometry = nodes.ball.geometry
  const pos = attribute<'vec3'>('_pos', 'vec3')
  const vCol = varying(vec3(0))

  const mat = useMemo(() => {
    const uf = {
      noiseOffset: uniform(0)
    }

    const positionNode = Fn(() => {
      const offsetRange = smoothstep(0., 1, mx_noise_float(pos.mul(.5).add(aa!.subBeatControl.beatAcc.mul(1.1))))
      const offsetStrength = aa!.subBeatControl.beatActive.mul(2)
      const offsetDir = pos
      const offset = offsetDir.mul(offsetStrength).mul(offsetRange)
      
      const col = sin3(colSeed.add(  dot(cos3(pos.mul(2)), cos3(pos.mul(2)))  )).mul(.5).add(.5)
      vCol.assign(col)


      return positionLocal.add(offset)
    })()
    const colorNode = Fn(() => {
      return vCol.mul(2)
    })()
    return {positionNode, colorNode, uf}
  }, [])



  return (
    <mesh geometry={geo} renderOrder={2}>
      <meshPhysicalNodeMaterial 
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        transmission={1}
        ior={1.5}
        thickness={1}
        metalness={0}
        roughness={0}
      />
    </mesh>
  )
}