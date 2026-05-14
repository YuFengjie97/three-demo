import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  abs,
  int,
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
  hue,
  transformedNormalWorld,
  rotate,
  mx_rotate3d,
  attribute,
  color,
  roughness,
  metalness,
  uniformArray,
  ceil,
  distance,
  billboarding,
  vertexIndex,
  Loop,
  Discard,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, lookAt, lookAt2, palette, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { usePane } from "~/hook/usePane";
import { Pane } from "tweakpane";
import { useMouseRay } from "~/hook/useMouseRay";
import { LineGeometry, MeshSurfaceSampler } from "three/examples/jsm/Addons.js";
import mitt from "mitt";

const emitter = mitt();

const sampleCount = 15;

const samplePoint = Array.from({ length: sampleCount }).map((item) => new THREE.Vector3(0, 0, 0));

const globalUf = {
  dotCol: uniform(vec3(1, 0, 0)),
  headCol: uniform(vec3(0, 1, 0)),
  tailCol: uniform(vec3(1, 0, 0)),
  glowCol: uniform(vec3(0.6, 0, 1)),

  startPos: uniform(vec3(0, 0, 0)),
  endPosArr: uniformArray(samplePoint),
};

function Spider() {
  const tubularSegments = 50;
  const radialSegments = 8;


  // 把落点单独提出来,因为它确定线的终点和dot点云的位置
  const endPosBuffer = useMemo(() => {
    const endPosBuffer = storage(
      new THREE.BufferAttribute(new Float32Array(tubularSegments), 3),
      "vec3",
      tubularSegments,
    );
    return endPosBuffer
  }, [])


  const mat = useMemo(() => {
    // 构造管线,注意起点和终点需要都是000
    // 因为起点终点需要命中落脚点和鼠标射线命中点,我们是用顶点偏移确定位置,所以他们的初始值不能有值,否则不能精确命中位置
    const l = 0.5;
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0), // 起点为000,可以完整匹配线段起点
      new THREE.Vector3(l, l, 0),
      new THREE.Vector3(l * 2, 0, 0),
      new THREE.Vector3(l, -l, 0),
      new THREE.Vector3(0, 0, 0), // 终点为000,可以完美匹配线段终点
    ]);
    const geo = new THREE.TubeGeometry(path, tubularSegments - 1, 0.04, radialSegments - 1);
    

    const vSegIdx01 = varying(float(0));
    const vCol = varying(vec3(0));
    const positionNode = Fn(() => {
      const segIdx = vertexIndex.div(radialSegments);
      const segIdx01 = float(segIdx).div(float(tubularSegments));

      const endPos = endPosBuffer.element(instanceIndex).toVar();

      const pos = mix(globalUf.startPos, endPos, segIdx01);

      // 起点和终点部分随机噪音偏移
      const n = mx_noise_vec3(
        segIdx01
          .mul(0.4) // 噪音缩放
          .add(float(instanceIndex).mul(2.2)) // 每条线不一样的噪音偏移
          .add(time.mul(2.2)),
      )
        .mul(smoothstep(0, 0.5, segIdx01))
        .mul(smoothstep(1, 0.5, segIdx01)) // 趋近终点起点的噪音摆动平滑减少
        .mul(0.4); // 整体噪音幅度

      pos.addAssign(n);

      vSegIdx01.assign(segIdx01);


      // 颜色逻辑放到vs中,提高性能
      const headCol = smoothstep(0.2, 0.1, vSegIdx01).mul(globalUf.headCol);
      const col = mix(headCol, globalUf.tailCol, smoothstep(0.2, 0.9, vSegIdx01));
      const glow = pow(float(0.1).div(abs(sin(vSegIdx01.mul(PI).sub(time.mul(2))))), 2);
      col.assign(mix(col, globalUf.glowCol, glow));

      vCol.assign(col);

      return positionLocal.add(pos);
    })();

    const colorNode = Fn(() => {
      return vCol;
    })();


    // 落点更新动画
    const updateEndPos = Fn(() => {
      const endPos = endPosBuffer.element(instanceIndex).toVar();
      const tarEndPos = globalUf.endPosArr.element(instanceIndex) as unknown as THREE.Node<"vec3">;

      endPosBuffer.element(instanceIndex).assign(mix(endPos, tarEndPos, 0.5));
    })().compute(sampleCount);



    return { geo, positionNode, colorNode, updateEndPos };
  }, []);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(mat.updateEndPos);
  });


  const {dotPosNode, dotColNode} = useMemo(() => {

    const dotPosNode = Fn(() => {
      // return globalUf.endPosArr.element(instanceIndex)
      return endPosBuffer.element(instanceIndex)
    })()
    const dotColNode = Fn(() => {
      const d = length(uv().sub(0.5));
      const glow = pow(float(0.1).div(d), 2);

      return vec4(globalUf.dotCol.mul(glow), glow);
    })()

    return {dotPosNode, dotColNode} 
  }, [])

  return (
    <>
    <instancedMesh args={[mat.geo, undefined, sampleCount]}>
      {/* <meshBasicNodeMaterial /> */}
      <meshBasicNodeMaterial
        positionNode={mat.positionNode}
        side={THREE.DoubleSide}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        colorNode={mat.colorNode}
      />
    </instancedMesh>

    <instancedMesh args={[undefined, undefined, sampleCount]}>
      <planeGeometry />
      <spriteNodeMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        positionNode={dotPosNode}
        colorNode={dotColNode}
        scaleNode={float(1)}
      />
    </instancedMesh>
    </>
  );
}


