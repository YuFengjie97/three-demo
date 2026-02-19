import{w as j,o as x,r as y}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as F,e as L,U as m,u as C,B as M,h as T,A as P,g as G,y as S,R as I,F as B}from"./extends-YMrKHCaR.js";import{u as R}from"./useUniformTime-ijtfSmMG.js";import{a as _}from"./asset-BvcpElq9.js";import{j as E}from"./three-custom-shader-material.es-CvH9ZsDg.js";import{O as N}from"./OrbitControls-COI4Iw9o.js";import{u as U}from"./Gltf-CbUmnVDg.js";import{u as V}from"./Texture-XdtwziCo.js";import{G as q}from"./GPUComputationRenderer-CcyjatmT.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-DIYVCsg1.js";import"./constants-BoZEkYZ1.js";const O=`#define GLSLIFY 1
uniform sampler2D posTex;

attribute vec2 pCoord;
varying vec3 vCol;

void main(){
  
  vec3 p = texture(posTex, pCoord).xyz;

  vCol = sin(vec3(3,2,1)+p*4.)*.5+.5;
  csm_Position = p;
}
`,Y=`#define GLSLIFY 1
uniform sampler2D tex;
varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord;
  // float d = length(uv-.5);
  // d = smoothstep(.5, 0., d);
  float d = texture(tex, uv).r;

  csm_FragColor = vec4(vCol*d, d);
}
`,X=`#define GLSLIFY 1
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
uniform float uDelta;
uniform sampler2D tarPosTex;
uniform float life;

vec3 turbulence(vec3 p){
  vec3  vel  = sin(p.zxy*1.*2.+vec3(0.,-T,0.));
        vel += sin(p.zxy*2.*2.+vec3(12.15,44.33,55.14))*.5;
        vel += sin(p.zxy*4.*2.+vec3(34.22,98.67,56.21))*.25;
        vel += sin(p.zxy*8.*2.+vec3(87.21,56.29,93.67))*.125;
  return normalize(vel);
}

vec3 snoise3X3(vec3 p){
  vec3 offset1 = vec3(12.34, 56.78,   90.12);
  vec3 offset2 = vec3(54.32, 98.76+T, 21.09);
  vec3 offset3 = vec3(43.21, 87.65,   10.98);

  vec3 vel = vec3(
    snoise(p * vec3(1.) + offset1), // X轴噪音
    snoise(p * vec3(1.) + offset2), // Y轴噪音
    snoise(p * vec3(1.) + offset3)  // Z轴噪音
  );
  return normalize(vel);
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 p = texture(posTex, uv).xyz;
  
  // test tarPosTex
  vec3 p_tar = texture(tarPosTex, uv).xyz;

  vec3 to_tar = (p_tar-p);
  float dist_tar = length(to_tar);
  vec3 vel_to_tar = normalize(to_tar); // 趋向目标的速度

  float close_tar = smoothstep(0., 1., dist_tar);
  // p = mix(vec3(0), p_tar, life);
  if(life>=.99){
    p = vec3(0);
  }

  vec3 vel_disruption = snoise3X3(p); // 噪音扭曲的速度
  // vec3 vel_disruption = turbulence(p); // 噪音扭曲的速度

  vec3 vel = (vel_to_tar  + vel_disruption*.8) * close_tar;

  p += vel * 2. * uDelta;

  gl_FragColor = vec4(p, 1.);
}`,{ceil:H,sqrt:W,random:g}=Math;function Z(u,s){const h=new Float32Array(s*s*4),r=new S(h,s,s,I,B),n=u.array,e=r.image.data,p=s*s;for(let a=0;a<p;a++){const v=a*4,i=a*3;e[v+0]=n[i+0]??(g()-.5)*10,e[v+1]=n[i+1]??(g()-.5)*10,e[v+2]=n[i+2]??(g()-.5)*10}return r.needsUpdate=!0,r}function k(){const{nodes:u,materials:s}=U(_("/model/treeNoLeaf-export-transformed.glb")),r=u.Object_2.geometry.getAttribute("position"),n=r.count,e=H(W(n));console.log({count:n,size:e});const p=R(),{gl:a}=L(),v=y.useMemo(()=>Z(r,e),[r,e]);console.log(v);const{gpu:i,posVar:d}=y.useMemo(()=>{const o=new q(e,e,a),c=o.createTexture(),t=o.addVariable("posTex",X,c);return t.material.uniforms={...p,tarPosTex:new m(v),life:new m(0)},o.setVariableDependencies(t,[t]),o.init(),{gpu:o,posVar:t}},[a,e]);C((o,c)=>{const t=d.material.uniforms.life;t.value+=c*.4,t.value>1&&(t.value=t.value%1)});const{geo:w}=y.useMemo(()=>{const o=r.count,c=new M,t=new Float32Array(o*3);c.setAttribute("position",new T(t,3));const f=new Float32Array(o*2);for(let l=0;l<o;l++){const A=l%e/e,D=Math.floor(l/e)/e;f[l*2+0]=A+.5/e,f[l*2+1]=D+.5/e}return c.setAttribute("pCoord",new T(f,2)),{geo:c}},[r,e,n]),b=V(_("/img/texture/particle/star_09.png")),z={...p,posTex:new m(i.getCurrentRenderTarget(d).texture),tex:new m(b)};return C(()=>{i.compute(),z.posTex.value=i.getCurrentRenderTarget(d).texture}),x.jsx("points",{geometry:w,scale:2,"rotation-z":Math.PI/2,children:x.jsx(E,{uniforms:z,baseMaterial:G,vertexShader:O,fragmentShader:Y,transparent:!0,size:.04,depthWrite:!1,blending:P})})}const ce=j(function(){return x.jsx("div",{className:"h-screen",children:x.jsxs(F,{children:[x.jsx("axesHelper",{args:[10]}),x.jsx(N,{target:[0,2,0]}),x.jsx(k,{})]})})});export{ce as default};
