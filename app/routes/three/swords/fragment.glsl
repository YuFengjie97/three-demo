
varying vec3 vPos;
varying vec3 vCol;
varying vec2 vUv;

void main(){
  
  vec3 col = vCol;
  // float d = length(vUv);
  // d = .1/d;

  csm_DiffuseColor.rgb = col*1.2;
}