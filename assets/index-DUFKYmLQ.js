import{r as l,w as T,o as t}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{al as F,a as A,b8 as L,b9 as q,ba as M,bb as S,u as y,aG as _,aC as E,aA as P,y as d,C as G,O as I,bc as U,as as N,U as V,d as B,e as R}from"./OrbitControls-CmBRG4Bd.js";import{a as h}from"./asset-BvcpElq9.js";import{P as k}from"./Perf-9NpNtL2P.js";import{u as O,b as v}from"./leva.esm-BV3Tl-wj.js";import{j as Y}from"./three-custom-shader-material.es-B41VK_Vk.js";import{u as X}from"./useUniformTime-DeKYjdeE.js";import{L as H,C as W}from"./Center-p9kUw_h5.js";import{u as Z}from"./Texture-Sa6PNAoI.js";import"./index-7OC5HNn7.js";import"./index-n5PR1bfd.js";import"./client-EdRjCdko.js";import"./index-D369hMBv.js";import"./three-custom-shader-material.es-DobAws7m.js";const g=1024,f=g/2,e={lerpV:.3,listener:null,buffer:null,sound:null,analyser:null,freqData:new Float32Array(f),refCount:0,dataTex:null};function J(){const a=new _(e.freqData,f,1,E,P);a.minFilter=d,a.magFilter=d,a.needsUpdate=!0,e.dataTex=a}function K(a){const{camera:r}=F();e.buffer=A(L,a),l.useEffect(()=>(e.refCount===0&&(J(),e.listener=new q,r.add(e.listener),e.sound=new M(e.listener),e.sound.setBuffer(e.buffer),e.sound.setLoop(!0),e.sound.setVolume(.5),e.analyser=new S(e.sound,g)),e.refCount++,()=>{e.refCount--,e.refCount===0&&(e.sound?.stop(),e.listener&&r.remove(e.listener),e.sound=null,e.listener=null,e.analyser=null)}),[e.buffer]),y(()=>{e.sound?.isPlaying&&(o(),e.dataTex&&(e.dataTex.needsUpdate=!0))});function o(){if(!e.analyser)return;const c=e.analyser.getFrequencyData();for(let i=0;i<f;i++){const u=c[i]/255*e.lerpV+e.freqData[i]*(1-e.lerpV);e.freqData[i]=u}}return{get sound(){return e.sound},get analyser(){return e.analyser},get lerpFreqData(){return e.freqData},get dataTex(){return e.dataTex},set lerpV(c){e.lerpV=c}}}const Q=`#define GLSLIFY 1
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

#define s1(v) (sin(v)*.5+.5)

uniform float uTime;
uniform float uDelta;
uniform sampler2D uFreqTex;

varying vec2 vUv;

// https://www.shadertoy.com/view/Xd2GR3
// { 2d cell id, distance to border, distnace to center )
vec4 hexagon( vec2 p ) 
{
	vec2 q = vec2( p.x*2.0*0.5773503, p.y + p.x*0.5773503 );
	
	vec2 pi = floor(q);
	vec2 pf = fract(q);

	float v = mod(pi.x + pi.y, 3.0);

	float ca = step(1.0,v);
	float cb = step(2.0,v);
	vec2  ma = step(pf.xy,pf.yx);
	
    // distance to borders
	float e = dot( ma, 1.0-pf.yx + ca*(pf.x+pf.y-1.0) + cb*(pf.yx-2.0*pf.xy) );

	// distance to center	
	p = vec2( q.x + floor(0.5+p.y/1.5), 4.0*p.y/3.0 )*0.5 + 0.5;
	float f = length( (fract(p) - 0.5)*vec2(1.0,0.85) );		
	
	return vec4( pi + ca - cb*ma, e, f );
}

void main(){
  float t = uTime;
  float dt = uDelta;

  vec2 uv = vUv-.5;
  uv *= 200.;
  

  vec4 hex = hexagon(uv);

  // float d = pow(.2/min(hex.w,hex.z), 1.);
  // float d = .2/(hex.z-.1);
  // float d = .2/(hex.z);
  float d = smoothstep(1.5,1.49,hex.w) + 1./hex.z;

  float fre = texture(uFreqTex, vec2(.2, 0.)).r;

  float n = snoise(vec3(hex.xy*.1, fre*1. +t*.1));

  float alpha = 1.;
  if(n<0.5){
    // alpha = smoothstep(0.,.5,n);
    alpha = n;
  }

  vec3 col = sin(vec3(3,2,1)+ n * 10.)*.5+.5;
  col = col * d * (smoothstep(-1.,1.,n)*20.+.1);

  col=tanh(col / 100.);
  csm_FragColor = vec4(col, d * alpha);

}`,$=`#define GLSLIFY 1
varying vec2 vUv;

void main(){

  vUv = uv;
}`;function ee({audioApi:a}){const r=Z(h("/img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png")),o=.1,c=.02,{geo:i,mat:u}=l.useMemo(()=>{const n=new U;n.translate(0,.5,0);const s=new N({matcap:r});return{geo:n,mat:s}},[]),p=40,b=l.useMemo(()=>{const n=[];for(let s=0;s<p;s++){const x=s*o+(s-1)*c;n.push(x)}return n},[p]),m=l.useRef(null);return y(({clock:n},s)=>{const{analyser:x,lerpFreqData:z}=a;x&&m.current.children.forEach((w,C)=>{const j=Math.floor(C/p*(x.analyser.fftSize/2)),D=Math.max(.01,z[j]*2);w.scale.set(o,D,o)})}),t.jsx(W,{disableY:!0,children:t.jsx("group",{ref:m,children:b.map((n,s)=>t.jsx("mesh",{"position-x":n,scale:[o,0,o],geometry:i,material:u},s))})})}function te({audioApi:a}){const o={...X(),uFreqTex:new V(a.dataTex)};return t.jsxs("mesh",{scale:40,"rotation-x":-Math.PI/2,children:[t.jsx("planeGeometry",{}),t.jsx(Y,{baseMaterial:R,uniforms:o,vertexShader:$,fragmentShader:Q,side:B,transparent:!0})]})}function ae(){const a=K(h("/sound/hero.mp3"));return O({play:v(()=>{const{sound:r}=a;r&&!r.isPlaying&&a.sound?.play()}),pause:v(()=>{const{sound:r}=a;r&&r.isPlaying&&r.pause()})}),t.jsxs(t.Fragment,{children:[t.jsx(ee,{audioApi:a}),t.jsx(te,{audioApi:a})]})}const ye=T(function(){return t.jsxs("div",{className:"h-screen",children:[t.jsxs(G,{camera:{position:[-2,1,3]},children:[t.jsx("color",{attach:"background",args:["#000"]}),t.jsx("fog",{attach:"fog",args:["#000",.1,10]}),t.jsx(k,{position:"top-left"}),t.jsx("ambientLight",{}),t.jsx("directionalLight",{position:[0,10,0],intensity:20}),t.jsx("axesHelper",{args:[10]}),t.jsx(I,{makeDefault:!0}),t.jsx(ae,{})]}),t.jsx(H,{})]})});export{ye as default};
