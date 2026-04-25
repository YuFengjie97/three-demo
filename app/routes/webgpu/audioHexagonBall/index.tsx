import { Environment, Html, OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useContext, useEffect, useMemo, useRef } from "react";
import {abs,asin,atan,cross,deltaTime,dot,float,floor,Fn,fract,fwidth,hash,If,instancedArray,instanceIndex,length,mat3,max,min,mix,mx_noise_float,mx_noise_vec3,mx_noise_vec4,normalLocal,oneMinus,PI,positionLocal,pow,pow3,rotateUV,select,smoothstep,step,storage,texture,time,TWO_PI,uniform,uv,varying,vec2,vec3,vec4,pass,acos,sin,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import Ball from "./Ball";
import Bar from "./Bar";
import Face from "./Face";
import BaseContext from "./context";
import { Pane } from "tweakpane";
import { AudioAnalyser } from "~/utils/AudioAnalyser";

function Base() {
  const { camera, scene } = useThree();
  camera.position.set(0, 0, 20);

  const pane = new Pane();

  // const audioUrl = asset("/sound/shaderToy_5.mp3");
  const audioUrl = asset("/sound/manbo.mp3");
  // const audioUrl = asset("/sound/savageLove.aac");
  const aa = new AudioAnalyser(512, audioUrl);
  scene.add(aa.listener);

  const colSeed = uniform(vec3(3,2,1))

  useEffect(() => {
    pane.addButton({ title: "play" }).on("click", () => {
      aa.sound.play();
    });
    pane.addButton({ title: "pause" }).on("click", () => {
      aa.sound.pause();
    });
    pane.addBinding(colSeed, 'value', {label: 'colSeed', min: -10, max: 10})

    // const f1 = pane.addFolder({ title: "subBeatControl" });
    // f1.addBinding(aa.subBeatControl.beatAtten, "value", { label: "attenuation", min: 0, max: 1 });
    // f1.addBinding(aa.subBeatControl.lerp, "value", { label: "lerp", min: 0, max: 0.1 });
    // f1.addBinding(aa.subBeatControl.threshold, "value", { label: "threshold", min: 0, max: 3 });
    // f1.addBinding(aa.subBeatControl.attack, "value", { label: "attack", min: .8, max: 1 });
    // f1.addBinding(aa.subBeatControl.release, "value", { label: "release", min: 0, max: .1 });


    // const f2 = pane.addFolder({ title: "midBeatControl" });
    // f2.addBinding(aa.midBeatControl.beatAtten, "value", { label: "attenuation", min: 0, max: 1 });
    // f2.addBinding(aa.midBeatControl.lerp, "value", { label: "lerp", min: 0, max: 0.1 });
    // f2.addBinding(aa.midBeatControl.threshold, "value", { label: "threshold", min: 0, max: 3 });
    // f2.addBinding(aa.midBeatControl.attack, "value", { label: "attack", min: .8, max: 1 });
    // f2.addBinding(aa.midBeatControl.release, "value", { label: "release", min: 0, max: .1 });
    
    // const f3 = pane.addFolder({ title: "highBeatControl" });
    // f3.addBinding(aa.highBeatControl.beatAtten, "value", { label: "attenuation", min: 0, max: 1 });
    // f3.addBinding(aa.highBeatControl.lerp, "value", { label: "lerp", min: 0, max: 0.1 });
    // f3.addBinding(aa.highBeatControl.threshold, "value", { label: "threshold", min: 0, max: 3 });
    // f3.addBinding(aa.highBeatControl.attack, "value", { label: "attack", min: .8, max: 1 });
    // f3.addBinding(aa.highBeatControl.release, "value", { label: "release", min: 0, max: .1 });
  }, []);

  useFrame(() => {
    aa.update();
  });

  return (
    <>
      <BaseContext value={{ pane, aa, colSeed }}>
        <Ball />
        <Bar />
        <Face />
        <WebGPUEffects />
        <MusicUpload />
      </BaseContext>
    </>
  );
}

function WebGPUEffects() {
  const {pane} = useContext(BaseContext);
  
  const { gl, scene, camera, size } = useThree();
  // gl.toneMapping = THREE.NoToneMapping
  // gl.toneMapping = THREE.AgXToneMapping
  const renderer = gl as unknown as THREE.WebGPURenderer;

  let renderPipeline: THREE.RenderPipeline;
  useEffect(() => {
    renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, 0.5, 0.5, .3);
    renderPipeline.outputNode = scenePassColor.add(bloomPass);

    const f = pane!.addFolder({title: 'bloom'})
    f!.addBinding(bloomPass.strength, 'value', {label: 'strength', min: 0, max:1})
    f!.addBinding(bloomPass.radius, 'value', {label: 'radius', min: 0, max:1})
    f!.addBinding(bloomPass.threshold, 'value', {label: 'threshold', min: 0, max:1})
  }, []);

  // 接管渲染，优先级设为 1 覆盖默认渲染
  useFrame(() => {
    renderPipeline && renderPipeline.render();
  }, 1);

  return null;
}

function MusicUpload(){
  const {pane, aa} = useContext(BaseContext)
  const inputRef = useRef<HTMLInputElement>(null)
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
      if (file) {
        aa?.uploadSound(file)
      }
  }
  useEffect(() => {
    pane!.addButton({ title: "upload your song" }).on("click", () => {
      if(!inputRef.current) return
      inputRef.current.click();
    });
  })

  return (
    <Html>
      <input 
        ref={inputRef}
        type="file" 
        accept="audio/mp3,audio/wav" 
        onChange={handleFileUpload} 
        style={{display: 'none'}}
      />
    </Html>
  )
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={0.5} />

      {/* <pointLight position={[0,7,0]} intensity={4}/>
      // <pointLight position={[0,0,0]} intensity={4}/> */}
      {/* <directionalLight position={[0, 0, 10]} intensity={4.1} /> */}
      {/* <directionalLight position={[0, 0, -10]} intensity={4.1} /> */}
      {/* <axesHelper args={[20]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />

        {/* <Environment background blur={0.4} path={asset("/img/skybox/sky_98_cubemap_2k")} /> */}
      </Suspense>
    </WebGPUCanvas>
  );
}
