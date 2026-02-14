uniform float uTime;
uniform float uDelta;
uniform sampler2D uPosTex;

attribute vec2 aParticleCoord;

varying vec3 vCol;
varying float vLife;

void main(){
  float t = uTime;
  vec4 particle = texture(uPosTex, aParticleCoord);
  vec3 pos = particle.xyz;
  float life = particle.w;
  vLife = sin(life*PI);

  csm_Position = pos;
  vCol = sin(vec3(3,2,1)+pos+dot(aParticleCoord,vec2(.1)))*.5+.5;
}
