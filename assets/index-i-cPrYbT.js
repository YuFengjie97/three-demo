import{w as A,r as m,o}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as V,B as R,h as w,ac as b,U as l,u as F,A as I,g as G,d as T,e as N}from"./extends-jxZVK5OE.js";import{j as E}from"./three-custom-shader-material.es-CFKi3YdJ.js";import{u as L}from"./useUniformTime-5YfkfzjQ.js";import{a as q}from"./asset-BvcpElq9.js";import{u as P}from"./leva.esm-B2CXSQv-.js";import{d as O,w as B,C as U}from"./index-fJRkvgsC.js";import{O as Y}from"./OrbitControls-Dnjt315J.js";import{L as k}from"./Loader-BdcdkVRC.js";import{u as H}from"./Texture-DJpl_C99.js";import{G as W}from"./GPUComputationRenderer-CkpsWwrL.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-DHB5iReE.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";const J=`#define GLSLIFY 1
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

vec3 snoiseVec3( vec3 x ){
  float s  = snoise_0(vec3( x ));
  float s1 = snoise_0(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise_0(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  return vec3( s , s1 , s2 );
}

vec3 curlNoise( vec3 p ){
  const float e = 0.1; // 差分步长 (epsilon)
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  // 计算三个轴向的偏导数 (Partial Derivatives)
  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );

  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}

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
  // vec3 velNew = curlNoise(pos * .1 + t);
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
}`,{cos:C,sin:D,random:f,PI:j,ceil:Z,sqrt:$}=Math;function ee(s){const t=s.image.data;for(let n=0;n<t?.length;n++){const e=n*4,a=f()*j,i=f()*j*2,u=f()*1+2,r=u*C(i)*C(a),x=u*C(i)*D(a),p=u*D(i);t[e+0]=r,t[e+1]=x,t[e+2]=p,t[e+3]=f()}}function oe(s){const t=s.image.data;for(let n=0;n<t?.length;n++){const e=n*4;t[e+0]=1,t[e+1]=1,t[e+2]=1,t[e+3]=0}}function te(s){const{gl:t}=N(),e={...L(),uSpeed:new l(3),uRangeMin:new l(-1),uRangeMax:new l(.5),uLifeSpeed:new l(.1)};P({speed:{value:e.uSpeed.value,min:0,max:10,step:.1,onChange(r){e.uSpeed.value=r}},moveRange:{min:-1,max:1,value:[e.uRangeMin.value,e.uRangeMax.value],hint:"粒子位置-->噪音值-->smoothstep确定是否移动",onChange(r){e.uRangeMin.value=r[0],e.uRangeMax.value=r[1]}},lifeSpeed:{min:0,max:2,value:e.uLifeSpeed.value,onChange(r){e.uLifeSpeed.value=r}}});const{gpuCompute:a,posVar:i,velVar:u}=m.useMemo(()=>{const r=new W(s,s,t),x=r.createTexture(),p=r.createTexture();ee(x),oe(p);const c=r.addVariable("texPos",X,x),v=r.addVariable("texVel",Q,p);return c.material.uniforms={...e,uDefaultPos:new l(x)},v.material.uniforms={...e},r.setVariableDependencies(c,[c,v]),r.setVariableDependencies(v,[c,v]),r.init(),{gpuCompute:r,posVar:c,velVar:v}},[t,s]);return{gpuCompute:a,posVar:i,velVar:u}}function re(){const t=Z($(6e3)),{geo:n}=m.useMemo(()=>{const g=new Float32Array(18e3),h=new Float32Array(6e3*2);for(let d=0;d<t;d++)for(let y=0;y<t;y++){const _=(y*t+d)*2,S=(d+.5)/t,M=(y+.5)/t;h[_+0]=S,h[_+1]=M}const z=new R;return z.setAttribute("position",new w(g,3)),z.setAttribute("aTexCoord",new w(h,2)),{geo:z}},[]),{gpuCompute:e,posVar:a,velVar:i}=te(t),u=L(),r=H(q("/img/texture/particle/star_09.png"));r.minFilter=b,r.magFilter=b;const x={...u,uTexPos:new l(e.getCurrentRenderTarget(a).texture),uTexVel:new l(e.getCurrentRenderTarget(i).texture),uTexPoint:new l(r)},p=m.useRef(null),c=m.useRef(null);F(()=>{e.compute(),x.uTexPos.value=e.getCurrentRenderTarget(a).texture,x.uTexVel.value=e.getCurrentRenderTarget(i).texture,p.current.map=e.getCurrentRenderTarget(a).texture,c.current.map=e.getCurrentRenderTarget(i).texture});const v=m.useRef(null);return P({showHelper:{value:!1,onChange(g){v.current.visible=g}}}),o.jsxs(o.Fragment,{children:[o.jsx("points",{geometry:n,children:o.jsx(E,{baseMaterial:G,color:16777215,uniforms:x,vertexShader:J,fragmentShader:K,size:.1,sizeAttenuation:!0,transparent:!0,blending:I,depthWrite:!1,toneMapped:!1})}),o.jsxs("group",{ref:v,children:[o.jsxs("mesh",{scale:2,position:[-4,0,0],children:[o.jsx("planeGeometry",{}),o.jsx("meshBasicMaterial",{ref:p,side:T})]}),o.jsxs("mesh",{scale:2,position:[4,0,0],children:[o.jsx("planeGeometry",{}),o.jsx("meshBasicMaterial",{ref:c,side:T})]})]})]})}const Ce=A(function(){const s=m.useRef(null);return o.jsxs("div",{className:"h-screen",children:[o.jsxs(V,{children:[o.jsx(Y,{}),o.jsx(m.Suspense,{fallback:null,children:o.jsx(re,{})}),o.jsxs("mesh",{ref:s,children:[o.jsx("icosahedronGeometry",{args:[.4,0]}),o.jsx("meshNormalMaterial",{})]}),o.jsxs(O,{children:[o.jsx(B,{}),o.jsx(U,{sun:s})]})]}),o.jsx(k,{})]})});export{Ce as default};
