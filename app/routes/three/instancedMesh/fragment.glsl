uniform highp sampler2DArray uTextureArray;

varying vec2 vUv;
varying float vInstanceId;


void main(){
  float texId = mod(vInstanceId, 4.);
  vec4 texColor = texture(uTextureArray, vec3(vUv*3., texId));

  vec3 col = sin(vec3(3,2,1) + texId) *.5+.5;

  csm_DiffuseColor.rgb = texColor.r * col * 2.;
  csm_DiffuseColor.a = texColor.r;


  // csm_DiffuseColor.rgb = sin(vec3(3,2,1) + texId)*.5+.5;
}