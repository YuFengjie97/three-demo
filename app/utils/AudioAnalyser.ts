import { uniform } from 'three/tsl'
import * as THREE from 'three/webgpu'

export interface BinInfo {
  start: number
  end: number
  count: number
  freqData: Float32Array
  freqAvg: { value: number }
}

export interface BeatControl {
  beatAcc: THREE.UniformNode<"float", number> // 记录beat触发了多少词
  beatActive: THREE.UniformNode<"float", number> // 为1则触发beat,否则则逐渐衰减
  beatAtten: { value: number }
  smooth: { value: number } // 根据以往得到平滑能量值,也是beatActive判断依据,如果频率大于此值,则触发beat
  lerp: { value: number } // 平滑系数,用于计算smooth
  threshold: { value: number } // beat触发阈值

  attack: {value: number} // 
  release: {value: number}
}

export class AudioAnalyser {
  fftSize: number
  audioUrl: string
  listener: THREE.AudioListener
  sampleRate: number
  bin: number

  subInfo: BinInfo
  midInfo: BinInfo
  highInfo: BinInfo
  freqAvg = { value: 0 }

  subBeatControl: BeatControl
  midBeatControl: BeatControl
  highBeatControl: BeatControl

  sound: THREE.Audio
  audioLoader: THREE.AudioLoader
  analyser: THREE.AudioAnalyser


  constructor(fftSize: number, audioUrl: string) {
    this.fftSize = fftSize
    this.audioUrl = audioUrl
    const listener = new THREE.AudioListener();
    const sampleRate = listener.context.sampleRate;
    const bin = sampleRate / fftSize
    /**
     * 低频 20-250
     * 低中频 250-500
     * 中频 500-2000
     * 中高频 2000-4000
     * 高频 4000-20000
     */
    const subInfo = this.initBinInfo(20, 500, bin);
    const midInfo = this.initBinInfo(500, 4000, bin);
    const highInfo = this.initBinInfo(4000, 20000, bin);
    this.subBeatControl = this.initBeatControl()
    this.midBeatControl = this.initBeatControl()
    this.highBeatControl = this.initBeatControl()

    const sound = new THREE.Audio(listener);
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

    this.listener = listener
    this.sampleRate = sampleRate
    this.bin = bin
    this.subInfo = subInfo
    this.midInfo = midInfo
    this.highInfo = highInfo
    this.sound = sound
    this.audioLoader = audioLoader
    this.analyser = analyser
  }

  uploadSound(file: File){
    this.sound.pause()
    const audioUrl = URL.createObjectURL(file);
    this.audioLoader.load(audioUrl, (buffer) => {
      this.sound.setBuffer(buffer);
      this.sound.setLoop(true);
      this.sound.setVolume(1);
      this.sound.play()
    })
  }

  initBinInfo(freqStart: number, freqEnd: number, bin: number): BinInfo {
    const start = Math.floor(freqStart / bin);
    const end = Math.floor(freqEnd / bin);
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
  }
  initBeatControl(): BeatControl {
    return {
      beatAcc: uniform(0),
      beatActive: uniform(.1),
      beatAtten: { value: .9 },
      smooth: { value: 1 },
      lerp: { value: 0.01 },
      threshold: { value: 1 },
      attack: {value: .8},
      release: {value: .1},
    }
  }

  updateFreqData(freqData: Uint8Array, info: BinInfo) {
    const { start, end, count, freqAvg } = info
    let sum = 0
    for (let i = 0; i < count; i++) {
      const freq = (freqData[start + i] ?? 0) / 255
      info.freqData[i] = freq
      sum += freq
    }
    freqAvg.value = sum / count
  }

  updateBeat(control: BeatControl, info: BinInfo) {
    const { freqAvg } = info; // 确保这是低频段的平均值
    const { beatAcc, smooth, attack, release, threshold, beatActive, beatAtten } = control;

    // 1. 动态平滑追踪 (Envelope Follower)
    const lerpRate = freqAvg.value > smooth.value ? attack.value : release.value;
    smooth.value += (freqAvg.value - smooth.value) * lerpRate;

    // 2. 阈值判断
    const isTriggered = freqAvg.value > smooth.value * threshold.value;

    if (isTriggered) {
      // 如果想限制高频触发，可以判断当前帧与上次触发的时间差
      if (beatActive.value < 0.5) { // 只有能量消退到一定程度才允许再次激活
        beatAcc.value += 1;
      }
      beatActive.value = 1.0;
    } else {
      // 3. 模拟 TD 的衰减
      beatActive.value *= beatAtten.value;
      if (beatActive.value < 1e-4) beatActive.value = 0;
    }
  }

  update() {
    const freqData = this.analyser.getFrequencyData();
    this.updateFreqData(freqData, this.subInfo)
    this.updateFreqData(freqData, this.midInfo)
    this.updateFreqData(freqData, this.highInfo)
    this.freqAvg.value = this.analyser.getAverageFrequency() / 255

    this.updateBeat(this.subBeatControl, this.subInfo)
    this.updateBeat(this.midBeatControl, this.midInfo)
    this.updateBeat(this.highBeatControl, this.highInfo)
  }
}