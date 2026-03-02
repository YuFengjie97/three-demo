import { Loader, OrbitControls, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import CustomShaderMaterial from 'three-custom-shader-material'
import * as THREE from 'three'
import { createContext, Suspense, useContext, useMemo } from 'react'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import { useUniformTime } from '~/hook/useUniformTime'
import { useControls } from 'leva'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { asset } from '~/utils/asset'
import VS from './vertex.glsl'
import FS from './fragment.glsl'
import { Perf } from 'r3f-perf'

const { sin } = Math

function getPointBySample(posPre: THREE.Vector3, bFactor: number) {
  // const bFactor = 0.19
  // vec3 v = sin(p.yzx)- bFactor * p;

  const p = posPre.clone()
  const v = new THREE.Vector3(sin(p.y), sin(p.z), sin(p.x)).sub(
    p.multiply(new THREE.Vector3(bFactor, bFactor, bFactor)),
  )

  const pNext = posPre.clone().add(v)
  return pNext
}

function Base() {
  const sampleCount = 300
  // const bFactor = .19

  const {bFactor, count, speed} = useControls({
    bFactor: {
      value: .19,
      min: 0.01,
      max: .3,
      stpe: 0.01
    },
    count: {
      value: 50,
      min: 1.,
      max: 200,
      step: 1,
    },
    speed: {
      value: .04,
      min:0.,
      max: .5,
      step: .01,
    }
  })

  const { points, curve, tubeGeo } = useMemo(() => {
    let points: THREE.Vector3[] = [new THREE.Vector3(1, 0, 0)]
    for (let i = 0; i < sampleCount; i++) {
      const p = points[points.length - 1].clone()
      const p1 = getPointBySample(p, bFactor)
      points.push(p1)
    }
    // points = [new THREE.Vector3(0,0,0), new THREE.Vector3(1,1,0), new THREE.Vector3(2,0,0)]
    const curve = new THREE.CatmullRomCurve3(points)
    const tubeGeo = new THREE.TubeGeometry(curve, 3000, .05, 8,)
    // console.log(points, tubeGeo);

    return { points, curve, tubeGeo }
  }, [sampleCount, bFactor])

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    count: new THREE.Uniform(count),
    speed: new THREE.Uniform(speed)
    // count: new THREE.Uniform(30),
    // speed: new THREE.Uniform(.04)
  }

  // 为什么这里不行
  // useControls({
  //   count: {
  //     value: uniforms.count.value,
  //     min: 1.,
  //     max: 60,
  //     step: 1,
  //     onChange(v){
  //       uniforms.count.value = v
  //     }
  //   },
  //   speed: {
  //     value: uniforms.speed.value,
  //     min:0.,
  //     max: 2.,
  //     step: .01,
  //     onChange(v){
  //       uniforms.speed.value = v
  //     }
  //   }
  // })

  return (
    <mesh geometry={tubeGeo}>
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.MeshBasicMaterial}
        vertexShader={VS}
        fragmentShader={FS}
        transparent={true}
        depthWrite={false}
        // wireframe
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{position: [0,0,10]}}>
        {/* <Perf position='top-left'/> */}
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />
        {/* <ambientLight intensity={10}/> */}

        <Base />

        <EffectComposer>
          <Bloom/>
        </EffectComposer>
      </Canvas>
    </div>
  )
}
