uniform float uUseFSCol;


varying vec3 vCol;

void main(){

  if(uUseFSCol > .5) {
    csm_DiffuseColor = vec4(vCol,1);
  }
}