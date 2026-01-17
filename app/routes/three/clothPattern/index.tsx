import { OrbitControls } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { asset } from '~/utils/asset'
import CustomShaderMaterial from 'three-custom-shader-material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { button, useControls } from 'leva'
import { useUniformTime } from '~/hook/useUniformTime'
import { Perf } from 'r3f-perf'

function Cloth() {
  const model = useLoader(GLTFLoader, asset('/model/cloths_zelda_sheikah.glb'))

  const geos = useMemo(() => {
    const geos: THREE.BufferGeometry[] = []
    model.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const geo = obj.geometry
        geos.push(geo)
      }
    })
    return geos
  }, [model])

  function randomCols(){
    return [...Array(geos.length)].map((item) => {
      return new THREE.Color().setHSL(Math.random(), 1, 0.5)
    })
  }

  const [colors, setColors] = useState(randomCols)

  useControls({
    randomColor: button(() => {
      setColors(randomCols())
    }),
  })

  const uniforms = {
    ...useUniformTime(),
    uPatternCol: new THREE.Uniform(new THREE.Color(0xe21d38)),
    uPatternScale: new THREE.Uniform(new THREE.Vector3(1,1,1)),
    uGlow: new THREE.Uniform(1.),
    uGrad1: new THREE.Uniform(0.),
    uGrad2: new THREE.Uniform(.1)
  }
  const pattern = useControls({
    col: { value: '#' + uniforms.uPatternCol.value.getHexString() },
    scale: {value: uniforms.uPatternScale.value.toArray(), step: .2},
    glow: uniforms.uGlow.value > 0,
    gradientInterval: {
      min: 0,
      max: 1,
      value: [uniforms.uGrad1.value, uniforms.uGrad2.value]
    }
  })
  useEffect(() => {
    uniforms.uPatternCol.value.set(pattern.col)
    uniforms.uPatternScale.value.set(...pattern.scale)
    uniforms.uGlow.value = (pattern.glow ? 1. : 0.)
    uniforms.uGrad1.value = pattern.gradientInterval[0]
    uniforms.uGrad2.value = pattern.gradientInterval[1]
    
  }, [pattern])

  return (
    <group>
      {geos.map((item, ndx) => {
        return (
          <mesh key={ndx} geometry={geos[ndx]}>
            <CustomShaderMaterial
              baseMaterial={THREE.MeshStandardMaterial}
              uniforms={uniforms}
              color={colors[ndx]}
              side={THREE.DoubleSide}
              vertexShader={ndx === 0 || ndx === 5 ? vertex : ''}
              fragmentShader={ndx === 0 || ndx === 5 ? fragment : ''}
              // roughness={.1}
              // metalness={.5}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function () {

  const {intensity} = useControls({
    intensity: {value: 1, min:.1, max:10}
  })

  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Perf position='top-left'/>
        <axesHelper args={[10]} />
        <OrbitControls makeDefault />
        <ambientLight />
        <directionalLight position={[2, 0, 2]} intensity={intensity} />

        <Cloth />
      </Canvas>
    </div>
  )
}
