#pragma glslify: snoise = require('glsl-noise/simplex/2d')
#define s1(v) (sin(v)*.5+.5)

uniform float uTime;


varying vec3 vCol;
varying vec2 vUv;
varying float vTextId;
varying float vLife;

float fbm(vec2 p){
  float n = 0.;
  n += snoise(p+vec2(vTextId*.2));
  n += .5*snoise(p*2.);
  n += .25*snoise(p*4.);
  n += .125*snoise(p*6.);
  return n;
}

void main(){
  float t = uTime;
  csm_FragColor = vec4(vCol*4.4,1);

  float n = fbm(vUv*4.) + sin(t+vTextId*.2);
  float burn = -n;
  n = smoothstep(0.,0.1,n);
  float glow = pow(.1/(burn), 4.);


  csm_FragColor.rgb += glow*vec3(1.,.1,.0);
  float transparent = 1.-abs(vLife-.5)*2.;
  csm_FragColor.a = n * transparent;
}