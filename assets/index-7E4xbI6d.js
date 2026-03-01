import{r as l,w as T,o as e}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as D,V as m,ay as U,az as A,aA as B,U as u,c as j,A as F,f as Y,aw as I,ad as X}from"./extends-INE2Z42_.js";import{u as E}from"./leva.esm-B2CXSQv-.js";import{c as V}from"./simplex-noise-BUqOQ44_.js";import{j as L}from"./three-custom-shader-material.es-BBoUe0uN.js";import{u as M}from"./useUniformTime-BcW4F0GW.js";import{d as q,w as O}from"./index-DwxtmhpU.js";import{O as R}from"./OrbitControls-DPBZ4Sb0.js";import{C as Z}from"./Center-dqkgKONn.js";import{L as k}from"./Loader-DFF8_diB.js";import"./index-7OC5HNn7.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";import"./three-custom-shader-material.es-ZNSMNJaL.js";const W=`#define GLSLIFY 1
varying vec2 vUv;
varying vec3 vNormal2;

void main(){
  vUv = uv;
  vNormal2 = csm_Normal;
}`,H=`#define GLSLIFY 1
//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

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
    float n = snoise(vec3(idd+seed, uTime+seed));
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
}`,J=`#define GLSLIFY 1
varying vec2 vUv;

void main(){
  vUv = uv;
}`,K=`#define GLSLIFY 1
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
}`;V();const{random:z,floor:P}=Math;function N(n,t){return(t-n)*z()+n}const g=l.createContext({colorBase:"",colorPattern:"",gridSize:3,gridGap:.2,cubeSize:1,upCellPos:[],downCellPos:[]});function Q(n){const{colorBase:t,colorPattern:r,cubeSize:o}=l.useContext(g),s=[o,.1,o],{geo:c}=l.useMemo(()=>({geo:new I(...s)}),[s]),v={...M(),seed:new u(P(z()*1e3)),colorBase:new u(new j(t)),colorPattern:new u(new j(r)),uSize:new u(new m(...s))};return e.jsx("mesh",{geometry:c,...n,children:e.jsx(L,{uniforms:v,baseMaterial:X,roughness:.1,metalness:.4,vertexShader:W,fragmentShader:H})})}function G(n){const{gridSize:t,gridGap:r,cubeSize:o}=l.useContext(g),s=l.useMemo(()=>{const c=[];for(let a=0;a<t;a++)for(let v=0;v<t;v++){const x=a*(o+r),i=v*(o+r);c.push(new m(x,0,i))}return c},[t,r]);return e.jsx("group",{...n,children:s.map((c,a)=>e.jsx(Q,{position:c},a))})}function $(){const{upCellPos:n,downCellPos:t,colorPattern:r}=l.useContext(g),o=n[P(z()*n.length)],s=t[P(z()*t.length)],{tubeGeo:c,cylinderGeo:a}=l.useMemo(()=>{const f=o.clone().add(new m(0,-.1,0)),p=s.clone().add(new m(0,.1,0)),y=f.clone().add(new m(0,N(-1,-.5),0)),h=p.clone().add(new m(0,N(.3,.5),0)),C=[o,f,y,h,p,s],S=new U(C),d=.016,b=new A(S,100,d,6,!1),w=new B(d*2,d*2,.08,6,10);return{tubeGeo:b,cylinderGeo:w}},[o,s]),v=M(),x=z(),i={...v,life:new u(x),color:new u(new j(r))};return e.jsxs(e.Fragment,{children:[e.jsx("mesh",{geometry:a,position:[o.x,o.y-.06,o.z],children:e.jsx("meshStandardMaterial",{color:r,metalness:.5,roughness:.1})}),e.jsx("mesh",{geometry:c,children:e.jsx(L,{baseMaterial:Y,uniforms:i,vertexShader:J,fragmentShader:K,transparent:!0,depthWrite:!1,blending:F})}),e.jsx("mesh",{geometry:a,position:[s.x,s.y+.06,s.z],children:e.jsx("meshStandardMaterial",{color:r,metalness:.5,roughness:.1})})]})}function ee(){const n=E({colorBase:"#3bc89c",colorPattern:"#65c8ce"}),t=3,r=.2,o=1,s=2,{upCellPos:c,downCellPos:a}=l.useMemo(()=>{const i=o/12,f=[],p=[];for(let y=0;y<t;y++)for(let h=0;h<t;h++){const C=y*(o+r)-o/2,S=h*(o+r)-o/2;for(let d=0;d<12;d++)for(let b=0;b<12;b++){const w=C+d*i+i/2,_=S+b*i+i/2;f.push(new m(w,0,_)),p.push(new m(w,-s,_))}}return{upCellPos:f,downCellPos:p}},[t,r,s]);return e.jsxs(g,{value:{...n,gridSize:t,gridGap:r,cubeSize:o,upCellPos:c,downCellPos:a},children:[e.jsx(G,{}),e.jsx(G,{position:[0,-s,0]}),Array.from({length:40}).map((x,i)=>e.jsx($,{},i))]})}const pe=T(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(D,{camera:{position:[0,0,4]},gl:{antialias:!0},dpr:[1,2],children:[e.jsx(R,{}),e.jsx("ambientLight",{intensity:1}),e.jsx(l.Suspense,{fallback:null,children:e.jsx(Z,{children:e.jsx(ee,{})})}),e.jsx(q,{children:e.jsx(O,{})})]}),e.jsx(k,{})]})});export{pe as default};
