import{r as i,w as ce,o as a}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{ay as me,aw as fe,V as P,aO as ve,U as p,au as W,aA as te,x as k,aE as de,b7 as pe,B as xe,g as $,X as he,J as re,aS as ge,al as V,b8 as ye,n as R,m as J,b5 as K,a1 as _e,aZ as De,b9 as we,ba as Te,u as O,ax as Se,a as Me,bb as Be,bc as Ue,bd as be,be as Fe,aH as Ce,aD as Re,aB as ze,y as Q,C as je,O as Ae,bf as Pe,as as Ee,bg as Le}from"./OrbitControls-Qaswctg9.js";import{a as ae}from"./asset-BvcpElq9.js";import{P as Ie}from"./Perf-C4zvoGZj.js";import{u as qe,b as ee}from"./leva.esm-BV3Tl-wj.js";import{j as Ve}from"./three-custom-shader-material.es-B5PibWSg.js";import{u as ke}from"./useUniformTime-BRwn2J5L.js";import{L as Ne,C as Ge}from"./Center-CnhPLuRi.js";import{u as We}from"./Texture-CNUAiRSk.js";import"./index-7OC5HNn7.js";import"./index-n5PR1bfd.js";import"./client-EdRjCdko.js";import"./index-D369hMBv.js";import"./three-custom-shader-material.es-kIczDPaj.js";const Oe=()=>parseInt(me.replace(/\D+/g,"")),Xe=Oe();class Ye extends fe{constructor(e=new P){super({uniforms:{inputBuffer:new p(null),depthBuffer:new p(null),resolution:new p(new P),texelSize:new p(new P),halfTexelSize:new p(new P),kernel:new p(0),scale:new p(1),cameraNear:new p(0),cameraFar:new p(1),minDepthThreshold:new p(0),maxDepthThreshold:new p(1),depthScale:new p(0),depthToBlurRatioBias:new p(.25)},fragmentShader:`#include <common>
        #include <dithering_pars_fragment>      
        uniform sampler2D inputBuffer;
        uniform sampler2D depthBuffer;
        uniform float cameraNear;
        uniform float cameraFar;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          float depthFactor = 0.0;
          
          #ifdef USE_DEPTH
            vec4 depth = texture2D(depthBuffer, vUv);
            depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
            depthFactor *= depthScale;
            depthFactor = max(0.0, min(1.0, depthFactor + 0.25));
          #endif
          
          vec4 sum = texture2D(inputBuffer, mix(vUv0, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv1, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv2, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv3, vUv, depthFactor));
          gl_FragColor = sum * 0.25 ;

          #include <dithering_fragment>
          #include <tonemapping_fragment>
          #include <${Xe>=154?"colorspace_fragment":"encodings_fragment"}>
        }`,vertexShader:`uniform vec2 texelSize;
        uniform vec2 halfTexelSize;
        uniform float kernel;
        uniform float scale;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          vec2 uv = position.xy * 0.5 + 0.5;
          vUv = uv;

          vec2 dUv = (texelSize * vec2(kernel) + halfTexelSize) * scale;
          vUv0 = vec2(uv.x - dUv.x, uv.y + dUv.y);
          vUv1 = vec2(uv.x + dUv.x, uv.y + dUv.y);
          vUv2 = vec2(uv.x + dUv.x, uv.y - dUv.y);
          vUv3 = vec2(uv.x - dUv.x, uv.y - dUv.y);

          gl_Position = vec4(position.xy, 1.0, 1.0);
        }`,blending:ve,depthWrite:!1,depthTest:!1}),this.toneMapped=!1,this.setTexelSize(e.x,e.y),this.kernel=new Float32Array([0,1,2,2,3])}setTexelSize(e,r){this.uniforms.texelSize.value.set(e,r),this.uniforms.halfTexelSize.value.set(e,r).multiplyScalar(.5)}setResolution(e){this.uniforms.resolution.value.copy(e)}}class He{constructor({gl:e,resolution:r,width:n=500,height:s=500,minDepthThreshold:h=0,maxDepthThreshold:g=1,depthScale:y=0,depthToBlurRatioBias:_=.25}){this.renderToScreen=!1,this.renderTargetA=new W(r,r,{minFilter:k,magFilter:k,stencilBuffer:!1,depthBuffer:!1,type:te}),this.renderTargetB=this.renderTargetA.clone(),this.convolutionMaterial=new Ye,this.convolutionMaterial.setTexelSize(1/n,1/s),this.convolutionMaterial.setResolution(new P(n,s)),this.scene=new de,this.camera=new pe,this.convolutionMaterial.uniforms.minDepthThreshold.value=h,this.convolutionMaterial.uniforms.maxDepthThreshold.value=g,this.convolutionMaterial.uniforms.depthScale.value=y,this.convolutionMaterial.uniforms.depthToBlurRatioBias.value=_,this.convolutionMaterial.defines.USE_DEPTH=y>0;const l=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),u=new Float32Array([0,0,2,0,0,2]),f=new xe;f.setAttribute("position",new $(l,3)),f.setAttribute("uv",new $(u,2)),this.screen=new he(f,this.convolutionMaterial),this.screen.frustumCulled=!1,this.scene.add(this.screen)}render(e,r,n){const s=this.scene,h=this.camera,g=this.renderTargetA,y=this.renderTargetB;let _=this.convolutionMaterial,l=_.uniforms;l.depthBuffer.value=r.depthTexture;const u=_.kernel;let f=r,T,D,U;for(D=0,U=u.length-1;D<U;++D)T=(D&1)===0?g:y,l.kernel.value=u[D],l.inputBuffer.value=f.texture,e.setRenderTarget(T),e.render(s,h),f=T;l.kernel.value=u[D],l.inputBuffer.value=f.texture,e.setRenderTarget(this.renderToScreen?null:n),e.render(s,h)}}let Ze=class extends re{constructor(e={}){super(e),this._tDepth={value:null},this._distortionMap={value:null},this._tDiffuse={value:null},this._tDiffuseBlur={value:null},this._textureMatrix={value:null},this._hasBlur={value:!1},this._mirror={value:0},this._mixBlur={value:0},this._blurStrength={value:.5},this._minDepthThreshold={value:.9},this._maxDepthThreshold={value:1},this._depthScale={value:0},this._depthToBlurRatioBias={value:.25},this._distortion={value:1},this._mixContrast={value:1},this.setValues(e)}onBeforeCompile(e){var r;(r=e.defines)!=null&&r.USE_UV||(e.defines.USE_UV=""),e.uniforms.hasBlur=this._hasBlur,e.uniforms.tDiffuse=this._tDiffuse,e.uniforms.tDepth=this._tDepth,e.uniforms.distortionMap=this._distortionMap,e.uniforms.tDiffuseBlur=this._tDiffuseBlur,e.uniforms.textureMatrix=this._textureMatrix,e.uniforms.mirror=this._mirror,e.uniforms.mixBlur=this._mixBlur,e.uniforms.mixStrength=this._blurStrength,e.uniforms.minDepthThreshold=this._minDepthThreshold,e.uniforms.maxDepthThreshold=this._maxDepthThreshold,e.uniforms.depthScale=this._depthScale,e.uniforms.depthToBlurRatioBias=this._depthToBlurRatioBias,e.uniforms.distortion=this._distortion,e.uniforms.mixContrast=this._mixContrast,e.vertexShader=`
        uniform mat4 textureMatrix;
        varying vec4 my_vUv;
      ${e.vertexShader}`,e.vertexShader=e.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
        my_vUv = textureMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`),e.fragmentShader=`
        uniform sampler2D tDiffuse;
        uniform sampler2D tDiffuseBlur;
        uniform sampler2D tDepth;
        uniform sampler2D distortionMap;
        uniform float distortion;
        uniform float cameraNear;
			  uniform float cameraFar;
        uniform bool hasBlur;
        uniform float mixBlur;
        uniform float mirror;
        uniform float mixStrength;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float mixContrast;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec4 my_vUv;
        ${e.fragmentShader}`,e.fragmentShader=e.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>

      float distortionFactor = 0.0;
      #ifdef USE_DISTORTION
        distortionFactor = texture2D(distortionMap, vUv).r * distortion;
      #endif

      vec4 new_vUv = my_vUv;
      new_vUv.x += distortionFactor;
      new_vUv.y += distortionFactor;

      vec4 base = texture2DProj(tDiffuse, new_vUv);
      vec4 blur = texture2DProj(tDiffuseBlur, new_vUv);

      vec4 merge = base;

      #ifdef USE_NORMALMAP
        vec2 normal_uv = vec2(0.0);
        vec4 normalColor = texture2D(normalMap, vUv * normalScale);
        vec3 my_normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
        vec3 coord = new_vUv.xyz / new_vUv.w;
        normal_uv = coord.xy + coord.z * my_normal.xz * 0.05;
        vec4 base_normal = texture2D(tDiffuse, normal_uv);
        vec4 blur_normal = texture2D(tDiffuseBlur, normal_uv);
        merge = base_normal;
        blur = blur_normal;
      #endif

      float depthFactor = 0.0001;
      float blurFactor = 0.0;

      #ifdef USE_DEPTH
        vec4 depth = texture2DProj(tDepth, new_vUv);
        depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
        depthFactor *= depthScale;
        depthFactor = max(0.0001, min(1.0, depthFactor));

        #ifdef USE_BLUR
          blur = blur * min(1.0, depthFactor + depthToBlurRatioBias);
          merge = merge * min(1.0, depthFactor + 0.5);
        #else
          merge = merge * depthFactor;
        #endif

      #endif

      float reflectorRoughnessFactor = roughness;
      #ifdef USE_ROUGHNESSMAP
        vec4 reflectorTexelRoughness = texture2D( roughnessMap, vUv );
        reflectorRoughnessFactor *= reflectorTexelRoughness.g;
      #endif

      #ifdef USE_BLUR
        blurFactor = min(1.0, mixBlur * reflectorRoughnessFactor);
        merge = mix(merge, blur, blurFactor);
      #endif

      vec4 newMerge = vec4(0.0, 0.0, 0.0, 1.0);
      newMerge.r = (merge.r - 0.5) * mixContrast + 0.5;
      newMerge.g = (merge.g - 0.5) * mixContrast + 0.5;
      newMerge.b = (merge.b - 0.5) * mixContrast + 0.5;

      diffuseColor.rgb = diffuseColor.rgb * ((1.0 - min(1.0, mirror)) + newMerge.rgb * mixStrength);
      `)}get tDiffuse(){return this._tDiffuse.value}set tDiffuse(e){this._tDiffuse.value=e}get tDepth(){return this._tDepth.value}set tDepth(e){this._tDepth.value=e}get distortionMap(){return this._distortionMap.value}set distortionMap(e){this._distortionMap.value=e}get tDiffuseBlur(){return this._tDiffuseBlur.value}set tDiffuseBlur(e){this._tDiffuseBlur.value=e}get textureMatrix(){return this._textureMatrix.value}set textureMatrix(e){this._textureMatrix.value=e}get hasBlur(){return this._hasBlur.value}set hasBlur(e){this._hasBlur.value=e}get mirror(){return this._mirror.value}set mirror(e){this._mirror.value=e}get mixBlur(){return this._mixBlur.value}set mixBlur(e){this._mixBlur.value=e}get mixStrength(){return this._blurStrength.value}set mixStrength(e){this._blurStrength.value=e}get minDepthThreshold(){return this._minDepthThreshold.value}set minDepthThreshold(e){this._minDepthThreshold.value=e}get maxDepthThreshold(){return this._maxDepthThreshold.value}set maxDepthThreshold(e){this._maxDepthThreshold.value=e}get depthScale(){return this._depthScale.value}set depthScale(e){this._depthScale.value=e}get depthToBlurRatioBias(){return this._depthToBlurRatioBias.value}set depthToBlurRatioBias(e){this._depthToBlurRatioBias.value=e}get distortion(){return this._distortion.value}set distortion(e){this._distortion.value=e}get mixContrast(){return this._mixContrast.value}set mixContrast(e){this._mixContrast.value=e}};const $e=i.forwardRef(({mixBlur:o=0,mixStrength:e=1,resolution:r=256,blur:n=[0,0],minDepthThreshold:s=.9,maxDepthThreshold:h=1,depthScale:g=0,depthToBlurRatioBias:y=.25,mirror:_=0,distortion:l=1,mixContrast:u=1,distortionMap:f,reflectorOffset:T=0,...D},U)=>{ge({MeshReflectorMaterialImpl:Ze});const m=V(({gl:c})=>c),M=V(({camera:c})=>c),oe=V(({scene:c})=>c);n=Array.isArray(n)?n:[n,n];const E=n[0]+n[1]>0,Y=n[0],H=n[1],b=i.useRef(null);i.useImperativeHandle(U,()=>b.current,[]);const[F]=i.useState(()=>new ye),[S]=i.useState(()=>new R),[B]=i.useState(()=>new R),[N]=i.useState(()=>new R),[z]=i.useState(()=>new J),[L]=i.useState(()=>new R(0,0,-1)),[w]=i.useState(()=>new K),[j]=i.useState(()=>new R),[I]=i.useState(()=>new R),[A]=i.useState(()=>new K),[C]=i.useState(()=>new J),[x]=i.useState(()=>new _e),ne=i.useCallback(()=>{var c;const v=b.current.parent||((c=b.current)==null||(c=c.__r3f.parent)==null?void 0:c.object);if(!v||(B.setFromMatrixPosition(v.matrixWorld),N.setFromMatrixPosition(M.matrixWorld),z.extractRotation(v.matrixWorld),S.set(0,0,1),S.applyMatrix4(z),B.addScaledVector(S,T),j.subVectors(B,N),j.dot(S)>0))return;j.reflect(S).negate(),j.add(B),z.extractRotation(M.matrixWorld),L.set(0,0,-1),L.applyMatrix4(z),L.add(N),I.subVectors(B,L),I.reflect(S).negate(),I.add(B),x.position.copy(j),x.up.set(0,1,0),x.up.applyMatrix4(z),x.up.reflect(S),x.lookAt(I),x.far=M.far,x.updateMatrixWorld(),x.projectionMatrix.copy(M.projectionMatrix),C.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),C.multiply(x.projectionMatrix),C.multiply(x.matrixWorldInverse),C.multiply(v.matrixWorld),F.setFromNormalAndCoplanarPoint(S,B),F.applyMatrix4(x.matrixWorldInverse),w.set(F.normal.x,F.normal.y,F.normal.z,F.constant);const d=x.projectionMatrix;A.x=(Math.sign(w.x)+d.elements[8])/d.elements[0],A.y=(Math.sign(w.y)+d.elements[9])/d.elements[5],A.z=-1,A.w=(1+d.elements[10])/d.elements[14],w.multiplyScalar(2/w.dot(A)),d.elements[2]=w.x,d.elements[6]=w.y,d.elements[10]=w.z+1,d.elements[14]=w.w},[M,T]),[Z,se,le,q]=i.useMemo(()=>{const c={minFilter:k,magFilter:k,type:te},v=new W(r,r,c);v.depthBuffer=!0,v.depthTexture=new De(r,r),v.depthTexture.format=we,v.depthTexture.type=Te;const d=new W(r,r,c),G=new He({gl:m,resolution:r,width:Y,height:H,minDepthThreshold:s,maxDepthThreshold:h,depthScale:g,depthToBlurRatioBias:y}),ue={mirror:_,textureMatrix:C,mixBlur:o,tDiffuse:v.texture,tDepth:v.depthTexture,tDiffuseBlur:d.texture,hasBlur:E,mixStrength:e,minDepthThreshold:s,maxDepthThreshold:h,depthScale:g,depthToBlurRatioBias:y,distortion:l,distortionMap:f,mixContrast:u,"defines-USE_BLUR":E?"":void 0,"defines-USE_DEPTH":g>0?"":void 0,"defines-USE_DISTORTION":f?"":void 0};return[v,d,G,ue]},[m,Y,H,C,r,_,E,o,e,s,h,g,y,l,f,u]);return O(()=>{var c;const v=b.current.parent||((c=b.current)==null||(c=c.__r3f.parent)==null?void 0:c.object);if(!v)return;v.visible=!1;const d=m.xr.enabled,G=m.shadowMap.autoUpdate;ne(),m.xr.enabled=!1,m.shadowMap.autoUpdate=!1,m.setRenderTarget(Z),m.state.buffers.depth.setMask(!0),m.autoClear||m.clear(),m.render(oe,x),E&&le.render(m,Z,se),m.xr.enabled=d,m.shadowMap.autoUpdate=G,v.visible=!0,m.setRenderTarget(null)}),i.createElement("meshReflectorMaterialImpl",Se({attach:"material",key:"key"+q["defines-USE_BLUR"]+q["defines-USE_DEPTH"]+q["defines-USE_DISTORTION"],ref:b},q,D))}),ie=1024,X=ie/2,t={lerpV:.3,listener:null,buffer:null,sound:null,analyser:null,freqData:new Float32Array(X),refCount:0,dataTex:null};function Je(){const o=new Ce(t.freqData,X,1,Re,ze);o.minFilter=Q,o.magFilter=Q,o.needsUpdate=!0,t.dataTex=o}function Ke(o){const{camera:e}=V();t.buffer=Me(Be,o),i.useEffect(()=>(t.refCount===0&&(Je(),t.listener=new Ue,e.add(t.listener),t.sound=new be(t.listener),t.sound.setBuffer(t.buffer),t.sound.setLoop(!0),t.sound.setVolume(.5),t.analyser=new Fe(t.sound,ie)),t.refCount++,()=>{t.refCount--,t.refCount===0&&(t.sound?.stop(),t.listener&&e.remove(t.listener),t.sound=null,t.listener=null,t.analyser=null)}),[t.buffer]),O(()=>{t.sound?.isPlaying&&(r(),t.dataTex&&(t.dataTex.needsUpdate=!0))});function r(){if(!t.analyser)return;const n=t.analyser.getFrequencyData();for(let s=0;s<X;s++){const h=n[s]/255*t.lerpV+t.freqData[s]*(1-t.lerpV);t.freqData[s]=h}}return{get sound(){return t.sound},get analyser(){return t.analyser},get lerpFreqData(){return t.freqData},get dataTex(){return t.dataTex},set lerpV(n){t.lerpV=n}}}const Qe=`#define GLSLIFY 1
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

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0; }

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float taylorInvSqrt(float r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec4 grad4(float j, vec4 ip)
  {
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

  return p;
  }

// (sqrt(5) - 1)/4 = F4, used once below
#define F4 0.309016994374947451

float snoise(vec4 v)
  {
  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                       -0.447213595499958); // -1 + 4 * G4

// First corner
  vec4 i  = floor(v + dot(v, vec4(F4)) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C.xxxx
  //  x1 = x0 - i1  + 1.0 * C.xxxx
  //  x2 = x0 - i2  + 2.0 * C.xxxx
  //  x3 = x0 - i3  + 3.0 * C.xxxx
  //  x4 = x0 - 1.0 + 4.0 * C.xxxx
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;

// Permutations
  i = mod289(i);
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

  }

#define s1(v) (sin(v)*.5+.5)

uniform sampler2D uFreqTex;
uniform float uTime;

varying vec3 vCol;

void main(){
  float t = uTime;

  vec3 p = csm_Position;

  float ang = atan(p.z,p.x);

  float v = texture(uFreqTex, vec2(sin(ang*2.), 0.)).r;
  vec3 dir = normalize(p);
  p += dir*v;

  vCol = s1(vec3(3,2,1) + v*10.);

  csm_Position = p;
}`,et=`#define GLSLIFY 1
varying vec3 vCol;

void main(){
  csm_DiffuseColor.rgb = vCol;
}`;function tt({audioApi:o}){const e=We(ae("/img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png")),r=.1,n=.02,{geo:s,mat:h}=i.useMemo(()=>{const l=new Pe;l.translate(0,.5,0);const u=new Ee({matcap:e});return{geo:l,mat:u}},[]),g=40,y=i.useMemo(()=>{const l=[];for(let u=0;u<g;u++){const f=u*r+(u-1)*n;l.push(f)}return l},[g]),_=i.useRef(null);return O(({clock:l},u)=>{const{analyser:f,lerpFreqData:T}=o;f&&_.current.children.forEach((D,U)=>{const m=Math.floor(U/g*(f.analyser.fftSize/2)),M=Math.max(.01,T[m]*2);D.scale.set(r,M,r)})}),a.jsx(Ge,{disableY:!0,children:a.jsx("group",{ref:_,children:y.map((l,u)=>a.jsx("mesh",{"position-x":l,scale:[r,0,r],geometry:s,material:h},u))})})}function rt({audioApi:o}){const e=i.useMemo(()=>{const s=new Le(3,.2,10,80);return s.translate(0,.1,0),s.rotateX(Math.PI/2),s},[]),n={...ke(),uFreqTex:new p(o.dataTex)};return a.jsx("mesh",{geometry:e,children:a.jsx(Ve,{baseMaterial:re,uniforms:n,vertexShader:Qe,fragmentShader:et})})}function at(){return a.jsxs("mesh",{"rotation-x":-Math.PI/2,"position-y":-.1,scale:40,children:[a.jsx("planeGeometry",{args:[1,1]}),a.jsx($e,{resolution:1024,color:"#151515",metalness:.8,roughness:0})]})}function it(){const o=Ke(ae("/sound/hero.mp3"));return qe({play:ee(()=>{const{sound:e}=o;e&&!e.isPlaying&&o.sound?.play()}),pause:ee(()=>{const{sound:e}=o;e&&e.isPlaying&&e.pause()})}),a.jsxs(a.Fragment,{children:[a.jsx(tt,{audioApi:o}),a.jsx(rt,{audioApi:o})]})}const _t=ce(function(){return a.jsxs("div",{className:"h-screen",children:[a.jsxs(je,{camera:{position:[-2,1,3]},children:[a.jsx("color",{attach:"background",args:["#191920"]}),a.jsx("fog",{attach:"fog",args:["#191920",.1,20]}),a.jsx(Ie,{position:"top-left"}),a.jsx("ambientLight",{}),a.jsx("directionalLight",{position:[0,10,0],intensity:20}),a.jsx("axesHelper",{args:[10]}),a.jsx(Ae,{makeDefault:!0}),a.jsx(it,{}),a.jsx(at,{})]}),a.jsx(Ne,{})]})});export{_t as default};
