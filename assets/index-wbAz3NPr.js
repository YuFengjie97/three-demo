import{w as h,o as e,r}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as y,P as g,u as x,a as z,T as j,I as w,M as C,D as b}from"./extends-Btb7_Bq8.js";import{j as D}from"./three-custom-shader-material.es-BofixpVt.js";import{L as T,u as c}from"./leva.esm-B2CXSQv-.js";import{m as L}from"./BufferGeometryUtils-CCz_8P2C.js";import{a as l}from"./asset-BvcpElq9.js";import{E as S}from"./Environment-D2d2Gr9L.js";import{O as M}from"./OrbitControls-v2OwhzNa.js";import{L as _}from"./Loader-C1l0BEG2.js";import{u as A}from"./Helper-CvLiVaNp.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-BD7gSNfx.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";import"./constants-BcAQ6G3E.js";const F=`#define GLSLIFY 1
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

#define T uTime

uniform float uTime;
uniform bool uUseNoise4D;

attribute vec4 tangent;

varying vec3 aColor;

vec3 getDistortion(vec3 p){
  

  if(uUseNoise4D) {
    float v = snoise(vec4(p, T))*.5;
    v += snoise(vec4(p*2., T)) * .2;
    v += snoise(vec4(p*4., T)) * .1;
    p += v * normal;
  }else{
    p += (sin(p.zxy*1.*2. + T * 2.))*1.*.3;
    p += (sin(p.zxy*2.*2. - T * 2.))*.5*.3;
    p += (sin(p.zxy*4.*2. + T * 2.))*.2*.3;
  }
  

  return p;
}

void main(){
  float e = .01;

  vec3 pos = csm_Position.xyz;

  vec3 bi_tangent = normalize(cross(csm_Normal, tangent.xyz));
  vec3 posA = pos + tangent.xyz * e;
  vec3 posB = pos + bi_tangent * e;

  pos = getDistortion(pos);
  posA = getDistortion(posA);
  posB = getDistortion(posB);
  
  // 新的切线与副切线
  vec3 toA = normalize(posA - pos);
  vec3 toB = normalize(posB - pos);

  vec3 normal_new = normalize(cross(toA, toB));

  aColor = sin(vec3(3,2,1) + T + dot(cos(pos), vec3(1.1))) * .5 + .5;

  csm_Position.xyz = pos;
  csm_Normal = normal_new;
}`,I=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;

varying vec3 aColor;

void main(){
  // float t = uTime;

  // vec3 col = vec3(0);
  // col = sin(vec3(3,2,1) + t);

  csm_DiffuseColor = vec4(aColor, 1.);
  // csm_DiffuseColor = vec4(col, 1);
}`;function E({castShadow:s}){const t=r.useRef(null);x((n,i)=>{t.current.rotation.y+=i*1,t.current.rotation.x+=i*1});const o=z(j,l("/img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png"));return e.jsx(e.Fragment,{children:e.jsxs("mesh",{ref:t,castShadow:s,position:[4,0,0],children:[e.jsx("boxGeometry",{}),e.jsx("meshMatcapMaterial",{matcap:o})]})})}function G(){const s=r.useRef(null),{intensity:t}=c({intensity:{value:1,min:0,max:10,step:.1}});return x(o=>{const{clock:n}=o,i=n.getElapsedTime();s.current.position.x=Math.sin(i)*2,s.current.position.z=Math.cos(i)*2}),A(s,b,1),e.jsx(e.Fragment,{children:e.jsx("directionalLight",{ref:s,position:[3,3,0],castShadow:!0,intensity:t,"shadow-mapSize":[1024,1024]})})}function P(){return e.jsx(e.Fragment,{children:e.jsxs("mesh",{position:[0,-2,0],rotation:[-Math.PI/2,0,0],receiveShadow:!0,children:[e.jsx("planeGeometry",{args:[20,10]}),e.jsx("meshPhongMaterial",{color:16777215})]})})}function B(){const s=r.useRef(null),t={uTime:{value:0},uDelta:{value:0},uUseNoise4D:{value:!0}};x((a,m)=>{const{clock:d}=a,f=d.getElapsedTime();t.uDelta.value=m,t.uTime.value=f});const o=c({wireframe:!1,flatShading:!1,metalness:{value:0,min:0,max:1},roughness:{value:.2,min:0,max:1},ior:{value:1.5,min:0,max:2.33},transparent:!1,opacity:{value:0,min:0,max:1,render:a=>a("transparent")},transmission:{value:0,min:0,max:1}}),{detail:n}=c({detail:{value:20,min:4,max:40,step:1,order:-2}}),i=r.useMemo(()=>{const a=new w(2,n),m=L(a);return m.computeTangents(),m},[n]),p=i.attributes.position.count,[,u]=c(()=>({vertices:{value:0,disabled:!0,order:-1}}));r.useEffect(()=>{u({vertices:p})},[p]);const{shape:v}=c({shape:{options:{turbulance:!1,noise4D:!0},value:!0}});return t.uUseNoise4D.value=v,e.jsx(e.Fragment,{children:e.jsx("mesh",{geometry:i,children:e.jsx(D,{baseMaterial:C,ref:s,uniforms:t,vertexShader:F,fragmentShader:I,wireframe:o.wireframe,metalness:o.metalness,roughness:o.roughness,ior:o.ior,transparent:o.transparent,opacity:o.opacity,transmission:o.transmission})})})}const ee=h(function(){const t=l("/img/env/hdr/sunny_rose_garden_1k.hdr");return e.jsxs(e.Fragment,{children:[e.jsx(T,{}),e.jsxs("div",{className:"h-screen",children:[e.jsx(y,{shadows:{type:g,enabled:!0},children:e.jsxs(r.Suspense,{fallback:null,children:[e.jsx(S,{files:t,background:!0}),e.jsx(M,{}),e.jsx("ambientLight",{intensity:1}),e.jsx(G,{}),e.jsx("axesHelper",{args:[20]}),e.jsx(E,{castShadow:!0}),e.jsx(P,{}),e.jsx(B,{})]})}),e.jsx(_,{})]})]})});export{ee as default};
