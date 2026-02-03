uniform float uTime;
uniform float uDelta;
uniform sampler2D uTex;


varying vec2 vUv;
varying float vNdx;


void main(){
  float t = uTime;
  float d = texture(uTex, vUv).b;

  vec3 col = sin(vec3(3,2,1) + vNdx * 10. + t*1.)*.5+.5;

  csm_FragColor = vec4(col*2., d);
}
