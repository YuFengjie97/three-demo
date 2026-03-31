import{r as i,w as h,o as e}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as T,u as w,b as F}from"./extends-Duj4sZJC.js";import{j}from"./three-custom-shader-material.es-CZ14K5mc.js";import{u as z}from"./useUniformTime-CmNZpKap.js";import{u as V}from"./leva.esm-BV3Tl-wj.js";import{d as P,w as G}from"./index-CteE7iEh.js";import{a as L}from"./asset-BvcpElq9.js";import{O as S}from"./OrbitControls-D93bPuip.js";import{L as A}from"./Loader-CXlLoU35.js";import{u as B}from"./Texture-Dpb5tcRz.js";import{B as U,e as y,U as m,A as _,d as D}from"./three.module-DHYYXIKh.js";import{G as M}from"./GPUComputationRenderer-DCDPiFpg.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-D9Mt5r6T.js";import"./index-D369hMBv.js";import"./client-EdRjCdko.js";import"./index-n5PR1bfd.js";const I=`#define GLSLIFY 1
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

vec3 getVel2(vec3 p){
  // 输入 p 是当前位置，返回速度向量 v
  float a = 1.4;
  vec3 v;
  v.x = -a * p.x - 4.0 * p.y - 4.0 * p.z - (p.y * p.y);
  v.y = -a * p.y - 4.0 * p.z - 4.0 * p.x - (p.z * p.z);
  v.z = -a * p.z - 4.0 * p.x - 4.0 * p.y - (p.x * p.x);
  // 这是一个循环结构，可以用 swizzle 简化写法吗？
  // 可以尝试： v = -a * p - 4.0 * p.yzx - 4.0 * p.zxy - p.yzx * p.yzx;
  return v;
}

vec3 getVel3(vec3 p){
  float a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
  vec3 v;
  v.x = (p.z - b) * p.x - d * p.y;
  v.y = d * p.x + (p.z - b) * p.y;
  v.z = c + a * p.z - (p.z * p.z * p.z) / 3.0 - (p.x * p.x + p.y * p.y) * (1.0 + e * p.z) + f * p.z * p.x * p.x * p.x;
  return v;
}

vec3 getVel4(vec3 p){
  float sigma = 10.0;
  float rho = 28.0;
  float beta = 8.0 / 3.0;
  vec3 v;
  v.x = sigma * (p.y - p.x);
  v.y = p.x * (rho - p.z) - p.y;
  v.z = p.x * p.y - beta * p.z;
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(posTex, uv);
  vec3 pos = particle.xyz;
  float seed = particle.w;

  vec3 vel = getVel(pos, seed);
  // vec3 vel = getVel4(pos)*.1;

  pos += vel * uDelta * speed;

  gl_FragColor = vec4(pos, seed);
}`,f=i.createContext({count:0,size:1}),{ceil:E,sqrt:O,random:u,floor:k}=Math;function q(t,o){const a=t.image.data;for(let n=0;n<o*o;n++){const r=n*4;a[r+0]=(u()-.5)*10,a[r+1]=(u()-.5)*10,a[r+2]=(u()-.5)*10,a[r+3]=u()*.3+.001}}function N(){const{size:t}=i.useContext(f),{gl:o}=F(),a=z(),{gpu:n,posVar:r}=i.useMemo(()=>{const s=new M(t,t,o),l=s.createTexture();q(l,t);const p=s.addVariable("posTex",Y,l);return s.setVariableDependencies(p,[p]),p.material.uniforms={...a,speed:new m(2.5),bFactor:new m(.208186)},s.init(),{posVar:p,gpu:s}},[]);return V({speed:{value:2.5,min:.1,max:20,step:.01,onChange(s){r.material.uniforms.speed.value=s}}}),{gpu:n,posVar:r}}function W(){const{count:t,size:o}=i.useContext(f),{geo:a}=i.useMemo(()=>{const x=new U,C=new Float32Array(t*3);x.setAttribute("position",new y(C,3));const v=new Float32Array(t*2);for(let c=0;c<t;c++){const d=k(c/o),b=c-d*o,g=c*2;v[g+0]=(b+.5)/o,v[g+1]=(d+.5)/o}return x.setAttribute("pCoord",new y(v,2)),{geo:x}},[t]),{posVar:n,gpu:r}=N(),s=z(),l=B(L("/img/texture/particle/star_09.png")),p={...s,posTex:new m(r.getCurrentRenderTarget(n).texture),tex:new m(l)};return w(()=>{r.compute()}),e.jsx("points",{geometry:a,children:e.jsx(j,{uniforms:p,baseMaterial:D,vertexShader:I,fragmentShader:R,transparent:!0,depthWrite:!1,blending:_,size:.2})})}function H(){const o=E(O(1e4));return e.jsx(f,{value:{count:1e4,size:o},children:e.jsx(W,{})})}const ue=h(function(){return e.jsxs("div",{className:"h-screen",children:[e.jsxs(T,{children:[e.jsx(S,{}),e.jsx(i.Suspense,{fallback:null,children:e.jsx(H,{})}),e.jsx(P,{children:e.jsx(G,{})})]}),e.jsx(A,{})]})});export{ue as default};
