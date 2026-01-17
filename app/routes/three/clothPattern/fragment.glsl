
#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

uniform vec3 uPatternCol;
uniform vec3 uPatternScale;
uniform float uGlow;
uniform float uGrad1;
uniform float uGrad2;

varying vec3 vPos;


void main(){
  vec3 col = csm_DiffuseColor.rgb;

  float pattern = abs(snoise3(vPos*uPatternScale));

  if(uGlow>.5) {
    pattern = pow(.1/pattern,2.);
  }else{
    pattern = smoothstep(uGrad2,uGrad1, abs(pattern));
  }
  // col = mix(col, uPatternCol, pattern);
  col += uPatternCol * pattern;

  csm_DiffuseColor = vec4(col,1);
}