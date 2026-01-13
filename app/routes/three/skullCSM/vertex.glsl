uniform float uTime;
varying vec3 vCol;


void main(){
  vec3 p = csm_Position;

  // p += dot(cos(p*2. + uTime), vec3(2.1))*.1;
  // csm_Position = p;

  vCol = sin(vec3(3,2,1) + uTime * 2. + dot(p, vec3(2.))) * .5 + .5;
}
