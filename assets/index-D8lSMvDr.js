import{w as R,o as a,r as _}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as V,O as A,U as s,u as I,d as D,e as P,al as L}from"./OrbitControls-wRqzCdd_.js";import{a as G}from"./asset-BvcpElq9.js";import{d as U,w as Y}from"./index-DfcyJC69.js";import{j as E}from"./three-custom-shader-material.es-00gjT4E9.js";import{u as z}from"./useUniformTime-BN-1ekZ-.js";import{u as q}from"./leva.esm-BV3Tl-wj.js";import{u as b}from"./Gltf-BEo4OFDX.js";import{c as N,b as y}from"./Instances-CFM4OqfW.js";import{G as O}from"./GPUComputationRenderer-BG-USugS.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-WfkYmuit.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";import"./constants-BdHQ5oRD.js";const B=`#define GLSLIFY 1
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
  float glow = dot(cos(vec3(3,2,1) + id), vec3(.1)) * 3. + .5;
  vCol = glow * (sin(vec3(3,2,1) + instance_pos * .1)*.5+.5);
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
  csm_DiffuseColor.rgb = mix(rgb, col, .5);
}`,X=`#define GLSLIFY 1

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
}`,k=`#define GLSLIFY 1
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
uniform float uSize;
uniform float uSeparationR;
uniform float uSeparationFactor;
uniform float uAlignmentR;
uniform float uAlignmentFactor;
uniform float uCohesionR;
uniform float uCohesionFactor;

uniform float uMaxSpeed;
uniform float uMinSpeed;

uniform float uCenterFactor;
uniform float uCenterMin;
uniform float uCenterMax;

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
  float separation_factor = uSeparationFactor;
  float separation_count = 0.;

  // 对齐,范围内统一速度方向
  float alignment_r = uAlignmentR; // 在这个范围下,表现统一速度方向
  vec3 alignment_vel = vec3(0);
  float alignment_count = 0.;
  float alignment_factor = uAlignmentFactor;

  // 聚集,范围内,粒子向范围中心靠拢
  float cohesion_r = uCohesionR;
  vec3 cohesion_center = pos;
  float cohesion_count = 0.;
  vec3 cohesion_vel = vec3(0);
  float cohesion_factor = uCohesionFactor;

  // 遍历所有粒子
  for(float x=0.;x<uSize;x++){
    for(float y=0.;y<uSize;y++){
      vec2 nei_coord = vec2(x+.5,y+.5)/uSize;
      vec3 nei_pos = texture(texPos, nei_coord).xyz;
      vec3 nei_vel = texture(texVel, nei_coord).xyz;
      float dist = length(pos-nei_pos);

      // 跳过自己
      if(dist < 0.001) {
        continue;
      }

      if(dist < separation_r) {
        vec3 to_nei = vec3(pos - nei_pos);
        vec3 separation_force = normalize(to_nei);
        float strength = separation_r / max(0.01, dist);
        separation_vel += separation_force * strength;
        separation_count++;
      }
      else if(dist < alignment_r){
        alignment_vel += nei_vel;
        alignment_count++;
      }
      else if(dist < cohesion_r) {
        cohesion_center += nei_pos;
        cohesion_count++;
      }
    }
  }

  if(separation_count>0.){
    acc += separation_vel / separation_count * separation_factor;
  }

  if(alignment_count>0.){
    alignment_vel /= alignment_count;
    // acc += alignment_vel * alignment_factor;
    vec3 alignment_diff = alignment_vel - acc;
    acc += alignment_diff * alignment_factor;
  }

  if(cohesion_count>0.){
    cohesion_center /= cohesion_count;
    cohesion_vel = normalize(vec3(cohesion_center - pos));
    acc += cohesion_vel * cohesion_factor;
  }

  // 来自原点的引力,防止飞跑
  float center_factor = uCenterFactor;
  vec3 center = vec3(0);
  vec3 to_center = center - pos;
  if(length(to_center)<uCenterMax){
    center_factor = .5 * (uSeparationFactor + uAlignmentFactor + uCohesionFactor);
  }
  vec3 center_vel = normalize(to_center);
  float center_strength = smoothstep(uCenterMin, uCenterMax, length(to_center));
  acc += center_vel * center_strength * center_factor;

  vec3 vel = texture(texVel, uv).xyz;
  vel = mix(vel, acc, .4);

  float speed = max(min(length(vel), uMaxSpeed), uMinSpeed);
  vel = normalize(vel) * speed;

  // vec3 acc = vec3(
  //   snoise(pos+vec3(1,0,0)),
  //   snoise(pos+vec3(0,1,0)),
  //   snoise(pos+vec3(0,0,1))
  // );

  // vec3 acc = normalize(sin(vec3(30,20,10) + pos + t));

  gl_FragColor = vec4(vel, 1.);
}`,{random:d,sqrt:S,ceil:w,floor:H}=Math,F=G("/model/sword-transformed.glb");b.preload(F);function J(x){const t=x.image.data;for(let n=0;n<t?.length;n++){const r=n*4,v=(d()-.5)*2*10,u=(d()-.5)*2*10,l=(d()-.5)*2*10;t[r+0]=v,t[r+1]=u,t[r+2]=l,t[r+3]=n}}function K(x){const t=x.image.data;for(let n=0;n<t?.length;n++){const r=n*4;t[r+0]=(d()-.5)*10,t[r+1]=(d()-.5)*10,t[r+2]=(d()-.5)*10,t[r+3]=n}}function Q(x){const{gl:t}=L(),n=w(S(x)),r=z(),{gpu:v,posVar:u,velVar:l}=_.useMemo(()=>{const c=new O(n,n,t),e=c.createTexture();J(e);const h=c.createTexture();K(h);const m=c.addVariable("texPos",X,e),i=c.addVariable("texVel",k,h);return m.material.uniforms={...r},i.material.uniforms={...r,uSize:new s(n),uSeparationFactor:new s(1),uAlignmentFactor:new s(1),uCohesionFactor:new s(1),uSeparationR:new s(20),uAlignmentR:new s(15),uCohesionR:new s(30),uCenterMin:new s(20),uCenterMax:new s(30),uCenterFactor:new s(2),uMinSpeed:new s(60),uMaxSpeed:new s(80)},c.setVariableDependencies(m,[m,i]),c.setVariableDependencies(i,[m,i]),c.init(),{gpu:c,posVar:m,velVar:i}},[t,n]);return{gpu:v,posVar:u,velVar:l}}function W(){const{nodes:x,materials:t}=b(F),[n,r]=N(),v=800,u=w(S(v)),{gpu:l,posVar:c,velVar:e}=Q(v),m={...z(),uTexPos:new s(l.getCurrentRenderTarget(c).texture),uTexVel:new s(l.getCurrentRenderTarget(e).texture)},i=[0,30],p=[0,50];q({uSeparationR:{value:e.material.uniforms.uSeparationR.value,min:p[0],max:p[1],onChange(o){e.material.uniforms.uSeparationR.value=o},label:"分离半径"},uSeparationFactor:{value:e.material.uniforms.uSeparationFactor.value,min:i[0],max:i[1],onChange(o){e.material.uniforms.uSeparationFactor.value=o},label:"分离系数"},uAlignmentR:{value:e.material.uniforms.uAlignmentR.value,min:p[0],max:p[1],onChange(o){e.material.uniforms.uAlignmentR.value=o},label:"对齐半径"},uAlignmentFactor:{value:e.material.uniforms.uAlignmentFactor.value,min:i[0],max:i[1],onChange(o){e.material.uniforms.uAlignmentFactor.value=o},label:"对齐系数"},uCohesionR:{value:e.material.uniforms.uCohesionR.value,min:p[0],max:p[1],onChange(o){e.material.uniforms.uCohesionR.value=o},label:"聚集半径"},uCohesionFactor:{value:e.material.uniforms.uCohesionFactor.value,min:i[0],max:i[1],onChange(o){e.material.uniforms.uCohesionFactor.value=o},label:"聚集系数"},uCenterFactor:{value:e.material.uniforms.uCenterFactor.value,min:i[0],max:i[1],onChange(o){e.material.uniforms.uCenterFactor.value=o},label:"中心引力系数"},uCenterRange:{value:[e.material.uniforms.uCenterMin.value,e.material.uniforms.uCenterMax.value],min:1,max:50,onChange([o,f]){e.material.uniforms.uCenterMin.value=o,e.material.uniforms.uCenterMax.value=f},label:"中心引力范围"},uSpeed:{value:[e.material.uniforms.uMinSpeed.value,e.material.uniforms.uMaxSpeed.value],min:0,max:100,onChange([o,f]){e.material.uniforms.uMinSpeed.value=o,e.material.uniforms.uMaxSpeed.value=f},label:"速度"}});const C=_.useRef(null);I(()=>{l.compute(),m.uTexPos.value=l.getCurrentRenderTarget(c).texture,m.uTexVel.value=l.getCurrentRenderTarget(e).texture,C.current.map=l.getCurrentRenderTarget(e).texture});const T=_.useMemo(()=>Array.from({length:v}).map((o,f)=>{const M=f;let g=H(f/u),j=(f-g*u+.5)/u;return g=(g+.5)/u,{instanceId:M,texCoord:[j,g]}}),[v,u]);return console.log(t["Freedom-Sworn"]),a.jsxs(a.Fragment,{children:[a.jsxs("mesh",{scale:3,visible:!1,children:[a.jsx("planeGeometry",{}),a.jsx("meshBasicMaterial",{side:D,ref:C})]}),a.jsxs(n,{limit:1e3,range:1e3,geometry:x["Freedom-Sworn_mesh_Freedom-Sworn_0001"].geometry,children:[a.jsx(E,{baseMaterial:P,map:t["Freedom-Sworn"].map,uniforms:m,vertexShader:B,fragmentShader:Z}),a.jsx(y,{name:"instanceId",defaultValue:0}),a.jsx(y,{name:"texCoord",defaultValue:[0,0]}),T.map(o=>a.jsx(r,{scale:.2,instanceId:o.instanceId,texCoord:o.texCoord},o.instanceId))]})]})}const de=R(function(){return a.jsx("div",{className:"h-screen",children:a.jsxs(V,{children:[a.jsx("ambientLight",{}),a.jsx(A,{}),a.jsx(W,{}),a.jsx(U,{children:a.jsx(Y,{})})]})})});export{de as default};
