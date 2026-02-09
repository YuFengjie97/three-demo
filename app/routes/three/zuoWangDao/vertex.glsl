#define s1(v) (sin(v)*.5+.5)
#pragma glslify: snoise = require('glsl-noise/simplex/3d')


uniform float uTime;
uniform float uDelta;

attribute float aTextId;

varying vec3 vCol;
varying vec2 vUv;
varying float vTextId;
varying float vLife;

// https://www.shadertoy.com/view/lsKcDD
mat3 lookAt( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);            // 相机前
	vec3 cp = vec3(sin(cr), cos(cr),0.0);  // 滚角
	vec3 cu = normalize( cross(cw,cp) );   // 相机右
	vec3 cv = normalize( cross(cu,cw) );   // 相机上
  return mat3( -cu, cv, cw );
}

void main(){
  float t = uTime;
  vec3 pos = csm_Position;
  // pos = lookAt(pos, cameraPosition, 0.) * pos;

  pos.z += snoise(vec3(pos.xy*2., aTextId+t))*.3;

  float lifeSpeed = (.1+s1(aTextId)*.2);
  float life = fract(t*lifeSpeed);
  float offsetRange = 15.;
  pos.z += life * offsetRange;
  
  csm_Position = pos;

  vCol = vec3(s1(aTextId*.2),.0,.0);
  // vCol = s1(vec3(3,2,1)+aTextId);

  vUv = uv;
  vTextId = aTextId;
  vLife = life;
}