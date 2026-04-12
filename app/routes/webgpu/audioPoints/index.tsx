import { OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useMemo } from "react";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { abs, asin, atan, cross, deltaTime, dot, float, floor, Fn, fract, fwidth, hash, If, instancedArray, instanceIndex, length, mat3, max, min, mix, mx_noise_float, mx_noise_vec3, mx_noise_vec4, normalLocal, oneMinus, PI, positionLocal, pow, pow3, rotateUV, select, smoothstep, step, storage, texture, time, TWO_PI, uniform, uv, varying, vec2, vec3, vec4, pass, acos, sin } from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, palette, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";

function Base() {
  const { camera } = useThree();
  camera.position.set(0, 0, 60);

  const fftSize = 1024;
  // const audioUrl = asset("/sound/yanqi.mp3");
  // const audioUrl = asset("/sound/savageLove.aac");
  const audioUrl = asset("/sound/shaderToy_5.mp3");
  // const audioUrl = asset("/sound/hero.mp3");

  const { sound, analyser, subInfo, midInfo, highInfo, freqAvg } = useAudioAnalyser(fftSize, audioUrl);
  useControls({
    play: button(() => {
      sound.play();
    }),
    pause: button(() => {
      sound.pause();
    }),
  });
  interface Control {
    uBeatActive: THREE.UniformNode<"float", number> // 传递tsl使用
    smooth: THREE.UniformNode<"float", number> // 仅供平滑频率
    lerp: {value: number} // 平滑系数
    threshold: {value: number} // beat触发阈值
  }
  
  const {subControl, midControl, highControl} = useMemo<{
    subControl: Control
    midControl: Control
    highControl: Control
  }>(() => ({
    subControl: {
      uBeatActive: uniform(0.1),
      smooth: uniform(0),
      lerp: {value: .05},
      threshold: {value: 1}
    },
    midControl: {
      uBeatActive: uniform(0.1),
      smooth: uniform(0),
      lerp: {value: .05},
      threshold: {value: 1}
    },
    highControl: {
      uBeatActive: uniform(0.1),
      smooth: uniform(0),
      lerp: {value: .05},
      threshold: {value: 3}
    },
  }), [])

  useControls({
    subControl: folder({
      sublerp: {value: 0.08, min: .01, max: .2, step: .01, onChange(v) { subControl.lerp.value = v}},
      subthreshold: {value: 1., min: 1., max: 3.5, onChange(v){subControl.threshold.value = v}}
    }),
    midControl: folder({
      midlerp: {value: 0.04, min: .01, max: .2, step: .01, onChange(v) {midControl.lerp.value = v}},
      midthreshold: {value: 1., min: 1., max: 3.5,  onChange(v){midControl.threshold.value = v}}
    }),
    highControl: folder({
      highlerp: {value: 0.02, min: .01, max: .2, step: .01, onChange(v) {highControl.lerp.value = v}},
      highthreshold: {value: 3, min: 1., max: 3.5, onChange(v){highControl.threshold.value = v}}
    })
  })

  const updateBeat = (control: Control, info: BinInfo) => {
    const {freqAvg} = info
    const {smooth, lerp, threshold, uBeatActive} = control

    smooth.value += (freqAvg.value - smooth.value) * lerp.value
    if(freqAvg.value > smooth.value*threshold.value && smooth.value > 0){
      uBeatActive.value = 1
    }else{
      uBeatActive.value *= .9
      if(uBeatActive.value < 1e-4){
        uBeatActive.value = 0
      }
    }
  }

  const uniforms = useMemo(
    () => ({
      uSpeed: uniform(40.),
      uCurlScale: uniform(0.04),
      uCurlOffset: uniform(0),
      uLifeSpeed: uniform(1.),
      uColScale: uniform(new THREE.Vector3(0.5, 1.5, .6)),
      uColOffset: uniform(new THREE.Vector3(0.5, 1., .5)),
    }),
    [],
  );


  useFrame(() => {
    updateBeat(subControl, subInfo)
    updateBeat(midControl, midInfo)
    updateBeat(highControl, highInfo)

    if(highControl.uBeatActive.value > .99){
      highControl.smooth.value = -2
      uniforms.uCurlOffset.value = Math.random() * 10
    }
    if(midControl.uBeatActive.value > .99){
      midControl.smooth.value = -2
      uniforms.uColOffset.value.x = Math.random() * 10
      uniforms.uColOffset.value.y = Math.random() * 10
      uniforms.uColOffset.value.z = Math.random() * 10
    }
  })

  
  useControls({
    uSpeed: {
      value: uniforms.uSpeed.value,
      min: 0.1,
      max: 200,
      step: 0.1,
      onChange(v) {
        uniforms.uSpeed.value = v;
      },
    },
    uCurlScale: {
      value: uniforms.uCurlScale.value,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      onChange(v) {
        uniforms.uCurlScale.value = v;
      },
    },
    uLifeSpeed: {
      value: uniforms.uLifeSpeed.value,
      min: 0.1,
      max: 10,
      step: 0.1,
      onChange(v) {
        uniforms.uLifeSpeed.value = v;
      },
    },
    uColScale: {
      value: [...uniforms.uColScale.value.toArray()],
      onChange(v) {
        uniforms.uColScale.value.set(v[0], v[1], v[2]);
      },
    },
  });

  const particleMap = useTexture(asset("/img/texture/particle/star_09.png"));

  const { particleCount, positionNode, colorNode, updatePos } = useMemo(() => {
    // const particleCount = 10000;
    // const posArr = new Float32Array(particleCount);
    // for (let i = 0; i < particleCount; i++) {
    //   const x = (Math.random() - 0.5) * 10;
    //   const y = (Math.random() - 0.5) * 10;
    //   const z = (Math.random() - 0.5) * 10;
    //   const i3 = i * 3;
    //   posArr[i3 + 0] = x;
    //   posArr[i3 + 1] = y;
    //   posArr[i3 + 2] = z;
    // }

    const sphereGeo = new THREE.IcosahedronGeometry(4, 32)
    const posAttr = sphereGeo.getAttribute('position')
    const particleCount = posAttr.count
    const posArr = posAttr.array as Float32Array
    sphereGeo.dispose()

    const lifeArr = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      lifeArr[i] = Math.random();
    }

    const posBuffer = instancedArray(posArr, "vec3");
    const posOrgBuffer = instancedArray(posArr, "vec3");
    const spherePosBuffer = instancedArray(particleCount, "vec3");
    const lifeBuffer = instancedArray(lifeArr, "float");
    const accBuffer = instancedArray(particleCount, "vec3");


    const updatePos = Fn(() => {
      const idx = instanceIndex;
      const pos = posBuffer.element(idx).toVar();
      const posOrg = posOrgBuffer.element(idx).toVar();
      const life = lifeBuffer.element(idx).toVar();

      const noiseInput = pos.mul(uniforms.uCurlScale).add(uniforms.uCurlOffset)
      const range = smoothstep(1., -1, simplexNoise3d(posOrg));
      const beatMultiplier = subControl.uBeatActive.mul(2.).add(.1);
      const acc = curlNoise3d(noiseInput).mul(range).mul(beatMultiplier);
      acc.assign(mix(accBuffer.element(idx), acc, .5))

      pos.addAssign(deltaTime.mul(acc).mul(uniforms.uSpeed));
      life.addAssign(deltaTime.mul(uniforms.uLifeSpeed).mul(.1));

      If(life.greaterThan(1), () => {
        life.assign(fract(life));
        pos.assign(posOrg);
      });

      const r = length(pos);
      const theta = acos(pos.y.div(r)).clamp(-1,1);
      const phi = atan(pos.z, pos.x);

      lifeBuffer.element(idx).assign(life);
      posBuffer.element(idx).assign(pos);
      spherePosBuffer.element(idx).assign(vec3(r, theta, phi));
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

      const spherePos = spherePosBuffer.element(instanceIndex).toVar();
      const life = lifeBuffer.element(instanceIndex).toVar();
      const fade = smoothstep(0, 0.2, life).mul(smoothstep(1, 0.7, life));
      const col = sin3(vec3(3, .2, .1).add(spherePos.mul(uniforms.uColScale).add(uniforms.uColOffset))).mul(.5).add(.5).mul(1.)
      
      // const col = palette(dot(acc, vec3(.1)).mul(.3), vec3(0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),	vec3(1.0, 1.0, 1.0),	vec3(0.00, 0.10, 0.20))
      // const col = palette(sin(spherePos.x.mul(.2)).div(.2), vec3(0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),	vec3(1.0, 1.0, 1.0),	vec3(0.00, 0.33, 0.67))

      return vec4(col.mul(d), d.mul(fade));
    })();
    return {
      particleCount,
      positionNode,
      colorNode,
      updatePos,
    };
  }, [fftSize]);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(updatePos);
  });

  return (
    <>
      <instancedMesh args={[undefined, undefined, particleCount]}>
        <planeGeometry args={[.8,.8]} />
        <spriteNodeMaterial positionNode={positionNode} colorNode={colorNode} transparent={true} depthWrite={false} blendAlpha={THREE.AdditiveBlending} />
      </instancedMesh>
    </>
  );
}

function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();
  // gl.toneMapping = THREE.AgXToneMapping

  const { strength, radius, threshold } = useControls({
    strength: {
      value: 1,
      min: 0.01,
      max: 3,
      step: 0.01,
    },
    radius: {
      value: 0.1,
      min: 0.01,
      max: 2,
      step: 0.01,
    },
    threshold: {
      value: 0.1,
      min: 0.01,
      max: 2,
      step: 0.01,
    },
  });

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
