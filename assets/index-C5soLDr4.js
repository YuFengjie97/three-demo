import{w as i,o as e,r as m}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as d}from"./extends-CQKH8FHF.js";import{a as l}from"./asset-BvcpElq9.js";import{j as c}from"./three-custom-shader-material.es-3-1qXxK2.js";import{a as f}from"./BufferGeometryUtils-WF-AyRnd.js";import{O as u}from"./OrbitControls-Df7v6KnC.js";import{L as p}from"./Loader-DtNERok4.js";import{u as v}from"./Gltf-ChqwI0vI.js";import{u as x}from"./Texture-DSuxOoaE.js";import{j as g,A as h,U as C,d as j}from"./three.module-CqEfS7dP.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-ClleyNLK.js";import"./constants-XW_pBG14.js";const L=`#define GLSLIFY 1
attribute vec3 color;

varying vec3 vCol;

void main(){

  vCol = color;
}`,S=`#define GLSLIFY 1
uniform sampler2D tex;

varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord;
  // float d = dot(uv, uv);
  // d = 2./d;
  // float d = length(uv);
  // d = .1/d;
  float d = texture(tex, uv).r;

  csm_FragColor = vec4(vCol * d, d);
}`;function y(){const{nodes:o,materials:b,animations:F}=v("/model/guangzhuzi-transformed.glb"),t=[];o.Scene.traverse(r=>{r instanceof g&&r.geometry&&t.push(r.geometry)});const s=f(t),a=x(l("/img/texture/particle/star_09.png")),n={tex:new C(a)};return e.jsx("points",{geometry:s,scale:.01,"rotation-x":-Math.PI/2-.1,children:e.jsx(c,{baseMaterial:j,uniforms:n,vertexShader:L,fragmentShader:S,size:.02,transparent:!0,blending:h})})}const Y=i(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(d,{children:[e.jsx(u,{}),e.jsx(m.Suspense,{fallback:null,children:e.jsx(y,{})})]}),e.jsx(p,{})]})});export{Y as default};
