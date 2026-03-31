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
  mx_noise_vec3,
  mx_noise_vec4,
  hue,
  color,
  dot,
} from 'three/tsl'
import { Suspense, useEffect, useMemo } from 'react'
import { Loader, OrbitControls, useTexture } from '@react-three/drei'
import { asset } from '~/utils/asset'

import { type ThreeToJSXElements } from '@react-three/fiber'
import { useControls } from 'leva'

declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any)

function Base() {
  const tex = useTexture(asset('/img/texture/particle/star_09.png'))

  const uLifeSpeed = uniform(0.1)
  const uSpeed = uniform(5)
  const uCol = uniform(new THREE.Color(0xff0000))
  const uVelNoiseScale = uniform(0.1)
  const uHueOffsetScale = uniform(.5)
  useControls({
    lifeSpeed: {
      value: uLifeSpeed.value,
      min: 0,
      max: 2,
      step: 0.1,
      onChange: (v) => {
        uLifeSpeed.value = v
      },
    },
    speed: {
      value: uSpeed.value,
      min: 0,
      max: 15,
      step: 0.1,
      onChange: (v) => {
        uSpeed.value = v
      },
    },
    col: {
      value: new THREE.Color(uCol.value).getStyle(),
      onChange(v) {
        const c = new THREE.Color(v)
        uCol.value = c
      },
    },
    velNoiseScale: {
      value: uVelNoiseScale.value,
      min: 0,
      max: .5,
      step: 0.01,
      onChange: (v) => {
        uVelNoiseScale.value = v
      },
    },
    uHueOffsetScale: {
      value: uHueOffsetScale.value,
      min:0,
      max: 1.,
      step: .01,
      onChange: (v) => {
        uHueOffsetScale.value = v
      },
    }
  })

  const { mesh, computeInit, computeUpdate } = useMemo(() => {

    const geo = new THREE.PlaneGeometry(0.4, 0.4, 1, 1)
    const count = 60000

    const positionBuffer = instancedArray(count, 'vec3')
    const velBuffer = instancedArray(count, 'vec3')
    const lifeBuffer = instancedArray(count, 'float')

    const initPos = Fn(() => {
      const idx = instanceIndex
      const pos = vec3(
        hash(idx.add(time).add(11.61)),
        hash(idx.add(time).add(22.13)),
        hash(idx.add(time).add(33.43)),
      )
        .sub(0.5)
        .mul(vec3(40,2,40))
      return pos
    })

    const updataVel = Fn(([pos]) => {
      // const vx = sin(pos.z.mul(0.5))
      // const vy = sin(pos.x.mul(0.5))
      // const vz = sin(pos.y.mul(0.5))
      // return vec3(vx, vy, vz)

      const p = pos.mul(uVelNoiseScale)


      const vx = mx_noise_vec3(p.add(vec3(1, 0, 0).mul(time)))
      const vy = mx_noise_vec3(p.add(vec3(0, 1, 0).mul(time)))
      const vz = mx_noise_vec3(p.add(vec3(0, 0, 1).mul(time)))
      // const vx = mx_noise_vec4(p.xyz, time)
      // const vy = mx_noise_vec4(p.xyz, time.add(1))
      // const vz = mx_noise_vec4(p.xyz, time.add(2))
      return vec3(vx, vy, vz).normalize()
    })

    const computeInit = Fn(() => {
      const idx = instanceIndex
      const posInit = initPos()
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
      pos.addAssign(vel.mul(deltaTime).mul(uSpeed))
      positionBuffer.element(idx).assign(pos)

      // 更新life
      const life = lifeBuffer.element(idx)
      life.addAssign(deltaTime.mul(uLifeSpeed))
      lifeBuffer.element(idx).assign(life)

      // 用时间种子重新更新粒子位置
      If(life.greaterThan(1), () => {
        lifeBuffer.element(idx).assign(fract(life))
        positionBuffer.element(idx).assign(initPos())
      })
    })().compute(count)

    const getColor = Fn(() => {
      const idx = instanceIndex
      const pos = positionBuffer.element(idx)
      const hueOffset = dot(pos, vec3(0.1, 0.2, 0.3)).mul(uHueOffsetScale)
      return hue(color(uCol), hueOffset)
    })

    const fs = Fn(([lifeBuffer]) => {
      const idx = instanceIndex
      const life = lifeBuffer.element(idx)
      const d = texture(tex).r
      // const col = vec3(3, 2, 1).add(idx)
      // col.assign(vec3(sin(col.x), sin(col.y), sin(col.z)))
      const col = getColor()
      const fadeByLife = sin(life.mul(PI))
      return vec4(col.mul(d), d.mul(fadeByLife))
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

  useFrame(() => {
    renderer.compute(computeUpdate)
  })

  return <primitive object={mesh} />
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas
        camera={{position: [0,5,15]}}
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
