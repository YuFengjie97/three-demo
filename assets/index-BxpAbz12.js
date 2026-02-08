import{w as T,o as e,r as o}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as M,O as j,a as m,T as n,S as d,i as W,V as A,U as r,c as D,u as L,I as F,j as U}from"./OrbitControls-C-XH75P4.js";import{P as V}from"./Perf-DU3TA-LL.js";import{u as k}from"./leva.esm-BV3Tl-wj.js";import{u as z}from"./useUniformTime-D9fJCXw2.js";import{a as v}from"./asset-BvcpElq9.js";import"./index-7OC5HNn7.js";import"./index-n5PR1bfd.js";import"./client-EdRjCdko.js";import"./troika-three-text.esm-GjNqgETG.js";import"./index-D369hMBv.js";const G=`#define GLSLIFY 1
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main(){
  vUv = uv;
  vPos = position;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);

  vec4 pos = vec4(position, 1.);

  vec4 modelPos = modelMatrix * pos;

  vWorldPos = modelPos.xyz;

  vec4 viewPos = viewMatrix * modelPos;

  gl_Position = projectionMatrix * viewPos;
}
`,O=`#define GLSLIFY 1
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
}`,b=`#define GLSLIFY 1
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main(){
  vUv = uv;
  vPos = position;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);

  vec4 pos = vec4(position, 1.);

  vec4 modelPos = modelMatrix * pos;

  vWorldPos = modelPos.xyz;

  vec4 viewPos = viewMatrix * modelPos;

  gl_Position = projectionMatrix * viewPos;
}
`,E=`#define GLSLIFY 1
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
}`;function I(){const a=m(n,v("/img/texture/earth_2k/2k_earth_daymap.jpg")),l=m(n,v("/img/texture/earth_2k/2k_earth_nightmap.jpg")),s=m(n,v("/img/texture/earth_2k/2k_earth_clouds.jpg"));o.useEffect(()=>{a.colorSpace=d,l.colorSpace=d,s.colorSpace=d,a.anisotropy=8,l.anisotropy=8,s.anisotropy=8},[a,l,s]);const w=m(n,v("/img/texture/earth_2k/2k_earth_specular_map.jpg")),{r:x,phi:h,theta:f,cloudVal:c,dayCol:u,toNightCol:p}=k({r:{value:1.5,min:1,max:3},phi:{value:1.57,min:-3.15,max:3.15},theta:{value:1.57,min:-3.15,max:3.15},cloudVal:{value:.2,min:0,max:.4},dayCol:{value:"#00aaff"},toNightCol:{value:"#ff6600"}}),g=o.useRef(null),y=o.useMemo(()=>new W,[]),i=o.useMemo(()=>new A,[]),N=z(),t=o.useMemo(()=>({...N,uTexDay:new r(a),uTexNight:new r(l),uTexCloud:new r(s),uTexSpe:new r(w),uSunPos:new r(i),uCloudVal:new r(c),uAtomsphereDayCol:new r(new D(u)),uAtomsphereToNightCol:new r(new D(p))}),[]);o.useEffect(()=>{y.set(x,h,f),i.setFromSpherical(y),g.current.position.copy(i),t.uSunPos.value.copy(i)},[x,h,f]),o.useEffect(()=>{t.uCloudVal.value=c,t.uAtomsphereDayCol.value.set(u),t.uAtomsphereToNightCol.value.set(p)},[c,u,p]);const C=o.useRef(null);L((_,S)=>{C.current.rotation.y+=S*.1});const P=o.useMemo(()=>new F(1,20),[]);return e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{ref:g,position:i,children:[e.jsx("icosahedronGeometry",{args:[.1,10]}),e.jsx("meshBasicMaterial",{color:16711680})]}),e.jsx("mesh",{ref:C,geometry:P,children:e.jsx("shaderMaterial",{uniforms:t,vertexShader:G,fragmentShader:O})}),e.jsx("mesh",{geometry:P,scale:1.05,children:e.jsx("shaderMaterial",{uniforms:t,vertexShader:b,fragmentShader:E,side:U,transparent:!0})})]})}const ee=T(function(){return e.jsx(e.Fragment,{children:e.jsx("div",{className:"h-screen",children:e.jsxs(M,{camera:{position:[0,0,2],fov:75,near:.1,far:10},children:[e.jsx(V,{position:"top-left",showGraph:!0}),e.jsx(j,{}),e.jsx("ambientLight",{}),e.jsx("axesHelper",{args:[10]}),e.jsx(I,{})]})})})});export{ee as default};
