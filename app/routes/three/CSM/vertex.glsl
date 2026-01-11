#pragma glslify: snoise4 = require('glsl-noise/simplex/4d')


#define T uTime

uniform float uTime;
uniform bool uUseNoise4D;

attribute vec4 tangent;

varying vec3 aColor;

vec3 getDistortion(vec3 p){
  

  if(uUseNoise4D) {
    float v = snoise4(vec4(p, T))*.5;
    v += snoise4(vec4(p*2., T)) * .2;
    v += snoise4(vec4(p*4., T)) * .1;
    p += v * normal;
  }else{
    p += (sin(p.zxy*1.*2. + T * 2.))*1.*.3;
    p += (sin(p.zxy*2.*2. - T * 2.))*.5*.3;
    p += (sin(p.zxy*4.*2. + T * 2.))*.2*.3;
  }
  

  return p;
}




void main(){
  float e = .01;

  vec3 pos = csm_Position.xyz;

  vec3 bi_tangent = normalize(cross(csm_Normal, tangent.xyz));
  vec3 posA = pos + tangent.xyz * e;
  vec3 posB = pos + bi_tangent * e;

  pos = getDistortion(pos);
  posA = getDistortion(posA);
  posB = getDistortion(posB);
  
  // 新的切线与副切线
  vec3 toA = normalize(posA - pos);
  vec3 toB = normalize(posB - pos);

  vec3 normal_new = normalize(cross(toA, toB));

  aColor = sin(vec3(3,2,1) + T + dot(cos(pos), vec3(1.1))) * .5 + .5;


  csm_Position.xyz = pos;
  csm_Normal = normal_new;
}