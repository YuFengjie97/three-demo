import { useFrame } from "@react-three/fiber";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { MeshSurfaceSampler } from "three/examples/jsm/Addons.js";
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
  distance,
} from "three/tsl";
import * as THREE from "three/webgpu";
import { useMouseRay } from "~/hook/useMouseRay";
import Grass from './Grass'
import { useGLTF } from "@react-three/drei";
import { asset } from "~/utils/asset";
import BaseContext from "./baseContext";

export default function Ground() {
  const {pane} = useContext(BaseContext)

  const { rayCaster } = useMouseRay();
  const mat = useMemo(() => {
    const uf = {
      mousePos: uniform(vec3(0)),
      mouseUv: uniform(vec2(0)),
      groundCol: uniform(vec3(0.12,.05,0))
    };

    const positionNode = Fn(() => {
      return positionLocal

      // let h = distance(positionLocal, uf.mousePos);
      // h = smoothstep(1, 0, h);
      // return positionLocal.add(vec3(0, 0, h));
    })();

    const colorNode = Fn(() => {
      return uf.groundCol

      // let d = length(uv().sub(uf.mouseUv));
      // d = smoothstep(0.1, 0, d);
      // return mix(uf.groundCol, vec3(1), d);
    })();

    return { uf, positionNode, colorNode };
  }, []);

  // const surfaceRef = useRef<THREE.Mesh>(null);
  const [surface, setSurface] = useState<THREE.Mesh | null>(null);

  useFrame(() => {
    if (!surface) return;

    const instersets = rayCaster.intersectObject(surface);
    if (instersets.length > 0) {
      const hitPos = instersets[0].point;
      mat.uf.mousePos.value.copy(hitPos);
      const hitUv = instersets[0].uv;
      hitUv && mat.uf.mouseUv.value.copy(hitUv);
    }else{
      mat.uf.mousePos.value.set(999,999,999)
      mat.uf.mouseUv.value.set(999,999)
    }
  });

  const { nodes, materials } = useGLTF(asset('/model/grass_leaf-transformed.glb'))
  const grassGeo = nodes.grass_leaf.geometry

  
  useEffect(() => {
    pane?.addBinding({col: {r:0.12,g:0.05,b:0.}}, 'col', {label: 'ground', color: {type: 'float'}}).on('change',({value}) => {
      const {r,g,b} = value
      mat.uf.groundCol.value.set(r,g,b)
    })
  }, [])


  return (
    <>
    <mesh ref={setSurface}>
      {/* <boxGeometry args={[5,5,5,10,10,10]}/> */}
      <torusKnotGeometry args={[5, 1., 100, 16]} />
      <meshBasicNodeMaterial positionNode={mat.positionNode} colorNode={mat.colorNode} />
    </mesh>
    {surface && <Grass surface={surface} grassGeo={grassGeo} mousePos={mat.uf.mousePos}/>}
    </>
  );
}
