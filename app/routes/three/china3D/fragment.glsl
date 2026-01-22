
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uSideColor;

varying vec2 vUv;
varying vec3 vNormal2;

void main(){
  float t = uTime;


  float d = vUv.y;
  d = sin(d*1.+t*2.);
  d = pow(.2/abs(d), 2.);

  float side = 1.-abs(vNormal2.z);

  d *= side;

  vec3 col = uColor;
  
  col += d * uSideColor;


  csm_FragColor.rgb = col;
  csm_FragColor.a = .8;
}