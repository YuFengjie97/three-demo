#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')
#define T uTime

uniform float uTime;
uniform float uDelta;
uniform sampler2D tarPosTex;
uniform float life;


vec3 turbulence(vec3 p){
  vec3  vel  = sin(p.zxy*1.*2.+vec3(0.,-T,0.));
        vel += sin(p.zxy*2.*2.+vec3(12.15,44.33,55.14))*.5;
        vel += sin(p.zxy*4.*2.+vec3(34.22,98.67,56.21))*.25;
        vel += sin(p.zxy*8.*2.+vec3(87.21,56.29,93.67))*.125;
  return normalize(vel);
}

vec3 snoise3X3(vec3 p){
  vec3 offset1 = vec3(12.34, 56.78,   90.12);
  vec3 offset2 = vec3(54.32, 98.76+T, 21.09);
  vec3 offset3 = vec3(43.21, 87.65,   10.98);

  vec3 vel = vec3(
    snoise3(p * vec3(1.) + offset1), // X轴噪音
    snoise3(p * vec3(1.) + offset2), // Y轴噪音
    snoise3(p * vec3(1.) + offset3)  // Z轴噪音
  );
  return normalize(vel);
}


void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 p = texture(posTex, uv).xyz;
  
  // test tarPosTex
  vec3 p_tar = texture(tarPosTex, uv).xyz;

  vec3 to_tar = (p_tar-p);
  float dist_tar = length(to_tar);
  vec3 vel_to_tar = normalize(to_tar); // 趋向目标的速度


  float close_tar = smoothstep(0., 1., dist_tar);
  // p = mix(vec3(0), p_tar, life);
  if(life>=.99){
    p = vec3(0);
  }


  vec3 vel_disruption = snoise3X3(p); // 噪音扭曲的速度
  // vec3 vel_disruption = turbulence(p); // 噪音扭曲的速度

  vec3 vel = (vel_to_tar  + vel_disruption*.8) * close_tar;

  p += vel * 2. * uDelta;


  gl_FragColor = vec4(p, 1.);
}