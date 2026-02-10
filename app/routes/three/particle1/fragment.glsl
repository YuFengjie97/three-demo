


uniform float uTime;
uniform float uDelta;


varying float vLife;

void main(){
  vec2 uv = gl_PointCoord - .5;
  float d = length(uv);
  d = pow(.1/d,2.);

  vec3 col = vec3(1,0,0);
  col *= d;

  float alpha = d * sin(vLife * PI);
  
  csm_FragColor = vec4(col, alpha);
}