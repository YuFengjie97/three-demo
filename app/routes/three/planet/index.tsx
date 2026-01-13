import { OrbitControls, PointMaterial, useHelper } from '@react-three/drei'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import CustomShaderMaterial from 'three-custom-shader-material'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import starsVertex from './startsVertex.glsl'
import starsFragment from './starsFragment.glsl'

import { useEffect, useMemo, useRef } from 'react'
import { useControls } from 'leva'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'


function Planet() {
  const uniforms = {
    uEvolution: new THREE.Uniform(0),
    uTime: new THREE.Uniform(0),
    uDelta: new THREE.Uniform(0),
    uColLand: new THREE.Uniform(new THREE.Color(0xf2c211)),
    uColSea: new THREE.Uniform(new THREE.Color(0x16aade)),
    uColGrass: new THREE.Uniform(new THREE.Color(0x45d50d)),
    uLandVal: new THREE.Uniform(0.02),
    uLandHeight: new THREE.Uniform(0.04),
  }
  useFrame((state, delta) => {
    const { clock } = state
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uDelta.value = delta
  })

  const {
    evolution,
    detail,
    wireframe,
    landCol,
    seaCol,
    grassCol,
    landVal,
    landHeight,
  } = useControls({
    evolution: false,
    detail: { value: 60, min: 10, max: 100, step: 1 },
    wireframe: false,
    landCol: `#${uniforms.uColLand.value.getHexString()}`,
    seaCol: `#${uniforms.uColSea.value.getHexString()}`,
    grassCol: `#${uniforms.uColGrass.value.getHexString()}`,
    landVal: {
      value: uniforms.uLandVal.value,
      min: -1,
      max: 1,
      label: 'landRange',
    },
    landHeight: { value: uniforms.uLandHeight.value, min: 0, max: 1 },
  })

  uniforms.uColSea.value.set(landCol)
  uniforms.uColLand.value.set(seaCol)
  uniforms.uColGrass.value.set(grassCol)
  uniforms.uLandVal.value = landVal
  uniforms.uLandHeight.value = landHeight
  uniforms.uEvolution.value = evolution ? 1 : 0

  const { geo } = useMemo(() => {
    let geo: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, detail)
    geo = mergeVertices(geo)
    geo.computeTangents()
    return { geo }
  }, [detail])

  const [, setVertices] = useControls(() => ({
    vertices: {
      value: 0,
      editable: false,
      label: 'Vertices',
    },
  }))

  useEffect(() => {
    setVertices({ vertices: geo.attributes.position.count })
  }, [geo, setVertices])

  const planetGroupRef = useRef<THREE.Group>(null!)
  useFrame((_, delta) => {
    planetGroupRef.current.rotation.y += delta * 0.1
  })

  return (
    <>
      <group ref={planetGroupRef}>
        <mesh geometry={geo}>
          <CustomShaderMaterial
            baseMaterial={THREE.MeshPhysicalMaterial}
            uniforms={uniforms}
            vertexShader={vertex}
            fragmentShader={fragment}
            wireframe={wireframe}
          />
        </mesh>
      </group>
    </>
  )
}

function Light() {
  const lightRef = useRef(null!)

  // useHelper(lightRef, THREE.PointLightHelper, 0.4)

  const { intensity } = useControls({
    intensity: {
      value: 2,
      min: 0.1,
      max: 40,
      step: 0.1,
    },
  })

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0, 2]} intensity={intensity} />
    </>
  )
}

function Stars() {
  const geo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const count = 2000
    const postions = new Float32Array(count*3)
    const range = 10
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * range
      const y = (Math.random() - 0.5) * range
      const z = (Math.random() - 0.5) * range
      const i3 = i * 3
      postions[i3 + 0] = x
      postions[i3 + 1] = y
      postions[i3 + 2] = z
    }
    geo.setAttribute('position', new THREE.BufferAttribute(postions, 3))

    return geo
  }, [])

  const tex = useLoader(THREE.TextureLoader, '/img/texture/particle/star_09.png')
  const uniforms = {
    uTex: new THREE.Uniform(tex),
    uTime: new THREE.Uniform(0),
    uDelta: new THREE.Uniform(0),
  }
  useFrame((state, delta) => {
    const { clock } = state
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uDelta.value = delta
  })

  return (
    <>
      <points geometry={geo}>
        {/* <PointMaterial/> */}
        <CustomShaderMaterial 
          baseMaterial={THREE.PointsMaterial}
          uniforms={uniforms}
          size={.1}
          transparent={true}
          alphaTest={.01}
          depthWrite={false}
          vertexShader={starsVertex}
          fragmentShader={starsFragment}
        />
      </points>
    </>
  )
}

export default function main() {
  return (
    <>
      <div className='h-screen'>
        <Canvas camera={{ position: [0, 2, 2] }}>
          <OrbitControls />
          <axesHelper args={[20]} />
          <ambientLight intensity={0.4} />
          <Light />
          <Planet />
          <Stars />
        </Canvas>
      </div>
    </>
  )
}
