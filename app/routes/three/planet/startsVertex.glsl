
varying vec3 vCol;


void main(){

  vec3 pos = csm_Position.xyz;
  vCol = sin(vec3(3,2,1) + dot(pos, vec3(4.1)));
}
