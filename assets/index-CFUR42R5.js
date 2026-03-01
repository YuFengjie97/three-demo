import{w,o,r as d}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as b,u as z,h as j,U as m,A as T,e as A}from"./extends-INE2Z42_.js";import{u as h}from"./useUniformTime-BcW4F0GW.js";import{u as D}from"./leva.esm-B2CXSQv-.js";import{d as P,w as S}from"./index-DwxtmhpU.js";import{a as _}from"./asset-BvcpElq9.js";import{O as L}from"./OrbitControls-DPBZ4Sb0.js";import{L as F}from"./Loader-DFF8_diB.js";import{u as I}from"./Gltf-DqGGI8tR.js";import{G as M}from"./GPUComputationRenderer-BOZPxWGn.js";import"./index-7OC5HNn7.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";import"./constants-DUBAsCr2.js";const V=`#define GLSLIFY 1
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
varying float vFade;

void main(){
  vec4 particle = texture(gpuPos, pCoord);
  vec3 pos = particle.xyz;
  float life = particle.w;

  // life fade in out
  float fade = smoothstep(0.,.5,life) * smoothstep(1.,.6,life);
  vFade = fade;

  vec4 worldPos = modelMatrix * vec4(pos, 1.);
  vec4 viewPos = viewMatrix * worldPos;
  vec4 projectionPos = projectionMatrix * viewPos;

  vCol = sin(vec3(3,2,1)+vec3(0,uTime,0)+dot(pos,vec3(.1)))*.5+.5;
  // vCol = vec3(1,1,1.);
  // float n = smoothstep(0.,1.,snoise3(pos+vec3(uTime)));
  // vCol.b += n*2.;

  gl_PointSize = size * (1. / -viewPos.z);
  // gl_PointSize = fade * size * (1. / -viewPos.z);
  gl_Position = projectionPos;
}`,G=`#define GLSLIFY 1
varying float vAlpha;
varying vec3 vCol;
varying float vFade;

void main(){
  vec2 uv = gl_PointCoord;
  float d = length(uv-.5);
  d = smoothstep(.5,0.4,d);

  gl_FragColor = vec4(vCol*d*1.5*vFade,  d*vFade);
}`,E=`#define GLSLIFY 1
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
  vec3 vel = snoise3x3(pos*.2) * 10. * strength;
  // vec3 vel = turbulence(pos) * strength;

  // 绕轴旋转
  {
    vec3 velRot = rotVel(pos);
    vel += velRot * 2.;
  }

  pos += normalize(vel) * uDelta * particleVel * 5.;
  gl_FragColor = vec4(pos, life);
}`,{ceil:g,floor:q,random:N,sqrt:C}=Math;function R(i){const c=i.getAttribute("position"),s=c.array,u=c.count,x=g(C(u)),{gl:l}=A(),f=e=>{const t=e.image.data;for(let r=0;r<u;r++){const a=r*4,y=r*3;t[a+0]=s[y+0],t[a+1]=s[y+1],t[a+2]=s[y+2],t[a+3]=N()}},p=h(),{gpu:v,posVar:n}=d.useMemo(()=>{const e=new M(x,x,l),t=e.createTexture();f(t);const r=e.addVariable("posTex",E,t);return e.setVariableDependencies(r,[r]),r.material.uniforms={...p,defPos:new m(t),lifeSpeed:new m(1),particleVel:new m(1.5)},e.init(),{gpu:e,posVar:r}},[x]);return D({lifeSpeed:{value:n.material.uniforms.lifeSpeed.value,min:.1,max:4,step:.01,onChange(e){n.material.uniforms.lifeSpeed.value=e}},particleVel:{value:1.5,min:.1,max:10,step:.01,onChange(e){n.material.uniforms.particleVel.value=e}}}),{gpu:v,posVar:n,count:u,size:x}}function O(){const{nodes:i,materials:c}=I(_("/model/storm-transformed.glb")),s=i.Spiral002.geometry;return s.setIndex(null),s}function U(){const{geo:i}=d.useMemo(()=>{const l=O(),p=l.getAttribute("position").count,v=g(C(p)),n=new Float32Array(p*2);for(let e=0;e<p;e++){const t=q(e/v),r=e-t*v,a=e*2;n[a+0]=(r+.5)/v,n[a+1]=(t+.5)/v}return l.setAttribute("pCoord",new j(n,2)),{geo:l}},[]),{gpu:c,posVar:s}=R(i),x={...h(),size:new m(10),gpuPos:new m(c.getCurrentRenderTarget(s).texture)};return z(()=>{c.compute()}),o.jsx("points",{geometry:i,scale:10,children:o.jsx("shaderMaterial",{uniforms:x,vertexShader:V,fragmentShader:G,transparent:!0,depthWrite:!1,blending:T})})}function B(){const i=d.useRef(null);return z((c,s)=>{}),o.jsx("group",{ref:i,scale:.01,children:o.jsx(U,{})})}const ie=w(function(){return o.jsxs("div",{className:"h-screen",children:[o.jsxs(b,{camera:{position:[0,0,4]},children:[o.jsx(L,{target:[0,0,0]}),o.jsx(d.Suspense,{fallback:null,children:o.jsx(B,{})}),o.jsx(P,{children:o.jsx(S,{})})]}),o.jsx(F,{})]})});export{ie as default};
