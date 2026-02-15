#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')


uniform float uTime;
uniform float uDelta;
uniform sampler2D uDefaultPosTex;
uniform sampler3D uNoise3DTex;

void main(){
  float t = uTime;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(texPos, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;

  life += uDelta;
  if(life>1.){
    life = fract(life);  // 重置life
    pos = texture(uDefaultPosTex, uv).xyz; // 根据默认位置重置
  }

  // flowfield
  vec3 vel = vec3(
    snoise3(pos*.4+vec3(1.,0.,0.)),
    snoise3(pos*.4+vec3(0.,1.,t)),
    snoise3(pos*.4+vec3(0.,0.,1.))
  );
  // vec3 vel = texture(uNoise3DTex, pos*.4+vec3(0.,t,0.)).rgb;

  float strength = snoise3(pos+vec3(0,t,0));
  strength = smoothstep(.1,0.,strength);

  pos += vel * strength * uDelta * 4.;
  gl_FragColor = vec4(pos, life);
}