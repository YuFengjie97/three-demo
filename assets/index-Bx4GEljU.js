import{w as z,o as e,r as m}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as L,O as j,U as t,c as y,u as g,I as b,M as S,B as T,g as A,a as G,T as _,f as I}from"./OrbitControls-buyHw8F8.js";import{j as w}from"./three-custom-shader-material.es-iuk4jPUE.js";import{u as h}from"./leva.esm-BV3Tl-wj.js";import{m as D}from"./BufferGeometryUtils-BuJKPO1x.js";import{a as M}from"./asset-BvcpElq9.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-BzJpHPF7.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";const F=`#define GLSLIFY 1
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

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
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

float snoise(vec4 v)
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
  i = mod289(i);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

#define T uTime
#define S smoothstep

uniform float uTime;
uniform float uDelta;
uniform vec3 uColLand;
uniform vec3 uColSea;
uniform vec3 uColGrass;

uniform float uLandVal;
uniform float uLandHeight;

uniform float uEvolution;

attribute vec4 tangent;

varying vec3 vCol;

float fbm(vec4 p){
  float fre = 1.;
  float amp = 1.;
  float v = 0.;
  for(float i=0.;i<4.;i++){
    v += snoise(p * fre) * amp;
    fre *= 2.;
    amp *= .5;
  }
  return v;
}

float morph(inout vec3 p, float t){
  // float v = snoise4(vec4(p*4., t));
  float v = fbm(vec4(p*2., t));
  float v_land =  S(uLandVal, uLandVal + .01,v);
  float v_grass = S(uLandVal+.2,uLandVal+.21,v);
  float v_snow = S(uLandVal+.4,uLandVal+.41,v);

  vec3 col_sea = vec3(0,0,1);
  vec3 col_land = vec3(1,1,0);
  vCol = mix(uColLand, uColSea, v_land);

  vCol = mix( vCol, uColGrass, v_grass);
  vCol = mix( vCol, vec3(1), v_snow);
  

  p += csm_Normal * v_land * uLandHeight + .04*v *v_land;
  return v;
}

vec3 calcNormal(inout vec3 pos){
  float e = 0.01;

  vec3 biTangent = normalize(cross(csm_Normal, tangent.xyz));

  vec3 posA = pos + tangent.xyz * e;
  vec3 posB = pos + biTangent * e;

  float t = uEvolution > .5 ? T*.1 : 1. ;
  morph(posA, t);
  morph(posB, t);
  morph(pos,  t);

  vec3 toA = posA - pos;
  vec3 toB = posB - pos;

  return normalize(cross(toA, toB));
}

void main(){
  vec3 pos = csm_Position;

  csm_Normal = calcNormal(pos);

  csm_Position = pos;

}`,Y=`#define GLSLIFY 1

varying vec3 vCol;

void main(){

  csm_DiffuseColor.xyz = vCol; 
}`,V=`#define GLSLIFY 1
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

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
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

float snoise(vec4 v)
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
  i = mod289(i);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

uniform float uTime;

varying vec3 vCol;

float hash13(vec3 p3)
{
	p3  = fract(p3 * .1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}

void main(){

  vec3 pos = csm_Position.xyz;

  float n = snoise(vec4(pos*1.5, .1));
  float n01 = n * .5 + .5;

  float ha = hash13(pos);

  float a = 10. * PI * n01;
  float r = 2. + ha * 1.;
  pos.y = (n) * 4.;

  pos.xz = vec2(cos(a), sin(a)) * r;

  pos += dot(cos(pos.zxy + uTime), vec3(.1));

  vCol = sin(vec3(3,2,1) + uTime * ha * 10. + dot(pos, vec3(1.1)))*.5+.5;

  csm_Position.xyz = pos;
}
`,E=`#define GLSLIFY 1
uniform sampler2D uTex;

varying vec3 vCol;

void main(){
  float d = length(gl_PointCoord-.5);
  d = pow(.03/d, 2.);

  vec4 tex = texture2D(uTex, gl_PointCoord).rgba;

  vec4 col = vec4(tex.r) + d;

  col.rgb *= vCol;

  csm_FragColor = col;
  // csm_DiffuseColor.a = col.a;
}

`;function q(){const o={uEvolution:new t(0),uTime:new t(0),uDelta:new t(0),uColLand:new t(new y(15909393)),uColSea:new t(new y(1485534)),uColGrass:new t(new y(4576525)),uLandVal:new t(.02),uLandHeight:new t(.04)};g((r,f)=>{const{clock:C}=r;o.uTime.value=C.getElapsedTime(),o.uDelta.value=f});const{evolution:x,detail:a,wireframe:s,landCol:n,seaCol:i,grassCol:l,landVal:v,landHeight:d}=h({evolution:!1,detail:{value:60,min:10,max:100,step:1},wireframe:!1,landCol:`#${o.uColLand.value.getHexString()}`,seaCol:`#${o.uColSea.value.getHexString()}`,grassCol:`#${o.uColGrass.value.getHexString()}`,landVal:{value:o.uLandVal.value,min:-1,max:1,label:"landRange"},landHeight:{value:o.uLandHeight.value,min:0,max:1}});o.uColSea.value.set(n),o.uColLand.value.set(i),o.uColGrass.value.set(l),o.uLandVal.value=v,o.uLandHeight.value=d,o.uEvolution.value=x?1:0;const{geo:p}=m.useMemo(()=>{let r=new b(1,a);return r=D(r),r.computeTangents(),{geo:r}},[a]),[,u]=h(()=>({vertices:{value:0,editable:!1,label:"Vertices"}}));m.useEffect(()=>{u({vertices:p.attributes.position.count})},[p,u]);const c=m.useRef(null);return g((r,f)=>{c.current.rotation.y+=f*.1}),e.jsx(e.Fragment,{children:e.jsx("group",{ref:c,children:e.jsx("mesh",{geometry:p,children:e.jsx(w,{baseMaterial:S,uniforms:o,vertexShader:F,fragmentShader:Y,wireframe:s})})})})}function Z(){const o=m.useRef(null),{intensity:x}=h({intensity:{value:2,min:.1,max:40,step:.1}});return e.jsx(e.Fragment,{children:e.jsx("pointLight",{ref:o,position:[0,0,2],intensity:x})})}function P(){const o=m.useMemo(()=>{const s=new T,n=2e3,i=new Float32Array(n*3),l=10;for(let v=0;v<n;v++){const d=(Math.random()-.5)*l,p=(Math.random()-.5)*l,u=(Math.random()-.5)*l,c=v*3;i[c+0]=d,i[c+1]=p,i[c+2]=u}return s.setAttribute("position",new A(i,3)),s},[]),x=G(_,M("/img/texture/particle/star_09.png")),a={uTex:new t(x),uTime:new t(0),uDelta:new t(0)};return g((s,n)=>{const{clock:i}=s;a.uTime.value=i.getElapsedTime(),a.uDelta.value=n}),e.jsx(e.Fragment,{children:e.jsx("points",{geometry:o,children:e.jsx(w,{baseMaterial:I,uniforms:a,size:.1,transparent:!0,alphaTest:.01,depthWrite:!1,vertexShader:V,fragmentShader:E})})})}const J=z(function(){return e.jsx(e.Fragment,{children:e.jsx("div",{className:"h-screen",children:e.jsxs(L,{camera:{position:[0,2,2]},children:[e.jsx(j,{}),e.jsx("axesHelper",{args:[20]}),e.jsx("ambientLight",{intensity:.4}),e.jsx(Z,{}),e.jsx(q,{}),e.jsx(P,{})]})})})});export{J as default};
