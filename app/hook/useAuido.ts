import { useFrame, useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three/webgpu'


export interface BinInfo {
  start: number
  end: number
  count: number
  freqData: Float32Array
  freqAvg: { value: number }
}

export function useAudioAnalyser(fftSize = 1024, audioUrl: string) {
  const { floor, ceil } = Math;
  const { camera } = useThree();

  const getBinInfo: (freqStart: number, freqEnd: number, bin: number) => BinInfo
    = (freqStart, freqEnd, bin) => {
      const start = floor(freqStart / bin);
      const end = floor(freqEnd / bin);
      const count = end - start;
      const freqData = new Float32Array(count);
      const freqAvg = { value: 0 };
      return {
        start,
        end,
        count,
        freqData,
        freqAvg,
      };
    };

  const updateFreqData = (freqData: Uint8Array, info: BinInfo) => {
    const { start, end, count, freqAvg } = info
    let sum = 0
    for (let i = 0; i < count; i++) {
      const freq = (freqData[start + i] ?? 0) / 255
      info.freqData[i] = freq
      sum += freq
    }
    freqAvg.value = sum / count
  }

  const { sound, analyser, subInfo, midInfo, highInfo, freqAvg } =
    useMemo(() => {
      const listener = new THREE.AudioListener();
      const sampleRate = listener.context.sampleRate;
      /**
       * 低频 20-250
       * 低中频 250-500
       * 中频 500-2000
       * 中高频 2000-4000
       * 高频 4000-20000
       */
      const bin = sampleRate / fftSize;
      const subInfo = getBinInfo(20, 250, bin);
      const midInfo = getBinInfo(500, 2000, bin);
      const highInfo = getBinInfo(4000, 20000, bin);

      camera.add(listener);
      const sound = new THREE.Audio(listener);
      // const audioUrl = asset("/sound/yanqi.mp3");
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(audioUrl, (buffer) => {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(1);
      });
      const analyser = new THREE.AudioAnalyser(
        sound,
        fftSize,
      );

      const freqAvg = { value: 0 }

      return {
        sound,
        analyser,
        subInfo,
        midInfo,
        highInfo,
        freqAvg
      };
    }, []);

  useFrame(() => {
    const freqData = analyser.getFrequencyData();
    updateFreqData(freqData, subInfo)
    updateFreqData(freqData, midInfo)
    updateFreqData(freqData, highInfo)
    freqAvg.value = analyser.getAverageFrequency() / 255
  });

  return { sound, analyser, subInfo, midInfo, highInfo, freqAvg };
}