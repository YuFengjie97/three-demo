import {
  createInstances,
  Instance,
  InstancedAttribute,
  Instances,
  OrbitControls,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { asset } from '~/utils/asset'
import { useMemo, useRef } from 'react'
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
    arr[i4 + 0] = (random() - 0.5) * 10
    arr[i4 + 1] = (random() - 0.5) * 10
    arr[i4 + 2] = (random() - 0.5) * 10
    // arr[i4 + 0] = i * 4.
    // arr[i4 + 1] = i * 4.
    // arr[i4 + 2] = i * 4.

    // const theta = random() * PI
    // const phi = random() * PI * 2
    // const r = random() * 1 + 2
    // const x = r * cos(phi) * cos(theta)
    // const y = r * cos(phi) * sin(theta)
    // const z = r * sin(phi)
    // arr[i4 + 0] = x
    // arr[i4 + 1] = y
    // arr[i4 + 2] = z

    arr[i4 + 3] = random()
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

    // 不需要对vel纹理初始化,因为值都是通过noise直接计算,不需要考虑上一帧的速度
    const velTex = gpu.createTexture()
    const posVar = gpu.addVariable('texPos', gpuPos, posTex)
    const velVar = gpu.addVariable('texVel', gpuVel, velTex)
    posVar.material.uniforms = {
      ...uniformTime,
    }
    velVar.material.uniforms = {
      ...uniformTime,
    }
    gpu.setVariableDependencies(posVar, [posVar, velVar])
    gpu.setVariableDependencies(velVar, [posVar, velVar])
    gpu.init()

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
  texCoord: THREE.Vector2
}

function Swords() {
  const { nodes, materials } = useGLTF(swordGlbUrl)
  const [SwordInstances, Sword] = createInstances<SwordAttrubites>()

  const count = 4
  const size = ceil(sqrt(count))

  const { gpu, posVar, velVar } = useGpu(count)
  const uniformTime = useUniformTime()

  const uniforms = {
    ...uniformTime,
    uTexPos: new THREE.Uniform(gpu.getCurrentRenderTarget(posVar).texture), // 飞剑位置
    uTexVel: new THREE.Uniform(gpu.getCurrentRenderTarget(velVar).texture), // 飞剑速度,也用来设置方向
  }

  const helperMatRef = useRef<THREE.MeshBasicMaterial>(null!)
  useFrame(() => {
    gpu.compute()
    uniforms.uTexPos.value = gpu.getCurrentRenderTarget(posVar).texture
    uniforms.uTexVel.value = gpu.getCurrentRenderTarget(velVar).texture
    helperMatRef.current.map = gpu.getCurrentRenderTarget(posVar).texture
  })


  return (
    <>
      <mesh scale={3}>
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
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
        />
        <InstancedAttribute name='instanceId' defaultValue={0} />
        <InstancedAttribute
          name='texCoord'
          defaultValue={new THREE.Vector2(1, 1)}
        />
        {Array.from({ length: count }).map((item, i) => {
          const instanceId = i
          let y = floor(i / size)
          let x = (i - y * size + 0.5) / size
          y = (y + 0.5) / size
          const texCoord = new THREE.Vector2(x, y)
          console.log(i, texCoord)

          return (
            <Sword
              key={i}
              scale={0.2}
              instanceId={instanceId}
              texCoord={texCoord}
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
        <Perf position='top-left' />
        <axesHelper args={[10]} />
        <ambientLight />
        <OrbitControls makeDefault />
        <Swords />
        {/* <Model /> */}
        {/* <EffectComposer>
          <Bloom />
        </EffectComposer> */}
      </Canvas>
    </div>
  )
}
