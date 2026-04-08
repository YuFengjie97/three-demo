import { OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three/webgpu";
import { Fn, sin, dot, smoothstep, length, time, vec3, vec4, instanceIndex, instancedArray, uniform, mx_noise_vec3, positionGeometry, cameraProjectionMatrix, modelViewMatrix, float, positionLocal, texture, mix, varying, vec2, oneMinus, uv, hash, deltaTime, If, fract, rotate, rotateUV, billboarding, distance, max, select, color } from "three/tsl";
import { useControls } from "leva";
import { asset } from "~/utils/asset";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { LineGeometry } from "three/examples/jsm/Addons.js";
import { Line2 } from "three/examples/jsm/lines/webgpu/Line2.js";
import { sin3 } from "~/utils/tsl";

function Base(){
  const {line, lineGeo, lineMat} = useMemo(() => {
    const lineGeo = new LineGeometry()
    const controlPoints: THREE.Vector3[] = []
    const controlNum = 10
    for(let i=0.;i<controlNum;i++){
      const x = i
      const y = i == 0 ? 0 : Math.random() * 2.
      const z = i == 0 ? 0 : Math.random() * 2.
      controlPoints.push(new THREE.Vector3(x,y,z))
    }
    const curve = new THREE.CatmullRomCurve3(controlPoints)
    const curvePointNum = 200
    const points = new Float32Array(curvePointNum * 3)
    for(let i=0.;i<curvePointNum;i++){
      const prog = i/curvePointNum
      const p = curve.getPointAt(prog)
      const i3 = i*3
      points[i3+0] = p.x
      points[i3+1] = p.y
      points[i3+2] = p.z
    }
    lineGeo.setPositions(points)

    const vPos = varying(positionLocal)

    const getPosition = Fn(() => {
      const pos = positionLocal
      const posOffset = sin(float(instanceIndex).add(time)).mul(2)
      pos.addAssign(posOffset)
      return pos
    })


    const getColor = Fn(() => {
      const colOffset = instanceIndex.mul(.5).add(time.mul(10))
      // const colOffset = dot(sin3(vPos), vec3(1.1))
      // const colOffset = vPos.y.mul(2)
      const col = sin3(vec3(3,2,1).add(colOffset)).mul(.5).add(.5)
      return vec3(col, .1)
    })

    const lineMat = new THREE.Line2NodeMaterial()
    // lineMat.color=new THREE.Color('red')
    lineMat.lineColorNode = getColor()
    // lineMat.colorNode = getColor() // 没用
    lineMat.linewidth = 20
    // lineMat.transparent = true
    // lineMat.depthWrite = false
    // lineMat.blending = THREE.AdditiveBlending
    // lineMat.positionNode = getPosition()  // 无效



    const line = new Line2(lineGeo, lineMat)
    return {line, lineGeo, lineMat}
  }, [])

  useEffect(() => {
    return () => {
      lineGeo.dispose()
      lineMat.dispose()
    }
  }, [])

  return <primitive object={line} />
}

export default function App() {
  return (
    <WebGPUCanvas>
      {/* <ambientLight /> */}
      {/* <directionalLight position={[5, 10, 0]} intensity={2} /> */}
      <axesHelper args={[10]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <Base />
        <Base />
        <Base />
      </Suspense>
    </WebGPUCanvas>
  );
}
