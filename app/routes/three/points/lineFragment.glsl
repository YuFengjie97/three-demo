varying float vAlpha;


void main(){


  csm_FragColor.rgb = vec3(.4,.0,.8)*10.;
  csm_FragColor.a = vAlpha;
}