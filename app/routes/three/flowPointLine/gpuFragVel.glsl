#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')


// uniform sampler2D texPos;
// uniform sampler2D texVel;
uniform float uTime;
uniform float uDelta;

void main(){
  float t =uTime;
  
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture(texPos, uv).rgb;
  vec3 vel = texture(texVel, uv).rgb;

  // 速度大小
  float velLen = snoise3(pos);
  velLen = smoothstep(-.4, 1., velLen) * 2.;

  // 速度方向改变
  vec3 velOff = vec3(
    snoise3(pos+vec3(1.,0.,t)),
    snoise3(pos+vec3(0.,1.,0.)),
    snoise3(pos+vec3(0.,0.,1.))
  );

  vel = velOff;
  vel = normalize(vel) * velLen;

  gl_FragColor = vec4(vel, 1);
}