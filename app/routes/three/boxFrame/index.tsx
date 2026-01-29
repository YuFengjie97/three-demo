import { Instance, Instances, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { asset } from '~/utils/asset'
import * as THREE from 'three'
import { useRef } from 'react'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

const { random, sin, pow } = Math

const data = Array.from({ length: 20 }, (item, i) => {
  const color = new THREE.Vector3(3, 2, 1).add(new THREE.Vector3(i, i, i))
  color.x = 2. * (sin(color.x)*.5+.5)
  color.y = 2. * (sin(color.y)*.5+.5)
  color.z = 2. * (sin(color.z)*.5+.5)

  return {
    ndx: i,
    scale: pow(.7, i),
    color: color
  }
})


function BoxFrames() {
  const { nodes, materials } = useGLTF(asset('/model/boxframe.glb'))

  return (
    <Instances geometry={nodes.boxframe.geometry}>
      <meshBasicMaterial />
      {data.map((item, i) => {
        return <BoxFrame key={i} {...item} />
      })}
    </Instances>
  )
}

function BoxFrame(props) {
  const ref = useRef<THREE.Mesh>(null!)
  const { scale, ndx, color} = props

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    ref.current.rotation.x = .01 * ndx + t*ndx*.1
    ref.current.rotation.z = .01 * ndx + t*ndx*.1
  })

  return <Instance ref={ref} scale={scale} color={color} />
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{position: [0,0,2]}}>
        <Perf position='top-left'/>
        {/* <axesHelper /> */}
        <OrbitControls makeDefault />
        <ambientLight />
        <BoxFrames />
        <EffectComposer>
          <Bloom/>
        </EffectComposer>
      </Canvas>
    </div>
  )
}
