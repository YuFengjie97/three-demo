import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'


export function useUniformTime() {
  const uniforms = useMemo(() => ({
    uTime: new THREE.Uniform(0),
    uDelta: new THREE.Uniform(0),
  }), [])

  const timer = useMemo(() => {
    const timer = new THREE.Timer()
    if(typeof document !== undefined){
      timer.connect(document)
    }
    return timer
  }, [])

  useFrame(({ clock }, delta) => {
    // uniforms.uTime.value = clock.getElapsedTime()
    // uniforms.uDelta.value = Math.min(1., delta)

    timer.update()
    uniforms.uTime.value = timer.getElapsed()
    uniforms.uDelta.value = timer.getDelta()
  })

  return uniforms
}
