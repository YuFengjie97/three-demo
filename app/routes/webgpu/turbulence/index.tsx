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
  vec2,
  Loop,
  max,
  toneMapping,
  cameraPosition
} from 'three/tsl'
import { Suspense, useEffect, useMemo } from 'react'
import { Loader, OrbitControls, OrthographicCamera, useTexture } from '@react-three/drei'
import { asset } from '~/utils/asset'

import { type ThreeToJSXElements } from '@react-three/fiber'
import { useControls } from 'leva'
import { sin3 } from '~/utils/tsl'

declare module '@react-three/fiber' {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any)

function Base(){
  const getColor = useMemo(() => {
    const map = Fn(([p]: [THREE.Node<'vec3'>]) => {
      const q = p

      const amp = float(1)
      const fre = float(1)
      Loop(4, () => {
        amp.mulAssign(.5)
        fre.mulAssign(2.)
        q.addAssign(sin3(q.zxy.mul(fre).add(time)).mul(amp))
      })

      const d = length(q).sub(.4)
      return d
    })


    return Fn(() => {
      // const ro = vec3(0,0,-10)
      const ro = cameraPosition
      const uv2 = uv().sub(vec2(.5))
      const rd = vec3(uv2, -1).normalize()
      let z = float(0)
      let p = vec3(0)
      const col = vec3(0,0,0)
      Loop(100, (i) => {
        p.assign(ro.add(rd.mul(z)))

        // @ts-ignore
        const d = map(p).mul(.6)
        z.addAssign(d)

        const c = sin3(vec3(3,2,1).add(z)).mul(.5).add(.5)
        // const c = vec3(1,0,0)
        
        const glowR = float(.1)
        col.addAssign(c.mul(glowR).div(max(d, 0.01)))
      })

      col.toneMapping()
      return col
    })
  }, [])

  return (
    <mesh>
      <planeGeometry args={[4,4,1,1]} />
      <meshBasicNodeMaterial
        side={THREE.DoubleSide}
        colorNode={getColor()}
      />
    </mesh>
  )
}

export default function () {
  return (
    <div className='h-screen'>
      <Canvas
        camera={{ position: [0, 0, 4] }}
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
