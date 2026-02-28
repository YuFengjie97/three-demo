import{w as V,o as e,r as g}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as M,U as u,u as I,d as P,f as D,e as L}from"./extends-jxZVK5OE.js";import{a as A}from"./asset-BvcpElq9.js";import{d as F,w as G}from"./index-fJRkvgsC.js";import{j as E}from"./three-custom-shader-material.es-CFKi3YdJ.js";import{u as C}from"./useUniformTime-5YfkfzjQ.js";import{u as U}from"./leva.esm-B2CXSQv-.js";import{u as w}from"./Gltf-DU9Syf3P.js";import{O as Y}from"./OrbitControls-Dnjt315J.js";import{L as q}from"./Loader-BdcdkVRC.js";import{c as N,b as _}from"./Instances-D68vrPTx.js";import{G as O}from"./GPUComputationRenderer-CkpsWwrL.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-DHB5iReE.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";import"./constants-fLLWn5OZ.js";const B=`#define GLSLIFY 1
uniform float uTime;
uniform sampler2D uTexPos;
uniform sampler2D uTexVel;

attribute float instanceId;
attribute vec2 texCoord;

varying vec3 vCol;
varying vec3 vPos;
varying vec2 vUv;

mat2 rotate(float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c,-s,s,c);
}

mat3 rotateX(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(
    1,0,0,
    0,c,-s,
    0,s,c
  );
}
mat3 rotateY(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(
    c,0,s,
    0,1,0,
    -s,0,c
  );
}
mat3 rotateZ(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(
    c,-s,0,
    s,c,0,
    0,0,1
  );
}

void main(){

  float t = uTime;

  float id = instanceId;

  // 这里是模型的顶点位置,不是gpu里的粒子位置
  vec3 pos = csm_Position;

  // 因为用的是csm,不需要手动对mesh的变换进行手动转换
  // pos = mat3(modelMatrix) * pos;

  // 速度向量
  vec3 vel = normalize(texture(uTexVel, texCoord).rgb);

  float the = acos(vel.y);
  float phi = atan(vel.z, vel.x);
  pos = rotateY(phi) * rotateZ(the+PI) *  pos;  // 这里theta + PI 是因为模型默认指向vec3(0,-1,0)

  // 所有顶点位置都按照gpu粒子位置进行偏移来更新模型位置
  vec3 instance_pos = texture(uTexPos, texCoord).xyz;

  pos += instance_pos;

  vUv = uv;
  vPos = pos;
  float glow = dot(sin(vec3(3,2,1) + id), vec3(1.)) + .5;
  vCol = glow * (sin(vec3(3,2,1) + id * 2.1)*.5+.5);
  csm_Position = pos;
}`,Z=`#define GLSLIFY 1
varying vec3 vPos;
varying vec3 vCol;
varying vec2 vUv;

void main(){
  
  vec3 col = vCol;
  // float d = length(vUv);
  // d = .1/d;

  vec3 rgb = csm_DiffuseColor.rgb;
  csm_DiffuseColor.rgb += col;
}`,k=`#define GLSLIFY 1

uniform float uTime;
uniform float uDelta;

void main(){
  float t = uTime;
  float dt = uDelta;
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 obj = texture(texPos, uv);
  vec3 pos = obj.xyz;
  float id = obj.w;
  vec3 vel = texture(texVel, uv).xyz;
  
  pos += vel * dt;

  gl_FragColor = vec4(pos, id);
}`,X=`#define GLSLIFY 1
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

#define c1(v) (cos(v)*.5+.5)
#define PI_2 6.2831852

uniform float uTime;
uniform float uDelta;
uniform float uSize;
uniform float uSeparationR;
uniform float uAlignmentR;
uniform float uCohesionR;

uniform float uCenterEdge;

uniform float uMaxSpeed;
uniform float uMinSpeed;

void main(){
  float t = uTime;

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 obj = texture(texPos, uv);
  vec3 pos = obj.xyz;
  float id = obj.w;

  vec3 acc = vec3(0);

  // 分离,根据距离表现排斥
  float separation_r = uSeparationR; // 斥 半径
  vec3 separation_vel = vec3(0); // 斥 初始化

  // 对齐,范围内统一速度方向
  float alignment_r = uAlignmentR; // 在这个范围下,表现统一速度方向
  vec3 alignment_vel = vec3(0);

  // 聚集,范围内,粒子向范围中心靠拢
  float cohesion_r = uCohesionR;
  vec3 cohesion_vel = vec3(0);

  vec3 vel = texture(texVel, uv).xyz;

  // 遍历所有粒子
  for(float x=0.;x<uSize;x++){
    for(float y=0.;y<uSize;y++){
      vec2 nei_coord = vec2(x+.5,y+.5)/uSize;
      vec3 nei_pos = texture(texPos, nei_coord).xyz;
      vec3 nei_vel = texture(texVel, nei_coord).xyz;
      float dist = length(pos-nei_pos);
      vec3 to_nei = normalize(vec3(nei_pos-pos));

      // 跳过自己
      if(dist < 0.001) {
        continue;
      }

      if(dist < separation_r) {
        vec3 separation_force = -to_nei;
        float weight = 1. - smoothstep(0., separation_r, dist);
        separation_vel += separation_force * weight;
      }
      else if(dist < alignment_r){
        float weight = 1.-smoothstep(separation_r, alignment_r,dist);
        alignment_vel += normalize(nei_vel) * weight;
      }
      else if(dist < cohesion_r) {
        float weight = 1.-smoothstep(alignment_r, cohesion_r,dist);
        cohesion_vel += to_nei * weight;
      }
    }
  }

  vel += separation_vel;
  vel += alignment_vel;
  vel += cohesion_vel;

  // 来自原点的引力,防止飞跑
  vec3 center = vec3(0);
  vec3 to_center = center - pos;
  vec3 center_vel = normalize(to_center);
  float center_weight = length(to_center) / uCenterEdge;

  center_vel.y *= 4.5;
  vel += center_vel * center_weight;

  float speed = max(min(length(vel), uMaxSpeed), uMinSpeed);
  vel = normalize(vel) * speed;

  // vec3 acc = vec3(
  //   snoise(pos+vec3(1,0,0)),
  //   snoise(pos+vec3(0,1,0)),
  //   snoise(pos+vec3(0,0,1))
  // );

  // vec3 acc = normalize(sin(vec3(30,20,10) + pos + t));

  gl_FragColor = vec4(vel, 1.);
}`,{random:d,sqrt:z,ceil:b,floor:H}=Math,S=A("/model/sword-transformed.glb");w.preload(S);function J(x){const t=x.image.data;for(let r=0;r<t?.length;r++){const a=r*4,v=(d()-.5)*2*50,c=(d()-.5)*2*50,l=(d()-.5)*2*50;t[a+0]=v,t[a+1]=c,t[a+2]=l,t[a+3]=r}}function K(x){const t=x.image.data;for(let r=0;r<t?.length;r++){const a=r*4;t[a+0]=(d()-.5)*2,t[a+1]=(d()-.5)*2,t[a+2]=(d()-.5)*2,t[a+3]=r}}function Q(x){const{gl:t}=L(),r=b(z(x)),a=C(),{gpu:v,posVar:c,velVar:l}=g.useMemo(()=>{const i=new O(r,r,t),o=i.createTexture();J(o);const h=i.createTexture();K(h);const m=i.addVariable("texPos",k,o),s=i.addVariable("texVel",X,h);return m.material.uniforms={...a},s.material.uniforms={...a,uSize:new u(r),uSeparationR:new u(5),uAlignmentR:new u(10),uCohesionR:new u(10),uCenterEdge:new u(120),uMinSpeed:new u(20),uMaxSpeed:new u(40)},i.setVariableDependencies(m,[m,s]),i.setVariableDependencies(s,[m,s]),i.init(),{gpu:i,posVar:m,velVar:s}},[t,r]);return{gpu:v,posVar:c,velVar:l}}function W(){const{nodes:x,materials:t}=w(S),[r,a]=N(),v=800,c=b(z(v)),{gpu:l,posVar:i,velVar:o}=Q(v),m={...C(),uTexPos:new u(l.getCurrentRenderTarget(i).texture),uTexVel:new u(l.getCurrentRenderTarget(o).texture)},s=[0,50];U({uSeparationR:{value:o.material.uniforms.uSeparationR.value,min:s[0],max:s[1],onChange(n){o.material.uniforms.uSeparationR.value=n},label:"分离半径"},uAlignmentR:{value:o.material.uniforms.uAlignmentR.value,min:s[0],max:s[1],onChange(n){o.material.uniforms.uAlignmentR.value=n},label:"对齐半径"},uCohesionR:{value:o.material.uniforms.uCohesionR.value,min:s[0],max:s[1],onChange(n){o.material.uniforms.uCohesionR.value=n},label:"聚集半径"},uCenterEdge:{value:o.material.uniforms.uCenterEdge.value,min:0,max:200,onChange(n){o.material.uniforms.uCenterEdge.value=n},label:"中心引力范围"},uSpeed:{value:[o.material.uniforms.uMinSpeed.value,o.material.uniforms.uMaxSpeed.value],min:1,max:400,onChange([n,f]){o.material.uniforms.uMinSpeed.value=n,o.material.uniforms.uMaxSpeed.value=f},label:"速度"}});const y=g.useRef(null);I(()=>{l.compute(),m.uTexPos.value=l.getCurrentRenderTarget(i).texture,m.uTexVel.value=l.getCurrentRenderTarget(o).texture,y.current.map=l.getCurrentRenderTarget(o).texture});const T=g.useMemo(()=>Array.from({length:v}).map((n,f)=>{const j=f;let p=H(f/c),R=(f-p*c+.5)/c;return p=(p+.5)/c,{instanceId:j,texCoord:[R,p]}}),[v,c]);return e.jsxs(e.Fragment,{children:[e.jsxs("mesh",{scale:3,visible:!1,children:[e.jsx("planeGeometry",{}),e.jsx("meshBasicMaterial",{side:P,ref:y})]}),e.jsxs(r,{limit:1e3,range:1e3,geometry:x["Freedom-Sworn_mesh_Freedom-Sworn_0001"].geometry,children:[e.jsx(E,{baseMaterial:D,map:t["Freedom-Sworn"].map,uniforms:m,vertexShader:B,fragmentShader:Z}),e.jsx(_,{name:"instanceId",defaultValue:0}),e.jsx(_,{name:"texCoord",defaultValue:[0,0]}),T.map(n=>e.jsx(a,{scale:.2,instanceId:n.instanceId,texCoord:n.texCoord},n.instanceId))]})]})}const he=V(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(M,{children:[e.jsx("ambientLight",{}),e.jsx(Y,{}),e.jsx(g.Suspense,{fallback:null,children:e.jsx(W,{})}),e.jsx(F,{children:e.jsx(G,{})})]}),e.jsx(q,{})]})});export{he as default};
