import{r as M,o as E,e as Qe,w as Ye}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{X as Pe,a3 as De,B as le,aY as ve,y as z,aw as I,au as P,aB as ie,an as me,aH as Je,E as ge,V as _,ao as L,S as w,aZ as Ae,a_ as et,a$ as tt,aL as st,x as q,b0 as rt,c as ze,b1 as V,b2 as ue,i as Ie,b3 as Fe,U as d,aE as ne,b4 as ae,m as it,n as nt,ap as Z,d as W,af as at,aO as G,G as Ne,aa as Oe,ay as Le,a1 as ot,b5 as lt,g as $,al as ce,aA as ut,u as Ge,b6 as ct,aS as ht,C as dt,O as ft,A as pt,f as vt}from"./OrbitControls-buyHw8F8.js";import{j as mt}from"./three-custom-shader-material.es-iuk4jPUE.js";import{u as He}from"./useUniformTime-CGcSBxmi.js";import{a as gt}from"./asset-BvcpElq9.js";import{P as xt}from"./Perf-2bt_PeaC.js";import{u as ke}from"./leva.esm-BV3Tl-wj.js";import{u as St}from"./Texture-cDJ2PIUO.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-BzJpHPF7.js";import"./index-n5PR1bfd.js";import"./client-EdRjCdko.js";import"./index-D369hMBv.js";const Tt=new De(-1,1,1,-1,0,1);class bt extends le{constructor(){super(),this.setAttribute("position",new ve([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new ve([0,2,0,0,2,0],2))}}const yt=new bt;class Et{constructor(t){this._mesh=new Pe(yt,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Tt)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class Mt{constructor(t,s,r){this.variables=[],this.currentTextureIndex=0;let i=ie;const n={passThruTexture:{value:null}},a=h(p(),n),o=new Et(a);this.setDataType=function(c){return i=c,this},this.addVariable=function(c,l,v){const S=this.createShaderMaterial(l),f={name:c,initialValueTexture:v,material:S,dependencies:null,renderTargets:[],wrapS:null,wrapT:null,minFilter:z,magFilter:z};return this.variables.push(f),f},this.setVariableDependencies=function(c,l){c.dependencies=l},this.init=function(){if(r.capabilities.maxVertexTextures===0)return"No support for vertex shader textures.";for(let c=0;c<this.variables.length;c++){const l=this.variables[c];l.renderTargets[0]=this.createRenderTarget(t,s,l.wrapS,l.wrapT,l.minFilter,l.magFilter),l.renderTargets[1]=this.createRenderTarget(t,s,l.wrapS,l.wrapT,l.minFilter,l.magFilter),this.renderTexture(l.initialValueTexture,l.renderTargets[0]),this.renderTexture(l.initialValueTexture,l.renderTargets[1]);const v=l.material,S=v.uniforms;if(l.dependencies!==null)for(let f=0;f<l.dependencies.length;f++){const y=l.dependencies[f];if(y.name!==l.name){let x=!1;for(let T=0;T<this.variables.length;T++)if(y.name===this.variables[T].name){x=!0;break}if(!x)return"Variable dependency not found. Variable="+l.name+", dependency="+y.name}S[y.name]={value:null},v.fragmentShader=`
uniform sampler2D `+y.name+`;
`+v.fragmentShader}}return this.currentTextureIndex=0,null},this.compute=function(){const c=this.currentTextureIndex,l=this.currentTextureIndex===0?1:0;for(let v=0,S=this.variables.length;v<S;v++){const f=this.variables[v];if(f.dependencies!==null){const y=f.material.uniforms;for(let x=0,T=f.dependencies.length;x<T;x++){const B=f.dependencies[x];y[B.name].value=B.renderTargets[c].texture}}this.doRenderTarget(f.material,f.renderTargets[l])}this.currentTextureIndex=l},this.getCurrentRenderTarget=function(c){return c.renderTargets[this.currentTextureIndex]},this.getAlternateRenderTarget=function(c){return c.renderTargets[this.currentTextureIndex===0?1:0]},this.dispose=function(){o.dispose();const c=this.variables;for(let l=0;l<c.length;l++){const v=c[l];v.initialValueTexture&&v.initialValueTexture.dispose();const S=v.renderTargets;for(let f=0;f<S.length;f++)S[f].dispose()}};function u(c){c.defines.resolution="vec2( "+t.toFixed(1)+", "+s.toFixed(1)+" )"}this.addResolutionDefine=u;function h(c,l){l=l||{};const v=new I({name:"GPUComputationShader",uniforms:l,vertexShader:g(),fragmentShader:c});return u(v),v}this.createShaderMaterial=h,this.createRenderTarget=function(c,l,v,S,f,y){return c=c||t,l=l||s,v=v||ge,S=S||ge,f=f||z,y=y||z,new P(c,l,{wrapS:v,wrapT:S,minFilter:f,magFilter:y,format:me,type:i,depthBuffer:!1})},this.createTexture=function(){const c=new Float32Array(t*s*4),l=new Je(c,t,s,me,ie);return l.needsUpdate=!0,l},this.renderTexture=function(c,l){n.passThruTexture.value=c,this.doRenderTarget(a,l),n.passThruTexture.value=null},this.doRenderTarget=function(c,l){const v=r.getRenderTarget(),S=r.xr.enabled,f=r.shadowMap.autoUpdate;r.xr.enabled=!1,r.shadowMap.autoUpdate=!1,o.material=c,r.setRenderTarget(l),o.render(r),o.material=a,r.xr.enabled=S,r.shadowMap.autoUpdate=f,r.setRenderTarget(v)};function g(){return`void main()	{

	gl_Position = vec4( position, 1.0 );

}
`}function p(){return`uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}
`}}}const wt=`#define GLSLIFY 1
uniform sampler2D uTexPos;
uniform sampler2D uTexVel;

attribute vec2 aTexCoord;
varying vec2 vTexCoord;
varying vec3 vPos;

void main(){
  vec3 pos = texture(uTexPos, aTexCoord).xyz;
  csm_Position.xyz = pos;

  vPos = pos;

  vTexCoord = aTexCoord;

}`,Rt=`#define GLSLIFY 1
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

uniform sampler2D uTexPos;
uniform sampler2D uTexPoint;

varying vec2 vTexCoord;
varying vec3 vPos;

void main(){
  vec4 particle = texture(uTexPos, vTexCoord);
  vec3 pos = particle.xyz;
  float life = particle.w;

  vec3 col = sin(vec3(3,2,1) + dot(cos(pos), vec3(2.)))*.5+.5;

  vec2 uv = gl_PointCoord-.5;
  // float d = length(uv);
  float d = texture(uTexPoint, gl_PointCoord).r;

  // float blink = snoise3(vPos*.3);
  // d += pow(.1/length(uv),2.) * step(0.5,blink);

  if(d<.1){
    discard;
  }

  float fadeInOut = smoothstep(.5,.0,abs(life-.5));

  csm_FragColor.rgb = col * 2. * d;
  csm_FragColor.a = fadeInOut;
}`,_t=`#define GLSLIFY 1
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

// uniform sampler2D texPos;
// uniform sampler2D texVel;
uniform float uTime;
uniform float uDelta;
uniform float uSpeed;
uniform float uRangeMin;
uniform float uRangeMax;

void main(){
  float t =uTime;
  
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture(texPos, uv).rgb;
  vec3 vel = texture(texVel, uv).rgb;

  // 速度大小
  float velLen = snoise(pos);
  velLen = smoothstep(uRangeMin, uRangeMax, velLen) * uSpeed;

  // 速度方向改变
  vec3 velNew = vec3(
    snoise(pos*.4+vec3(1.,0.,t)),
    snoise(pos*.4+vec3(0.,1.,0.)),
    snoise(pos*.4+vec3(0.,0.,1.))
  );

  vel = velNew;
  vel = normalize(vel) * velLen;

  gl_FragColor = vec4(vel, 1);
}`,Bt=`#define GLSLIFY 1
// uniform sampler2D texPos;
// uniform sampler2D texVel;
uniform float uTime;
uniform float uDelta;
uniform sampler2D uDefaultPos;
uniform float uLifeSpeed;

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec3 pos_def = texture(uDefaultPos, uv).xyz;

  float t = uTime;
  float dt = uDelta;

  vec4 particle = texture(texPos, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;

  vec3 vel = texture(texVel, uv).rgb;
  pos += vel * uDelta;

  life += dt * uLifeSpeed;

  if(life >= 1.){
    pos = pos_def;
    life = mod(life, 1.);
  }

  gl_FragColor = vec4(pos, life);
}`;var ee=1/1e3,Ut=1e3,Ct=class{constructor(){this.startTime=performance.now(),this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(e){typeof document<"u"&&document.hidden!==void 0&&(e?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this),this._autoReset=e)}get delta(){return this._delta*ee}get fixedDelta(){return this._fixedDelta*ee}set fixedDelta(e){this._fixedDelta=e*Ut}get elapsed(){return this._elapsed*ee}update(e){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=(e!==void 0?e:performance.now())-this.startTime,this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()-this.startTime}getDelta(){return this.delta}getElapsed(){return this.elapsed}handleEvent(e){document.hidden||(this.currentTime=performance.now()-this.startTime)}dispose(){this.autoReset=!1}},Pt=(()=>{const e=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),t=new Float32Array([0,0,2,0,0,2]),s=new le;return s.setAttribute("position",new $(e,3)),s.setAttribute("uv",new $(t,2)),s})(),U=class oe{static get fullscreenGeometry(){return Pt}constructor(t="Pass",s=new ne,r=new De){this.name=t,this.renderer=null,this.scene=s,this.camera=r,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(t){if(this.rtt===t){const s=this.fullscreenMaterial;s!==null&&(s.needsUpdate=!0),this.rtt=!t}}set mainScene(t){}set mainCamera(t){}setRenderer(t){this.renderer=t}isEnabled(){return this.enabled}setEnabled(t){this.enabled=t}get fullscreenMaterial(){return this.screen!==null?this.screen.material:null}set fullscreenMaterial(t){let s=this.screen;s!==null?s.material=t:(s=new Pe(oe.fullscreenGeometry,t),s.frustumCulled=!1,this.scene===null&&(this.scene=new ne),this.scene.add(s),this.screen=s)}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(t){this.fullscreenMaterial=t}getDepthTexture(){return null}setDepthTexture(t,s=V){}render(t,s,r,i,n){throw new Error("Render method not implemented!")}setSize(t,s){}initialize(t,s,r){}dispose(){for(const t of Object.keys(this)){const s=this[t];(s instanceof P||s instanceof Ne||s instanceof Oe||s instanceof oe)&&this[t].dispose()}this.fullscreenMaterial!==null&&this.fullscreenMaterial.dispose()}},Dt=class extends U{constructor(){super("ClearMaskPass",null,null),this.needsSwap=!1}render(e,t,s,r,i){const n=e.state.buffers.stencil;n.setLocked(!1),n.setTest(!1)}},At=`#ifdef COLOR_WRITE
#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#endif
#ifdef DEPTH_WRITE
#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}
#endif
#ifdef USE_WEIGHTS
uniform vec4 channelWeights;
#endif
uniform float opacity;varying vec2 vUv;void main(){
#ifdef COLOR_WRITE
vec4 texel=texture2D(inputBuffer,vUv);
#ifdef USE_WEIGHTS
texel*=channelWeights;
#endif
gl_FragColor=opacity*texel;
#ifdef COLOR_SPACE_CONVERSION
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
#else
gl_FragColor=vec4(0.0);
#endif
#ifdef DEPTH_WRITE
gl_FragDepth=readDepth(vUv);
#endif
}`,he="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",Ve=class extends I{constructor(){super({name:"CopyMaterial",defines:{COLOR_SPACE_CONVERSION:"1",DEPTH_PACKING:"0",COLOR_WRITE:"1"},uniforms:{inputBuffer:new d(null),depthBuffer:new d(null),channelWeights:new d(null),opacity:new d(1)},blending:G,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:At,vertexShader:he}),this.depthFunc=lt}get inputBuffer(){return this.uniforms.inputBuffer.value}set inputBuffer(e){const t=e!==null;this.colorWrite!==t&&(t?this.defines.COLOR_WRITE=!0:delete this.defines.COLOR_WRITE,this.colorWrite=t,this.needsUpdate=!0),this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){const t=e!==null;this.depthWrite!==t&&(t?this.defines.DEPTH_WRITE=!0:delete this.defines.DEPTH_WRITE,this.depthTest=t,this.depthWrite=t,this.needsUpdate=!0),this.uniforms.depthBuffer.value=e}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}get colorSpaceConversion(){return this.defines.COLOR_SPACE_CONVERSION!==void 0}set colorSpaceConversion(e){this.colorSpaceConversion!==e&&(e?this.defines.COLOR_SPACE_CONVERSION=!0:delete this.defines.COLOR_SPACE_CONVERSION,this.needsUpdate=!0)}get channelWeights(){return this.uniforms.channelWeights.value}set channelWeights(e){e!==null?(this.defines.USE_WEIGHTS="1",this.uniforms.channelWeights.value=e):delete this.defines.USE_WEIGHTS,this.needsUpdate=!0}setInputBuffer(e){this.uniforms.inputBuffer.value=e}getOpacity(e){return this.uniforms.opacity.value}setOpacity(e){this.uniforms.opacity.value=e}},We=class extends U{constructor(e,t=!0){super("CopyPass"),this.fullscreenMaterial=new Ve,this.needsSwap=!1,this.renderTarget=e,e===void 0&&(this.renderTarget=new P(1,1,{minFilter:q,magFilter:q,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name="CopyPass.Target"),this.autoResize=t}get resize(){return this.autoResize}set resize(e){this.autoResize=e}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(e){this.autoResize=e}render(e,t,s,r,i){this.fullscreenMaterial.inputBuffer=t.texture,e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){this.autoResize&&this.renderTarget.setSize(e,t)}initialize(e,t,s){s!==void 0&&(this.renderTarget.texture.type=s,s!==L?this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1":e!==null&&e.outputColorSpace===w&&(this.renderTarget.texture.colorSpace=w))}},xe=new ze,je=class extends U{constructor(e=!0,t=!0,s=!1){super("ClearPass",null,null),this.needsSwap=!1,this.color=e,this.depth=t,this.stencil=s,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(e,t,s){this.color=e,this.depth=t,this.stencil=s}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(e){this.overrideClearColor=e}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(e){this.overrideClearAlpha=e}render(e,t,s,r,i){const n=this.overrideClearColor,a=this.overrideClearAlpha,o=e.getClearAlpha(),u=n!==null,h=a>=0;u?(e.getClearColor(xe),e.setClearColor(n,h?a:o)):h&&e.setClearAlpha(a),e.setRenderTarget(this.renderToScreen?null:t),e.clear(this.color,this.depth,this.stencil),u?e.setClearColor(xe,o):h&&e.setClearAlpha(o)}},zt=class extends U{constructor(e,t){super("MaskPass",e,t),this.needsSwap=!1,this.clearPass=new je(!1,!1,!0),this.inverse=!1}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get inverted(){return this.inverse}set inverted(e){this.inverse=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(e){this.inverted=e}render(e,t,s,r,i){const n=e.getContext(),a=e.state.buffers,o=this.scene,u=this.camera,h=this.clearPass,g=this.inverted?0:1,p=1-g;a.color.setMask(!1),a.depth.setMask(!1),a.color.setLocked(!0),a.depth.setLocked(!0),a.stencil.setTest(!0),a.stencil.setOp(n.REPLACE,n.REPLACE,n.REPLACE),a.stencil.setFunc(n.ALWAYS,g,4294967295),a.stencil.setClear(p),a.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?h.render(e,null):(h.render(e,t),h.render(e,s))),this.renderToScreen?(e.setRenderTarget(null),e.render(o,u)):(e.setRenderTarget(t),e.render(o,u),e.setRenderTarget(s),e.render(o,u)),a.color.setLocked(!1),a.depth.setLocked(!1),a.stencil.setLocked(!1),a.stencil.setFunc(n.EQUAL,1,4294967295),a.stencil.setOp(n.KEEP,n.KEEP,n.KEEP),a.stencil.setLocked(!0)}},It=class{constructor(e=null,{depthBuffer:t=!0,stencilBuffer:s=!1,multisampling:r=0,frameBufferType:i}={}){this.renderer=null,this.inputBuffer=this.createBuffer(t,s,i,r),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new We,this.depthTexture=null,this.passes=[],this.timer=new Ct,this.autoRenderToScreen=!0,this.setRenderer(e)}get multisampling(){return this.inputBuffer.samples||0}set multisampling(e){const t=this.inputBuffer,s=this.multisampling;s>0&&e>0?(this.inputBuffer.samples=e,this.outputBuffer.samples=e,this.inputBuffer.dispose(),this.outputBuffer.dispose()):s!==e&&(this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.inputBuffer=this.createBuffer(t.depthBuffer,t.stencilBuffer,t.texture.type,e),this.inputBuffer.depthTexture=this.depthTexture,this.outputBuffer=this.inputBuffer.clone())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(e){if(this.renderer=e,e!==null){const t=e.getSize(new _),s=e.getContext().getContextAttributes().alpha,r=this.inputBuffer.texture.type;r===L&&e.outputColorSpace===w&&(this.inputBuffer.texture.colorSpace=w,this.outputBuffer.texture.colorSpace=w,this.inputBuffer.dispose(),this.outputBuffer.dispose()),e.autoClear=!1,this.setSize(t.width,t.height);for(const i of this.passes)i.initialize(e,s,r)}}replaceRenderer(e,t=!0){const s=this.renderer,r=s.domElement.parentNode;return this.setRenderer(e),t&&r!==null&&(r.removeChild(s.domElement),r.appendChild(e.domElement)),s}createDepthTexture(){const e=this.depthTexture=new Ae;return this.inputBuffer.depthTexture=e,this.inputBuffer.dispose(),this.inputBuffer.stencilBuffer?(e.format=et,e.type=tt):e.type=st,e}deleteDepthTexture(){if(this.depthTexture!==null){this.depthTexture.dispose(),this.depthTexture=null,this.inputBuffer.depthTexture=null,this.inputBuffer.dispose();for(const e of this.passes)e.setDepthTexture(null)}}createBuffer(e,t,s,r){const i=this.renderer,n=i===null?new _:i.getDrawingBufferSize(new _),a={minFilter:q,magFilter:q,stencilBuffer:t,depthBuffer:e,type:s},o=new P(n.width,n.height,a);return r>0&&(o.samples=r),s===L&&i!==null&&i.outputColorSpace===w&&(o.texture.colorSpace=w),o.texture.name="EffectComposer.Buffer",o.texture.generateMipmaps=!1,o}setMainScene(e){for(const t of this.passes)t.mainScene=e}setMainCamera(e){for(const t of this.passes)t.mainCamera=e}addPass(e,t){const s=this.passes,r=this.renderer,i=r.getDrawingBufferSize(new _),n=r.getContext().getContextAttributes().alpha,a=this.inputBuffer.texture.type;if(e.setRenderer(r),e.setSize(i.width,i.height),e.initialize(r,n,a),this.autoRenderToScreen&&(s.length>0&&(s[s.length-1].renderToScreen=!1),e.renderToScreen&&(this.autoRenderToScreen=!1)),t!==void 0?s.splice(t,0,e):s.push(e),this.autoRenderToScreen&&(s[s.length-1].renderToScreen=!0),e.needsDepthTexture||this.depthTexture!==null)if(this.depthTexture===null){const o=this.createDepthTexture();for(e of s)e.setDepthTexture(o)}else e.setDepthTexture(this.depthTexture)}removePass(e){const t=this.passes,s=t.indexOf(e);if(s!==-1&&t.splice(s,1).length>0){if(this.depthTexture!==null){const n=(o,u)=>o||u.needsDepthTexture;t.reduce(n,!1)||(e.getDepthTexture()===this.depthTexture&&e.setDepthTexture(null),this.deleteDepthTexture())}this.autoRenderToScreen&&s===t.length&&(e.renderToScreen=!1,t.length>0&&(t[t.length-1].renderToScreen=!0))}}removeAllPasses(){const e=this.passes;this.deleteDepthTexture(),e.length>0&&(this.autoRenderToScreen&&(e[e.length-1].renderToScreen=!1),this.passes=[])}render(e){const t=this.renderer,s=this.copyPass;let r=this.inputBuffer,i=this.outputBuffer,n=!1,a,o,u;e===void 0&&(this.timer.update(),e=this.timer.getDelta());for(const h of this.passes)h.enabled&&(h.render(t,r,i,e,n),h.needsSwap&&(n&&(s.renderToScreen=h.renderToScreen,a=t.getContext(),o=t.state.buffers.stencil,o.setFunc(a.NOTEQUAL,1,4294967295),s.render(t,r,i,e,n),o.setFunc(a.EQUAL,1,4294967295)),u=r,r=i,i=u),h instanceof zt?n=!0:h instanceof Dt&&(n=!1))}setSize(e,t,s){const r=this.renderer,i=r.getSize(new _);(e===void 0||t===void 0)&&(e=i.width,t=i.height),(i.width!==e||i.height!==t)&&r.setSize(e,t,s);const n=r.getDrawingBufferSize(new _);this.inputBuffer.setSize(n.width,n.height),this.outputBuffer.setSize(n.width,n.height);for(const a of this.passes)a.setSize(n.width,n.height)}reset(){this.dispose(),this.autoRenderToScreen=!0}dispose(){for(const e of this.passes)e.dispose();this.passes=[],this.inputBuffer!==null&&this.inputBuffer.dispose(),this.outputBuffer!==null&&this.outputBuffer.dispose(),this.deleteDepthTexture(),this.copyPass.dispose(),this.timer.dispose(),U.fullscreenGeometry.dispose()}},O={NONE:0,DEPTH:1,CONVOLUTION:2},b={FRAGMENT_HEAD:"FRAGMENT_HEAD",FRAGMENT_MAIN_UV:"FRAGMENT_MAIN_UV",FRAGMENT_MAIN_IMAGE:"FRAGMENT_MAIN_IMAGE",VERTEX_HEAD:"VERTEX_HEAD",VERTEX_MAIN_SUPPORT:"VERTEX_MAIN_SUPPORT"},Ft=class{constructor(){this.shaderParts=new Map([[b.FRAGMENT_HEAD,null],[b.FRAGMENT_MAIN_UV,null],[b.FRAGMENT_MAIN_IMAGE,null],[b.VERTEX_HEAD,null],[b.VERTEX_MAIN_SUPPORT,null]]),this.defines=new Map,this.uniforms=new Map,this.blendModes=new Map,this.extensions=new Set,this.attributes=O.NONE,this.varyings=new Set,this.uvTransformation=!1,this.readDepth=!1,this.colorSpace=Ie}},te=!1,Se=class{constructor(e=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(e),this.meshCount=0,this.replaceMaterial=t=>{if(t.isMesh){let s;if(t.material.flatShading)switch(t.material.side){case W:s=this.materialsFlatShadedDoubleSide;break;case Z:s=this.materialsFlatShadedBackSide;break;default:s=this.materialsFlatShaded;break}else switch(t.material.side){case W:s=this.materialsDoubleSide;break;case Z:s=this.materialsBackSide;break;default:s=this.materials;break}this.originalMaterials.set(t,t.material),t.isSkinnedMesh?t.material=s[2]:t.isInstancedMesh?t.material=s[1]:t.material=s[0],++this.meshCount}}}cloneMaterial(e){if(!(e instanceof I))return e.clone();const t=e.uniforms,s=new Map;for(const i in t){const n=t[i].value;n.isRenderTargetTexture&&(t[i].value=null,s.set(i,n))}const r=e.clone();for(const i of s)t[i[0]].value=i[1],r.uniforms[i[0]].value=i[1];return r}setMaterial(e){if(this.disposeMaterials(),this.material=e,e!==null){const t=this.materials=[this.cloneMaterial(e),this.cloneMaterial(e),this.cloneMaterial(e)];for(const s of t)s.uniforms=Object.assign({},e.uniforms),s.side=at;t[2].skinning=!0,this.materialsBackSide=t.map(s=>{const r=this.cloneMaterial(s);return r.uniforms=Object.assign({},e.uniforms),r.side=Z,r}),this.materialsDoubleSide=t.map(s=>{const r=this.cloneMaterial(s);return r.uniforms=Object.assign({},e.uniforms),r.side=W,r}),this.materialsFlatShaded=t.map(s=>{const r=this.cloneMaterial(s);return r.uniforms=Object.assign({},e.uniforms),r.flatShading=!0,r}),this.materialsFlatShadedBackSide=t.map(s=>{const r=this.cloneMaterial(s);return r.uniforms=Object.assign({},e.uniforms),r.flatShading=!0,r.side=Z,r}),this.materialsFlatShadedDoubleSide=t.map(s=>{const r=this.cloneMaterial(s);return r.uniforms=Object.assign({},e.uniforms),r.flatShading=!0,r.side=W,r})}}render(e,t,s){const r=e.shadowMap.enabled;if(e.shadowMap.enabled=!1,te){const i=this.originalMaterials;this.meshCount=0,t.traverse(this.replaceMaterial),e.render(t,s);for(const n of i)n[0].material=n[1];this.meshCount!==i.size&&i.clear()}else{const i=t.overrideMaterial;t.overrideMaterial=this.material,e.render(t,s),t.overrideMaterial=i}e.shadowMap.enabled=r}disposeMaterials(){if(this.material!==null){const e=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(const t of e)t.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return te}static set workaroundEnabled(e){te=e}},N=-1,R=class extends ue{constructor(e,t=N,s=N,r=1){super(),this.resizable=e,this.baseSize=new _(1,1),this.preferredSize=new _(t,s),this.target=this.preferredSize,this.s=r,this.effectiveSize=new _,this.addEventListener("change",()=>this.updateEffectiveSize()),this.updateEffectiveSize()}updateEffectiveSize(){const e=this.baseSize,t=this.preferredSize,s=this.effectiveSize,r=this.scale;t.width!==N?s.width=t.width:t.height!==N?s.width=Math.round(t.height*(e.width/Math.max(e.height,1))):s.width=Math.round(e.width*r),t.height!==N?s.height=t.height:t.width!==N?s.height=Math.round(t.width/Math.max(e.width/Math.max(e.height,1),1)):s.height=Math.round(e.height*r)}get width(){return this.effectiveSize.width}set width(e){this.preferredWidth=e}get height(){return this.effectiveSize.height}set height(e){this.preferredHeight=e}getWidth(){return this.width}getHeight(){return this.height}get scale(){return this.s}set scale(e){this.s!==e&&(this.s=e,this.preferredSize.setScalar(N),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getScale(){return this.scale}setScale(e){this.scale=e}get baseWidth(){return this.baseSize.width}set baseWidth(e){this.baseSize.width!==e&&(this.baseSize.width=e,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getBaseWidth(){return this.baseWidth}setBaseWidth(e){this.baseWidth=e}get baseHeight(){return this.baseSize.height}set baseHeight(e){this.baseSize.height!==e&&(this.baseSize.height=e,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getBaseHeight(){return this.baseHeight}setBaseHeight(e){this.baseHeight=e}setBaseSize(e,t){(this.baseSize.width!==e||this.baseSize.height!==t)&&(this.baseSize.set(e,t),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}get preferredWidth(){return this.preferredSize.width}set preferredWidth(e){this.preferredSize.width!==e&&(this.preferredSize.width=e,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getPreferredWidth(){return this.preferredWidth}setPreferredWidth(e){this.preferredWidth=e}get preferredHeight(){return this.preferredSize.height}set preferredHeight(e){this.preferredSize.height!==e&&(this.preferredSize.height=e,this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}getPreferredHeight(){return this.preferredHeight}setPreferredHeight(e){this.preferredHeight=e}setPreferredSize(e,t){(this.preferredSize.width!==e||this.preferredSize.height!==t)&&(this.preferredSize.set(e,t),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height))}copy(e){this.s=e.scale,this.baseSize.set(e.baseWidth,e.baseHeight),this.preferredSize.set(e.preferredWidth,e.preferredHeight),this.dispatchEvent({type:"change"}),this.resizable.setSize(this.baseSize.width,this.baseSize.height)}static get AUTO_SIZE(){return N}},m={ADD:0,ALPHA:1,AVERAGE:2,COLOR:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,DIVIDE:8,DST:9,EXCLUSION:10,HARD_LIGHT:11,HARD_MIX:12,HUE:13,INVERT:14,INVERT_RGB:15,LIGHTEN:16,LINEAR_BURN:17,LINEAR_DODGE:18,LINEAR_LIGHT:19,LUMINOSITY:20,MULTIPLY:21,NEGATION:22,NORMAL:23,OVERLAY:24,PIN_LIGHT:25,REFLECT:26,SATURATION:27,SCREEN:28,SOFT_LIGHT:29,SRC:30,SUBTRACT:31,VIVID_LIGHT:32},Nt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ot="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,src.a*opacity);}",Lt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=(dst.rgb+src.rgb)*0.5;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Gt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.xy,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ht="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=mix(step(0.0,b)*(1.0-min(vec3(1.0),(1.0-a)/max(b,1e-9))),vec3(1.0),step(1.0,a));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",kt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=step(0.0,a)*mix(min(vec3(1.0),a/max(1.0-b,1e-9)),vec3(1.0),step(1.0,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Vt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Wt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=abs(dst.rgb-src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",jt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb/max(src.rgb,1e-9);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Kt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-2.0*dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Zt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb,1.0);vec3 b=min(src.rgb,1.0);vec3 c=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Xt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=step(1.0,dst.rgb+src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",qt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.x,a.yz));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",$t="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Qt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=src.rgb*max(1.0-dst.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Yt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Jt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",es="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb+src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",ts="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(2.0*src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",ss="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.xy,b.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",rs="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",is="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-abs(1.0-dst.rgb-src.rgb),0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",ns="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,opacity);}",as="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=2.0*src.rgb*dst.rgb;vec3 b=1.0-2.0*(1.0-src.rgb)*(1.0-dst.rgb);vec3 c=mix(a,b,step(0.5,dst.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",os="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 c=mix(mix(src2,dst.rgb,step(0.5*dst.rgb,src.rgb)),max(src2-1.0,vec3(0.0)),step(dst.rgb,src2-1.0));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",ls="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb*dst.rgb/max(1.0-src.rgb,1e-9),1.0);vec3 c=mix(a,src.rgb,step(1.0,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",us="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.x,b.y,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",cs="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-min(dst.rgb*src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",hs="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 d=dst.rgb+(src2-1.0);vec3 w=step(0.5,src.rgb);vec3 a=dst.rgb-(1.0-src2)*dst.rgb*(1.0-dst.rgb);vec3 b=mix(d*(sqrt(dst.rgb)-dst.rgb),d*dst.rgb*((16.0*dst.rgb-12.0)*dst.rgb+3.0),w*(1.0-step(0.25,dst.rgb)));vec3 c=mix(a,b,w);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",ds="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return src;}",fs="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",ps="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=mix(max(1.0-min((1.0-dst.rgb)/(2.0*src.rgb),1.0),0.0),min(dst.rgb/(2.0*(1.0-src.rgb)),1.0),step(0.5,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",vs=new Map([[m.ADD,Nt],[m.ALPHA,Ot],[m.AVERAGE,Lt],[m.COLOR,Gt],[m.COLOR_BURN,Ht],[m.COLOR_DODGE,kt],[m.DARKEN,Vt],[m.DIFFERENCE,Wt],[m.DIVIDE,jt],[m.DST,null],[m.EXCLUSION,Kt],[m.HARD_LIGHT,Zt],[m.HARD_MIX,Xt],[m.HUE,qt],[m.INVERT,$t],[m.INVERT_RGB,Qt],[m.LIGHTEN,Yt],[m.LINEAR_BURN,Jt],[m.LINEAR_DODGE,es],[m.LINEAR_LIGHT,ts],[m.LUMINOSITY,ss],[m.MULTIPLY,rs],[m.NEGATION,is],[m.NORMAL,ns],[m.OVERLAY,as],[m.PIN_LIGHT,os],[m.REFLECT,ls],[m.SATURATION,us],[m.SCREEN,cs],[m.SOFT_LIGHT,hs],[m.SRC,ds],[m.SUBTRACT,fs],[m.VIVID_LIGHT,ps]]),ms=class extends ue{constructor(e,t=1){super(),this._blendFunction=e,this.opacity=new d(t)}getOpacity(){return this.opacity.value}setOpacity(e){this.opacity.value=e}get blendFunction(){return this._blendFunction}set blendFunction(e){this._blendFunction=e,this.dispatchEvent({type:"change"})}getBlendFunction(){return this.blendFunction}setBlendFunction(e){this.blendFunction=e}getShaderCode(){return vs.get(this.blendFunction)}},Q=class extends ue{constructor(e,t,{attributes:s=O.NONE,blendFunction:r=m.NORMAL,defines:i=new Map,uniforms:n=new Map,extensions:a=null,vertexShader:o=null}={}){super(),this.name=e,this.renderer=null,this.attributes=s,this.fragmentShader=t,this.vertexShader=o,this.defines=i,this.uniforms=n,this.extensions=a,this.blendMode=new ms(r),this.blendMode.addEventListener("change",u=>this.setChanged()),this._inputColorSpace=Ie,this._outputColorSpace=Fe}get inputColorSpace(){return this._inputColorSpace}set inputColorSpace(e){this._inputColorSpace=e,this.setChanged()}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e,this.setChanged()}set mainScene(e){}set mainCamera(e){}getName(){return this.name}setRenderer(e){this.renderer=e}getDefines(){return this.defines}getUniforms(){return this.uniforms}getExtensions(){return this.extensions}getBlendMode(){return this.blendMode}getAttributes(){return this.attributes}setAttributes(e){this.attributes=e,this.setChanged()}getFragmentShader(){return this.fragmentShader}setFragmentShader(e){this.fragmentShader=e,this.setChanged()}getVertexShader(){return this.vertexShader}setVertexShader(e){this.vertexShader=e,this.setChanged()}setChanged(){this.dispatchEvent({type:"change"})}setDepthTexture(e,t=V){}update(e,t,s){}setSize(e,t){}initialize(e,t,s){}dispose(){for(const e of Object.keys(this)){const t=this[e];(t instanceof P||t instanceof Ne||t instanceof Oe||t instanceof U)&&this[e].dispose()}}},Y={SMALL:1,MEDIUM:2,LARGE:3},gs=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec4 sum=texture2D(inputBuffer,vUv0);sum+=texture2D(inputBuffer,vUv1);sum+=texture2D(inputBuffer,vUv2);sum+=texture2D(inputBuffer,vUv3);gl_FragColor=sum*0.25;
#include <colorspace_fragment>
}`,xs="uniform vec4 texelSize;uniform float kernel;uniform float scale;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vec2 dUv=(texelSize.xy*vec2(kernel)+texelSize.zw)*scale;vUv0=vec2(uv.x-dUv.x,uv.y+dUv.y);vUv1=vec2(uv.x+dUv.x,uv.y+dUv.y);vUv2=vec2(uv.x+dUv.x,uv.y-dUv.y);vUv3=vec2(uv.x-dUv.x,uv.y-dUv.y);gl_Position=vec4(position.xy,1.0,1.0);}",Ss=[new Float32Array([0,0]),new Float32Array([0,1,1]),new Float32Array([0,1,1,2]),new Float32Array([0,1,2,2,3]),new Float32Array([0,1,2,3,4,4,5]),new Float32Array([0,1,2,3,4,5,7,8,9,10])],Ts=class extends I{constructor(e=new ae){super({name:"KawaseBlurMaterial",uniforms:{inputBuffer:new d(null),texelSize:new d(new ae),scale:new d(1),kernel:new d(0)},blending:G,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:gs,vertexShader:xs}),this.setTexelSize(e.x,e.y),this.kernelSize=Y.MEDIUM}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.inputBuffer=e}get kernelSequence(){return Ss[this.kernelSize]}get scale(){return this.uniforms.scale.value}set scale(e){this.uniforms.scale.value=e}getScale(){return this.uniforms.scale.value}setScale(e){this.uniforms.scale.value=e}getKernel(){return null}get kernel(){return this.uniforms.kernel.value}set kernel(e){this.uniforms.kernel.value=e}setKernel(e){this.kernel=e}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t,e*.5,t*.5)}setSize(e,t){const s=1/e,r=1/t;this.uniforms.texelSize.value.set(s,r,s*.5,r*.5)}},Ke=class extends U{constructor({kernelSize:e=Y.MEDIUM,resolutionScale:t=.5,width:s=R.AUTO_SIZE,height:r=R.AUTO_SIZE,resolutionX:i=s,resolutionY:n=r}={}){super("KawaseBlurPass"),this.renderTargetA=new P(1,1,{depthBuffer:!1}),this.renderTargetA.texture.name="Blur.Target.A",this.renderTargetB=this.renderTargetA.clone(),this.renderTargetB.texture.name="Blur.Target.B";const a=this.resolution=new R(this,i,n,t);a.addEventListener("change",o=>this.setSize(a.baseWidth,a.baseHeight)),this._blurMaterial=new Ts,this._blurMaterial.kernelSize=e,this.copyMaterial=new Ve}getResolution(){return this.resolution}get blurMaterial(){return this._blurMaterial}set blurMaterial(e){this._blurMaterial=e}get dithering(){return this.copyMaterial.dithering}set dithering(e){this.copyMaterial.dithering=e}get kernelSize(){return this.blurMaterial.kernelSize}set kernelSize(e){this.blurMaterial.kernelSize=e}get width(){return this.resolution.width}set width(e){this.resolution.preferredWidth=e}get height(){return this.resolution.height}set height(e){this.resolution.preferredHeight=e}get scale(){return this.blurMaterial.scale}set scale(e){this.blurMaterial.scale=e}getScale(){return this.blurMaterial.scale}setScale(e){this.blurMaterial.scale=e}getKernelSize(){return this.kernelSize}setKernelSize(e){this.kernelSize=e}getResolutionScale(){return this.resolution.scale}setResolutionScale(e){this.resolution.scale=e}render(e,t,s,r,i){const n=this.scene,a=this.camera,o=this.renderTargetA,u=this.renderTargetB,h=this.blurMaterial,g=h.kernelSequence;let p=t;this.fullscreenMaterial=h;for(let c=0,l=g.length;c<l;++c){const v=(c&1)===0?o:u;h.kernel=g[c],h.inputBuffer=p.texture,e.setRenderTarget(v),e.render(n,a),p=v}this.fullscreenMaterial=this.copyMaterial,this.copyMaterial.inputBuffer=p.texture,e.setRenderTarget(this.renderToScreen?null:s),e.render(n,a)}setSize(e,t){const s=this.resolution;s.setBaseSize(e,t);const r=s.width,i=s.height;this.renderTargetA.setSize(r,i),this.renderTargetB.setSize(r,i),this.blurMaterial.setSize(e,t)}initialize(e,t,s){s!==void 0&&(this.renderTargetA.texture.type=s,this.renderTargetB.texture.type=s,s!==L?(this.blurMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.copyMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1"):e!==null&&e.outputColorSpace===w&&(this.renderTargetA.texture.colorSpace=w,this.renderTargetB.texture.colorSpace=w))}static get AUTO_SIZE(){return R.AUTO_SIZE}},bs=`#include <common>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#ifdef RANGE
uniform vec2 range;
#elif defined(THRESHOLD)
uniform float threshold;uniform float smoothing;
#endif
varying vec2 vUv;void main(){vec4 texel=texture2D(inputBuffer,vUv);float l=luminance(texel.rgb);float mask=1.0;
#ifdef RANGE
float low=step(range.x,l);float high=step(l,range.y);mask=low*high;
#elif defined(THRESHOLD)
mask=smoothstep(threshold,threshold+smoothing,l);
#endif
#ifdef COLOR
gl_FragColor=texel*mask;
#else
gl_FragColor=vec4(l*mask);
#endif
}`,ys=class extends I{constructor(e=!1,t=null){super({name:"LuminanceMaterial",defines:{THREE_REVISION:Le.replace(/\D+/g,"")},uniforms:{inputBuffer:new d(null),threshold:new d(0),smoothing:new d(1),range:new d(null)},blending:G,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:bs,vertexShader:he}),this.colorOutput=e,this.luminanceRange=t}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}get threshold(){return this.uniforms.threshold.value}set threshold(e){this.smoothing>0||e>0?this.defines.THRESHOLD="1":delete this.defines.THRESHOLD,this.uniforms.threshold.value=e}getThreshold(){return this.threshold}setThreshold(e){this.threshold=e}get smoothing(){return this.uniforms.smoothing.value}set smoothing(e){this.threshold>0||e>0?this.defines.THRESHOLD="1":delete this.defines.THRESHOLD,this.uniforms.smoothing.value=e}getSmoothingFactor(){return this.smoothing}setSmoothingFactor(e){this.smoothing=e}get useThreshold(){return this.threshold>0||this.smoothing>0}set useThreshold(e){}get colorOutput(){return this.defines.COLOR!==void 0}set colorOutput(e){e?this.defines.COLOR="1":delete this.defines.COLOR,this.needsUpdate=!0}isColorOutputEnabled(e){return this.colorOutput}setColorOutputEnabled(e){this.colorOutput=e}get useRange(){return this.luminanceRange!==null}set useRange(e){this.luminanceRange=null}get luminanceRange(){return this.uniforms.range.value}set luminanceRange(e){e!==null?this.defines.RANGE="1":delete this.defines.RANGE,this.uniforms.range.value=e,this.needsUpdate=!0}getLuminanceRange(){return this.luminanceRange}setLuminanceRange(e){this.luminanceRange=e}},Es=class extends U{constructor({renderTarget:e,luminanceRange:t,colorOutput:s,resolutionScale:r=1,width:i=R.AUTO_SIZE,height:n=R.AUTO_SIZE,resolutionX:a=i,resolutionY:o=n}={}){super("LuminancePass"),this.fullscreenMaterial=new ys(s,t),this.needsSwap=!1,this.renderTarget=e,this.renderTarget===void 0&&(this.renderTarget=new P(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="LuminancePass.Target");const u=this.resolution=new R(this,a,o,r);u.addEventListener("change",h=>this.setSize(u.baseWidth,u.baseHeight))}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}render(e,t,s,r,i){const n=this.fullscreenMaterial;n.inputBuffer=t.texture,e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){const s=this.resolution;s.setBaseSize(e,t),this.renderTarget.setSize(s.width,s.height)}initialize(e,t,s){s!==void 0&&s!==L&&(this.renderTarget.texture.type=s,this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}},Ms=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#define WEIGHT_INNER 0.125
#define WEIGHT_OUTER 0.0555555
varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;float clampToBorder(const in vec2 uv){return float(uv.s>=0.0&&uv.s<=1.0&&uv.t>=0.0&&uv.t<=1.0);}void main(){vec4 c=vec4(0.0);vec4 w=WEIGHT_INNER*vec4(clampToBorder(vUv00),clampToBorder(vUv01),clampToBorder(vUv02),clampToBorder(vUv03));c+=w.x*texture2D(inputBuffer,vUv00);c+=w.y*texture2D(inputBuffer,vUv01);c+=w.z*texture2D(inputBuffer,vUv02);c+=w.w*texture2D(inputBuffer,vUv03);w=WEIGHT_OUTER*vec4(clampToBorder(vUv04),clampToBorder(vUv05),clampToBorder(vUv06),clampToBorder(vUv07));c+=w.x*texture2D(inputBuffer,vUv04);c+=w.y*texture2D(inputBuffer,vUv05);c+=w.z*texture2D(inputBuffer,vUv06);c+=w.w*texture2D(inputBuffer,vUv07);w=WEIGHT_OUTER*vec4(clampToBorder(vUv08),clampToBorder(vUv09),clampToBorder(vUv10),clampToBorder(vUv11));c+=w.x*texture2D(inputBuffer,vUv08);c+=w.y*texture2D(inputBuffer,vUv09);c+=w.z*texture2D(inputBuffer,vUv10);c+=w.w*texture2D(inputBuffer,vUv11);c+=WEIGHT_OUTER*texture2D(inputBuffer,vUv);gl_FragColor=c;
#include <colorspace_fragment>
}`,ws="uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv00;varying vec2 vUv01;varying vec2 vUv02;varying vec2 vUv03;varying vec2 vUv04;varying vec2 vUv05;varying vec2 vUv06;varying vec2 vUv07;varying vec2 vUv08;varying vec2 vUv09;varying vec2 vUv10;varying vec2 vUv11;void main(){vUv=position.xy*0.5+0.5;vUv00=vUv+texelSize*vec2(-1.0,1.0);vUv01=vUv+texelSize*vec2(1.0,1.0);vUv02=vUv+texelSize*vec2(-1.0,-1.0);vUv03=vUv+texelSize*vec2(1.0,-1.0);vUv04=vUv+texelSize*vec2(-2.0,2.0);vUv05=vUv+texelSize*vec2(0.0,2.0);vUv06=vUv+texelSize*vec2(2.0,2.0);vUv07=vUv+texelSize*vec2(-2.0,0.0);vUv08=vUv+texelSize*vec2(2.0,0.0);vUv09=vUv+texelSize*vec2(-2.0,-2.0);vUv10=vUv+texelSize*vec2(0.0,-2.0);vUv11=vUv+texelSize*vec2(2.0,-2.0);gl_Position=vec4(position.xy,1.0,1.0);}",Rs=class extends I{constructor(){super({name:"DownsamplingMaterial",uniforms:{inputBuffer:new d(null),texelSize:new d(new _)},blending:G,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:Ms,vertexShader:ws})}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setSize(e,t){this.uniforms.texelSize.value.set(1/e,1/t)}},_s=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;uniform mediump sampler2D supportBuffer;
#else
uniform lowp sampler2D inputBuffer;uniform lowp sampler2D supportBuffer;
#endif
uniform float radius;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vec4 c=vec4(0.0);c+=texture2D(inputBuffer,vUv0)*0.0625;c+=texture2D(inputBuffer,vUv1)*0.125;c+=texture2D(inputBuffer,vUv2)*0.0625;c+=texture2D(inputBuffer,vUv3)*0.125;c+=texture2D(inputBuffer,vUv)*0.25;c+=texture2D(inputBuffer,vUv4)*0.125;c+=texture2D(inputBuffer,vUv5)*0.0625;c+=texture2D(inputBuffer,vUv6)*0.125;c+=texture2D(inputBuffer,vUv7)*0.0625;vec4 baseColor=texture2D(supportBuffer,vUv);gl_FragColor=mix(baseColor,c,radius);
#include <colorspace_fragment>
}`,Bs="uniform vec2 texelSize;varying vec2 vUv;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;varying vec2 vUv4;varying vec2 vUv5;varying vec2 vUv6;varying vec2 vUv7;void main(){vUv=position.xy*0.5+0.5;vUv0=vUv+texelSize*vec2(-1.0,1.0);vUv1=vUv+texelSize*vec2(0.0,1.0);vUv2=vUv+texelSize*vec2(1.0,1.0);vUv3=vUv+texelSize*vec2(-1.0,0.0);vUv4=vUv+texelSize*vec2(1.0,0.0);vUv5=vUv+texelSize*vec2(-1.0,-1.0);vUv6=vUv+texelSize*vec2(0.0,-1.0);vUv7=vUv+texelSize*vec2(1.0,-1.0);gl_Position=vec4(position.xy,1.0,1.0);}",Us=class extends I{constructor(){super({name:"UpsamplingMaterial",uniforms:{inputBuffer:new d(null),supportBuffer:new d(null),texelSize:new d(new _),radius:new d(.85)},blending:G,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:_s,vertexShader:Bs})}set inputBuffer(e){this.uniforms.inputBuffer.value=e}set supportBuffer(e){this.uniforms.supportBuffer.value=e}get radius(){return this.uniforms.radius.value}set radius(e){this.uniforms.radius.value=e}setSize(e,t){this.uniforms.texelSize.value.set(1/e,1/t)}},Cs=class extends U{constructor(){super("MipmapBlurPass"),this.needsSwap=!1,this.renderTarget=new P(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="Upsampling.Mipmap0",this.downsamplingMipmaps=[],this.upsamplingMipmaps=[],this.downsamplingMaterial=new Rs,this.upsamplingMaterial=new Us,this.resolution=new _}get texture(){return this.renderTarget.texture}get levels(){return this.downsamplingMipmaps.length}set levels(e){if(this.levels!==e){const t=this.renderTarget;this.dispose(),this.downsamplingMipmaps=[],this.upsamplingMipmaps=[];for(let s=0;s<e;++s){const r=t.clone();r.texture.name="Downsampling.Mipmap"+s,this.downsamplingMipmaps.push(r)}this.upsamplingMipmaps.push(t);for(let s=1,r=e-1;s<r;++s){const i=t.clone();i.texture.name="Upsampling.Mipmap"+s,this.upsamplingMipmaps.push(i)}this.setSize(this.resolution.x,this.resolution.y)}}get radius(){return this.upsamplingMaterial.radius}set radius(e){this.upsamplingMaterial.radius=e}render(e,t,s,r,i){const{scene:n,camera:a}=this,{downsamplingMaterial:o,upsamplingMaterial:u}=this,{downsamplingMipmaps:h,upsamplingMipmaps:g}=this;let p=t;this.fullscreenMaterial=o;for(let c=0,l=h.length;c<l;++c){const v=h[c];o.setSize(p.width,p.height),o.inputBuffer=p.texture,e.setRenderTarget(v),e.render(n,a),p=v}this.fullscreenMaterial=u;for(let c=g.length-1;c>=0;--c){const l=g[c];u.setSize(p.width,p.height),u.inputBuffer=p.texture,u.supportBuffer=h[c].texture,e.setRenderTarget(l),e.render(n,a),p=l}}setSize(e,t){const s=this.resolution;s.set(e,t);let r=s.width,i=s.height;for(let n=0,a=this.downsamplingMipmaps.length;n<a;++n)r=Math.round(r*.5),i=Math.round(i*.5),this.downsamplingMipmaps[n].setSize(r,i),n<this.upsamplingMipmaps.length&&this.upsamplingMipmaps[n].setSize(r,i)}initialize(e,t,s){if(s!==void 0){const r=this.downsamplingMipmaps.concat(this.upsamplingMipmaps);for(const i of r)i.texture.type=s;if(s!==L)this.downsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1",this.upsamplingMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1";else if(e!==null&&e.outputColorSpace===w)for(const i of r)i.texture.colorSpace=w}}dispose(){super.dispose();for(const e of this.downsamplingMipmaps.concat(this.upsamplingMipmaps))e.dispose()}},Ps=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
uniform float intensity;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=texture2D(map,uv)*intensity;}`,Ds=class extends Q{constructor({blendFunction:e=m.SCREEN,luminanceThreshold:t=1,luminanceSmoothing:s=.03,mipmapBlur:r=!0,intensity:i=1,radius:n=.85,levels:a=8,kernelSize:o=Y.LARGE,resolutionScale:u=.5,width:h=R.AUTO_SIZE,height:g=R.AUTO_SIZE,resolutionX:p=h,resolutionY:c=g}={}){super("BloomEffect",Ps,{blendFunction:e,uniforms:new Map([["map",new d(null)],["intensity",new d(i)]])}),this.renderTarget=new P(1,1,{depthBuffer:!1}),this.renderTarget.texture.name="Bloom.Target",this.blurPass=new Ke({kernelSize:o}),this.luminancePass=new Es({colorOutput:!0}),this.luminanceMaterial.threshold=t,this.luminanceMaterial.smoothing=s,this.mipmapBlurPass=new Cs,this.mipmapBlurPass.enabled=r,this.mipmapBlurPass.radius=n,this.mipmapBlurPass.levels=a,this.uniforms.get("map").value=r?this.mipmapBlurPass.texture:this.renderTarget.texture;const l=this.resolution=new R(this,p,c,u);l.addEventListener("change",v=>this.setSize(l.baseWidth,l.baseHeight))}get texture(){return this.mipmapBlurPass.enabled?this.mipmapBlurPass.texture:this.renderTarget.texture}getTexture(){return this.texture}getResolution(){return this.resolution}getBlurPass(){return this.blurPass}getLuminancePass(){return this.luminancePass}get luminanceMaterial(){return this.luminancePass.fullscreenMaterial}getLuminanceMaterial(){return this.luminancePass.fullscreenMaterial}get width(){return this.resolution.width}set width(e){this.resolution.preferredWidth=e}get height(){return this.resolution.height}set height(e){this.resolution.preferredHeight=e}get dithering(){return this.blurPass.dithering}set dithering(e){this.blurPass.dithering=e}get kernelSize(){return this.blurPass.kernelSize}set kernelSize(e){this.blurPass.kernelSize=e}get distinction(){return console.warn(this.name,"distinction was removed"),1}set distinction(e){console.warn(this.name,"distinction was removed")}get intensity(){return this.uniforms.get("intensity").value}set intensity(e){this.uniforms.get("intensity").value=e}getIntensity(){return this.intensity}setIntensity(e){this.intensity=e}getResolutionScale(){return this.resolution.scale}setResolutionScale(e){this.resolution.scale=e}update(e,t,s){const r=this.renderTarget,i=this.luminancePass;i.enabled?(i.render(e,t),this.mipmapBlurPass.enabled?this.mipmapBlurPass.render(e,i.renderTarget):this.blurPass.render(e,i.renderTarget,r)):this.mipmapBlurPass.enabled?this.mipmapBlurPass.render(e,t):this.blurPass.render(e,t,r)}setSize(e,t){const s=this.resolution;s.setBaseSize(e,t),this.renderTarget.setSize(s.width,s.height),this.blurPass.resolution.copy(s),this.luminancePass.setSize(e,t),this.mipmapBlurPass.setSize(e,t)}initialize(e,t,s){this.blurPass.initialize(e,t,s),this.luminancePass.initialize(e,t,s),this.mipmapBlurPass.initialize(e,t,s),s!==void 0&&(this.renderTarget.texture.type=s,e!==null&&e.outputColorSpace===w&&(this.renderTarget.texture.colorSpace=w))}},As=class extends U{constructor(e,t="inputBuffer"){super("ShaderPass"),this.fullscreenMaterial=e,this.input=t}setInput(e){this.input=e}render(e,t,s,r,i){const n=this.fullscreenMaterial.uniforms;t!==null&&n!==void 0&&n[this.input]!==void 0&&(n[this.input].value=t.texture),e.setRenderTarget(this.renderToScreen?null:s),e.render(this.scene,this.camera)}initialize(e,t,s){s!==void 0&&s!==L&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}},zs=`#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
uniform vec2 lightPosition;uniform float exposure;uniform float decay;uniform float density;uniform float weight;uniform float clampMax;varying vec2 vUv;void main(){vec2 coord=vUv;vec2 delta=lightPosition-coord;delta*=1.0/SAMPLES_FLOAT*density;float illuminationDecay=1.0;vec4 color=vec4(0.0);for(int i=0;i<SAMPLES_INT;++i){coord+=delta;vec4 texel=texture2D(inputBuffer,coord);texel*=illuminationDecay*weight;color+=texel;illuminationDecay*=decay;}gl_FragColor=clamp(color*exposure,0.0,clampMax);
#include <dithering_fragment>
}`,Is=class extends I{constructor(e){super({name:"GodRaysMaterial",defines:{SAMPLES_INT:"60",SAMPLES_FLOAT:"60.0"},uniforms:{inputBuffer:new d(null),lightPosition:new d(e),density:new d(1),decay:new d(1),weight:new d(1),exposure:new d(1),clampMax:new d(1)},blending:G,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:zs,vertexShader:he})}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}get lightPosition(){return this.uniforms.lightPosition.value}getLightPosition(){return this.uniforms.lightPosition.value}setLightPosition(e){this.uniforms.lightPosition.value=e}get density(){return this.uniforms.density.value}set density(e){this.uniforms.density.value=e}getDensity(){return this.uniforms.density.value}setDensity(e){this.uniforms.density.value=e}get decay(){return this.uniforms.decay.value}set decay(e){this.uniforms.decay.value=e}getDecay(){return this.uniforms.decay.value}setDecay(e){this.uniforms.decay.value=e}get weight(){return this.uniforms.weight.value}set weight(e){this.uniforms.weight.value=e}getWeight(){return this.uniforms.weight.value}setWeight(e){this.uniforms.weight.value=e}get exposure(){return this.uniforms.exposure.value}set exposure(e){this.uniforms.exposure.value=e}getExposure(){return this.uniforms.exposure.value}setExposure(e){this.uniforms.exposure.value=e}get maxIntensity(){return this.uniforms.clampMax.value}set maxIntensity(e){this.uniforms.clampMax.value=e}getMaxIntensity(){return this.uniforms.clampMax.value}setMaxIntensity(e){this.uniforms.clampMax.value=e}get samples(){return Number(this.defines.SAMPLES_INT)}set samples(e){const t=Math.floor(e);this.defines.SAMPLES_INT=t.toFixed(0),this.defines.SAMPLES_FLOAT=t.toFixed(1),this.needsUpdate=!0}getSamples(){return this.samples}setSamples(e){this.samples=e}},de=class extends U{constructor(e,t,s=null){super("RenderPass",e,t),this.needsSwap=!1,this.clearPass=new je,this.overrideMaterialManager=s===null?null:new Se(s),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get renderToScreen(){return super.renderToScreen}set renderToScreen(e){super.renderToScreen=e,this.clearPass.renderToScreen=e}get overrideMaterial(){const e=this.overrideMaterialManager;return e!==null?e.material:null}set overrideMaterial(e){const t=this.overrideMaterialManager;e!==null?t!==null?t.setMaterial(e):this.overrideMaterialManager=new Se(e):t!==null&&(t.dispose(),this.overrideMaterialManager=null)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(e){this.overrideMaterial=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getSelection(){return this.selection}setSelection(e){this.selection=e}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(e){this.ignoreBackground=e}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(e){this.skipShadowMapUpdate=e}getClearPass(){return this.clearPass}render(e,t,s,r,i){const n=this.scene,a=this.camera,o=this.selection,u=a.layers.mask,h=n.background,g=e.shadowMap.autoUpdate,p=this.renderToScreen?null:t;o!==null&&a.layers.set(o.getLayer()),this.skipShadowMapUpdate&&(e.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(n.background=null),this.clearPass.enabled&&this.clearPass.render(e,t),e.setRenderTarget(p),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(e,n,a):e.render(n,a),a.layers.mask=u,n.background=h,e.shadowMap.autoUpdate=g}},Fs=`#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D map;
#else
uniform lowp sampler2D map;
#endif
void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){outputColor=texture2D(map,uv);}`,se=new nt,Te=new it,Ns=class extends Q{constructor(e,t,{blendFunction:s=m.SCREEN,samples:r=60,density:i=.96,decay:n=.9,weight:a=.4,exposure:o=.6,clampMax:u=1,blur:h=!0,kernelSize:g=Y.SMALL,resolutionScale:p=.5,width:c=R.AUTO_SIZE,height:l=R.AUTO_SIZE,resolutionX:v=c,resolutionY:S=l}={}){super("GodRaysEffect",Fs,{blendFunction:s,attributes:O.DEPTH,uniforms:new Map([["map",new d(null)]])}),this.camera=e,this._lightSource=t,this.lightSource=t,this.lightScene=new ne,this.screenPosition=new _,this.renderTargetA=new P(1,1,{depthBuffer:!1}),this.renderTargetA.texture.name="GodRays.Target.A",this.renderTargetB=this.renderTargetA.clone(),this.renderTargetB.texture.name="GodRays.Target.B",this.uniforms.get("map").value=this.renderTargetB.texture,this.renderTargetLight=new P(1,1),this.renderTargetLight.texture.name="GodRays.Light",this.renderTargetLight.depthTexture=new Ae,this.renderPassLight=new de(this.lightScene,e),this.renderPassLight.clearPass.enabled=!1,this.blurPass=new Ke({kernelSize:g}),this.blurPass.enabled=h,this.copyPass=new We(this.renderTargetLight),this.copyPass.fullscreenMaterial.channelWeights=new ae(0,0,0,1),this.godRaysPass=new As(new Is(this.screenPosition));const f=this.godRaysMaterial;f.density=i,f.decay=n,f.weight=a,f.exposure=o,f.maxIntensity=u,f.samples=r;const y=this.resolution=new R(this,v,S,p);y.addEventListener("change",x=>this.setSize(y.baseWidth,y.baseHeight))}set mainCamera(e){this.camera=e,this.renderPassLight.mainCamera=e}get lightSource(){return this._lightSource}set lightSource(e){this._lightSource=e,e!==null&&(e.material.depthWrite=!1,e.material.transparent=!0)}getBlurPass(){return this.blurPass}get texture(){return this.renderTargetB.texture}getTexture(){return this.texture}get godRaysMaterial(){return this.godRaysPass.fullscreenMaterial}getGodRaysMaterial(){return this.godRaysMaterial}getResolution(){return this.resolution}get width(){return this.resolution.width}set width(e){this.resolution.preferredWidth=e}get height(){return this.resolution.height}set height(e){this.resolution.preferredHeight=e}get dithering(){return this.godRaysMaterial.dithering}set dithering(e){const t=this.godRaysMaterial;t.dithering=e,t.needsUpdate=!0}get blur(){return this.blurPass.enabled}set blur(e){this.blurPass.enabled=e}get kernelSize(){return this.blurPass.kernelSize}set kernelSize(e){this.blurPass.kernelSize=e}getResolutionScale(){return this.resolution.scale}setResolutionScale(e){this.resolution.scale=e}get samples(){return this.godRaysMaterial.samples}set samples(e){this.godRaysMaterial.samples=e}setDepthTexture(e,t=V){this.copyPass.fullscreenMaterial.depthBuffer=e,this.copyPass.fullscreenMaterial.depthPacking=t}update(e,t,s){const r=this.lightSource,i=r.parent,n=r.matrixAutoUpdate,a=this.renderTargetA,o=this.renderTargetLight;r.material.depthWrite=!0,r.matrixAutoUpdate=!1,r.updateWorldMatrix(!0,!1),i!==null&&(n||Te.copy(r.matrix),r.matrix.copy(r.matrixWorld)),this.lightScene.add(r),this.copyPass.render(e,t),this.renderPassLight.render(e,o),r.material.depthWrite=!1,r.matrixAutoUpdate=n,i!==null&&(n||r.matrix.copy(Te),i.add(r)),se.setFromMatrixPosition(r.matrixWorld).project(this.camera),this.screenPosition.set(Math.min(Math.max((se.x+1)*.5,-1),2),Math.min(Math.max((se.y+1)*.5,-1),2));let u=o;this.blurPass.enabled&&(this.blurPass.render(e,u,a),u=a),this.godRaysPass.render(e,u,this.renderTargetB)}setSize(e,t){const s=this.resolution;s.setBaseSize(e,t);const r=s.width,i=s.height;this.renderTargetLight.setSize(e,t),this.renderTargetA.setSize(r,i),this.renderTargetB.setSize(r,i),this.blurPass.resolution.copy(s)}initialize(e,t,s){this.blurPass.initialize(e,t,s),this.renderPassLight.initialize(e,t,s),this.copyPass.initialize(e,t,s),this.godRaysPass.initialize(e,t,s),s!==void 0&&(this.renderTargetA.texture.type=s,this.renderTargetB.texture.type=s,this.renderTargetLight.texture.type=s,e!==null&&e.outputColorSpace===w&&(this.renderTargetA.texture.colorSpace=w,this.renderTargetB.texture.colorSpace=w,this.renderTargetLight.texture.colorSpace=w))}},Os=`#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
#ifdef DOWNSAMPLE_NORMALS
uniform lowp sampler2D normalBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}int findBestDepth(const in float samples[4]){float c=(samples[0]+samples[1]+samples[2]+samples[3])*0.25;float distances[4];distances[0]=abs(c-samples[0]);distances[1]=abs(c-samples[1]);distances[2]=abs(c-samples[2]);distances[3]=abs(c-samples[3]);float maxDistance=max(max(distances[0],distances[1]),max(distances[2],distances[3]));int remaining[3];int rejected[3];int i,j,k;for(i=0,j=0,k=0;i<4;++i){if(distances[i]<maxDistance){remaining[j++]=i;}else{rejected[k++]=i;}}for(;j<3;++j){remaining[j]=rejected[--k];}vec3 s=vec3(samples[remaining[0]],samples[remaining[1]],samples[remaining[2]]);c=(s.x+s.y+s.z)/3.0;distances[0]=abs(c-s.x);distances[1]=abs(c-s.y);distances[2]=abs(c-s.z);float minDistance=min(distances[0],min(distances[1],distances[2]));for(i=0;i<3;++i){if(distances[i]==minDistance){break;}}return remaining[i];}void main(){float d[4];d[0]=readDepth(vUv0);d[1]=readDepth(vUv1);d[2]=readDepth(vUv2);d[3]=readDepth(vUv3);int index=findBestDepth(d);
#ifdef DOWNSAMPLE_NORMALS
vec3 n[4];n[0]=texture2D(normalBuffer,vUv0).rgb;n[1]=texture2D(normalBuffer,vUv1).rgb;n[2]=texture2D(normalBuffer,vUv2).rgb;n[3]=texture2D(normalBuffer,vUv3).rgb;
#else
vec3 n[4];n[0]=vec3(0.0);n[1]=vec3(0.0);n[2]=vec3(0.0);n[3]=vec3(0.0);
#endif
gl_FragColor=vec4(n[index],d[index]);}`,Ls="uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=uv;vUv1=vec2(uv.x,uv.y+texelSize.y);vUv2=vec2(uv.x+texelSize.x,uv.y);vUv3=uv+texelSize;gl_Position=vec4(position.xy,1.0,1.0);}",Gs=class extends I{constructor(){super({name:"DepthDownsamplingMaterial",defines:{DEPTH_PACKING:"0"},uniforms:{depthBuffer:new d(null),normalBuffer:new d(null),texelSize:new d(new _)},blending:G,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:Os,vertexShader:Ls})}set depthBuffer(e){this.uniforms.depthBuffer.value=e}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}setDepthBuffer(e,t=V){this.depthBuffer=e,this.depthPacking=t}set normalBuffer(e){this.uniforms.normalBuffer.value=e,e!==null?this.defines.DOWNSAMPLE_NORMALS="1":delete this.defines.DOWNSAMPLE_NORMALS,this.needsUpdate=!0}setNormalBuffer(e){this.normalBuffer=e}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t)}setSize(e,t){this.uniforms.texelSize.value.set(1/e,1/t)}},Hs=class extends U{constructor({normalBuffer:e=null,resolutionScale:t=.5,width:s=R.AUTO_SIZE,height:r=R.AUTO_SIZE,resolutionX:i=s,resolutionY:n=r}={}){super("DepthDownsamplingPass");const a=new Gs;a.normalBuffer=e,this.fullscreenMaterial=a,this.needsDepthTexture=!0,this.needsSwap=!1,this.renderTarget=new P(1,1,{minFilter:z,magFilter:z,depthBuffer:!1,type:ie}),this.renderTarget.texture.name="DepthDownsamplingPass.Target",this.renderTarget.texture.generateMipmaps=!1;const o=this.resolution=new R(this,i,n,t);o.addEventListener("change",u=>this.setSize(o.baseWidth,o.baseHeight))}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}setDepthTexture(e,t=V){this.fullscreenMaterial.depthBuffer=e,this.fullscreenMaterial.depthPacking=t}render(e,t,s,r,i){e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){const s=this.resolution;s.setBaseSize(e,t),this.renderTarget.setSize(s.width,s.height),this.fullscreenMaterial.setSize(e,t)}initialize(e,t,s){const r=e.getContext();if(!(r.getExtension("EXT_color_buffer_float")||r.getExtension("EXT_color_buffer_half_float")))throw new Error("Rendering to float texture is not supported.")}},ks=`#include <common>
#include <packing>
#include <dithering_pars_fragment>
#define packFloatToRGBA(v) packDepthToRGBA(v)
#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;vec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
float depth=unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
float depth=texture2D(depthBuffer,uv).r;
#endif
#if defined(USE_LOGARITHMIC_DEPTH_BUFFER) || defined(LOG_DEPTH)
float d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;
#elif defined(USE_REVERSED_DEPTH_BUFFER)
depth=1.0-depth;
#endif
return depth;}float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE color0.a=clamp(color0.a,0.0,1.0);gl_FragColor=color0;
#ifdef ENCODE_OUTPUT
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
}`,Vs="uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}",Ws=class extends I{constructor(e,t,s,r,i=!1){super({name:"EffectMaterial",defines:{THREE_REVISION:Le.replace(/\D+/g,""),DEPTH_PACKING:"0",ENCODE_OUTPUT:"1"},uniforms:{inputBuffer:new d(null),depthBuffer:new d(null),resolution:new d(new _),texelSize:new d(new _),cameraNear:new d(.3),cameraFar:new d(1e3),aspect:new d(1),time:new d(0)},blending:G,toneMapped:!1,depthWrite:!1,depthTest:!1,dithering:i}),e&&this.setShaderParts(e),t&&this.setDefines(t),s&&this.setUniforms(s),this.copyCameraSettings(r)}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){this.uniforms.depthBuffer.value=e}get depthPacking(){return Number(this.defines.DEPTH_PACKING)}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}setDepthBuffer(e,t=V){this.depthBuffer=e,this.depthPacking=t}setShaderData(e){this.setShaderParts(e.shaderParts),this.setDefines(e.defines),this.setUniforms(e.uniforms),this.setExtensions(e.extensions)}setShaderParts(e){return this.fragmentShader=ks.replace(b.FRAGMENT_HEAD,e.get(b.FRAGMENT_HEAD)||"").replace(b.FRAGMENT_MAIN_UV,e.get(b.FRAGMENT_MAIN_UV)||"").replace(b.FRAGMENT_MAIN_IMAGE,e.get(b.FRAGMENT_MAIN_IMAGE)||""),this.vertexShader=Vs.replace(b.VERTEX_HEAD,e.get(b.VERTEX_HEAD)||"").replace(b.VERTEX_MAIN_SUPPORT,e.get(b.VERTEX_MAIN_SUPPORT)||""),this.needsUpdate=!0,this}setDefines(e){for(const t of e.entries())this.defines[t[0]]=t[1];return this.needsUpdate=!0,this}setUniforms(e){for(const t of e.entries())this.uniforms[t[0]]=t[1];return this}setExtensions(e){this.extensions={};for(const t of e)this.extensions[t]=!0;return this}get encodeOutput(){return this.defines.ENCODE_OUTPUT!==void 0}set encodeOutput(e){this.encodeOutput!==e&&(e?this.defines.ENCODE_OUTPUT="1":delete this.defines.ENCODE_OUTPUT,this.needsUpdate=!0)}isOutputEncodingEnabled(e){return this.encodeOutput}setOutputEncodingEnabled(e){this.encodeOutput=e}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}setDeltaTime(e){this.uniforms.time.value+=e}adoptCameraSettings(e){this.copyCameraSettings(e)}copyCameraSettings(e){e&&(this.uniforms.cameraNear.value=e.near,this.uniforms.cameraFar.value=e.far,e instanceof ot?this.defines.PERSPECTIVE_CAMERA="1":delete this.defines.PERSPECTIVE_CAMERA,this.needsUpdate=!0)}setSize(e,t){const s=this.uniforms;s.resolution.value.set(e,t),s.texelSize.value.set(1/e,1/t),s.aspect.value=e/t}static get Section(){return b}};function be(e,t,s){for(const r of t){const i="$1"+e+r.charAt(0).toUpperCase()+r.slice(1),n=new RegExp("([^\\.])(\\b"+r+"\\b)","g");for(const a of s.entries())a[1]!==null&&s.set(a[0],a[1].replace(n,i))}}function js(e,t,s){let r=t.getFragmentShader(),i=t.getVertexShader();const n=r!==void 0&&/mainImage/.test(r),a=r!==void 0&&/mainUv/.test(r);if(s.attributes|=t.getAttributes(),r===void 0)throw new Error(`Missing fragment shader (${t.name})`);if(a&&(s.attributes&O.CONVOLUTION)!==0)throw new Error(`Effects that transform UVs are incompatible with convolution effects (${t.name})`);if(!n&&!a)throw new Error(`Could not find mainImage or mainUv function (${t.name})`);{const o=/\w+\s+(\w+)\([\w\s,]*\)\s*{/g,u=s.shaderParts;let h=u.get(b.FRAGMENT_HEAD)||"",g=u.get(b.FRAGMENT_MAIN_UV)||"",p=u.get(b.FRAGMENT_MAIN_IMAGE)||"",c=u.get(b.VERTEX_HEAD)||"",l=u.get(b.VERTEX_MAIN_SUPPORT)||"";const v=new Set,S=new Set;if(a&&(g+=`	${e}MainUv(UV);
`,s.uvTransformation=!0),i!==null&&/mainSupport/.test(i)){const x=/mainSupport *\([\w\s]*?uv\s*?\)/.test(i);l+=`	${e}MainSupport(`,l+=x?`vUv);
`:`);
`;for(const T of i.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g))for(const B of T[1].split(/\s*,\s*/))s.varyings.add(B),v.add(B),S.add(B);for(const T of i.matchAll(o))S.add(T[1])}for(const x of r.matchAll(o))S.add(x[1]);for(const x of t.defines.keys())S.add(x.replace(/\([\w\s,]*\)/g,""));for(const x of t.uniforms.keys())S.add(x);S.delete("while"),S.delete("for"),S.delete("if"),t.uniforms.forEach((x,T)=>s.uniforms.set(e+T.charAt(0).toUpperCase()+T.slice(1),x)),t.defines.forEach((x,T)=>s.defines.set(e+T.charAt(0).toUpperCase()+T.slice(1),x));const f=new Map([["fragment",r],["vertex",i]]);be(e,S,s.defines),be(e,S,f),r=f.get("fragment"),i=f.get("vertex");const y=t.blendMode;if(s.blendModes.set(y.blendFunction,y),n){t.inputColorSpace!==null&&t.inputColorSpace!==s.colorSpace&&(p+=t.inputColorSpace===w?`color0 = sRGBTransferOETF(color0);
	`:`color0 = sRGBToLinear(color0);
	`),t.outputColorSpace!==Fe?s.colorSpace=t.outputColorSpace:t.inputColorSpace!==null&&(s.colorSpace=t.inputColorSpace);const x=/MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;p+=`${e}MainImage(color0, UV, `,(s.attributes&O.DEPTH)!==0&&x.test(r)&&(p+="depth, ",s.readDepth=!0),p+=`color1);
	`;const T=e+"BlendOpacity";s.uniforms.set(T,y.opacity),p+=`color0 = blend${y.blendFunction}(color0, color1, ${T});

	`,h+=`uniform float ${T};

`}if(h+=r+`
`,i!==null&&(c+=i+`
`),u.set(b.FRAGMENT_HEAD,h),u.set(b.FRAGMENT_MAIN_UV,g),u.set(b.FRAGMENT_MAIN_IMAGE,p),u.set(b.VERTEX_HEAD,c),u.set(b.VERTEX_MAIN_SUPPORT,l),t.extensions!==null)for(const x of t.extensions)s.extensions.add(x)}}var Ks=class extends U{constructor(e,...t){super("EffectPass"),this.fullscreenMaterial=new Ws(null,null,null,e),this.listener=s=>this.handleEvent(s),this.effects=[],this.setEffects(t),this.skipRendering=!1,this.minTime=1,this.maxTime=Number.POSITIVE_INFINITY,this.timeScale=1}set mainScene(e){for(const t of this.effects)t.mainScene=e}set mainCamera(e){this.fullscreenMaterial.copyCameraSettings(e);for(const t of this.effects)t.mainCamera=e}get encodeOutput(){return this.fullscreenMaterial.encodeOutput}set encodeOutput(e){this.fullscreenMaterial.encodeOutput=e}get dithering(){return this.fullscreenMaterial.dithering}set dithering(e){const t=this.fullscreenMaterial;t.dithering=e,t.needsUpdate=!0}setEffects(e){for(const t of this.effects)t.removeEventListener("change",this.listener);this.effects=e.sort((t,s)=>s.attributes-t.attributes);for(const t of this.effects)t.addEventListener("change",this.listener)}updateMaterial(){const e=new Ft;let t=0;for(const a of this.effects)if(a.blendMode.blendFunction===m.DST)e.attributes|=a.getAttributes()&O.DEPTH;else{if((e.attributes&a.getAttributes()&O.CONVOLUTION)!==0)throw new Error(`Convolution effects cannot be merged (${a.name})`);js("e"+t++,a,e)}let s=e.shaderParts.get(b.FRAGMENT_HEAD),r=e.shaderParts.get(b.FRAGMENT_MAIN_IMAGE),i=e.shaderParts.get(b.FRAGMENT_MAIN_UV);const n=/\bblend\b/g;for(const a of e.blendModes.values())s+=a.getShaderCode().replace(n,`blend${a.blendFunction}`)+`
`;(e.attributes&O.DEPTH)!==0?(e.readDepth&&(r=`float depth = readDepth(UV);

	`+r),this.needsDepthTexture=this.getDepthTexture()===null):this.needsDepthTexture=!1,e.colorSpace===w&&(r+=`color0 = sRGBToLinear(color0);
	`),e.uvTransformation?(i=`vec2 transformedUv = vUv;
`+i,e.defines.set("UV","transformedUv")):e.defines.set("UV","vUv"),e.shaderParts.set(b.FRAGMENT_HEAD,s),e.shaderParts.set(b.FRAGMENT_MAIN_IMAGE,r),e.shaderParts.set(b.FRAGMENT_MAIN_UV,i);for(const[a,o]of e.shaderParts)o!==null&&e.shaderParts.set(a,o.trim().replace(/^#/,`
#`));this.skipRendering=t===0,this.needsSwap=!this.skipRendering,this.fullscreenMaterial.setShaderData(e)}recompile(){this.updateMaterial()}getDepthTexture(){return this.fullscreenMaterial.depthBuffer}setDepthTexture(e,t=V){this.fullscreenMaterial.depthBuffer=e,this.fullscreenMaterial.depthPacking=t;for(const s of this.effects)s.setDepthTexture(e,t)}render(e,t,s,r,i){for(const n of this.effects)n.update(e,t,r);if(!this.skipRendering||this.renderToScreen){const n=this.fullscreenMaterial;n.inputBuffer=t.texture,n.time+=r*this.timeScale,e.setRenderTarget(this.renderToScreen?null:s),e.render(this.scene,this.camera)}}setSize(e,t){this.fullscreenMaterial.setSize(e,t);for(const s of this.effects)s.setSize(e,t)}initialize(e,t,s){this.renderer=e;for(const r of this.effects)r.initialize(e,t,s);this.updateMaterial(),s!==void 0&&s!==L&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}dispose(){super.dispose();for(const e of this.effects)e.removeEventListener("change",this.listener),e.dispose()}handleEvent(e){e.type==="change"&&this.recompile()}},Zs=class extends U{constructor(e,t,{renderTarget:s,resolutionScale:r=1,width:i=R.AUTO_SIZE,height:n=R.AUTO_SIZE,resolutionX:a=i,resolutionY:o=n}={}){super("NormalPass"),this.needsSwap=!1,this.renderPass=new de(e,t,new rt);const u=this.renderPass;u.ignoreBackground=!0,u.skipShadowMapUpdate=!0;const h=u.getClearPass();h.overrideClearColor=new ze(7829503),h.overrideClearAlpha=1,this.renderTarget=s,this.renderTarget===void 0&&(this.renderTarget=new P(1,1,{minFilter:z,magFilter:z}),this.renderTarget.texture.name="NormalPass.Target");const g=this.resolution=new R(this,a,o,r);g.addEventListener("change",p=>this.setSize(g.baseWidth,g.baseHeight))}set mainScene(e){this.renderPass.mainScene=e}set mainCamera(e){this.renderPass.mainCamera=e}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}getResolutionScale(){return this.resolution.scale}setResolutionScale(e){this.resolution.scale=e}render(e,t,s,r,i){const n=this.renderToScreen?null:this.renderTarget;this.renderPass.render(e,n,n)}setSize(e,t){const s=this.resolution;s.setBaseSize(e,t),this.renderTarget.setSize(s.width,s.height)}};function K(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}new _;new _;function Ze(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var A=function e(t,s,r){var i=this;Ze(this,e),K(this,"dot2",function(n,a){return i.x*n+i.y*a}),K(this,"dot3",function(n,a,o){return i.x*n+i.y*a+i.z*o}),this.x=t,this.y=s,this.z=r},Xs=[new A(1,1,0),new A(-1,1,0),new A(1,-1,0),new A(-1,-1,0),new A(1,0,1),new A(-1,0,1),new A(1,0,-1),new A(-1,0,-1),new A(0,1,1),new A(0,-1,1),new A(0,1,-1),new A(0,-1,-1)],ye=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],Ee=new Array(512),Me=new Array(512),qs=function(t){t>0&&t<1&&(t*=65536),t=Math.floor(t),t<256&&(t|=t<<8);for(var s=0;s<256;s++){var r;s&1?r=ye[s]^t&255:r=ye[s]^t>>8&255,Ee[s]=Ee[s+256]=r,Me[s]=Me[s+256]=Xs[r%12]}};qs(0);function $s(e){if(typeof e=="number")e=Math.abs(e);else if(typeof e=="string"){var t=e;e=0;for(var s=0;s<t.length;s++)e=(e+(s+1)*(t.charCodeAt(s)%96))%2147483647}return e===0&&(e=311),e}function we(e){var t=$s(e);return function(){var s=t*48271%2147483647;return t=s,s/2147483647}}var Qs=function e(t){var s=this;Ze(this,e),K(this,"seed",0),K(this,"init",function(r){s.seed=r,s.value=we(r)}),K(this,"value",we(this.seed)),this.init(t)};new Qs(Math.random());const Xe=M.createContext(null),Re=e=>(e.getAttributes()&2)===2,Ys=M.memo(M.forwardRef(({children:e,camera:t,scene:s,resolutionScale:r,enabled:i=!0,renderPriority:n=1,autoClear:a=!0,depthBuffer:o,enableNormalPass:u,stencilBuffer:h,multisampling:g=8,frameBufferType:p=ut},c)=>{const{gl:l,scene:v,camera:S,size:f}=ce(),y=s||v,x=t||S,[T,B,H]=M.useMemo(()=>{const D=new It(l,{depthBuffer:o,stencilBuffer:h,multisampling:g,frameBufferType:p});D.addPass(new de(y,x));let F=null,C=null;return u&&(C=new Zs(y,x),C.enabled=!1,D.addPass(C),r!==void 0&&(F=new Hs({normalBuffer:C.texture,resolutionScale:r}),F.enabled=!1,D.addPass(F))),[D,C,F]},[x,l,o,h,g,p,y,u,r]);M.useEffect(()=>T?.setSize(f.width,f.height),[T,f]),Ge((D,F)=>{if(i){const C=l.autoClear;l.autoClear=a,h&&!a&&l.clearStencil(),T.render(F),l.autoClear=C}},i?n:0);const fe=M.useRef(null);M.useLayoutEffect(()=>{const D=[],F=fe.current.__r3f;if(F&&T){const C=F.children;for(let k=0;k<C.length;k++){const j=C[k].object;if(j instanceof Q){const pe=[j];if(!Re(j)){let J=null;for(;(J=C[k+1]?.object)instanceof Q&&!Re(J);)pe.push(J),k++}const $e=new Ks(x,...pe);D.push($e)}else j instanceof U&&D.push(j)}for(const k of D)T?.addPass(k);B&&(B.enabled=!0),H&&(H.enabled=!0)}return()=>{for(const C of D)T?.removePass(C);B&&(B.enabled=!1),H&&(H.enabled=!1)}},[T,e,x,B,H]),M.useEffect(()=>{const D=l.toneMapping;return l.toneMapping=ct,()=>{l.toneMapping=D}},[l]);const qe=M.useMemo(()=>({composer:T,normalPass:B,downSamplingPass:H,resolutionScale:r,camera:x,scene:y}),[T,B,H,r,x,y]);return M.useImperativeHandle(c,()=>T,[T]),E.jsx(Xe.Provider,{value:qe,children:E.jsx("group",{ref:fe,children:e})})})),_e=e=>typeof e=="object"&&e!=null&&"current"in e?e.current:e;let Js=0;const Be=new WeakMap,er=(e,t)=>function({blendFunction:s=t?.blendFunction,opacity:r=t?.opacity,...i}){let n=Be.get(e);if(!n){const u=`@react-three/postprocessing/${e.name}-${Js++}`;ht({[u]:e}),Be.set(e,n=u)}const a=ce(u=>u.camera),o=Qe.useMemo(()=>[...t?.args??[],...i.args??[{...t,...i}]],[JSON.stringify(i)]);return E.jsx(n,{camera:a,"blendMode-blendFunction":s,"blendMode-opacity-value":r,...i,args:o})},tr=er(Ds,{blendFunction:0}),sr=M.forwardRef(function(e,t){const{camera:s}=M.useContext(Xe),r=M.useMemo(()=>new Ns(s,_e(e.sun),e),[s,e]);return M.useLayoutEffect(()=>{r.lightSource=_e(e.sun)},[r,e.sun]),E.jsx("primitive",{ref:t,object:r,dispose:null})}),{cos:re,sin:Ue,random:X,PI:Ce,ceil:rr,sqrt:ir}=Math;function nr(e){const t=e.image.data;for(let s=0;s<t?.length;s++){const r=s*4,i=X()*Ce,n=X()*Ce*2,a=X()*1+2,o=a*re(n)*re(i),u=a*re(n)*Ue(i),h=a*Ue(n);t[r+0]=o,t[r+1]=u,t[r+2]=h,t[r+3]=X()}}function ar(e){const t=e.image.data;for(let s=0;s<t?.length;s++){const r=s*4;t[r+0]=1,t[r+1]=1,t[r+2]=1,t[r+3]=0}}function or(e){const{gl:t}=ce(),r={...He(),uSpeed:new d(3),uRangeMin:new d(-1),uRangeMax:new d(.5),uLifeSpeed:new d(.1)};ke({speed:{value:r.uSpeed.value,min:0,max:10,step:.1,onChange(o){r.uSpeed.value=o}},moveRange:{min:-1,max:1,value:[r.uRangeMin.value,r.uRangeMax.value],hint:"粒子位置-->噪音值-->smoothstep确定是否移动",onChange(o){r.uRangeMin.value=o[0],r.uRangeMax.value=o[1]}},lifeSpeed:{min:0,max:2,value:r.uLifeSpeed.value,onChange(o){r.uLifeSpeed.value=o}}});const{gpuCompute:i,posVar:n,velVar:a}=M.useMemo(()=>{const o=new Mt(e,e,t),u=o.createTexture(),h=o.createTexture();nr(u),ar(h);const g=o.addVariable("texPos",Bt,u),p=o.addVariable("texVel",_t,h);return g.material.uniforms={...r,uDefaultPos:new d(u)},p.material.uniforms={...r},o.setVariableDependencies(g,[g,p]),o.setVariableDependencies(p,[g,p]),o.init(),{gpuCompute:o,posVar:g,velVar:p}},[t,e]);return{gpuCompute:i,posVar:n,velVar:a}}function lr(){const t=rr(ir(6e3)),{geo:s}=M.useMemo(()=>{const c=new Float32Array(18e3),l=new Float32Array(6e3*2);for(let S=0;S<t;S++)for(let f=0;f<t;f++){const x=(f*t+S)*2,T=(S+.5)/t,B=(f+.5)/t;l[x+0]=T,l[x+1]=B}const v=new le;return v.setAttribute("position",new $(c,3)),v.setAttribute("aTexCoord",new $(l,2)),{geo:v}},[]),{gpuCompute:r,posVar:i,velVar:n}=or(t),a=He(),o=St(gt("/img/texture/particle/star_09.png"));o.minFilter=z,o.magFilter=z;const u={...a,uTexPos:new d(r.getCurrentRenderTarget(i).texture),uTexVel:new d(r.getCurrentRenderTarget(n).texture),uTexPoint:new d(o)},h=M.useRef(null),g=M.useRef(null);Ge(()=>{r.compute(),u.uTexPos.value=r.getCurrentRenderTarget(i).texture,u.uTexVel.value=r.getCurrentRenderTarget(n).texture,h.current.map=r.getCurrentRenderTarget(i).texture,g.current.map=r.getCurrentRenderTarget(n).texture});const p=M.useRef(null);return ke({showHelper:{value:!1,onChange(c){p.current.visible=c}}}),E.jsxs(E.Fragment,{children:[E.jsx("points",{geometry:s,children:E.jsx(mt,{baseMaterial:vt,color:16777215,uniforms:u,vertexShader:wt,fragmentShader:Rt,size:.1,sizeAttenuation:!0,transparent:!0,blending:pt,depthWrite:!1,toneMapped:!1})}),E.jsxs("group",{ref:p,children:[E.jsxs("mesh",{scale:2,position:[-4,0,0],children:[E.jsx("planeGeometry",{}),E.jsx("meshBasicMaterial",{ref:h,side:W})]}),E.jsxs("mesh",{scale:2,position:[4,0,0],children:[E.jsx("planeGeometry",{}),E.jsx("meshBasicMaterial",{ref:g,side:W})]})]})]})}const yr=Ye(function(){const e=M.useRef(null);return E.jsx("div",{className:"h-screen",children:E.jsxs(dt,{children:[E.jsx(xt,{position:"top-left"}),E.jsx(ft,{}),E.jsx(lr,{}),E.jsxs("mesh",{ref:e,children:[E.jsx("icosahedronGeometry",{args:[.4,0]}),E.jsx("meshNormalMaterial",{})]}),E.jsxs(Ys,{children:[E.jsx(tr,{}),E.jsx(sr,{sun:e})]})]})})});export{yr as default};
