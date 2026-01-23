#pragma glslify: snoise = require('glsl-noise/simplex/4d')

#define s1(v) (sin(v)*.5+.5)



uniform sampler2D uFreqTex;
uniform float uTime;


varying vec3 vCol;

void main(){
  float t = uTime;

  vec3 p = csm_Position;

  float ang = atan(p.z,p.x);

  float v = texture(uFreqTex, vec2(sin(ang*2.), 0.)).r;
  vec3 dir = normalize(p);
  p += dir*v;

  vCol = s1(vec3(3,2,1) + v*10.);

  csm_Position = p;
}