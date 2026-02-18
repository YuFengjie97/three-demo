#pragma glslify: snoise4 = require('glsl-noise/simplex/4d')


uniform float uTime;
uniform float uDelta;
uniform vec3 uColor;

varying vec3 vCol;


void main(){
  float t = uTime;


  vec3 p = csm_Position;
  // float life = atan(sin(t)*4.);
  // p += cos(p.zxy*3.+life*2.+t*3.)*.2;
  // p += cos(p.zxy*3.*2.+t)*.1;
  // p += cos(p.zxy*3.*4.+t)*.05;

  p += normal * snoise4(vec4(p*1.4,t))*.4;

  vCol = uColor;

  csm_Position = p;
}
