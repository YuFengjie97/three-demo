import{w as i,o as e,r as m}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as l,m as d,A as c,U as u,g as f}from"./extends-BdriEdbW.js";import{a as p}from"./asset-BvcpElq9.js";import{j as v}from"./three-custom-shader-material.es-D-W6D0Cy.js";import{a as x}from"./BufferGeometryUtils-BAJOxkcv.js";import{O as g}from"./OrbitControls-Dcrh6SP_.js";import{L as h}from"./Loader-BIdd6GxD.js";import{u as C}from"./Gltf-CTDheT9V.js";import{u as j}from"./Texture-BGFVe-MZ.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-B5k9pN60.js";import"./constants-DJwGZ68D.js";const L=`#define GLSLIFY 1
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
}`;function y(){const{nodes:o,materials:b,animations:F}=C("/model/guangzhuzi-transformed.glb"),t=[];o.Scene.traverse(r=>{r instanceof d&&r.geometry&&t.push(r.geometry)});const s=x(t),a=j(p("/img/texture/particle/star_09.png")),n={tex:new u(a)};return e.jsx("points",{geometry:s,scale:.01,"rotation-x":-Math.PI/2-.1,children:e.jsx(v,{baseMaterial:f,uniforms:n,vertexShader:L,fragmentShader:S,size:.02,transparent:!0,blending:c})})}const U=i(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(l,{children:[e.jsx(g,{}),e.jsx(m.Suspense,{fallback:null,children:e.jsx(y,{})})]}),e.jsx(h,{})]})});export{U as default};
