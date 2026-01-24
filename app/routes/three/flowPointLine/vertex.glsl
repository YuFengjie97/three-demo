uniform sampler2D uTexPos;
uniform sampler2D uTexVel;

attribute vec2 aTexCoord;
varying vec2 vTexCoord;
varying vec3 vPos;

void main(){
  vec3 pos = texture(uTexPos, aTexCoord).xyz;
  csm_Position.xyz = pos;

  vPos = pos;

  vTexCoord = aTexCoord;

}