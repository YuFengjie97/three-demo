import { useGLTF } from "@react-three/drei";
import { useContext, useEffect, useMemo } from "react";
import { abs, asin, atan, cross, deltaTime, dot, float, floor, Fn, fract, fwidth, hash, If, instancedArray, instanceIndex, length, mat3, max, min, mix, mx_noise_float, mx_noise_vec3, mx_noise_vec4, normalLocal, oneMinus, PI, positionLocal, pow, pow3, rotateUV, select, smoothstep, step, storage, texture, time, TWO_PI, uniform, uv, varying, vec2, vec3, vec4, pass, acos, sin, attribute } from "three/tsl";
import * as THREE from "three/webgpu";
import { asset } from "~/utils/asset";
import { cos3, sin3 } from "~/utils/tsl";
import BaseContext from "./context";

export default function Ball(){
  const {pane, aa, colSeed} = useContext(BaseContext);

  const { nodes, materials } = useGLTF(asset('/model/hexagonFace-transformed.glb'))
  // @ts-ignore
  const geo:THREE.BufferGeometry = nodes.face.geometry
  
  const pos = attribute<'vec3'>('_pos', 'vec3')
  const vCol = varying(vec3(0))


  const mat = useMemo(() => {

    const uf = {
      colStrength: uniform(.3)
    }

    const positionNode = Fn(() => {
      const beatActive = aa!.subBeatControl.beatActive
      const beatAcc = aa!.subBeatControl.beatAcc
      
      // const col = sin3(vec3(3,2,1).add(  dot(cos3(pos.mul(.4)), cos3(pos.zxy.mul(.4))).mul(10)  ) .add(aa!.subBeatControl.beatAcc.mul(.4)) .add(time)   ).mul(.5).add(.5)
      // vCol.assign(col.mul(uf.colStrength))

      // const col = sin3(vec3(3,2,1).add(  dot(normalLocal, vec3(1)).mul(2).add(time)   )   ).mul(.5).add(.5)
      // vCol.assign(col.mul(uf.colStrength))

      const col = sin3(colSeed.add(  mx_noise_float(pos.mul(.4)).mul(4)  ) .add(beatAcc.mul(.4)) .add(time)   ).mul(.5).add(.5)
      const bloomStrength = step(0.5,mx_noise_float(pos.mul(4)  .add(beatAcc) )).mul(3)
      vCol.assign(col.mul(uf.colStrength  .add(bloomStrength)    ))

      return positionLocal
    })()


    const colorNode = Fn(() => {
      return vCol
    })()
    
    
    return {positionNode, colorNode,uf}
  }, [])


  useEffect(() => {
    pane?.addBinding(mat.uf.colStrength, 'value', {label: 'background', min:.1, max: 2})
  }, [])

  return (
    <>
    <mesh geometry={geo} scale={40}>
      <meshBasicNodeMaterial 
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        side={THREE.DoubleSide}
      />
    </mesh>
    </>
  )
}