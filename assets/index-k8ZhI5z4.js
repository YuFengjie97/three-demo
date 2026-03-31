import{w as l,o as e,r as s}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as d}from"./extends-Duj4sZJC.js";import{j as c}from"./three-custom-shader-material.es-CZ14K5mc.js";import{u as g}from"./useUniformTime-CmNZpKap.js";import{a as x}from"./asset-BvcpElq9.js";import{d as h,w}from"./index-CteE7iEh.js";import{u as S}from"./leva.esm-BV3Tl-wj.js";import{O as y}from"./OrbitControls-D93bPuip.js";import{L as C}from"./Loader-CXlLoU35.js";import{u as T}from"./Texture-Dpb5tcRz.js";import{ar as j,U as o,C as A,A as U,b as O,c as H}from"./three.module-DHYYXIKh.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-D9Mt5r6T.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";const b=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;
uniform float uHeight;
uniform float uRotateSpeed;
uniform float uSwingAmp;
uniform float uSwingSpeed;

varying vec2 vUv;
varying vec3 vNormal2;
varying vec3 vPos;

mat2 rotate(float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c,-s,s,c);
}

void main(){
  vec3 pos = csm_Position;
  // vCol = pos;
  vPos = pos;

  float ang = atan(pos.z, pos.x);
  float radiusByH = smoothstep(.3*uHeight,-.7*uHeight,pos.y)*6. +
                    smoothstep(.5*uHeight,2.1*uHeight,pos.y)*10.;
  float radius = 2. +  sin(ang*8.)*.1 + radiusByH*1.5;
  pos.xz = vec2(cos(ang), sin(ang)) * radius;
  pos.xz = rotate(pos.y+uTime*uRotateSpeed) * pos.xz;

  // 摇摆
  float swingAng = sin(pos.y*.5+uTime*uSwingSpeed);
  vec2 swingOff = vec2(cos(swingAng), sin(swingAng))*uSwingAmp;
  pos.xz += swingOff;

  vUv = uv;
  vNormal2 = normal;

  csm_Position = pos;
}`,P=`#define GLSLIFY 1
uniform sampler2D uTex;
uniform float uTime;
uniform vec3 uCol;
uniform float uTexOffsetSpeed;

varying vec2 vUv;
varying vec3 vNormal2;
varying vec3 vPos;

void main(){

  // float d = sin(vUv.x*10.);

  vec2 uv = vUv;
  // vec2 uv = fract(vPos.xy*.1);
  uv.y *= .4;
  uv.y -= uTime*uTexOffsetSpeed;
  uv.y = fract(uv.y);
  uv.x = fract(uv.x);
  
  float d = 1.-texture(uTex, uv).r;
  d *= smoothstep(1.,.8,vUv.y);
  d *= smoothstep(0.,.1,vUv.y);
  // d = smoothstep(.4,.0,d);
  float side = 1.-abs(vNormal2.y);

  csm_FragColor = vec4(uCol*d*3., side*d);
}`;function L(){const{geo:u}=s.useMemo(()=>{const m=new j(1,1,10,32,32);return m.translate(0,5,0),{geo:m}},[10]),f=T(x("/img/texture/noise/Cracks 8 - 512x512.png")),{col:t,rotateSpeed:i,texOffsetSpeed:a,swingAmp:n,swingSpeed:r}=S({col:"#ff0000",rotateSpeed:{value:3,min:-5,max:5,step:.1},texOffsetSpeed:{value:.6,min:-5,max:5,step:.1},swingAmp:{value:1.5,min:0,max:3,step:.1},swingSpeed:{value:4,min:-5,max:5,step:.1}}),p=g(),v=s.useMemo(()=>({...p,uHeight:new o(10),uTex:new o(f),uCol:new o(new A(t)),uRotateSpeed:new o(i),uTexOffsetSpeed:new o(a),uSwingAmp:new o(n),uSwingSpeed:new o(r)}),[t,i,a,n,r]);return e.jsx("mesh",{geometry:u,children:e.jsx(c,{uniforms:v,baseMaterial:H,vertexShader:b,fragmentShader:P,transparent:!0,side:O,toneMapped:!1,depthWrite:!1,blending:U})})}const Q=l(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(d,{camera:{position:[0,4,15]},children:[e.jsx(y,{target:[0,3,0]}),e.jsx(s.Suspense,{fallback:null,children:e.jsx(L,{})}),e.jsx(h,{children:e.jsx(w,{})})]}),e.jsx(C,{})]})});export{Q as default};
