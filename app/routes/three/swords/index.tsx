import {
  createInstances,
  InstancedAttribute,
  Loader,
  OrbitControls,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { asset } from '~/utils/asset'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import CustomShaderMaterial from 'three-custom-shader-material'
import { useUniformTime } from '~/hook/useUniformTime'
import { Perf } from 'r3f-perf'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import gpuPos from './gpuPos.glsl'
import gpuVel from './gpuVel.glsl'
import { useControls } from 'leva'
import gsap from 'gsap'

const { random, sqrt, ceil, sin, cos, PI, floor } = Math

/**
 * sword model is from
 * https://sketchfab.com/3d-models/10-genshin-impact-inspired-sword-3d-models-a25cde4706d04e4cb5ea7ff89ceb5dd9
 */
const swordGlbUrl = asset('/model/sword-transformed.glb')
useGLTF.preload(swordGlbUrl)

function fillPosTex(tex: THREE.DataTexture) {
  const arr = tex.image.data!
  for (let i = 0; i < arr?.length; i++) {
    const i4 = i * 4
    const x = (random() - 0.5) * 2 * 50
    const y = (random() - 0.5) * 2 * 50
    const z = (random() - 0.5) * 2 * 50
    arr[i4 + 0] = x
    arr[i4 + 1] = y
    arr[i4 + 2] = z

    arr[i4 + 3] = i
  }
}
function fillVelTex(tex: THREE.DataTexture) {
  const arr = tex.image.data!
  for (let i = 0; i < arr?.length; i++) {
    const i4 = i * 4
    arr[i4 + 0] = (random() - 0.5) * 2
    arr[i4 + 1] = (random() - 0.5) * 2
    arr[i4 + 2] = (random() - 0.5) * 2

    arr[i4 + 3] = i
  }
}

function useGpu(count: number) {
  const { gl } = useThree()
  const size = ceil(sqrt(count))
  const uniformTime = useUniformTime()

  const { gpu, posVar, velVar } = useMemo(() => {
    const gpu = new GPUComputationRenderer(size, size, gl)
    const posTex = gpu.createTexture()
    fillPosTex(posTex)
    const velTex = gpu.createTexture()
    fillVelTex(velTex)
    const posVar = gpu.addVariable('texPos', gpuPos, posTex)
    const velVar = gpu.addVariable('texVel', gpuVel, velTex)
    posVar.material.uniforms = {
      ...uniformTime,
      // uDefaultPosTex: new THREE.Uniform(posTex)
    }
    velVar.material.uniforms = {
      ...uniformTime,
      uSize: new THREE.Uniform(size),

      uSeparationR: new THREE.Uniform(5),
      uAlignmentR:  new THREE.Uniform(10),
      uCohesionR:   new THREE.Uniform(10),

      uCenterEdge:   new THREE.Uniform(120),

      uMinSpeed: new THREE.Uniform(20),
      uMaxSpeed: new THREE.Uniform(40),
    }
    gpu.setVariableDependencies(posVar, [posVar, velVar])
    gpu.setVariableDependencies(velVar, [posVar, velVar])
    gpu.init()

    // gsap.to(velVar.material.uniforms.uSeparationR, 
    //   {
    //     value: velVar.material.uniforms.uAlignmentR.value + 5,
    //     duration: 5,
    //     yoyo: true,
    //     repeat: -1,
    // })

    return {
      gpu,
      posVar,
      velVar,
    }
  }, [gl, size])

  return {
    gpu,
    posVar,
    velVar,
  }
}

interface SwordAttrubites {
  instanceId: number
  texCoord: [number, number]
}

function Swords() {
  const { nodes, materials } = useGLTF(swordGlbUrl)
  const [SwordInstances, Sword] = createInstances<SwordAttrubites>()

  const count = 800
  const size = ceil(sqrt(count))

  const { gpu, posVar, velVar } = useGpu(count)
  const uniformTime = useUniformTime()

  const uniforms = {
    ...uniformTime,
    uTexPos: new THREE.Uniform(gpu.getCurrentRenderTarget(posVar).texture), // 飞剑位置
    uTexVel: new THREE.Uniform(gpu.getCurrentRenderTarget(velVar).texture), // 飞剑速度,也用来设置方向
  }

  const factor = [0, 30]
  const radius = [0, 50]

  useControls({
    uSeparationR: {
      value: velVar.material.uniforms.uSeparationR.value,
      min: radius[0],
      max: radius[1],
      onChange(val) {
        velVar.material.uniforms.uSeparationR.value = val
      },
      label: '分离半径',
    },
    uAlignmentR: {
      value: velVar.material.uniforms.uAlignmentR.value,
      min: radius[0],
      max: radius[1],
      onChange(val) {
        velVar.material.uniforms.uAlignmentR.value = val
      },
      label: '对齐半径',
    },
    uCohesionR: {
      value: velVar.material.uniforms.uCohesionR.value,
      min: radius[0],
      max: radius[1],
      onChange(val) {
        velVar.material.uniforms.uCohesionR.value = val
      },
      label: '聚集半径',
    },
    uCenterEdge: {
      value: velVar.material.uniforms.uCenterEdge.value,
      min: 0.,
      max: 200.,
      onChange(val) {
        velVar.material.uniforms.uCenterEdge.value = val
      },
      label: '中心引力范围',
    },
    uSpeed: {
      value: [
        velVar.material.uniforms.uMinSpeed.value,
        velVar.material.uniforms.uMaxSpeed.value,
      ],
      min: 1,
      max: 400,
      onChange([v1, v2]) {
        velVar.material.uniforms.uMinSpeed.value = v1
        velVar.material.uniforms.uMaxSpeed.value = v2
      },
      label: '速度',
    },
  })

  const helperMatRef = useRef<THREE.MeshBasicMaterial>(null!)
  useFrame(() => {
    gpu.compute()
    uniforms.uTexPos.value = gpu.getCurrentRenderTarget(posVar).texture
    uniforms.uTexVel.value = gpu.getCurrentRenderTarget(velVar).texture
    helperMatRef.current.map = gpu.getCurrentRenderTarget(velVar).texture
  })

  const data = useMemo(() => {
    return Array.from({ length: count }).map((item, i) => {
      const instanceId = i
      let y = floor(i / size)
      let x = (i - y * size + 0.5) / size
      y = (y + 0.5) / size
      const texCoord: [number, number] = [x, y]

      return {
        instanceId,
        texCoord,
      }
    })
  }, [count, size])


  return (
    <>
      <mesh scale={3} visible={false}>
        <planeGeometry />
        <meshBasicMaterial side={THREE.DoubleSide} ref={helperMatRef} />
      </mesh>
      <SwordInstances
        limit={1000}
        range={1000}
        // @ts-ignore
        geometry={nodes['Freedom-Sworn_mesh_Freedom-Sworn_0001'].geometry}
        // material={materials['Freedom-Sworn']}
      >
        <CustomShaderMaterial
          baseMaterial={THREE.MeshBasicMaterial}
          map={materials['Freedom-Sworn'].map}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
        />
        <InstancedAttribute name='instanceId' defaultValue={0} />
        <InstancedAttribute
          name='texCoord'
          // defaultValue={new THREE.Vector2(0, 0)}   // fuck!!!
          defaultValue={[0, 0]}
        />
        {data.map((item) => {
          return (
            <Sword
              // position-x={item.instanceId}
              key={item.instanceId}
              scale={0.2}
              instanceId={item.instanceId}
              texCoord={item.texCoord}
            />
          )
        })}
      </SwordInstances>
    </>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        {/* <Perf position='top-left' /> */}
        {/* <axesHelper args={[10]} /> */}
        <ambientLight />
        <OrbitControls />
        <Suspense fallback={null}>
          <Swords />
        </Suspense>

        {/* <Model /> */}
        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
      <Loader/>
    </div>
  )
}
