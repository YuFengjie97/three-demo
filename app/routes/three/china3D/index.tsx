import { Center, Html, Loader, MeshReflectorMaterial, OrbitControls } from '@react-three/drei'
import { Canvas, useLoader } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { asset } from '~/utils/asset'
import * as THREE from 'three'
import vertex from './vertex.glsl'
import fragment from './fragment.glsl'
import CustomShaderMaterial from 'three-custom-shader-material'
import { useUniformTime } from '~/hook/useUniformTime'
import { Perf } from 'r3f-perf'
import { useControls } from 'leva'
// import chinaJson from '../../../publi/data/china.json'

type Coord = [number, number]

type Polygon = {
  type: 'Polygon'
  coordinates: Coord[][]
}
type MultiPolygon = {
  type: 'MultiPolygon'
  coordinates: Coord[][][]
}
type Properties = {
  name: string
  fullname: string
  code: string
  pinyin: string
  center: Coord
  level: number
  filename: string
}

type Feature = {
  type: 'Feature'
  properties: Properties
  geometry: Polygon | MultiPolygon
}

const uniforms = {
  uColor: new THREE.Uniform(new THREE.Color(0x74b9ff)),
  uSideColor: new THREE.Uniform(new THREE.Color(0xf50a0a)),
  uTime: new THREE.Uniform(0),
  uDelta: new THREE.Uniform(0),
}

function PolygonMesh({
  coords,
  children,
}: {
  coords: Coord[]
  children?: any
}) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(...coords[0])
    for (let i = 1; i < coords.length; i++) {
      shape.lineTo(...coords[i])
    }

    const geometry = new THREE.ExtrudeGeometry(shape, {
      bevelSize: 0,
      bevelThickness: 0,
      bevelSegments: 0,
    })
    geometry.computeVertexNormals()
    return geometry
  }, [coords])


  return (
    <mesh geometry={geometry}>
      <CustomShaderMaterial
        baseMaterial={THREE.MeshPhysicalMaterial}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        vertexShader={vertex}
        fragmentShader={fragment}
        depthWrite={false}
        transparent={true}
        alphaTest={0.01}
      />
      {children}
    </mesh>
  )
}

function MultiPolygonMesh({
  coordss,
  children,
}: {
  coordss: Coord[][]
  children?: any
}) {
  return (
    <group>
      {coordss.map((item, ndx) => {
        return <PolygonMesh key={ndx} coords={item} />
      })}
      {children}
    </group>
  )
}

function ProvinceHtml({ feature }: { feature: Feature }) {
  const {
    properties: { center, name },
  } = feature

  return !center ? null : (
    <Html position={[...(center ?? [0, 0]), 0]} center distanceFactor={5}>
      <div className='relative cursor-pointer -translate-y-4'>
        <div
          className='inline-block whitespace-nowrap rounded-2xl
        bg-gray-900 text-l text-gray-200 px-3 py-1.5 select-none'
        >
          {name ?? ''}
        </div>

        <div
          className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-5
        border-10 border-transparent border-t-gray-900'
        ></div>
      </div>
    </Html>
  )
}

function Province({ feature }: { feature: Feature }) {
  const {
    geometry: { type, coordinates },
  } = feature

  if (type === 'Polygon') {
    const coords = coordinates[0] as Coord[]
    return (
      <PolygonMesh coords={coords}>
        <ProvinceHtml feature={feature} />
      </PolygonMesh>
    )
  } else if (type === 'MultiPolygon') {
    const coords = (coordinates as Coord[][][]).map((item) => {
      return item[0]
    })

    return (
      <MultiPolygonMesh coordss={coords}>
        <ProvinceHtml feature={feature} />
      </MultiPolygonMesh>
    )
  } else {
    return null
  }
}

function China() {
  // useEffect(() => {
  //   (async() => {
  //     const json = await fetch(asset('/data/china.json')).then(res => res.json())
  //   })()
  // }, [])

  const data = useLoader(THREE.FileLoader, asset('/data/china.json'))
  const json = typeof data === 'string' ? JSON.parse(data) : data

  const features = json.features.slice(0, 34) as Feature[]
  const center = json.properties.center as Coord[]

  console.log(json.features)

  const { uTime, uDelta } = useUniformTime()
  uniforms.uTime = uTime
  uniforms.uDelta = uDelta

  useControls({
    color: {
      value: '#' + uniforms.uColor.value.getHexString(),
      onChange: (value) => {
        uniforms.uColor.value.set(value)
      },
    },
    sideColor: {
      value: '#' + uniforms.uSideColor.value.getHexString(),
      onChange: (value) => {
        uniforms.uSideColor.value.set(value)
      },
    },
  })
  console.log('render')

  return (
    <group scale={0.2}>
      {features.map((item, ndx) => {
        return <Province key={ndx} feature={item}></Province>
      })}
    </group>
  )
}


export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        <color attach={'background'} args={['#191920']} />
        <fog attach={'fog'} args={['#191920', 0.1, 20]} />
        {/* <Perf position='top-left' /> */}
        {/* <axesHelper /> */}
        <OrbitControls />
        <ambientLight />
        <directionalLight position={[0, 0, 3]} />

        <Suspense fallback={null}>
          <Center>
            <China />
          </Center>
        </Suspense>

      </Canvas>
      <Loader/>
    </div>
  )
}
