#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uDelta;

attribute float life;
attribute float ndx;

varying float vLife;
varying vec3 vCol;

vec3 snoise3x3(vec3 p){
  float t = uTime;
  vec3 v = vec3(
    snoise3(p+vec3(t,0,0)),
    snoise3(p+vec3(0,1,0)),
    snoise3(p+vec3(0,0,1))
  );
  return v;
}



void main(){
  vec4 worldPos = modelMatrix * vec4(position,1.);
  // worldPos.xyz += sin(worldPos.zxy)*.1;
  worldPos.xyz += snoise3x3(worldPos.xyz)*.1;

  vec4 viewPos = viewMatrix * worldPos;
  vec4 projectPos = projectionMatrix * viewPos;

  gl_Position = projectPos;
  gl_PointSize = 80.0 * (1.0 / -viewPos.z);
  // gl_PointSize = 10.;

  vCol = sin(vec3(3,2,1)+ndx)*.5+.5;

  vLife = life;
}