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
import { cos3, lookAt, lookAt2, palette, sin3 } from "~/utils/tsl";
import { curlNoise3d } from "~/utils/tsl/curlNoise3d";
import { simplexNoise3d } from "~/utils/tsl/simplexNoise3d";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useAudioAnalyser, type BinInfo } from "~/hook/useAuido";
import { usePane } from "~/hook/usePane";

type Vector3 = [number, number, number];

interface GoldbergFace {
  pos: Vector3;
  type: "pentagon" | "hexagon";
  tangent: Vector3;
}


function Cloud() {
  const {camera} = useThree()
  camera.position.set(0,10,20)

  const { nodes } = useGLTF(asset('/model/hexagonSphere.glb'))
  console.log(1111, nodes);
  const geo = nodes.ball.geometry as THREE.BufferGeometry

  const { nodes: insNodes } = useGLTF(asset('/model/hexagonBar.glb'))
  const insGeo = insNodes.bar.geometry


  const positionArr = geo.getAttribute('_facecenter').array as Float32Array
  const normalArr = geo.getAttribute('_facenormal').array as Float32Array
  const typeArr  =geo.getAttribute('_facetype').array as Float32Array
  const count = positionArr.length / 3
  
  

  const mat = useMemo(() => {
    const positionBuffer = instancedArray(positionArr, "vec3");
    const normalBuffer = instancedArray(normalArr, "vec3");

    const positionNode = Fn(() => {
      const pos = positionBuffer.element(instanceIndex); // 表面中心点
      const N = normalBuffer.element(instanceIndex).normalize(); // 法线

      // 1. 定义一个参考的向上向量
      // 如果法线刚好是 (0, 1, 0)，叉乘会失败，所以加个判断
      const up = select(abs(N.y).greaterThan(0.9), vec3(1, 0, 0), vec3(0, 1, 0));

      // 2. 构造三轴（Gram-Schmidt 过程）
      const xAxis = cross(up, N).normalize();
      const zAxis = cross(xAxis, N).normalize();

      const rotationMatrix = mat3(xAxis, N, zAxis);

      // 4. 让圆柱体“底面”贴合球面
      // 假设圆柱体高度为 h，几何体本身中心在 (0,0,0)
      // 我们需要先在局部坐标系里把圆柱体向上移动 h/2
      const h = 0.5; // 这里填你创建 CylinderGeometry 时的高度
      const localPos = positionLocal.add(vec3(0, 1, 0));

      const rot = lookAt(pos.normalize())

      // 5. 应用旋转并平移到球面的位置
      return rot.mul(positionLocal.mul(.9)).add(pos)
    })();

    const colorNode = Fn(() => {
      const pos = positionBuffer.element(instanceIndex);
      const col = sin3(vec3(3, 2, 1).add(float(instanceIndex)))
        .mul(0.5)
        .add(0.5);
      return col;
    })();


    return { count, positionNode, colorNode };
  }, []);
  return (
    <instancedMesh args={[insGeo, undefined, mat.count]}>
      {/* <cylinderGeometry args={[1, 1, 0.5, 6]} /> */}
      <meshStandardNodeMaterial
        positionNode={mat.positionNode}
        colorNode={mat.colorNode}
        // side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}

function Base() {
  return <Cloud />;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 10]} intensity={1.1} />
      <axesHelper args={[20]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
      </Suspense>
    </WebGPUCanvas>
  );
}
