import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useMemo } from "react";
import * as THREE from 'three'
import CustomShaderMaterial from "three-custom-shader-material";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import threadVertex from './thread.vertex.glsl'
import threadFragment from './thread.fragment.glsl'
import { useUniformTime } from "~/hook/useUniformTime";
import { Bloom, EffectComposer } from "@react-three/postprocessing";


function Threads(){

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
  }


  const {geo} = useMemo(() => {
    const icoGeo = new THREE.IcosahedronGeometry(3, 3)
    const icoPosAttr = icoGeo.getAttribute('position')
    const count = icoPosAttr.count
    const geos = []
    for(let i=0.;i<count;i++){
      const x = icoPosAttr.getX(i)
      const y = icoPosAttr.getY(i)
      const z = icoPosAttr.getZ(i)
      const p = new THREE.Vector3(x,y,z)
      const lineCurve = new THREE.LineCurve3(new THREE.Vector3(0,0,0), p)
      const tubeGeo = new THREE.TubeGeometry(lineCurve, 80, .01, 4, false)
      geos.push(tubeGeo)
    }
    const geo = mergeGeometries(geos)
    return { geo }
  }, [])

  return (
    <mesh geometry={geo}>
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.MeshBasicMaterial}
        vertexShader={threadVertex}
        fragmentShader={threadFragment}
        // transparent={true}
        depthWrite={false}
        // blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        toneMapped={false}
        // wireframe
      />
    </mesh>
  )
}

function Base(){
  return (
    <Threads/>
  )
}

export default function(){
  return(
    <div className="h-screen">
      <Canvas dpr={[1, 2]}>
        <OrbitControls />
        
        {/* <axesHelper args={[10]}/> */}
        {/* <Perf position="top-left"/> */}
        {/* <ambientLight intensity={10}/> */}

        <Base/>


        <EffectComposer>
          <Bloom/>
        </EffectComposer>
      </Canvas>
    </div>
  )
}