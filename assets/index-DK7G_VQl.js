import{w as i,o as e}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as m,m as d,A as l,U as c,g as u}from"./extends-BhofGCXz.js";import{a as f}from"./asset-BvcpElq9.js";import{j as v}from"./three-custom-shader-material.es-Doi8FQpv.js";import{a as g}from"./BufferGeometryUtils-8at5vRk1.js";import{O as p}from"./OrbitControls-BLiDvAIL.js";import{u as x}from"./Gltf-t8lXtj8T.js";import{u as h}from"./Texture-BlwqjH7Q.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-CJiU6NmO.js";import"./constants-BkWHBZ1v.js";const C=`#define GLSLIFY 1
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
}`;function y(){const{nodes:r,materials:L,animations:S}=x("/model/guangzhuzi-transformed.glb"),o=[];r.Scene.traverse(t=>{t instanceof d&&t.geometry&&o.push(t.geometry)});const s=g(o),a=h(f("/img/texture/particle/star_09.png")),n={tex:new c(a)};return e.jsx("points",{geometry:s,scale:.01,"rotation-x":-Math.PI/2-.1,children:e.jsx(v,{baseMaterial:u,uniforms:n,vertexShader:C,fragmentShader:j,size:.02,transparent:!0,blending:l})})}const O=i(function(){return e.jsx("div",{className:"h-screen",children:e.jsxs(m,{children:[e.jsx(p,{}),e.jsx(y,{})]})})});export{O as default};
