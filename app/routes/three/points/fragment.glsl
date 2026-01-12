

varying vec2 vUv;
varying float vAlpha;

void main(){

  float d = length(gl_PointCoord-.5);
  // d = smoothstep(.1, 0., d-.2);
  d = pow(.1/d, 2.);

  vec3 col = vec3(1,.3,0);
  col *= d;

  csm_FragColor.rgb = col;
  csm_FragColor.a = d * vAlpha;
}