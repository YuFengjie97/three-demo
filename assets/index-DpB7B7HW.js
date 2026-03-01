import{w as j,o as e,r as u}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as A,u as z,h,U as p,A as D,B as L,e as P}from"./extends-Btb7_Bq8.js";import{u as g}from"./useUniformTime-CVLlM9Vi.js";import{u as T}from"./leva.esm-B2CXSQv-.js";import{d as S,w as _}from"./index-_U1Z32ti.js";import{a as M}from"./asset-BvcpElq9.js";import{O as I}from"./OrbitControls-v2OwhzNa.js";import{L as F}from"./Loader-C1l0BEG2.js";import{u as G}from"./Gltf-CyvgIdbj.js";import{G as V}from"./GPUComputationRenderer-Dn9lDRZf.js";import"./index-7OC5HNn7.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";import"./constants-BcAQ6G3E.js";const E=`#define GLSLIFY 1
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

#define PI 3.1415926

uniform float uTime;
uniform float size;
uniform sampler2D gpuPos;

attribute vec2 pCoord;

varying float vAlpha;
varying vec3 vCol;

void main(){
  vec4 particle = texture(gpuPos, pCoord);
  vec3 pos = particle.xyz;
  float life = particle.w;

  // life fade in out
  float fade = smoothstep(0.,.5,life) * smoothstep(1.,.6,life);

  vec4 worldPos = modelMatrix * vec4(pos, 1.);
  vec4 viewPos = viewMatrix * worldPos;
  vec4 projectionPos = projectionMatrix * viewPos;

  // vCol = sin(vec3(3,2,1)+dot(pos,vec3(2.)))*.5+.5;
  vCol = vec3(1,1,1.);
  float n = smoothstep(0.,1.,snoise(pos+vec3(uTime)));
  vCol.b += n*2.;

  gl_PointSize = fade * size * (1. / -viewPos.z);
  gl_Position = projectionPos;
}`,q=`#define GLSLIFY 1
varying float vAlpha;
varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord;
  float d = length(uv-.5);
  d = smoothstep(.5,0.4,d);

  gl_FragColor = vec4(vCol*d*1.5,  d);
}`,N=`#define GLSLIFY 1
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
uniform sampler2D defPos;
uniform float lifeSpeed;
uniform float particleVel;

vec3 snoise3x3(vec3 p){
  vec3 v = normalize(vec3(
    snoise(p+vec3(1,0,0)*uTime*.5),
    snoise(p+vec3(0,1,0)*uTime*.5),
    snoise(p+vec3(0,0,1)*uTime*.5)
  ));
  return v;
}

vec3 turbulence(vec3 p){
  p += sin(p.zxy);
  p += sin(p.zxy*2.)*.5;
  p += sin(p.zxy*4.)*.25;
  return p;
}

vec3 rotVel(vec3 p){
  vec3 toCenter = normalize(p);
  // vec3 axes = normalize(vec3(.5,1.,1.)); // 轴向量
  vec3 axes = normalize(vec3(0,1.,0)); // 轴向量
  vec3 v = normalize(cross(toCenter, axes));
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(posTex, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;

  vec3 pos0 = texture(defPos, uv).xyz;

  life += uDelta*lifeSpeed;
  if(life>1.){
    life = fract(life);
    pos = pos0;
  }

  // 基础噪音扰动
  float strength = smoothstep(0.5, 1.,snoise(pos+vec3(uTime))) + .1;
  vec3 vel = snoise3x3(pos*5.) * 10. * strength;
  // vec3 vel = turbulence(pos) * strength;

  // 绕轴旋转
  {
    vec3 velRot = rotVel(pos);
    vel += velRot * 2.;
  }

  // 趋向pos.y=0平面
  {
    // float strength = smoothstep(0., 3., abs(pos.y));
    // vec3 velLim = normalize(vec3(pos.x,0.,pos.z)-pos);
    // vel += velLim * strength*1.3;
  }

  pos += normalize(vel) * uDelta * particleVel * .1;
  gl_FragColor = vec4(pos, life);
}`,R=`#define GLSLIFY 1
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

#define PI 3.1415926
#define s1(v) (sin(v)*.5+.5)

uniform float size;
uniform float uTime;
uniform float uDelta;

attribute float aLife;

varying float vAlpha;
varying vec3 vCol;

void main(){
  vec3 pos = position;
  pos.y += fract(uTime * aLife) * 20.;

  float life = fract(aLife+uTime*.1);

  vec4 worldPos = modelMatrix * vec4(pos, 1.);
  vec4 viewPos = viewMatrix * worldPos;
  vec4 projectionPos = projectionMatrix * viewPos;

  // vCol = sin(vec3(3,2,1)+dot(pos,vec3(2.)))*.5+.5;
  vCol = vec3(1,1,1.);
  float n = smoothstep(0.,1.,snoise(pos));
  vCol.b += n*4.;

  gl_PointSize = size * (1. / -viewPos.z);
  gl_Position = projectionPos;
}`,B=`#define GLSLIFY 1
varying float vAlpha;
varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord;
  float d = length(uv-.5);
  d = smoothstep(.5,-.4,d);

  gl_FragColor = vec4(vCol*d*3.5,  d);
}`,{ceil:C,floor:O,random:w,sqrt:b}=Math;function Y(i){const a=i.getAttribute("position"),t=a.array,v=a.count,r=C(b(v)),{gl:y}=P(),l=o=>{const x=o.image.data;for(let s=0;s<v;s++){const d=s*4,f=s*3;x[d+0]=t[f+0],x[d+1]=t[f+1],x[d+2]=t[f+2],x[d+3]=w()}},n=g(),{gpu:m,posVar:c}=u.useMemo(()=>{const o=new V(r,r,y),x=o.createTexture();l(x);const s=o.addVariable("posTex",N,x);return o.setVariableDependencies(s,[s]),s.material.uniforms={...n,defPos:new p(x),lifeSpeed:new p(1),particleVel:new p(2.5)},o.init(),{gpu:o,posVar:s}},[r]);return T({lifeSpeed:{value:c.material.uniforms.lifeSpeed.value,min:.1,max:4,step:.01,onChange(o){c.material.uniforms.lifeSpeed.value=o}},particleVel:{value:2.5,min:.1,max:10,step:.01,onChange(o){c.material.uniforms.particleVel.value=o}}}),{gpu:m,posVar:c,count:v,size:r}}function U(){const{nodes:i,materials:a}=G(M("/model/universe-transformed.glb")),t=i.universe.geometry;return t.setIndex(null),t}function W(){const{geo:i}=u.useMemo(()=>{const r=U(),l=r.getAttribute("position").count,n=C(b(l)),m=new Float32Array(l*2);for(let c=0;c<l;c++){const o=O(c/n),x=c-o*n,s=c*2;m[s+0]=(x+.5)/n,m[s+1]=(o+.5)/n}return r.setAttribute("pCoord",new h(m,2)),{geo:r}},[]),{gpu:a,posVar:t}=Y(i),v={size:new p(10),gpuPos:new p(a.getCurrentRenderTarget(t).texture)};return z(()=>{a.compute()}),e.jsx("points",{geometry:i,scale:10,children:e.jsx("shaderMaterial",{uniforms:v,vertexShader:E,fragmentShader:q,transparent:!0,depthWrite:!1,blending:D})})}function k(){return e.jsxs("mesh",{children:[e.jsx("icosahedronGeometry",{args:[.1,2]}),e.jsx("meshBasicMaterial",{toneMapped:!1,color:[10,10,10]})]})}function H(){const i=u.useMemo(()=>{const v=new L,r=300,y=new Float32Array(r*3);v.setAttribute("position",new h(y,3));const l=new Float32Array(r);for(let n=0;n<r;n++)l[n]=w();return v.setAttribute("aLife",new h(l,1)),v},[]),t={...g(),size:new p(100)};return e.jsx("points",{geometry:i,children:e.jsx("shaderMaterial",{uniforms:t,vertexShader:R,fragmentShader:B,transparent:!0,depthWrite:!1})})}function J(){const i=u.useRef(null);return z((a,t)=>{i.current.rotation.y-=t*.1}),e.jsxs("group",{ref:i,rotation:[.4,0,-.5],children:[e.jsx(W,{}),e.jsx(k,{}),e.jsx(H,{})]})}const ae=j(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(A,{camera:{position:[0,2,6]},children:[e.jsx(I,{target:[0,1,0]}),e.jsx(u.Suspense,{fallback:null,children:e.jsx(J,{})}),e.jsx(S,{children:e.jsx(_,{})})]}),e.jsx(F,{})]})});export{ae as default};
