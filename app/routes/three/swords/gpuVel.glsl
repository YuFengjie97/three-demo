#pragma glslify: snoise = require('glsl-noise/simplex/3d')


uniform float uTime;
uniform float uDelta;
uniform float uSize;
uniform float uSeparationR;
uniform float uSeparationFactor;
uniform float uAlignmentR;
uniform float uAlignmentFactor;
uniform float uCohesionR;
uniform float uCohesionFactor;

uniform float uMaxSpeed;
uniform float uMinSpeed;

uniform float uCenterFactor;
uniform float uCenterMin;
uniform float uCenterMax;


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
  float separation_factor = uSeparationFactor;
  float separation_count = 0.;

  // 对齐,范围内统一速度方向
  float alignment_r = uAlignmentR; // 在这个范围下,表现统一速度方向
  vec3 alignment_vel = vec3(0);
  float alignment_count = 0.;
  float alignment_factor = uAlignmentFactor;


  // 聚集,范围内,粒子向范围中心靠拢
  float cohesion_r = uCohesionR;
  vec3 cohesion_center = pos;
  float cohesion_count = 0.;
  vec3 cohesion_vel = vec3(0);
  float cohesion_factor = uCohesionFactor;

  // 遍历所有粒子
  for(float x=0.;x<uSize;x++){
    for(float y=0.;y<uSize;y++){
      vec2 nei_coord = vec2(x+.5,y+.5)/uSize;
      vec3 nei_pos = texture(texPos, nei_coord).xyz;
      vec3 nei_vel = texture(texVel, nei_coord).xyz;
      float dist = length(pos-nei_pos);

      // 跳过自己
      if(dist < 0.001) {
        continue;
      }

      if(dist < separation_r) {
        vec3 to_nei = vec3(pos - nei_pos);
        vec3 separation_force = normalize(to_nei);
        float strength = separation_r / max(0.01, dist);
        separation_vel += separation_force * strength;
        separation_count++;
      }
      else if(dist < alignment_r){
        alignment_vel += nei_vel;
        alignment_count++;
      }
      else if(dist < cohesion_r) {
        cohesion_center += nei_pos;
        cohesion_count++;
      }
    }
  }

  if(separation_count>0.){
    acc += separation_vel / separation_count * separation_factor;
  }

  if(alignment_count>0.){
    alignment_vel /= alignment_count;
    // acc += alignment_vel * alignment_factor;
    vec3 alignment_diff = alignment_vel - acc;
    acc += alignment_diff * alignment_factor;
  }

  if(cohesion_count>0.){
    cohesion_center /= cohesion_count;
    cohesion_vel = normalize(vec3(cohesion_center - pos));
    acc += cohesion_vel * cohesion_factor;
  }

  // 来自原点的引力,防止飞跑
  float center_factor = uCenterFactor;
  vec3 center = vec3(0);
  vec3 to_center = center - pos;
  if(length(to_center)<uCenterMax){
    center_factor = .5 * (uSeparationFactor + uAlignmentFactor + uCohesionFactor);
  }
  vec3 center_vel = normalize(to_center);
  float center_strength = smoothstep(uCenterMin, uCenterMax, length(to_center));
  acc += center_vel * center_strength * center_factor;


  vec3 vel = texture(texVel, uv).xyz;
  vel = mix(vel, acc, .4);

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