import{r as o,w as Ce,o as l}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{e as Ee,u as Te,V as z,_ as We,d as se,a8 as Fe,a9 as ie,v as ae,U as H,c as re,C as Oe,a as Re,$ as Ne,aa as $e,ab as Le,M as He}from"./extends-D4P9RtWV.js";import{a as ze}from"./asset-BvcpElq9.js";import{j as Ve}from"./three-custom-shader-material.es-CZEjquAF.js";import{u as ke}from"./useUniformTime-CJanb7xe.js";import{u as De}from"./leva.esm-BV3Tl-wj.js";import{O as Ae}from"./OrbitControls-B0FQFszE.js";import{C as Ie}from"./Center-Kkdqflyh.js";import{L as Ue}from"./Loader-C5B-FrZC.js";import{c as _e}from"./client-EdRjCdko.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-B7Ao4tUH.js";import"./index-D369hMBv.js";import"./index-n5PR1bfd.js";const F=new z,U=new z,Ge=new z,ne=new Fe;function Be(e,t,r){const n=F.setFromMatrixPosition(e.matrixWorld);n.project(t);const s=r.width/2,i=r.height/2;return[n.x*s+s,-(n.y*i)+i]}function Ze(e,t){const r=F.setFromMatrixPosition(e.matrixWorld),n=U.setFromMatrixPosition(t.matrixWorld),s=r.sub(n),i=t.getWorldDirection(Ge);return s.angleTo(i)>Math.PI/2}function Ye(e,t,r,n){const s=F.setFromMatrixPosition(e.matrixWorld),i=s.clone();i.project(t),ne.set(i.x,i.y),r.setFromCamera(ne,t);const x=r.intersectObjects(n,!0);if(x.length){const S=x[0].distance;return s.distanceTo(r.ray.origin)<S}return!0}function Je(e,t){if(t instanceof ae)return t.zoom;if(t instanceof ie){const r=F.setFromMatrixPosition(e.matrixWorld),n=U.setFromMatrixPosition(t.matrixWorld),s=t.fov*Math.PI/180,i=r.distanceTo(n);return 1/(2*Math.tan(s/2)*i)}else return 1}function qe(e,t,r){if(t instanceof ie||t instanceof ae){const n=F.setFromMatrixPosition(e.matrixWorld),s=U.setFromMatrixPosition(t.matrixWorld),i=n.distanceTo(s),x=(r[1]-r[0])/(t.far-t.near),S=r[1]-x*t.far;return Math.round(x*i+S)}}const I=e=>Math.abs(e)<1e-10?0:e;function le(e,t,r=""){let n="matrix3d(";for(let s=0;s!==16;s++)n+=I(t[s]*e.elements[s])+(s!==15?",":")");return r+n}const Ke=(e=>t=>le(t,e))([1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1]),Qe=(e=>(t,r)=>le(t,e(r),"translate(-50%,-50%)"))(e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1]);function Xe(e){return e&&typeof e=="object"&&"current"in e}const et=o.forwardRef(({children:e,eps:t=.001,style:r,className:n,prepend:s,center:i,fullscreen:x,portal:S,distanceFactor:E,sprite:ue=!1,transform:v=!1,occlude:c,onOcclude:_,castShadow:de,receiveShadow:me,material:fe,geometry:G,zIndexRange:O=[16777271,0],calculatePosition:B=Be,as:he="div",wrapperClass:V,pointerEvents:Z="auto",...p},Y)=>{const{gl:J,camera:u,scene:q,size:m,raycaster:xe,events:ve,viewport:pe}=Ee(),[d]=o.useState(()=>document.createElement(he)),k=o.useRef(null),h=o.useRef(null),K=o.useRef(0),R=o.useRef([0,0]),T=o.useRef(null),D=o.useRef(null),w=S?.current||ve.connected||J.domElement.parentNode,y=o.useRef(null),N=o.useRef(!1),$=o.useMemo(()=>c&&c!=="blending"||Array.isArray(c)&&c.length&&Xe(c[0]),[c]);o.useLayoutEffect(()=>{const f=J.domElement;c&&c==="blending"?(f.style.zIndex=`${Math.floor(O[0]/2)}`,f.style.position="absolute",f.style.pointerEvents="none"):(f.style.zIndex=null,f.style.position=null,f.style.pointerEvents=null)},[c]),o.useLayoutEffect(()=>{if(h.current){const f=k.current=_e.createRoot(d);if(q.updateMatrixWorld(),v)d.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{const a=B(h.current,u,m);d.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${a[0]}px,${a[1]}px,0);transform-origin:0 0;`}return w&&(s?w.prepend(d):w.appendChild(d)),()=>{w&&w.removeChild(d),f.unmount()}}},[w,v]),o.useLayoutEffect(()=>{V&&(d.className=V)},[V]);const Q=o.useMemo(()=>v?{position:"absolute",top:0,left:0,width:m.width,height:m.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:i?"translate3d(-50%,-50%,0)":"none",...x&&{top:-m.height/2,left:-m.width/2,width:m.width,height:m.height},...r},[r,i,x,m,v]),ge=o.useMemo(()=>({position:"absolute",pointerEvents:Z}),[Z]);o.useLayoutEffect(()=>{if(N.current=!1,v){var f;(f=k.current)==null||f.render(o.createElement("div",{ref:T,style:Q},o.createElement("div",{ref:D,style:ge},o.createElement("div",{ref:Y,className:n,style:r,children:e}))))}else{var a;(a=k.current)==null||a.render(o.createElement("div",{ref:Y,style:Q,className:n,children:e}))}});const C=o.useRef(!0);Te(f=>{if(h.current){u.updateMatrixWorld(),h.current.updateWorldMatrix(!0,!1);const a=v?R.current:B(h.current,u,m);if(v||Math.abs(K.current-u.zoom)>t||Math.abs(R.current[0]-a[0])>t||Math.abs(R.current[1]-a[1])>t){const b=Ze(h.current,u);let g=!1;$&&(Array.isArray(c)?g=c.map(M=>M.current):c!=="blending"&&(g=[q]));const W=C.current;if(g){const M=Ye(h.current,u,xe,g);C.current=M&&!b}else C.current=!b;W!==C.current&&(_?_(!C.current):d.style.display=C.current?"block":"none");const L=Math.floor(O[0]/2),ye=c?$?[O[0],L]:[L-1,0]:O;if(d.style.zIndex=`${qe(h.current,u,ye)}`,v){const[M,ee]=[m.width/2,m.height/2],A=u.projectionMatrix.elements[5]*ee,{isOrthographicCamera:te,top:be,left:Me,bottom:je,right:Pe}=u,Se=Ke(u.matrixWorldInverse),we=te?`scale(${A})translate(${I(-(Pe+Me)/2)}px,${I((be+je)/2)}px)`:`translateZ(${A}px)`;let j=h.current.matrixWorld;ue&&(j=u.matrixWorldInverse.clone().transpose().copyPosition(j).scale(h.current.scale),j.elements[3]=j.elements[7]=j.elements[11]=0,j.elements[15]=1),d.style.width=m.width+"px",d.style.height=m.height+"px",d.style.perspective=te?"":`${A}px`,T.current&&D.current&&(T.current.style.transform=`${we}${Se}translate(${M}px,${ee}px)`,D.current.style.transform=Qe(j,1/((E||10)/400)))}else{const M=E===void 0?1:Je(h.current,u)*E;d.style.transform=`translate3d(${a[0]}px,${a[1]}px,0) scale(${M})`}R.current=a,K.current=u.zoom}}if(!$&&y.current&&!N.current)if(v){if(T.current){const a=T.current.children[0];if(a!=null&&a.clientWidth&&a!=null&&a.clientHeight){const{isOrthographicCamera:b}=u;if(b||G)p.scale&&(Array.isArray(p.scale)?p.scale instanceof z?y.current.scale.copy(p.scale.clone().divideScalar(1)):y.current.scale.set(1/p.scale[0],1/p.scale[1],1/p.scale[2]):y.current.scale.setScalar(1/p.scale));else{const g=(E||10)/400,W=a.clientWidth*g,L=a.clientHeight*g;y.current.scale.set(W,L,1)}N.current=!0}}}else{const a=d.children[0];if(a!=null&&a.clientWidth&&a!=null&&a.clientHeight){const b=1/pe.factor,g=a.clientWidth*b,W=a.clientHeight*b;y.current.scale.set(g,W,1),N.current=!0}y.current.lookAt(f.camera.position)}});const X=o.useMemo(()=>({vertexShader:v?void 0:`
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
      `}),[v]);return o.createElement("group",We({},p,{ref:h}),c&&!$&&o.createElement("mesh",{castShadow:de,receiveShadow:me,ref:y},G||o.createElement("planeGeometry",null),fe||o.createElement("shaderMaterial",{side:se,vertexShader:X.vertexShader,fragmentShader:X.fragmentShader})))}),tt=`#define GLSLIFY 1

varying vec2 vUv;
varying vec3 vNormal2;

void main(){
  vUv = uv;
  vNormal2 = csm_Normal;
}`,rt=`#define GLSLIFY 1
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
}`,P={uColor:new H(new re(7649791)),uSideColor:new H(new re(16058890)),uTime:new H(0),uDelta:new H(0)};function ce({coords:e,children:t}){const r=o.useMemo(()=>{const n=new $e;n.moveTo(...e[0]);for(let i=1;i<e.length;i++)n.lineTo(...e[i]);const s=new Le(n,{bevelSize:0,bevelThickness:0,bevelSegments:0});return s.computeVertexNormals(),s},[e]);return l.jsxs("mesh",{geometry:r,children:[l.jsx(Ve,{baseMaterial:He,uniforms:P,side:se,vertexShader:tt,fragmentShader:rt,depthWrite:!1,transparent:!0,alphaTest:.01}),t]})}function nt({coordss:e,children:t}){return l.jsxs("group",{children:[e.map((r,n)=>l.jsx(ce,{coords:r},n)),t]})}function oe({feature:e}){const{properties:{center:t,name:r}}=e;return t?l.jsx(et,{position:[...t??[0,0],0],center:!0,distanceFactor:5,children:l.jsxs("div",{className:"relative cursor-pointer -translate-y-4",children:[l.jsx("div",{className:`inline-block whitespace-nowrap rounded-2xl\r
        bg-gray-900 text-l text-gray-200 px-3 py-1.5 select-none`,children:r??""}),l.jsx("div",{className:`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-5\r
        border-10 border-transparent border-t-gray-900`})]})}):null}function ot({feature:e}){const{geometry:{type:t,coordinates:r}}=e;if(t==="Polygon"){const n=r[0];return l.jsx(ce,{coords:n,children:l.jsx(oe,{feature:e})})}else if(t==="MultiPolygon"){const n=r.map(s=>s[0]);return l.jsx(nt,{coordss:n,children:l.jsx(oe,{feature:e})})}else return null}function st(){const e=Re(Ne,ze("/data/china.json")),t=typeof e=="string"?JSON.parse(e):e,r=t.features.slice(0,34);t.properties.center,console.log(t.features);const{uTime:n,uDelta:s}=ke();return P.uTime=n,P.uDelta=s,De({color:{value:"#"+P.uColor.value.getHexString(),onChange:i=>{P.uColor.value.set(i)}},sideColor:{value:"#"+P.uSideColor.value.getHexString(),onChange:i=>{P.uSideColor.value.set(i)}}}),console.log("render"),l.jsx("group",{scale:.2,children:r.map((i,x)=>l.jsx(ot,{feature:i},x))})}const bt=Ce(function(){return l.jsxs("div",{className:"h-screen",children:[l.jsxs(Oe,{children:[l.jsx("color",{attach:"background",args:["#191920"]}),l.jsx("fog",{attach:"fog",args:["#191920",.1,20]}),l.jsx(Ae,{}),l.jsx("ambientLight",{}),l.jsx("directionalLight",{position:[0,0,3]}),l.jsx(o.Suspense,{fallback:null,children:l.jsx(Ie,{children:l.jsx(st,{})})})]}),l.jsx(Ue,{})]})});export{bt as default};
