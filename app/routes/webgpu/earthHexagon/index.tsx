import { OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo, useState } from "react";
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
  hue,
  transformedNormalWorld,
  rotate,
  mx_rotate3d,
} from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { cos3, lookAt, lookAt2, palette, sin3, smoothRange } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { usePane } from "~/hook/usePane";
import { Pane } from "tweakpane";

type Vector3 = [number, number, number];

interface GoldbergFace {
  pos: Vector3;
  type: "pentagon" | "hexagon";
  tangent: Vector3;
}

export function generateGoldberg(m: number, radius: number = 1): GoldbergFace[] {
  // 1. 定义正二十面体的 12 个原始顶点 (Golden Ratio)
  const phi = (1 + Math.sqrt(5)) / 2;
  const icosaVertices: Vector3[] = [
    [-1, phi, 0],
    [1, phi, 0],
    [-1, -phi, 0],
    [1, -phi, 0],
    [0, -1, phi],
    [0, 1, phi],
    [0, -1, -phi],
    [0, 1, -phi],
    [phi, 0, -1],
    [phi, 0, 1],
    [-phi, 0, -1],
    [-phi, 0, 1],
  ];

  // 2. 正二十面体的 20 个面的索引
  const icosaFaces: number[][] = [
    [0, 11, 5],
    [0, 5, 1],
    [0, 1, 7],
    [0, 7, 10],
    [0, 10, 11],
    [1, 5, 9],
    [5, 11, 4],
    [11, 10, 2],
    [10, 7, 6],
    [7, 1, 8],
    [3, 9, 4],
    [3, 4, 2],
    [3, 2, 6],
    [3, 6, 8],
    [3, 8, 9],
    [4, 9, 5],
    [2, 4, 11],
    [6, 2, 10],
    [8, 6, 7],
    [9, 8, 1],
  ];

  const centersMap = new Map<string, GoldbergFace>();

  // 辅助函数：将点归一化到球面并转为字符串 Key
  const getPointKey = (v: Vector3) => {
    const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    const norm: Vector3 = [(v[0] / len) * radius, (v[1] / len) * radius, (v[2] / len) * radius];
    return {
      key: norm.map((n) => n.toFixed(5)).join("|"),
      pos: norm,
    };
  };

  // 3. 对每个大三角形面进行 m 阶细分
  for (const face of icosaFaces) {
    const v1 = icosaVertices[face[0]];
    const v2 = icosaVertices[face[1]];
    const v3 = icosaVertices[face[2]];

    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= m - i; j++) {
        const k = m - i - j;

        // 使用重心坐标 (Barycentric Coordinates) 插值
        // P = (i/m)*V1 + (j/m)*V2 + (k/m)*V3
        const x = (i * v1[0] + j * v2[0] + k * v3[0]) / m;
        const y = (i * v1[1] + j * v2[1] + k * v3[1]) / m;
        const z = (i * v1[2] + j * v2[2] + k * v3[2]) / m;

        const { key, pos } = getPointKey([x, y, z]);
        // const edgeDir = new THREE.Vector3().subVectors(v2, v1).normalize();
        const edgeDir = new THREE.Vector3(v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]).normalize();
        if (!centersMap.has(key)) {
          // 判断是否为原始 12 个顶点之一（五边形）
          // 逻辑：重心坐标中，如果某两个分量为 0（即 i,j,k 其中两个为 0），则是原始顶点
          const zeroCount = [i, j, k].filter((v) => v === 0).length;
          const isPentagon = zeroCount === 2;

          centersMap.set(key, {
            pos: pos,
            type: isPentagon ? "pentagon" : "hexagon",
            tangent: [edgeDir.x, edgeDir.y, edgeDir.z], // 存储切线参考
          });
        }
      }
    }
  }

  return Array.from(centersMap.values());
}

