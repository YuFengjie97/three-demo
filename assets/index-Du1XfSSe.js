import{r as n,w as Ce,o as i}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{e as Ee,u as Te,V as z,_ as We,d as se,a8 as Fe,a9 as ie,v as ae,U as H,c as re,C as Oe,a as Re,$ as Ne,aa as $e,ab as Le,M as He}from"./extends-C6mqsnfH.js";import{a as ze}from"./asset-BvcpElq9.js";import{j as Ve}from"./three-custom-shader-material.es-DIS13SvM.js";import{u as ke}from"./useUniformTime-Hj_6JLNV.js";import{P as De}from"./Perf-pV0oEsqA.js";import{u as Ae}from"./leva.esm-BV3Tl-wj.js";import{O as Ie}from"./OrbitControls-CkNlQSt9.js";import{C as Ue}from"./Center-nFE0DCZ6.js";import{L as _e}from"./Loader-D3JilbM8.js";import{c as Ge}from"./client-EdRjCdko.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-C02T_XZi.js";import"./index-n5PR1bfd.js";import"./troika-three-text.esm-OzryngKU.js";import"./index-D369hMBv.js";const F=new z,U=new z,Be=new z,oe=new Fe;function Ze(e,t,r){const o=F.setFromMatrixPosition(e.matrixWorld);o.project(t);const s=r.width/2,a=r.height/2;return[o.x*s+s,-(o.y*a)+a]}function Ye(e,t){const r=F.setFromMatrixPosition(e.matrixWorld),o=U.setFromMatrixPosition(t.matrixWorld),s=r.sub(o),a=t.getWorldDirection(Be);return s.angleTo(a)>Math.PI/2}function Je(e,t,r,o){const s=F.setFromMatrixPosition(e.matrixWorld),a=s.clone();a.project(t),oe.set(a.x,a.y),r.setFromCamera(oe,t);const x=r.intersectObjects(o,!0);if(x.length){const S=x[0].distance;return s.distanceTo(r.ray.origin)<S}return!0}function qe(e,t){if(t instanceof ae)return t.zoom;if(t instanceof ie){const r=F.setFromMatrixPosition(e.matrixWorld),o=U.setFromMatrixPosition(t.matrixWorld),s=t.fov*Math.PI/180,a=r.distanceTo(o);return 1/(2*Math.tan(s/2)*a)}else return 1}function Ke(e,t,r){if(t instanceof ie||t instanceof ae){const o=F.setFromMatrixPosition(e.matrixWorld),s=U.setFromMatrixPosition(t.matrixWorld),a=o.distanceTo(s),x=(r[1]-r[0])/(t.far-t.near),S=r[1]-x*t.far;return Math.round(x*a+S)}}const I=e=>Math.abs(e)<1e-10?0:e;function le(e,t,r=""){let o="matrix3d(";for(let s=0;s!==16;s++)o+=I(t[s]*e.elements[s])+(s!==15?",":")");return r+o}const Qe=(e=>t=>le(t,e))([1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1]),Xe=(e=>(t,r)=>le(t,e(r),"translate(-50%,-50%)"))(e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1]);function et(e){return e&&typeof e=="object"&&"current"in e}const tt=n.forwardRef(({children:e,eps:t=.001,style:r,className:o,prepend:s,center:a,fullscreen:x,portal:S,distanceFactor:E,sprite:ue=!1,transform:v=!1,occlude:c,onOcclude:_,castShadow:me,receiveShadow:de,material:fe,geometry:G,zIndexRange:O=[16777271,0],calculatePosition:B=Ze,as:he="div",wrapperClass:V,pointerEvents:Z="auto",...p},Y)=>{const{gl:J,camera:u,scene:q,size:d,raycaster:xe,events:ve,viewport:pe}=Ee(),[m]=n.useState(()=>document.createElement(he)),k=n.useRef(null),h=n.useRef(null),K=n.useRef(0),R=n.useRef([0,0]),T=n.useRef(null),D=n.useRef(null),w=S?.current||ve.connected||J.domElement.parentNode,y=n.useRef(null),N=n.useRef(!1),$=n.useMemo(()=>c&&c!=="blending"||Array.isArray(c)&&c.length&&et(c[0]),[c]);n.useLayoutEffect(()=>{const f=J.domElement;c&&c==="blending"?(f.style.zIndex=`${Math.floor(O[0]/2)}`,f.style.position="absolute",f.style.pointerEvents="none"):(f.style.zIndex=null,f.style.position=null,f.style.pointerEvents=null)},[c]),n.useLayoutEffect(()=>{if(h.current){const f=k.current=Ge.createRoot(m);if(q.updateMatrixWorld(),v)m.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{const l=B(h.current,u,d);m.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${l[0]}px,${l[1]}px,0);transform-origin:0 0;`}return w&&(s?w.prepend(m):w.appendChild(m)),()=>{w&&w.removeChild(m),f.unmount()}}},[w,v]),n.useLayoutEffect(()=>{V&&(m.className=V)},[V]);const Q=n.useMemo(()=>v?{position:"absolute",top:0,left:0,width:d.width,height:d.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:a?"translate3d(-50%,-50%,0)":"none",...x&&{top:-d.height/2,left:-d.width/2,width:d.width,height:d.height},...r},[r,a,x,d,v]),ge=n.useMemo(()=>({position:"absolute",pointerEvents:Z}),[Z]);n.useLayoutEffect(()=>{if(N.current=!1,v){var f;(f=k.current)==null||f.render(n.createElement("div",{ref:T,style:Q},n.createElement("div",{ref:D,style:ge},n.createElement("div",{ref:Y,className:o,style:r,children:e}))))}else{var l;(l=k.current)==null||l.render(n.createElement("div",{ref:Y,style:Q,className:o,children:e}))}});const C=n.useRef(!0);Te(f=>{if(h.current){u.updateMatrixWorld(),h.current.updateWorldMatrix(!0,!1);const l=v?R.current:B(h.current,u,d);if(v||Math.abs(K.current-u.zoom)>t||Math.abs(R.current[0]-l[0])>t||Math.abs(R.current[1]-l[1])>t){const b=Ye(h.current,u);let g=!1;$&&(Array.isArray(c)?g=c.map(M=>M.current):c!=="blending"&&(g=[q]));const W=C.current;if(g){const M=Je(h.current,u,xe,g);C.current=M&&!b}else C.current=!b;W!==C.current&&(_?_(!C.current):m.style.display=C.current?"block":"none");const L=Math.floor(O[0]/2),ye=c?$?[O[0],L]:[L-1,0]:O;if(m.style.zIndex=`${Ke(h.current,u,ye)}`,v){const[M,ee]=[d.width/2,d.height/2],A=u.projectionMatrix.elements[5]*ee,{isOrthographicCamera:te,top:be,left:Me,bottom:Pe,right:je}=u,Se=Qe(u.matrixWorldInverse),we=te?`scale(${A})translate(${I(-(je+Me)/2)}px,${I((be+Pe)/2)}px)`:`translateZ(${A}px)`;let P=h.current.matrixWorld;ue&&(P=u.matrixWorldInverse.clone().transpose().copyPosition(P).scale(h.current.scale),P.elements[3]=P.elements[7]=P.elements[11]=0,P.elements[15]=1),m.style.width=d.width+"px",m.style.height=d.height+"px",m.style.perspective=te?"":`${A}px`,T.current&&D.current&&(T.current.style.transform=`${we}${Se}translate(${M}px,${ee}px)`,D.current.style.transform=Xe(P,1/((E||10)/400)))}else{const M=E===void 0?1:qe(h.current,u)*E;m.style.transform=`translate3d(${l[0]}px,${l[1]}px,0) scale(${M})`}R.current=l,K.current=u.zoom}}if(!$&&y.current&&!N.current)if(v){if(T.current){const l=T.current.children[0];if(l!=null&&l.clientWidth&&l!=null&&l.clientHeight){const{isOrthographicCamera:b}=u;if(b||G)p.scale&&(Array.isArray(p.scale)?p.scale instanceof z?y.current.scale.copy(p.scale.clone().divideScalar(1)):y.current.scale.set(1/p.scale[0],1/p.scale[1],1/p.scale[2]):y.current.scale.setScalar(1/p.scale));else{const g=(E||10)/400,W=l.clientWidth*g,L=l.clientHeight*g;y.current.scale.set(W,L,1)}N.current=!0}}}else{const l=m.children[0];if(l!=null&&l.clientWidth&&l!=null&&l.clientHeight){const b=1/pe.factor,g=l.clientWidth*b,W=l.clientHeight*b;y.current.scale.set(g,W,1),N.current=!0}y.current.lookAt(f.camera.position)}});const X=n.useMemo(()=>({vertexShader:v?void 0:`
          /*
            This shader is from the THREE's SpriteMaterial.
            We need to turn the backing plane into a Sprite
            (make it always face the camera) if "transfrom"
            is false.
          */
          #include <common>

          void main() {
            vec2 center = vec2(0., 1.);
            float rotation = 0.0;

            // This is somewhat arbitrary, but it seems to work well
            // Need to figure out how to derive this dynamically if it even matters
            float size = 0.03;

            vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
            vec2 scale;
            scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
            scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if ( isPerspective ) scale *= - mvPosition.z;

            vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
            vec2 rotatedPosition;
            rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
            rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;

            gl_Position = projectionMatrix * mvPosition;
          }
      `,fragmentShader:`
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
        }
      `}),[v]);return n.createElement("group",We({},p,{ref:h}),c&&!$&&n.createElement("mesh",{castShadow:me,receiveShadow:de,ref:y},G||n.createElement("planeGeometry",null),fe||n.createElement("shaderMaterial",{side:se,vertexShader:X.vertexShader,fragmentShader:X.fragmentShader})))}),rt=`#define GLSLIFY 1

varying vec2 vUv;
varying vec3 vNormal2;

void main(){
  vUv = uv;
  vNormal2 = csm_Normal;
}`,ot=`#define GLSLIFY 1
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uSideColor;

varying vec2 vUv;
varying vec3 vNormal2;

void main(){
  float t = uTime;

  float d = vUv.y;
  d = sin(d*1.+t*2.);
  d = pow(.2/abs(d), 2.);

  float side = 1.-abs(vNormal2.z);

  d *= side;

  vec3 col = uColor;
  
  col += d * uSideColor;

  csm_FragColor.rgb = col;
  csm_FragColor.a = .8;
}`,j={uColor:new H(new re(7649791)),uSideColor:new H(new re(16058890)),uTime:new H(0),uDelta:new H(0)};function ce({coords:e,children:t}){const r=n.useMemo(()=>{const o=new $e;o.moveTo(...e[0]);for(let a=1;a<e.length;a++)o.lineTo(...e[a]);const s=new Le(o,{bevelSize:0,bevelThickness:0,bevelSegments:0});return s.computeVertexNormals(),s},[e]);return i.jsxs("mesh",{geometry:r,children:[i.jsx(Ve,{baseMaterial:He,uniforms:j,side:se,vertexShader:rt,fragmentShader:ot,depthWrite:!1,transparent:!0,alphaTest:.01}),t]})}function nt({coordss:e,children:t}){return i.jsxs("group",{children:[e.map((r,o)=>i.jsx(ce,{coords:r},o)),t]})}function ne({feature:e}){const{properties:{center:t,name:r}}=e;return t?i.jsx(tt,{position:[...t??[0,0],0],center:!0,distanceFactor:5,children:i.jsxs("div",{className:"relative cursor-pointer -translate-y-4",children:[i.jsx("div",{className:`inline-block whitespace-nowrap rounded-2xl\r
        bg-gray-900 text-l text-gray-200 px-3 py-1.5 select-none`,children:r??""}),i.jsx("div",{className:`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-5\r
        border-10 border-transparent border-t-gray-900`})]})}):null}function st({feature:e}){const{geometry:{type:t,coordinates:r}}=e;if(t==="Polygon"){const o=r[0];return i.jsx(ce,{coords:o,children:i.jsx(ne,{feature:e})})}else if(t==="MultiPolygon"){const o=r.map(s=>s[0]);return i.jsx(nt,{coordss:o,children:i.jsx(ne,{feature:e})})}else return null}function it(){const e=Re(Ne,ze("/data/china.json")),t=typeof e=="string"?JSON.parse(e):e,r=t.features.slice(0,34);t.properties.center,console.log(t.features);const{uTime:o,uDelta:s}=ke();return j.uTime=o,j.uDelta=s,Ae({color:{value:"#"+j.uColor.value.getHexString(),onChange:a=>{j.uColor.value.set(a)}},sideColor:{value:"#"+j.uSideColor.value.getHexString(),onChange:a=>{j.uSideColor.value.set(a)}}}),console.log("render"),i.jsx("group",{scale:.2,children:r.map((a,x)=>i.jsx(st,{feature:a},x))})}const jt=Ce(function(){return i.jsxs("div",{className:"h-screen",children:[i.jsxs(Oe,{children:[i.jsx("color",{attach:"background",args:["#191920"]}),i.jsx("fog",{attach:"fog",args:["#191920",.1,20]}),i.jsx(De,{position:"top-left"}),i.jsx(Ie,{}),i.jsx("ambientLight",{}),i.jsx("directionalLight",{position:[0,0,3]}),i.jsx(n.Suspense,{fallback:null,children:i.jsx(Ue,{children:i.jsx(it,{})})})]}),i.jsx(_e,{})]})});export{jt as default};
