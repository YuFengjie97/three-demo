import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three/webgpu";
import { Fn, sin, dot, smoothstep, length, time, vec3, vec4, instanceIndex, instancedArray, uniform, mx_noise_vec3, positionGeometry, cameraProjectionMatrix, modelViewMatrix, float, positionLocal, texture, mix, varying, vec2, oneMinus, uv, hash, deltaTime, If, fract, rotate, rotateUV, billboarding, distance, max, select, color, exp, pass, abs, normalLocal, normalGeometry, positionWorld, pow, floor, mod } from "three/tsl";
import { useControls } from "leva";
import { asset } from "~/utils/asset";
import WebGPUCanvas from "~/components/WebGpuCanvas";
import { LineGeometry, MeshSurfaceSampler } from "three/examples/jsm/Addons.js";
import { lookAt, sin3 } from "~/utils/tsl";
import { getFibonacciSphere } from "~/utils/math";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import { useMouseRay } from "~/utils/mouseRay";
import { CharAtlasCanvas } from "~/utils/CharAtlasTexture";
import { useLoadFont } from "~/hook/useLoadFont";

function Skull() {
  const uniforms = useMemo(() => {
    const uniforms = {
      uHitPosition: uniform(new THREE.Vector3(9999,9999,9999)),
      uHitUV: uniform(new THREE.Vector2(9999,9999)),
    };
    return uniforms;
  }, []);
  // 模型
  const { skullGeo, skullMat, skull } = useMemo(() => {
    const { nodes } = useGLTF(asset("/model/skull-transformed.glb"));

    // @ts-ignore
    const skullGeo = nodes.Object_2.geometry as THREE.BufferGeometry;
    skullGeo.scale(2, 2, 2);
    skullGeo.rotateX(-Math.PI / 4);

    const skullMat = new THREE.MeshStandardNodeMaterial();
    // skullMat.transparent = true
    // skullMat.depthWrite = false
    // skullMat.blending = THREE.AdditiveBlending

    const getColor = Fn(() => {
      // const d = length(positionGeometry.sub(uHitPosition))
      let d = length(uv().sub(uniforms.uHitUV));
      // d = abs(sin(d.mul(40).add(time.mul(4))));
      d.assign(pow(float(0.1).div(d), 2));
      return mix(vec3(1, 0, 0), vec3(0, 1, 0), d);
    });

    skullMat.colorNode = getColor();
    skullMat.roughness = 0.1;
    skullMat.metalness = 0.9;

    const skull = new THREE.Mesh(skullGeo, skullMat);
    // skull.rotation.x=-Math.PI/2
    return { skullGeo, skullMat, skull };
  }, []);

  // 清理
  useEffect(() => {
    return () => {
      skullGeo.dispose();
      skullMat.dispose();
    };
  }, []);

  const { rayCaster } = useMouseRay();
  useFrame(() => {
    const intersects = rayCaster.intersectObject(skull);
    if (intersects.length > 0) {
      if (intersects[0].uv) {
        uniforms.uHitUV.value.copy(intersects[0].uv);
      }
      uniforms.uHitPosition.value.copy(intersects[0].point);
    } else {
      // 可选：如果没有击中，把坐标设到很远的地方，让形变恢复
      uniforms.uHitPosition.value.set(9999, 9999, 9999);
      uniforms.uHitUV.value.set(9999, 9999);
    }
  });

  const fontFamily = "subset2-STXinwei";
  const fontUrl = asset("/font/ttf/subset2-STXinwei.ttf");
  const canvasfontLoaded = useLoadFont(fontFamily, fontUrl);
  console.log(canvasfontLoaded);
  
  const charAtlasCanvas = new CharAtlasCanvas("鬼魅神佛惧人活疯骨善恶苦", fontFamily);

  return (
    <>
      <primitive object={skull} />
      {canvasfontLoaded && <Chars uniforms={uniforms} surface={skull} charAtlasCanvas={charAtlasCanvas} />}
    </>
  );
}

