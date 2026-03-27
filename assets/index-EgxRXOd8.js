import{w as h,o as e,r as w}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as g,V as m,ay as y,az as C,A as j,d as b,f as L,U as a}from"./extends-BOzx6wRw.js";import{j as S}from"./three-custom-shader-material.es-jOkUtjyU.js";import{u as U}from"./useUniformTime-CyroLQN9.js";import{u as G}from"./leva.esm-BV3Tl-wj.js";import{d as P,w as T}from"./index-BAXyWrbW.js";import{O as M}from"./OrbitControls-BuvrsTb9.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-B-sYQ2LU.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";const B=`#define GLSLIFY 1
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
uniform float tailLen;

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
  float tail = 1./count * tailLen;

  for(float i=0.;i<count;i++){
    float life = i/count;
    vec3 c = sin(vec3(3,2,1) + i + vPos*.1)*.5+.5;

    float d1 = fract(vUv.x + life + uTime * speed);
    d1 = smoothstep(tail, 0., d1);

    d += d1;
    col += c * d1;
  }

  csm_FragColor = vec4(col*3., d);
}`,{sin:r}=Math;function N(s,t){const o=s.clone(),i=new m(r(o.y),r(o.z),r(o.x)).sub(o.multiply(new m(t,t,t)));return s.clone().add(i)}function V(){const{bFactor:t,count:o,speed:i,tailLen:c}=G({bFactor:{value:.19,min:.01,max:.3,stpe:.01},count:{value:50,min:1,max:200,step:1},speed:{value:.04,min:0,max:.5,step:.01},tailLen:{value:.6,min:.1,max:1,step:.1}}),{points:z,curve:A,tubeGeo:p}=w.useMemo(()=>{let n=[new m(.1,0,0)];for(let u=0;u<300;u++){const d=n[n.length-1].clone(),x=N(d,t);n.push(x)}const l=new y(n),v=new C(l,3e3,.05,8);return{points:n,curve:l,tubeGeo:v}},[300,t]),f={...U(),count:new a(o),speed:new a(i),tailLen:new a(c)};return e.jsx("mesh",{geometry:p,children:e.jsx(S,{uniforms:f,baseMaterial:L,vertexShader:B,fragmentShader:F,transparent:!0,depthWrite:!1,side:b,blending:j})})}const Q=h(function(){return e.jsx("div",{className:"h-screen",children:e.jsxs(g,{camera:{position:[0,0,10]},children:[e.jsx(M,{}),e.jsx(V,{}),e.jsx(P,{children:e.jsx(T,{intensity:4,radius:.2})})]})})});export{Q as default};
