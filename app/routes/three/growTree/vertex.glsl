uniform sampler2D posTex;

attribute vec2 pCoord;
varying vec3 vCol;

void main(){
  
  vec3 p = texture(posTex, pCoord).xyz;

  vCol = sin(vec3(3,2,1)+p*4.)*.5+.5;
  csm_Position = p;
}
