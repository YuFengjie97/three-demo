import { Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { asset } from '~/utils/asset'
import { createTextureArray } from '~/utils/textureArray'
import CustomShaderMaterial from 'three-custom-shader-material'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import { useUniformTime } from '~/hook/useUniformTime'




// instancedMesh
function SkullsMesh() {
  const {nodes} = useGLTF(asset('/model/skull_downloadable/scene.gltf'))

  const tex1 = useTexture(asset('/img/texture/particle/spark_01.png'))
  const tex2 = useTexture(asset('/img/texture/particle/spark_02.png'))
  const tex3 = useTexture(asset('/img/texture/particle/spark_03.png'))
  const tex4 = useTexture(asset('/img/texture/particle/spark_04.png'))
  const texs = [tex1, tex2, tex3, tex4]
  const dataTexture = createTextureArray(texs)

  const uniformTime = useUniformTime()

  const uniforms = {
    ...uniformTime,
    uTextureArray: new THREE.Uniform(dataTexture)
  }

  const geo = useMemo(() => {
    const meshs = Object.values(nodes).map(item => {
      if(item instanceof THREE.Mesh){
        return item
      }
    }).filter(item => item)

    return mergeGeometries(meshs.map(item => item?.geometry))
  }, [])

  const skullsRef = useRef<THREE.InstancedMesh>(null!)
  const { count } = useControls({
    count: { value: 10, min: 1, max: 100 },
  })

  useLayoutEffect(() => {
    if(!skullsRef.current) return

    const instanceIds = new Float32Array(count)
    for(let i = 0;i<count;i++){
      instanceIds[i] = i
    }
    skullsRef.current.geometry.setAttribute('aInstanceId', new THREE.InstancedBufferAttribute(instanceIds, 1))
  }, [])


  const dummy = useMemo(() => new THREE.Object3D(), [])
  useEffect(() => {
    const range = 5
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * range
      const y = (Math.random() - 0.5) * range
      const z = (Math.random() - 0.5) * range
      dummy.position.set(x, y, z)
      // dummy.rotation.x = Math.random() * 4
      // dummy.rotation.y = Math.random() * 4
      // dummy.rotation.z = Math.random() * 4

      let s = Math.random() * 0.5 + 0.5
      dummy.scale.set(s, s, s)

      dummy.updateMatrix()

      skullsRef.current.setMatrixAt(i, dummy.matrix)
      skullsRef.current.count = count
      skullsRef.current.instanceMatrix.needsUpdate = true
    }
  }, [count])


  return (
    <>
      <instancedMesh ref={skullsRef} args={[geo, undefined, count]}>
        <CustomShaderMaterial
          baseMaterial={THREE.MeshPhysicalMaterial}
          uniforms={uniforms}
          vertexShader={vertex}
          fragmentShader={fragment}
          alphaTest={.1}
          transparent
          // blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </>
  )
}

function Skulls() {
  const model = useLoader(
    GLTFLoader,
    asset('/model/skull_downloadable/scene.gltf')
  )
  const geo = useMemo(() => {
    const geos: THREE.BufferGeometry[] = []
    model.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const geo = obj.geometry
        geos.push(geo)
      }
    })
    return mergeGeometries(geos)
  }, [model])

  const { count } = useControls({
    count: { value: 100, min: 1, max: 200, step: 1 },
  })

  const texs = [
    useLoader(
      THREE.TextureLoader,
      asset('/img/texture/matcap/2A2A2A_B3B3B3_6D6D6D_848C8C.png')
    ),
    useLoader(
      THREE.TextureLoader,
      asset('/img/texture/matcap/6D1616_E6CDBA_DE2B24_230F0F.png')
    ),
    useLoader(
      THREE.TextureLoader,
      asset('/img/texture/matcap/3B6E10_E3F2C3_88AC2E_99CE51.png')
    ),
    useLoader(
      THREE.TextureLoader,
      asset('/img/texture/matcap/3E95CC_65D9F1_A2E2F6_679BD4.png')
    ),
    useLoader(
      THREE.TextureLoader,
      asset('/img/texture/matcap/3E2335_D36A1B_8E4A2E_2842A5.png')
    ),
  ]

  const groupRef = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    groupRef.current.children.forEach((child) => {
      child.rotation.x += 0.5 * delta
      child.rotation.y += 0.5 * delta
    })
  })

  return (
    <group ref={groupRef}>
      {[...Array(count)].map((item, ndx) => {
        const tex = texs[ndx % texs.length]
        const x = (Math.random() - 0.5) * 10
        const y = (Math.random() - 0.5) * 10
        const z = (Math.random() - 0.5) * 10

        const rx = Math.random() * 6
        const ry = Math.random() * 6
        const rz = Math.random() * 6

        const s = Math.random() * 0.5 + 0.2

        return (
          <mesh
            key={ndx}
            geometry={geo}
            position={[x, y, z]}
            rotation={[rx, ry, rz]}
            scale={s}
          >
            <meshMatcapMaterial matcap={tex} />
          </mesh>
        )
      })}
    </group>
  )
}

function Env(){
  const tex = useTexture(asset('/img/texture/matcap/2A2A2A_B3B3B3_6D6D6D_848C8C.png'))
  return (
    <Environment
      background
      blur={1.}
    >
      <mesh scale={100}>
        <icosahedronGeometry args={[1,64]}/>
        <meshBasicMaterial map={tex} side={THREE.BackSide}/>
      </mesh>
    </Environment>
  )
}

export default function main() {
  return (
    <>
      <div className='h-screen'>
        <Canvas>
          <Perf position='top-left' />
          {/* <axesHelper args={[10]}/> */}
          <ambientLight />
          {/* <hemisphereLight args={['#74b9ff', '#fdcb6e', 1]} /> */}
          <OrbitControls />
          {/* <axesHelper args={[10]} /> */}
          <SkullsMesh />
          {/* <Skulls /> */}

          <Env />
        </Canvas>
      </div>
    </>
  )
}
