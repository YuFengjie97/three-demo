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

mat3 lookAt2(vec3 origin, vec3 target){
  vec3 fwd = normalize(target - origin);
  vec3 globalUp = vec3(0.0, 1.0, 0.0);
  vec3 right = normalize(cross(globalUp, fwd));
    // 检查长度。如果长度接近0，说明 fwd 和 globalUp 平行（相机在正上方/正下方）
  if (length(right) < 0.0001) {
    // 这种情况下，我们强制使用 Z 轴作为参考向量来重新计算 Right
    // 这样可以避免变为 0 向量
    right = normalize(cross(vec3(0.0, 0.0, 1.0), fwd));
  }
  vec3 up = cross(fwd, right);
  return mat3(right, up, fwd);
}

void main(){
  float t = uTime;
  vUv = uv;
  vNdx = ndx;

  vec3 p = csm_Position;


  p = lookAt(p, cameraPosition, 0.) * p;
  // p = lookAt2(p, cameraPosition) * p;

  p.z += snoise(vec3(p.xy*2., ndx + t)) * .1 ;

  p.y += sin(t + ndx*.1) * .2;

  csm_Position = p;
  vPos = csm_Position;
}