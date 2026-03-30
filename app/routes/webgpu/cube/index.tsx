import * as THREE from 'three/webgpu'
import { Fn, sin, length, mul, add, div, pow, float, abs, time, positionLocal, vec3,vec4, smoothstep, uniform } from 'three/tsl'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { asset } from '~/utils/asset'
import { useControls } from 'leva'

extend(THREE as any)

function Base() {
  const tex = useTexture(asset('/img/texture/fulu/1.jpg'))

  const {col} = useControls({
    col: '#ff0000'
  })
  
  

  const { mat, geo, mesh } = useMemo(() => {
    const colUniform = uniform(new THREE.Color(col))
    const fsMain = Fn(() => {
      const p = positionLocal.toVar()

      let d = sin(length(p).mul(10).add(time.mul(-1))).div(10)
      d.assign(pow(float(0.05).div(abs(d)), 2)) // d = pow(.05/abs(d), 2)

      return vec4(colUniform, d);
    })

    // const geo = new THREE.PlaneGeometry(1, 1)
    const geo = new THREE.BoxGeometry(2, 2, 2)
    const mat = new THREE.NodeMaterial()
    mat.side = THREE.DoubleSide
    mat.transparent = true
    mat.alphaTest = .1;
    // mat.fragmentNode = TSL.color('crimson')
    // mat.fragmentNode = TSL.texture(tex).mul(TSL.color('red'))
    // mat.fragmentNode = TSL.positionLocal
    mat.fragmentNode = fsMain()

    const mesh = new THREE.Mesh(geo, mat)

    return {
      geo,
      mat,
      mesh,
    }
  }, [col])

  const { gl, scene, camera } = useThree()
  useEffect(() => {
    gl.debug.getShaderAsync(scene, camera, mesh).then((e) => {
      //console.log(e.vertexShader)
      console.log(e.fragmentShader)
    })
  }, [])

  return <primitive object={mesh} />

  // return (
  //   <mesh>
  //     <primitive object={geo}/>
  //     <primitive object={mat} />
  //   </mesh>
  // )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas
        camera={{ position: [0, 0, 10] }}
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props as any)
          await renderer.init()
          return renderer
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />
        <Base />
      </Canvas>
    </div>
  )
}
