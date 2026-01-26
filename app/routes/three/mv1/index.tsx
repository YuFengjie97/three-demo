import {
  Center,
  Environment,
  Loader,
  MeshReflectorMaterial,
  OrbitControls,
  useTexture,
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { asset } from '~/utils/asset'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'
import { useMemo, useRef } from 'react'
import { button, useControls } from 'leva'
import { useAudioAnalyser } from '~/hook/useAudioAnalyser'
import CustomShaderMaterial from 'three-custom-shader-material'
import ringVertex from './ringVertex.glsl'
import ringFragment from './ringFragment.glsl'
import { useUniformTime } from '~/hook/useUniformTime'
import patternFragment from './patternFragment.glsl'
import patternVertex from './patternVertex.glsl'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

type AudioApiRT = ReturnType<typeof useAudioAnalyser>


function Cube({ audioApi }: { audioApi: AudioApiRT }) {
  const tex = useTexture(
    asset('/img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png'),
  )
  const cubeSize = 0.1 // 半径
  const cubeGap = 0.02

  const { geo, mat } = useMemo(() => {
    const geo = new THREE.BoxGeometry()
    geo.translate(0, 0.5, 0)
    const mat = new THREE.MeshMatcapMaterial({ matcap: tex })
    return { geo, mat }
  }, [])
  const count = 40
  const cubePosX = useMemo(() => {
    const pos = []
    for (let i = 0; i < count; i++) {
      const x = i * cubeSize + (i - 1) * cubeGap
      pos.push(x)
    }
    return pos
  }, [count])

  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }, delta) => {
    const { analyser, lerpFreqData } = audioApi
    
    if (!analyser) return

    groupRef.current.children.forEach((item, ndx) => {
      const dataNdx = Math.floor(
        (ndx / count) * (analyser.analyser.fftSize / 2),
      )
      const height = Math.max(0.01, lerpFreqData[dataNdx] * 2)

      item.scale.set(...[cubeSize, height, cubeSize])
    })
  })

  return (
    <Center disableY>
      <group ref={groupRef}>
        {cubePosX.map((item, ndx) => {
          return (
            <mesh
              key={ndx}
              position-x={item}
              scale={[cubeSize, 0, cubeSize]}
              geometry={geo}
              material={mat}
            ></mesh>
          )
        })}
      </group>
    </Center>
  )
}

function Ring({audioApi}: { audioApi: AudioApiRT }) {
  const geo = useMemo(() => {
    const geo = new THREE.TorusGeometry(3, .2, 10, 80)
    geo.translate(0,.1,0)
    geo.rotateX(Math.PI/2)
    return geo

    // const geo = new THREE.IcosahedronGeometry(.4, 30);
    // return geo
  }, [])

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    uFreqTex: new THREE.Uniform(audioApi.dataTex)
  }

  return (
    <mesh geometry={geo}>
      <CustomShaderMaterial
        baseMaterial={THREE.MeshStandardMaterial}
        uniforms={uniforms}
        vertexShader={ringVertex}
        fragmentShader={ringFragment}
        // roughness={.1}
        // metalness={.5}
        // depthWrite={false}
        // transparent={false}
        // alphaTest={0.01}
      />
    </mesh>
  )
}

function Pattern({audioApi}: {audioApi: AudioApiRT}){

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    uFreqTex: new THREE.Uniform(audioApi.dataTex)
  }

  return <mesh scale={40} rotation-x={-Math.PI/2}>
    <planeGeometry />
    <CustomShaderMaterial
      baseMaterial={THREE.MeshBasicMaterial}
      uniforms={uniforms}
      vertexShader={patternVertex}
      fragmentShader={patternFragment}
      side={THREE.DoubleSide}
      transparent={true}
    />
  </mesh>
}

function MirrorPlane() {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.1} scale={40}>
      <planeGeometry args={[1, 1]} />
      <MeshReflectorMaterial
        // blur={[10, 10]}
        resolution={1024}
        // mixBlur={1}
        // mixStrength={15}
        // depthScale={1}
        // minDepthThreshold={0.85}
        color='#151515'
        metalness={0.8}
        roughness={0.0}
      />
      {/* <meshStandardMaterial /> */}
    </mesh>
  )
}

function Wrap() {
  const audioApi = useAudioAnalyser(
    asset('/sound/hero.mp3')
    // asset('/sound/shaderToy_5.mp3'),
    // asset('/sound/savageLove.aac')
  )

  useControls({
    play: button(() => {
      const {sound} = audioApi
      if (sound && !sound.isPlaying) {
        audioApi.sound?.play()
      }
    }),
    pause: button(() => {
      const {sound} = audioApi
      if (sound && sound.isPlaying) {
        sound.pause()
      }
    }),
  })

  return (
    <>
      <Cube audioApi={audioApi} />
      {/* <Ring audioApi={audioApi}/> */}
      <Pattern audioApi={audioApi}/>
    </>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [-2, 1, 3] }}>
        <color attach={'background'} args={['#000']} />
        <fog attach={'fog'} args={['#000', 0.1, 10]} />
        <Perf position='top-left' />
        <ambientLight />
        <directionalLight position={[0, 10, 0]} intensity={20} />

        <axesHelper args={[10]} />
        <OrbitControls makeDefault />
        <Wrap />
        {/* <MirrorPlane /> */}

        {/* <Env /> */}
         {/* <EffectComposer>
          <Bloom />
        </EffectComposer> */}
      </Canvas>
      <Loader />
    </div>
  )
}
