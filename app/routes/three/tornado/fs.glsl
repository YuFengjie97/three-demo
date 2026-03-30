uniform sampler2D uTex;
uniform float uTime;
uniform vec3 uCol;
uniform float uTexOffsetSpeed;

varying vec2 vUv;
varying vec3 vNormal2;
varying vec3 vPos;

void main(){

  // float d = sin(vUv.x*10.);

  vec2 uv = vUv;
  // vec2 uv = fract(vPos.xy*.1);
  uv.y *= .4;
  uv.y -= uTime*uTexOffsetSpeed;
  uv.y = fract(uv.y);
  uv.x = fract(uv.x);
  
  float d = 1.-texture(uTex, uv).r;
  d *= smoothstep(1.,.8,vUv.y);
  d *= smoothstep(0.,.1,vUv.y);
  // d = smoothstep(.4,.0,d);
  float side = 1.-abs(vNormal2.y);

  csm_FragColor = vec4(uCol*d*3., side*d);
}