import { Fn, sin, vec3, tan } from "three/tsl";
import type { Node } from "three/webgpu";

export const sin3 = Fn(([v]: [Node<'vec3'>]) => {
  return vec3(sin(v.x), sin(v.y), sin(v.z))
})
