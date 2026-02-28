import{r as g,w as L,o}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{aB as P,R as _,aC as z,C as A,aD as F,e as S,U as d,h as M,u as I,A as G,g as N}from"./extends-BhofGCXz.js";import{j as w}from"./three-custom-shader-material.es-Doi8FQpv.js";import{a as D}from"./asset-BvcpElq9.js";import{u as T}from"./useUniformTime-BKY4rfaT.js";import{d as E,w as R}from"./index-CmBrlDeP.js";import{a as q}from"./simplex-noise-BUqOQ44_.js";import{O as V}from"./OrbitControls-BLiDvAIL.js";import{L as k}from"./Loader-B07yCGYR.js";import{u as U}from"./Gltf-t8lXtj8T.js";import{u as Y}from"./Texture-BlwqjH7Q.js";import{G as B}from"./GPUComputationRenderer-N3macQBJ.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-CJiU6NmO.js";import"./constants-BkWHBZ1v.js";const O=`#define GLSLIFY 1
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

// attribute vec3 normal;

varying vec3 vPos;
varying vec3 vCol;

void main(){
  float t = uTime;
  vec3 p = csm_Position;

  // vec3 vel = vec3(
  //   snoise3(p*.4+vec3(1.,0.,0.)),
  //   snoise3(p*.4+vec3(0.,1.,t)),
  //   snoise3(p*.4+vec3(0.,0.,1.))
  // );
  // p += vel*.2;

  p += sin(p.zxy*2.+vec3(0,2,0)*t)     *.2;
  p += sin(p.zxy*4.)*0.5               *.2;
  p += sin(p.zxy*8.)*0.2               *.2;

  // vCol = sin(vec3(3,2,1)+p-t*.1)*.5+.5;
  vCol = sin(vec3(3,2,1)+normal-t*.1)*.5+.5;

  csm_Position = p;
}
`,W=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;

varying vec3 vCol;

void main(){
  // csm_FragColor = vec4(1,0,0,1);

  // csm_DiffuseColor = vec4(vCol,1);
}
`,X=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;
uniform sampler2D uPosTex;

attribute vec2 aParticleCoord;

varying vec3 vCol;
varying float vLife;

void main(){
  float t = uTime;
  vec4 particle = texture(uPosTex, aParticleCoord);
  vec3 pos = particle.xyz;
  float life = particle.w;
  vLife = sin(life*PI);

  csm_Position = pos;
  vCol = sin(vec3(3,2,1)+pos+dot(aParticleCoord,vec2(.1)))*.5+.5;
}
`,H=`#define GLSLIFY 1
uniform sampler2D uParticleTex;

varying vec3 vCol;
varying float vLife;

void main(){
  // vec2 uv = gl_PointCoord-.5;
  // vec3 col = vec3(1,0,0);
  // float d = length(uv);
  // d = smoothstep(.2,0.,d);
  // csm_FragColor = vec4(col*d, d);

  vec2 uv = gl_PointCoord;
  float d = texture(uParticleTex, uv).r;
  csm_FragColor = vec4(vCol*d, d*vLife);
}`,J=`#define GLSLIFY 1
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
uniform sampler2D uDefaultPosTex;
uniform sampler3D uNoise3DTex;

void main(){
  float t = uTime;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(texPos, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;

  life += uDelta;
  if(life>1.){
    life = fract(life);  // 重置life
    pos = texture(uDefaultPosTex, uv).xyz; // 根据默认位置重置
  }

  // flowfield
  vec3 vel = vec3(
    snoise(pos*.4+vec3(1.,0.,0.)),
    snoise(pos*.4+vec3(0.,1.,t)),
    snoise(pos*.4+vec3(0.,0.,1.))
  );
  // vec3 vel = texture(uNoise3DTex, pos*.4+vec3(0.,t,0.)).rgb;

  float strength = snoise(pos+vec3(0,t,0));
  strength = smoothstep(.1,0.,strength);

  pos += vel * strength * uDelta * 4.;
  gl_FragColor = vec4(pos, life);
}`;function K(c=32,t=.1){return g.useMemo(()=>{const e=new Float32Array(131072),a=q();let x=0;for(let i=0;i<32;i++)for(let m=0;m<32;m++)for(let p=0;p<32;p++){const h=a(p*t,m*t,i*t);e[x]=h;const f=a(p*t+100,m*t,i*t);e[x+1]=f;const n=a(p*t,m*t+100,i*t);e[x+2]=n,e[x+3]=1,x+=4}const v=new P(e,32,32,32);return v.format=_,v.wrapS=z,v.wrapT=z,v.wrapR=z,v.needsUpdate=!0,v},[])}const{random:y,sqrt:Q,ceil:Z}=Math;function $(c,t){const r=c.image.data;for(let s=0;s<r.length/4;s++){const e=s*4,a=s*3,x=t[a+0],v=t[a+1],i=t[a+2];r[e+0]=x??(y()-.5)*10,r[e+1]=v??(y()-.5)*10,r[e+2]=i??(y()-.5)*10,r[e+3]=y()}}function ee({...c}){const t=c.geometry,r=t.getAttribute("position"),s=r.count,e=Z(Q(s)),{gl:a}=S(),x=T(),v=K(),{gpuCompute:i,posVar:m}=g.useMemo(()=>{const n=new B(e,e,a),u=n.createTexture();$(u,r.array);const l=n.addVariable("texPos",J,u);return l.material.uniforms={...x,uDefaultPosTex:new d(u),uNoise3DTex:new d(v)},n.setVariableDependencies(l,[l]),n.init(),{gpuCompute:n,posVar:l}},[a,e]),{particleCoord:p}=g.useMemo(()=>{const n=new Float32Array(s*2);for(let u=0;u<e;u++)for(let l=0;l<e;l++){const C=(l*e+u)*2,b=(u+.5)/e,j=(l+.5)/e;n[C+0]=b,n[C+1]=j}return{particleCoord:n}},[s,e]);t.setAttribute("aParticleCoord",new M(p,2));const h=Y(D("/img/texture/particle/star_09.png")),f={...x,uPosTex:new d(i.getCurrentRenderTarget(m).texture),uParticleTex:new d(h)};return I(()=>{i.compute(),f.uPosTex.value=i.getCurrentRenderTarget(m).texture}),o.jsx("points",{...c,children:o.jsx(w,{uniforms:f,baseMaterial:N,vertexShader:X,fragmentShader:H,size:.07,transparent:!0,depthWrite:!1,blending:G,toneMapped:!1})})}function oe({...c}){const r={...T()};return o.jsx(o.Fragment,{children:o.jsx("mesh",{...c,children:o.jsx(w,{uniforms:r,baseMaterial:F,vertexShader:O,fragmentShader:W,toneMapped:!0})})})}function te(){const{nodes:c,materials:t}=U(D("/model/tree-compressed.glb")),r=c.trunk.geometry,s=c.leaf.geometry;return o.jsxs(o.Fragment,{children:[o.jsx(oe,{geometry:r,scale:.3}),o.jsx(ee,{geometry:s,scale:.3})]})}const he=L(function(){return o.jsxs("div",{className:"h-screen",children:[o.jsxs(A,{camera:{position:[0,0,5]},children:[o.jsx(V,{target:[0,3,0]}),o.jsx("ambientLight",{intensity:10}),o.jsx(g.Suspense,{fallback:null,children:o.jsx(te,{})}),o.jsx(E,{children:o.jsx(R,{})})]}),o.jsx(k,{})]})});export{he as default};
