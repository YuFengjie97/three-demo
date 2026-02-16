import { OrbitControls } from '@react-three/drei'
import { Canvas, extend } from '@react-three/fiber'
import { Line2, LineGeometry, LineMaterial } from 'three/examples/jsm/Addons.js'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { useMemo } from 'react'

extend({ Line2 })

function Base() {
  const { geo, mat } = useMemo(() => {
    const geo = new LineGeometry()
    // const geo2 = new THREE.IcosahedronGeometry()
    const geo2 = new THREE.BoxGeometry()
    const position = geo2.getAttribute('position').array as Float32Array
    geo.setPositions(position)


    const mat = new LineMaterial({ linewidth: 5 })
    mat.onBeforeCompile = (shader) => {
      console.log(shader.fragmentShader);
      
    }

    return {geo, mat}
  }, [])

  return (
    // @ts-ignore
    <line2 geometry={geo} material={mat} />
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        <axesHelper args={[10]} />
        <OrbitControls />

        <Base />
      </Canvas>
    </div>
  )
}
