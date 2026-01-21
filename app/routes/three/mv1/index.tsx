import {
  Center,
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
  useTexture,
} from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { asset } from '~/utils/asset'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'
import { useMemo, useRef, type RefObject } from 'react'
import { button, useControls } from 'leva'
import { useAudioAnalyser } from '~/hook/useAudioAnalyser'

function Env() {
  const tex = useTexture(
    asset('/img/texture/matcap/3E2335_D36A1B_8E4A2E_2842A5.png'),
    // asset('/img/texture/particle/spark_05.png'),
  )
  tex.repeat.set(2, 2)
  tex.wrapS = THREE.MirroredRepeatWrapping
  tex.wrapT = THREE.MirroredRepeatWrapping
  // tex.minFilter = THREE.NearestFilter
  // tex.magFilter = THREE.NearestFilter

  return (
    <Environment blur={1} background>
      <mesh scale={20}>
        <icosahedronGeometry args={[1, 32]} />
        <meshBasicMaterial map={tex} side={THREE.BackSide} />
      </mesh>
    </Environment>
  )
}

function Cube() {
  const tex = useTexture(
    asset('/img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png'),
  )
  const cubeSize = 0.1 // 半径
  const cubeGap = 0.02
  const audioApi = useAudioAnalyser(
    // asset('/sound/hero.mp3')
    asset('/sound/savageLove.aac')
  )
  console.log(audioApi)

  const{lerpV}=useControls({
    lerpV: {value: .3, min:0, max: 1,step: .1},
    play: button(() => {
      const { sound } = audioApi
      if (sound && !sound.isPlaying) {
        sound?.play()
      }
    }),
    pause: button(() => {
      const { sound } = audioApi

      if (sound && sound.isPlaying) {
        sound.pause()
      }
    }),
  })

  const { geo, mat } = useMemo(() => {
    const geo = new THREE.BoxGeometry()
    geo.translate(0, 0.5, 0)
    const mat = new THREE.MeshMatcapMaterial({ matcap: tex })
    return { geo, mat }
  }, [])
  const { count } = useControls({
    count: { value: 40, min: 1, max: 80, step: 1 },
  })
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
    const { analyser, getLerpFreqData } = audioApi
    if (!analyser) return

    const freqData = getLerpFreqData(lerpV)

    groupRef.current.children.forEach((item, ndx) => {
      const dataNdx = Math.floor(
        (ndx / count) * (analyser.analyser.fftSize / 2),
      )
      const height = Math.max(0.01, freqData[dataNdx] * 2)

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

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [-2, 1, 3] }}>
        <color attach={'background'} args={['#191920']} />
        <fog attach={'fog'} args={['#191920', 0.1, 20]} />
        <Perf position='top-left' />
        <ambientLight />
        <directionalLight position={[10, 10, -10]} intensity={100} />

        {/* <axesHelper args={[10]} /> */}
        <OrbitControls makeDefault />

        <Cube />

        <MirrorPlane />

        {/* <Env /> */}
      </Canvas>
    </div>
  )
}
