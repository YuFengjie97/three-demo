import { OrbitControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three/webgpu";
import { Fn, sin, dot, smoothstep, length, time, vec3, vec4, instanceIndex, instancedArray, uniform, mx_noise_vec3, positionGeometry, cameraProjectionMatrix, modelViewMatrix, float, positionLocal, texture, mix, varying, vec2, oneMinus, uv, hash, deltaTime, If, fract, rotate, rotateUV, billboarding, distance, max, select } from "three/tsl";
import { useControls } from "leva";
import { asset } from "~/utils/asset";
import { palette } from "~/utils/tsl";
import WebGPUCanvas from "~/components/WebGpuCanvas";

function Base() {
  const count = 2000;

  // const tex = useTexture(asset("/img/texture/particle/fire_02.png"));
  const tex = useTexture(asset("/img/texture/particle/smoke_08.png"));
  const uniforms = useMemo(() => {
    return {
      uTex: tex,
      uSpeed: uniform(6),
      uDeathSpeed: uniform(0.7),
      uColor: uniform(new THREE.Color(0xff0000)),
      uNoiseScale: uniform(2),
    };
  }, [tex]);
  useControls({
    uSpeed: {
      value: uniforms.uSpeed.value,
      min: 0,
      max: 20,
      step: 0.01,
      onChange(v) {
        uniforms.uSpeed.value = v;
      },
    },
    uDeathSpeed: {
      value: uniforms.uDeathSpeed.value,
      min: 0,
      max: 2,
      step: 0.01,
      onChange(v) {
        uniforms.uDeathSpeed.value = v;
      },
    },
    uColor: {
      value: uniforms.uColor.value.getStyle(),
      onChange(v) {
        uniforms.uColor.value = new THREE.Color(v);
      },
    },
    uNoiseScale: {
      value: uniforms.uNoiseScale.value,
      min: 0.01,
      max: 5,
      step: 0.01,
      onChange(v) {
        uniforms.uNoiseScale.value = v;
      },
    },
  });

  const { mat, computeUpdate } = useMemo(() => {
    const mat = new THREE.SpriteNodeMaterial();
    const posBuffer = instancedArray(new Float32Array(count * 3), "vec3");
    const velBuffer = instancedArray(count, "vec3");
    const lifeInital = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      const i2 = i * 2;
      lifeInital[i2] = Math.random();
      lifeInital[i2 + 1] = Math.random();
    }
    const lifeBuffer = instancedArray(lifeInital, "vec2"); // life,lifeSpeed

    const getPosition = Fn(() => {
      const pos = positionLocal.toVar();
      const posBuf = posBuffer.element(instanceIndex);
      pos.addAssign(posBuf);

      // 边缘粒子缩小
      const toCenter = distance(posBuf, vec3(0, posBuf.y, 0));
      // const toCenter = length(posBuf);
      const scale = float(1).div(toCenter.add(1));

      return pos.mul(scale);
    });
    const computeUpdate = Fn(() => {
      const pos = posBuffer.element(instanceIndex);
      const vel = velBuffer.element(instanceIndex);
      const life = lifeBuffer.element(instanceIndex);
      const lifeTime = life.x;
      const lifeSpeed = life.y;

      const s = uniforms.uNoiseScale;
      const acc = mx_noise_vec3(pos.mul(vec3(s)).add(time.mul(.1),lifeSpeed,instanceIndex.toFloat()));
      // vel.assign(mix(vel, acc, 0.8).normalize());
      vel.assign(acc)
      const velUp = vec3(0, 1, 0);
      vel.assign(mix(vel, velUp, 0.6));
      pos.addAssign(vel.mul(uniforms.uSpeed).mul(deltaTime));

      lifeTime.addAssign(deltaTime.mul(uniforms.uDeathSpeed));
      If(lifeTime.greaterThan(1), () => {
        lifeTime.assign(fract(lifeTime));
        lifeSpeed.assign(hash(time.add(float(instanceIndex))));
        pos.assign(vec3(0, 0, 0));
      });
      life.assign(vec2(lifeTime, lifeSpeed));
    })().compute(count);

    const getColor = Fn(() => {
      const uv2 = rotateUV(uv(), time.mul(2), vec2(0.5, 0.5));
      const d = texture(uniforms.uTex, uv2).r;
      const col = uniforms.uColor.mul(d);

      const lifeTime = lifeBuffer.element(instanceIndex).x;
      const fade = smoothstep(0, 0.1, lifeTime).mul(smoothstep(1, 0.8, lifeTime));

      return vec4(col, fade.mul(d));
    });

    mat.colorNode = getColor();
    mat.positionNode = getPosition();
    mat.transparent = true;
    mat.depthWrite = false;
    mat.blending = THREE.AdditiveBlending;
    mat.vertexNode = billboarding();

    return { mat, computeUpdate };
  }, [count]);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(computeUpdate);
  });

  return (
    // @ts-ignore
    <instancedMesh args={[undefined, mat, count]}>
      <planeGeometry args={[0.4, 0.4]} />
    </instancedMesh>
  );
}

export default function App() {
  return (
    <WebGPUCanvas>
      {/* <ambientLight /> */}
      {/* <directionalLight position={[5, 10, 0]} intensity={2} /> */}
      <axesHelper args={[10]} />
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
      </Suspense>
    </WebGPUCanvas>
  );
}
