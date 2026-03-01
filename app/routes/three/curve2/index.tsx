import { Center, Loader, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { createContext, Suspense, useContext, useMemo, useRef } from 'react'
import { createNoise4D } from 'simplex-noise'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { useUniformTime } from '~/hook/useUniformTime'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import cubeVS from './cube.vs.glsl'
import cubeFS from './cube.fs.glsl'
import tubeVS from './tube.vs.glsl'
import tubeFS from './tube.fs.glsl'

const noise = createNoise4D()
const { sin, random, PI, floor } = Math

function randomRange(min: number, max: number){
  return (max-min)*random() + min;
}

const BaseContext = createContext<{
  colorBase: string
  colorPattern: string
  gridSize: number
  gridGap: number
  cubeSize: number
  upCellPos: THREE.Vector3[]
  downCellPos: THREE.Vector3[]
}>({
  colorBase: '',
  colorPattern: '',
  gridSize: 3,
  gridGap: 0.2,
  cubeSize: 1,
  upCellPos: [],
  downCellPos: [],
})

function Cube(prop: any) {
  const { colorBase, colorPattern, cubeSize } = useContext(BaseContext)

  const size = [cubeSize, 0.1, cubeSize]

  const { geo } = useMemo(() => {
    const geo = new THREE.BoxGeometry(...size)
    return { geo }
  }, [size])

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    seed: new THREE.Uniform(floor(random() * 1000)),
    colorBase: new THREE.Uniform(new THREE.Color(colorBase)),
    colorPattern: new THREE.Uniform(new THREE.Color(colorPattern)),
    uSize: new THREE.Uniform(new THREE.Vector3(...size)),
  }

  return (
    <mesh geometry={geo} {...prop}>
      <CustomShaderMaterial
        uniforms={uniforms}
        baseMaterial={THREE.MeshStandardMaterial}
        roughness={.1}
        metalness={.4}
        vertexShader={cubeVS}
        fragmentShader={cubeFS}
        // transparent={true}
        // depthWrite={false}
        // blending={THREE.AdditiveBlending}
        // toneMapped={false}
        // side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Grid(prop: any) {
  const { gridSize, gridGap, cubeSize } = useContext(BaseContext)

  const positions = useMemo(() => {
    const positions: THREE.Vector3[] = []
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = i * (cubeSize + gridGap)
        const z = j * (cubeSize + gridGap)
        positions.push(new THREE.Vector3(x, 0, z))
      }
    }
    return positions
  }, [gridSize, gridGap])

  return (
    <group {...prop}>
      {positions.map((item, i) => {
        return <Cube position={item} key={i} />
      })}
    </group>
  )
}

function Thread() {
  const {upCellPos, downCellPos, colorPattern} = useContext(BaseContext)
  const s1 = upCellPos[floor(random()*upCellPos.length)]
  const e1 = downCellPos[floor(random()*downCellPos.length)]

  const {tubeGeo, cylinderGeo} = useMemo(() => {
    const s2 = s1.clone().add(new THREE.Vector3(0,-.1,0))
    const e2 = e1.clone().add(new THREE.Vector3(0,.1,0))

    const s3 = s2.clone().add(new THREE.Vector3(0,randomRange(-1,-.5),0))
    const e3 = e2.clone().add(new THREE.Vector3(0,randomRange(.3,.5),0))
    const points = [s1,s2,s3,e3,e2,e1]
    const curve = new THREE.CatmullRomCurve3(points)

    const radius = .016
    const tubeGeo = new THREE.TubeGeometry(curve, 100, radius, 6, false)
    const cylinderGeo = new THREE.CylinderGeometry(radius*2.,radius*2., .08, 6, 10)
    return {tubeGeo, cylinderGeo}
  }, [s1, e1])

  const uniformTime = useUniformTime()
  const life = random()
  const uniforms = {
    ...uniformTime,
    life: new THREE.Uniform(life),
    color: new THREE.Uniform(new THREE.Color(colorPattern))
  }

  return (
    <>
      <mesh geometry={cylinderGeo} position={[s1.x, s1.y-.06, s1.z]}>
        <meshStandardMaterial
          color={colorPattern}
          metalness={.5}
          roughness={.1}
        />
      </mesh>
      <mesh geometry={tubeGeo}>
        <CustomShaderMaterial
          baseMaterial={THREE.MeshBasicMaterial}
          uniforms={uniforms}
          vertexShader={tubeVS}
          fragmentShader={tubeFS}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh geometry={cylinderGeo}position={[e1.x, e1.y+.06, e1.z]}>
        <meshStandardMaterial
          color={colorPattern}
          metalness={.5}
          roughness={.1}
        />
      </mesh>
    </>
  )
}

function Base() {
  const color = useControls({
    colorBase: '#3bc89c',
    colorPattern: '#65c8ce',
  })
  const gridSize = 3
  const gridGap = 0.2
  const cubeSize = 1
  const yGap = 2
  const { upCellPos, downCellPos } = useMemo(() => {
    const cellNum = 12 // 根据fs uv切割得来
    const cellSize = cubeSize / cellNum
    const upCellPos: THREE.Vector3[] = []
    const downCellPos: THREE.Vector3[] = []
    for (let gridX = 0; gridX < gridSize; gridX++) {
      for (let gridY = 0; gridY < gridSize; gridY++) {
        // 每块cube的位置
        const cubePosX = gridX * (cubeSize + gridGap) - cubeSize / 2
        const cubePosY = gridY * (cubeSize + gridGap) - cubeSize / 2
        for (let cellX = 0; cellX < 12; cellX++) {
          for (let cellY = 0; cellY < 12; cellY++) {
            const cellPosX = cubePosX + cellX * cellSize + cellSize / 2
            const cellPosY = cubePosY + cellY * cellSize + cellSize / 2
            upCellPos.push(new THREE.Vector3(cellPosX, 0, cellPosY))
            downCellPos.push(new THREE.Vector3(cellPosX, -yGap, cellPosY))
          }
        }
      }
    }

    return { upCellPos, downCellPos }
  }, [gridSize, gridGap, yGap])

  const threadCount = 40

  return (
    <BaseContext value={{ ...color, gridSize, gridGap, cubeSize, upCellPos, downCellPos }}>
      <Grid />
      <Grid position={[0, -yGap, 0]} />

      {/* 测试cell位置是否准确 */}
      {/* {
        downCellPos.map((item, i) => {
          return (
            <mesh key={i} position={[...item.toArray()]} scale={[.01,1.,.01]}>
              <boxGeometry/>
              <meshBasicMaterial/>
            </mesh>
          )
        })
      } */}
      {
        Array.from({length: threadCount}).map((item, i) => {
          return (
            <Thread key={i}/>
          )
        })
      }
    </BaseContext>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas
        camera={{ position: [0, 0, 4] }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        {/* <Perf position='top-left' /> */}
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />
        <ambientLight intensity={1}/>
        {/* <pointLight intensity={1.}/> */}

        <Suspense fallback={null}>
          <Center>
            <Base />
          </Center>
        </Suspense>

        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
      <Loader />
    </div>
  )
}
