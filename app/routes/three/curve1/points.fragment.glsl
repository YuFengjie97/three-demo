

varying vec3 vCol;


void main(){
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv-.5);
  d = smoothstep(.5,.3,d);
  csm_FragColor = vec4(vCol*d*10., 1.);
}