varying float vAlpha;
varying vec3 vCol;


void main(){
  vec2 uv = gl_PointCoord;
  float d = length(uv-.5);
  d = smoothstep(.5,0.4,d);


  gl_FragColor = vec4(vCol*d*1.5,  d);
}