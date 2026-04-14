import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef } from "react";
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
  vec3,
  vec4,
  pass,
  acos,
  sin,
  reflect,
  reflector,
  rotate,
  metalness,
  roughness,
  sheenRoughness,
  attenuationDistance,
  sample,
  colorToDirection,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, palette, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { simplexNoise4d } from "~/utils/tsl/simplexNoise4d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { usePane } from "~/hook/usePane";
import { Pane } from "tweakpane";
import { ao } from "three/examples/jsm/tsl/display/GTAONode.js";

function Matrix(props) {
  const { count, positionNode, colorNode, normalNode, uf } = useMemo(() => {
    const uf = {
      range: uniform(5),
      noiseScale: uniform(0.2),
      noiseSpeed: uniform(2.),
      
      metalness: uniform(0),
      roughness: uniform(1),
      transmission: uniform(1),
      thickness: uniform(2.5),
      ior: uniform(1.5),
      attenuationDistance: uniform(0.15),

      colSeed: uniform(vec3(3,2,1)),
      colFreq: uniform(.1),
      colAmp: uniform(4)
    };

    const range = 10; // 要偶数
    const r = Math.floor(range / 2);
    const count = Math.pow(r * 2 + 1, 3);
    const positionArr = new Float32Array(count * 3);
    let i = 0;
    for (let x = -r; x <= r; x += 1) {
      for (let y = -r; y <= r; y += 1) {
        for (let z = -r; z <= r; z += 1) {
          const i3 = i * 3;
          positionArr[i3 + 0] = x;
          positionArr[i3 + 1] = y;
          positionArr[i3 + 2] = z;
          i += 1;
        }
      }
    }

    const posBuffer = instancedArray(positionArr, "vec3");

    const vSize = varying(float(1));

    const positionNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar();
      // const noiseInput = rotate(pos, vec3(0,time.mul(uf.noiseSpeed),0)).mul(pos.mul(uf.noiseScale))
      const noiseInput = (pos).mul(uf.noiseScale).add(vec3(0,time.mul(uf.noiseSpeed),0));
      const n = simplexNoise3d(noiseInput);
      const maxSize = 0.9;
      const size = min(maxSize, smoothstep(-0.5, 1, n));

      // box sdf控制缩放范围
      const p = abs(pos).sub(uf.range);
      const sdf = max(max(p.x, p.y), p.z);
      const range = step(0, sdf);

      const scale = select(range.greaterThan(0.5), size, maxSize);
      vSize.assign(scale);

      return positionLocal.mul(scale).add(pos);
    })();

    const colorNode = Fn(() => {
      const pos = (posBuffer.element(instanceIndex).toVar());
      const col = cos3(uf.colSeed.add(dot(sin3(pos.mul(uf.colFreq)), vec3(uf.colAmp))).sub(time.mul(uf.noiseSpeed)))
        .mul(0.5)
        .add(0.5);
      return vec4(col.mul(2), 1);
    })();

    const normalNode = Fn(() => {
      const microNoise = mx_noise_float(uv().mul(200).add(positionLocal.mul(11.34))).mul(0.5);
      return normalLocal.add(microNoise);
    })();

    return { count, positionNode, colorNode, uf, normalNode };
  }, []);

  const { nodes } = useGLTF(asset('/model/cube.glb'))

  const { pane } = usePane();
  useEffect(() => {
    pane.addBinding(uf.range, "value", { label: "range", min: 0, max: 6, step: 1 });
    pane.addBinding(uf.noiseScale, "value", { label: "noiseScale", min: 0, max: .5 });
    pane.addBinding(uf.noiseSpeed, "value", { label: "noiseSpeed", min: 0, max: 3 });
    pane.addBinding(uf.colSeed, "value", { label: "colSeed", min: 0, max: 10 });
    pane.addBinding(uf.colFreq, "value", { label: "colFreq", min: 0, max: 2 });
    pane.addBinding(uf.colAmp, "value", { label: "colAmp", min: 0, max: 10 });

    const matFoloder = pane.addFolder({ title: "material", expanded: false });
    matFoloder.addBinding(uf.metalness, "value", { label: "metalness", min: 0, max: 1 });
    matFoloder.addBinding(uf.roughness, "value", { label: "roughness", min: 0, max: 1 });
    // matFoloder.addBinding(uf.transmission, "value", { label: "transmission", min: 0, max: 1 });
    // matFoloder.addBinding(uf.thickness, "value", { label: "thickness", min: 0, max: 6 });
    // matFoloder.addBinding(uf.ior, "value", { label: "ior", min: 0, max: 3 });
    // matFoloder.addBinding(uf.attenuationDistance, "value", {
    //   label: "attenuationDistance",
    //   min: 0,
    //   max: 1,
    // });
  }, []);

  const instancedRef = useRef<THREE.InstancedMesh>(null);
  useFrame(({ clock }, delta) => {
    if (!instancedRef.current) return;
    const t = clock.getElapsedTime();
    instancedRef.current.rotation.x += delta * 0.2;
    instancedRef.current.rotation.z += delta * 0.2;
  });

  return (
    <instancedMesh {...props} ref={instancedRef} args={[nodes.cube.geometry, undefined, count]}>
      {/* <boxGeometry args={[1, 1]} /> */}
      <meshPhysicalNodeMaterial
        metalnessNode={uf.metalness}
        roughnessNode={uf.roughness}
        positionNode={positionNode}
        colorNode={colorNode}
        // opacityNode={uniform(1)}
        // attenuationColorNode={colorNode}
        // attenuationDistanceNode={uf.attenuationDistance}
        // transmissionNode={uf.transmission}
        // thicknessNode={uf.thickness}
        // iorNode={uf.ior}
      />
    </instancedMesh>
  );
}

