#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')
#pragma glslify: snoise2 = require('glsl-noise/simplex/2d')


// uniform sampler2D texPos;
// uniform sampler2D texVel;
uniform float uTime;
uniform float uDelta;
uniform float uSpeed;
uniform float uRangeMin;
uniform float uRangeMax;

void main(){
  float t =uTime;
  
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture(texPos, uv).rgb;
  vec3 vel = texture(texVel, uv).rgb;

  // 速度大小
  float velLen = snoise3(pos);
  velLen = smoothstep(uRangeMin, uRangeMax, velLen) * uSpeed;

  // 速度方向改变
  vec3 velNew = vec3(
    snoise3(pos*.4+vec3(1.,0.,0.)),
    snoise3(pos*.4+vec3(0.,1.,t)),
    snoise3(pos*.4+vec3(0.,0.,1.))
  );
  // vec3 velNew = vec3(
  //   snoise2(vec2(pos.xy*.4) + t),
  //   snoise2(vec2(pos.yz*.4) + 0.),
  //   snoise2(vec2(pos.zx*.4) + 0.)
  // );

  vel = velNew;
  vel = normalize(vel) * velLen;

  gl_FragColor = vec4(vel, 1);
}