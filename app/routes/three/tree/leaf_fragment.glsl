
uniform sampler2D uParticleTex;


varying vec3 vCol;
varying float vLife;


void main(){
  // vec2 uv = gl_PointCoord-.5;
  // vec3 col = vec3(1,0,0);
  // float d = length(uv);
  // d = smoothstep(.2,0.,d);
  // csm_FragColor = vec4(col*d, d);


  vec2 uv = gl_PointCoord;
  float d = texture(uParticleTex, uv).r;
  csm_FragColor = vec4(vCol*d, d*vLife);
}