#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')



uniform float uTime;
uniform float uDelta;


varying float vLife;

float easeOutCubic(float x) {
  return 1. - pow(1. - x, 3.);
}


void main(){
  float t = uTime * .5;

  vec3 pos_default = csm_Position;  // 模型顶点坐标
  pos_default.z += 1.;              // 模型平移

  vec3 pos_start = pos_default;
  pos_start.z = 0.;
  // vec3 pos_start = vec3(0);


  vec3 pos_end = pos_default;

  float speed = snoise3(pos_default)*.5+.5;  // 粒子随机速度
  float life = fract(t);

  float height_max = life * 2.;             // 由0-1life映射最大高度,模型初始高度为2(经过平移后)
  pos_end.z = min(height_max, pos_end.z);   // 限制此时的最大高度

  float v = snoise3(
    pos_end+t
  )*.5+.5;
  v = max(v, 1.);

  vec3 pos = mix(pos_start, pos_end, v);
  // vec3 pos = pos_default;

  csm_Position = pos;
  vLife = life;
}