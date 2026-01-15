uniform sampler2D uTexDay;
uniform sampler2D uTexNight;
uniform sampler2D uTexCloud;
uniform sampler2D uTexSpe;

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

  // 纹理
  vec3 texDay = texture(uTexDay, uv).rgb;
  vec3 texNight = texture(uTexNight, uv).rgb;
  vec3 texCloud = texture(uTexCloud, uv).rgb;
  vec3 texSpe = texture(uTexSpe, uv).rgb;


  // 白天黑夜混合
  vec3 ligthDir = normalize(-uSunPos);   // 以为太阳光几乎平行(太阳巨大,光强大),这里为平行光
  float L_DOT_N = dot(-ligthDir, vWorldNormal);
  float dayMix = smoothstep(0.1, 1., L_DOT_N);
  vec3 col = mix(texNight, texDay, dayMix);


  // 云朵混合  
  float cloudMix = smoothstep(uCloudVal, 1., texCloud.r) * dayMix;
  col = mix(col, vec3(1), cloudMix);

  // 大气混合
  float atomMix = smoothstep(-.3, .3, L_DOT_N);
  vec3 atomCol = mix(uAtomsphereToNightCol, uAtomsphereDayCol, atomMix);
  // 菲涅尔
  vec3 viewDir = normalize(vWorldPos - cameraPosition);
  float fresnel = pow(
                      1. - max(0.,dot(-viewDir, vWorldNormal)),
                    2.);
  col = mix(col, atomCol, atomMix * fresnel);




  // 反射高光
  float spec = pow(max(0., dot(-viewDir, reflect(ligthDir, vWorldNormal))), 32.);
  vec3 specCol = mix(vec3(1), col, fresnel);  // 按照菲涅尔设置高光颜色
  col = mix(col, specCol, spec * texSpe.r);


  gl_FragColor.xyz = col;

  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}