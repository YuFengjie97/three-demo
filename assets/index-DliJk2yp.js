import{r as c,w as F,o as e}from"./chunk-EPOLDU6W-ZrNLe__p.js";import{C as w,B as j,h as C,U as m,u as y,A as P,g as V,e as G}from"./extends-BdriEdbW.js";import{j as L}from"./three-custom-shader-material.es-D-W6D0Cy.js";import{u as T}from"./useUniformTime-BHPFPcMN.js";import{u as S}from"./leva.esm-B2CXSQv-.js";import{d as z,w as A}from"./index-DCJ7wBpk.js";import{a as B}from"./asset-BvcpElq9.js";import{O as U}from"./OrbitControls-Dcrh6SP_.js";import{L as _}from"./Loader-BIdd6GxD.js";import{u as D}from"./Texture-BGFVe-MZ.js";import{G as M}from"./GPUComputationRenderer-D1938aHm.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-B5k9pN60.js";import"./index-CxVb0jKi.js";import"./client-v42XUi56.js";import"./index-9SbZNP1W.js";const I=`#define GLSLIFY 1
uniform sampler2D posTex;
uniform float uTime;

attribute vec2 pCoord;

varying vec3 vCol;

void main(){
  vec4 particle = texture(posTex, pCoord);
  vec3 pos = particle.xyz;
  float seed = particle.w;

  vCol = sin(vec3(3,2,1) + seed + pos*.5+uTime)*.5+.5;

  csm_Position = pos;
}
`,R=`#define GLSLIFY 1
uniform sampler2D tex;

varying vec3 vCol;

void main(){
  vec2 uv = gl_PointCoord.xy;

  // float d = length(uv-.5);
  // d = smoothstep(.5,0., d-.1);
  
  float d = texture(tex,uv).r;
  
  csm_FragColor = vec4(vCol*d, d);
}`,Y=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;
uniform float speed;
// uniform float bFactor;

vec3 getVel(vec3 p, float bFactor){
  // bFactor = 0.208186;
  bFactor = .19;
  // bFactor = (sin(uTime)*.5+.5)*.29+.01;
  vec3 v = sin(p.yzx)- bFactor * p;
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(posTex, uv);
  vec3 pos = particle.xyz;
  float seed = particle.w;

  vec3 vel = getVel(pos, seed);
  pos += vel * uDelta * speed;

  gl_FragColor = vec4(pos, seed);
}`,x=c.createContext({count:0,size:1}),{ceil:E,sqrt:O,random:l,floor:k}=Math;function q(t,o){const n=t.image.data;for(let a=0;a<o*o;a++){const r=a*4;n[r+0]=(l()-.5)*10,n[r+1]=(l()-.5)*10,n[r+2]=(l()-.5)*10,n[r+3]=l()*.3+.001}}function N(){const{size:t}=c.useContext(x),{gl:o}=G(),n=T(),{gpu:a,posVar:r}=c.useMemo(()=>{const s=new M(t,t,o),p=s.createTexture();q(p,t);const i=s.addVariable("posTex",Y,p);return s.setVariableDependencies(i,[i]),i.material.uniforms={...n,speed:new m(2.5),bFactor:new m(.208186)},s.init(),{posVar:i,gpu:s}},[]);return S({speed:{value:2.5,min:.1,max:20,step:.01,onChange(s){r.material.uniforms.speed.value=s}}}),{gpu:a,posVar:r}}function W(){const{count:t,size:o}=c.useContext(x),{geo:n}=c.useMemo(()=>{const d=new j,b=new Float32Array(t*3);d.setAttribute("position",new C(b,3));const f=new Float32Array(t*2);for(let u=0;u<t;u++){const v=k(u/o),h=u-v*o,g=u*2;f[g+0]=(h+.5)/o,f[g+1]=(v+.5)/o}return d.setAttribute("pCoord",new C(f,2)),{geo:d}},[t]),{posVar:a,gpu:r}=N(),s=T(),p=D(B("/img/texture/particle/star_09.png")),i={...s,posTex:new m(r.getCurrentRenderTarget(a).texture),tex:new m(p)};return y(()=>{r.compute()}),e.jsx("points",{geometry:n,children:e.jsx(L,{uniforms:i,baseMaterial:V,vertexShader:I,fragmentShader:R,transparent:!0,depthWrite:!1,blending:P,size:.2})})}function H(){const o=E(O(1e4));return e.jsx(x,{value:{count:1e4,size:o},children:e.jsx(W,{})})}const pe=F(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(w,{children:[e.jsx(U,{}),e.jsx(c.Suspense,{fallback:null,children:e.jsx(H,{})}),e.jsx(z,{children:e.jsx(A,{})})]}),e.jsx(_,{})]})});export{pe as default};
