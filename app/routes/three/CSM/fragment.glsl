uniform float uTime;
uniform float uDelta;

void main(){
  float t = uTime;

  vec3 col = vec3(0);
  col = sin(vec3(3,2,1) + t);

  csm_DiffuseColor = vec4(col, 1);
}