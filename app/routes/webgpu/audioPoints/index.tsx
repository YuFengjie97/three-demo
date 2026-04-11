import { OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, useControls } from "leva";
import { Suspense, useEffect, useMemo } from "react";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { lerp } from "three/src/math/MathUtils.js";
import { rotate } from "three/src/nodes/TSL.js";
import { abs, asin, atan, billboarding, cross, deltaTime, triNoise3D, dot, float, floor, Fn, fract, fwidth, hash, If, instancedArray, instanceIndex, length, mat3, max, min, mix, mx_noise_float, mx_noise_vec3, mx_noise_vec4, normalLocal, oneMinus, PI, positionLocal, pow, pow3, rotateUV, select, smoothstep, step, storage, texture, time, TWO_PI, uniform, uv, varying, vec2, vec3, vec4, pass, acos } from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { getFibonacciSphere } from "~/utils/math";
import { getCurlTriNoise, getSphereUV, lookAt, sdBox, sdCircle, sdEquilateralTriangle, sdRoundedX, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";

function Base() {
  const { camera } = useThree();
  camera.position.set(0,0,20)
  const fftSize = 1024;
  const { sound, analyser } = useMemo(() => {
    const fftSize = 1024;
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio(listener);
    const audioUrl = asset("/sound/yanqi.mp3");
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(audioUrl, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(1);
    });
    const analyser = new THREE.AudioAnalyser(sound, fftSize);

    return { sound, analyser };
  }, []);

  // useControls({
  //   play: button(() => {
  //     sound.play();
  //   }),
  //   pause: button(() => {
  //     sound.pause();
  //   }),
  // });

  const uniforms = useMemo(
    () => ({
      uAvgFreq: uniform(0),
      uAvgFreqFactor: uniform(2),
      uSpeed: uniform(8),
      uCurlScale: uniform(0.1),
      uCurlOffset: uniform(0),
      uLifeSpeed: uniform(0.1),
      uColScale: uniform(new THREE.Vector3(.5,4,1))
    }),
    [],
  );
  useControls({
    // uAvgFreqFactor: {
    //   value: uniforms.uAvgFreqFactor.value,
    //   min: 0.01,
    //   max: 20,
    //   step: 0.01,
    //   onChange(v) {
    //     uniforms.uAvgFreqFactor.value = v;
    //   },
    // },
    uSpeed: {
      value: uniforms.uSpeed.value,
      min: 0.01,
      max: 40,
      step: 0.01,
      onChange(v) {
        uniforms.uSpeed.value = v;
      },
    },
    uCurlScale: {
      value: uniforms.uCurlScale.value,
      min: 0.01,
      max: .2,
      step: 0.01,
      onChange(v) {
        uniforms.uCurlScale.value = v;
      },
    },
    uCurlOffset: {
      value: uniforms.uCurlOffset.value,
      min: 0.001,
      max: 10,
      step: 0.001,
      onChange(v) {
        uniforms.uCurlOffset.value = v;
      },
    },
    uLifeSpeed: {
      value: uniforms.uLifeSpeed.value,
      min: 0.01,
      max: 1,
      step: 0.01,
      onChange(v) {
        uniforms.uLifeSpeed.value = v;
      },
    },
    uColScale: {
      value: [...uniforms.uColScale.value.toArray()],
      onChange(v){
        uniforms.uColScale.value.set(v[0],v[1],v[2])
      }
    }
  });

  const { freqStorageBufferAttr, freqStorage } = useMemo(() => {
    const freqStorageBufferAttr = new THREE.StorageBufferAttribute(fftSize / 2, 1);
    const freqStorage = storage(freqStorageBufferAttr, "float", fftSize / 2);
    return { freqStorageBufferAttr, freqStorage };
  }, [fftSize]);

  // const { freqLerp } = useControls({
  //   freqLerp: { value: 0.5, min: 0, max: 1, step: 0.001 },
  // });

  function updateFreqData() {
    const data = analyser.getFrequencyData();
    const freqData = freqStorageBufferAttr.array;
    for (let i = 0; i < data.length; i++) {
      freqData[i] = lerp(freqData[i], data[i] / 255, freqLerp);
    }
    const freqAvg = analyser.getAverageFrequency();
    uniforms.uAvgFreq.value = lerp(uniforms.uAvgFreq.value, freqAvg / 255, freqLerp);
    freqStorageBufferAttr.needsUpdate = true;
  }

  // useFrame(() => {
  //   updateFreqData();
  // });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     updateFreqData()
  //   }, 10)
  //   return () => {
  //     clearInterval(interval)
  //   }
  // })

  const particleMap = useTexture(asset("/img/texture/particle/star_09.png"));

  const { particleCount, positionNode, colorNode, updatePos } = useMemo(() => {
    const particleCount = 80000;
    const posArr = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      const i3 = i * 3;
      posArr[i3 + 0] = x;
      posArr[i3 + 1] = y;
      posArr[i3 + 2] = z;
    }

    // const sphereGeo = new THREE.IcosahedronGeometry(4, 32)
    // const posAttr = sphereGeo.getAttribute('position')
    // const particleCount = posAttr.count
    // const posArr = posAttr.array as Float32Array
    // sphereGeo.dispose()

    const lifeArr = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      lifeArr[i] = Math.random();
    }

    const posBuffer = instancedArray(posArr, "vec3");
    const posOrgBuffer = instancedArray(posArr, "vec3");
    const spherePosBuffer = instancedArray(particleCount, 'vec3')
    const lifeBuffer = instancedArray(lifeArr, "float");
    const accBuffer = instancedArray(particleCount, "vec3");

    const updatePos = Fn(() => {
      const idx = instanceIndex;
      const pos = posBuffer.element(idx).toVar();
      const posOrg = posOrgBuffer.element(idx).toVar();
      const life = lifeBuffer.element(idx).toVar();

      const noiseInput = pos.mul(uniforms.uCurlScale).add(vec3(0,uniforms.uCurlOffset,0));
      const strength = smoothstep(1, -1, simplexNoise3d(posOrg));
      const acc = curlNoise3d(noiseInput).mul(strength);

      pos.addAssign(acc.mul(deltaTime).mul(uniforms.uSpeed));
      life.addAssign(deltaTime.mul(uniforms.uLifeSpeed));

      If(life.greaterThan(1), () => {
        life.assign(fract(life));
        pos.assign(posOrg);
      });

      const r = length(pos)
      const theta = acos(pos.y.div(r))
      const phi = atan(pos.z, pos.x)

      lifeBuffer.element(idx).assign(life);
      posBuffer.element(idx).assign(pos);
      spherePosBuffer.element(idx).assign(vec3(r,theta,phi))
      accBuffer.element(idx).assign(acc);
    })().compute(particleCount);

    const positionNode = Fn(() => {
      return posBuffer.element(instanceIndex);
    })();
    const colorNode = Fn(() => {
      const d = texture(particleMap, uv()).r;
      // let d = length(uv().sub(0.5));
      // d = pow(float(0.1).div(d), 2);
      // const col = vec3(1,0,0)

      const spherePos = spherePosBuffer.element(instanceIndex).toVar()
      const life = lifeBuffer.element(instanceIndex).toVar();
      const fade = smoothstep(0, 0.2, life).mul(smoothstep(1, 0.7, life));
      const col = sin3(vec3(3, 2, 1).add(spherePos.mul(uniforms.uColScale)))
        .mul(0.5)
        .add(0.5);
      return vec4(col.mul(d), d.mul(fade));
    })();
    return { particleCount, positionNode, colorNode, updatePos };
  }, [fftSize]);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(updatePos);
  });

  return (
    <>
      <instancedMesh args={[undefined, undefined, particleCount]}>
        <planeGeometry args={[0.3, 0.3]} />
        <spriteNodeMaterial positionNode={positionNode} colorNode={colorNode} transparent={true} depthWrite={false} blendAlpha={THREE.AdditiveBlending} />
      </instancedMesh>
    </>
  );
}

function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();

  const {strength, radius, threshold} = useControls({
    strength: {
      value: 1.,
      min: .01,
      max: 3,
      step: .01
    },
    radius: {
      value: .1,
      min: .01,
      max: 2,
      step: .01
    },
    threshold: {
      value: .1,
      min: .01,
      max: 2,
      step: .01
    }
  })

  const renderPipeline = useMemo(() => {
    const renderer = gl as unknown as THREE.WebGPURenderer;
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    // const bloomPass = bloom(scenePassColor, 1.1, 0.5, .1);
    const bloomPass = bloom(scenePassColor, strength, radius, threshold);
    renderPipeline.outputNode = scenePassColor.add(bloomPass);

    return renderPipeline;
  }, [gl, scene, camera, strength, radius, threshold]);

  // 接管渲染，优先级设为 1 覆盖默认渲染
  useFrame(() => {
    renderPipeline.render();
  }, 1);

  return null;
}

export default function App() {
  return (
    <WebGPUCanvas>
      {/* <ambientLight intensity={1}/> */}
      {/* <directionalLight position={[0, 0, 20]} intensity={1.1} /> */}
      {/* <axesHelper args={[20]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <WebGPUEffects />
      </Suspense>
    </WebGPUCanvas>
  );
}
