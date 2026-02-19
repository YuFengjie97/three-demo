varying vec3 vCol;
varying float vAlpha;

void main(){
  // if(vAlpha<.5){
  //   discard;
  // }


  csm_FragColor = vec4(vCol * vAlpha*1.5, vAlpha);
}