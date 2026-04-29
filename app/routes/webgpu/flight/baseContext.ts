import { createContext } from "react";
import { Pane } from "tweakpane";
import type { AudioAnalyser } from "~/utils/AudioAnalyser";
import * as THREE from 'three/webgpu'
import { uniform, vec3 } from "three/tsl";

const BaseContext = createContext<{
  pane: Pane | null
  colSeed: THREE.UniformNode<"vec3", THREE.Vector3>
}>({ pane: null, colSeed: uniform(vec3(3, 2, 1)) })

export default BaseContext
