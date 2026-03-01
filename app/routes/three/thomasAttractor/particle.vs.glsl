uniform sampler2D posTex;
uniform float uTime;

attribute vec2 pCoord;

varying vec3 vCol;

void main(){
  vec4 particle = texture(posTex, pCoord);
  vec3 pos = particle.xyz;
  float seed = particle.w;

  vCol = sin(vec3(3,2,1) + seed + pos+uTime)*.5+.5;

  csm_Position = pos;
}
