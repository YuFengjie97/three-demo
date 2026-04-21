import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { button, folder, useControls } from "leva";
import { Suspense, useEffect, useMemo } from "react";
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
import { godrays } from "three/examples/jsm/tsl/display/GodraysNode.js";
import { bilateralBlur } from "three/examples/jsm/tsl/display/BilateralBlurNode.js";
import { depthAwareBlend } from "three/examples/jsm/tsl/display/depthAwareBlend.js";


function Cloud() {
  const {scene, camera} = useThree()
  scene.background = new THREE.Color(0x6c5ce7)
  camera.position.set(0,0,3)
  
  const { nodes } = useGLTF(asset('/model/hexagonSphereSplit-transformed.glb'))
  // @ts-ignore
  const geo = nodes.base.geometry as THREE.BufferGeometry
  console.log(geo);


  const mat = useMemo(() => {

    const pos = attribute<'vec3'>('_pos', 'vec3')
    const vCol = varying(vec3(0))

    const uf = {
      noiseSpeed: uniform(float(1.4)),
      roughness: uniform(float(.1)),
      metalness: uniform(float(.9)),
      clearcoat: uniform(float(.6)),
      clearcoatRoughness: uniform(float(.3)),
    }

    const positionNode = Fn(() => {
      const offset = smoothstep(0.,1.,mx_noise_float(pos.mul(2).add(time.mul(uf.noiseSpeed)))).mul(.2)
      const dir = pos

      vCol.assign(sin3(vec3(3,2,1).add(dot(pos, vec3(2.)))).mul(.5).add(.5))

      return positionLocal.add(dir.mul(offset))
    
    })()

    const colorNode = Fn(() => {
      return vec4(vCol.mul(1.), 1)
      // return vec3(1,0,0)
      // return sin3(vec3(3,2,1).add(vFacePos.mul(2))).mul(.5).add(.5)
    })();


    return {  positionNode, colorNode, uf};
  }, []);

    useEffect(() => {
      const pane = new Pane()
      pane.addBinding(mat.uf.noiseSpeed, "value", { label: "noiseSpeed", min: 0., max: 5 });
      pane.addBinding(mat.uf.roughness, "value", { label: "roughness", min: 0., max: 1 });
      pane.addBinding(mat.uf.metalness, "value", { label: "metalness", min: 0., max: 1 });
      pane.addBinding(mat.uf.clearcoat, "value", { label: "clearcoat", min: 0., max: 1 });
      pane.addBinding(mat.uf.clearcoatRoughness, "value", { label: "clearcoatRoughness", min: 0., max: 1 });

      // const colFolder = pane.addFolder({title: 'color'})
      // colFolder.addBinding({col: new THREE.Color(mat.uf.seaCol.value).getHex()}, "col", { label: "seaCol", view:'color' }).on('change', ({value}) => {
      //   const c = new THREE.Color(value)
      //   const{r,g,b} = c
      //   mat.uf.seaCol.value.set(r,g,b)
      // });

    }, [])
  return (
    <mesh geometry={geo} receiveShadow castShadow>
      <meshPhysicalNodeMaterial
        positionNode={mat.positionNode}
        // side={THREE.DoubleSide}
        colorNode={mat.colorNode}
        roughnessNode={mat.uf.roughness}
        metalnessNode={mat.uf.metalness}
        clearcoatNode={mat.uf.clearcoat}
        // iridescenceNode={mat.uf.clearcoat}
        clearcoatRoughnessNode={mat.uf.clearcoatRoughness}
        />
        
    </mesh>
  );
}

function Test(){
  const count = 50
  const mat = useMemo(() => {
    const posArr = new Float32Array(count*3)
    for(let i=0.;i<posArr.length;i++){
      const i3 = i*3
      posArr[i3+0] = (Math.random()+.2)*2*(Math.random()<.5?1:-1)
      posArr[i3+1] = (Math.random()+.2)*2*(Math.random()<.5?1:-1)
      posArr[i3+2] = (Math.random()+.2)*2*(Math.random()<.5?1:-1)
    }
    const posBuffer = instancedArray(posArr, 'vec3')
    const positionNode =  Fn(() => {
      const idx = instanceIndex
      const pos = posBuffer.element(idx).toVar()
      return positionLocal.add(pos)
    })()

    return {positionNode}
  }, [count])

  return (
    <instancedMesh scale={[100,100,100]} args={[undefined,undefined,count]} castShadow receiveShadow>
      <boxGeometry />
      <meshBasicMaterial positionNode={mat.positionNode}/>
    </instancedMesh>
  )
}

