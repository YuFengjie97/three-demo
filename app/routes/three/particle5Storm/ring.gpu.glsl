#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uDelta;
uniform sampler2D defPos;
uniform float lifeSpeed;
uniform float particleVel;

vec3 snoise3x3(vec3 p){
  vec3 v = normalize(vec3(
    snoise3(p+vec3(1,0,0)*uTime*.5),
    snoise3(p+vec3(0,1,0)*uTime*.5),
    snoise3(p+vec3(0,0,1)*uTime*.5)
  ));
  return v;
}

vec3 turbulence(vec3 p){
  p += sin(p.zxy);
  p += sin(p.zxy*2.)*.5;
  p += sin(p.zxy*4.)*.25;
  return p;
}

vec3 rotVel(vec3 p){
  vec3 toCenter = normalize(p);
  // vec3 axes = normalize(vec3(.5,1.,1.)); // 轴向量
  vec3 axes = normalize(vec3(0,1.,0)); // 轴向量
  vec3 v = normalize(cross(toCenter, axes));
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(posTex, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;

  vec3 pos0 = texture(defPos, uv).xyz;

  life += uDelta*lifeSpeed;
  if(life>1.){
    life = fract(life);
    pos = pos0;
  }

  // 基础噪音扰动
  float strength = smoothstep(0.5, 1.,snoise3(pos+vec3(uTime))) + .1;
  vec3 vel = snoise3x3(pos*.2) * 10. * strength;
  // vec3 vel = turbulence(pos) * strength;

  // 绕轴旋转
  {
    vec3 velRot = rotVel(pos);
    vel += velRot * 2.;
  }


  pos += normalize(vel) * uDelta * particleVel * 5.;
  gl_FragColor = vec4(pos, life);
}