import { OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three/webgpu";
import { Fn, sin, dot, smoothstep, length, time, vec3, vec4, instanceIndex, instancedArray, uniform, mx_noise_vec3, positionGeometry, cameraProjectionMatrix, modelViewMatrix, float, positionLocal, texture, mix, varying, vec2, oneMinus, uv, hash, deltaTime, If, fract, rotate, rotateUV, billboarding, distance, max, select, color, exp, pass } from "three/tsl";
import { useControls } from "leva";
import { asset } from "~/utils/asset";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { LineGeometry } from "three/examples/jsm/Addons.js";
import { sin3 } from "~/utils/tsl";
import { getFibonacciSphere } from "~/utils/math";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";

function getLineGeo(dir: THREE.Vector3) {
  const theta = Math.acos(dir.y);
  const phi = Math.atan2(dir.z, dir.x);

  const lineGeo = new THREE.BufferGeometry();
  const controlPoints: THREE.Vector3[] = [];
  const controlNum = 10;
  for (let i = 0; i < controlNum; i++) {
    const x = i;
    const y = i == 0 ? 0 : Math.random() * 0.4;
    const z = i == 0 ? 0 : Math.random() * 0.4;
    controlPoints.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(controlPoints);
  const curvePointNum = 140;
  const points: THREE.Vector3[] = [];
  // 【修改这里】：每次推入两个相邻的顶点形成一段独立的线
  // 注意：这里用 curvePointNum - 1 作为分母，确保能取到 1.0 的终点
  /**
   * 这里不是A-B-C-D
   * 而是A-B-B-C-C-D
   * 因为最后merge了所有的lineGeo（为什么这么做？因为分别绘制400条线段非常耗drawCall（可能吧））
   * 合并为一个bufferGeo能提高最开始的初始化速度
   * 然后使用linesegment而不是line分割掉B-B C-C
   * 看上去像是A-B-C-D 其实是A-B..B-C..C-D
   */
  const segments = curvePointNum - 1;
  for (let i = 0; i < segments; i++) {
    const p1 = curve.getPointAt(i / segments);
    const p2 = curve.getPointAt((i + 1) / segments);
    points.push(p1, p2);
  }

  lineGeo.setFromPoints(points);
  lineGeo.rotateZ(theta);
  lineGeo.rotateX(phi);

  return lineGeo;
}

function Base() {
  // const sampleCount = 400;

  const uniforms = useMemo(() => {
    return {
      uSwingAmp: uniform(.3),
      uColScale: uniform(1),
      uNoiseScale: uniform(1)
    };
  }, []);
  const {sampleCount} = useControls({
    sampleCount: {
      value: 400,
      min: 10,
      max: 1000,
      step: 1
    },
    uSwingAmp: {
      value: uniforms.uSwingAmp.value,
      min: 0,
      max: 5,
      step: 0.01,
      onChange(v) {
        uniforms.uSwingAmp.value = v;
      },
    },
    uColScale: {
      value: uniforms.uColScale.value,
      min: 0.01,
      max: 5,
      step: 0.01,
      onChange(v) {
        uniforms.uColScale.value = v;
      },
    },
    uNoiseScale: {
      value: uniforms.uNoiseScale.value,
      min: 0.01,
      max: 5,
      step: 0.01,
      onChange(v) {
        uniforms.uNoiseScale.value = v;
      },
    },
  });

  const { dirs } = useMemo(() => {
    const arr = getFibonacciSphere(sampleCount);
    const count = arr.length / 3;
    const dirs: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = arr[i3 + 0];
      const y = arr[i3 + 1];
      const z = arr[i3 + 2];
      dirs.push(new THREE.Vector3(x, y, z).normalize());
    }
    return { dirs };
  }, [sampleCount]);

  const { line, lineGeo, lineMat } = useMemo(() => {
    // -------------geo--------------
    const geos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < dirs.length; i++) {
      const geo = getLineGeo(dirs[i]);
      geos.push(geo);
    }
    const lineGeo = mergeGeometries(geos);

    // -------------mat-------------
    const getPosition = Fn(() => {
      const pos = positionLocal.toVar();
      const dist = length(pos);
      const strength = exp(dist.mul(-1)).mul(-1).add(1);
      const offset = mx_noise_vec3(pos.mul(uniforms.uNoiseScale).add(vec3(0, time, 0)))
        .mul(strength)
        .mul(uniforms.uSwingAmp);
      pos.addAssign(offset);
      return pos;
    });

    const getColor = Fn(() => {
      const dist = length(positionLocal);
      const colOffset = dist
      const col = sin3(vec3(3, 2, 1).add(colOffset.mul(uniforms.uColScale)).add(time.mul(-1)))
        .mul(0.5)
        .add(0.5);

      return vec4(col, .2);
    });

    const lineMat = new THREE.LineBasicNodeMaterial();
    lineMat.colorNode = getColor();
    lineMat.positionNode = getPosition();
    lineMat.transparent = true
    lineMat.depthWrite = false
    lineMat.blending = THREE.AdditiveBlending

    // const line = new THREE.Line(lineGeo, lineMat);
    const line = new THREE.LineSegments(lineGeo, lineMat);

    return { line, lineGeo, lineMat };
  }, [dirs]);

  useEffect(() => {
    return () => {
      lineGeo.dispose();
      lineMat.dispose();
    };
  }, []);


  return <primitive object={line} />;
}


function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();

  const renderPipeline = useMemo(() => {
    const renderer = gl as unknown as THREE.WebGPURenderer;
    const renderPipeline = new THREE.RenderPipeline(renderer)
    const scenePass = pass(scene, camera)
    const scenePassColor = scenePass.getTextureNode('output')
    const bloomPass = bloom(scenePassColor, .75, 0.1, .5)
    renderPipeline.outputNode = scenePassColor.add(bloomPass)

    return renderPipeline
  }, [gl, scene, camera]);

  // 接管渲染，优先级设为 1 覆盖默认渲染
  useFrame(() => {
    renderPipeline.render()
  }, 1);

  return null;
}


export default function App() {
  return (
    <WebGPUCanvas>
      {/* <ambientLight /> */}
      {/* <directionalLight position={[5, 10, 0]} intensity={2} /> */}
      {/* <axesHelper args={[10]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <WebGPUEffects />
      </Suspense>
    </WebGPUCanvas>
  );
}
