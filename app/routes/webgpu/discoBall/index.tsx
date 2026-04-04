import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree, type ThreeToJSXElements } from "@react-three/fiber";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three/webgpu";
import { Fn, sin, dot, time, vec3, vec4, instanceIndex, instancedArray, uniform, mx_noise_vec3, positionGeometry, cameraProjectionMatrix, modelViewMatrix, float, positionLocal, abs, step, select, cross, mat3, mul } from "three/tsl";
import { useControls } from "leva";

declare module "@react-three/fiber" {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any);

function Base() {
  const { count, positionInital } = useMemo(() => {
    // const sphereGeo = new THREE.IcosahedronGeometry(10, 4);
    const sphereGeo = new THREE.SphereGeometry(10, 20, 20);
    const positionAttr = sphereGeo.getAttribute("position");
    const count = positionAttr.count;
    const positionInital = new Float32Array(positionAttr.array);
    sphereGeo.dispose();
    return { count, positionInital };
  }, []);

  const { positionBuffer } = useMemo(() => {
    const positionBuffer = instancedArray(count, "vec3");
    positionBuffer.value.array.set(positionInital);
    return { positionBuffer };
  }, []);

  const computeInit = Fn(() => {})().compute(count);

  const computeUpdate = Fn(() => {})().compute(count);

  const getPosition = Fn(() => {
    const instanceOffset = positionBuffer.element(instanceIndex);
    const dir = instanceOffset.normalize();

    const isPole = step(0.99, abs(dir.y));
    const tempUp = select(isPole.greaterThan(0), vec3(1, 0, 0), vec3(0, 1, 0));
    const right = cross(tempUp, dir).normalize();
    const up = cross(dir, right).normalize();

    const rotationMatrix = mat3(right, up, dir);
    const pos = rotationMatrix.mul(positionLocal).add(instanceOffset);
    return pos;
  });

  const getColor = Fn(() => {
    return vec3(1, 0, 0);
  });

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  renderer.compute(computeInit);

  useFrame(() => {
    renderer.compute(computeUpdate);
  });

  return (
    <instancedMesh args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 0.2]} />
      <meshBasicNodeMaterial positionNode={getPosition()} colorNode={getColor()} />
    </instancedMesh>
  );
}

export default function App() {
  return (
    <div className="h-screen">
      <Canvas
        camera={{ position: [0, 17, 20] }}
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props as any);
          await renderer.init();
          return renderer;
        }}
      >
        <ambientLight />
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
