#pragma glslify: snoise = require('glsl-noise/simplex/3d')

#define c1(v) (cos(v)*.5+.5)
#define PI_2 6.2831852



uniform float uTime;
uniform float uDelta;
uniform float uSize;
uniform float uSeparationR;
uniform float uAlignmentR;
uniform float uCohesionR;


uniform float uCenterEdge;

uniform float uMaxSpeed;
uniform float uMinSpeed;


void main(){
  float t = uTime;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 obj = texture(texPos, uv);
  vec3 pos = obj.xyz;
  float id = obj.w;

  vec3 acc = vec3(0);

  // 分离,根据距离表现排斥
  float separation_r = uSeparationR; // 斥 半径
  vec3 separation_vel = vec3(0); // 斥 初始化

  // 对齐,范围内统一速度方向
  float alignment_r = uAlignmentR; // 在这个范围下,表现统一速度方向
  vec3 alignment_vel = vec3(0);

  // 聚集,范围内,粒子向范围中心靠拢
  float cohesion_r = uCohesionR;
  vec3 cohesion_vel = vec3(0);

  vec3 vel = texture(texVel, uv).xyz;


  // 遍历所有粒子
  for(float x=0.;x<uSize;x++){
    for(float y=0.;y<uSize;y++){
      vec2 nei_coord = vec2(x+.5,y+.5)/uSize;
      vec3 nei_pos = texture(texPos, nei_coord).xyz;
      vec3 nei_vel = texture(texVel, nei_coord).xyz;
      float dist = length(pos-nei_pos);
      vec3 to_nei = normalize(vec3(nei_pos-pos));


      // 跳过自己
      if(dist < 0.001) {
        continue;
      }

      if(dist < separation_r) {
        vec3 separation_force = -to_nei;
        float weight = 1. - smoothstep(0., separation_r, dist);
        separation_vel += separation_force * weight;
      }
      else if(dist < alignment_r){
        float weight = 1.-smoothstep(separation_r, alignment_r,dist);
        alignment_vel += normalize(nei_vel) * weight;
      }
      else if(dist < cohesion_r) {
        float weight = 1.-smoothstep(alignment_r, cohesion_r,dist);
        cohesion_vel += to_nei * weight;
      }
    }
  }

  vel += separation_vel;
  vel += alignment_vel;
  vel += cohesion_vel;


  // 来自原点的引力,防止飞跑
  vec3 center = vec3(0);
  vec3 to_center = center - pos;
  vec3 center_vel = normalize(to_center);
  float center_weight = length(to_center) / uCenterEdge;

  center_vel.y *= 4.5;
  vel += center_vel * center_weight;

  float speed = max(min(length(vel), uMaxSpeed), uMinSpeed);
  vel = normalize(vel) * speed;

  // vec3 acc = vec3(
  //   snoise(pos+vec3(1,0,0)),
  //   snoise(pos+vec3(0,1,0)),
  //   snoise(pos+vec3(0,0,1))
  // );

  // vec3 acc = normalize(sin(vec3(30,20,10) + pos + t));

  gl_FragColor = vec4(vel, 1.);
}