import{w as B,o as t,r as S}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as X,V as j,B as P,h as b,u as O,A as T,g as Z,U as M,ay as _,f as E}from"./extends-Btb7_Bq8.js";import{u as G}from"./leva.esm-B2CXSQv-.js";import{c as U}from"./simplex-noise-BUqOQ44_.js";import{j as q}from"./three-custom-shader-material.es-BofixpVt.js";import{u as V}from"./useUniformTime-CVLlM9Vi.js";import{d as N,w as R}from"./index-_U1Z32ti.js";import{O as k}from"./OrbitControls-v2OwhzNa.js";import{C as W}from"./Center-BT5cnabd.js";import{L as K}from"./Loader-C1l0BEG2.js";import"./index-7OC5HNn7.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";import"./three-custom-shader-material.es-BD7gSNfx.js";const H=`#define GLSLIFY 1
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
`,J=`#define GLSLIFY 1
varying vec3 vCol;
varying float vAlpha;

void main(){
  csm_FragColor = vec4(vCol*1., 1.);
}`,Q=`#define GLSLIFY 1

attribute float ndx;
attribute float life;

varying vec3 vCol;

void main(){
  vec3 p = csm_Position;
  vCol = sin(vec3(3,2,1) + ndx)*.5+.5;
}`,$=`#define GLSLIFY 1

varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv-.5);
  d = smoothstep(.5,.3,d);
  csm_FragColor = vec4(vCol*d*10., 1.);
}`,D=U(),{sin:ee,random:Y}=Math;function te({ndx:e,start:s,pointsGeo:g,sampleCount:w,sampleXGap:z,positionCount:c,noiseScale:x,noiseAmp:v,pointSpeed:F}){const p=V(),{colorScale:o,colorOffset:u}=G({colorScale:{value:1,min:.1,max:4,step:.01},colorOffset:{x:3,y:2,z:1}}),a={...p,ndx:new M(e),colorScale:new M(o),colorOffset:new M(new j(...Object.values(u)))},{curve:l,geo:r}=S.useMemo(()=>{const A=s.clone(),C=new j(x.x,x.y,x.z),d=[];for(let n=0;n<w;n++){const L=s.x+z*n,y=D(...A.multiply(C).toArray(),0+e*.1)*v,h=s.z+D(...A.multiply(C).toArray(),1+e*.1)*v,I=new j(L,y,h);d.push(I),A.copy(I)}const f=new _(d),i=new Float32Array(c*3);for(let n=0;n<c;n++){const L=n/c,y=f.getPointAt(L),h=n*3;i[h+0]=y.x,i[h+1]=y.y,i[h+2]=y.z}const m=new P;return m.setAttribute("position",new b(i,3)),{curve:f,geo:m}},[s,w,c,z,x,v]);return O((A,C)=>{const d=g.getAttribute("life"),f=(d.array[e]+C*(F+ee(e*.2)*.1+.1))%1;d.array[e]=f;const i=l.getPointAt(f),m=g.getAttribute("position");m.array[e*3+0]=i.x,m.array[e*3+1]=i.y,m.array[e*3+2]=i.z}),t.jsx("line",{geometry:r,children:t.jsx(q,{uniforms:a,baseMaterial:E,vertexShader:H,fragmentShader:J,blending:T,transparent:!0,depthWrite:!1})})}function oe(){const{count:e,gap:s}=G({count:{value:100,min:5,max:200,step:1},gap:{value:.1,min:.01,max:2,step:.01}}),g=S.useMemo(()=>Array.from({length:e},(u,a)=>{const l=a*s;return{start:new j(0,0,l),ndx:a,pointProgress:Y()}}),[e,s]),{sampleCount:w,sampleXGap:z,positionCount:c,noiseScale:x,noiseAmp:v,pointSpeed:F}=G({sampleCount:{value:10,min:5,max:20,step:1},sampleXGap:{value:4,min:1,max:10},positionCount:{value:200,min:50,max:200,step:1},noiseScale:{x:.5,y:.5,z:.5},noiseAmp:{value:1,min:.1,max:5},pointSpeed:{value:.1,min:.01,max:2,step:.01}}),{pointsGeo:p}=S.useMemo(()=>{const o=new P,u=new Float32Array(e*3);o.setAttribute("position",new b(u,3));const a=new Float32Array(e),l=new Float32Array(e);for(let r=0;r<e;r++)a[r]=Y(),l[r]=r;return o.setAttribute("life",new b(a,1)),o.setAttribute("ndx",new b(l,1)),{pointsGeo:o}},[e]);return O((o,u)=>{p.getAttribute("position").needsUpdate=!0,p.getAttribute("life").needsUpdate=!0}),t.jsxs(t.Fragment,{children:[t.jsx("points",{geometry:p,children:t.jsx(q,{baseMaterial:Z,vertexShader:Q,fragmentShader:$,transparent:!0,depthWrite:!1,blending:T,size:.3})}),g.map(o=>t.jsx(te,{ndx:o.ndx,start:o.start,pointsGeo:p,sampleCount:w,sampleXGap:z,positionCount:c,noiseScale:x,noiseAmp:v,pointSpeed:F},o.ndx))]})}const he=B(function(){return t.jsxs("div",{className:"h-screen",children:[t.jsxs(X,{camera:{position:[0,0,10]},children:[t.jsx(k,{}),t.jsx(S.Suspense,{fallback:null,children:t.jsx("group",{rotation:[.4,-.3,-0],children:t.jsx(W,{children:t.jsx(oe,{})})})}),t.jsx(N,{children:t.jsx(R,{})})]}),t.jsx(K,{})]})});export{he as default};
