import{r as e,w as C,o as c}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{_ as p,u as z,af as f,ae as A,V as E,C as j,g as L}from"./extends-BhofGCXz.js";import{j as D}from"./three-custom-shader-material.es-Doi8FQpv.js";import{u as M}from"./useUniformTime-BKY4rfaT.js";import{a as P}from"./asset-BvcpElq9.js";import{O as I}from"./OrbitControls-BLiDvAIL.js";import{u as T}from"./Gltf-t8lXtj8T.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-CJiU6NmO.js";import"./constants-BkWHBZ1v.js";let i,m;const S=e.createContext(null),g=new A,b=new E,U=e.forwardRef(({children:a,range:o,limit:r=1e3,...n},s)=>{const t=e.useRef(null);e.useImperativeHandle(s,()=>t.current,[]);const[u,x]=e.useState([]),[[l,d,y]]=e.useState(()=>[new Float32Array(r*3),Float32Array.from({length:r*3},()=>1),Float32Array.from({length:r},()=>1)]);e.useEffect(()=>{t.current.geometry.attributes.position.needsUpdate=!0}),z(()=>{for(t.current.updateMatrix(),t.current.updateMatrixWorld(),g.copy(t.current.matrixWorld).invert(),t.current.geometry.drawRange.count=Math.min(r,o!==void 0?o:r,u.length),i=0;i<u.length;i++)m=u[i].current,m.getWorldPosition(b).applyMatrix4(g),b.toArray(l,i*3),t.current.geometry.attributes.position.needsUpdate=!0,m.matrixWorldNeedsUpdate=!0,m.color.toArray(d,i*3),t.current.geometry.attributes.color.needsUpdate=!0,y.set([m.size],i),t.current.geometry.attributes.size.needsUpdate=!0});const _=e.useMemo(()=>({getParent:()=>t,subscribe:h=>(x(v=>[...v,h]),()=>x(v=>v.filter(w=>w.current!==h.current)))}),[]);return e.createElement("points",p({userData:{instances:u},matrixAutoUpdate:!1,ref:t,raycast:()=>null},n),e.createElement("bufferGeometry",null,e.createElement("bufferAttribute",{attach:"attributes-position",args:[l,3],usage:f}),e.createElement("bufferAttribute",{attach:"attributes-color",args:[d,3],usage:f}),e.createElement("bufferAttribute",{attach:"attributes-size",args:[y,1],usage:f})),e.createElement(S.Provider,{value:_},a))}),F=e.forwardRef(({children:a,positions:o,colors:r,sizes:n,stride:s=3,...t},u)=>{const x=e.useRef(null);return e.useImperativeHandle(u,()=>x.current,[]),z(()=>{const l=x.current.geometry.attributes;l.position.needsUpdate=!0,r&&(l.color.needsUpdate=!0),n&&(l.size.needsUpdate=!0)}),e.createElement("points",p({ref:x},t),e.createElement("bufferGeometry",null,e.createElement("bufferAttribute",{attach:"attributes-position",args:[o,s],usage:f}),r&&e.createElement("bufferAttribute",{attach:"attributes-color",args:[r,s],count:r.length/s,usage:f}),n&&e.createElement("bufferAttribute",{attach:"attributes-size",args:[n,1],count:n.length/s,usage:f})),a)}),R=e.forwardRef((a,o)=>a.positions instanceof Float32Array?e.createElement(F,p({},a,{ref:o})):e.createElement(U,p({},a,{ref:o}))),G=`#define GLSLIFY 1
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

varying float vLife;

float easeOutCubic(float x) {
  return 1. - pow(1. - x, 3.);
}

void main(){
  float t = uTime * .5;

  vec3 pos_default = csm_Position;  // 模型顶点坐标
  pos_default.z += 1.;              // 模型平移

  vec3 pos_start = pos_default;
  pos_start.z = 0.;
  // vec3 pos_start = vec3(0);

  vec3 pos_end = pos_default;

  float speed = snoise(pos_default)*.5+.5;  // 粒子随机速度
  float life = fract(t);

  float height_max = life * 2.;             // 由0-1life映射最大高度,模型初始高度为2(经过平移后)
  pos_end.z = min(height_max, pos_end.z);   // 限制此时的最大高度

  float v = snoise(
    pos_end+t
  )*.5+.5;
  v = max(v, 1.);

  vec3 pos = mix(pos_start, pos_end, v);
  // vec3 pos = pos_default;

  csm_Position = pos;
  vLife = life;
}`,N=`#define GLSLIFY 1

uniform float uTime;
uniform float uDelta;

varying float vLife;

void main(){
  vec2 uv = gl_PointCoord - .5;
  float d = length(uv);
  d = pow(.1/d,2.);

  vec3 col = vec3(1,0,0);
  col *= d;

  float alpha = d * sin(vLife * PI);
  
  csm_FragColor = vec4(col, alpha);
}`,{PI:O}=Math;function W(){const o={...M()},{nodes:r,materials:n}=T(P("/model/skull-transformed.glb")),s=r.Object_2.geometry.getAttribute("position").array;return c.jsx(R,{positions:s,scale:2,"rotation-x":-O/2,children:c.jsx(D,{baseMaterial:L,uniforms:o,vertexShader:G,fragmentShader:N,transparent:!0,alphaTest:.2,depthWrite:!1,size:.1})})}const Z=C(function(){return c.jsx("div",{className:"h-screen",children:c.jsxs(j,{children:[c.jsx(I,{}),c.jsx("ambientLight",{}),c.jsx(W,{})]})})});export{Z as default};
