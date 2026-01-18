#pragma glslify: snoise2 = require('glsl-noise/simplex/2d')


uniform float uTime;

attribute float aInstanceId;


varying vec2 vUv;
varying float vInstanceId;


mat2 rotate(float a){
  float s = sin(a);
  float c = cos(a);
  return mat2(c,-s,s,c);
}


void main(){
  vUv = uv;
  // vInstanceId = aInstanceId;
  vInstanceId = float(gl_InstanceID);

  float t = uTime;

  vec3 offset = vec3(
    snoise2(vec2(aInstanceId, t*.1+1.)) * 4.,
    snoise2(vec2(aInstanceId, t*.1+2.)) * 4.,
    snoise2(vec2(aInstanceId, t*.1+3.)) * 4.
  );

  csm_Position.xz *= rotate(6.*snoise2(vec2(aInstanceId+4., t*.06)));
  csm_Position.yz *= rotate(6.*snoise2(vec2(aInstanceId+5., t*.06)));


  csm_Position += offset;
}