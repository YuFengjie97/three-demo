import { OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo } from "react";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { agxToneMapping, abs, asin, atan, cross, deltaTime, dot, float, floor, Fn, fract, fwidth, hash, If, instancedArray, instanceIndex, length, mat3, max, min, mix, mx_noise_float, mx_noise_vec3, mx_noise_vec4, normalLocal, oneMinus, PI, positionLocal, pow, pow3, rotateUV, select, smoothstep, step, storage, texture, time, TWO_PI, uniform, uv, varying, vec2, vec3, vec4, pass, acos, sin, Loop, cameraPosition, positionWorld, acesFilmicToneMapping, Break, exp } from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, expToneMapping, palette, rayBoxDist, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { sdBoxFrame } from "~/utils/tslSDF";
import { usePane } from "~/hook/usePane";


function RM(){

  const {uf, colorNode} = useMemo(() => {
    const uf = {
      boxSize: uniform(20),
      expose: uniform(.06),
      rmFactor: uniform(.5),
      sphereR: uniform(3)
    }

    const map = Fn(([p]: [THREE.Node<'vec3'>]) => {

      // xor turbulence
      const q = p
      const freq = float(.5)
      Loop(8, (i) => {
        q.addAssign(   sin3(q.zxy.mul(freq).add(time.mul(2))).div(freq)   )
        freq.mulAssign(2.)
      })


      const d = length(q).sub(uf.sphereR)
      // const d = sdBoxFrame(p, vec3(1), float(.6))
      return d;
    })


    const colorNode = Fn(() => {
      const ro = cameraPosition
      const rd = positionWorld.sub( cameraPosition ).normalize();
      const t = rayBoxDist(ro, rd, vec3(uf.boxSize.div(2)));
      const z = t.x.max(0.0).toVar();
      const zMax = t.y.toVar()
      const p = vec3(0)
      const col = vec3(0)


      Loop(100, ({i}) => {
        p.assign(ro.add(rd.mul(z)))

        If(z.greaterThan(zMax), ()=>Break())

        const d = map(p)
        // d.assign(max(.01, abs(d).mul(1)))

        const glow = float(.1).div(abs(d).add(.01))
        const c = sin3(vec3(3,2,1)
                  .add(p.x)
                  )
                  .mul(.5).add(.5)
                  .mul(glow)
        col.addAssign(c)

        z.addAssign(d.mul(uf.rmFactor))
      })

      col.assign(agxToneMapping(col, uf.expose))
      // col.assign(expToneMapping(col))
      return col
    })()

    return {uf, colorNode}
  }, [])

  const {pane} = usePane()
  useEffect(() => {
    pane.addBinding(uf.expose,'value',{label:'expose', min:0,max:1})
    pane.addBinding(uf.rmFactor,'value',{label:'rmFactor', min:0,max:1})
    pane.addBinding(uf.sphereR,'value',{label:'sphereR', min:0,max:5})
  }, [])

  return (
    <mesh>
      <boxGeometry args={[uf.boxSize.value,uf.boxSize.value,uf.boxSize.value]}/>
      <meshBasicNodeMaterial colorNode={colorNode} />
    </mesh>
  )
}

function Base(){
  const {camera} = useThree()
  camera.position.set(0,0,20)
  return(
    <RM />
  )
}


export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1}/>
      {/* <directionalLight position={[0, 0, 20]} intensity={1.1} /> */}
      <axesHelper args={[20]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
      </Suspense>
    </WebGPUCanvas>
  );
}