#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

#define T uTime

uniform float uTime;

varying vec2 vUv;
varying float vAlpha;
varying vec3 vCol;


mat2 rotate(float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c,-s,s,c);
}




void main(){

  vUv = uv;

  vec3 pos = csm_Position.xyz;

  float t = T * 2.;

  pos += dot(cos(pos.zxy*2. + t), vec3(.1));
  pos.xy *= rotate(1.);
  pos += dot(cos(pos.zxy*4. + t), vec3(.1))*.5;
  pos.xz *= rotate(1.);
  pos += dot(cos(pos.zxy*8. + t), vec3(.1))*.25;
  pos.yz *= rotate(1.);


  // vAlpha = step(0.5, snoise3(pos));
  vAlpha = smoothstep(0., 1., snoise3(pos));

  vCol = sin(vec3(3,2,1) + dot(pos, vec3(4.1))) * .5 + .5;


  csm_Position.xyz = pos;
}