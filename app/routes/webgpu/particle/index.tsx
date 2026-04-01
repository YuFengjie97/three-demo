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
  uv,
  varying,
} from 'three/tsl'
import { Suspense, useEffect, useMemo } from 'react'
import { Loader, OrbitControls, useTexture } from '@react-three/drei'
import { asset } from '~/utils/asset'

import { type ThreeToJSXElements } from '@react-three/fiber'
import { useControls } from 'leva'
import { ResourceTracker } from '~/utils/resourceTracker'

declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any)

function Base() {
  const rt = useMemo(() => new ResourceTracker(), [])

  const tex = useTexture(asset('/img/texture/particle/star_09.png')) as unknown as THREE.Texture<HTMLImageElement>
  // const tex = useMemo(() => {
  //   const loader = new THREE.TextureLoader();
  //   const tex =  loader.load( asset('/img/texture/particle/star_09.png') );
  //   return tex
  // }, [])
  
  rt.track(tex)

  const uniforms = useMemo(() => ({
    uLifeSpeed: uniform(0.1),
    uSpeed: uniform(5),
    uCol: uniform(color(new THREE.Color(0xff0000))),
    uVelNoiseScale: uniform(0.1),
    uHueOffsetScale: uniform(0.5),
    uTex: (tex)
  }), [])

  useControls({
    lifeSpeed: { value: 0.1, min: 0, max: 2, step: 0.1, onChange: (v) => { uniforms.uLifeSpeed.value = v } },
    speed: { value: 5, min: 0, max: 15, step: 0.1, onChange: (v) => { uniforms.uSpeed.value = v } },
    col: { value: '#ff0000', onChange: (v) => { uniforms.uCol.value.set(v) } },
    velNoiseScale: { value: 0.1, min: 0, max: 0.5, step: 0.01, onChange: (v) => { uniforms.uVelNoiseScale.value = v } },
    uHueOffsetScale: { value: 0.5, min: 0, max: 1, step: 0.01, onChange: (v) => { uniforms.uHueOffsetScale.value = v } }
  })


  const { mesh, computeInit, computeUpdate } = useMemo(() => {

    const geo = new THREE.PlaneGeometry(0.4, 0.4, 1, 1)
    rt.track(geo)
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
      const p = pos.mul(uniforms.uVelNoiseScale)

      const vx = mx_noise_vec3(p.add(vec3(1, 0, 0).mul(time)))
      const vy = mx_noise_vec3(p.add(vec3(0, 1, 0).mul(time)))
      const vz = mx_noise_vec3(p.add(vec3(0, 0, 1).mul(time)))
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
      pos.addAssign(vel.mul(deltaTime).mul(uniforms.uSpeed))
      positionBuffer.element(idx).assign(pos)

      // 更新life
      const life = lifeBuffer.element(idx)
      life.addAssign(deltaTime.mul(uniforms.uLifeSpeed))
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
      const life = lifeBuffer.element(idx)

      const d = texture(tex).r
      const hueOffset = dot(pos, vec3(0.1, 0.2, 0.3)).mul(uniforms.uHueOffsetScale)
      const col = hue(color(uniforms.uCol), hueOffset).mul(d)

      const fadeByLife = sin(life.mul(PI))
      const alpha = d.mul(fadeByLife)

      return vec4(col, alpha)
    })


    const mat = new THREE.SpriteNodeMaterial()
    // const mat = new THREE.NodeMaterial()
    rt.track(mat)

    const posAttr = positionBuffer.toAttribute()
    mat.positionNode = posAttr

    mat.transparent = true
    mat.depthWrite = false
    // mat.alphaTest = 0.1
    mat.blending = THREE.AdditiveBlending
    mat.colorNode = getColor()

    const mesh = new THREE.InstancedMesh(geo, mat, count)
    rt.track(mesh)
    return { mesh, computeInit, computeUpdate }
  }, [])

  const renderer = useThree().gl as unknown as THREE.WebGPURenderer

  useEffect(() => {
    renderer.compute(computeInit)
    return () => {
      rt.dispose()
    }
  }, [])

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
