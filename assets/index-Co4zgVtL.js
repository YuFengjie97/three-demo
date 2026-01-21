import{r as t,w as le,o as d}from"./chunk-EPOLDU6W-B0aIzJ9t.js";import{ay as ue,ah as ce,n as j,ai as fe,ax as te,aw as me,V as N,aO as he,U as M,au as G,aA as re,x as H,aE as ve,aX as de,B as pe,g as Y,X as xe,J as ge,aS as _e,al as q,aY as De,m as J,aZ as K,a1 as ye,a_ as Se,a$ as Me,b0 as we,u as ne,a as Be,b1 as Te,b2 as Ue,b3 as Re,b4 as be,C as Fe,O as Ce,b5 as Ae,as as Ee}from"./OrbitControls-DN56r-3f.js";import{a as Q}from"./asset-BvcpElq9.js";import{P as Pe}from"./Perf-mTM18_Hi.js";import{u as Z,b as ee}from"./leva.esm-BHWSPH14.js";import{u as je}from"./Texture-DPDX9_jw.js";import"./index-7OC5HNn7.js";import"./index-C_sia4Et.js";import"./client-Cu2R2QOy.js";import"./index-XD7JBPcQ.js";const ze=()=>parseInt(ue.replace(/\D+/g,"")),ke=ze(),Ie=t.forwardRef(function({children:e,object:r,disable:o,disableX:f,disableY:m,disableZ:p,left:i,right:g,top:h,bottom:n,front:s,back:_,onCentered:D,precise:b=!0,cacheKey:l=0,...F},I){const T=t.useRef(null),z=t.useRef(null),L=t.useRef(null),[u]=t.useState(()=>new ce),[y]=t.useState(()=>new j),[w]=t.useState(()=>new fe);return t.useLayoutEffect(()=>{z.current.matrixWorld.identity(),u.setFromObject(r??L.current,b);const U=u.max.x-u.min.x,E=u.max.y-u.min.y,C=u.max.z-u.min.z;u.getCenter(y),u.getBoundingSphere(w);const P=h?E/2:n?-E/2:0,B=i?-U/2:g?U/2:0,A=s?C/2:_?-C/2:0;z.current.position.set(o||f?0:-y.x+B,o||m?0:-y.y+P,o||p?0:-y.z+A),D?.({parent:T.current.parent,container:T.current,width:U,height:E,depth:C,boundingBox:u,boundingSphere:w,center:y,verticalAlignment:P,horizontalAlignment:B,depthAlignment:A})},[l,D,h,i,s,o,f,m,p,r,b,g,n,_,u,y,w]),t.useImperativeHandle(I,()=>T.current,[]),t.createElement("group",te({ref:T},F),t.createElement("group",{ref:z},t.createElement("group",{ref:L},e)))});class Le extends me{constructor(e=new N){super({uniforms:{inputBuffer:new M(null),depthBuffer:new M(null),resolution:new M(new N),texelSize:new M(new N),halfTexelSize:new M(new N),kernel:new M(0),scale:new M(1),cameraNear:new M(0),cameraFar:new M(1),minDepthThreshold:new M(0),maxDepthThreshold:new M(1),depthScale:new M(0),depthToBlurRatioBias:new M(.25)},fragmentShader:`#include <common>
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
          #include <${ke>=154?"colorspace_fragment":"encodings_fragment"}>
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
        }`,blending:he,depthWrite:!1,depthTest:!1}),this.toneMapped=!1,this.setTexelSize(e.x,e.y),this.kernel=new Float32Array([0,1,2,2,3])}setTexelSize(e,r){this.uniforms.texelSize.value.set(e,r),this.uniforms.halfTexelSize.value.set(e,r).multiplyScalar(.5)}setResolution(e){this.uniforms.resolution.value.copy(e)}}class Ve{constructor({gl:e,resolution:r,width:o=500,height:f=500,minDepthThreshold:m=0,maxDepthThreshold:p=1,depthScale:i=0,depthToBlurRatioBias:g=.25}){this.renderToScreen=!1,this.renderTargetA=new G(r,r,{minFilter:H,magFilter:H,stencilBuffer:!1,depthBuffer:!1,type:re}),this.renderTargetB=this.renderTargetA.clone(),this.convolutionMaterial=new Le,this.convolutionMaterial.setTexelSize(1/o,1/f),this.convolutionMaterial.setResolution(new N(o,f)),this.scene=new ve,this.camera=new de,this.convolutionMaterial.uniforms.minDepthThreshold.value=m,this.convolutionMaterial.uniforms.maxDepthThreshold.value=p,this.convolutionMaterial.uniforms.depthScale.value=i,this.convolutionMaterial.uniforms.depthToBlurRatioBias.value=g,this.convolutionMaterial.defines.USE_DEPTH=i>0;const h=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),n=new Float32Array([0,0,2,0,0,2]),s=new pe;s.setAttribute("position",new Y(h,3)),s.setAttribute("uv",new Y(n,2)),this.screen=new xe(s,this.convolutionMaterial),this.screen.frustumCulled=!1,this.scene.add(this.screen)}render(e,r,o){const f=this.scene,m=this.camera,p=this.renderTargetA,i=this.renderTargetB;let g=this.convolutionMaterial,h=g.uniforms;h.depthBuffer.value=r.depthTexture;const n=g.kernel;let s=r,_,D,b;for(D=0,b=n.length-1;D<b;++D)_=(D&1)===0?p:i,h.kernel.value=n[D],h.inputBuffer.value=s.texture,e.setRenderTarget(_),e.render(f,m),s=_;h.kernel.value=n[D],h.inputBuffer.value=s.texture,e.setRenderTarget(this.renderToScreen?null:o),e.render(f,m)}}let Ne=class extends ge{constructor(e={}){super(e),this._tDepth={value:null},this._distortionMap={value:null},this._tDiffuse={value:null},this._tDiffuseBlur={value:null},this._textureMatrix={value:null},this._hasBlur={value:!1},this._mirror={value:0},this._mixBlur={value:0},this._blurStrength={value:.5},this._minDepthThreshold={value:.9},this._maxDepthThreshold={value:1},this._depthScale={value:0},this._depthToBlurRatioBias={value:.25},this._distortion={value:1},this._mixContrast={value:1},this.setValues(e)}onBeforeCompile(e){var r;(r=e.defines)!=null&&r.USE_UV||(e.defines.USE_UV=""),e.uniforms.hasBlur=this._hasBlur,e.uniforms.tDiffuse=this._tDiffuse,e.uniforms.tDepth=this._tDepth,e.uniforms.distortionMap=this._distortionMap,e.uniforms.tDiffuseBlur=this._tDiffuseBlur,e.uniforms.textureMatrix=this._textureMatrix,e.uniforms.mirror=this._mirror,e.uniforms.mixBlur=this._mixBlur,e.uniforms.mixStrength=this._blurStrength,e.uniforms.minDepthThreshold=this._minDepthThreshold,e.uniforms.maxDepthThreshold=this._maxDepthThreshold,e.uniforms.depthScale=this._depthScale,e.uniforms.depthToBlurRatioBias=this._depthToBlurRatioBias,e.uniforms.distortion=this._distortion,e.uniforms.mixContrast=this._mixContrast,e.vertexShader=`
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
      `)}get tDiffuse(){return this._tDiffuse.value}set tDiffuse(e){this._tDiffuse.value=e}get tDepth(){return this._tDepth.value}set tDepth(e){this._tDepth.value=e}get distortionMap(){return this._distortionMap.value}set distortionMap(e){this._distortionMap.value=e}get tDiffuseBlur(){return this._tDiffuseBlur.value}set tDiffuseBlur(e){this._tDiffuseBlur.value=e}get textureMatrix(){return this._textureMatrix.value}set textureMatrix(e){this._textureMatrix.value=e}get hasBlur(){return this._hasBlur.value}set hasBlur(e){this._hasBlur.value=e}get mirror(){return this._mirror.value}set mirror(e){this._mirror.value=e}get mixBlur(){return this._mixBlur.value}set mixBlur(e){this._mixBlur.value=e}get mixStrength(){return this._blurStrength.value}set mixStrength(e){this._blurStrength.value=e}get minDepthThreshold(){return this._minDepthThreshold.value}set minDepthThreshold(e){this._minDepthThreshold.value=e}get maxDepthThreshold(){return this._maxDepthThreshold.value}set maxDepthThreshold(e){this._maxDepthThreshold.value=e}get depthScale(){return this._depthScale.value}set depthScale(e){this._depthScale.value=e}get depthToBlurRatioBias(){return this._depthToBlurRatioBias.value}set depthToBlurRatioBias(e){this._depthToBlurRatioBias.value=e}get distortion(){return this._distortion.value}set distortion(e){this._distortion.value=e}get mixContrast(){return this._mixContrast.value}set mixContrast(e){this._mixContrast.value=e}};const We=t.forwardRef(({mixBlur:R=0,mixStrength:e=1,resolution:r=256,blur:o=[0,0],minDepthThreshold:f=.9,maxDepthThreshold:m=1,depthScale:p=0,depthToBlurRatioBias:i=.25,mirror:g=0,distortion:h=1,mixContrast:n=1,distortionMap:s,reflectorOffset:_=0,...D},b)=>{_e({MeshReflectorMaterialImpl:Ne});const l=q(({gl:c})=>c),F=q(({camera:c})=>c),I=q(({scene:c})=>c);o=Array.isArray(o)?o:[o,o];const T=o[0]+o[1]>0,z=o[0],L=o[1],u=t.useRef(null);t.useImperativeHandle(b,()=>u.current,[]);const[y]=t.useState(()=>new De),[w]=t.useState(()=>new j),[U]=t.useState(()=>new j),[E]=t.useState(()=>new j),[C]=t.useState(()=>new J),[P]=t.useState(()=>new j(0,0,-1)),[B]=t.useState(()=>new K),[A]=t.useState(()=>new j),[W]=t.useState(()=>new j),[V]=t.useState(()=>new K),[k]=t.useState(()=>new J),[S]=t.useState(()=>new ye),ae=t.useCallback(()=>{var c;const v=u.current.parent||((c=u.current)==null||(c=c.__r3f.parent)==null?void 0:c.object);if(!v||(U.setFromMatrixPosition(v.matrixWorld),E.setFromMatrixPosition(F.matrixWorld),C.extractRotation(v.matrixWorld),w.set(0,0,1),w.applyMatrix4(C),U.addScaledVector(w,_),A.subVectors(U,E),A.dot(w)>0))return;A.reflect(w).negate(),A.add(U),C.extractRotation(F.matrixWorld),P.set(0,0,-1),P.applyMatrix4(C),P.add(E),W.subVectors(U,P),W.reflect(w).negate(),W.add(U),S.position.copy(A),S.up.set(0,1,0),S.up.applyMatrix4(C),S.up.reflect(w),S.lookAt(W),S.far=F.far,S.updateMatrixWorld(),S.projectionMatrix.copy(F.projectionMatrix),k.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),k.multiply(S.projectionMatrix),k.multiply(S.matrixWorldInverse),k.multiply(v.matrixWorld),y.setFromNormalAndCoplanarPoint(w,U),y.applyMatrix4(S.matrixWorldInverse),B.set(y.normal.x,y.normal.y,y.normal.z,y.constant);const x=S.projectionMatrix;V.x=(Math.sign(B.x)+x.elements[8])/x.elements[0],V.y=(Math.sign(B.y)+x.elements[9])/x.elements[5],V.z=-1,V.w=(1+x.elements[10])/x.elements[14],B.multiplyScalar(2/B.dot(V)),x.elements[2]=B.x,x.elements[6]=B.y,x.elements[10]=B.z+1,x.elements[14]=B.w},[F,_]),[X,oe,se,O]=t.useMemo(()=>{const c={minFilter:H,magFilter:H,type:re},v=new G(r,r,c);v.depthBuffer=!0,v.depthTexture=new Se(r,r),v.depthTexture.format=Me,v.depthTexture.type=we;const x=new G(r,r,c),$=new Ve({gl:l,resolution:r,width:z,height:L,minDepthThreshold:f,maxDepthThreshold:m,depthScale:p,depthToBlurRatioBias:i}),ie={mirror:g,textureMatrix:k,mixBlur:R,tDiffuse:v.texture,tDepth:v.depthTexture,tDiffuseBlur:x.texture,hasBlur:T,mixStrength:e,minDepthThreshold:f,maxDepthThreshold:m,depthScale:p,depthToBlurRatioBias:i,distortion:h,distortionMap:s,mixContrast:n,"defines-USE_BLUR":T?"":void 0,"defines-USE_DEPTH":p>0?"":void 0,"defines-USE_DISTORTION":s?"":void 0};return[v,x,$,ie]},[l,z,L,k,r,g,T,R,e,f,m,p,i,h,s,n]);return ne(()=>{var c;const v=u.current.parent||((c=u.current)==null||(c=c.__r3f.parent)==null?void 0:c.object);if(!v)return;v.visible=!1;const x=l.xr.enabled,$=l.shadowMap.autoUpdate;ae(),l.xr.enabled=!1,l.shadowMap.autoUpdate=!1,l.setRenderTarget(X),l.state.buffers.depth.setMask(!0),l.autoClear||l.clear(),l.render(I,S),T&&se.render(l,X,oe),l.xr.enabled=x,l.shadowMap.autoUpdate=$,v.visible=!0,l.setRenderTarget(null)}),t.createElement("meshReflectorMaterialImpl",te({attach:"material",key:"key"+O["defines-USE_BLUR"]+O["defines-USE_DEPTH"]+O["defines-USE_DISTORTION"],ref:u},O,D))}),a={listener:null,sound:null,analyser:null,freqData:new Float32Array(0),refCount:0};function Oe(R){const{camera:r}=q(),o=Be(Te,R);t.useEffect(()=>(a.refCount===0&&(a.listener=new Ue,r.add(a.listener),a.sound=new Re(a.listener),a.sound.setBuffer(o),a.sound.setLoop(!0),a.sound.setVolume(.5),a.analyser=new be(a.sound,1024),a.freqData=new Float32Array(1024/2)),a.refCount++,()=>{a.refCount--,a.refCount===0&&(a.sound?.stop(),a.listener&&r.remove(a.listener),a.sound=null,a.listener=null,a.analyser=null)}),[o,r]);function f(m){if(!a.analyser)return a.freqData;const p=a.analyser.getFrequencyData();for(let i=0;i<1024/2;i++){const g=p[i]/255*m+a.freqData[i]*(1-m);a.freqData[i]=g}return a.freqData}return{get sound(){return a.sound},get analyser(){return a.analyser},getLerpFreqData:f}}function qe(){const R=je(Q("/img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png")),e=.1,r=.02,o=Oe(Q("/sound/shaderToy_5.mp3")),{lerpV:f}=Z({lerpV:{value:.3,min:0,max:1,step:.1},play:ee(()=>{const{sound:n}=o;n&&!n.isPlaying&&n?.play()}),pause:ee(()=>{const{sound:n}=o;n&&n.isPlaying&&n.pause()})}),{geo:m,mat:p}=t.useMemo(()=>{const n=new Ae;n.translate(0,.5,0);const s=new Ee({matcap:R});return{geo:n,mat:s}},[]),{count:i}=Z({count:{value:40,min:1,max:80,step:1}}),g=t.useMemo(()=>{const n=[];for(let s=0;s<i;s++){const _=s*e+(s-1)*r;n.push(_)}return n},[i]),h=t.useRef(null);return ne(({clock:n},s)=>{const{analyser:_,getLerpFreqData:D}=o;if(!_)return;const b=D(f);h.current.children.forEach((l,F)=>{const I=Math.floor(F/i*(_.analyser.fftSize/2)),T=Math.max(.01,b[I]*2);l.scale.set(e,T,e)})}),d.jsx(Ie,{disableY:!0,children:d.jsx("group",{ref:h,children:g.map((n,s)=>d.jsx("mesh",{"position-x":n,scale:[e,0,e],geometry:m,material:p},s))})})}function He(){return d.jsxs("mesh",{"rotation-x":-Math.PI/2,"position-y":-.1,scale:40,children:[d.jsx("planeGeometry",{args:[1,1]}),d.jsx(We,{resolution:1024,color:"#151515",metalness:.8,roughness:0})]})}const nt=le(function(){return d.jsx("div",{className:"h-screen",children:d.jsxs(Fe,{camera:{position:[-2,1,3]},children:[d.jsx("color",{attach:"background",args:["#191920"]}),d.jsx("fog",{attach:"fog",args:["#191920",.1,20]}),d.jsx(Pe,{position:"top-left"}),d.jsx("ambientLight",{}),d.jsx("directionalLight",{position:[10,10,-10],intensity:100}),d.jsx(Ce,{makeDefault:!0}),d.jsx(qe,{}),d.jsx(He,{})]})})});export{nt as default};
