uniform vec3 uSunPos;
uniform float uTime;
uniform float uCloudVal;
uniform vec3 uAtomsphereDayCol;
uniform vec3 uAtomsphereToNightCol;


varying vec2 vUv;
varying vec3 vPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main(){

  vec2 uv = vUv;

  vec3 ligthDir = normalize(-uSunPos);
  float L_DOT_N = dot(-ligthDir, vWorldNormal);

  // 大气混合
  float atomMix = smoothstep(-.3, .3, L_DOT_N);
  vec3 atomCol = mix(uAtomsphereToNightCol, uAtomsphereDayCol, atomMix);
  // 菲涅尔
  vec3 viewDir = normalize(vWorldPos - cameraPosition);
  float fresnel = pow(
                      1. - max(0.,dot(-viewDir, vWorldNormal)),
                    2.);


  vec3 col = atomCol * atomMix * fresnel;


  float spec = pow(max(0., dot(-viewDir, reflect(ligthDir, vWorldNormal))), 32.);
  vec3 specCol = mix(vec3(1), col, fresnel);  // 按照菲涅尔设置高光颜色
  col = mix(col, specCol, spec);




  float edgeAlpha = dot(-viewDir, vWorldNormal);
  edgeAlpha = smoothstep(0., -.5, edgeAlpha);
  // col *= vec3(edgeAlpha);

  gl_FragColor = vec4(col, edgeAlpha);

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}