
varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord;
  float d = length(uv-.5);
  d = smoothstep(.06,0.,d-.1);
  // d = pow(.1/d,2.);

  csm_FragColor = vec4(vCol*d*3., d);
}
