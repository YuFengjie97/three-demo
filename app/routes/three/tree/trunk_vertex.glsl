#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')


uniform float uTime;
uniform float uDelta;

// attribute vec3 normal;

varying vec3 vPos;
varying vec3 vCol;

void main(){
  float t = uTime;
  vec3 p = csm_Position;

  // vec3 vel = vec3(
  //   snoise3(p*.4+vec3(1.,0.,0.)),
  //   snoise3(p*.4+vec3(0.,1.,t)),
  //   snoise3(p*.4+vec3(0.,0.,1.))
  // );
  // p += vel*.2;

  p += sin(p.zxy*2.+vec3(0,2,0)*t)     *.2;
  p += sin(p.zxy*4.)*0.5               *.2;
  p += sin(p.zxy*8.)*0.2               *.2;

  // vCol = sin(vec3(3,2,1)+p-t*.1)*.5+.5;
  vCol = sin(vec3(3,2,1)+normal-t*.1)*.5+.5;

  csm_Position = p;
}
