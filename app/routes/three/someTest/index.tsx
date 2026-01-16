import { AccumulativeShadows, Environment, OrbitControls, PivotControls, RandomizedLight, Trail } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useEffect, useRef } from "react";
import * as THREE from 'three'



function Tail1(){

  const ref = useRef<THREE.Mesh>(null!)
  useFrame((state,delta) => {
    const t = state.clock.getElapsedTime()
    ref.current.position.x = Math.cos(t) * 2
    ref.current.position.z = Math.sin(t) * 2
  })

  return (
    <Trail
      width={1.2} // Width of the line
      color={'hotpink'} // Color of the line
      length={2} // Length of the line
      decay={1} // How fast the line fades away
      local={false} // Wether to use the target's world or local positions
      stride={0} // Min distance between previous and current point
      interval={1} // Number of frames to wait before next calculation
      target={undefined} // Optional target. This object will produce the trail.
      attenuation={(width) => width} // A function to define the width in each point along it.
    >
      {/* If `target` is not defined, Trail will use the first `Object3D` child as the target. */}
      
      <mesh ref={ref} scale={.1}>
        <sphereGeometry />
        <meshBasicMaterial />
      </mesh>

      {/* You can optionally define a custom meshLineMaterial to use. */}
      {/* <meshLineMaterial color={"red"} /> */}
    </Trail>

  )
}

export default function main(){
  return (
    <>
    <div className="h-screen">
      <Canvas>
        <Perf position="top-left"/>
        <OrbitControls makeDefault />
        {/* <Environment preset="city" background blur={1} /> */}
        <directionalLight shadow-mapSize={1024} position={[2,2,-4]} intensity={2}  />
        {/* <PivotControls depthTest={false}>
          <mesh  >
            <boxGeometry />
            <meshStandardMaterial />
          </mesh>
        </PivotControls> */}
        {/* <mesh  position-y={-0.1} rotation-x={-Math.PI/2.}>
          <planeGeometry args={[10,10,10]}/>
          <meshStandardMaterial roughness={0} metalness={.9}/>
        </mesh> */}

        <Tail1 />
      </Canvas>
    </div>
    </>
  )
}