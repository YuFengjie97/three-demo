
uniform sampler2D uTex;

varying vec3 vCol;

void main(){
  float d = length(gl_PointCoord-.5);
  d = pow(.03/d, 2.);

  vec4 tex = texture2D(uTex, gl_PointCoord).rgba;

  vec4 col = vec4(tex.r) + d;

  col.rgb *= vCol;

  csm_FragColor = col;
  // csm_DiffuseColor.a = col.a;
}

