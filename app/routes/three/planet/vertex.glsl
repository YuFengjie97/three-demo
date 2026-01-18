#pragma glslify: snoise4 = require('glsl-noise/simplex/4d')


#define T uTime
#define S smoothstep


uniform float uTime;
uniform float uDelta;
uniform vec3 uColLand;
uniform vec3 uColSea;
uniform vec3 uColGrass;

uniform float uLandVal;
uniform float uLandHeight;

uniform float uEvolution;


attribute vec4 tangent;

varying vec3 vCol;


float fbm(vec4 p){
  float fre = 1.;
  float amp = 1.;
  float v = 0.;
  for(float i=0.;i<4.;i++){
    v += snoise4(p * fre) * amp;
    fre *= 2.;
    amp *= .5;
  }
  return v;
}


float morph(inout vec3 p, float t){
  // float v = snoise4(vec4(p*4., t));
  float v = fbm(vec4(p*2., t));
  float v_land =  S(uLandVal, uLandVal + .01,v);
  float v_grass = S(uLandVal+.2,uLandVal+.21,v);
  float v_snow = S(uLandVal+.4,uLandVal+.41,v);

  vec3 col_sea = vec3(0,0,1);
  vec3 col_land = vec3(1,1,0);
  vCol = mix(uColLand, uColSea, v_land);

  vCol = mix( vCol, uColGrass, v_grass);
  vCol = mix( vCol, vec3(1), v_snow);
  


  p += csm_Normal * v_land * uLandHeight + .04*v *v_land;
  return v;
}

vec3 calcNormal(inout vec3 pos){
  float e = 0.01;

  vec3 biTangent = normalize(cross(csm_Normal, tangent.xyz));

  vec3 posA = pos + tangent.xyz * e;
  vec3 posB = pos + biTangent * e;

  float t = uEvolution > .5 ? T*.1 : 1. ;
  morph(posA, t);
  morph(posB, t);
  morph(pos,  t);



  vec3 toA = posA - pos;
  vec3 toB = posB - pos;

  return normalize(cross(toA, toB));
}

void main(){
  vec3 pos = csm_Position;

  csm_Normal = calcNormal(pos);

  csm_Position = pos;

}