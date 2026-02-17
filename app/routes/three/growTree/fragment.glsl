uniform sampler2D tex;
varying vec3 vCol;


void main(){
  vec2 uv = gl_PointCoord;
  // float d = length(uv-.5);
  // d = smoothstep(.5, 0., d);
  float d = texture(tex, uv).r;

  csm_FragColor = vec4(vCol*d, d);
}
