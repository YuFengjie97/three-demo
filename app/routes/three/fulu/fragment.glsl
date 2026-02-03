uniform float uTime;
uniform float uDelta;
uniform sampler2D uTex1;
uniform sampler2D uTex2;
uniform sampler2D uTex3;


varying vec2 vUv;
varying float vNdx;
varying vec3 vPos;


void main(){
  float t = uTime;

  float i = floor(mod(vNdx, 3.));
  float d = 0.;
  if(i==0.){
    d = texture(uTex1, vUv).b;
  }
  else if(i==1.){
    d = texture(uTex2, vUv).b;
  }
  else if(i==2.){
    d = texture(uTex3, vUv).b;
  }

  vec3 col = sin(vec3(3,2,1) + vNdx * 10. + vPos + t*1.)*.5+.5;

  csm_FragColor = vec4(col * col.r * 2., d);
}
