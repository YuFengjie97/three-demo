import{w as b,o as e,r as y}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C,I as j,ax as A,V as P,ay as L,az as S,A as w,d as _,B as D,h as f,u as T,U as M}from"./extends-D4P9RtWV.js";import{P as I}from"./Perf-C-RHtvM3.js";import{d as F,w as G}from"./index-jtwq2L8m.js";import{u as E}from"./useUniformTime-CJanb7xe.js";import{a as B}from"./asset-BvcpElq9.js";import{O}from"./OrbitControls-B0FQFszE.js";import{u as U}from"./Texture-DuyHYiDQ.js";import"./index-7OC5HNn7.js";import"./index-n5PR1bfd.js";import"./client-EdRjCdko.js";import"./troika-three-text.esm-BJuF0oxA.js";const N=`#define GLSLIFY 1
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

attribute float life;
attribute float ndx;

varying float vLife;
varying vec3 vCol;

vec3 snoise3x3(vec3 p){
  float t = uTime;
  vec3 v = vec3(
    snoise(p+vec3(t,0,0)),
    snoise(p+vec3(0,1,0)),
    snoise(p+vec3(0,0,1))
  );
  return v;
}

void main(){
  vec4 worldPos = modelMatrix * vec4(position,1.);
  // worldPos.xyz += sin(worldPos.zxy)*.1;
  worldPos.xyz += snoise3x3(worldPos.xyz)*.1;

  vec4 viewPos = viewMatrix * worldPos;
  vec4 projectPos = projectionMatrix * viewPos;

  gl_Position = projectPos;
  gl_PointSize = 80.0 * (1.0 / -viewPos.z);
  // gl_PointSize = 10.;

  vCol = sin(vec3(3,2,1)+ndx)*.5+.5;

  vLife = life;
}`,q=`#define GLSLIFY 1
uniform sampler2D tex;

varying float vLife;
varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord;
  // float d = length(uv-.5);
  // d = smoothstep(.5,.48,d);
  float d = texture(tex, uv).r;

  float fadeIn = smoothstep(0.,.1, vLife);
  float fadeOut = smoothstep(.9,1.,vLife);
  float fade = fadeIn * fadeOut;

  // d *= fade;

  gl_FragColor = vec4(vCol*d*2., d);
}`,{random:V}=Math;function R({curve:g}){const{data:d,geo:s}=y.useMemo(()=>{const n=new Float32Array(1e3),r=Array.from({length:1e3},(i,o)=>(n[o]=o,{progress:V()})),t=new D;return t.setAttribute("position",new f(new Float32Array(3e3),3)),t.setAttribute("life",new f(new Float32Array(1e3),1)),t.setAttribute("ndx",new f(n,1)),{data:r,geo:t}},[1e3]);y.useEffect(()=>()=>{s.dispose()},[s]),T((n,r)=>{const t=s.getAttribute("position"),i=t.array,o=s.getAttribute("life"),a=o.array;d.forEach((x,v)=>{x.progress+=r*.01;const m=x.progress%1,p=g.getPointAt(m),u=v*3;i[u+0]=p.x,i[u+1]=p.y,i[u+2]=p.z,a[v]=m}),t.needsUpdate=!0,o.needsUpdate=!0});const c=U(B("/img/texture/particle/star_09.png")),l={...E(),tex:new M(c)};return e.jsx("points",{geometry:s,children:e.jsx("shaderMaterial",{uniforms:l,vertexShader:N,fragmentShader:q,depthWrite:!1,depthTest:!0,transparent:!0,blending:w})})}function W(){const{geo:d,curve:s}=y.useMemo(()=>{const c=[],h=new j(2,0),l=new A(h),{count:n,array:r}=l.getAttribute("position");for(let o=0;o<n;o++){const a=o*3,x=r[a+0],v=r[a+1],m=r[a+2];c.push(new P(x,v,m))}const t=new L(c,!0);return{geo:new S(t,2e3,.1,10,!1),curve:t}},[]);return e.jsxs(e.Fragment,{children:[e.jsx("mesh",{geometry:d,children:e.jsx("meshBasicMaterial",{color:11569663,transparent:!0,opacity:.2,side:_,blending:w,depthWrite:!1,depthTest:!0})}),e.jsx(R,{curve:s})]})}const se=b(function(){return e.jsx("div",{className:"h-screen",children:e.jsxs(C,{children:[e.jsx(I,{position:"top-left"}),e.jsx(O,{}),e.jsx("ambientLight",{}),e.jsx("pointLight",{intensity:40,position:[0,4,0]}),e.jsx(W,{}),e.jsx(F,{children:e.jsx(G,{})})]})})});export{se as default};
