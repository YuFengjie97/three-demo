import{r as n,w as we,o as s}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{b as Ee,u as Te,_ as We,C as Fe,a as Oe}from"./extends-CQKH8FHF.js";import{a as Re}from"./asset-BvcpElq9.js";import{j as Ne}from"./three-custom-shader-material.es-3-1qXxK2.js";import{u as Le}from"./useUniformTime-p2f39nCE.js";import{u as $e}from"./leva.esm-CD9oxMAJ.js";import{d as He,w as ze}from"./index-DPw2RNN1.js";import{O as Ve}from"./OrbitControls-Df7v6KnC.js";import{C as ke}from"./Center-COKk-WsK.js";import{L as De}from"./Loader-DtNERok4.js";import{c as Ae}from"./client-EdRjCdko.js";import{V as z,b as se,a0 as Ie,a1 as ie,r as ae,U as H,C as re,Q as Ue,a2 as _e,a3 as Be,c as Ge}from"./three.module-CqEfS7dP.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-ClleyNLK.js";import"./index-D369hMBv.js";import"./index-n5PR1bfd.js";const F=new z,U=new z,Ze=new z,oe=new Ie;function Ye(e,t,r){const o=F.setFromMatrixPosition(e.matrixWorld);o.project(t);const i=r.width/2,a=r.height/2;return[o.x*i+i,-(o.y*a)+a]}function Je(e,t){const r=F.setFromMatrixPosition(e.matrixWorld),o=U.setFromMatrixPosition(t.matrixWorld),i=r.sub(o),a=t.getWorldDirection(Ze);return i.angleTo(a)>Math.PI/2}function Qe(e,t,r,o){const i=F.setFromMatrixPosition(e.matrixWorld),a=i.clone();a.project(t),oe.set(a.x,a.y),r.setFromCamera(oe,t);const x=r.intersectObjects(o,!0);if(x.length){const S=x[0].distance;return i.distanceTo(r.ray.origin)<S}return!0}function qe(e,t){if(t instanceof ae)return t.zoom;if(t instanceof ie){const r=F.setFromMatrixPosition(e.matrixWorld),o=U.setFromMatrixPosition(t.matrixWorld),i=t.fov*Math.PI/180,a=r.distanceTo(o);return 1/(2*Math.tan(i/2)*a)}else return 1}function Ke(e,t,r){if(t instanceof ie||t instanceof ae){const o=F.setFromMatrixPosition(e.matrixWorld),i=U.setFromMatrixPosition(t.matrixWorld),a=o.distanceTo(i),x=(r[1]-r[0])/(t.far-t.near),S=r[1]-x*t.far;return Math.round(x*a+S)}}const I=e=>Math.abs(e)<1e-10?0:e;function le(e,t,r=""){let o="matrix3d(";for(let i=0;i!==16;i++)o+=I(t[i]*e.elements[i])+(i!==15?",":")");return r+o}const Xe=(e=>t=>le(t,e))([1,-1,1,1,1,-1,1,1,1,-1,1,1,1,-1,1,1]),et=(e=>(t,r)=>le(t,e(r),"translate(-50%,-50%)"))(e=>[1/e,1/e,1/e,1,-1/e,-1/e,-1/e,-1,1/e,1/e,1/e,1,1,1,1,1]);function tt(e){return e&&typeof e=="object"&&"current"in e}const rt=n.forwardRef(({children:e,eps:t=.001,style:r,className:o,prepend:i,center:a,fullscreen:x,portal:S,distanceFactor:E,sprite:ue=!1,transform:v=!1,occlude:c,onOcclude:_,castShadow:me,receiveShadow:de,material:fe,geometry:B,zIndexRange:O=[16777271,0],calculatePosition:G=Ye,as:he="div",wrapperClass:V,pointerEvents:Z="auto",...p},Y)=>{const{gl:J,camera:u,scene:Q,size:d,raycaster:xe,events:ve,viewport:pe}=Ee(),[m]=n.useState(()=>document.createElement(he)),k=n.useRef(null),h=n.useRef(null),q=n.useRef(0),R=n.useRef([0,0]),T=n.useRef(null),D=n.useRef(null),C=S?.current||ve.connected||J.domElement.parentNode,y=n.useRef(null),N=n.useRef(!1),L=n.useMemo(()=>c&&c!=="blending"||Array.isArray(c)&&c.length&&tt(c[0]),[c]);n.useLayoutEffect(()=>{const f=J.domElement;c&&c==="blending"?(f.style.zIndex=`${Math.floor(O[0]/2)}`,f.style.position="absolute",f.style.pointerEvents="none"):(f.style.zIndex=null,f.style.position=null,f.style.pointerEvents=null)},[c]),n.useLayoutEffect(()=>{if(h.current){const f=k.current=Ae.createRoot(m);if(Q.updateMatrixWorld(),v)m.style.cssText="position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";else{const l=G(h.current,u,d);m.style.cssText=`position:absolute;top:0;left:0;transform:translate3d(${l[0]}px,${l[1]}px,0);transform-origin:0 0;`}return C&&(i?C.prepend(m):C.appendChild(m)),()=>{C&&C.removeChild(m),f.unmount()}}},[C,v]),n.useLayoutEffect(()=>{V&&(m.className=V)},[V]);const K=n.useMemo(()=>v?{position:"absolute",top:0,left:0,width:d.width,height:d.height,transformStyle:"preserve-3d",pointerEvents:"none"}:{position:"absolute",transform:a?"translate3d(-50%,-50%,0)":"none",...x&&{top:-d.height/2,left:-d.width/2,width:d.width,height:d.height},...r},[r,a,x,d,v]),ge=n.useMemo(()=>({position:"absolute",pointerEvents:Z}),[Z]);n.useLayoutEffect(()=>{if(N.current=!1,v){var f;(f=k.current)==null||f.render(n.createElement("div",{ref:T,style:K},n.createElement("div",{ref:D,style:ge},n.createElement("div",{ref:Y,className:o,style:r,children:e}))))}else{var l;(l=k.current)==null||l.render(n.createElement("div",{ref:Y,style:K,className:o,children:e}))}});const w=n.useRef(!0);Te(f=>{if(h.current){u.updateMatrixWorld(),h.current.updateWorldMatrix(!0,!1);const l=v?R.current:G(h.current,u,d);if(v||Math.abs(q.current-u.zoom)>t||Math.abs(R.current[0]-l[0])>t||Math.abs(R.current[1]-l[1])>t){const b=Je(h.current,u);let g=!1;L&&(Array.isArray(c)?g=c.map(M=>M.current):c!=="blending"&&(g=[Q]));const W=w.current;if(g){const M=Qe(h.current,u,xe,g);w.current=M&&!b}else w.current=!b;W!==w.current&&(_?_(!w.current):m.style.display=w.current?"block":"none");const $=Math.floor(O[0]/2),ye=c?L?[O[0],$]:[$-1,0]:O;if(m.style.zIndex=`${Ke(h.current,u,ye)}`,v){const[M,ee]=[d.width/2,d.height/2],A=u.projectionMatrix.elements[5]*ee,{isOrthographicCamera:te,top:be,left:Me,bottom:je,right:Pe}=u,Se=Xe(u.matrixWorldInverse),Ce=te?`scale(${A})translate(${I(-(Pe+Me)/2)}px,${I((be+je)/2)}px)`:`translateZ(${A}px)`;let j=h.current.matrixWorld;ue&&(j=u.matrixWorldInverse.clone().transpose().copyPosition(j).scale(h.current.scale),j.elements[3]=j.elements[7]=j.elements[11]=0,j.elements[15]=1),m.style.width=d.width+"px",m.style.height=d.height+"px",m.style.perspective=te?"":`${A}px`,T.current&&D.current&&(T.current.style.transform=`${Ce}${Se}translate(${M}px,${ee}px)`,D.current.style.transform=et(j,1/((E||10)/400)))}else{const M=E===void 0?1:qe(h.current,u)*E;m.style.transform=`translate3d(${l[0]}px,${l[1]}px,0) scale(${M})`}R.current=l,q.current=u.zoom}}if(!L&&y.current&&!N.current)if(v){if(T.current){const l=T.current.children[0];if(l!=null&&l.clientWidth&&l!=null&&l.clientHeight){const{isOrthographicCamera:b}=u;if(b||B)p.scale&&(Array.isArray(p.scale)?p.scale instanceof z?y.current.scale.copy(p.scale.clone().divideScalar(1)):y.current.scale.set(1/p.scale[0],1/p.scale[1],1/p.scale[2]):y.current.scale.setScalar(1/p.scale));else{const g=(E||10)/400,W=l.clientWidth*g,$=l.clientHeight*g;y.current.scale.set(W,$,1)}N.current=!0}}}else{const l=m.children[0];if(l!=null&&l.clientWidth&&l!=null&&l.clientHeight){const b=1/pe.factor,g=l.clientWidth*b,W=l.clientHeight*b;y.current.scale.set(g,W,1),N.current=!0}y.current.lookAt(f.camera.position)}});const X=n.useMemo(()=>({vertexShader:v?void 0:`
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
      `}),[v]);return n.createElement("group",We({},p,{ref:h}),c&&!L&&n.createElement("mesh",{castShadow:me,receiveShadow:de,ref:y},B||n.createElement("planeGeometry",null),fe||n.createElement("shaderMaterial",{side:se,vertexShader:X.vertexShader,fragmentShader:X.fragmentShader})))}),ot=`#define GLSLIFY 1

varying vec2 vUv;
varying vec3 vNormal2;

void main(){
  vUv = uv;
  vNormal2 = csm_Normal;
}`,nt=`#define GLSLIFY 1
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
}`,P={uColor:new H(new re(7649791)),uSideColor:new H(new re(16058890)),uTime:new H(0),uDelta:new H(0)};function ce({coords:e,children:t}){const r=n.useMemo(()=>{const o=new _e;o.moveTo(...e[0]);for(let a=1;a<e.length;a++)o.lineTo(...e[a]);const i=new Be(o,{bevelSize:0,bevelThickness:0,bevelSegments:0,depth:4});return i.computeVertexNormals(),i},[e]);return s.jsxs("mesh",{geometry:r,children:[s.jsx(Ne,{baseMaterial:Ge,uniforms:P,side:se,vertexShader:ot,fragmentShader:nt,depthWrite:!1,transparent:!0}),t]})}function st({coordss:e,children:t}){return s.jsxs("group",{children:[e.map((r,o)=>s.jsx(ce,{coords:r},o)),t]})}function ne({feature:e}){const{properties:{center:t,name:r}}=e;return t?s.jsx(rt,{position:[...t??[0,0],0],center:!0,distanceFactor:5,children:s.jsxs("div",{className:"relative cursor-pointer -translate-y-4",children:[s.jsx("div",{className:`inline-block whitespace-nowrap rounded-2xl\r
        bg-gray-900 text-l text-gray-200 px-3 py-1.5 select-none`,children:r??""}),s.jsx("div",{className:`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-5\r
        border-10 border-transparent border-t-gray-900`})]})}):null}function it({feature:e}){const{geometry:{type:t,coordinates:r}}=e;if(t==="Polygon"){const o=r[0];return s.jsx(ce,{coords:o,children:s.jsx(ne,{feature:e})})}else if(t==="MultiPolygon"){const o=r.map(i=>i[0]);return s.jsx(st,{coordss:o,children:s.jsx(ne,{feature:e})})}else return null}function at(){const e=Oe(Ue,Re("/data/china.json")),t=typeof e=="string"?JSON.parse(e):e,r=t.features.slice(0,34);t.properties.center,console.log(t.features);const{uTime:o,uDelta:i}=Le();return P.uTime=o,P.uDelta=i,$e({color:{value:"#"+P.uColor.value.getHexString(),onChange:a=>{P.uColor.value.set(a)}},sideColor:{value:"#"+P.uSideColor.value.getHexString(),onChange:a=>{P.uSideColor.value.set(a)}}}),console.log("render"),s.jsx("group",{scale:.2,children:r.map((a,x)=>s.jsx(it,{feature:a},x))})}const St=we(function(){return s.jsxs("div",{className:"h-screen",children:[s.jsxs(Fe,{children:[s.jsx("color",{attach:"background",args:["#191920"]}),s.jsx("fog",{attach:"fog",args:["#191920",.1,20]}),s.jsx(Ve,{}),s.jsx("ambientLight",{}),s.jsx("directionalLight",{position:[0,0,3]}),s.jsx(n.Suspense,{fallback:null,children:s.jsx(ke,{children:s.jsx(at,{})})}),s.jsx(He,{children:s.jsx(ze,{})})]}),s.jsx(De,{})]})});export{St as default};
