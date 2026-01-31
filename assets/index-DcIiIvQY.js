import{w as D,o as e,r as C}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as I,O as S,U as y,u as _,d as L,e as F,V as g,al as G}from"./OrbitControls-CmBRG4Bd.js";import{a as M}from"./asset-BvcpElq9.js";import{j as A}from"./three-custom-shader-material.es-B41VK_Vk.js";import{u as T}from"./useUniformTime-DeKYjdeE.js";import{P as R}from"./Perf-9NpNtL2P.js";import{u as b}from"./Gltf-DVFD5mtA.js";import{c as U,b as h}from"./Instances-Du4Tn6x4.js";import{G as Y}from"./GPUComputationRenderer-xQpHA_J4.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-DobAws7m.js";import"./index-n5PR1bfd.js";import"./client-EdRjCdko.js";import"./constants-kCI-iZVw.js";const E=`#define GLSLIFY 1
uniform float uTime;
uniform sampler2D uTexPos;
uniform sampler2D uTexVel;

attribute float instanceId;
attribute vec2 texCoord;

varying vec3 vCol;
varying vec3 vPos;
varying vec2 vUv;

mat2 rotate(float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c,-s,s,c);
}

mat3 rotateX(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(
    1,0,0,
    0,c,-s,
    0,s,c
  );
}
mat3 rotateY(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(
    c,0,s,
    0,1,0,
    -s,0,c
  );
}
mat3 rotateZ(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(
    c,-s,0,
    s,c,0,
    0,0,1
  );
}

void main(){

  float t = uTime;

  float id = instanceId;

  // 这里是模型的顶点位置,不是gpu里的粒子位置
  vec3 pos = csm_Position;

  // 因为用的是csm,不需要手动对mesh的变换进行手动转换
  // pos = mat3(modelMatrix) * pos;

  // 速度向量
  vec3 vel = texture(uTexVel, texCoord).rgb;

  float the = acos(vel.y);
  float phi = atan(vel.z, vel.x);
  pos = rotateY(phi) * rotateZ(the+PI) *  pos;  // 这里theta + PI 是因为模型默认指向vec3(0,-1,0)

  // 所有顶点位置都按照gpu粒子位置进行偏移来更新模型位置
  pos += texture(uTexPos, texCoord).rgb;

  vUv = uv;
  vPos = pos;
  vCol = sin(vec3(3,2,1) + id*1.3)*.5+.5;
  csm_Position = pos;
}`,q=`#define GLSLIFY 1
varying vec3 vPos;
varying vec3 vCol;
varying vec2 vUv;

void main(){
  
  vec3 col = vCol;
  // float d = length(vUv);
  // d = .1/d;

  csm_DiffuseColor.rgb = col;
}`,N=`#define GLSLIFY 1

uniform float uTime;
uniform float uDelta;

void main(){
  float t = uTime;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  vec3 pos = texture(texPos, uv).rgb;
  vec3 vel = texture(texVel, uv).rgb;
  

  // pos += vel * .1;

  gl_FragColor = vec4(pos, 1.);
}`,O=`#define GLSLIFY 1
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

void main(){
  float t = uTime;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture(texPos, uv).rgb;

  vec3 vel = normalize(vec3(
    snoise(pos * .04 + vec3(1,0,0)),
    snoise(pos * .04 + vec3(0,1,t)),
    snoise(pos * .04 + vec3(0,0,1))
  ));

  // vec3 vel = normalize(sin(vec3(3,2,1) + t));
  // vec3 vel = normalize(vec3(1,1,0));

  gl_FragColor = vec4(vel, 1.);
}`,{random:p,sqrt:z,ceil:w,floor:B}=Math,j=M("/model/sword-transformed.glb");b.preload(j);function Z(x){const o=x.image.data;for(let r=0;r<o?.length;r++){const s=r*4;o[s+0]=(p()-.5)*10,o[s+1]=(p()-.5)*10,o[s+2]=(p()-.5)*10,o[s+3]=p()}}function k(x){const{gl:o}=G(),r=w(z(x)),s=T(),{gpu:l,posVar:c,velVar:n}=C.useMemo(()=>{const t=new Y(r,r,o),v=t.createTexture();Z(v);const d=t.createTexture(),a=t.addVariable("texPos",N,v),i=t.addVariable("texVel",O,d);return a.material.uniforms={...s},i.material.uniforms={...s},t.setVariableDependencies(a,[a,i]),t.setVariableDependencies(i,[a,i]),t.init(),{gpu:t,posVar:a,velVar:i}},[o,r]);return{gpu:l,posVar:c,velVar:n}}function H(){const{nodes:x,materials:o}=b(j),[r,s]=U(),l=4,c=w(z(l)),{gpu:n,posVar:t,velVar:v}=k(l),a={...T(),uTexPos:new y(n.getCurrentRenderTarget(t).texture),uTexVel:new y(n.getCurrentRenderTarget(v).texture)},i=C.useRef(null);return _(()=>{n.compute(),a.uTexPos.value=n.getCurrentRenderTarget(t).texture,a.uTexVel.value=n.getCurrentRenderTarget(v).texture,i.current.map=n.getCurrentRenderTarget(t).texture}),e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{scale:3,children:[e.jsx("planeGeometry",{}),e.jsx("meshBasicMaterial",{side:L,ref:i})]}),e.jsxs(r,{limit:1e3,range:1e3,geometry:x["Freedom-Sworn_mesh_Freedom-Sworn_0001"].geometry,children:[e.jsx(A,{baseMaterial:F,uniforms:a,vertexShader:E,fragmentShader:q}),e.jsx(h,{name:"instanceId",defaultValue:0}),e.jsx(h,{name:"texCoord",defaultValue:new g(1,1)}),Array.from({length:l}).map((X,m)=>{const V=m;let u=B(m/c),P=(m-u*c+.5)/c;u=(u+.5)/c;const f=new g(P,u);return console.log(m,f),e.jsx(s,{scale:.2,instanceId:V,texCoord:f},m)})]})]})}const xe=D(function(){return e.jsx("div",{className:"h-screen",children:e.jsxs(I,{children:[e.jsx(R,{position:"top-left"}),e.jsx("axesHelper",{args:[10]}),e.jsx("ambientLight",{}),e.jsx(S,{makeDefault:!0}),e.jsx(H,{})]})})});export{xe as default};
