
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main(){
  vUv = uv;
  vPos = position;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);

  vec4 pos = vec4(position, 1.);

  vec4 modelPos = modelMatrix * pos;

  vWorldPos = modelPos.xyz;

  vec4 viewPos = viewMatrix * modelPos;


  gl_Position = projectionMatrix * viewPos;
}
