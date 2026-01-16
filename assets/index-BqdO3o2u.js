import{w as u,o as e,r as x}from"./chunk-EPOLDU6W-B0aIzJ9t.js";import{G as f,Z as y,K as h,y as v,P as d,$ as c,D as g,Q as C,Y as z}from"./OrbitControls-BeN5Vx9q.js";import{L as w,u as i}from"./leva.esm-rd6fLeBd.js";import{j as b}from"./three-custom-shader-material.es-HcGUKqKs.js";import{m as j}from"./BufferGeometryUtils-DPZxlksj.js";import{u as D}from"./Helper-CMDd7UMI.js";import"./index-7OC5HNn7.js";import"./index-XD7JBPcQ.js";import"./client-Cu2R2QOy.js";import"./index-C_sia4Et.js";import"./three-custom-shader-material.es-BdQd3_SU.js";const S=`#define GLSLIFY 1
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
uniform vec3 uDepthCol;
uniform vec3 uSurfaceCol;

attribute vec4 tangent;

varying vec3 vCol;

float fbm(vec2 p, float t){
  float v = 0.;
  float fre = 1.;
  float amp = 1.;
  for(float i=0.;i<4.;i++){
    v += snoise(vec3(p * fre, t)) * amp;
    fre *= 2.;
    amp *= .5;
  }
  return v;
}

float wave(out vec3 p){

  float t = T * .5;

  // vec2 q = vec2(
  //   fbm(p.xy * .1, 1.1),
  //   fbm(p.xy * .1, 2.2)
  // );

  float v = fbm(p.xy*.25, t); 

  p.z += v;
  return v;
}

vec3 calcNormal(out vec3 pos){
  float e = .01;
  vec3 bi_tangent = normalize(cross(csm_Normal, tangent.xyz));
  vec3 posA = pos + tangent.xyz * e;
  vec3 posB = pos + bi_tangent * e;

  wave(pos);
  wave(posA);
  wave(posB);

  vec3 toA = posA - pos;
  vec3 toB = posB - pos;

  vec3 normal = normalize(cross(toA, toB));
  return normal;
}

void main(){
  vec3 pos = csm_Position.xyz;

  float v = wave(pos);

  vCol = mix(uSurfaceCol, uDepthCol, smoothstep(-1.,1.,v));

  csm_Normal = calcNormal(pos);
  csm_Position.xyz = pos;
}`,L=`#define GLSLIFY 1
uniform vec3 uDepthCol;
uniform vec3 uSurfaceCol;

varying vec3 vCol;

void main(){
  csm_DiffuseColor.rgb = vCol;
}`;function _(){const t=x.useMemo(()=>{let o=new d(10,10,200,200);return console.log(o.attributes.position.count),o=j(o),o.computeTangents(),console.log(o),o},[]),s={uTime:{value:0},uDelta:{value:0},uDepthCol:{value:new c(16711680)},uSurfaceCol:{value:new c(65280)}};v((o,m)=>{const{clock:p}=o;s.uTime.value=p.getElapsedTime(),s.uDelta.value=m});const{depthCol:n,surfaceCol:a}=i({surfaceCol:"#00ff00",depthCol:"#ff0000"});s.uDepthCol.value.set(n),s.uSurfaceCol.value.set(a);const{metalness:r,roughness:l}=i({metalness:{value:0,min:0,max:1},roughness:{value:1,min:0,max:1}});return e.jsx(e.Fragment,{children:e.jsx("mesh",{geometry:t,rotation:[-Math.PI/2,0,0],receiveShadow:!0,children:e.jsx(b,{baseMaterial:C,vertexShader:S,fragmentShader:L,uniforms:s,side:g,metalness:r,roughness:l})})})}function M(){const t=x.useRef(null);return D(t,z,1),v((s,n)=>{const{clock:a}=s,r=a.getElapsedTime();t.current.position.x=Math.cos(r)*3,t.current.position.z=Math.sin(r)*3}),e.jsx(e.Fragment,{children:e.jsx("directionalLight",{ref:t,position:[0,2,0],castShadow:!0})})}const R=u(function(){return e.jsxs(e.Fragment,{children:[e.jsx(w,{}),e.jsx("div",{className:"h-screen",children:e.jsxs(f,{shadows:{type:y,enabled:!1},camera:{position:[0,2,4]},children:[e.jsx("ambientLight",{}),e.jsx(M,{}),e.jsx("axesHelper",{args:[20]}),e.jsx(h,{}),e.jsx(_,{})]})})]})});export{R as default};
