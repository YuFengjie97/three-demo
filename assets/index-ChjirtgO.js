import{w as j,o as e,r as u}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{am as M,an as b,ao as T,R as I,C as D,O as _,X as z,p as L,q as E,U,M as S,ap as k}from"./OrbitControls-CmBRG4Bd.js";import{a as P}from"./BufferGeometryUtils-C67PeoxE.js";import{u as B}from"./leva.esm-BV3Tl-wj.js";import{P as F}from"./Perf-9NpNtL2P.js";import{a as c}from"./asset-BvcpElq9.js";import{j as G}from"./three-custom-shader-material.es-B41VK_Vk.js";import{u as R}from"./useUniformTime-DeKYjdeE.js";import{u as O}from"./Gltf-DVFD5mtA.js";import{u as d}from"./Texture-Sa6PNAoI.js";import{E as q}from"./Environment-Cmv36Jh2.js";import"./index-7OC5HNn7.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";import"./three-custom-shader-material.es-DobAws7m.js";import"./constants-kCI-iZVw.js";function N(a){const{width:o,height:i}=a[0],l=a.length,f=o*i*4,p=new Uint8Array(f*l);a.forEach((y,g)=>{const m=document.createElement("canvas");m.width=o,m.height=i;const r=m.getContext("2d");r.drawImage(y.image,0,0);const n=r.getImageData(0,0,o,i).data;p.set(n,g*f)});const s=new M(p,o,i,l);return s.format=b,s.type=T,s.needsUpdate=!0,s.wrapS=I,s.wrapT=I,s}const Y=`#define GLSLIFY 1
//
// Description : Array and textureless GLSL 2D simplex noise function.
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

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
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
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
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

attribute float aInstanceId;

varying vec2 vUv;
varying float vInstanceId;

mat2 rotate(float a){
  float s = sin(a);
  float c = cos(a);
  return mat2(c,-s,s,c);
}

void main(){
  vUv = uv;
  // vInstanceId = aInstanceId;
  vInstanceId = float(gl_InstanceID);

  float t = uTime;

  vec3 offset = vec3(
    snoise(vec2(aInstanceId, t*.1+1.)) * 4.,
    snoise(vec2(aInstanceId, t*.1+2.)) * 4.,
    snoise(vec2(aInstanceId, t*.1+3.)) * 4.
  );

  csm_Position.xz *= rotate(6.*snoise(vec2(aInstanceId+4., t*.06)));
  csm_Position.yz *= rotate(6.*snoise(vec2(aInstanceId+5., t*.06)));

  csm_Position += offset;
}`,W=`#define GLSLIFY 1
uniform highp sampler2DArray uTextureArray;

varying vec2 vUv;
varying float vInstanceId;

void main(){
  float texId = mod(vInstanceId, 4.);
  vec4 texColor = texture(uTextureArray, vec3(vUv*3., texId));

  vec3 col = sin(vec3(3,2,1) + texId) *.5+.5;

  csm_DiffuseColor.rgb = texColor.r * col * 2.;
  csm_DiffuseColor.a = texColor.r;

  // csm_DiffuseColor.rgb = sin(vec3(3,2,1) + texId)*.5+.5;
}`;function X(){const{nodes:a}=O(c("/model/skull_downloadable/scene.gltf")),o=d(c("/img/texture/particle/spark_01.png")),i=d(c("/img/texture/particle/spark_02.png")),l=d(c("/img/texture/particle/spark_03.png")),f=d(c("/img/texture/particle/spark_04.png")),s=N([o,i,l,f]),g={...R(),uTextureArray:new U(s)},m=u.useMemo(()=>{const x=Object.values(a).map(t=>{if(t instanceof z)return t}).filter(t=>t);return P(x.map(t=>t?.geometry))},[]),r=u.useRef(null),{count:n}=B({count:{value:10,min:1,max:100}});u.useLayoutEffect(()=>{if(!r.current)return;const x=new Float32Array(n);for(let t=0;t<n;t++)x[t]=t;r.current.geometry.setAttribute("aInstanceId",new L(x,1))},[]);const v=u.useMemo(()=>new E,[]);return u.useEffect(()=>{for(let t=0;t<n;t++){const C=(Math.random()-.5)*5,A=(Math.random()-.5)*5,w=(Math.random()-.5)*5;v.position.set(C,A,w);let h=Math.random()*.5+.5;v.scale.set(h,h,h),v.updateMatrix(),r.current.setMatrixAt(t,v.matrix),r.current.count=n,r.current.instanceMatrix.needsUpdate=!0}},[n]),e.jsx(e.Fragment,{children:e.jsx("instancedMesh",{ref:r,args:[m,void 0,n],children:e.jsx(G,{baseMaterial:S,uniforms:g,vertexShader:Y,fragmentShader:W,alphaTest:.1,transparent:!0})})})}function H(){const a=d(c("/img/texture/matcap/2A2A2A_B3B3B3_6D6D6D_848C8C.png"));return e.jsx(q,{background:!0,blur:1,children:e.jsxs("mesh",{scale:100,children:[e.jsx("icosahedronGeometry",{args:[1,64]}),e.jsx("meshBasicMaterial",{map:a,side:k})]})})}const ue=j(function(){return e.jsx(e.Fragment,{children:e.jsx("div",{className:"h-screen",children:e.jsxs(D,{children:[e.jsx(F,{position:"top-left"}),e.jsx("ambientLight",{}),e.jsx(_,{}),e.jsx(X,{}),e.jsx(H,{})]})})})});export{ue as default};
