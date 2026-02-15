import { OrbitControls, Points, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import CustomShaderMaterial from 'three-custom-shader-material'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import gpuPos from './gpuPos.glsl'
import { useMemo } from 'react'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import { useUniformTime } from '~/hook/useUniformTime'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Perf } from 'r3f-perf'
import { asset } from '~/utils/asset'

const { ceil, sqrt, random } = Math

function fillPosTex(tex: THREE.DataTexture, count: number){
  const data = tex.image.data!
  for(let i=0;i<count;i++){
    const i4 = i*4
    data[i4+0] = (random()-.5)*10.
    data[i4+1] = (random()-.5)*10.
    data[i4+2] = (random()-.5)*10.
    data[i4+3] = random()
  }
}

function Base() {
  const count = 10000
  const size = ceil(sqrt(count))
  const { gl } = useThree()

  const uniformTime = useUniformTime()

  const { gpuCompute, posVar } = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(size, size, gl)
    const posTex = gpuCompute.createTexture()
    fillPosTex(posTex, count)
    const posVar = gpuCompute.addVariable('texPos', gpuPos, posTex)

    posVar.material.uniforms = {
      ...uniformTime,
    }

    gpuCompute.setVariableDependencies(posVar, [posVar])
    gpuCompute.init()

    return {
      gpuCompute,
      posVar,
    }
  }, [count, size])

  const tex = useTexture(asset('/img/texture/particle/star_09.png'))
  const uniforms = {
    ...uniformTime,
    uTexPos: new THREE.Uniform(
      gpuCompute.getCurrentRenderTarget(posVar).texture,
    ),
    uParticleTex: new THREE.Uniform(tex)
  }

  useFrame(() => {
    gpuCompute.compute()
    uniforms.uTexPos.value = gpuCompute.getCurrentRenderTarget(posVar).texture
  })

  const { geo } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const position = new Float32Array(count * 3)
    // for (let i = 0; i < count * 3; i++) {
    //   position[i] = (random() - 0.5) * 10
    // }
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))

    const id = new Float32Array(count)
    for(let i=0.;i<count;i++){
      id[i] = i
    }
    geo.setAttribute('id', new THREE.BufferAttribute(id, 1))

    const particleCoord = new Float32Array(count * 2)
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const i = y * size + x
        const i2 = i * 2
        particleCoord[i2 + 0] = (x + 0.5) / size
        particleCoord[i2 + 1] = (y + 0.5) / size
      }
    }
    geo.setAttribute(
      'particleCoord',
      new THREE.BufferAttribute(particleCoord, 2),
    )

    return { geo }
  }, [count, size])


  return (
    <points geometry={geo} position={[0,-1,0]}>
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.PointsMaterial}
        size={.2}
        sizeAttenuation={true}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent={true}
        // alphaTest={.001}
        depthWrite={false}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas camera={{position: [0,0.,5]}}>
        <Perf position='top-left'/>
        <OrbitControls target={[0,2,0]}/>
        <ambientLight />
        <axesHelper args={[10]} />
        <Base />

        <EffectComposer>
          <Bloom/>
        </EffectComposer>
      </Canvas>
    </div>
  )
}