function Earth() {
  const { camera, gl, scene } = useThree();
  camera.position.set(0, 10, 15);

  const [detail, setDetail] = useState(40)

  const uf = useMemo(() => {
    return {
      heightMin: uniform(0.1),  // 最小基准高度
      levelNum: uniform(10),     // 高度分层数
      levelHeight: uniform(.2), // 每层高的高度

      noiseScale: uniform(0.18),
      noiseOffset: uniform(0.),
      
      landNoiseScale: uniform(.6),
      landNoiseOffset: uniform(0.),
      
      seaRange: uniform(.5),
      grassRange: uniform(.5),
      rockRange: uniform(.7),

      seaCol0: uniform(new THREE.Color(0x65e2ff)),
      seaCol1: uniform(new THREE.Color(0x1d62b0)),
      grassCol0: uniform(new THREE.Color(0xa5d3aa)),
      grassCol1: uniform(new THREE.Color(0x71e911)),
      rockCol0: uniform(new THREE.Color(0xb3b05c)),
      rockCol1: uniform(new THREE.Color(0xa07700)),
    };
  }, []) 


  const mat = useMemo(() => {
    const gold = generateGoldberg(detail, 10);
    const arr = gold.filter((item) => item.type === "hexagon");
    const positionArr = new Float32Array(arr.length * 3);
    const tangentArr = new Float32Array(arr.length * 3);
    for (let i = 0; i < arr.length; i++) {
      const i3 = i * 3;
      positionArr[i3 + 0] = arr[i].pos[0];
      positionArr[i3 + 1] = arr[i].pos[1];
      positionArr[i3 + 2] = arr[i].pos[2];

      tangentArr[i3 + 0] = arr[i].tangent[0];
      tangentArr[i3 + 1] = arr[i].tangent[1];
      tangentArr[i3 + 2] = arr[i].tangent[2];
    }
    const count = positionArr.length / 3;


    const positionBuffer = instancedArray(positionArr, "vec3");
    const tangentBuffer = instancedArray(tangentArr, "vec3");



    const vCol = varying(vec3(0));

    const positionNode = Fn(() => {
      const pos = positionBuffer.element(instanceIndex);
      const refTangent = tangentBuffer.element(instanceIndex);

      const N = pos.normalize();
      const T = refTangent.sub(N.mul(dot(refTangent, N))).normalize();
      const B = cross(T, N).normalize();
      const rotationMatrix = mat3(T, N, B);

      const scale = float(7./detail);
      const noiseVal = simplexNoise3d(pos.mul(uf.noiseScale).add(uf.noiseOffset))
      const n = smoothstep(-1, 1, noiseVal);

      const seaRange = smoothRange(0, uf.seaRange, n);
      const land = seaRange.oneMinus()


      // const seaCol = mix(uf.seaCol0, uf.seaCol1, pow(seaRange,2)).mul(seaRange)
      const seaCol = uf.seaCol1.mul(seaRange)

      const landNoise = mx_noise_float(pos.mul(uf.landNoiseScale).add(uf.landNoiseOffset)).mul(land).mul(.5).add(.5)
      const grassRange = smoothRange(0,uf.grassRange,landNoise)
      const rockRange = smoothRange(uf.grassRange,uf.rockRange,landNoise)
      const snowRang  = smoothRange(uf.rockRange,1,landNoise)

      // const grassCol = mix(uf.grassCol0, uf.grassCol1, grassRange).mul(grassRange)
      // const rockCol = mix(uf.rockCol0, uf.rockCol1, grassRange).mul(rockRange)

      const grassCol = uf.grassCol1.mul(grassRange)
      const rockCol = uf.rockCol1.mul(rockRange)
      const snowCol= vec3(.8).mul(snowRang)

      const landCol = grassCol.add(rockCol).add(snowCol)

      const landHeight = land.mul(landNoise).mul(uf.levelNum).floor().mul(uf.levelHeight)
      
      const height = uf.heightMin.toVar().add(landHeight)

      vCol.assign(mix(landCol, seaCol, seaRange))
      

      return rotationMatrix.mul(positionLocal.add(0,0,.25).mul(vec3(scale, height, scale))).add(pos);
    })();

    const colorNode = Fn(() => {
      // const pos = positionBuffer.element(instanceIndex);
      // const col = sin3(vec3(3, 2, 1).add(float(instanceIndex)))
      //   .mul(0.5)
      //   .add(0.5);
      // const col = vec3(.5);
      const col = vCol.mul(1.6);
      return col;
    })();

    return { count, positionNode, colorNode, uf };
  }, [detail]);

  useEffect(() => {
    const pane = new Pane()
    pane.addBinding({value: detail}, "value", { label: "detail", min: 10, max: 100, step: 1 }).on('change', ({value})=>{
      if(value !== detail) {
        setDetail(value)
      }
    });

    pane.addBinding(mat.uf.levelNum, "value", { label: "levelNum", min: 1, max: 20, step: 1 });
    pane.addBinding(mat.uf.levelHeight, "value", { label: "levelHeight", min: .01, max: 1 });
    pane.addBinding(mat.uf.heightMin, "value", { label: "heightMin", min: 0.1, max: 2 });
    
    const noiseFolder = pane.addFolder({title: 'noise'})
    noiseFolder.addBinding(mat.uf.noiseScale, "value", { label: "noiseScale", min: 0.01, max: 1 });
    noiseFolder.addBinding(mat.uf.noiseOffset, "value", { label: "noiseOffset", min: 0.0, max: 10 });
    noiseFolder.addBinding(mat.uf.landNoiseScale, "value", { label: "landNoiseScale", min: 0.01, max: 5 });
    noiseFolder.addBinding(mat.uf.landNoiseOffset, "value", { label: "landNoiseOffset", min: 0.0, max: 10 });


    const rangeFolder = pane.addFolder({title: 'range'})
    rangeFolder.addBinding(mat.uf.seaRange, "value", { label: "seaRange", min: 0.01, max: 1 });
    rangeFolder.addBinding(mat.uf.grassRange, "value", { label: "grassRange", min: 0.01, max: 1 });
    rangeFolder.addBinding(mat.uf.rockRange, "value", { label: "rockRange", min: 0.01, max: 1 });

    const colFolder = pane.addFolder({title: 'color', expanded: false})
    // colFolder.addBinding({col: new THREE.Color(mat.uf.seaCol0.value).getHex()}, "col", { label: "seaCol0", view:'color' }).on('change', ({value}) => {
    //   const c = new THREE.Color(value)
    //   const{r,g,b} = c
    //   mat.uf.seaCol0.value.set(r,g,b)
    // });
    colFolder.addBinding({col: new THREE.Color(mat.uf.seaCol1.value).getHex()}, "col", { label: "seaCol1", view:'color' }).on('change', ({value}) => {
      const c = new THREE.Color(value)
      const{r,g,b} = c
      mat.uf.seaCol1.value.set(r,g,b)
    });
    // colFolder.addBinding({col: new THREE.Color(mat.uf.grassCol0.value).getHex()}, "col", { label: "grassCol0", view:'color' }).on('change', ({value}) => {
    //   const c = new THREE.Color(value)
    //   const{r,g,b} = c
    //   mat.uf.grassCol0.value.set(r,g,b)
    // });
    colFolder.addBinding({col: new THREE.Color(mat.uf.grassCol1.value).getHex()}, "col", { label: "grassCol1", view:'color' }).on('change', ({value}) => {
      const c = new THREE.Color(value)
      const{r,g,b} = c
      mat.uf.grassCol1.value.set(r,g,b)
    });
    // colFolder.addBinding({col: new THREE.Color(mat.uf.rockCol0.value).getHex()}, "col", { label: "rockCol0", view:'color' }).on('change', ({value}) => {
    //   const c = new THREE.Color(value)
    //   const{r,g,b} = c
    //   mat.uf.rockCol0.value.set(r,g,b)
    // });
    colFolder.addBinding({col: new THREE.Color(mat.uf.rockCol1.value).getHex()}, "col", { label: "rockCol1", view:'color' }).on('change', ({value}) => {
      const c = new THREE.Color(value)
      const{r,g,b} = c
      mat.uf.rockCol1.value.set(r,g,b)
    });

    return () => {
      pane.dispose()
    }
  }, []);

  const map = useTexture(asset('/img/texture/matcap/2D2D2F_C6C2C5_727176_94949B.png'))

  return (
    <instancedMesh args={[undefined, undefined, mat.count]}>
      <cylinderGeometry args={[1, 1, 0.5, 6, 6]} />
      <meshStandardNodeMaterial
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        // matcap={map}
        // side={THREE.DoubleSide}
        metalness={.0}
        roughness={.9}
      />
    </instancedMesh>
  );
}

function Base() {
  return <Earth />;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 10]} intensity={2.1} />
      <axesHelper args={[20]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
      </Suspense>
    </WebGPUCanvas>
  );
}
