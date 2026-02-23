import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";

function Base(){
  const count = 10
  // const {geo} = useMemo(() => {

  // }, [])

  return(
    <></>
  )
}

export default function(){
  return(
    <div className="h-screen">
      <Canvas>
        <axesHelper args={[10]} />
        <OrbitControls />

        <Base/>
      </Canvas>
    </div>
  )
}