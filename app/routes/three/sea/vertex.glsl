#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')
#define T uTime

uniform float uTime;
uniform vec3 uDepthCol;
uniform vec3 uSurfaceCol;

attribute vec4 tangent;

varying vec3 vCol;



float fbm(vec2 p, float t){
  float v = 0.;
  float fre = 1.;
  float amp = 1.;
  for(float i=0.;i<5.;i++){
    v += snoise3(vec3(p * fre, t)) * amp;
    fre *= 2.;
    amp *= .3;
  }
  return v;
}

float wave(inout vec3 p){

  float t = T * .5;

  // vec2 q = vec2(
  //   fbm(p.xy * .1, 1.1),
  //   fbm(p.xy * .1, 2.2)
  // );

  float v = fbm(p.xy*.25, t); 

  p.z += v*.3;
  return v;
}

vec3 calcNormal(inout vec3 pos){
  float e = .01;
  vec3 bi_tangent = normalize(cross(csm_Normal, tangent.xyz));
  vec3 posA = pos + tangent.xyz * e;
  vec3 posB = pos + bi_tangent * e;

  wave(pos);
  wave(posA);
  wave(posB);

  vec3 toA = posA - pos;
  vec3 toB = posB - pos;

  vec3 normal = normalize(cross(toA, toB));
  return normal;
}



void main(){
  vec3 pos = csm_Position.xyz;

  float v = wave(pos);

  vCol = mix(uSurfaceCol, uDepthCol, smoothstep(1.,-1.,v));


  csm_Normal = calcNormal(pos);
  csm_Position.xyz = pos;
}