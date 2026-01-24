import { OrbitControls, useFBO, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import gpuFragVel from './gpuFragVel.glsl'
import gpuFragPos from './gpuFragPos.glsl'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import { useUniformTime } from '~/hook/useUniformTime'
import { asset } from '~/utils/asset'
import { Perf } from 'r3f-perf'


function fillPosTex(tex: THREE.DataTexture){
  const arr = tex.image.data!
  for(let i=0.;i<arr?.length;i++){
    const i4 = i * 4
    arr[i4 + 0] = (Math.random()-.5)*4
    arr[i4 + 1] = (Math.random()-.5)*4
    arr[i4 + 2] = (Math.random()-.5)*4
    arr[i4 + 3] = Math.random() // life
  }
}
function fillVelTex(tex: THREE.DataTexture){
  const arr = tex.image.data!
  for(let i=0.;i<arr?.length;i++){
    const i4 = i * 4
    arr[i4 + 0] = 1.
    arr[i4 + 1] = 1.
    arr[i4 + 2] = 1.
    arr[i4 + 3] = 0 // 不使用
  }
}

function useGpu(size: number) {
  const { gl } = useThree()
  const uniformTime = useUniformTime()

  const { gpuCompute,  posVar, velVar } = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(size, size, gl)
    const posTex = gpuCompute.createTexture()
    const velTex = gpuCompute.createTexture()
    fillPosTex(posTex)
    fillVelTex(velTex)
    const posVar = gpuCompute.addVariable('texPos', gpuFragPos, posTex)
    const velVar = gpuCompute.addVariable('texVel', gpuFragVel, velTex)

    posVar.material.uniforms = {
      ...uniformTime,
      uDefaultPos: new THREE.Uniform(posTex) // 初始位置作为默认位置
    }
    velVar.material.uniforms = {...uniformTime}


    gpuCompute.setVariableDependencies(posVar, [posVar, velVar])
    gpuCompute.setVariableDependencies(velVar, [posVar, velVar])
    gpuCompute.init()

    return {
      gpuCompute,
      posVar,
      velVar,
    }
  }, [gl, size])

  return {
    gpuCompute,
    posVar,
    velVar,
  }
}

function Particle() {
  const count = 4000
  const size = Math.ceil(Math.sqrt(count))

  const {geo} = useMemo(() => {
    const position = new Float32Array(count * 3)
    const texCoord = new Float32Array(count * 2)
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const i = y * size + x
        const i2 = i * 2

        const cx = (x + 0.5) / size
        const cy = (y + 0.5) / size
        texCoord[i2 + 0] = cx
        texCoord[i2 + 1] = cy
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geo.setAttribute('aTexCoord', new THREE.BufferAttribute(texCoord, 2))
    
    return {
      geo,
    }
  }, [])
  
  const { gpuCompute, posVar, velVar } = useGpu(size)

  const uniformTime = useUniformTime()
  const tex = useTexture(asset('/img/texture/particle/star_09.png'))
  tex.minFilter = THREE.NearestFilter
  tex.magFilter = THREE.NearestFilter

  const uniforms = {
    ...uniformTime,
    uTexPos: new THREE.Uniform(
      gpuCompute.getCurrentRenderTarget(posVar).texture,
    ),
    uTexVel: new THREE.Uniform(
      gpuCompute.getCurrentRenderTarget(velVar).texture,
    ),
    uTexPoint: new THREE.Uniform(tex)
  }

  const posHelperMat = useRef<THREE.MeshBasicMaterial>(null)
  const velHelperMat = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(() => {
    gpuCompute.compute()
    uniforms.uTexPos.value = gpuCompute.getCurrentRenderTarget(posVar).texture
    uniforms.uTexVel.value = gpuCompute.getCurrentRenderTarget(velVar).texture
    posHelperMat.current!.map = gpuCompute.getCurrentRenderTarget(posVar).texture
    velHelperMat.current!.map = gpuCompute.getCurrentRenderTarget(velVar).texture
  })

  return (
    <>
      <points geometry={geo}>
        <CustomShaderMaterial
          baseMaterial={THREE.PointsMaterial}
          color={0xffffff}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          size={0.1}
          sizeAttenuation={true}
          transparent = {true}
          // depthWrite={false}
          // alphaTest={.4}
        />
      </points>

      <mesh scale={2} position={[-4, 0, 0]}>
        <planeGeometry />
        <meshBasicMaterial ref={posHelperMat} side={THREE.DoubleSide} />
      </mesh>

      <mesh scale={2} position={[4, 0, 0]}>
        <planeGeometry />
        <meshBasicMaterial ref={velHelperMat} side={THREE.DoubleSide} />
      </mesh>
    </>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        <Perf />
        {/* <ambientLight intensity={1} /> */}
        <OrbitControls />
        {/* <axesHelper args={[10]} /> */}
        <Particle />
      </Canvas>
    </div>
  )
}
