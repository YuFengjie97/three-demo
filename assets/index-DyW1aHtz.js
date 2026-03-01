import{w as f,o as e,r as c}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as u,I as d,V as r,aA as h,az as z,d as g,f as C}from"./extends-Btb7_Bq8.js";import{j as w}from"./three-custom-shader-material.es-BofixpVt.js";import{a as b}from"./BufferGeometryUtils-CCz_8P2C.js";import{u as j}from"./useUniformTime-CVLlM9Vi.js";import{d as T,w as L}from"./index-_U1Z32ti.js";import{O as D}from"./OrbitControls-v2OwhzNa.js";import{L as S}from"./Loader-C1l0BEG2.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-BD7gSNfx.js";const A=`#define GLSLIFY 1
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

uniform float uTime;
uniform float uDelta;

varying vec3 vCol;

// 笛卡尔 -> 球面坐标
vec3 rtp(vec3 p){
  float r = length(p);
  float the = acos(p.z/r);
  float phi = atan(p.y,p.x);
  return vec3(r,the,phi);
}

// 球面坐标 -> 笛卡尔
vec3 xyz(vec3 rtp){
  float r = rtp.x;
  float the = rtp.y;
  float phi = rtp.z;
  float x = r*sin(the)*cos(phi);
  float y = r*sin(the)*sin(phi);
  float z = r*cos(the);
  return vec3(x,y,z);
}

vec3 turbulence(vec3 p){
  p += sin(p.zxy   +uTime) * 1.  * .2;
  p += sin(p.zxy*2.+uTime) * .5  * .2;
  p += sin(p.zxy*4.+uTime) * .25 * .2;
  return p;
}

vec3 snoise3x3(vec3 p){
  vec3 v = vec3(
    snoise(p + vec3(1.,0.,0.)),
    snoise(p + vec3(0.,uTime,0.)),
    snoise(p + vec3(0.,0.,1.))
  );
  return normalize(v);
}

vec3 snoise3X3(vec3 p){
  vec3 offset1 = vec3(12.34, 56.78,   90.12);
  vec3 offset2 = vec3(54.32, 98.76+uTime, 21.09);
  vec3 offset3 = vec3(43.21, 87.65,   10.98);

  vec3 vel = vec3(
    snoise(p * vec3(1.) + offset1), // X轴噪音
    snoise(p * vec3(1.) + offset2), // Y轴噪音
    snoise(p * vec3(1.) + offset3)  // Z轴噪音
  );
  return normalize(vel);
}

void main(){
  vec3 p = csm_Position;
  vec3 p1 = rtp(p);
  // p1 = turbulence(p1);
  p1 += snoise3X3(cos(p1*2.))*.1;
  
  vCol = sin(vec3(3,2,1)+p1)*.5+.5;

  vec3 p2 = xyz(p1);
  csm_Position = p2;
}`,G=`#define GLSLIFY 1
varying vec3 vCol;

void main(){
  csm_FragColor = vec4(vCol*1.5, 1);
}`;function _(){const n={...j()},{geo:i}=c.useMemo(()=>{const t=new d(3,3).getAttribute("position"),x=t.count,s=[];for(let o=0;o<x;o++){const v=t.getX(o),a=t.getY(o),p=t.getZ(o),m=new r(v,a,p),l=new h(new r(0,0,0),m),y=new z(l,80,.01,4,!1);s.push(y)}return{geo:b(s)}},[]);return e.jsx("mesh",{geometry:i,children:e.jsx(w,{uniforms:n,baseMaterial:C,vertexShader:A,fragmentShader:G,depthWrite:!1,side:g,toneMapped:!1})})}function I(){return e.jsx(_,{})}const R=f(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(u,{dpr:[1,2],children:[e.jsx(D,{}),e.jsx(c.Suspense,{fallback:null,children:e.jsx(I,{})}),e.jsx(T,{children:e.jsx(L,{})})]}),e.jsx(S,{})]})});export{R as default};
