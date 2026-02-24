varying vec3 vCol;
varying float vAlpha;

void main(){
  csm_FragColor = vec4(vCol*1., 1.);
}