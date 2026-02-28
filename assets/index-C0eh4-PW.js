import{w as b,o as e,r as C}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as j,d as D,f as T,U as r,V as A}from"./extends-BhofGCXz.js";import{a as x}from"./asset-BvcpElq9.js";import{j as L}from"./three-custom-shader-material.es-Doi8FQpv.js";import{u as _}from"./useUniformTime-BKY4rfaT.js";import{d as I,w as P}from"./index-CmBrlDeP.js";import{O as S}from"./OrbitControls-BLiDvAIL.js";import{L as M}from"./Loader-B07yCGYR.js";import{u as s}from"./Texture-BlwqjH7Q.js";import{c as N,b as U}from"./Instances-BXq0h5OZ.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-CJiU6NmO.js";const E=`#define GLSLIFY 1
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

attribute float ndx;

varying vec2 vUv;
varying float vNdx;
varying vec3 vPos;

// https://www.shadertoy.com/view/lsKcDD
mat3 lookAt( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);            // 相机前
	vec3 cp = vec3(sin(cr), cos(cr),0.0);  // 滚角
	vec3 cu = normalize( cross(cw,cp) );   // 相机右
	vec3 cv = normalize( cross(cu,cw) );   // 相机上
  return mat3( cu, cv, cw );
}

mat3 lookAt2(vec3 origin, vec3 target){
  vec3 fwd = normalize(target - origin);
  vec3 globalUp = vec3(0.0, 1.0, 0.0);
  vec3 right = normalize(cross(globalUp, fwd));
    // 检查长度。如果长度接近0，说明 fwd 和 globalUp 平行（相机在正上方/正下方）
  if (length(right) < 0.0001) {
    // 这种情况下，我们强制使用 Z 轴作为参考向量来重新计算 Right
    // 这样可以避免变为 0 向量
    right = normalize(cross(vec3(0.0, 0.0, 1.0), fwd));
  }
  vec3 up = cross(fwd, right);
  return mat3(right, up, fwd);
}

void main(){
  float t = uTime;
  vUv = uv;
  vNdx = ndx;

  vec3 p = csm_Position;

  p = lookAt(p, cameraPosition, 0.) * p;
  // p = lookAt2(p, cameraPosition) * p;

  p.z += snoise(vec3(p.xy*2., ndx + t)) * .1 ;

  p.y += sin(t + ndx*.1) * .2;

  csm_Position = p;
  vPos = csm_Position;
}`,G=`#define GLSLIFY 1
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
uniform sampler2D uTex1;
uniform sampler2D uTex2;
uniform sampler2D uTex3;

varying vec2 vUv;
varying float vNdx;
varying vec3 vPos;

void main(){
  float t = uTime;

  float i = floor(mod(vNdx, 3.));
  float d = 0.;
  if(i==0.){
    d = texture(uTex1, vUv).b;
  }
  else if(i==1.){
    d = texture(uTex2, vUv).b;
  }
  else if(i==2.){
    d = texture(uTex3, vUv).b;
  }

  vec3 col = sin(vec3(3,2,1) + vNdx + vPos + t*1.)*.5+.5;

  csm_FragColor = vec4(col*2.1, d);
}
`,{random:c,PI:a,cos:m,sin:i}=Math;function k(){const l=s(x("/img/texture/fulu/1.jpg")),p=s(x("/img/texture/fulu/2.jpg")),y=s(x("/img/texture/fulu/3.jpg")),u={..._(),uTex1:new r(l),uTex2:new r(p),uTex3:new r(y)},[d,f]=N();return e.jsxs(d,{children:[e.jsx("planeGeometry",{args:[1,1,10,10],scale:2}),e.jsx(L,{uniforms:u,baseMaterial:T,side:D,vertexShader:E,fragmentShader:G,transparent:!0,alphaTest:.01,depthWrite:!1}),e.jsx(U,{name:"ndx",defaultValue:0}),Array.from({length:1e3}).map((O,n)=>{const o=c()*a,v=c()*a*2,t=c()*5+3,h=t*i(o)*m(v),z=t*i(o)*i(v),g=t*m(o),w=new A(z,g,h);return e.jsx(f,{ndx:n,position:w},n)})]})}const ee=b(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(j,{camera:{position:[1,1,1]},children:[e.jsx(S,{makeDefault:!0,minPolarAngle:.5,maxPolarAngle:Math.PI-.5}),e.jsx("ambientLight",{}),e.jsx(C.Suspense,{fallback:null,children:e.jsx(k,{})}),e.jsx(I,{children:e.jsx(P,{})})]}),e.jsx(M,{})]})});export{ee as default};
