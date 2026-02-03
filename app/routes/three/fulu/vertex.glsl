#pragma glslify: snoise = require('glsl-noise/simplex/3d')


uniform float uTime;
uniform float uDelta;

attribute float ndx;

varying vec2 vUv;
varying float vNdx;


void main(){
  float t = uTime;
  vUv = uv;
  vNdx = ndx;

  vec3 p = csm_Position;
  p.z += snoise(vec3(p.xy*2., ndx + t)) * .1 ;
  csm_Position = p;
}