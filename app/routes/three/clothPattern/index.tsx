import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  useGLTF,
  useTexture,
} from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { asset } from '~/utils/asset'
import CustomShaderMaterial from 'three-custom-shader-material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { button, useControls } from 'leva'
import { useUniformTime } from '~/hook/useUniformTime'
import { Perf } from 'r3f-perf'

function Cloth() {
  const { nodes } = useGLTF(asset('/model/cloths_zelda_sheikah.glb'))

  const meshData = useMemo(() => {
    return Object.values(nodes)
      .map((item) => {
        if (
          item instanceof THREE.Mesh &&
          (item.name === 'defaultMaterial' || item.name === 'defaultMaterial_5')
        ) {
          return {
            geo: item.geometry as THREE.BufferGeometry,
            matrix: item.matrix.clone(),
            name: item.name,
          }
        }
      })
      .filter((item) => item)
  }, [nodes])

  function randomCols() {
    return [...Array(meshData.length)].map(() => {
      return new THREE.Color().setHSL(Math.random(), 0.6, 0.2)
    })
  }

  const [colors, setColors] = useState(randomCols)
  useEffect(() => {
    setColors(randomCols())
  }, [meshData])

  const uniformTime = useUniformTime()

  const uniforms = useMemo(() => {
    return {
      ...uniformTime,
      uPatternCol: new THREE.Uniform(new THREE.Color(0xe21d38)),
      uPatternScale: new THREE.Uniform(new THREE.Vector3(1, 1, 1)),
      uPatternOffset: new THREE.Uniform(new THREE.Vector3(1, 1, 1)),
      uGlow: new THREE.Uniform(0),
      uGrad1: new THREE.Uniform(0),
      uGrad2: new THREE.Uniform(0.1),
    }
  }, [])
  const pattern = useControls({
    randomColor: button(() => {
      setColors(randomCols())
    }),
    col: { value: '#' + uniforms.uPatternCol.value.getHexString() },
    scale: { value: uniforms.uPatternScale.value.toArray(), step: 0.2 },
    offset: { value: uniforms.uPatternOffset.value.toArray(), step: 0.1 },
    glow: uniforms.uGlow.value > 0,
    gradientInterval: {
      min: 0,
      max: 1,
      value: [uniforms.uGrad1.value, uniforms.uGrad2.value],
      render: (get) => !get('glow'),
    },
  })
  useEffect(() => {
    uniforms.uPatternCol.value.set(pattern.col)
    uniforms.uPatternScale.value.set(...pattern.scale)
    uniforms.uPatternOffset.value.set(...pattern.offset)
    uniforms.uGlow.value = pattern.glow ? 1 : 0
    uniforms.uGrad1.value = pattern.gradientInterval[0]
    uniforms.uGrad2.value = pattern.gradientInterval[1]
  }, [pattern])

  return (
    <Float
      speed={1}
      rotationIntensity={0}
      floatIntensity={1}
      // floatingRange={[1, 10]}
    >
      <group>
        {meshData.map((item, ndx) => {
          return (
            <mesh key={ndx} geometry={item?.geo} matrix={item?.matrix}>
              <CustomShaderMaterial
                baseMaterial={THREE.MeshPhysicalMaterial}
                uniforms={uniforms}
                color={colors[ndx]}
                side={THREE.DoubleSide}
                vertexShader={vertex}
                fragmentShader={fragment}
                // vertexShader={ndx === 0 || ndx === 5 ? vertex : ''}
                // fragmentShader={ndx === 0 || ndx === 5 ? fragment : ''}
                roughness={0.8}
                metalness={0}
                sheen={1.0} // 开启绒毛
                sheenColor='#ff8e8e' // 绒毛颜色比底色亮/粉，模拟反光
                sheenRoughness={0.5} // 绒毛的扩散度
              />
            </mesh>
          )
        })}
      </group>
    </Float>
  )
}

function Env(){
  const tex = useTexture(asset('/img/texture/matcap/3E2335_D36A1B_8E4A2E_2842A5.png'))
  // const tex = useTexture(asset('/img/texture/particle/spark_02.png'))
  return (
    <Environment
      // files={asset('/img/hdr/potsdamer_platz_1k.hdr')}
      blur={1.}
      background
    >
      <mesh scale={10}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial map={tex}  side={THREE.BackSide} />
      </mesh>
    </Environment>
  )
}



export default function () {
  const { intensity } = useControls({
    intensity: { value: 1, min: 0.1, max: 10 },
  })

  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [0, 0, 2] }}>
        <Perf position='top-left' />
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls makeDefault />
        <ambientLight />
        <directionalLight position={[2, 0, 2]} intensity={intensity} />

        <Cloth />
        <ContactShadows
          position={[0, -1, 0]}
          opacity={1}
          scale={10}
          blur={2}
          far={10}
          resolution={256}
          color='#000000'
        />

        <Env />

      </Canvas>
    </div>
  )
}
