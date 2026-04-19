import{w as a,o as e,r as m}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as u}from"./extends-DB1AKiCw.js";import{j as c}from"./three-custom-shader-material.es-C6vuES40.js";import{u as f}from"./useUniformTime-CT87P4nb.js";import{O as v}from"./OrbitControls-Cz5FpyQx.js";import{L as l}from"./Loader-C7LJdAHv.js";import{U as d,m as p,b as x,c as h}from"./three.module-D8tfqROL.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-BGeejYQe.js";const j=`#define GLSLIFY 1

varying vec2 vUv;

void main(){
  vec3 pos = csm_Position;
  vUv = uv;
}`,M=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;
uniform vec2 uMouse;

varying vec2 vUv;

void main(){
  float d = sin(length(vUv-uMouse)*20. - uTime);
  d = .1/abs(d);

  csm_FragColor = vec4(vec3(1,0,0)*d, d);
}`;function g(){const s={...f(),uMouse:new d(new p(0,0))};function r(n){const{uv:o}=n;if(o){const{x:i,y:t}=o;s.uMouse.value.set(i,t)}}return e.jsxs("mesh",{onPointerMove:r,children:[e.jsx("planeGeometry",{args:[100,100,1,1]}),e.jsx(c,{uniforms:s,baseMaterial:h,vertexShader:j,fragmentShader:M,side:x,transparent:!0,depthWrite:!1})]})}const G=a(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(u,{children:[e.jsx("axesHelper",{args:[10]}),e.jsx(v,{}),e.jsx(m.Suspense,{fallback:null,children:e.jsx(g,{})})]}),e.jsx(l,{})]})});export{G as default};
