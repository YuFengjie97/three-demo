uniform float uTime;
uniform float uDelta;
uniform sampler2D uTexPos;

attribute vec2 particleCoord;

varying float vLife;
varying vec3 vCol;

void main(){
  float t = uTime;
  vec4 particle = texture(uTexPos, particleCoord).xyzw;
  vec3 pos = particle.xyz;
  float life = particle.w;
  vLife = life;

  vCol = sin(vec3(3,2,1)+pos*2.+t)*.5+.5;

  csm_Position = pos;
}