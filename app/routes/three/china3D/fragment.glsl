
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uSideColor;

varying vec2 vUv;
varying vec3 vNormal2;

void main(){
  float t = uTime;


  float side = 1.-abs(vNormal2.z);

  vec3 col = mix(uColor, uSideColor, side);

  float d = abs(sin(vUv.y+uTime));
  d = smoothstep(.1,0.,d);
  col += d*side*uSideColor*4.;


  csm_FragColor.rgb = col;
  csm_FragColor.a = .5;
}