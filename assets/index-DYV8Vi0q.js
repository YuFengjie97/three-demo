import{w as d,o as n,r as l}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as f,O as u,h,U as C,d as g,f as x}from"./OrbitControls-C-XH75P4.js";import{j as p}from"./three-custom-shader-material.es-RjNOev27.js";import{a as y}from"./asset-BvcpElq9.js";import{u as k}from"./leva.esm-BV3Tl-wj.js";import{u as j}from"./Gltf-DzEVcUzg.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-Bh0y3f4l.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";import"./constants-2BT4CMD4.js";const b=`#define GLSLIFY 1
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
}`,{PI:T}=Math;function z(){const{nodes:i,materials:F}=j(y("/model/skull-transformed.glb")),m=l.useMemo(()=>{let s=i.Object_2.geometry;s=s.toNonIndexed();const a=s.attributes.position.count,e=new Float32Array(a*3);for(let r=0;r<a;r++){const c=r%3,t=r*3;c===0?(e[t]=1,e[t+1]=0,e[t+2]=0):c===1?(e[t]=0,e[t+1]=1,e[t+2]=0):(e[t]=0,e[t+1]=0,e[t+2]=1)}return s.setAttribute("aCenter",new h(e,3)),s},[i]),o={uThickness:new C(2)},{thickness:v}=k({thickness:{value:o.uThickness.value,min:.1,max:10}});return o.uThickness.value=v,n.jsx("mesh",{geometry:m,"rotation-x":-T/2,scale:2,children:n.jsx(p,{baseMaterial:x,uniforms:o,vertexShader:b,fragmentShader:w,side:g,transparent:!0})})}const N=d(function(){return n.jsx("div",{className:"h-screen",children:n.jsxs(f,{camera:{position:[0,0,.1]},children:[n.jsx("ambientLight",{}),n.jsx("axesHelper",{args:[10]}),n.jsx(u,{}),n.jsx(z,{})]})})});export{N as default};
