#pragma glslify: snoise = require('glsl-noise/simplex/4d')


uniform float uTime;
uniform float uDelta;
uniform float ndx;
uniform float colorScale;
uniform vec3 colorOffset;

varying vec3 vCol;
varying float vAlpha;

void main(){
  vec3 p = csm_Position;

  vCol = sin(colorOffset+ndx*colorScale)*.5+.5;

  // vAlpha = smoothstep(-.5,.5,snoise(vec4(p, -uTime*.1)));
}
