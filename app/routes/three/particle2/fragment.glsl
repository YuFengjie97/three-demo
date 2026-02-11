varying float vLife;
varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord-.5;
  float d = length(uv);
  // d = pow(.1/d,2.);
  d = smoothstep(.1,0.,d);

  vec3 col = vCol * d;

  float lifeAlpha = sin(vLife*PI);

  csm_FragColor = vec4(col, d * lifeAlpha);
}