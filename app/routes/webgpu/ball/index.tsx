import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three/webgpu";
import { Fn, sin, dot, smoothstep, length, time, vec3, vec4, instanceIndex, instancedArray, uniform, mx_noise_vec3, positionGeometry, cameraProjectionMatrix, modelViewMatrix, float, positionLocal, texture, mix, varying, vec2, oneMinus, uv, hash, deltaTime, If, fract, rotate, rotateUV, billboarding, distance, max, select, color, exp, pass, abs, normalLocal, normalGeometry, positionWorld, pow, floor, mod, cameraPosition } from "three/tsl";
import { useControls } from "leva";
import { asset } from "~/utils/asset";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { LineGeometry, MeshSurfaceSampler } from "three/examples/jsm/Addons.js";
import { lookAt, sin3 } from "~/utils/tsl";
import { getFibonacciSphere } from "~/utils/math";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useMouseRay } from "~/hook/useMouseRay";

function Base() {
  // const map = useTexture(asset("/img/texture/sbs/Milky 10 - 512x512.png"));
  const map = useTexture(asset("/img/texture/sbs/Vein 2 - 512x512.png"));
  // const map = useTexture(asset("/img/texture/sbs/Cracks 5 - 512x512.png"));
  const map2 = useTexture(asset("/img/texture/particle/spark_05.png"));
  // const map2 = useTexture(asset("/img/texture/particle/spark_07.png"));

  const uniforms = useMemo(() => ({
    uHitPos: uniform(new THREE.Vector3(9999,9999,9999)),
    uHitUV: uniform(new THREE.Vector2(9999,9999))
  }), [])
  

  const { mesh, geo, mat } = useMemo(() => {
    // const geo = new THREE.SphereGeometry(4, 128, 128)
    const geo = new THREE.TorusKnotGeometry(4,1,400,20)
    const mat = new THREE.MeshBasicNodeMaterial()
    mat.transparent = true
    mat.depthWrite = false
    mat.blending = THREE.AdditiveBlending
    mat.side = THREE.DoubleSide

    const colorNode = Fn(() => {
      const tex = (texture(map, uv()).r);
      const tex2 = (texture(map2, fract(uv().mul(vec2(4,1)).add(vec2(time, 0)))).r).mul(10)

      const col = vec3(1,0,0)

      const col2 = vec3(0,0,1).mul(tex2).mul(10)
      col.addAssign(col2)

      const dir = cameraPosition.sub(positionLocal).normalize()
      const fresnel = pow(oneMinus(abs(dot(dir, normalLocal))), 6.)
      const colFresnel = vec3(0,1,0).mul(fresnel).mul(3)
      col.addAssign(colFresnel)

      return vec4(col, tex);
    })()


    const positionNode = Fn(() => {
      const nor = normalLocal.toVar()
      const pos = positionLocal.toVar()
      const dist = length(pos.sub(uniforms.uHitPos))
      const range = float(3)
      const strength = smoothstep(range,0.,dist).mul(.5)
      const posOffset = nor.mul(strength)
      pos.addAssign(posOffset)

      return pos
    })()

    mat.colorNode = colorNode
    mat.positionNode = positionNode

    const mesh = new THREE.Mesh(geo, mat)

    return { mesh, geo, mat };
  }, [map]);

  const {rayCaster} =  useMouseRay()
  useFrame(() => {
    const intersect = rayCaster.intersectObject(mesh)
    if(intersect.length > 0) {
      const hitUV = intersect[0].uv
      const hitPos = intersect[0].point
      uniforms.uHitPos.value = hitPos
      hitUV && (uniforms.uHitUV.value = hitUV)
    }else{
      uniforms.uHitPos.value.set(999,999,999)
      uniforms.uHitUV.value.set(999,999)
    }
  })

  // useEffect(() => {
  //   return ()=> {
  //     geo.dispose()
  //     mat.dispose()
  //     mesh.parent?.remove(mesh)
  //   }
  // }, [geo,mat])

  return (
    <primitive object={mesh}/>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      {/* <ambientLight />
      <directionalLight position={[5, 10, 0]} intensity={10} /> */}
      {/* <axesHelper args={[10]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
      </Suspense>
    </WebGPUCanvas>
  );
}
