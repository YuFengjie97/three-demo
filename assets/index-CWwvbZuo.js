import{w as g,o as t,r as y}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as w,e as C,U as m,u as b,B as A,h as u,A as T,g as j}from"./extends-jxZVK5OE.js";import{j as L}from"./three-custom-shader-material.es-CFKi3YdJ.js";import{u as D}from"./useUniformTime-5YfkfzjQ.js";import{d as P,w as F}from"./index-fJRkvgsC.js";import{a as S}from"./asset-BvcpElq9.js";import{u as I}from"./leva.esm-B2CXSQv-.js";import{O as M}from"./OrbitControls-Dnjt315J.js";import{L as N}from"./Loader-BdcdkVRC.js";import{u as G}from"./Texture-DJpl_C99.js";import{G as q}from"./GPUComputationRenderer-CkpsWwrL.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-DHB5iReE.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";const V=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;
uniform sampler2D uTexPos;

attribute vec2 particleCoord;

varying float vLife;
varying vec3 vCol;

void main(){
  float t = uTime;
  vec4 particle = texture(uTexPos, particleCoord).xyzw;
  vec3 pos = particle.xyz;
  float life = particle.w;
  vLife = life;

  vCol = sin(vec3(3,2,1)+pos*2.+t)*.5+.5;

  csm_Position = pos;
}`,Y=`#define GLSLIFY 1
uniform sampler2D uParticleTex;

varying float vLife;
varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord;
  float d = length(uv-.5);
  // d = pow(.1/d,2.);
  d = smoothstep(.2,0.,d);

  // float d = texture(uParticleTex, uv).r;

  vec3 col = vCol * d;

  float lifeAlpha = sin(vLife*PI);

  csm_FragColor = vec4(col, d * lifeAlpha);
}`,E=`#define GLSLIFY 1
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

