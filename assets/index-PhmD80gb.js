import{w as l,o as e,r as n}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as p,O as u,u as f,b as y,c as x,d,M as h,D as g}from"./OrbitControls-wRqzCdd_.js";import{u as C}from"./leva.esm-BV3Tl-wj.js";import{j as z}from"./three-custom-shader-material.es-00gjT4E9.js";import{m as b}from"./BufferGeometryUtils-C2JSD5wI.js";import{u as w}from"./useUniformTime-BN-1ekZ-.js";import{P as j}from"./Perf-BYAwScHX.js";import{u as D}from"./Helper-BjE47Npo.js";import"./index-7OC5HNn7.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";import"./three-custom-shader-material.es-WfkYmuit.js";const S=`#define GLSLIFY 1
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

#define T uTime

uniform float uTime;
uniform vec3 uDepthCol;
uniform vec3 uSurfaceCol;

attribute vec4 tangent;

varying vec3 vCol;

float fbm(vec2 p, float t){
  float v = 0.;
  float fre = 1.;
  float amp = 1.;
  for(float i=0.;i<5.;i++){
    v += snoise(vec3(p * fre, t)) * amp;
    fre *= 2.;
    amp *= .3;
  }
  return v;
}

float wave(inout vec3 p){

  float t = T * .5;

  // vec2 q = vec2(
  //   fbm(p.xy * .1, 1.1),
  //   fbm(p.xy * .1, 2.2)
  // );

  float v = fbm(p.xy*.25, t); 

  p.z += v*.3;
  return v;
}

vec3 calcNormal(inout vec3 pos){
  float e = .01;
  vec3 bi_tangent = normalize(cross(csm_Normal, tangent.xyz));
  vec3 posA = pos + tangent.xyz * e;
  vec3 posB = pos + bi_tangent * e;

  wave(pos);
  wave(posA);
  wave(posB);

  vec3 toA = posA - pos;
  vec3 toB = posB - pos;

  vec3 normal = normalize(cross(toA, toB));
  return normal;
}

void main(){
  vec3 pos = csm_Position.xyz;

  float v = wave(pos);

  vCol = mix(uSurfaceCol, uDepthCol, smoothstep(1.,-1.,v));

  csm_Normal = calcNormal(pos);
  csm_Position.xyz = pos;
}`,L=`#define GLSLIFY 1
uniform vec3 uDepthCol;
uniform vec3 uSurfaceCol;

varying vec3 vCol;

void main(){
  csm_DiffuseColor.rgb = vCol;
}`;function M(){const o=n.useMemo(()=>{const a=new y(10,10,300,300),c=b(a);return c.computeTangents(),a.dispose(),c},[]),i=w(),t=n.useMemo(()=>({...i,uDepthCol:{value:new x(1449539)},uSurfaceCol:{value:new x(56319)}}),[]),{depthCol:r,surfaceCol:s,metalness:v,roughness:m}=C({surfaceCol:"#"+t.uSurfaceCol.value.getHexString(),depthCol:"#"+t.uDepthCol.value.getHexString(),metalness:{value:.5,min:0,max:1},roughness:{value:0,min:0,max:1}});return n.useEffect(()=>{t.uDepthCol.value.set(r),t.uSurfaceCol.value.set(s)},[r,s,t]),e.jsx(e.Fragment,{children:e.jsx("mesh",{geometry:o,rotation:[-Math.PI/2,0,0],children:e.jsx(z,{baseMaterial:h,vertexShader:S,fragmentShader:L,uniforms:t,side:d,metalness:v,roughness:m})})})}function _(){const o=n.useRef(null);return D(o,g,1),f((i,t)=>{const{clock:r}=i,s=r.getElapsedTime();o.current.position.x=Math.cos(s)*3,o.current.position.z=Math.sin(s)*3}),e.jsx(e.Fragment,{children:e.jsx("directionalLight",{ref:o,position:[0,2,0]})})}const Y=l(function(){return console.log("sea page console test"),e.jsx(e.Fragment,{children:e.jsx("div",{className:"h-screen",children:e.jsxs(p,{camera:{position:[0,2,4]},children:[e.jsx(j,{position:"top-left"}),e.jsx("ambientLight",{}),e.jsx(_,{}),e.jsx("axesHelper",{args:[20]}),e.jsx(u,{}),e.jsx(M,{})]})})})});export{Y as default};
