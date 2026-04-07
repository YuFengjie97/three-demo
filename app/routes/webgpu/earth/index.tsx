import { OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { Suspense, useMemo } from "react";
import { abs, asin, atan, cross, float, Fn, fract, fwidth, hash, If, instancedArray, instanceIndex, length, mat3, max, min, mx_noise_float, normalLocal, oneMinus, PI, positionLocal, pow, pow3, rotateUV, select, smoothstep, step, texture, time, TWO_PI, uniform, uv, vec2, vec3, vec4 } from "three/tsl";
import * as THREE from "three/webgpu";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { asset } from "~/utils/asset";
import { getFibonacciSphere } from "~/utils/math";
import { getSphereUV, lookAt, sdBox, sdCircle, sdEquilateralTriangle, sdRoundedX, sin3 } from "~/utils/tsl";

function Ball({baseRadius}:{baseRadius: number}) {
  const texMap = useTexture(asset("/img/texture/matcap/2A2A2A_B3B3B3_6D6D6D_848C8C.png"));

  const uniforms = useMemo(() => {
    return {
      uCol: uniform(new THREE.Color(0x7ab3ff)),
    };
  }, []);
  useControls({
    uCol: {
      value: uniforms.uCol.value.getStyle(),
      onChange(v) {
        uniforms.uCol.value = new THREE.Color(v);
      },
    },
  });

  const { mat } = useMemo(() => {
    const mat = new THREE.MeshMatcapNodeMaterial();
    mat.colorNode = Fn(() => {return uniforms.uCol})()
    mat.matcap = texMap
    return { mat };
  }, []);

  return (
    <mesh material={mat}>
      <sphereGeometry args={[baseRadius, 64, 32]} />
      {/* <torusKnotGeometry /> */}
    </mesh>
  );
}

function Dots({baseRadius}:{baseRadius: number}) {
  const count = 20000;
  

  const earthMap = useTexture(asset("/img/texture/earth_2k/2k_earth_specular_map.jpg"));

  const { mat } = useMemo(() => {
    const instancePos = getFibonacciSphere(count, baseRadius);

    const positionBuffer = instancedArray(instancePos, "vec3");

    const getPosition = Fn(() => {
      const pos = positionBuffer.element(instanceIndex);

      const rotMat = lookAt(vec3(0).sub(pos).normalize());

      return rotMat.mul(positionLocal).add(pos);
    });

    const getSdf = Fn(([ha]: [THREE.Node<'float'>]) => {
      let sdf = float(0).toVar()
      const uv2 = uv().sub(.5)
      If(ha.greaterThan(.75), () => sdf.assign(sdCircle(uv2, float(.4))))
      .ElseIf(ha.greaterThan(.5), () => sdf.assign(sdBox(uv2, vec2(.4))))
      .ElseIf(ha.greaterThan(.25), () => sdf.assign(sdRoundedX(uv2, .8, .02)))
      .Else(() => sdf.assign(sdEquilateralTriangle(uv2, float(.4))))
      return sdf
    })

    const getColor = Fn(() => {
      /**
       * 球面坐标转uv坐标，然后通过地图map对dot取样（展示与否）
       */
      const pos = positionBuffer.element(instanceIndex);
      const sphereUv = getSphereUV(pos);
      let dMap = texture(earthMap, sphereUv).r;
      dMap = oneMinus(step(0.1, dMap));

      // const ha = hash(float(instanceIndex).mul(11.33))
      const ha = mx_noise_float(float(instanceIndex).mul(11.33).add(time))
      let d = getSdf(ha)
      d.assign(smoothstep(0.1, 0, d));
      const col = sin3(vec3(3,2,1).add(ha.mul(4.))).mul(.5).add(.5)
      return vec4(col.mul(dMap), d.mul(dMap));
    });

    const mat = new THREE.MeshBasicNodeMaterial();
    mat.positionNode = getPosition();
    mat.colorNode = getColor();
    // mat.side = THREE.DoubleSide;
    mat.transparent = true;
    mat.depthWrite = false;
    return { mat };
  }, [baseRadius]);
  return (
    // @ts-ignore
    <instancedMesh args={[undefined, mat, count]}>
      <planeGeometry args={[0.2, 0.2]} />
    </instancedMesh>
  );
}

function Base() {
  const baseRadius = 10
  const {camera} = useThree()
  camera.position.set(0,0,15)
  return (
    <>
      <Ball baseRadius={baseRadius}/>
      <Dots baseRadius={baseRadius}/>
    </>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      {/* <ambientLight intensity={1}/> */}
      {/* <directionalLight position={[0, 0, 20]} intensity={1.1} /> */}
      {/* <axesHelper args={[20]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
      </Suspense>
    </WebGPUCanvas>
  );
}
