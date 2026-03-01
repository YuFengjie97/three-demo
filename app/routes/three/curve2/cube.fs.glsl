#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

uniform float seed;
uniform float uTime;
uniform float uDelta;
uniform vec3 uSize;
uniform vec3 colorBase;
uniform vec3 colorPattern;

varying vec2 vUv;
varying vec3 vNormal2;


void main(){

  vec2 uvScale = vec2(1.0);
  vec3 absNormal = abs(vNormal2);

  // 3. 根据法线判断面，并分配对应的物理尺寸
  // 如果 x 分量最大，说明是左右面 (对应尺寸 Z 和 Y)
  if (absNormal.x > absNormal.y && absNormal.x > absNormal.z) {
    uvScale = vec2(uSize.z, uSize.y); 
  } 
  // 如果 y 分量最大，说明是顶底面 (对应尺寸 X 和 Z)
  else if (absNormal.y > absNormal.x && absNormal.y > absNormal.z) {
    uvScale = vec2(uSize.x, uSize.z);
  } 
  // 否则是前后面 (对应尺寸 X 和 Y)
  else {
    uvScale = vec2(uSize.x, uSize.y);
  }
  vec2 uv = vUv;

  uv -= .5;        // 移到中心,按照几何体尺寸缩放uv
  uv *= uvScale;

  uv*=3.; // 重复奇数次  
  vec2 id = floor(uv);
  uv = fract(uv + .5) - .5; 


  vec3 col_base = colorBase;
  vec3 col_pattern = colorPattern;
  vec3 col = col_base;

  float d_base = .1; // 初始值为box基础透明度
  
  // 细分uv的细线
  {
    vec2 uv2 = uv*4.;
    vec2 idd = floor(uv2);
    uv2 = fract(uv2);

    // 小格子随机颜色
    float n = snoise3(vec3(idd+seed, uTime+seed));
    float sn = smoothstep(-1.,1.,n);
    vec3 c = sin(vec3(3,2,1)+sn*10.)*.5+.5;
    col = mix(col, c*.5, n*1.);

    float d = max(abs(uv2.x-.5)-.5, abs(uv2.y-.5)-.5);
    float aa = fwidth(d);
    d = smoothstep(-aa, aa, d+.01);
    col = mix(col, col_pattern*.1, d);
    d_base += d;
  }

  // 宽线
  {
    float d = min(abs(uv.x), abs(uv.y));
    float aa = fwidth(d);
    d = smoothstep(aa, -aa, d-.01);
    col = mix(col, col_pattern*3., d);
    d_base += d;
  }

  // 圆
  {
    float d = length(uv);
    float aa = fwidth(d);
    d = smoothstep(aa, -aa, d-.06);
    col = mix(col, col_pattern*4., d);
    d_base += d;
  }


  // csm_FragColor = vec4(col*4., d_base);
  csm_DiffuseColor = vec4(col*4., d_base);
}