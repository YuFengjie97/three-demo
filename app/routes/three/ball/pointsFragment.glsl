varying vec3 vCol;
varying float vAlpha;

void main(){
  vec2 uv = gl_PointCoord;
  float d = length(uv-.5);
  d = smoothstep(.01,0.,d-0.1);

  csm_FragColor = vec4(vCol*d, d*vAlpha);
}