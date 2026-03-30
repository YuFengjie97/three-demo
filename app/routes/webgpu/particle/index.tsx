import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three/webgpu'
import {
  Fn,
  sin,
  length,
  mul,
  add,
  div,
  pow,
  float,
  abs,
  time,
  positionLocal,
  vec3,
  vec4,
  smoothstep,
  texture,
  instanceIndex,
  instancedArray,
  hash,
  uniform,
  storage,
  deltaTime,
  fract,
  If,
  PI,
} from 'three/tsl'
import { Suspense, useEffect, useMemo } from 'react'
import { Loader, OrbitControls, useTexture } from '@react-three/drei'
import { asset } from '~/utils/asset'

import { type ThreeToJSXElements } from '@react-three/fiber'
import { Perf } from 'r3f-perf'

declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any)

function Base() {
  const tex = useTexture(asset('/img/texture/particle/star_09.png'))

  const { mesh, computeInit, computeUpdate } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(.4, .4, 1, 1)
    const count = 1000

    const positionBuffer = instancedArray(count, 'vec3')
    const velBuffer = instancedArray(count, 'vec3')
    const lifeBuffer = instancedArray(count, 'float')

    const initPos = Fn(([seed]) => {
      const idx = instanceIndex
      const pos = vec3(
        hash(idx.add(seed).add(10)),
        hash(idx.add(seed).add(20)),
        hash(idx.add(seed).add(30)),
      )
        .sub(0.5)
        .mul(40)
      return pos
    })

    const updataVel = Fn(([pos]: any) => {
      const vx = sin(pos.z.mul(0.5))
      const vy = sin(pos.x.mul(0.5))
      const vz = sin(pos.y.mul(0.5))
      return vec3(vx,vy,vz)
    })

    const computeInit = Fn(() => {
      const idx = instanceIndex
      const posInit = initPos(float(0))
      positionBuffer.element(idx).assign(posInit)

      velBuffer.element(idx).assign(vec3(0, 0, 0))

      lifeBuffer.element(idx).assign(hash(idx.add(5)))
    })().compute(count)

    const computeUpdate = Fn(() => {
      const idx = instanceIndex
      const pos = positionBuffer.element(idx)
      // 更新速度
      const vel = updataVel(pos)
      velBuffer.element(idx).assign(vel)

      // 更新位置
      pos.addAssign(vel.mul(deltaTime).mul(5))
      positionBuffer.element(idx).assign(pos)

      // 更新life
      const life = lifeBuffer.element(idx)
      life.addAssign(deltaTime.mul(.5))
      lifeBuffer.element(idx).assign(life)

      // 用时间种子重新更新粒子位置
      If(life.greaterThan(1), () => {
        lifeBuffer.element(idx).assign(fract(life))

        positionBuffer.element(idx).assign(initPos(time))
      })
    })().compute(count)

    const fs = Fn(([lifeBuffer]) => {
      const idx = instanceIndex
      const life = lifeBuffer.element(idx)
      const d = texture(tex).r
      const id = instanceIndex
      const col = vec3(3, 2, 1).add(id)
      col.assign(vec3(sin(col.x), sin(col.y), sin(col.z)))
      return vec4(col.mul(d), d.mul(sin(life.mul(PI))))
    })

    const mat = new THREE.SpriteNodeMaterial()
    // const mat = new THREE.NodeMaterial()

    const posAttr = positionBuffer.toAttribute()
    mat.positionNode = posAttr

    mat.transparent = true
    mat.depthWrite = false
    mat.alphaTest = 0.5
    mat.side = THREE.DoubleSide
    mat.blending = THREE.AdditiveBlending
    mat.fragmentNode = fs(lifeBuffer)

    const mesh = new THREE.InstancedMesh(geo, mat, count)
    return { mesh, computeInit, computeUpdate }
  }, [])

  const renderer = useThree().gl as unknown as THREE.WebGPURenderer
  renderer.compute(computeInit)
  // useEffect(() => {
  //   renderer.compute(computeInit)
  // }, [])

  let initialized = false
  useFrame(() => {
    // if(!initialized) {
    //   renderer.compute(computeInit)
    //   initialized = true
    // }else{
    // }
      renderer.compute(computeUpdate)

  })

  return <primitive object={mesh} />
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props as any)
          await renderer.init()
          return renderer
        }}
      >
        <axesHelper args={[10]} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Base />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}