function Plane(props) {
  const { scene } = useThree();

  const { emissiveNode } = useMemo(() => {
    const reflection = reflector({ resolutionScale: 1 });
    reflection.target.rotateX(-Math.PI / 2);

    const emissiveNode = Fn(() => {
      return reflection.mul(0.7);
    })();
    scene.add(reflection.target);

    return { emissiveNode };
  }, []);

  return (
    <mesh {...props} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardNodeMaterial  color={new THREE.Color(0x0abde3)} emissiveNode={emissiveNode} />
    </mesh>
  );
}

function Base() {
  return (
    <>
      <Matrix position={[0, 10, 0]} />
      <Plane />
    </>
  );
}

function Fog() {
  const { scene, camera } = useThree();
  const { pane } = usePane();

  useEffect(() => {
    const col = new THREE.Color(0x2890ab);
    scene.fog = new THREE.FogExp2(col, 0.02);
    scene.background = new THREE.Color(col);

    const f = pane.addFolder({ title: "fog" });

    f.addBinding(scene.fog, "density", { label: "density" });
    f.addBinding({ col: col.getHex() }, "col", { label: "col", view: 'color' }).on("change", ({ value }) => {
      const c = new THREE.Color(value);
      scene.fog && (scene.fog.color = c);
      scene.background = c;
    });
  }, []);

  return null;
}

function BBB(){
  return (
    <mesh position={[0, 10, 0]} scale={2}>
      <torusKnotGeometry />
      <meshStandardNodeMaterial color={0x00ff00}/>
    </mesh>
  )
}



function WebGPUEffects() {
  const { gl, scene, camera } = useThree();
  camera.position.set(0, 20, 20);
  camera.lookAt(new THREE.Vector3(0, 15, 0));
  // scene.backgroundBlurriness=.45

  const renderer = gl as unknown as THREE.WebGPURenderer;
  // renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const { pane } = usePane();
  useEffect(() => {
    pane.addBinding(renderer, "toneMappingExposure", { label: "expose", min: 0, max: 1 });
  }, []);

  const { renderPipeline } = useMemo(() => {
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassCol = scenePass.getTextureNode()

    // const bloomPass = bloom(scenePass, .01,.01,.01)
    // renderPipeline.outputNode = bloomPass;
    renderPipeline.outputNode = scenePassCol

    return { renderPipeline };
  }, [renderer]);


  useFrame(() => {
    renderPipeline.render();
  }, 1);

  return null;
}

function Light() {
  const { pane } = usePane();
  const lightRef = useRef<THREE.Light>(null);
  useEffect(() => {
    lightRef.current && pane.addBinding(lightRef.current, "intensity", { min: 0, max: 20 });
  }, [lightRef]);
  return (
    <>
      <directionalLight ref={lightRef} position={[0, 20, 0]} intensity={1.1} />
    </>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      <Fog />
      {/* <axesHelper args={[20]} /> */}
      <ambientLight intensity={1} />
      <Light />
      <OrbitControls />
      <Suspense fallback={null}>
        {/* <Environment preset="apartment" background /> */}
        {/* <Environment files={envHdrPath} background /> */}
        {/* <Environment path={skybox} background /> */}

        <Base />
        {/* <BBB /> */}
        <WebGPUEffects />
      </Suspense>
    </WebGPUCanvas>
  );
}
