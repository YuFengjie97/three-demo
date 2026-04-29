import { Html, useFBO, useTexture } from "@react-three/drei";
import { useContext, useEffect, useMemo, useRef, useState, type Ref, type RefObject } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js";
import { asset } from "~/utils/asset";
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
  rand,
} from "three/tsl";
import BaseContext from "./baseContext";
import { sin3 } from "~/utils/tsl";
import Plane1 from "./CutePlane1";
import Plane2 from "./CutePlane2";
import Plane3 from "./CutePlane3";
import { useFrame } from "@react-three/fiber";
import { mathSmoothstep } from "~/utils/math";

export default function Line({
  earthRef,
  earthRadius,
  start,
  end,
  planeSpeed,
}: {
  earthRef: RefObject<THREE.Mesh>;
  earthRadius: number;
  start: THREE.Vector3;
  end: THREE.Vector3;
  planeSpeed: RefObject<{ value: number }>;
}) {
  const { pane, colSeed } = useContext(BaseContext);
  const rand = Math.random();

  const { curve, colorNode } = useMemo(() => {
    const segments = 8;
    const points: THREE.Vector3[] = [];
    const dist = start.distanceTo(end);

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // 使用 Spherical Linear Interpolation (slerp) 获取球面路径点
      const point = new THREE.Vector3().lerpVectors(start, end, t).normalize();

      // 使用正弦函数让高度在两头为 0，中间最高，形成完美的抛物线
      const altitude = Math.sin(t * Math.PI) * (i / segments);

      point.multiplyScalar(earthRadius + altitude);
      points.push(point);
    }

    const curve = new THREE.CatmullRomCurve3(points);

    const colorNode = Fn(() => {
      const d = smoothstep(0.4, 0.5, abs(sin(uv().x.mul(float(dist).mul(10)).sub(time.mul(2)))));
      const col = sin3(colSeed.add(float(rand).mul(20)))
        .mul(0.5)
        .add(0.5);
      return vec4(col.mul(d), d);
    })();

    return { curve, colorNode };
  }, [start, end, earthRadius]);

  const life = { value: Math.random() };
  const planeRef = useRef<THREE.Object3D>(null);
  const planeType = Math.floor(Math.random() * 3);

  const _pos = new THREE.Vector3();
  const _target = new THREE.Vector3();
  const _up = new THREE.Vector3();
  const _matrix = new THREE.Matrix4();

  useFrame((_, deltaTime) => {
    if (!planeRef.current) return;

    life.value += deltaTime * planeSpeed.current.value;
    if (life.value > 1) life.value %= 1;

    curve.getPoint(life.value, _pos);
    curve.getPoint(Math.min(life.value + 0.001, 1), _target); // 防止超过 1

    // 3. 关键：计算飞机的“向上”向量
    // 飞机是在球面上飞，所以它的 Up 应该是当前位置点的法线（即指向球心方向的延长线）
    _up.copy(_pos).normalize();

    // 4. 使用 lookAt 的矩阵版本，明确指定 up 向量
    // 这样可以强制飞机的背部永远朝向太空，肚子朝向地面
    _matrix.lookAt(_pos, _target, _up);
    planeRef.current.quaternion.setFromRotationMatrix(_matrix);

    planeRef.current.position.copy(_pos);
    const s = mathSmoothstep(0, 0.1, life.value) * mathSmoothstep(1, 0.9, life.value);
    planeRef.current.scale.set(s, s, s);
  });

  return (
    <>
      {/* <Html position={start} occlude={[earthRef]}>
        <div className="bg-amber-300 select-none">
          dfdf
        </div>
      </Html>
      <Html position={end} occlude={[earthRef]}>
        <div className="bg-green-500 select-none">
          xxx
        </div>
      </Html> */}
      <mesh>
        <tubeGeometry args={[curve, 100, 0.02, 8, false]} />
        <meshBasicNodeMaterial colorNode={colorNode} transparent />
      </mesh>
      {planeType === 0 && (
        <group ref={planeRef}>
          <Plane1 rotation-y={Math.PI} />
        </group>
      )}
      {planeType === 1 && (
        <group ref={planeRef}>
          <Plane2 rotation-y={Math.PI} />
        </group>
      )}
      {planeType === 2 && (
        <group ref={planeRef}>
          <Plane3 rotation-y={Math.PI} />
        </group>
      )}
    </>
  );
}
