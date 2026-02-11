#pragma glslify: snoise4 = require('glsl-noise/simplex/4d')
#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')
#pragma glslify: snoise2 = require('glsl-noise/simplex/2d')


uniform float uTime;
uniform float uDelta;


//  3 out, 1 in...
vec3 hash31(float p)
{
  vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx+33.33);
  return fract((p3.xxy+p3.yzz)*p3.zyx); 
}
vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy + p3.yxx)*p3.zyx);

}



void main(){
  float t = uTime;
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 particle = texture(texPos, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;

  vec3 vel = vec3(0);
  
  

  life += uDelta * .3;

  // 重置
  if(life>1.){
    life = fract(life);
    pos = vec3(0);
    vel = (hash33(vec3(uv, t))-.5)*20.;
  }else{
    // vel = curlNoise(pos * 1.1 + t);
    const vec3 offset1 = vec3(12.34, 56.78, 90.12);
    const vec3 offset2 = vec3(54.32, 98.76, 21.09);
    const vec3 offset3 = vec3(43.21, 87.65, 10.98);

    vel = vec3(
      snoise3(pos * vec3(1.) + offset1 + t), // X轴噪音
      snoise3(pos * vec3(1.) + offset2 + 0.), // Y轴噪音
      snoise3(pos * vec3(1.) + offset3 + 0.)  // Z轴噪音
    );
    vec3 toYAxes = normalize(vec3(0., pos.y, 0.) - pos);
    vec3 up = vec3(0, 1, 0);
    vec3 rot = cross(up, toYAxes);
    float atten = smoothstep(5.,0.,pos.y);
    vel = normalize(vel + (rot + up) * atten);
  }

  pos += vel*uDelta*2.;

  gl_FragColor = vec4(pos, life);
}