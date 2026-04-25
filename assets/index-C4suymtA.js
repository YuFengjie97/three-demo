import{w as v,o as e,r as u}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as f,a as x}from"./extends-BiVYuz_A.js";import{a as g}from"./asset-BvcpElq9.js";import{j as h}from"./three-custom-shader-material.es-BfYBlZiu.js";import{u as j}from"./useUniformTime-t8EuF-0W.js";import{u as C}from"./leva.esm-CD9oxMAJ.js";import{d as y,w as b}from"./index-CPLaNTt-.js";import{O as S}from"./OrbitControls-CNEd5UP6.js";import{C as w}from"./Center-B9sXklJF.js";import{L as N}from"./Loader-BBMetSDN.js";import{H as L}from"./Html-DggU2ck_.js";import{U as l,C as c,F as T,m as M,E as F,b as P,c as U}from"./three.module-_piUs-D2.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-5wyYUYSP.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";const H=`#define GLSLIFY 1

varying vec2 vUv;
varying vec3 vNormal2;

void main(){
  vUv = uv;
  vNormal2 = csm_Normal;
}`,k=`#define GLSLIFY 1
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uSideColor;

varying vec2 vUv;
varying vec3 vNormal2;

void main(){
  float t = uTime;

  float side = 1.-abs(vNormal2.z);

  vec3 col = mix(uColor, uSideColor, side);

  float d = abs(sin(vUv.y+uTime));
  d = smoothstep(.1,0.,d);
  col += d*side*uSideColor*4.;

  csm_FragColor.rgb = col;
  csm_FragColor.a = .5;
}`,a={uColor:new l(new c(7649791)),uSideColor:new l(new c(16058890)),uTime:new l(0),uDelta:new l(0)};function d({coords:r,children:o}){const s=u.useMemo(()=>{const t=new M;t.moveTo(...r[0]);for(let n=1;n<r.length;n++)t.lineTo(...r[n]);const i=new F(t,{bevelSize:0,bevelThickness:0,bevelSegments:0,depth:4});return i.computeVertexNormals(),i},[r]);return e.jsxs("mesh",{geometry:s,children:[e.jsx(h,{baseMaterial:U,uniforms:a,side:P,vertexShader:H,fragmentShader:k,depthWrite:!1,transparent:!0}),o]})}function D({coordss:r,children:o}){return e.jsxs("group",{children:[r.map((s,t)=>e.jsx(d,{coords:s},t)),o]})}function m({feature:r}){const{properties:{center:o,name:s}}=r;return o?e.jsx(L,{position:[...o??[0,0],0],center:!0,distanceFactor:5,children:e.jsxs("div",{className:"relative cursor-pointer -translate-y-4",children:[e.jsx("div",{className:`inline-block whitespace-nowrap rounded-2xl\r
        bg-gray-900 text-l text-gray-200 px-3 py-1.5 select-none`,children:s??""}),e.jsx("div",{className:`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-5\r
        border-10 border-transparent border-t-gray-900`})]})}):null}function E({feature:r}){const{geometry:{type:o,coordinates:s}}=r;if(o==="Polygon"){const t=s[0];return e.jsx(d,{coords:t,children:e.jsx(m,{feature:r})})}else if(o==="MultiPolygon"){const t=s.map(i=>i[0]);return e.jsx(D,{coordss:t,children:e.jsx(m,{feature:r})})}else return null}function G(){const r=x(T,g("/data/china.json")),o=typeof r=="string"?JSON.parse(r):r,s=o.features.slice(0,34);o.properties.center,console.log(o.features);const{uTime:t,uDelta:i}=j();return a.uTime=t,a.uDelta=i,C({color:{value:"#"+a.uColor.value.getHexString(),onChange:n=>{a.uColor.value.set(n)}},sideColor:{value:"#"+a.uSideColor.value.getHexString(),onChange:n=>{a.uSideColor.value.set(n)}}}),console.log("render"),e.jsx("group",{scale:.2,children:s.map((n,p)=>e.jsx(E,{feature:n},p))})}const ee=v(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(f,{children:[e.jsx("color",{attach:"background",args:["#191920"]}),e.jsx("fog",{attach:"fog",args:["#191920",.1,20]}),e.jsx(S,{}),e.jsx("ambientLight",{}),e.jsx("directionalLight",{position:[0,0,3]}),e.jsx(u.Suspense,{fallback:null,children:e.jsx(w,{children:e.jsx(G,{})})}),e.jsx(y,{children:e.jsx(b,{})})]}),e.jsx(N,{})]})});export{ee as default};
