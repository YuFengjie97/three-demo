import{w as h,o as e,r as w}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as g}from"./extends-BiVYuz_A.js";import{j as C}from"./three-custom-shader-material.es-BfYBlZiu.js";import{u as b}from"./useUniformTime-t8EuF-0W.js";import{u as j}from"./leva.esm-CD9oxMAJ.js";import{d as y,w as L}from"./index-CPLaNTt-.js";import{O as S}from"./OrbitControls-CNEd5UP6.js";import{V as m,K as U,R as G,A as P,b as T,c as M,U as a}from"./three.module-_piUs-D2.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-5wyYUYSP.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";const B=`#define GLSLIFY 1

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
}`,{sin:r}=Math;function N(s,t){const o=s.clone(),i=new m(r(o.y),r(o.z),r(o.x)).sub(o.multiply(new m(t,t,t)));return s.clone().add(i)}function R(){const{bFactor:t,count:o,speed:i,tailLen:c}=j({bFactor:{value:.19,min:.01,max:.3,stpe:.01},count:{value:50,min:1,max:200,step:1},speed:{value:.04,min:0,max:.5,step:.01},tailLen:{value:.6,min:.1,max:1,step:.1}}),{points:V,curve:A,tubeGeo:p}=w.useMemo(()=>{let n=[new m(.1,0,0)];for(let u=0;u<300;u++){const d=n[n.length-1].clone(),x=N(d,t);n.push(x)}const l=new U(n),v=new G(l,3e3,.05,8);return{points:n,curve:l,tubeGeo:v}},[300,t]),f={...b(),count:new a(o),speed:new a(i),tailLen:new a(c)};return e.jsx("mesh",{geometry:p,children:e.jsx(C,{uniforms:f,baseMaterial:M,vertexShader:B,fragmentShader:F,transparent:!0,depthWrite:!1,side:T,blending:P})})}const X=h(function(){return e.jsx("div",{className:"h-screen",children:e.jsxs(g,{camera:{position:[0,0,10]},children:[e.jsx(S,{}),e.jsx(R,{}),e.jsx(y,{children:e.jsx(L,{intensity:4,radius:.2})})]})})});export{X as default};
