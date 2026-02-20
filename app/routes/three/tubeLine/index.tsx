import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const { random, ceil, floor, sin } = Math

function Particle({
  tubeGeo,
  tubularSegments,
  radialSegments,
  progress,
}: {
  tubeGeo: THREE.TubeGeometry
  tubularSegments: number
  radialSegments: number
  progress: number
}) {
  const positionArr = tubeGeo.getAttribute('position').array

  const ref = useRef<THREE.Mesh>(null!)
  let prePos: THREE.Vector3 | null = null
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    // const progress = sin(t*.5)*.5+.5
    progress += delta * .03
    progress = progress % 1

    const segmentsProgress = floor(progress * tubularSegments)
    const posNdx = segmentsProgress * radialSegments

    let x = 0
    let y = 0
    let z = 0
    for (let i = 0; i < radialSegments; i++) {
      const posInd = posNdx + i
      x += positionArr[posInd * 3 + 0]
      y += positionArr[posInd * 3 + 1]
      z += positionArr[posInd * 3 + 2]
    }
    const currentPos = new THREE.Vector3(
      x / radialSegments,
      y / radialSegments,
      z / radialSegments,
    )
    if (prePos) {
      prePos.lerp(currentPos, 0.1)
    } else {
      prePos = new THREE.Vector3().copy(currentPos)
    }
    ref.current.position.set(...prePos.toArray())
  })

  return (
    <mesh ref={ref} scale={0.1}>
      <icosahedronGeometry />
      <meshNormalMaterial />
    </mesh>
  )
}

function Particles({
  tubeGeo,
  tubularSegments,
  radialSegments,
}: {
  tubeGeo: THREE.TubeGeometry
  tubularSegments: number
  radialSegments: number
}) {
  const count = 100
  const data = Array.from({ length: count }, (item) => {
    return random()
  })

  return data.map((item, i) => {
    return (
      <Particle
        key={i}
        tubeGeo={tubeGeo}
        tubularSegments={tubularSegments}
        radialSegments={radialSegments}
        progress={item}
      />
    )
  })
}

function Base() {
  const tubularSegments = 2000
  const radialSegments = 10

  const { geo } = useMemo(() => {
    const points: THREE.Vector3[] = []
    const icoGeo = new THREE.IcosahedronGeometry(2, 0)
    const icoEdgeGeo = new THREE.EdgesGeometry(icoGeo)
    const { count, array } = icoEdgeGeo.getAttribute('position')
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const x = array[i3 + 0]
      const y = array[i3 + 1]
      const z = array[i3 + 2]
      points.push(new THREE.Vector3(x, y, z))
    }

    const curve = new THREE.CatmullRomCurve3(points, true)

    const geo = new THREE.TubeGeometry(
      curve,
      tubularSegments,
      0.04,
      radialSegments,
      false,
    )

    return { geo }
  }, [])

  return (
    <>
      <mesh geometry={geo}>
        <meshBasicMaterial
          color={0xb089ff}
          transparent={true}
          opacity={0.2}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={true}
        />
      </mesh>
      <Particles
        tubeGeo={geo}
        tubularSegments={tubularSegments}
        radialSegments={radialSegments}
      />
    </>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        <axesHelper args={[10]} />
        <OrbitControls />
        <ambientLight />
        <pointLight intensity={40} position={[0, 4, 0]} />
        <Base />
      </Canvas>
    </div>
  )
}
