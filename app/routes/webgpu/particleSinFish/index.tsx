import { OrbitControls, useTexture } from "@react-three/drei";
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

function Base() {
  const {camera,scene} = useThree()
  camera.position.set(0,50,100)
  // scene.background = new THREE.Color(0x223322)

  const map = useTexture(asset('/img/texture/particle/circle_05.png'))

  const count = 20000;
  const mat = useMemo(() => {
    const posBuffer = instancedArray(count, "vec3");

    const uf = {
      fishNum: uniform(3),
      speed: uniform(1),
      col1: uniform(new THREE.Color(0xdbbc5b)),
      col2: uniform(new THREE.Color(0x5df54e)),
      col3: uniform(new THREE.Color(0x6cc3f5)),
      col4: uniform(new THREE.Color(0xe66ef2)),
    }

    /**
     * 粒子鱼位置计算逻辑 (TSL 移植版)
     * @param {Node} i - 粒子索引 (通常传入 instanceIndex)
     * @param {Node} t - 全局时间 (Uniform 或 Timer)
     * @returns {Node<vec3>} - 3D 空间坐标
     */
    const getPos = Fn(([i, t]: [THREE.Node<'float'>, THREE.Node<'float'>]) => {
      // 1. 结构区分：将一维索引映射到空间切面参数 y (0 ~ 40)
      // 原代码 y = i / 500
      const y = i.div(500.0);

      // 2. 基础形态振幅 k
      // k = cos(y*5) * (y < 11 ? 21 : 11)
      const kBase = cos(y.mul(5.0));
      const amplitude = y.lessThan(11.0).select(21.0, 11.0);
      const k = kBase.mul(amplitude);

      // 3. 相位处理 e 与 距离场 o
      const e = y.div(8.0).sub(13.0);
      // const o = mag(k, e).div(6.0);
      const o = sqrt(k.mul(k).add(e.mul(e))).div(6)

      // 4. 计算旋转角度 c (极角)
      // c = o/1.5 - e/5 - t/8 + (i%3)*8
      const angle = o.div(1.5).sub(e.div(5.0)).sub(t.div(8.0)).add(i.mod(uf.fishNum).mul(8.0));

      // 5. 计算动态半径 q (极径)
      // q = k*2 + 49 + cos(y)/k + k*cos(y/2)*(1 + sin(o*4 - e/2 - t))
      const innerRadius = k.mul(2.0).add(49.0).add(cos(y).div(k));
      const oscillation = cos(y.div(2.0)).mul(sin(o.mul(4.0).sub(e.div(2.0)).sub(t)).add(1.0));
      const q = innerRadius.add(k.mul(oscillation));

      // 6. 坐标投影转换 (2D 映射到 3D)
      const x = q.mul(sin(angle));
      const y_pos = q.mul(cos(angle)); // 这里是切面内的坐标 y

      // 原代码 Y 轴的视觉修正项转化为 Z 轴深度 (模拟 3D 体积)
      // const z = sin(angle.div(2.0)).mul(-79.0).add(y.mul(5.0));

      const bulge = sin(y.mul(PI.div(40)))
      const wave = sin(angle.mul(1.5).add(o.mul(2)))
      const z = bulge.mul(wave).mul(15)

      return vec3(x, z, y_pos);
    });

    const updatePos = Fn(() => {
      const i = float(instanceIndex)
      const t = time.mul(uf.speed)
      const pos = getPos(i, t)

      posBuffer.element(instanceIndex).assign(pos)
    })().compute(count);

    
    const vPos = varying(vec3(0))
    const vFishInd = varying(float(0))
    const positionNode = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar();
      
      vPos.assign(pos)
      vFishInd.assign(float(instanceIndex).mod(uf.fishNum))
      return pos;
    })();
    
    
    const colorNode = Fn(() => {
      // return vec3(1, 0, 0);
      // const col = sin3(vec3(3,2,1).add(vFishInd).add(vPos.mul(.02))).mul(.5).add(.5)
      const col = vec3(0)
      If(vFishInd.equal(1), () => {
        col.assign(uf.col1)
      })
      .ElseIf(vFishInd.equal(2), () => {
        col.assign(uf.col2)
      })
      .ElseIf(vFishInd.equal(3),() => {
        col.assign(uf.col3)
      })
      .Else(() => {
        col.assign(uf.col4)
      })
      col.assign(hue(col, dot(vPos, vec3(.2)).mul(.15)))
      const d = texture(map, uv()).r
      return vec4(col.mul(d), d)
    })();
    
    
    return { updatePos, positionNode, colorNode, uf };
  }, [count]);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(mat.updatePos);
  });

  const pane = new Pane();
  useEffect(() => {
    pane.addBinding(mat.uf.speed, "value", { label: "speed", min: 0, max: 20 });
    pane.addBinding(mat.uf.fishNum, "value", { label: "fishNum", min: 1, max: 4, step: 1 });
    pane.addBinding({col: new THREE.Color(mat.uf.col1.value).getHex()}, "col", { label: "col1", view:'color' }).on('change', ({value}) => {
      const c = new THREE.Color(value)
      const{r,g,b} = c
      mat.uf.col1.value.set(r,g,b)
    });
    pane.addBinding({col: new THREE.Color(mat.uf.col2.value).getHex()}, "col", { label: "col2", view:'color' }).on('change', ({value}) => {
      const c = new THREE.Color(value)
      const{r,g,b} = c
      mat.uf.col2.value.set(r,g,b)
    });
    pane.addBinding({col: new THREE.Color(mat.uf.col3.value).getHex()}, "col", { label: "col3", view:'color' }).on('change', ({value}) => {
      const c = new THREE.Color(value)
      const{r,g,b} = c
      mat.uf.col3.value.set(r,g,b)
    });
    pane.addBinding({col: new THREE.Color(mat.uf.col4.value).getHex()}, "col", { label: "col4", view:'color' }).on('change', ({value}) => {
      const c = new THREE.Color(value)
      const{r,g,b} = c
      mat.uf.col4.value.set(r,g,b)
    });
    return () => {
      pane.dispose();
    };
  }, []);

  return (
    <>
      <instancedMesh args={[undefined, undefined, count]}>
        <planeGeometry args={[1.5,1.5]} />
        <spriteNodeMaterial
          positionNode={mat.positionNode}
          colorNode={mat.colorNode}
          transparent={true}
          depthWrite={false}
          blendAlpha={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </>
  );
}

function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();
  // gl.toneMapping = THREE.AgXToneMapping


  const renderPipeline = useMemo(() => {
    const renderer = gl as unknown as THREE.WebGPURenderer;
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, 2.1, .5, .1);
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
