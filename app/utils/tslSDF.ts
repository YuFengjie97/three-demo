import { Fn, sin, vec3, tan, cos, PI, clamp, float, length, acos, mx_atan2, pow, cross, mat3, atan, vec2, asin, TWO_PI, sqrt, step, mix, mx_noise_vec3, vec4, triNoise3D, abs, max, min } from "three/tsl";
import type { Node } from "three/webgpu";


export const sdBoxFrame = Fn(([p, b, e]: [Node<'vec3'>, Node<'vec3'>, Node<'float'>]) => {
  // p = abs(p) - b;
  const p1 = abs(p).sub(b).toVar();
  
  // q = abs(p + e) - e;
  const q = abs(p1.add(e)).sub(e).toVar();

  // Helper function to replicate: length(max(v, 0.0)) + min(max(v.x, max(v.y, v.z)), 0.0)
  const sdfComponent = (v) => {
    return length(max(v, 0.0)).add(min(max(v.x, max(v.y, v.z)), 0.0));
  };

  // 三个分量的组合计算
  const res1 = sdfComponent(vec3(p1.x, q.y, q.z));
  const res2 = sdfComponent(vec3(q.x, p1.y, q.z));
  const res3 = sdfComponent(vec3(q.x, q.y, p1.z));

  return min(min(res1, res2), res3);
});