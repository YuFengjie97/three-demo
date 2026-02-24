import{w as B,o as t,r as M}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as X,V as j,B as P,h as b,u as O,A as T,g as Z,U as L,ay as _,f as E}from"./extends-D4P9RtWV.js";import{u as G}from"./leva.esm-BV3Tl-wj.js";import{c as U}from"./simplex-noise-BUqOQ44_.js";import{j as q}from"./three-custom-shader-material.es-CZEjquAF.js";import{u as V}from"./useUniformTime-CJanb7xe.js";import{d as N,w as R}from"./index-jtwq2L8m.js";import{O as W}from"./OrbitControls-B0FQFszE.js";import{C as k}from"./Center-Kkdqflyh.js";import"./index-7OC5HNn7.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";import"./three-custom-shader-material.es-B7Ao4tUH.js";const K=`#define GLSLIFY 1
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

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
  }

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289(i);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

uniform float uTime;
uniform float uDelta;
uniform float ndx;
uniform float colorScale;
uniform vec3 colorOffset;

varying vec3 vCol;
varying float vAlpha;

void main(){
  vec3 p = csm_Position;

  vCol = sin(colorOffset+ndx*colorScale)*.5+.5;

  // vAlpha = smoothstep(-.5,.5,snoise(vec4(p, -uTime*.1)));
}
`,H=`#define GLSLIFY 1
varying vec3 vCol;
varying float vAlpha;

void main(){
  csm_FragColor = vec4(vCol*1., 1.);
}`,J=`#define GLSLIFY 1

attribute float ndx;
attribute float life;

varying vec3 vCol;

void main(){
  vec3 p = csm_Position;
  vCol = sin(vec3(3,2,1) + ndx)*.5+.5;
}`,Q=`#define GLSLIFY 1

varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv-.5);
  d = smoothstep(.5,.3,d);
  csm_FragColor = vec4(vCol*d*10., 1.);
}`,D=U(),{sin:$,random:Y}=Math;function ee({ndx:e,start:s,pointsGeo:h,sampleCount:w,sampleXGap:z,positionCount:c,noiseScale:x,noiseAmp:v,pointSpeed:S}){const p=V(),{colorScale:o,colorOffset:u}=G({colorScale:{value:1,min:.1,max:4,step:.01},colorOffset:{x:3,y:2,z:1}}),a={...p,ndx:new L(e),colorScale:new L(o),colorOffset:new L(new j(...Object.values(u)))},{curve:m,geo:r}=M.useMemo(()=>{const A=s.clone(),C=new j(x.x,x.y,x.z),d=[];for(let n=0;n<w;n++){const F=s.x+z*n,y=D(...A.multiply(C).toArray(),0+e*.1)*v,g=s.z+D(...A.multiply(C).toArray(),1+e*.1)*v,I=new j(F,y,g);d.push(I),A.copy(I)}const f=new _(d),i=new Float32Array(c*3);for(let n=0;n<c;n++){const F=n/c,y=f.getPointAt(F),g=n*3;i[g+0]=y.x,i[g+1]=y.y,i[g+2]=y.z}const l=new P;return l.setAttribute("position",new b(i,3)),{curve:f,geo:l}},[s,w,c,z,x,v]);return O((A,C)=>{const d=h.getAttribute("life"),f=(d.array[e]+C*(S+$(e*.2)*.1+.1))%1;d.array[e]=f;const i=m.getPointAt(f),l=h.getAttribute("position");l.array[e*3+0]=i.x,l.array[e*3+1]=i.y,l.array[e*3+2]=i.z}),t.jsx("line",{geometry:r,children:t.jsx(q,{uniforms:a,baseMaterial:E,vertexShader:K,fragmentShader:H,blending:T,transparent:!0,depthWrite:!1})})}function te(){const{count:e,gap:s}=G({count:{value:100,min:5,max:200,step:1},gap:{value:.1,min:.01,max:2,step:.01}}),h=M.useMemo(()=>Array.from({length:e},(u,a)=>{const m=a*s;return{start:new j(0,0,m),ndx:a,pointProgress:Y()}}),[e,s]),{sampleCount:w,sampleXGap:z,positionCount:c,noiseScale:x,noiseAmp:v,pointSpeed:S}=G({sampleCount:{value:10,min:5,max:20,step:1},sampleXGap:{value:4,min:1,max:10},positionCount:{value:200,min:50,max:200,step:1},noiseScale:{x:.5,y:.5,z:.5},noiseAmp:{value:1,min:.1,max:5},pointSpeed:{value:.1,min:.01,max:2,step:.01}}),{pointsGeo:p}=M.useMemo(()=>{const o=new P,u=new Float32Array(e*3);o.setAttribute("position",new b(u,3));const a=new Float32Array(e),m=new Float32Array(e);for(let r=0;r<e;r++)a[r]=Y(),m[r]=r;return o.setAttribute("life",new b(a,1)),o.setAttribute("ndx",new b(m,1)),{pointsGeo:o}},[e]);return O((o,u)=>{p.getAttribute("position").needsUpdate=!0,p.getAttribute("life").needsUpdate=!0}),t.jsxs(t.Fragment,{children:[t.jsx("points",{geometry:p,children:t.jsx(q,{baseMaterial:Z,vertexShader:J,fragmentShader:Q,transparent:!0,depthWrite:!1,blending:T,size:.3})}),h.map(o=>t.jsx(ee,{ndx:o.ndx,start:o.start,pointsGeo:p,sampleCount:w,sampleXGap:z,positionCount:c,noiseScale:x,noiseAmp:v,pointSpeed:S},o.ndx))]})}const fe=B(function(){return t.jsx("div",{className:"h-screen",children:t.jsxs(X,{camera:{position:[0,0,10]},children:[t.jsx(W,{}),t.jsx("group",{rotation:[.4,-.3,-0],children:t.jsx(k,{children:t.jsx(te,{})})}),t.jsx(N,{children:t.jsx(R,{})})]})})});export{fe as default};
