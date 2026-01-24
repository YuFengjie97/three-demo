import { OrbitControls, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
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
import { useControls } from 'leva'
import { Bloom, EffectComposer, GodRays } from '@react-three/postprocessing'

const { cos, sin, random, PI, ceil, sqrt } = Math

function fillPosTex(tex: THREE.DataTexture) {
  const arr = tex.image.data!
  for (let i = 0; i < arr?.length; i++) {
    const i4 = i * 4
    // arr[i4 + 0] = (random()-.5)*4
    // arr[i4 + 1] = (random()-.5)*4
    // arr[i4 + 2] = (random()-.5)*4

    const theta = random() * PI
    const phi = random() * PI * 2
    const r = random() * 1 + 2
    const x = r * cos(phi) * cos(theta)
    const y = r * cos(phi) * sin(theta)
    const z = r * sin(phi)
    arr[i4 + 0] = x
    arr[i4 + 1] = y
    arr[i4 + 2] = z

    arr[i4 + 3] = random() // life
  }
}

// 占位,实际的vel向量来自fs中的noise
function fillVelTex(tex: THREE.DataTexture) {
  const arr = tex.image.data!
  for (let i = 0; i < arr?.length; i++) {
    const i4 = i * 4
    arr[i4 + 0] = 1
    arr[i4 + 1] = 1
    arr[i4 + 2] = 1
    arr[i4 + 3] = 0 // 不使用
  }
}

function useGpu(size: number) {
  const { gl } = useThree()
  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    uSpeed: new THREE.Uniform(3.),
    uRangeMin: new THREE.Uniform(-1.),
    uRangeMax: new THREE.Uniform(.5),
    uLifeSpeed: new THREE.Uniform(.1),
  }

  useControls({
    speed: {
      value: uniforms.uSpeed.value,
      min: 0.,
      max: 10.,
      step: .1,
      onChange(val) {
        uniforms.uSpeed.value = val
      }
    },
    moveRange: {
      min: -1.,
      max: 1.,
      value: [uniforms.uRangeMin.value, uniforms.uRangeMax.value],
      hint: '粒子位置-->噪音值-->smoothstep确定是否移动',
      onChange(val){
        uniforms.uRangeMin.value = val[0]
        uniforms.uRangeMax.value = val[1]
      }
    },
    lifeSpeed: {
      min: 0.,
      max: 2.,
      value: uniforms.uLifeSpeed.value,
      onChange(val){
        uniforms.uLifeSpeed.value = val
      }
    },
  })

  const { gpuCompute, posVar, velVar } = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(size, size, gl)
    const posTex = gpuCompute.createTexture()
    const velTex = gpuCompute.createTexture()
    fillPosTex(posTex)
    fillVelTex(velTex)
    const posVar = gpuCompute.addVariable('texPos', gpuFragPos, posTex)
    const velVar = gpuCompute.addVariable('texVel', gpuFragVel, velTex)

    posVar.material.uniforms = {
      ... uniforms,
      uDefaultPos: new THREE.Uniform(posTex), // 初始位置作为默认位置
    }
    velVar.material.uniforms = { ...uniforms }

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
  const count = 6000
  const size = ceil(sqrt(count))

  const { geo } = useMemo(() => {
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
    uTexPoint: new THREE.Uniform(tex),
  }

  const posHelperMat = useRef<THREE.MeshBasicMaterial>(null)
  const velHelperMat = useRef<THREE.MeshBasicMaterial>(null)

  useFrame(() => {
    gpuCompute.compute()
    uniforms.uTexPos.value = gpuCompute.getCurrentRenderTarget(posVar).texture
    uniforms.uTexVel.value = gpuCompute.getCurrentRenderTarget(velVar).texture
    posHelperMat.current!.map =
      gpuCompute.getCurrentRenderTarget(posVar).texture
    velHelperMat.current!.map =
      gpuCompute.getCurrentRenderTarget(velVar).texture
  })

  const helpRef = useRef<THREE.Group>(null!)
  useControls({
    showHelper: {
      value: false,
      onChange(val) {
        helpRef.current.visible = val
      },
    },
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
          transparent={true}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          // alphaTest={.4}
        />
      </points>

      <group ref={helpRef}>
        <mesh scale={2} position={[-4, 0, 0]}>
          <planeGeometry />
          <meshBasicMaterial ref={posHelperMat} side={THREE.DoubleSide} />
        </mesh>

        <mesh scale={2} position={[4, 0, 0]}>
          <planeGeometry />
          <meshBasicMaterial ref={velHelperMat} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  )
}

export default function () {

  const lightSource = useRef<THREE.Mesh>(null!)
  return (
    <div className='h-screen'>
      <Canvas>
        <Perf position='top-left' />
        {/* <ambientLight intensity={1} /> */}
        <OrbitControls />
        {/* <axesHelper args={[10]} /> */}

        <Particle />

        <mesh ref={lightSource}>
          <icosahedronGeometry args={[.4, 0]}/>
          <meshNormalMaterial />
        </mesh>

        <EffectComposer>
          <Bloom />
          <GodRays sun={lightSource}/>
        </EffectComposer>
      </Canvas>
    </div>
  )
}