function Chars({ uniforms, surface, charAtlasCanvas }) {
  const { charTex, charTexGridSize } = useMemo(() => {
    const charTex = new THREE.CanvasTexture(charAtlasCanvas.canvas);
    charTex.colorSpace = THREE.SRGBColorSpace;
    charTex.minFilter = THREE.LinearFilter;
    const charTexGridSize = charAtlasCanvas.gridSize;
    return { charTex, charTexGridSize };
  }, []);

  const sampleCount = 4000;
  const uniforms2 = useMemo(
    () => ({
      uHitEffectRange: uniform(1.5),
      uSpeed: uniform(10),
    }),
    [],
  );
  useControls({
    uHitEffectRange: {
      value: uniforms2.uHitEffectRange.value,
      min: 0.01,
      max: 3,
      step: 0.01,
      onChange(v) {
        uniforms2.uHitEffectRange.value = v;
      },
    },
    uSpeed: {
      value: uniforms2.uSpeed.value,
      min: 0.01,
      max: 30,
      step: 0.01,
      onChange(v) {
        uniforms2.uSpeed.value = v;
      },
    },
  });
  const { getPosition, posUpdate, getColor } = useMemo(() => {
    // 取样
    const sampler = new MeshSurfaceSampler(surface).build();
    // const sampler = new MeshSurfaceSampler(skull).setWeightAttribute("uv").build();
    const tarPos = new THREE.Vector3();
    const tarNor = new THREE.Vector3();
    const positionArr = new Float32Array(sampleCount * 3); // 取样位置
    const normalArr = new Float32Array(sampleCount * 3); // 取样位置的法线
    for (let i = 0; i < sampleCount; i++) {
      sampler.sample(tarPos, tarNor);
      const i3 = i * 3;
      positionArr[i3 + 0] = tarPos.x;
      positionArr[i3 + 1] = tarPos.y;
      positionArr[i3 + 2] = tarPos.z;

      normalArr[i3 + 0] = tarNor.x;
      normalArr[i3 + 1] = tarNor.y;
      normalArr[i3 + 2] = tarNor.z;
    }

    const posBuffer = instancedArray(positionArr, "vec3"); // 实时更新的位置
    const posOriginalBuffer = instancedArray(positionArr, "vec3"); // 保存的原来的位置
    const normalBuffer = instancedArray(normalArr, "vec3"); // 当前位置的法线

    const getPosition = Fn(() => {
      const posOffset = posBuffer.element(instanceIndex).toVar();
      const dir = normalBuffer.element(instanceIndex).toVar();

      const rotMat = lookAt(dir);
      return rotMat
        .mul(positionLocal) // 旋转朝向法线方向
        .add(posOffset) // 位移到取样位置
        .add(dir.mul(0.02)); // 稍微偏移防止z-fight破面
    });

    const getColor = Fn(() => {
      const gridSize = float(charTexGridSize);
      const id = float(instanceIndex);

      const totalCells = gridSize.mul(gridSize);
      const ha = mod(id, totalCells);

      const x = mod(ha, gridSize);
      const y = floor(ha.div(gridSize));

      const offset = vec2(x, y).div(gridSize);
      const uv2 = uv().div(gridSize).add(offset);
      uv2.x = oneMinus(uv2.x);

      const tex = texture(charTex, uv2).r;
      // const col = vec3(0, 1, 0);
      const col = sin3(vec3(3, 2, 1).add(positionLocal.mul(0.1)).add(id.mul(0.1)).add(time.mul(4)))
        .mul(0.5)
        .add(0.5);

      return vec4(col.mul(tex), tex);
    });

    const posUpdate = Fn(() => {
      const pos = posBuffer.element(instanceIndex).toVar();
      const posOrg = posOriginalBuffer.element(instanceIndex).toVar();
      const dir = normalBuffer.element(instanceIndex).toVar();

      // 击中位置的排斥
      const range = uniforms2.uHitEffectRange;
      const distHit = length(pos.sub(uniforms.uHitPosition));
      const strength = smoothstep(range, 0, distHit);
      const posTar = posOrg.add(dir.mul(strength));

      const lerpFactor = deltaTime.mul(uniforms2.uSpeed);
      pos.assign(mix(pos, posTar, lerpFactor));

      posBuffer.element(instanceIndex).assign(pos);
    })().compute(sampleCount);

    return { getPosition, posUpdate, getColor };
  }, [sampleCount]);

  const { gl } = useThree();
  const renderer = gl as unknown as THREE.WebGPURenderer;
  useFrame(() => {
    renderer.compute(posUpdate);
  });

  return (
    <instancedMesh args={[undefined, undefined, sampleCount]}>
      <planeGeometry args={[0.4, 0.4]} />
      <meshBasicNodeMaterial transparent={true} depthWrite={false} colorNode={getColor()} positionNode={getPosition()} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function Base() {
  return <Skull />;
}

export default function App() {
  return (
    <WebGPUCanvas>
      <ambientLight />
      <directionalLight position={[5, 10, 0]} intensity={10} />
      {/* <axesHelper args={[10]} /> */}
      <OrbitControls />
      <Suspense fallback={null}>
        <Base />
      </Suspense>
    </WebGPUCanvas>
  );
}
