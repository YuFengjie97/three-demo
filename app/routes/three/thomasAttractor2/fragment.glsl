uniform float uTime;
uniform float uDelta;
uniform float count;
uniform float speed;


varying vec2 vUv;
varying vec3 vPos;


float hash11(float p){
  p = fract(p * .1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}


void main(){

  vec3 col = vec3(0);
  float d = 0.;
  float tailLen = 1./count * .6;

  for(float i=0.;i<count;i++){
    float life = i/count;
    vec3 c = sin(vec3(3,2,1) + i + vPos*.1)*.5+.5;

    float d1 = fract(vUv.x + life + uTime * speed);
    d1 = smoothstep(tailLen, 0., d1);

    d += d1;
    col += c * d1;
  }

  csm_FragColor = vec4(col*2., d);
}