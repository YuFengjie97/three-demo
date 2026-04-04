import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree, type ThreeToJSXElements } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three/webgpu";
import { Fn, sin, dot, pass, time, vec3, vec4, mx_rotate3d, instanceIndex, instancedArray, uniform, mx_noise_vec3, positionGeometry, cameraProjectionMatrix, modelViewMatrix, float, positionLocal, abs, step, select, cross, mat3, mul, rotate, TWO_PI } from "three/tsl";
import { useControls } from "leva";
import { s1, sin3 } from "~/utils/tsl";
import { bloom } from "three/addons/tsl/display/BloomNode.js";

declare module "@react-three/fiber" {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any);

function Base() {
  const count = 1000;
  const positionArr = new Float32Array(count * 3);
  for (let i = 0; i < positionArr.length; i++) {
    const p = (Math.random() - 0.5) * 10;
    positionArr[i] = p;
  }

  const { positionBuffer } = useMemo(() => {
    const positionBuffer = instancedArray(positionArr, "vec3");
    return { positionBuffer };
  }, []);

  const calcPosition = Fn(() => {
    const idx = float(instanceIndex).div(count); // id归一化
    idx.mulAssign(s1(time.mul(0.2)).mul(100).add(50));

    const ang1 = time.mul(0.4).add(idx);
    const ang2 = time.mul(0.8).add(idx.mul(s1(time).mul(0.1)));
    const r1 = 5;
    const r2 = 2.5;
    const pos = vec3(0, 0, 0);
    pos.addAssign(vec3(r1, 0, 0));
    pos.assign(rotate(pos, vec3(0, ang1, ang1)));
    pos.addAssign(vec3(r2, 0, 0));
    pos.assign(rotate(pos, vec3(0, ang2, ang2)));
    return pos;
  });

  const computeUpdate = Fn(() => {
    positionBuffer.element(instanceIndex).assign(calcPosition());
  })().compute(count);

  const getPosition = Fn(() => {
    const pos = positionLocal;
    const posOffset = positionBuffer.element(instanceIndex);
    pos.addAssign(posOffset);
    return pos;
  });

  const getColor = Fn(() => {
    const idx = float(instanceIndex);
    const col = sin3(vec3(3, 2, 1).add(idx.mul(0.2)));
    return vec4(col.mul(2), 1);
  });

  const { gl, scene, camera } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;

  

  // const renderPipeline = new THREE.RenderPipeline(renderer);
  // const scenePass = pass(scene, camera);
  // const scenePassColor = scenePass.getTextureNode("output");
  // const bloomPass = bloom(scenePassColor, 2.75, 1.1, 0.5);
  // renderPipeline.outputNode = scenePassColor.add(bloomPass);

  useFrame(() => {
    renderer.compute(computeUpdate);
    // renderPipeline.render()
  });

  return (
    <instancedMesh args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[0.1, 0]} />
      <meshBasicNodeMaterial
        // positionNode={positionBuffer.toAttribute()}
        positionNode={getPosition()}
        colorNode={getColor()}
        toneMapped={false}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
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
        <pointLight intensity={10} />
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
