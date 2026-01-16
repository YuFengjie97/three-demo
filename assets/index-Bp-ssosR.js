import{r as o,w as S,o as e}from"./chunk-EPOLDU6W-B0aIzJ9t.js";import{a0 as r,y as D,G as M,K as j,s as n,q as p,aS as W,V as A,$ as P,I as L,aT as F,X as m}from"./OrbitControls-BeN5Vx9q.js";import{P as U}from"./Perf-CCUQB34x.js";import{u as V}from"./leva.esm-rd6fLeBd.js";import"./index-7OC5HNn7.js";import"./index-C_sia4Et.js";import"./client-Cu2R2QOy.js";import"./index-XD7JBPcQ.js";const k=`#define GLSLIFY 1
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
`,z=`#define GLSLIFY 1
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
}`,G=`#define GLSLIFY 1
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
}`;function b(){const t=o.useMemo(()=>({uTime:new r(0),uDelta:new r(0)}),[]);return D(({clock:a},i)=>{t.uTime.value=a.getElapsedTime(),t.uDelta.value=i}),t}function I(){const t=n(m,"/img/texture/earth_2k/2k_earth_daymap.jpg"),a=n(m,"/img/texture/earth_2k/2k_earth_nightmap.jpg"),i=n(m,"/img/texture/earth_2k/2k_earth_clouds.jpg");o.useEffect(()=>{t.colorSpace=p,a.colorSpace=p,i.colorSpace=p,t.anisotropy=8,a.anisotropy=8,i.anisotropy=8},[t,a,i]);const w=n(m,"/img/texture/earth_2k/2k_earth_specular_map.jpg"),{r:d,phi:x,theta:h,cloudVal:v,dayCol:c,toNightCol:u}=V({r:{value:1.5,min:1,max:3},phi:{value:1.57,min:-3.15,max:3.15},theta:{value:1.57,min:-3.15,max:3.15},cloudVal:{value:.2,min:0,max:.4},dayCol:{value:"#00aaff"},toNightCol:{value:"#ff6600"}}),f=o.useRef(null),g=o.useMemo(()=>new W,[]),s=o.useMemo(()=>new A,[]),N=b(),l=o.useMemo(()=>({...N,uTexDay:new r(t),uTexNight:new r(a),uTexCloud:new r(i),uTexSpe:new r(w),uSunPos:new r(s),uCloudVal:new r(v),uAtomsphereDayCol:new r(new P(c)),uAtomsphereToNightCol:new r(new P(u))}),[]);o.useEffect(()=>{g.set(d,x,h),s.setFromSpherical(g),f.current.position.copy(s),l.uSunPos.value.copy(s)},[d,x,h]),o.useEffect(()=>{l.uCloudVal.value=v,l.uAtomsphereDayCol.value.set(c),l.uAtomsphereToNightCol.value.set(u)},[v,c,u]);const y=o.useRef(null);D((T,_)=>{y.current.rotation.y+=_*.1});const C=o.useMemo(()=>new L(1,20),[]);return e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{ref:f,position:s,children:[e.jsx("icosahedronGeometry",{args:[.1,10]}),e.jsx("meshBasicMaterial",{color:16711680})]}),e.jsx("mesh",{ref:y,geometry:C,children:e.jsx("shaderMaterial",{uniforms:l,vertexShader:k,fragmentShader:z})}),e.jsx("mesh",{geometry:C,scale:1.05,children:e.jsx("shaderMaterial",{uniforms:l,vertexShader:G,fragmentShader:E,side:F,transparent:!0})})]})}const $=S(function(){return e.jsx(e.Fragment,{children:e.jsx("div",{className:"h-screen",children:e.jsxs(M,{camera:{position:[0,0,2],fov:75,near:.1,far:10},children:[e.jsx(U,{position:"top-left",showGraph:!0}),e.jsx(j,{}),e.jsx("ambientLight",{}),e.jsx("axesHelper",{args:[10]}),e.jsx(I,{})]})})})});export{$ as default};