function Base() {
  return <Cloud />;
  // return <Test/>
}

function WebGPUEffects() {
  const { gl, scene, camera, size } = useThree();
  // gl.toneMapping = THREE.AgXToneMapping
  scene.background = new THREE.Color(0x000000)
  // scene.background = new THREE.Color(0x6c5ce7)

  camera.position.set(0,0,3)
  camera.far = 100

  const renderer = gl as unknown as THREE.WebGPURenderer;
  renderer.shadowMap.enabled = true

  const pointLight = new THREE.PointLight( 0xf6287d, 20 );
  pointLight.position.set(0,0,0)
  pointLight.castShadow = true;
  pointLight.shadow.bias = - 0.00001;
  pointLight.shadow.mapSize.width = 2048;
  pointLight.shadow.mapSize.height = 2048;
  scene.add( pointLight );

  const {renderPipeline, godraysPass} = useMemo(() => {
    const renderPipeline = new THREE.RenderPipeline(renderer);
    const scenePass = pass( scene, camera );
    const scenePassColor = scenePass.getTextureNode( 'output' );
    const scenePassDepth = scenePass.getTextureNode( 'depth' );

    // godrays
  
    const godraysPass = godrays( scenePassDepth, camera, pointLight );
    godraysPass.raymarchSteps.value = 40
    godraysPass.density.value = 250
    godraysPass.maxDensity.value = 340
    godraysPass.distanceAttenuation.value = 550

    const godraysPassColor = godraysPass.getTextureNode();


    // blur

    const blurPass = bilateralBlur( godraysPassColor );
    const blurPassColor = blurPass.getTextureNode();

    // composite

    const blendColor = uniform( color( 0xf6287d ) );
    const edgeRadius = uniform( int( 3 ) );
    const edgeStrength = uniform( float( 2 ) );

    const outputBlurred = depthAwareBlend( scenePassColor, blurPassColor, scenePassDepth, camera, { blendColor, edgeRadius, edgeStrength } );
    const outputRaw = depthAwareBlend( scenePassColor, godraysPassColor, scenePassDepth, camera, { blendColor, edgeRadius, edgeStrength } );
  	
    renderPipeline.outputNode = outputBlurred;
    // renderPipeline.outputNode = scenePassDepth
    // renderPipeline.outputNode = scenePassColor.add( godraysPassColor );
    // renderPipeline.outputNode = godraysPassColor

    return {renderPipeline, godraysPass};
  }, [gl, scene, camera]);

  const pane = new Pane()
  useEffect(() => {
    pane.addBinding(godraysPass.raymarchSteps, 'value', {min: 10, max: 200, step: 1})
    pane.addBinding(godraysPass.density, 'value', {min: 0.01, max: 1000,})
    pane.addBinding(godraysPass.maxDensity, 'value', {min: 0.01, max: 1000,})
    pane.addBinding(godraysPass.distanceAttenuation, 'value', {min: 0.01, max: 1000})
  })

  // 接管渲染，优先级设为 1 覆盖默认渲染
  useFrame(() => {
    scene.updateMatrixWorld();
    camera.updateMatrixWorld();
    renderPipeline.render();
  }, 1);

  return null;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight intensity={.4} />
      {/* <hemisphereLight args={[0xff0000, 0x00ff00]} intensity={1}/> */}
      <pointLight intensity={4}/>
      <directionalLight position={[0, 10, 10]} intensity={4.1} />
      <directionalLight position={[0, -10, -10]} intensity={2.5} />
      {/* <axesHelper args={[20]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
        {/* <WebGPUEffects /> */}
        <Environment background blur={0.4} path={asset("/img/skybox/sky_98_cubemap_2k")} />
      </Suspense>
    </WebGPUCanvas>
  );
}
