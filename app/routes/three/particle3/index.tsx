import { OrbitControls, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import CustomShaderMaterial from 'three-custom-shader-material'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useMemo } from 'react'
import { useUniformTime } from '~/hook/useUniformTime'
import { asset } from '~/utils/asset'

function Base() {
  const count = 5000
  const { geo } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const id = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      id[i] = i
    }
    geo.setAttribute('id', new THREE.BufferAttribute(id, 1))

    const position = new Float32Array(count*3)
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
    return { geo }
  }, [])

  const uniformTime = useUniformTime()
  const tex = useTexture(asset('/img/texture/particle/star_09.png'))
  const uniforms = {
    ...uniformTime,
    count: new THREE.Uniform(count),
    tex: new THREE.Uniform(tex)
  }

  return (
    <points geometry={geo}>
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.PointsMaterial}
        size={0.2}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent={true}
        alphaTest={0.0001}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        <OrbitControls />
        <axesHelper args={[10]} />
        <Base />
      </Canvas>
    </div>
  )
}
