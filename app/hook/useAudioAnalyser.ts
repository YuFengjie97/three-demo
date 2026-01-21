import { useLoader, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

const instance: {
  listener: THREE.AudioListener | null
  sound: THREE.Audio | null
  analyser: THREE.AudioAnalyser | null
  freqData: Float32Array
  refCount: number
} = {
  listener: null,
  sound: null,
  analyser: null,
  freqData: new Float32Array(0),
  refCount: 0,
}

export function useAudioAnalyser(audioUrl: string) {
  const fft = 1024
  const { camera } = useThree()
  const buffer = useLoader(THREE.AudioLoader, audioUrl)
  
  useEffect(() => {
    // 首次渲染
    if (instance.refCount === 0) {
      console.log('audioAnalyser 初始化', instance.refCount);
      instance.listener = new THREE.AudioListener()
      camera.add(instance.listener)
      instance.sound = new THREE.Audio(instance.listener)
      instance.sound.setBuffer(buffer)
      instance.sound.setLoop(true)
      instance.sound.setVolume(0.5)

      instance.analyser = new THREE.AudioAnalyser(instance.sound, fft)
      instance.freqData = new Float32Array(fft/2)
    }

    instance.refCount++

    return () => {
      instance.refCount--
      if (instance.refCount === 0) {
        instance.sound?.stop()
        instance.listener && camera.remove(instance.listener)

        instance.sound = null
        instance.listener = null
        instance.analyser = null
      }
    }
  }, [buffer, camera])


  function getLerpFreqData(lerpV: number) {
    if (!instance.analyser) return instance.freqData
    const data = instance.analyser.getFrequencyData()
    for (let i = 0; i < fft/2; i++) {
      const mix = (data[i] / 255) * lerpV + instance.freqData[i] * (1 - lerpV)
      instance.freqData[i] = mix
    }
    return instance.freqData
  }


  return {
    get sound() { return instance.sound },
    get analyser() { return instance.analyser },
    getLerpFreqData,
  }
}