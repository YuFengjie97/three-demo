uniform sampler2D uParticleTex;


varying float vLife;
varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord;
  float d = length(uv-.5);
  // d = pow(.1/d,2.);
  d = smoothstep(.2,0.,d);


  // float d = texture(uParticleTex, uv).r;

  vec3 col = vCol * d;

  float lifeAlpha = sin(vLife*PI);

  csm_FragColor = vec4(col, d * lifeAlpha);
}