import { Fn, sin, vec3, tan, cos, PI, float } from "three/tsl";
import type { Node } from "three/webgpu";

export const sin3 = Fn(([v]: [Node<'vec3'>]) => {
  return vec3(sin(v.x), sin(v.y), sin(v.z))
})

export const cos3 = Fn(([v]: [Node<'vec3'>]) => {
  return vec3(cos(v.x), cos(v.y), cos(v.z))
})

export const palette = Fn(([t, a, b, c, d]: [Node<'float'>, Node<'vec3'>, Node<'vec3'>, Node<'vec3'>, Node<'vec3'>]) => {
  return a.add(b.mul(cos3(PI.mul(2).mul(t).mul(c).add(d))))
})