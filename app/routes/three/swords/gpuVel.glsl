#pragma glslify: snoise = require('glsl-noise/simplex/3d')


uniform float uTime;
uniform float uDelta;


void main(){
  float t = uTime;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture(texPos, uv).rgb;


  vec3 vel = normalize(vec3(
    snoise(pos * .04 + vec3(1,0,0)),
    snoise(pos * .04 + vec3(0,1,t)),
    snoise(pos * .04 + vec3(0,0,1))
  ));

  // vec3 vel = normalize(sin(vec3(3,2,1) + t));
  // vec3 vel = normalize(vec3(1,1,0));


  gl_FragColor = vec4(vel, 1.);
}