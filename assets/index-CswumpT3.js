import{r as t,w as f,o as e}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as b,V as p,aw as h,U as x,c as m,A as z,f as g}from"./extends-Btb7_Bq8.js";import{u as C}from"./leva.esm-B2CXSQv-.js";import{P as w}from"./Perf-vP4H6X_r.js";import{c as S}from"./simplex-noise-BUqOQ44_.js";import{j}from"./three-custom-shader-material.es-BofixpVt.js";import{O as _}from"./OrbitControls-v2OwhzNa.js";import{C as N}from"./Center-BT5cnabd.js";import{L}from"./Loader-C1l0BEG2.js";import"./index-7OC5HNn7.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";import"./troika-three-text.esm-DVIe-8_b.js";import"./three-custom-shader-material.es-BD7gSNfx.js";const B=`#define GLSLIFY 1
varying vec2 vUv;
varying vec3 vNormal;

void main(){
  vUv = uv;
  vNormal = csm_Normal;
}`,D=`#define GLSLIFY 1
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

uniform vec3 uSize;
uniform vec3 colorBase;
uniform vec3 colorPattern;

varying vec2 vUv;

void main(){

  vec2 uvScale = vec2(1.0);
  vec3 absNormal = abs(vNormal);

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

  // vec3 col_base = vec3(
  //   0.015996293361446288,
  //   0.08865558627723595,
  //   0.09305896283800832
  // );
  // vec3 col_pattern = vec3(
  //     0.059511238155621766,
  //     0.4178850708380236,
  //     0.4396571738310091
  // );
  vec3 col_base = colorBase;
  vec3 col_pattern = colorPattern;
  vec3 col = col_base;

  float d_base = .1; // 初始值为box基础透明度
  
  // 细分uv的细线
  {
    vec2 uv2 = uv*4.;
    vec2 idd = floor(uv2);
    uv2 = fract(uv);

    // float n = snoise3(vec3(idd, 1.));
    // vec3 c = mix(col_base, col_pattern, smoothstep(-1.,1.,n));
    // col = mix(col, c, smoothstep(-1.,1.,n));

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
    col = mix(col, col_pattern, d);
    d_base += d;
  }

  // 圆
  {
    float d = length(uv);
    float aa = fwidth(d);
    d = smoothstep(aa, -aa, d-.06);
    col = mix(col, col_pattern*1.5, d);
    d_base += d;
  }

  csm_FragColor = vec4(col*4., d_base);
}`;S();const l=t.createContext({colorBase:"",colorPattern:"",gridSize:3,gridGap:.2}),n=1;function M(c){const o=[n,.1,n],{colorBase:a,colorPattern:v}=t.useContext(l),{geo:s}=t.useMemo(()=>({geo:new h(...o)}),[o]),r={colorBase:new x(new m(a)),colorPattern:new x(new m(v)),uSize:new x(new p(...o))};return e.jsx("mesh",{geometry:s,...c,children:e.jsx(j,{uniforms:r,baseMaterial:g,vertexShader:B,fragmentShader:D,blending:z,toneMapped:!1})})}function d(c){const{gridSize:o,gridGap:a}=t.useContext(l),v=t.useMemo(()=>{const s=[];for(let r=0;r<o;r++)for(let i=0;i<o;i++){const u=r*(n+a),y=i*(n+a);s.push(new p(u,0,y))}return s},[o,a]);return e.jsx("group",{...c,children:v.map((s,r)=>e.jsx(M,{position:s},r))})}function P(){const c=C({colorBase:"#3bc89c",colorPattern:"#65c8ce"});return e.jsxs(l,{value:{...c,gridSize:3,gridGap:.2},children:[e.jsx(d,{}),e.jsx(d,{position:[0,-2,0]})]})}const R=f(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(b,{camera:{position:[0,0,4]},children:[e.jsx(w,{position:"top-left"}),e.jsx("axesHelper",{args:[10]}),e.jsx(_,{}),e.jsx(t.Suspense,{fallback:null,children:e.jsx(N,{children:e.jsx(P,{})})})]}),e.jsx(L,{})]})});export{R as default};
