import { Loader, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree, type ThreeToJSXElements } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three/webgpu";
import { Fn, sin, dot, smoothstep, time, vec3, vec4, instanceIndex, instancedArray, uniform, mx_noise_vec3, positionGeometry, cameraProjectionMatrix, modelViewMatrix, float, positionLocal, texture, mix, varying, vec2, oneMinus, uv } from "three/tsl";
import { useControls } from "leva";
import { asset } from "~/utils/asset";
import { TailCanvas } from "~/utils/tailCanvas";
import { palette } from "~/utils/tsl";

declare module "@react-three/fiber" {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any);

function Base() {

  const uniforms = useMemo(() => (
    {
      uColStart: uniform(new THREE.Color(1,0,0)),
      uColEnd: uniform(new THREE.Color(0,1,0))
    }
  ), [])

  // useControls({
  //   uColStart: {
  //     value: uniforms.uColStart.value.getStyle(),
  //     onChange(v) {
  //       uniforms.uColStart.value = new THREE.Color(v)
  //     }
  //   },
  //   uColEnd: {
  //     value: uniforms.uColEnd.value.getStyle(),
  //     onChange(v) {
  //       uniforms.uColEnd.value = new THREE.Color(v)
  //     }
  //   }
  // })


  // 鼠标轨迹canvas
  const mousePos = { x: 0, y: 0 };
  const handleMousemove = (e: MouseEvent) => {
    const { x, y } = e;
    mousePos.x = x;
    mousePos.y = y;
  };
  const tailCanvas = useMemo(() => {
    return new TailCanvas();
  }, []);
  useEffect(() => {
    document.body.appendChild(tailCanvas.canvas);
    document.addEventListener("mousemove", handleMousemove);
    return () => {
      document.removeEventListener("mousemove", handleMousemove);
    };
  });

  const { nodes, materials } = useGLTF(asset("/model/reliefs_high_compressed.glb"));
  const tailTex = new THREE.CanvasTexture(tailCanvas.canvas)


  Object.values(materials).forEach((material) => {
    const mat = material as unknown as THREE.NodeMaterial;
    
    const texMap = material.map as THREE.Texture
    const texEmissiveMap = mat.emissiveMap as THREE.Texture


    const vUvScreen = varying(vec2(0,0))
    
    mat.positionNode = Fn(() => {
      const ndc = cameraProjectionMatrix.mul(modelViewMatrix.mul(vec4(positionLocal, 1)));
      ndc.assign(ndc.div(ndc.w));
      const uvScreen = ndc.xy.add(1).div(2);

      vUvScreen.assign(uvScreen)


      const tailMixer = texture(tailTex, uvScreen).r

      const pos = positionLocal
      pos.z.mulAssign(mix(.1, 2, tailMixer))
      return pos
    })();

    mat.colorNode = Fn(() => {
      const colBase = vec3(1)
      const colMap = texture(texMap, uv())
      const colEmi = texture(texEmissiveMap, uv())
      
      const tailMixer = texture(tailTex, vUvScreen).r

      // return mix(uniforms.uColStart, uniforms.uColEnd, tailMixer)

      const c = palette(tailMixer, vec3(0.5, 0.5, 0.5),vec3(0.5, 0.5, 0.5),vec3(1.0, 1.0, 1.0),vec3(0.30, 0.20, 0.20))
      // return c;
      return mix(vec3(2), c, tailMixer.mul(2))


      // const lv0 = colEmi.b
      // const lv1 = colEmi.g
      // const lv2 = colEmi.r
      // const lv3 = colMap.b
      // const lv4 = colMap.g
      // const lv5 = colMap.r
      // let final = lv0
      // final = mix(final, lv1, smoothstep(0., .2, tailMixer))
      // final = mix(final, lv2, smoothstep(.2, .4, tailMixer))
      // final = mix(final, lv3, smoothstep(.4, .6, tailMixer))
      // final = mix(final, lv4, smoothstep(.6, .8, tailMixer))
      // final = mix(final, lv5, smoothstep(.8, 1., tailMixer))
      // return vec4(vec3(final), 1)
    })()
  });

  useFrame(() => {
    tailCanvas.draw(mousePos);
    tailTex.needsUpdate = true
  });

  return (
    <group key={Math.random()}>
      <mesh geometry={nodes.bird_01.geometry} material={materials["mat-bird"]} />
      <mesh geometry={nodes.bird_01001.geometry} material={materials["mat-bird"]} position={[13.249, -19.966, 0]} />
      <mesh geometry={nodes.bird_01002.geometry} material={materials["mat-bird"]} position={[-13.261, -39.989, 0]} />
      <mesh geometry={nodes.deer_01.geometry} material={materials["mat-deer"]} position={[-0.146, -9.818, 0]} />
      <mesh geometry={nodes.deer_01001.geometry} material={materials["mat-deer"]} position={[13.1, 0.167, 0]} />
      <mesh geometry={nodes.deer_01002.geometry} material={materials["mat-deer"]} position={[13.1, -29.841, 0]} />
      <mesh geometry={nodes.deer_01003.geometry} material={materials["mat-deer"]} position={[-13.406, -49.872, 0]} />
      <mesh geometry={nodes.dragonflies_01.geometry} material={materials["mat-dragonflies"]} position={[0, -20.038, 0]} />
      <mesh geometry={nodes.dragonflies_01001.geometry} material={materials["mat-dragonflies"]} position={[-13.248, -10.056, 0]} />
      <mesh geometry={nodes.dragonflies_01002.geometry} material={materials["mat-dragonflies"]} position={[13.243, -40.065, 0]} />
      <mesh geometry={nodes.frog_01.geometry} material={materials["mat-frog"]} position={[0.033, -49.628, 0]} />
      <mesh geometry={nodes.frog_01001.geometry} material={materials["mat-frog"]} position={[-12.126, 0.27, 0]} />
      <mesh geometry={nodes.frog_01002.geometry} material={materials["mat-frog"]} position={[-13.223, -29.654, 0]} />
      <mesh geometry={nodes.peacock_01001.geometry} material={materials["mat-peacock"]} position={[13.292, -10.341, 0]} />
      <mesh geometry={nodes.peacock_01002.geometry} material={materials["mat-peacock"]} position={[13.289, -50.34, 0]} />
      <mesh geometry={nodes.peacock_v02.geometry} material={materials["mat-peacock"]} position={[0.035, -40.353, 0]} />
      <mesh geometry={nodes.squirrel_01.geometry} material={materials["mat-squirrel"]} position={[0.036, -30.01, 0]} />
      <mesh geometry={nodes.squirrel_01001.geometry} material={materials["mat-squirrel"]} position={[-13.209, -19.969, 0]} />
    </group>
  );
}

export default function App() {
  return (
    <div className="h-screen">
      <Canvas
        camera={{ position: [0, 0, 10] }}
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props as any);
          await renderer.init();
          return renderer;
        }}
      >
        <ambientLight />
        <directionalLight position={[5, 10, 0]} intensity={2} />
        <axesHelper args={[10]} />
        <OrbitControls />
        <Suspense fallback={null}>
          <Base />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
