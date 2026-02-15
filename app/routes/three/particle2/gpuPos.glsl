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


vec3 snoiseVec3( vec3 x ){
  float s  = snoise3(vec3( x ));
  float s1 = snoise3(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise3(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  return vec3( s , s1 , s2 );
}

vec3 curlNoise( vec3 p ){
  
  const float e = 0.0001; // 步长改小
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  // 获取三个维度的矢量势 (Vector Potential)
  // 此处演示中心差分法 (Central Difference)，精度更高
  // 公式： Curl(F).x = dFz/dy - dFy/dz
  
  // 计算 p_y0 = F(y-e), p_y1 = F(y+e) 等等
  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );

  // 偏导数 (Partial Derivatives)
  // 分母是 2*e
  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}



void main(){
  float t = uTime;
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 particle = texture(texPos, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;

  vec3 vel = vec3(0);
  
  

  life += uDelta * .2;

  // 重置
  if(life>1.){
    life = fract(life);
    pos = vec3(0);
    vel = (hash33(vec3(uv, t))-.5)*10.;
  }else{
    // const vec3 offset1 = vec3(12.34, 56.78, 90.12);
    // const vec3 offset2 = vec3(54.32, 98.76, 21.09);
    // const vec3 offset3 = vec3(43.21, 87.65, 10.98);

    // vel = vec3(
    //   snoise3(pos * vec3(1.) + offset1 + t), // X轴噪音
    //   snoise3(pos * vec3(1.) + offset2 + 0.), // Y轴噪音
    //   snoise3(pos * vec3(1.) + offset3 + 0.)  // Z轴噪音
    // );

    vel = curlNoise(pos*1.+vec3(0.,-t,0.));

    vec3 toYAxes = normalize(vec3(0., pos.y, 0.) - pos);
    vec3 up = vec3(0, 1, 0);
    vec3 rot = cross(up, toYAxes);
    float atten = smoothstep(5.,0.,pos.y);
    vel = normalize(vel + (rot + up));
  }

  pos += vel*uDelta*2.;

  gl_FragColor = vec4(pos, life);
}