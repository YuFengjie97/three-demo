#pragma glslify: snoise = require('glsl-noise/simplex/3d')


uniform float uTime;
uniform float uDelta;

attribute float ndx;

varying vec2 vUv;
varying float vNdx;
varying vec3 vPos;


// https://www.shadertoy.com/view/lsKcDD
mat3 lookAt( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);            // 相机前
	vec3 cp = vec3(sin(cr), cos(cr),0.0);  // 滚角
	vec3 cu = normalize( cross(cw,cp) );   // 相机右
	vec3 cv = normalize( cross(cu,cw) );   // 相机上
  return mat3( cu, cv, cw );
}

void main(){
  float t = uTime;
  vUv = uv;
  vNdx = ndx;

  vec3 p = csm_Position;


  p = lookAt(p, cameraPosition, 0.) * p;

  p.z += snoise(vec3(p.xy*2., ndx + t)) * .1 ;

  p.y += sin(t + ndx*.1) * .2;

  csm_Position = p;
  vPos = csm_Position;
}