import{w as h,o as e,r as g}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as w,V as a,ay as C,az as j,A as y,d as b,f as S,U as u}from"./extends-BdriEdbW.js";import{j as U}from"./three-custom-shader-material.es-D-W6D0Cy.js";import{u as G}from"./useUniformTime-BHPFPcMN.js";import{u as L}from"./leva.esm-B2CXSQv-.js";import{d as P,w as T}from"./index-DCJ7wBpk.js";import{O as M}from"./OrbitControls-Dcrh6SP_.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-B5k9pN60.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";const B=`#define GLSLIFY 1
varying vec2 vUv;
varying vec3 vPos;

void main(){
  vUv = uv;
  vPos = csm_Position;
}
`,F=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;
uniform float count;
uniform float speed;

varying vec2 vUv;
varying vec3 vPos;

float hash11(float p){
  p = fract(p * .1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

void main(){

  vec3 col = vec3(0);
  float d = 0.;
  float tailLen = 1./count * .6;

  for(float i=0.;i<count;i++){
    float life = i/count;
    vec3 c = sin(vec3(3,2,1) + i + vPos*.1)*.5+.5;

    float d1 = fract(vUv.x + life + uTime * speed);
    d1 = smoothstep(tailLen, 0., d1);

    d += d1;
    col += c * d1;
  }

  csm_FragColor = vec4(col*2., d);
}`,{sin:r}=Math;function N(s,o){const t=s.clone(),i=new a(r(t.y),r(t.z),r(t.x)).sub(t.multiply(new a(o,o,o)));return s.clone().add(i)}function V(){const{bFactor:o,count:t,speed:i}=L({bFactor:{value:.19,min:.01,max:.3,stpe:.01},count:{value:50,min:1,max:200,step:1},speed:{value:.04,min:0,max:.5,step:.01}}),{points:l,curve:z,tubeGeo:p}=g.useMemo(()=>{let n=[new a(1,0,0)];for(let m=0;m<300;m++){const d=n[n.length-1].clone(),x=N(d,o);n.push(x)}const c=new C(n),v=new j(c,3e3,.05,8);return{points:n,curve:c,tubeGeo:v}},[300,o]),f={...G(),count:new u(t),speed:new u(i)};return e.jsx("mesh",{geometry:p,children:e.jsx(U,{uniforms:f,baseMaterial:S,vertexShader:B,fragmentShader:F,transparent:!0,depthWrite:!1,side:b,blending:y})})}const K=h(function(){return e.jsx("div",{className:"h-screen",children:e.jsxs(w,{camera:{position:[0,0,10]},children:[e.jsx(M,{}),e.jsx(V,{}),e.jsx(P,{children:e.jsx(T,{})})]})})});export{K as default};
