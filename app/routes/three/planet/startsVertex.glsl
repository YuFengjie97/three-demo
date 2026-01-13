#pragma glslify: snoise4 = require('glsl-noise/simplex/4d')



uniform float uTime;


varying vec3 vCol;

float hash13(vec3 p3)
{
	p3  = fract(p3 * .1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}


void main(){

  vec3 pos = csm_Position.xyz;


  float n = snoise4(vec4(pos*1.5, .1));
  float n01 = n * .5 + .5;

  float ha = hash13(pos);

  float a = 10. * PI * n01;
  float r = 2. + ha * 1.;
  pos.y = (n) * 4.;

  pos.xz = vec2(cos(a), sin(a)) * r;

  pos += dot(cos(pos.zxy + uTime), vec3(.1));

  vCol = sin(vec3(3,2,1) + uTime * ha * 10. + dot(pos, vec3(1.1)))*.5+.5;

  csm_Position.xyz = pos;
}
