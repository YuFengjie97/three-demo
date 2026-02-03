import{w as j,o as e,r as b}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as T,O as C,d as D,e as L,U as s,n as A}from"./OrbitControls-eiKvL4JR.js";import{a as r}from"./asset-BvcpElq9.js";import{j as P}from"./three-custom-shader-material.es-Cha1eVdq.js";import{u as S}from"./useUniformTime-DkytjeC9.js";import{d as _,w as I}from"./index-Bt7jwiX8.js";import{L as N}from"./Loader-dsNry5om.js";import{u as n}from"./Texture-B2bj3WAc.js";import{c as U,b as M}from"./Instances-4zQFoRnP.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-DCTJ61Ca.js";const E=`#define GLSLIFY 1
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

void main(){
  float t = uTime;
  vUv = uv;
  vNdx = ndx;

  vec3 p = csm_Position;

  p = lookAt(p, cameraPosition, 0.) * p;

  p.z += snoise(vec3(p.xy*2., ndx + t)) * .1 ;

  p.y += sin(t + ndx*.1) * .2;

  csm_Position = p;
  vPos = csm_Position;
}`,F=`#define GLSLIFY 1
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

  vec3 col = sin(vec3(3,2,1) + vNdx * 10. + vPos + t*1.)*.5+.5;

  csm_FragColor = vec4(col * col.r * 2., d);
}
`,{random:c,PI:v,cos:m,sin:i}=Math;function G(){const u=n(r("/img/texture/fulu/1.jpg")),l=n(r("/img/texture/fulu/2.jpg")),p=n(r("/img/texture/fulu/3.jpg")),d={...S(),uTex1:new s(u),uTex2:new s(l),uTex3:new s(p)},[f,y]=U();return e.jsxs(f,{children:[e.jsx("planeGeometry",{args:[1,1,10,10],scale:2}),e.jsx(P,{uniforms:d,baseMaterial:L,side:D,vertexShader:E,fragmentShader:F,transparent:!0,alphaTest:.01,depthWrite:!1}),e.jsx(M,{name:"ndx",defaultValue:0}),Array.from({length:1e3}).map((O,x)=>{const o=c()*v,a=c()*v*2,t=c()*5+3,h=t*i(o)*m(a),z=t*i(o)*i(a),w=t*m(o),g=new A(h,z,w);return e.jsx(y,{ndx:x,position:g},x)})]})}const $=j(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(T,{camera:{position:[1,1,1]},children:[e.jsx("axesHelper",{args:[10]}),e.jsx(C,{}),e.jsx("ambientLight",{}),e.jsx(b.Suspense,{fallback:null,children:e.jsx(G,{})}),e.jsx(_,{children:e.jsx(I,{})})]}),e.jsx(N,{})]})});export{$ as default};
