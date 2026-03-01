varying vec3 vCol;


void main(){
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv-.5);
  d = smoothstep(.2,0., d-.3);
  csm_FragColor = vec4(vCol*d, .5);
}