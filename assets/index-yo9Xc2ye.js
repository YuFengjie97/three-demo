import{w as A,r as p,o}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as R,O as F,B as V,g as T,y as b,U as l,u as I,A as G,f as N,d as _,al as E}from"./OrbitControls-wRqzCdd_.js";import{j as q}from"./three-custom-shader-material.es-00gjT4E9.js";import{u as P}from"./useUniformTime-BN-1ekZ-.js";import{a as O}from"./asset-BvcpElq9.js";import{P as B}from"./Perf-BYAwScHX.js";import{u as L}from"./leva.esm-BV3Tl-wj.js";import{d as U,w as Y,C as H}from"./index-DfcyJC69.js";import{u as k}from"./Texture-BQgsBGTv.js";import{G as W}from"./GPUComputationRenderer-BG-USugS.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-WfkYmuit.js";import"./index-n5PR1bfd.js";import"./client-EdRjCdko.js";import"./index-D369hMBv.js";const J=`#define GLSLIFY 1
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

}`,K=`#define GLSLIFY 1
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
}`,Q=`#define GLSLIFY 1
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

vec3 mod289_0(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289_0(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute_0(vec4 x) {
     return mod289_0(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise_0(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g_0 = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g_0;
  vec3 i1 = min( g_0.xyz, l.zxy );
  vec3 i2 = max( g_0.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289_0(i);
  vec4 p = permute_0( permute_0( permute_0(
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

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289_1(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289_1(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute_1(vec3 x) {
  return mod289_1(((x*34.0)+1.0)*x);
}

float snoise_1(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289_1(i); // Avoid truncation effects in permutation
  vec3 p = permute_1( permute_1( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
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
  float velLen = snoise_0(pos);
  velLen = smoothstep(uRangeMin, uRangeMax, velLen) * uSpeed;

  // 速度方向改变
  vec3 velNew = vec3(
    snoise_0(pos*.4+vec3(1.,0.,0.)),
    snoise_0(pos*.4+vec3(0.,1.,t)),
    snoise_0(pos*.4+vec3(0.,0.,1.))
  );
  // vec3 velNew = vec3(
  //   snoise2(vec2(pos.xy*.4) + t),
  //   snoise2(vec2(pos.yz*.4) + 0.),
  //   snoise2(vec2(pos.zx*.4) + 0.)
  // );

  vel = velNew;
  vel = normalize(vel) * velLen;

  gl_FragColor = vec4(vel, 1);
}`,X=`#define GLSLIFY 1
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
}`,{cos:z,sin:D,random:y,PI:j,ceil:Z,sqrt:$}=Math;function ee(s){const t=s.image.data;for(let n=0;n<t?.length;n++){const e=n*4,a=y()*j,i=y()*j*2,u=y()*1+2,r=u*z(i)*z(a),x=u*z(i)*D(a),m=u*D(i);t[e+0]=r,t[e+1]=x,t[e+2]=m,t[e+3]=y()}}function oe(s){const t=s.image.data;for(let n=0;n<t?.length;n++){const e=n*4;t[e+0]=1,t[e+1]=1,t[e+2]=1,t[e+3]=0}}function te(s){const{gl:t}=E(),e={...P(),uSpeed:new l(3),uRangeMin:new l(-1),uRangeMax:new l(.5),uLifeSpeed:new l(.1)};L({speed:{value:e.uSpeed.value,min:0,max:10,step:.1,onChange(r){e.uSpeed.value=r}},moveRange:{min:-1,max:1,value:[e.uRangeMin.value,e.uRangeMax.value],hint:"粒子位置-->噪音值-->smoothstep确定是否移动",onChange(r){e.uRangeMin.value=r[0],e.uRangeMax.value=r[1]}},lifeSpeed:{min:0,max:2,value:e.uLifeSpeed.value,onChange(r){e.uLifeSpeed.value=r}}});const{gpuCompute:a,posVar:i,velVar:u}=p.useMemo(()=>{const r=new W(s,s,t),x=r.createTexture(),m=r.createTexture();ee(x),oe(m);const c=r.addVariable("texPos",X,x),v=r.addVariable("texVel",Q,m);return c.material.uniforms={...e,uDefaultPos:new l(x)},v.material.uniforms={...e},r.setVariableDependencies(c,[c,v]),r.setVariableDependencies(v,[c,v]),r.init(),{gpuCompute:r,posVar:c,velVar:v}},[t,s]);return{gpuCompute:a,posVar:i,velVar:u}}function re(){const t=Z($(6e3)),{geo:n}=p.useMemo(()=>{const g=new Float32Array(18e3),h=new Float32Array(6e3*2);for(let d=0;d<t;d++)for(let f=0;f<t;f++){const w=(f*t+d)*2,M=(d+.5)/t,S=(f+.5)/t;h[w+0]=M,h[w+1]=S}const C=new V;return C.setAttribute("position",new T(g,3)),C.setAttribute("aTexCoord",new T(h,2)),{geo:C}},[]),{gpuCompute:e,posVar:a,velVar:i}=te(t),u=P(),r=k(O("/img/texture/particle/star_09.png"));r.minFilter=b,r.magFilter=b;const x={...u,uTexPos:new l(e.getCurrentRenderTarget(a).texture),uTexVel:new l(e.getCurrentRenderTarget(i).texture),uTexPoint:new l(r)},m=p.useRef(null),c=p.useRef(null);I(()=>{e.compute(),x.uTexPos.value=e.getCurrentRenderTarget(a).texture,x.uTexVel.value=e.getCurrentRenderTarget(i).texture,m.current.map=e.getCurrentRenderTarget(a).texture,c.current.map=e.getCurrentRenderTarget(i).texture});const v=p.useRef(null);return L({showHelper:{value:!1,onChange(g){v.current.visible=g}}}),o.jsxs(o.Fragment,{children:[o.jsx("points",{geometry:n,children:o.jsx(q,{baseMaterial:N,color:16777215,uniforms:x,vertexShader:J,fragmentShader:K,size:.1,sizeAttenuation:!0,transparent:!0,blending:G,depthWrite:!1,toneMapped:!1})}),o.jsxs("group",{ref:v,children:[o.jsxs("mesh",{scale:2,position:[-4,0,0],children:[o.jsx("planeGeometry",{}),o.jsx("meshBasicMaterial",{ref:m,side:_})]}),o.jsxs("mesh",{scale:2,position:[4,0,0],children:[o.jsx("planeGeometry",{}),o.jsx("meshBasicMaterial",{ref:c,side:_})]})]})]})}const Ce=A(function(){const s=p.useRef(null);return o.jsx("div",{className:"h-screen",children:o.jsxs(R,{children:[o.jsx(B,{position:"top-left"}),o.jsx(F,{}),o.jsx(re,{}),o.jsxs("mesh",{ref:s,children:[o.jsx("icosahedronGeometry",{args:[.4,0]}),o.jsx("meshNormalMaterial",{})]}),o.jsxs(U,{children:[o.jsx(Y,{}),o.jsx(H,{sun:s})]})]})})});export{Ce as default};
