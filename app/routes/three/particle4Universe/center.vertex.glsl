#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')


#define PI 3.1415926
#define s1(v) (sin(v)*.5+.5)

uniform float size;
uniform float uTime;
uniform float uDelta;

attribute float aLife;


varying float vAlpha;
varying vec3 vCol;

void main(){
  vec3 pos = position;
  pos.y += fract(uTime * aLife) * 20.;

  float life = fract(aLife+uTime*.1);


  vec4 worldPos = modelMatrix * vec4(pos, 1.);
  vec4 viewPos = viewMatrix * worldPos;
  vec4 projectionPos = projectionMatrix * viewPos;

  // vCol = sin(vec3(3,2,1)+dot(pos,vec3(2.)))*.5+.5;
  vCol = vec3(1,1,1.);
  float n = smoothstep(0.,1.,snoise3(pos));
  vCol.b += n*4.;

  gl_PointSize = size * (1. / -viewPos.z);
  gl_Position = projectionPos;
}