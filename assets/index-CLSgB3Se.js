import{w as v,o as e,r as m}from"./chunk-EPOLDU6W-B0aIzJ9t.js";import{G as d,K as x,y as u,s as h,a0 as c,$ as C,Q as g,M as j,Y as F}from"./OrbitControls-BeN5Vx9q.js";import{G as S}from"./GLTFLoader-JHs-fVjZ.js";import{j as L}from"./three-custom-shader-material.es-BdQd3_SU.js";import{u as f}from"./leva.esm-rd6fLeBd.js";import{u as w}from"./Helper-CMDd7UMI.js";import"./index-7OC5HNn7.js";import"./BufferGeometryUtils-DPZxlksj.js";import"./index-XD7JBPcQ.js";import"./client-Cu2R2QOy.js";import"./index-C_sia4Et.js";const M=`#define GLSLIFY 1
uniform float uTime;
varying vec3 vCol;

void main(){
  vec3 p = csm_Position;

  // p += dot(cos(p*2. + uTime), vec3(2.1))*.1;
  // csm_Position = p;

  vCol = sin(vec3(3,2,1) + uTime * 2. + dot(p, vec3(2.))) * .5 + .5;
}
`,T=`#define GLSLIFY 1
uniform float uUseFSCol;

varying vec3 vCol;

void main(){

  if(uUseFSCol > .5) {
    csm_DiffuseColor = vec4(vCol,1);
  }
}`,p=new c(0),U=new c(0);function y(){const s=h(S,"/model/skull_downloadable/scene.gltf"),t={uTime:p,uUseFSCol:new c(1)},{metalness:o,roughness:l,color:r,useFSCol:i}=f({metalness:{value:0,min:0,max:1},roughness:{value:0,min:0,max:1},useFSCol:{value:t.uUseFSCol.value>.5},color:{value:"#ffff00",render:a=>!a("useFSCol")}}),n=m.useMemo(()=>new L({baseMaterial:g,uniforms:t,vertexShader:M,fragmentShader:T,metalness:o,roughness:l,color:new C(r)}),[]);return m.useEffect(()=>{s.scene.traverse(a=>{a instanceof j&&(a.material=n)})},[]),m.useEffect(()=>{n.metalness=o,n.roughness=l,n.color.set(r),n.uniforms.uUseFSCol.value=i?1:0},[o,l,r,i,n]),e.jsx(e.Fragment,{children:e.jsx("primitive",{object:s.scene})})}function E(){const s=m.useRef(null);w(s,F,1),u((o,l)=>{const{clock:r}=o,i=r.getElapsedTime();s.current.position.x=Math.cos(i)*2,s.current.position.z=Math.sin(i)*2});const{intensity:t}=f({intensity:{value:1,min:0,max:40}});return e.jsx("directionalLight",{ref:s,position:[2,1,2],intensity:t})}function G(){return u((s,t)=>{const{clock:o}=s;p.value=o.getElapsedTime(),U.value=t}),null}const N=v(function(){return e.jsx("div",{className:"h-screen",children:e.jsxs(d,{children:[e.jsx(G,{}),e.jsx("axesHelper",{args:[10]}),e.jsx(x,{}),e.jsx("ambientLight",{}),e.jsx(E,{}),e.jsx(y,{})]})})});export{N as default};
