import { useTexture } from "@react-three/drei";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
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
} from "three/tsl";
import Line from "./Line";
import BaseContext from "./baseContext";

interface LineProp {
  start: THREE.Vector3;
  end: THREE.Vector3;
}

export default function Earth() {
  const { pane, colSeed } = useContext(BaseContext);

  const baseMap = useTexture(asset("/img/texture/earth_2k/2k_earth_daymap.jpg"));
  const norMap = useTexture(asset("/img/texture/earth_2k/2k_earth_normal_map.jpg"));
  // const specMap = useTexture(asset('/img/texture/earth_2k/2k_earth_specular_map.jpg'))
  const cloudMap = useTexture(asset("/img/texture/earth_2k/2k_earth_clouds.jpg"));
  const earthRef = useRef<THREE.Mesh>(null);
  const [sampPoints, setSampPoints] = useState<Array<LineProp>>([]);

  const count = 60;
  const earthRadius = 5;

  useEffect(() => {
    if (!earthRef.current) return;
    const sampler = new MeshSurfaceSampler(earthRef.current).build();
    const posArr: LineProp[] = [];
    const start = new THREE.Vector3(0, 0, 0);
    const end = new THREE.Vector3(0, 0, 0);
    for (let i = 0; i < count; i++) {
      sampler.sample(start);
      sampler.sample(end);
      posArr.push({ start: start.clone(), end: end.clone() });
    }
    setSampPoints(posArr);
  }, []);

  const mat = useMemo(() => {
    const colorNode = Fn(() => {
      const base = texture(baseMap, uv());
      // const n = mx_noise_vec3(uv())
      const cloud = texture(cloudMap, uv());
      // const cloud = texture(cloudMap, fract(uv().add(vec2(time.mul(.01),0))));
      // const cloud = texture(cloudMap, mix(uv(), n, fract(time)));

      return mix(base, cloud, cloud.r);
    })();

    return { colorNode };
  }, []);

  const planeSpeed = useRef({value: .1})
  useEffect(() => {
    pane?.addBinding(planeSpeed.current, "value", { label: "planeSpeed", min: 0, max: 2 });
  }, []);

  return (
    <>
      <mesh ref={earthRef}>
        <sphereGeometry args={[earthRadius, 16, 16]} />
        <meshStandardNodeMaterial
          colorNode={mat.colorNode}
          normalMap={norMap}
          metalness={0}
          roughness={1}
        />
      </mesh>
      {sampPoints.map((item, i) => {
        return (
          <Line
            key={i}
            earthRef={earthRef}
            earthRadius={earthRadius}
            start={item.start}
            end={item.end}
            planeSpeed={planeSpeed}
          />
        );
      })}
    </>
  );
}
