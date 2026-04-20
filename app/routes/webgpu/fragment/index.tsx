import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  attribute,
  cos,
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
import { SkyboxFairyForestDay } from "~/components/model/SkyboxFairyForestDay";
import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js";

function Model() {
  const { nodes, materials } = useGLTF(asset("/model/starFragment-transformed.glb"));

  // @ts-ignore
  // const geoBase = nodes.plane.geometry as THREE.BufferGeometry;
  // const geoBase = new THREE.BoxGeometry(5, 5, 5,4,4,4);
  // const geoBase = new THREE.PlaneGeometry(5,5)
  const geoBase = new THREE.TorusKnotGeometry(5, 1., 50, 6)
  console.log(geoBase);

  const positionAttr = geoBase.getAttribute("position");
  const indexArr = geoBase.getIndex()!.array;
  const faceCount = indexArr.length / 3;

  const mat = useMemo(() => {
    const posArr: number[] = [];
    const displaceDirArr: number[] = [];
    const seedArr: number[] = []
    const blockCenterArr: number[] = []

    // 遍历三角面,形成三角体
    // 三角面的三个顶点
    const v0 = new THREE.Vector3();
    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const v3 = new THREE.Vector3(); // 三角面法线偏移的点(三角体补充的那个点)
    const nor = new THREE.Vector3(); // 三角面的平面法线 或 三角体每个点的平移方向

    const plane = new THREE.Plane();
    for (let i = 0; i < faceCount; i++) {
      const i3 = i * 3;
      v0.fromBufferAttribute(positionAttr, indexArr[i3 + 0]);
      v1.fromBufferAttribute(positionAttr, indexArr[i3 + 1]);
      v2.fromBufferAttribute(positionAttr, indexArr[i3 + 2]);
      plane.setFromCoplanarPoints(v0, v1, v2);
      nor.copy(plane.normal);

      v3.copy(v0).add(v1).add(v2).divideScalar(3); // 三角面中心
      v3.add(nor.clone().multiplyScalar(-.2)); // 三角面中心点向平面法线方向偏移

      // 三角体的4个面
      posArr.push(...v0.toArray(),...v1.toArray(),...v2.toArray()); //012
      posArr.push(...v3.toArray(),...v1.toArray(),...v0.toArray()); //312
      posArr.push(...v3.toArray(),...v2.toArray(),...v1.toArray()); //321
      posArr.push(...v3.toArray(),...v0.toArray(),...v2.toArray()); //302

      // 为三角体的4个面指定相同位移方向属性
      displaceDirArr.push(...nor.toArray(),...nor.toArray(),...nor.toArray())
      displaceDirArr.push(...nor.toArray(),...nor.toArray(),...nor.toArray())
      displaceDirArr.push(...nor.toArray(),...nor.toArray(),...nor.toArray())
      displaceDirArr.push(...nor.toArray(),...nor.toArray(),...nor.toArray())

      // 为三角体每个点设置seed
      seedArr.push(i3,i3,i3)
      seedArr.push(i3,i3,i3)
      seedArr.push(i3,i3,i3)
      seedArr.push(i3,i3,i3)


      // 为三角体每个点指定三角体的中心
      blockCenterArr.push(...v3.toArray(),...v3.toArray(),...v3.toArray())
      blockCenterArr.push(...v3.toArray(),...v3.toArray(),...v3.toArray())
      blockCenterArr.push(...v3.toArray(),...v3.toArray(),...v3.toArray())
      blockCenterArr.push(...v3.toArray(),...v3.toArray(),...v3.toArray())
    }

    const geo = new THREE.BufferGeometry();
    console.log({ posArr, displaceDirArr });

    geo.setAttribute("position", new THREE.Float32BufferAttribute(posArr, 3));
    geo.setAttribute('displaceDir', new THREE.Float32BufferAttribute(displaceDirArr, 3))
    geo.setAttribute('seed', new THREE.Float32BufferAttribute(seedArr, 1))
    geo.setAttribute('blockCenter', new THREE.Float32BufferAttribute(blockCenterArr, 3))

    const colorNode = Fn(() => {
      return vec3(1);
    })();

    const displaceDir = attribute<'vec3'>('displaceDir', 'vec3')
    const seed = attribute<'float'>('seed', 'float')
    const blockCenter = attribute<'float'>('blockCenter', 'float')
    const positionNode = Fn(() => {
      const offsetStrength = smoothstep(0.5, 1., mx_noise_float(displaceDir.mul(2.).add(time)).mul(.5).add(.5)).mul(3)

      // const cen = vec3(sin(time.mul(4)),0,0).mul(10)
      // const offsetStrength = float(.1).div(blockCenter.distance(cen).mul(5).add(1))

      const offset = displaceDir.mul(offsetStrength)
      return positionLocal.add(offset)
    })()

    return { geo, colorNode, positionNode };
  }, []);

  const pane = new Pane();
  useEffect(() => {
    // pane.addBinding(uf.colSeed, "value", { label: "colSeed", min: 0, max: 10 });

    return () => {
      pane.dispose();
    };
  }, []);

  return (
    <mesh geometry={mat.geo}>
      <meshPhysicalNodeMaterial 
        roughness={.1}
        metalness={.9}
        positionNode={mat.positionNode}
        colorNode={mat.colorNode} />
    </mesh>
  );
}

function Base() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t);
  });

  return (
    <group ref={groupRef}>
      <Model />
    </group>
  );
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
        <Environment background blur={0.4} path={asset("/img/skybox/sky_98_cubemap_2k")} />
        {/* <SkyboxFairyForestDay /> */}
      </Suspense>
    </WebGPUCanvas>
  );
}
