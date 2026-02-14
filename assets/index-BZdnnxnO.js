import{w as D,o as e,r as f}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as _,ak as j,e as P,U as u,h as L,u as S,A,g as F}from"./extends-BlC2n1ra.js";import{j as g}from"./three-custom-shader-material.es-BGTEHp_F.js";import{a as h}from"./asset-BvcpElq9.js";import{u as C}from"./useUniformTime-CTUI4CFg.js";import{P as M}from"./Perf-fJYLqdTV.js";import{d as I,w as G}from"./index-TeDTk6Ud.js";import{O as k}from"./OrbitControls-AT23luag.js";import{L as q}from"./Loader-BFNsQlfv.js";import{u as E}from"./Gltf-Tkgqmi5f.js";import{u as N}from"./Texture-prp8whrA.js";import{G as V}from"./GPUComputationRenderer-Bp2UyDKA.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-D7WJHKEE.js";import"./index-n5PR1bfd.js";import"./client-EdRjCdko.js";import"./troika-three-text.esm-D4eO4ECZ.js";import"./constants-Vcla44ih.js";const Y=`#define GLSLIFY 1
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
`,O=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;

varying vec3 vCol;

void main(){
  // csm_FragColor = vec4(1,0,0,1);

  // csm_DiffuseColor = vec4(vCol,1);
}
`,U=`#define GLSLIFY 1
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
`,B=`#define GLSLIFY 1
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

uniform float uTime;
uniform float uDelta;
uniform sampler2D uDefaultPosTex;

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

  float strength = snoise(pos+vec3(0,t,0));
  strength = smoothstep(.1,0.,strength);

  pos += vel * strength * uDelta * 4.;
  gl_FragColor = vec4(pos, life);
}`,{random:p,sqrt:H,ceil:K}=Math;function W(s,i){const t=s.image.data;for(let r=0;r<t.length/4;r++){const o=r*4,x=r*3,l=i[x+0],v=i[x+1],m=i[x+2];t[o+0]=l??(p()-.5)*10,t[o+1]=v??(p()-.5)*10,t[o+2]=m??(p()-.5)*10,t[o+3]=p()}}function X({...s}){const i=s.geometry;console.log(i);const t=i.getAttribute("position"),r=t.count,o=K(H(r));console.log({count:r,size:o});const{gl:x}=P(),l=C(),{gpuCompute:v,posVar:m}=f.useMemo(()=>{const n=new V(o,o,x),a=n.createTexture();W(a,t.array);const c=n.addVariable("texPos",R,a);return c.material.uniforms={...l,uDefaultPosTex:new u(a)},n.setVariableDependencies(c,[c]),n.init(),{gpuCompute:n,posVar:c}},[x,o]),{particleCoord:z}=f.useMemo(()=>{const n=new Float32Array(r*2);for(let a=0;a<o;a++)for(let c=0;c<o;c++){const y=(c*o+a)*2,b=(a+.5)/o,T=(c+.5)/o;n[y+0]=b,n[y+1]=T}return{particleCoord:n}},[r,o]);i.setAttribute("aParticleCoord",new L(z,2));const w=N(h("/img/texture/particle/star_09.png")),d={...l,uPosTex:new u(v.getCurrentRenderTarget(m).texture),uParticleTex:new u(w)};return S(()=>{v.compute(),d.uPosTex.value=v.getCurrentRenderTarget(m).texture}),e.jsx("points",{...s,children:e.jsx(g,{uniforms:d,baseMaterial:F,vertexShader:U,fragmentShader:B,size:.07,transparent:!0,depthWrite:!1,blending:A,toneMapped:!1})})}function J({...s}){const t={...C()};return e.jsx(e.Fragment,{children:e.jsx("mesh",{...s,children:e.jsx(g,{uniforms:t,baseMaterial:j,vertexShader:Y,fragmentShader:O,toneMapped:!0})})})}function Q(){const{nodes:s,materials:i}=E(h("/model/tree-transformed.glb")),t=s.Oak_Bark_2_SHD_trunk_0.geometry,r=s.olqeejih_2K_rsSprite1_0.geometry;return console.log({trunkGeo:t,leafGeo:r}),e.jsxs(e.Fragment,{children:[e.jsx(J,{geometry:t,scale:.3}),e.jsx(X,{geometry:r,scale:.3})]})}const ye=D(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(_,{camera:{position:[0,0,5]},children:[e.jsx(M,{position:"top-left"}),e.jsx(k,{target:[0,3,0]}),e.jsx("ambientLight",{intensity:10}),e.jsx(f.Suspense,{fallback:null,children:e.jsx(Q,{})}),e.jsx(I,{children:e.jsx(G,{})})]}),e.jsx(q,{})]})});export{ye as default};
