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
  attribute,
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


function Cloud() {
  const {camera,scene} = useThree()
  camera.position.set(0,0,10)
  scene.background = new THREE.Color(0x6c5ce7)

  // const { nodes } = useGLTF(asset('/model/goldbergBall.glb'))
  const { nodes } = useGLTF(asset('/model/goldbergBall-transformed.glb'))
  // @ts-ignore
  const geo = nodes.base.geometry as THREE.BufferGeometry
  console.log(geo);


  const mat = useMemo(() => {

    const facePos = attribute<'vec3'>('_facevertexcenter', 'vec3')

    const uf = {
      seaCol: uniform(new THREE.Color(0x52a2d5)),
      grassCol: uniform(new THREE.Color(0x529540)),
      rockCol: uniform(new THREE.Color(0xc5842a)),
      snowCol: uniform(new THREE.Color(0xc2b3b3)),

      seaRange: uniform(float(.5)),
      grassRange: uniform(float(.6)),
      rockRange: uniform(float(.8)),

      noiseOffset: uniform(float(0))
    }
    const vFacePos = varying(vec3(0))
    const vCol = varying(vec3(0))

    const positionNode = Fn(() => {
      vFacePos.assign(facePos)

      const dir = facePos.toVar()  // 这里在blender分配的属性稍微有一丢丢问题,不要归一化
      const noise = mx_noise_float(facePos.mul(.4)).mul(.5).add(.5)

      // 1.区分海洋和陆地
      const sea = step(uf.seaRange, noise)
      const seaCol = sea.mul(uf.seaCol)

      const noiseInput = facePos.add(uf.noiseOffset)

      // 2.在陆地上区分,草地,岩石,雪山 0-grass-rock-snow-1
      const land = sea.oneMinus()
      const noiseLand = mx_noise_float(noiseInput.add(3)).mul(.5).add(.5)
      const snow = land.mul(step(uf.rockRange, noiseLand))
      const rock = land.mul(step(uf.grassRange, noiseLand).mul(step(noiseLand, uf.rockRange)))
      const grass = land.mul(step(noiseLand, uf.grassRange))



      const snowCol = snow.mul(uf.snowCol)
      const rockCol = rock.mul(mix(uf.rockCol, vec3(-.2), mx_noise_float(noiseInput.add(55))))
      const grassCol = grass.mul(mix(uf.grassCol, vec3(-.2), mx_noise_float(noiseInput.add(66))))


      // 高度逻辑
      const noiseHeight = mx_noise_float(noiseInput.add(4)).mul(.5).add(.5)
      const landHeight = land.mul(noiseHeight).mul(1.4) // 陆地高度随机
      const noiseSeaHeight = mx_noise_float(noiseInput.mul(.6).add(4).add(time.mul(.3))).mul(.5).add(.5) // 海洋高度随时间起伏
      const seaHeight = sea.mul(noiseSeaHeight).mul(.6)
      const height = landHeight.add(seaHeight)
      height.mulAssign(.1)

      seaCol.assign(mix(seaCol, vec3(-.1), noiseSeaHeight.oneMinus())) // 颜色随高度变化
      vCol.assign(seaCol.add(snowCol).add(rockCol).add(grassCol))

      return positionLocal.add(dir.mul(height))
    })()

    const colorNode = Fn(() => {
      return vCol
      // return sin3(vec3(3,2,1).add(vFacePos.mul(2))).mul(.5).add(.5)
    })();


    return {  positionNode, colorNode, uf};
  }, []);

    useEffect(() => {
      const pane = new Pane()
      pane.addBinding(mat.uf.noiseOffset, "value", { label: "noiseOffset", min: 0., max: 10 });


      const colFolder = pane.addFolder({title: 'color'})
      colFolder.addBinding({col: new THREE.Color(mat.uf.seaCol.value).getHex()}, "col", { label: "seaCol", view:'color' }).on('change', ({value}) => {
        const c = new THREE.Color(value)
        const{r,g,b} = c
        mat.uf.seaCol.value.set(r,g,b)
      });
      colFolder.addBinding({col: new THREE.Color(mat.uf.grassCol.value).getHex()}, "col", { label: "grassCol", view:'color' }).on('change', ({value}) => {
        const c = new THREE.Color(value)
        const{r,g,b} = c
        mat.uf.grassCol.value.set(r,g,b)
      });
      colFolder.addBinding({col: new THREE.Color(mat.uf.rockCol.value).getHex()}, "col", { label: "rockCol", view:'color' }).on('change', ({value}) => {
        const c = new THREE.Color(value)
        const{r,g,b} = c
        mat.uf.rockCol.value.set(r,g,b)
      });
      colFolder.addBinding({col: new THREE.Color(mat.uf.snowCol.value).getHex()}, "col", { label: "snowCol", view:'color' }).on('change', ({value}) => {
        const c = new THREE.Color(value)
        const{r,g,b} = c
        mat.uf.snowCol.value.set(r,g,b)
      });

      const rangeFolder = pane.addFolder({title: 'range'})
      rangeFolder.addBinding(mat.uf.seaRange, "value", { label: "seaRange", min: 0.01, max: 1 });
      rangeFolder.addBinding(mat.uf.grassRange, "value", { label: "grassRange", min: 0.01, max: 1 });
      rangeFolder.addBinding(mat.uf.rockRange, "value", { label: "rockRange", min: 0.01, max: 1 });

    }, [])
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial
        positionNode={mat.positionNode}
        // side={THREE.DoubleSide}
        colorNode={mat.colorNode}
        roughness={1.}
        metalness={.0}
        />
        
    </mesh>
  );
}

function Base() {
  return <Cloud />;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={1} />
      <directionalLight position={[0, 10, 10]} intensity={4.1} />
      <directionalLight position={[0, -10, -10]} intensity={2.5} />
      <axesHelper args={[20]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
      </Suspense>
    </WebGPUCanvas>
  );
}
