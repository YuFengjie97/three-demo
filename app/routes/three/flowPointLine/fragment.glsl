#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')


uniform sampler2D uTexPos;
uniform sampler2D uTexPoint;

varying vec2 vTexCoord;
varying vec3 vPos;


void main(){
  vec4 particle = texture(uTexPos, vTexCoord);
  vec3 pos = particle.xyz;
  float life = particle.w;

  vec3 col = sin(vec3(3,2,1) + dot(cos(pos), vec3(2.)))*.5+.5;

  vec2 uv = gl_PointCoord-.5;
  // float d = length(uv);
  float d = texture(uTexPoint, gl_PointCoord).r;

  // float blink = snoise3(vPos*.3);
  // d += pow(.1/length(uv),2.) * step(0.5,blink);

  if(d<.1){
    discard;
  }

  float fadeInOut = smoothstep(.5,.0,abs(life-.5));

  csm_FragColor.rgb = col * 2. * d;
  csm_FragColor.a = fadeInOut;
}