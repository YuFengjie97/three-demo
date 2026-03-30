import { Loader, OrbitControls, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import CustomShaderMaterial from 'three-custom-shader-material'
import vs from './vs.glsl'
import fs from './fs.glsl'
import * as THREE from 'three'
import { Suspense, useMemo } from 'react'
import { useUniformTime } from '~/hook/useUniformTime'
import { asset } from '~/utils/asset'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useControls } from 'leva'

function Base() {
  const height = 10
  const { geo } = useMemo(() => {
    const geo = new THREE.CylinderGeometry(1, 1, height, 32, 32)
    geo.translate(0, height / 2, 0)
    return { geo }
  }, [height])

  // const tex = useTexture(asset('/img/texture/particle/spark_02.png'))
  const tex = useTexture(asset('/img/texture/noise/Cracks 8 - 512x512.png'))
  // const tex = useTexture(asset('/img/texture/fulu/1.jpg'))

  const { col, rotateSpeed, texOffsetSpeed, swingAmp, swingSpeed } =
    useControls({
      col: '#ff0000',
      rotateSpeed: { value: 3, min: -5, max: 5, step: 0.1 },
      texOffsetSpeed: { value: 0.6, min: -5, max: 5, step: 0.1 },
      swingAmp: { value: 1.5, min: 0, max: 3, step: 0.1 },
      swingSpeed: { value: 4, min: -5, max: 5, step: 0.1 },
    })

  const uniformTime = useUniformTime()
  const uniforms = useMemo(() => {
    return {
      ...uniformTime,
      uHeight: new THREE.Uniform(height),
      uTex: new THREE.Uniform(tex),
      uCol: new THREE.Uniform(new THREE.Color(col)),
      uRotateSpeed: new THREE.Uniform(rotateSpeed),
      uTexOffsetSpeed: new THREE.Uniform(texOffsetSpeed),
      uSwingAmp: new THREE.Uniform(swingAmp),
      uSwingSpeed: new THREE.Uniform(swingSpeed),
    }
  }, [col, rotateSpeed, texOffsetSpeed, swingAmp, swingSpeed])

  return (
    <mesh geometry={geo}>
      {/* <cylinderGeometry args={[1,1,4,32, 10]}/> */}
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.MeshBasicMaterial}
        vertexShader={vs}
        fragmentShader={fs}
        transparent={true}
        side={THREE.DoubleSide}
        toneMapped={false}
        // wireframe={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [0, 4, 15]}}>
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls target={[0,3,0]}/>

        <Suspense fallback={null}>
          <Base />
        </Suspense>

        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
      <Loader />
    </div>
  )
}
