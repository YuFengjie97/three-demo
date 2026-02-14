import{w as i,o as e}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as m,m as d,A as l,U as c,g as u}from"./extends-BlC2n1ra.js";import{a as f}from"./asset-BvcpElq9.js";import{j as v}from"./three-custom-shader-material.es-BGTEHp_F.js";import{a as g}from"./BufferGeometryUtils-BJfFRFSm.js";import{O as p}from"./OrbitControls-AT23luag.js";import{u as x}from"./Gltf-Tkgqmi5f.js";import{u as h}from"./Texture-prp8whrA.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-D7WJHKEE.js";import"./constants-Vcla44ih.js";const C=`#define GLSLIFY 1
attribute vec3 color;

varying vec3 vCol;

void main(){

  vCol = color;
}`,j=`#define GLSLIFY 1
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
}`;function y(){const{nodes:o,materials:L,animations:S}=x("/model/guangzhuzi-transformed.glb"),r=[];o.Scene.traverse(t=>{t instanceof d&&t.geometry&&r.push(t.geometry)});const s=g(r),a=h(f("/img/texture/particle/star_09.png")),n={tex:new c(a)};return e.jsx("points",{geometry:s,scale:.01,"rotation-x":-Math.PI/2-.1,children:e.jsx(v,{baseMaterial:u,uniforms:n,vertexShader:C,fragmentShader:j,size:.02,transparent:!0,blending:l})})}const O=i(function(){return e.jsx("div",{className:"h-screen",children:e.jsxs(m,{children:[e.jsx("axesHelper",{args:[10]}),e.jsx(p,{}),e.jsx(y,{})]})})});export{O as default};
