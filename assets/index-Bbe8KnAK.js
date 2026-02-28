import{w as d,o as n,r as l}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as f,h as u,U as h,d as C,f as g}from"./extends-BhofGCXz.js";import{j as p}from"./three-custom-shader-material.es-Doi8FQpv.js";import{a as x}from"./asset-BvcpElq9.js";import{u as y}from"./leva.esm-B2CXSQv-.js";import{O as k}from"./OrbitControls-BLiDvAIL.js";import{u as b}from"./Gltf-t8lXtj8T.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-CJiU6NmO.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";import"./constants-BkWHBZ1v.js";const j=`#define GLSLIFY 1
uniform float uThickness;

attribute vec3 aCenter;

varying vec3 vCenter;
varying vec3 vCol;

void main(){
  vCenter = aCenter;

  // vCol = sin(vec3(3,2,1) + vCenter) * .5 + .5;
  vCol = sin(vec3(3,2,1) + csm_Position*10.) * .5 + .5;
}
`,w=`#define GLSLIFY 1
uniform float uThickness;

varying vec3 vCenter;
varying vec3 vCol;

void main(){

  // float d = vCenter.x;
  // float d = min(min(vCenter.x, vCenter.y),vCenter.z);
  // float d = vCenter.x * vCenter.y * vCenter.z;
  // d = smoothstep(.1,0.,d);
  // csm_FragColor = vec4(vec3(d), 1.);

  float thickness = uThickness;
  vec3 afwidth = fwidth(vCenter.xyz);
  vec3 edge3 = smoothstep((thickness-1.)*afwidth, thickness*afwidth, vCenter);
  float edge = 1.-min(min(edge3.x,edge3.y),edge3.z);

  float d = min(length(vCenter.yz), min(length(vCenter.xy), length(vCenter.xz)));
  d = pow(.1/d,2.);

  // edge = min(edge, d);
  
  // edge = d;

  csm_FragColor = vec4(vec3(edge) * vCol, edge);
}`,{PI:T}=Math;function z(){const{nodes:i,materials:F}=b(x("/model/skull-transformed.glb")),m=l.useMemo(()=>{let s=i.Object_2.geometry;s=s.toNonIndexed();const a=s.attributes.position.count,e=new Float32Array(a*3);for(let o=0;o<a;o++){const c=o%3,t=o*3;c===0?(e[t]=1,e[t+1]=0,e[t+2]=0):c===1?(e[t]=0,e[t+1]=1,e[t+2]=0):(e[t]=0,e[t+1]=0,e[t+2]=1)}return s.setAttribute("aCenter",new u(e,3)),s},[i]),r={uThickness:new h(2)},{thickness:v}=y({thickness:{value:r.uThickness.value,min:.1,max:10}});return r.uThickness.value=v,n.jsx("mesh",{geometry:m,"rotation-x":-T/2,scale:2,children:n.jsx(p,{baseMaterial:g,uniforms:r,vertexShader:j,fragmentShader:w,side:C,transparent:!0})})}const U=d(function(){return n.jsx("div",{className:"h-screen",children:n.jsxs(f,{camera:{position:[0,0,.1]},children:[n.jsx("ambientLight",{}),n.jsx(k,{}),n.jsx(z,{})]})})});export{U as default};
