import{r as t,w as $,o as a}from"./chunk-EPOLDU6W-B0aIzJ9t.js";import{u as N,a2 as J,al as O,au as k,b as K,X as V,av as Q,c as j,aw as F,ax as ee,C as te,O as re,U as g,n as H,d as ae,M as oe,ap as ne}from"./OrbitControls-BG7KWy93.js";import{a as q}from"./asset-BvcpElq9.js";import{j as se}from"./three-custom-shader-material.es-CJG4UqpK.js";import{u as W,b as ie}from"./leva.esm-BHWSPH14.js";import{u as ve}from"./useUniformTime-vIUN2tVY.js";import{P as ue}from"./Perf-VLlsS3RQ.js";import{u as le}from"./Gltf-Bod9YvAj.js";import{u as ce}from"./Texture-khWqabe3.js";import{E as me}from"./Environment-CH5GnMcX.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-Bn8Q5_NC.js";import"./index-XD7JBPcQ.js";import"./client-Cu2R2QOy.js";import"./index-C_sia4Et.js";const xe={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},fe={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},de=t.forwardRef(({children:o,enabled:m=!0,speed:i=1,rotationIntensity:n=1,floatIntensity:v=1,floatingRange:l=[-.1,.1],autoInvalidate:r=!1,...u},e)=>{const s=t.useRef(null);t.useImperativeHandle(e,()=>s.current,[]);const M=t.useRef(Math.random()*1e4);return N(C=>{var D,w;if(!m||i===0)return;r&&C.invalidate();const p=M.current+C.clock.elapsedTime;s.current.rotation.x=Math.cos(p/4*i)/8*n,s.current.rotation.y=Math.sin(p/4*i)/8*n,s.current.rotation.z=Math.sin(p/4*i)/20*n;let x=Math.sin(p/4*i)/10;x=J.mapLinear(x,-.1,.1,(D=l?.[0])!==null&&D!==void 0?D:-.1,(w=l?.[1])!==null&&w!==void 0?w:.1),s.current.position.y=x*v,s.current.updateMatrix()}),t.createElement("group",u,t.createElement("group",{ref:s,matrixAutoUpdate:!1},o))}),pe=t.forwardRef(({scale:o=10,frames:m=1/0,opacity:i=1,width:n=1,height:v=1,blur:l=1,near:r=0,far:u=10,resolution:e=512,smooth:s=!0,color:M="#000000",depthWrite:C=!1,renderOrder:D,...w},p)=>{const x=t.useRef(null),f=O(c=>c.scene),d=O(c=>c.gl),U=t.useRef(null);n=n*(Array.isArray(o)?o[0]:o||1),v=v*(Array.isArray(o)?o[1]:o||1);const[b,Z,X,y,z,S,G]=t.useMemo(()=>{const c=new k(e,e),I=new k(e,e);I.texture.generateMipmaps=c.texture.generateMipmaps=!1;const L=new K(n,v).rotateX(Math.PI/2),Y=new V(L),P=new Q;P.depthTest=P.depthWrite=!1,P.onBeforeCompile=h=>{h.uniforms={...h.uniforms,ucolor:{value:new j(M)}},h.fragmentShader=h.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),h.fragmentShader=h.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};const B=new F(xe),R=new F(fe);return R.depthTest=B.depthTest=!1,[c,L,P,Y,B,R,I]},[e,n,v,o,M]),_=c=>{y.visible=!0,y.material=z,z.uniforms.tDiffuse.value=b.texture,z.uniforms.h.value=c*1/256,d.setRenderTarget(G),d.render(y,U.current),y.material=S,S.uniforms.tDiffuse.value=G.texture,S.uniforms.v.value=c*1/256,d.setRenderTarget(b),d.render(y,U.current),y.visible=!1};let T=0,E,A;return N(()=>{U.current&&(m===1/0||T<m)&&(T++,E=f.background,A=f.overrideMaterial,x.current.visible=!1,f.background=null,f.overrideMaterial=X,d.setRenderTarget(b),d.render(f,U.current),_(l),s&&_(l*.4),d.setRenderTarget(null),x.current.visible=!0,f.overrideMaterial=A,f.background=E)}),t.useImperativeHandle(p,()=>x.current,[]),t.createElement("group",ee({"rotation-x":Math.PI/2},w,{ref:x}),t.createElement("mesh",{renderOrder:D,geometry:Z,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},t.createElement("meshBasicMaterial",{transparent:!0,map:b.texture,opacity:i,depthWrite:C})),t.createElement("orthographicCamera",{ref:U,args:[-n/2,n/2,v/2,-v/2,r,u]}))}),ye=`#define GLSLIFY 1

varying vec3 vPos;

void main(){
  vPos = csm_Position.xyz;
}`,he=`#define GLSLIFY 1
//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
  }

uniform vec3 uPatternCol;
uniform vec3 uPatternScale;
uniform vec3 uPatternOffset;
uniform float uGlow;
uniform float uGrad1;
uniform float uGrad2;

varying vec3 vPos;

void main(){
  vec3 col = csm_DiffuseColor.rgb;

  float pattern = abs(snoise(vPos*uPatternScale + uPatternOffset));

  if(uGlow>.5) {
    pattern = pow(.1/pattern,2.);
  }else{
    pattern = smoothstep(uGrad2,uGrad1, abs(pattern));
  }
  col = mix(col, uPatternCol, pattern);
  col += uPatternCol * pattern;

  csm_DiffuseColor = vec4(col,1);
}`;function ge(){const{nodes:o}=le(q("/model/cloths_zelda_sheikah.glb")),m=t.useMemo(()=>Object.values(o).map(e=>{if(e instanceof V&&(e.name==="defaultMaterial"||e.name==="defaultMaterial_5"))return{geo:e.geometry,matrix:e.matrix.clone(),name:e.name}}).filter(e=>e),[o]);function i(){return[...Array(m.length)].map(()=>new j().setHSL(Math.random(),.6,.2))}const[n,v]=t.useState(i);t.useEffect(()=>{v(i())},[m]);const l=ve(),r=t.useMemo(()=>({...l,uPatternCol:new g(new j(14818616)),uPatternScale:new g(new H(1,1,1)),uPatternOffset:new g(new H(1,1,1)),uGlow:new g(0),uGrad1:new g(0),uGrad2:new g(.1)}),[]),u=W({randomColor:ie(()=>{v(i())}),col:{value:"#"+r.uPatternCol.value.getHexString()},scale:{value:r.uPatternScale.value.toArray(),step:.2},offset:{value:r.uPatternOffset.value.toArray(),step:.1},glow:r.uGlow.value>0,gradientInterval:{min:0,max:1,value:[r.uGrad1.value,r.uGrad2.value],render:e=>!e("glow")}});return t.useEffect(()=>{r.uPatternCol.value.set(u.col),r.uPatternScale.value.set(...u.scale),r.uPatternOffset.value.set(...u.offset),r.uGlow.value=u.glow?1:0,r.uGrad1.value=u.gradientInterval[0],r.uGrad2.value=u.gradientInterval[1]},[u]),a.jsx(de,{speed:1,rotationIntensity:0,floatIntensity:1,children:a.jsx("group",{children:m.map((e,s)=>a.jsx("mesh",{geometry:e?.geo,matrix:e?.matrix,children:a.jsx(se,{baseMaterial:oe,uniforms:r,color:n[s],side:ae,vertexShader:ye,fragmentShader:he,roughness:.8,metalness:0,sheen:1,sheenColor:"#ff8e8e",sheenRoughness:.5})},s))})})}function De(){const o=ce(q("/img/texture/matcap/3E2335_D36A1B_8E4A2E_2842A5.png"));return a.jsx(me,{blur:1,background:!0,children:a.jsxs("mesh",{scale:10,children:[a.jsx("sphereGeometry",{args:[1,64,64]}),a.jsx("meshBasicMaterial",{map:o,side:ne})]})})}const Le=$(function(){const{intensity:o}=W({intensity:{value:1,min:.1,max:10}});return a.jsx("div",{className:"h-screen",children:a.jsxs(te,{camera:{position:[0,0,2]},children:[a.jsx(ue,{position:"top-left"}),a.jsx(re,{makeDefault:!0}),a.jsx("ambientLight",{}),a.jsx("directionalLight",{position:[2,0,2],intensity:o}),a.jsx(ge,{}),a.jsx(pe,{position:[0,-1,0],opacity:1,scale:10,blur:2,far:10,resolution:256,color:"#000000"}),a.jsx(De,{})]})})});export{Le as default};