// 射线检测表面
function Surface({ ...props }) {
  return (
    <mesh {...props}>
      <icosahedronGeometry args={[7, 1]} />
      <meshBasicNodeMaterial wireframe side={THREE.BackSide} />
    </mesh>
  );
}

// 取样表面
function SampleSurface({ ...props }) {
  return (
    <mesh {...props}>
      <icosahedronGeometry args={[8, 1]} />
      <meshBasicNodeMaterial wireframe side={THREE.BackSide} />
    </mesh>
  );
}


function Cube({...props}){
  const map = useTexture(asset('/img/texture/catSpider.png'))
  return (
    <mesh {...props}>
      <boxGeometry />
      <meshBasicNodeMaterial map={map}/>
    </mesh>
  )
}


function Base() {
  const { camera } = useThree();
  camera.position.set(0, 0, .4);

  // 随机采样位置-->供给落点采样
  const count = 1000;
  const sampleSurfaceRef = useRef<THREE.Mesh>(null);
  const { points } = useMemo(() => {
    const points: THREE.Vector3[] = Array.from({ length: count }).map(
      (item) => new THREE.Vector3(0, 0, 0),
    );
    return { points };
  }, [count]);


  // 因为采样表面是子组件,父组件useEffect一定会拿到表面mesh
  useEffect(() => {
    if (!sampleSurfaceRef.current) return;
    const sampler = new MeshSurfaceSampler(sampleSurfaceRef.current).build();
    for (let i = 0; i < count; i++) {
      sampler.sample(points[i]);
    }
  }, []);


  // 鼠标移动时,重新采样落点
  const hitPos = new THREE.Vector3(0, 0, 0);
  const sampleDistMax = 3;
  const sampleDistMin = 1;
  function reSample() {
    let idx = 0;
    for (let i = 0; i < count; i++) {
      const p = points[i];
      const dist = p.distanceTo(hitPos);

      // 采样距离内采样
      if (sampleDistMin < dist && dist < sampleDistMax) {
        samplePoint[idx].copy(p);
        idx++;
      }

      // 采样数量已足够
      if (idx === sampleCount) {
        break;
      }
    }
    emitter.emit('sampleUpdate')
  }

  const { rayCaster } = useMouseRay();
  const surfaceRef = useRef<THREE.Mesh>(null);
  const cellSize = 1.5;
  const cellPos = hitPos.clone().divideScalar(cellSize).floor();

  useFrame(() => {
    if (!surfaceRef.current) return;
    const intersect = rayCaster.intersectObject(surfaceRef.current);
    if (intersect.length > 0) {
      hitPos.copy(intersect[0].point);
      const hitCellPos = hitPos.clone().divideScalar(cellSize).floor();

      if (hitCellPos.x !== cellPos.x || hitCellPos.y !== cellPos.y || hitCellPos.z !== cellPos.z) {
        reSample();
        cellPos.copy(hitCellPos);
        globalUf.startPos.value.set(hitPos.x, hitPos.y, hitPos.z);
      }
    }
  });

  const pane = new Pane();
  useEffect(() => {
    pane
      .addBinding({ col: { r: 1, g: 0, b: 0 } }, "col", {
        label: "dotCol",
        color: { type: "float" },
      })
      .on("change", ({ value }) => {
        const { r, g, b } = value;
        globalUf.dotCol.value.set(r, g, b);
      });
    pane
      .addBinding({ col: { r: 0, g: 1, b: 0 } }, "col", {
        label: "headCol",
        color: { type: "float" },
      })
      .on("change", ({ value }) => {
        const { r, g, b } = value;
        globalUf.headCol.value.set(r, g, b);
      });
    pane
      .addBinding({ col: { r: 1, g: 0, b: 0 } }, "col", {
        label: "tailCol",
        color: { type: "float" },
      })
      .on("change", ({ value }) => {
        const { r, g, b } = value;
        globalUf.tailCol.value.set(r, g, b);
      });
    pane
      .addBinding({ col: { r: 0, g: 1, b: 1 } }, "col", {
        label: "glowCol",
        color: { type: "float" },
      })
      .on("change", ({ value }) => {
        const { r, g, b } = value;
        globalUf.glowCol.value.set(r, g, b);
      });
  }, []);

  return (
    <>
      <Surface ref={surfaceRef} visible={false} />
      <SampleSurface ref={sampleSurfaceRef} visible={false} />
      <Spider />
      <Cube scale={.1}/>
    </>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={0.4} />
      {/* <axesHelper args={[20]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        <Environment
          background
          blur={0.4}
          backgroundIntensity={0.1}
          path={asset("/img/skybox/sky_98_cubemap_2k")}
        />
      </Suspense>
    </WebGPUCanvas>
  );
}
