#pragma glslify: snoise4 = require('glsl-noise/simplex/4d')


uniform float uTime;
uniform float uDelta;
uniform vec3 uColor;

varying vec3 vCol;
varying float vAlpha;
varying float vFresnel;

void main(){
  float t = uTime;
  vec3 p = csm_Position;
  vec3 nor = normalize(p);

  float strength = snoise4(vec4(p*.8, t));

  p += nor * strength*.06;

  vCol = uColor;
  vAlpha = snoise4(vec4((p*.2), t*.2));

  vec3 rd = normalize(p - cameraPosition);
  vFresnel = pow(1.-max(0.,dot(-rd, normalize(p))), 3.)*1.3;
  vAlpha *= vFresnel;

  csm_Position = p;
}
