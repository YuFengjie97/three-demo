import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import line1Vertex from './line1Vertex.glsl'
import line1Fragment from './line1Fragment.glsl'
import line1PointsFragment from './line1PointsFragment.glsl'
import line2Vertex from './line2Vertex.glsl'
import line2Fragment from './line2Fragment.glsl'
import pointsVertex from './pointsVertex.glsl'
import pointsFragment from './pointsFragment.glsl'
import { useUniformTime } from '~/hook/useUniformTime'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'

// 大宽度网格,球体线框和点云
function Part1({ color }: { color: string }) {
  const geo = useMemo(() => {
    const geo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2, 1))
    return geo
  }, [])
  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    uColor: new THREE.Uniform(new THREE.Color(color)),
  }
  return (
    <>
      {/* 内部球体 */}
      <lineSegments geometry={geo}>
        <CustomShaderMaterial
          uniforms={uniforms}
          baseMaterial={THREE.MeshBasicMaterial}
          vertexShader={line1Vertex}
          fragmentShader={line1Fragment}
        />
      </lineSegments>
      {/* 内部球体顶点处点云 */}
      <points geometry={geo}>
        <CustomShaderMaterial
          uniforms={uniforms}
          baseMaterial={THREE.PointsMaterial}
          vertexShader={line1Vertex}
          fragmentShader={line1PointsFragment}
          transparent={true}
          depthWrite={false}
          size={0.5}
        />
      </points>
    </>
  )
}
// 细网格的球体
function Part2({ color }: { color: string }) {
  const geo = useMemo(() => {
    const geo = new THREE.WireframeGeometry(
      new THREE.IcosahedronGeometry(2.4, 24),
    )
    return geo
  }, [])

  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    uColor: new THREE.Uniform(new THREE.Color(color)),
  }

  return (
    <>
      <lineSegments geometry={geo}>
        <CustomShaderMaterial
          uniforms={uniforms}
          baseMaterial={THREE.MeshBasicMaterial}
          vertexShader={line2Vertex}
          fragmentShader={line2Fragment}
          transparent={true}
          depthWrite={false}
        />
      </lineSegments>
    </>
  )
}

// 内部点云
function Part3({color}:{color: string}){
  const geo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 30)
    return geo
  }, [])
  const uniformTime = useUniformTime()
  const uniforms = {
    ...uniformTime,
    uColor: new THREE.Uniform(new THREE.Color(color)),
  }

  return (
    <>
      <points geometry={geo}>
        <CustomShaderMaterial
          uniforms={uniforms}
          baseMaterial={THREE.PointsMaterial}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          size={.1}
          transparent={true}
          depthWrite={false}
        />
      </points>
    </>
  )
}

function Base() {
  const { color } = useControls({
    color: '#00cec9',
  })
  return (
    <>
      <Part1 color={color} />
      <Part2 color={color} />
      <Part3 color={color}/>
    </>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas>
        {/* <Perf position='top-left'/> */}
        {/* <axesHelper args={[10]} /> */}
        <OrbitControls />
        <Base />

        <EffectComposer>
          <Bloom />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
