uniform float uTime;
uniform float uDelta;
uniform sampler2D tex;

varying vec3 vCol;


void main(){
  // vec2 uv = gl_PointCoord-.5;
  // float d = length(uv);
  // d = .1/d;
  
  vec2 uv = gl_PointCoord;
  float d = texture(tex, uv).r;

  csm_FragColor = vec4(vCol*d, d);
}