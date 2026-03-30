uniform float uTime;
uniform float uDelta;
uniform vec2 uMouse;

varying vec2 vUv;


void main(){
  float d = sin(length(vUv-uMouse)*20. - uTime);
  d = .1/abs(d);

  csm_FragColor = vec4(vec3(1,0,0)*d, d);
}