uniform sampler2D tex;

varying float vLife;
varying vec3 vCol;


void main(){
  vec2 uv = gl_PointCoord;
  // float d = length(uv-.5);
  // d = smoothstep(.5,.48,d);
  float d = texture(tex, uv).r;

  float fadeIn = smoothstep(0.,.1, vLife);
  float fadeOut = smoothstep(.9,1.,vLife);
  float fade = fadeIn * fadeOut;

  // d *= fade;

  gl_FragColor = vec4(vCol*d*2., d);
}