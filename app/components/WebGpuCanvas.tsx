import { Loader } from "@react-three/drei";
import { Canvas, extend, type ThreeToJSXElements } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three/webgpu";

declare module "@react-three/fiber" {
  interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}
}

extend(THREE as any);

export default function WebGPUCanvas({ children }) {
  return (
    <div className="h-screen overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10] }}
        dpr={[1, 1.5]}
        // @ts-ignore
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props as any);
          await renderer.init();
          return renderer;
        }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
