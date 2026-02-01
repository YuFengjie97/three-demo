import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'


export function useUniformTime() {
  const uniforms = useMemo(() => ({
    uTime: new THREE.Uniform(0),
    uDelta: new THREE.Uniform(0),
  }), [])

  useFrame(({ clock }, delta) => {
    uniforms.uTime.value = clock.getElapsedTime()
    uniforms.uDelta.value = Math.min(1., delta)
  })

  return uniforms
}
