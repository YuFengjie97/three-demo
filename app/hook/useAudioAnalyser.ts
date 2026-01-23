import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'


const FFT_SIZE = 1024
const DATA_LEN = FFT_SIZE / 2

const instance: {
  lerpV: number
  audioUrl: string
  listener: THREE.AudioListener | null
  buffer: AudioBuffer | null
  sound: THREE.Audio | null
  analyser: THREE.AudioAnalyser | null
  freqData: Float32Array
  refCount: number
  dataTex: THREE.DataTexture | null
} = {
  lerpV: .3,
  audioUrl: '',
  listener: null,
  buffer: null,
  sound: null,
  analyser: null,
  freqData: new Float32Array(DATA_LEN),
  refCount: 0,
  dataTex: null
}
function initDataTex() {
  const tex = new THREE.DataTexture(
    instance.freqData,
    DATA_LEN,
    1,
    THREE.RedFormat,
    THREE.FloatType
  )
  tex.minFilter = THREE.NearestFilter
  tex.magFilter = THREE.NearestFilter
  tex.needsUpdate = true
  instance.dataTex = tex
}

export function useAudioAnalyser(audioUrl: string) {
  const { camera } = useThree()
  instance.buffer = useLoader(THREE.AudioLoader, audioUrl)


  useEffect(() => {
    // 首次初始化,永远只执行一次
    if (instance.refCount === 0) {
      
      initDataTex()
      instance.listener = new THREE.AudioListener()
      camera.add(instance.listener)
      instance.sound = new THREE.Audio(instance.listener)
      instance.sound.setBuffer(instance.buffer!)

      instance.sound.setLoop(true)
      instance.sound.setVolume(0.5)

      instance.analyser = new THREE.AudioAnalyser(instance.sound, FFT_SIZE)
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
  }, [instance.buffer])



  useFrame(() => {
    if (!instance.sound?.isPlaying) return
    
    setLerpFreqData()
    if (instance.dataTex) instance.dataTex.needsUpdate = true
  })


  function setLerpFreqData() {

    if (!instance.analyser) return
    
    const data = instance.analyser.getFrequencyData()
    for (let i = 0; i < DATA_LEN; i++) {
      const mix = (data[i] / 255) * instance.lerpV + instance.freqData[i] * (1 - instance.lerpV)
      instance.freqData[i] = mix
    }
  }

  // 外部使用不能解构赋值,会为null
  return {
    get sound() { return instance.sound },
    get analyser() { return instance.analyser },
    get lerpFreqData() { return instance.freqData },
    get dataTex() { return instance.dataTex },
    set lerpV(val: number) { instance.lerpV = val }
  }
}