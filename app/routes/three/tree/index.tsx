import { Loader, OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import trunkVertex from './trunk_vertex.glsl'
import trunkFragment from './trunk_fragment.glsl'
import leafVertex from './leaf_vertex.glsl'
import leafFragment from './leaf_fragment.glsl'
import gpuPos from './gpuPos.glsl'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { asset } from '~/utils/asset'
import { Suspense, useMemo } from 'react'
import { useUniformTime } from '~/hook/useUniformTime'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import { Perf } from 'r3f-perf'
import { Bloom, EffectComposer } from '@react-three/postprocessing'

const { random, sqrt, ceil } = Math

function fillPosTex(tex: THREE.DataTexture, position: THREE.TypedArray) {
  const imgData = tex.image.data!

  // 将模型的顶点位置赋值给gpuPos数据材质初始色
  for (let i = 0; i < imgData.length / 4; i++) {
    const i4 = i * 4
    const i3 = i * 3
    const x = position[i3 + 0]
    const y = position[i3 + 1]
    const z = position[i3 + 2]
    // 因为图像像素数大于顶点数,所以超过的部分随机位置
    imgData[i4 + 0] = x ?? (random() - 0.5) * 10
    imgData[i4 + 1] = y ?? (random() - 0.5) * 10
    imgData[i4 + 2] = z ?? (random() - 0.5) * 10
    imgData[i4 + 3] = random() // life
  }
}

function Leaf({ ...props }: { props: any }) {
  // @ts-ignore
  const geometry = props.geometry as THREE.BufferGeometry
  console.log(geometry)

  const position = geometry.getAttribute('position')
  const count = position.count
  const size = ceil(sqrt(count))
  console.log({ count, size })

  const { gl } = useThree()

  const uniformTime = useUniformTime()

  const { gpuCompute, posVar } = useMemo(() => {
    const gpuCompute = new GPUComputationRenderer(size, size, gl)
    const posTex = gpuCompute.createTexture()
    fillPosTex(posTex, position.array)
    const posVar = gpuCompute.addVariable('texPos', gpuPos, posTex)

    posVar.material.uniforms = {
      ...uniformTime,
      uDefaultPosTex: new THREE.Uniform(posTex), // 初始位置作为默认位置
    }

    gpuCompute.setVariableDependencies(posVar, [posVar])
    gpuCompute.init()

    return {
      gpuCompute,
      posVar,
    }
  }, [gl, size])

  const { particleCoord } = useMemo(() => {
    const particleCoord = new Float32Array(count * 2)
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const i = y * size + x
        const i2 = i * 2
        const coordX = (x + 0.5) / size
        const coordY = (y + 0.5) / size
        particleCoord[i2 + 0] = coordX
        particleCoord[i2 + 1] = coordY
      }
    }

    return {
      particleCoord,
    }
  }, [count, size])

  geometry.setAttribute(
    'aParticleCoord',
    new THREE.BufferAttribute(particleCoord, 2),
  )

  const tex = useTexture(asset('/img/texture/particle/star_09.png'))
  const pointsUniform = {
    ...uniformTime,
    uPosTex: new THREE.Uniform(
      gpuCompute.getCurrentRenderTarget(posVar).texture,
    ),
    uParticleTex: new THREE.Uniform(tex),
  }
  useFrame(() => {
    gpuCompute.compute()
    pointsUniform.uPosTex.value =
      gpuCompute.getCurrentRenderTarget(posVar).texture
  })

  return (
    <points {...props}>
      <CustomShaderMaterial
        uniforms={pointsUniform}
        baseMaterial={THREE.PointsMaterial}
        vertexShader={leafVertex}
        fragmentShader={leafFragment}
        size={0.07}
        transparent={true}
        depthWrite={false}
        // alphaTest={.01}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

function Trunk({ ...props }: { props: any }) {
  const uniformTime = useUniformTime()
  const uniforms = { ...uniformTime }


  return (
    <>
      <mesh {...props}>
        <CustomShaderMaterial
          uniforms={uniforms}
          baseMaterial={THREE.MeshNormalMaterial}
          vertexShader={trunkVertex}
          fragmentShader={trunkFragment}
          // transparent={true}
          // opacity={0.6}
          // transmission={.7}
          // metalness={0.}
          // roughness={1.5}
          // ior={2.1}
          toneMapped={true}
        />
      </mesh>
    </>
  )
}

function Base() {
  const { nodes, materials } = useGLTF(asset('/model/tree-transformed.glb'))
  // @ts-ignore
  const trunkGeo = nodes.Oak_Bark_2_SHD_trunk_0.geometry
  // @ts-ignore
  const leafGeo = nodes.olqeejih_2K_rsSprite1_0.geometry
  console.log({ trunkGeo, leafGeo })

  return (
    <>
      {/*@ts-ignore*/}
      <Trunk geometry={trunkGeo} scale={0.3} />
      {/*@ts-ignore*/}
      <Leaf geometry={leafGeo} scale={0.3} />
    </>
  )
}

export default function () {

  return (
    <div className='h-screen'>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Perf position='top-left' />
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls target={[0, 3, 0]} />
        <ambientLight intensity={10} />

        {/* <mesh scale={400} rotation-x={-Math.PI/2.}>
          <planeGeometry/>
          <meshBasicMaterial color={0xfdcb6e}/>
        </mesh> */}

        <Suspense fallback={null}>
          <Base />
        </Suspense>

      <EffectComposer>
        <Bloom/>
      </EffectComposer>
      </Canvas>
      <Loader />
    </div>
  )
}
