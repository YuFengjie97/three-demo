import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo } from "react";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  abs,
  asin,
  atan,
  cross,
  deltaTime,
  dot,
  float,
  floor,
  Fn,
  fract,
  fwidth,
  hash,
  If,
  instancedArray,
  instanceIndex,
  length,
  mat3,
  max,
  min,
  mix,
  mx_noise_float,
  mx_noise_vec3,
  mx_noise_vec4,
  normalLocal,
  oneMinus,
  PI,
  positionLocal,
  pow,
  pow3,
  rotateUV,
  select,
  smoothstep,
  step,
  storage,
  texture,
  time,
  TWO_PI,
  uniform,
  uv,
  varying,
  vec2,
  cos,
  vec3,
  vec4,
  pass,
  acos,
  sin,
  sqrt,
  hue,
  attribute,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, palette, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { Pane } from "tweakpane";

function Base(){
  const {camera, scene} = useThree()
  scene.background = new THREE.Color(0xbadc58)
  camera.position.set(0,0,6)

  const { nodes } = useGLTF(asset('/model/cubeXcube-transformed.glb'))
  // @ts-ignore
  const geo = nodes.base.geometry as THREE.BufferGeometry
  console.log(geo);

  const mat = useMemo(() => {
    const _type = attribute<'float'>('_type', 'float')
    const _pos = attribute<'vec3'>('_pos', 'vec3')
    
    const uf = {
      noiseSpeed: uniform(float(.4)),
      colorSeed: uniform(vec3(3,2,1)),
      roughness: uniform(float(.1)),
      metalness: uniform(float(.6)),
      clearcoat: uniform(float(.6)),
      clearcoatRoughness: uniform(float(.3)),
    }

    const vCol = varying(vec3(0))
    const positionNode = Fn(() => {
      const n = mx_noise_float(_pos.mul(4.).add(time.mul(uf.noiseSpeed)))
      const show = step(0, n)
      // const show = smoothstep(0, 1., mx_noise_float(_pos.mul(4.).add(time.mul(uf.noiseSpeed))))

      vCol.assign(sin3(uf.colorSeed.add(_type).add(dot(_pos, vec3(3)))).mul(.5).add(.5))
      // vCol.assign(sin3(vec3(3,2,1).add(n.mul(10))).mul(.5).add(.5))

      return positionLocal.mul(show)
      // return positionLocal.sub(_pos).mul(show).add(_pos)
    })()

    const colorNode = Fn(() => {
      return vec4(vCol, .5)
    })()

    return {colorNode, positionNode, uf}
  }, [])

  useEffect(() => {
    const pane = new Pane()
    pane.addBinding(mat.uf.noiseSpeed, "value", { label: "noiseSpeed", min: 0., max: 5 });
    pane.addBinding(mat.uf.colorSeed, "value", { label: "colorSeed", min: -10., max: 10 });
    pane.addBinding(mat.uf.roughness, "value", { label: "roughness", min: 0., max: 1 });
    pane.addBinding(mat.uf.metalness, "value", { label: "metalness", min: 0., max: 1 });
    pane.addBinding(mat.uf.clearcoat, "value", { label: "clearcoat", min: 0., max: 1 });
    pane.addBinding(mat.uf.clearcoatRoughness, "value", { label: "clearcoatRoughness", min: 0., max: 1 });

  },[])
  
  return(
    <mesh geometry={geo}>
      <meshPhysicalNodeMaterial
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        roughnessNode={mat.uf.roughness}
        metalnessNode={mat.uf.metalness}
        clearcoatNode={mat.uf.clearcoat}
        clearcoatRoughnessNode={mat.uf.clearcoatRoughness}
        // transparent={true}
        // depthWrite={false}
        // side={THREE.DoubleSide}
        // blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}


function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();
  // gl.toneMapping = THREE.AgXToneMapping

  const renderPipeline = useMemo(() => {
    const renderer = gl as unknown as THREE.WebGPURenderer;
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, .1, 0.1, .1);
    renderPipeline.outputNode = scenePassColor.add(bloomPass);

    return renderPipeline;
  }, [gl, scene, camera]);

  // 接管渲染，优先级设为 1 覆盖默认渲染
  useFrame(() => {
    renderPipeline.render();
  }, 1);

  return null;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1}/>
      {/* <pointLight intensity={4}/> */}
      <directionalLight position={[0, 0, 10]} intensity={3.1} />
      <directionalLight position={[0, 0, -10]} intensity={3.1} />
      {/* <axesHelper args={[10]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        {/* <WebGPUEffects /> */}
      </Suspense>
    </WebGPUCanvas>
  );
}
