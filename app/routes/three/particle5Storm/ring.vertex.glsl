#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')


#define PI 3.1415926

uniform float uTime;
uniform float size;
uniform sampler2D gpuPos;

attribute vec2 pCoord;

varying float vAlpha;
varying vec3 vCol;
varying float vFade;

void main(){
  vec4 particle = texture(gpuPos, pCoord);
  vec3 pos = particle.xyz;
  float life = particle.w;

  // life fade in out
  float fade = smoothstep(0.,.5,life) * smoothstep(1.,.6,life);
  vFade = fade;

  vec4 worldPos = modelMatrix * vec4(pos, 1.);
  vec4 viewPos = viewMatrix * worldPos;
  vec4 projectionPos = projectionMatrix * viewPos;

  vCol = sin(vec3(3,2,1)+vec3(0,uTime,0)+dot(pos,vec3(.1)))*.5+.5;
  // vCol = vec3(1,1,1.);
  // float n = smoothstep(0.,1.,snoise3(pos+vec3(uTime)));
  // vCol.b += n*2.;

  gl_PointSize = size * (1. / -viewPos.z);
  // gl_PointSize = fade * size * (1. / -viewPos.z);
  gl_Position = projectionPos;
}