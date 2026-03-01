uniform float uTime;
uniform float life;

uniform vec3 color;

varying vec2 vUv;

void main(){

  // 管线首尾两端的高亮
  float d = min(vUv.x, 1.-vUv.x);
  float aa = fwidth(d);
  d = smoothstep(aa,-aa,d-.06);

  // 管线流动的光
  {
    float d1 = fract(vUv.x + (uTime + life));
    float aa = fwidth(d1);
    d1 = smoothstep(aa,-aa, d1-.04);
    d += d1;
  }


  csm_FragColor = vec4(color * (1.+d), .5 + d);
}