import { Loader, OrbitControls, Tube, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import gpuPos from './gpuPos.glsl'
import { Suspense, useMemo } from 'react'
import { GPUComputationRenderer } from 'three/examples/jsm/Addons.js'
import { useUniformTime } from '~/hook/useUniformTime'
import { asset } from '~/utils/asset'
import CustomShaderMaterial from 'three-custom-shader-material'

const { ceil, sqrt, random } = Math

function getTarPosTex(position: THREE.BufferAttribute, size: number) {
  const imgData = new Float32Array(size*size*4)
  const tex = new THREE.DataTexture(imgData, size, size, THREE.RGBAFormat, THREE.FloatType)
  const posArr = position.array
  const data = tex.image.data!
  
  const len = size * size
  for (let i = 0; i < len; i++) {
    const i4 = i * 4
    const i3 = i * 3
    data[i4 + 0] = posArr[i3 + 0] ?? (random() - 0.5) * 10 // x
    data[i4 + 1] = posArr[i3 + 1] ?? (random() - 0.5) * 10 // y
    data[i4 + 2] = posArr[i3 + 2] ?? (random() - 0.5) * 10 // z
  }

  tex.needsUpdate = true

  return tex
}

function Base() {
  const { nodes, materials } = useGLTF(
    asset('/model/treeNoLeaf-export-transformed.glb'),
  )
  // @ts-ignore
  const geoModel = nodes.Object_2.geometry as THREE.BufferGeometry
  const position = geoModel.getAttribute('position') as THREE.BufferAttribute
  const count = position.count
  const size = ceil(sqrt(count))

  console.log({count,size});
  

  const uniformTime = useUniformTime()
  const { gl } = useThree()

  // 根据模型顶点生成粒子目标位置纹理
  const tarPosTex = useMemo(() => {
    return getTarPosTex(position, size)
  }, [position, size]) 
  console.log(tarPosTex);
  

  // gpu
  const { gpu, posVar } = useMemo(() => {
    const gpu = new GPUComputationRenderer(size, size, gl)
    const posTex = gpu.createTexture()
    const posVar = gpu.addVariable('posTex', gpuPos, posTex)

    posVar.material.uniforms = {
      ...uniformTime,
      tarPosTex: new THREE.Uniform(tarPosTex),
      life: new THREE.Uniform(0)
    }

    gpu.setVariableDependencies(posVar, [posVar])
    gpu.init()

    return {
      gpu,
      posVar,
    }
  }, [gl, size])

  useFrame((_, delta) => {
    const life = posVar.material.uniforms.life
    life.value += delta * .4
    
    if(life.value > 1.) {
      life.value = life.value % 1
    }
  })

  //--------------------------------------------------------------------------
  const {geo} = useMemo(() => {
    // geo初始化
    const count = position.count
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))

    // 粒子gpu纹理坐标
    const pCoord = new Float32Array(count*2)
    for (let i = 0; i < count; i++) {
      const x = (i % size) / size
      const y = Math.floor(i / size) / size
      
      // 偏移半个像素，采样像素中心
      pCoord[i * 2 + 0] = x + (0.5 / size)
      pCoord[i * 2 + 1] = y + (0.5 / size)
    }
    geo.setAttribute('pCoord', new THREE.BufferAttribute(pCoord, 2))
    
    return {geo}
  }, [position, size, count])

  const tex = useTexture(asset('/img/texture/particle/star_09.png'))
  const uniforms = {
    ...uniformTime,
    posTex: new THREE.Uniform(gpu.getCurrentRenderTarget(posVar).texture),
    tex: new THREE.Uniform(tex)
  }

  useFrame(() => {
    gpu.compute()
    uniforms.posTex.value = gpu.getCurrentRenderTarget(posVar).texture
  })

  return (
    <points geometry={geo} scale={2.} rotation-z={Math.PI/2.}>
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.PointsMaterial}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent={true}
        size={0.04}
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
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls target={[0,2,0]}/>

        <Suspense fallback={null}>
          <Base />
        </Suspense>

      </Canvas>
      <Loader/>
    </div>
  )
}