vec4 mod289_1(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289_1(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute_1(vec4 x) {
     return mod289_1(((x*34.0)+1.0)*x);
}

float permute_1(float x) {
     return mod289_1(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt_0(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt_0(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
  }

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise_1(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289_1(i);
  float j0 = permute_1( permute_1( permute_1( permute_1(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute_1( permute_1( permute_1( permute_1 (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0_0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt_0(vec4(dot(p0_0,p0_0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0_0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt_0(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0_0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

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

vec3 mod289_2(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289_2(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute_2(vec4 x) {
     return mod289_2(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt_1(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise_2(vec3 v)
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
  i = mod289_2(i);
  vec4 p = permute_2( permute_2( permute_2(
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

  vec3 p0_1 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt_1(vec4(dot(p0_1,p0_1), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0_1 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0_1,x0), dot(p1,x1),
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

vec3 mod289_0(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289_0(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute_0(vec3 x) {
  return mod289_0(((x*34.0)+1.0)*x);
}

float snoise_0(vec2 v)
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
  i = mod289_0(i); // Avoid truncation effects in permutation
  vec3 p = permute_0( permute_0( i.y + vec3(0.0, i1.y, 1.0 ))
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

uniform float uTime;
uniform float uDelta;
uniform float uNoiseType;

//  3 out, 1 in...
vec3 hash31(float p)
{
  vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx+33.33);
  return fract((p3.xxy+p3.yzz)*p3.zyx); 
}
vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy + p3.yxx)*p3.zyx);

}

vec3 snoiseVec3( vec3 x ){
  float s  = snoise_2(vec3( x ));
  float s1 = snoise_2(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
  float s2 = snoise_2(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
  return vec3( s , s1 , s2 );
}

vec3 curlNoise( vec3 p ){
  
  const float e = 0.0001; // 步长改小
  vec3 dx = vec3( e   , 0.0 , 0.0 );
  vec3 dy = vec3( 0.0 , e   , 0.0 );
  vec3 dz = vec3( 0.0 , 0.0 , e   );

  // 获取三个维度的矢量势 (Vector Potential)
  // 此处演示中心差分法 (Central Difference)，精度更高
  // 公式： Curl(F).x = dFz/dy - dFy/dz
  
  // 计算 p_y0 = F(y-e), p_y1 = F(y+e) 等等
  vec3 p_x0 = snoiseVec3( p - dx );
  vec3 p_x1 = snoiseVec3( p + dx );
  vec3 p_y0 = snoiseVec3( p - dy );
  vec3 p_y1 = snoiseVec3( p + dy );
  vec3 p_z0 = snoiseVec3( p - dz );
  vec3 p_z1 = snoiseVec3( p + dz );

  // 偏导数 (Partial Derivatives)
  // 分母是 2*e
  float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
  float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
  float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

  const float divisor = 1.0 / ( 2.0 * e );
  return normalize( vec3( x , y , z ) * divisor );
}

void main(){
  float t = uTime;
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 particle = texture(texPos, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;

  vec3 vel = vec3(0);
  
  

  life += uDelta * .2;

  // 重置
  if(life>1.){
    life = fract(life);
    pos = vec3(0);
    vel = (hash33(vec3(uv, t))-.5)*10.;
  }else{
    
    // curlNoise
    if(uNoiseType==0.){
      vel = curlNoise(pos*1.+vec3(0.,-t,0.));
    }
    // snoise3d X 3
    else if(uNoiseType==1.){
      const vec3 offset1 = vec3(12.34, 56.78, 90.12);
      const vec3 offset2 = vec3(54.32, 98.76, 21.09);
      const vec3 offset3 = vec3(43.21, 87.65, 10.98);

      vel = vec3(
        snoise_2(pos * vec3(1.) + offset1 + t), // X轴噪音
        snoise_2(pos * vec3(1.) + offset2 + 0.), // Y轴噪音
        snoise_2(pos * vec3(1.) + offset3 + 0.)  // Z轴噪音
      );
    }
    // xor 湍流
    else if(uNoiseType==2.){
      vel =  sin(pos.zxy*1.*2.+vec3(0.,-t,0.));
      vel += sin(pos.zxy*2.*2.+vec3(12.15,44.33,55.14))*.5;
      vel += sin(pos.zxy*4.*2.+vec3(34.22,98.67,56.21))*.25;
      vel += sin(pos.zxy*8.*2.+vec3(87.21,56.29,93.67))*.125;
    }

    
    vec3 toYAxes = normalize(vec3(0., pos.y, 0.) - pos);
    vec3 up = vec3(0, 1, 0);
    vec3 rot = cross(up, toYAxes);
    // float atten = smoothstep(5.,0.,pos.y);
    vel = normalize(normalize(vel) + (rot + up));
  }

  pos += vel*uDelta*2.;

  gl_FragColor = vec4(pos, life);
}`,{ceil:X,sqrt:Z,random:v}=Math;function B(d,o){const x=d.image.data;for(let c=0;c<o;c++){const r=c*4;x[r+0]=(v()-.5)*10,x[r+1]=(v()-.5)*10,x[r+2]=(v()-.5)*10,x[r+3]=v()}}function O(){const o=X(Z(1e4)),{gl:x}=C(),c=D(),{gpuCompute:r,posVar:p}=y.useMemo(()=>{const e=new q(o,o,x),n=e.createTexture();B(n,1e4);const s=e.addVariable("texPos",E,n);return s.material.uniforms={...c,uNoiseType:new m(0)},e.setVariableDependencies(s,[s]),e.init(),{gpuCompute:e,posVar:s}},[1e4,o]),_=G(S("/img/texture/particle/star_09.png")),f={...c,uTexPos:new m(r.getCurrentRenderTarget(p).texture),uParticleTex:new m(_)};I({noiseType:{value:0,options:{curlNoise:0,snoiseX3:1,turbulence:2},onChange(e){p.material.uniforms.uNoiseType.value=e}}}),b(()=>{r.compute(),f.uTexPos.value=r.getCurrentRenderTarget(p).texture});const{geo:h}=y.useMemo(()=>{const e=new A,n=new Float32Array(1e4*3);e.setAttribute("position",new u(n,3));const s=new Float32Array(1e4);for(let i=0;i<1e4;i++)s[i]=i;e.setAttribute("id",new u(s,1));const l=new Float32Array(1e4*2);for(let i=0;i<o;i++)for(let a=0;a<o;a++){const z=(a*o+i)*2;l[z+0]=(i+.5)/o,l[z+1]=(a+.5)/o}return e.setAttribute("particleCoord",new u(l,2)),{geo:e}},[1e4,o]);return t.jsx("points",{geometry:h,position:[0,-1,0],children:t.jsx(L,{uniforms:f,baseMaterial:j,size:.2,sizeAttenuation:!0,vertexShader:V,fragmentShader:Y,transparent:!0,depthWrite:!1,toneMapped:!1,blending:T})})}const ne=g(function(){return t.jsxs("div",{className:"h-screen",children:[t.jsxs(w,{camera:{position:[0,0,5]},children:[t.jsx(M,{target:[0,2,0]}),t.jsx("ambientLight",{}),t.jsx(y.Suspense,{fallback:null,children:t.jsx(O,{})}),t.jsx(P,{children:t.jsx(F,{})})]}),t.jsx(N,{})]})});export{ne as default};
