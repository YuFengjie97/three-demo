import { Billboard, OrbitControls, Text, Text3D, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Glitch, GodRays } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { asset } from '~/utils/asset'
import { useUniformTime } from '~/hook/useUniformTime'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import text from './text'

const { random, floor } = Math

function Skull({ref}){
  const { nodes, materials } = useGLTF(asset('/model/skull-transformed.glb'))
  return (
    <mesh ref={ref} scale={10} position={[0,0,-10]} geometry={nodes.Object_2.geometry} rotation-x={-Math.PI/2}>
      <meshStandardMaterial roughness={.1} metalness={.8} color={'#d63031'} />
    </mesh>
  )
}

function Base() {
  // const fontUrl = asset('/font/typeface/helvetiker_regular.typeface.json')
  // const fontUrl = asset('/font/typeface/STXingkai_Regular.json')
  // const fontUrl = asset('/font/ttf/STXINWEI.TTF')
  const fontUrl = asset('/font/ttf/subset-STXINWEI.TTF')
  const strs = text.split(/\n\s|，/)
  const count = 400

  const data = useMemo(() => {
    return Array.from({ length: count }, (item, index) => {
      const str = strs[floor(random()*strs.length)]
      const x = (random() - 0.5) * 20
      const y = (random() - 0.5) * 15
      const z = (-random()) * 15
      const pos = [x, y, z] as [number, number, number]
      return {
        str,
        pos,
      }
    })
  }, [count])

  const uniformTime = useUniformTime()

  const uniforms = { ...uniformTime }

  const mat = useMemo(() => {
    const mat = new CustomShaderMaterial({
      uniforms,
      baseMaterial: THREE.MeshBasicMaterial,
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      transparent: true,
      alphaTest: .1,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    return mat
  }, [])

  function onSync(i: number) {
    return function (m: any) {
      const geo = m.geometry as THREE.BufferGeometry
      const count = geo.getAttribute('position').count
      const ids = new Float32Array(count).fill(i)
      geo.setAttribute('aTextId', new THREE.BufferAttribute(ids, 1))
    }
  }

  return data.map((item, i) => {
    return (
      <Text
        key={i}
        position={item.pos}
        font={fontUrl}
        material={mat}
        onSync={onSync(i)}
      >
        {item.str}
      </Text>
    )
  })
}

export default function () {
  const lightSource = useRef(null)

  return (
    <div className='h-screen'>
      <Canvas>
        <fog attach={'fog'} args={['#000000', 10, 20]} />

        {/* <Perf position='top-left' /> */}
        {/* <axesHelper args={[10]} /> */}
        <directionalLight position={[0,5,10]} />
        {/* <OrbitControls /> */}

        <Base />

        {/* <Skull ref={lightSource} /> */}

        <EffectComposer>
          {/* <Bloom/> */}
          <Glitch
            delay={[2, 2.5]} // min and max glitch delay
            duration={[0.1, 0.12]} // min and max glitch duration
            strength={[0.2, .3]} // min and max glitch strength
            ratio={0.85} //
          />
          {/* <GodRays sun={lightSource} /> */}
        </EffectComposer>
      </Canvas>
    </div>
  )
}
