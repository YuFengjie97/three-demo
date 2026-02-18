#pragma glslify: snoise4 = require('glsl-noise/simplex/4d')


uniform float uTime;
uniform float uDelta;
uniform vec3 uColor;

varying vec3 vCol;
varying float vAlpha;
varying float vFresnel;

void main(){
  float t = uTime;
  vec3 p = csm_Position;
  vec3 nor = normalize(p);

  float strength = snoise4(vec4(p, t));

  p += nor * strength*.3;

  vCol = uColor;

  csm_Position = p;
}
