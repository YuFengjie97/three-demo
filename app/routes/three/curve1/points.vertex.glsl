

attribute float ndx;
attribute float life;

varying vec3 vCol;


void main(){
  vec3 p = csm_Position;
  vCol = sin(vec3(3,2,1) + ndx)*.5+.5;
}