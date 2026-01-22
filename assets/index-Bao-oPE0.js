import{r as n,w as ie,o as c}from"./chunk-EPOLDU6W-B0aIzJ9t.js";import{ay as le,aw as ue,V as z,aO as fe,U as x,au as H,aA as te,x as N,aE as ce,aZ as me,B as he,g as Y,X as ve,J as de,aS as pe,al as V,a_ as xe,n as P,m as J,a$ as Z,a1 as ge,b0 as _e,b1 as De,b2 as ye,u as re,ax as Se,a as Me,b3 as Te,b4 as Be,b5 as we,b6 as Ue,C as be,O as Fe,b7 as Re,as as Ce}from"./OrbitControls-BG7KWy93.js";import{a as K}from"./asset-BvcpElq9.js";import{P as Pe}from"./Perf-VLlsS3RQ.js";import{u as Q,b as ee}from"./leva.esm-BHWSPH14.js";import{u as Ae}from"./Texture-khWqabe3.js";import{C as Ee}from"./Center-D-k9iNWf.js";import"./index-7OC5HNn7.js";import"./index-C_sia4Et.js";import"./client-Cu2R2QOy.js";import"./index-XD7JBPcQ.js";const je=()=>parseInt(le.replace(/\D+/g,"")),ze=je();class ke extends ue{constructor(e=new z){super({uniforms:{inputBuffer:new x(null),depthBuffer:new x(null),resolution:new x(new z),texelSize:new x(new z),halfTexelSize:new x(new z),kernel:new x(0),scale:new x(1),cameraNear:new x(0),cameraFar:new x(1),minDepthThreshold:new x(0),maxDepthThreshold:new x(1),depthScale:new x(0),depthToBlurRatioBias:new x(.25)},fragmentShader:`#include <common>
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
          #include <${ze>=154?"colorspace_fragment":"encodings_fragment"}>
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
        }`,blending:fe,depthWrite:!1,depthTest:!1}),this.toneMapped=!1,this.setTexelSize(e.x,e.y),this.kernel=new Float32Array([0,1,2,2,3])}setTexelSize(e,r){this.uniforms.texelSize.value.set(e,r),this.uniforms.halfTexelSize.value.set(e,r).multiplyScalar(.5)}setResolution(e){this.uniforms.resolution.value.copy(e)}}class Ie{constructor({gl:e,resolution:r,width:o=500,height:h=500,minDepthThreshold:v=0,maxDepthThreshold:g=1,depthScale:i=0,depthToBlurRatioBias:_=.25}){this.renderToScreen=!1,this.renderTargetA=new H(r,r,{minFilter:N,magFilter:N,stencilBuffer:!1,depthBuffer:!1,type:te}),this.renderTargetB=this.renderTargetA.clone(),this.convolutionMaterial=new ke,this.convolutionMaterial.setTexelSize(1/o,1/h),this.convolutionMaterial.setResolution(new z(o,h)),this.scene=new ce,this.camera=new me,this.convolutionMaterial.uniforms.minDepthThreshold.value=v,this.convolutionMaterial.uniforms.maxDepthThreshold.value=g,this.convolutionMaterial.uniforms.depthScale.value=i,this.convolutionMaterial.uniforms.depthToBlurRatioBias.value=_,this.convolutionMaterial.defines.USE_DEPTH=i>0;const d=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),a=new Float32Array([0,0,2,0,0,2]),s=new he;s.setAttribute("position",new Y(d,3)),s.setAttribute("uv",new Y(a,2)),this.screen=new ve(s,this.convolutionMaterial),this.screen.frustumCulled=!1,this.scene.add(this.screen)}render(e,r,o){const h=this.scene,v=this.camera,g=this.renderTargetA,i=this.renderTargetB;let _=this.convolutionMaterial,d=_.uniforms;d.depthBuffer.value=r.depthTexture;const a=_.kernel;let s=r,D,y,U;for(y=0,U=a.length-1;y<U;++y)D=(y&1)===0?g:i,d.kernel.value=a[y],d.inputBuffer.value=s.texture,e.setRenderTarget(D),e.render(h,v),s=D;d.kernel.value=a[y],d.inputBuffer.value=s.texture,e.setRenderTarget(this.renderToScreen?null:o),e.render(h,v)}}let Le=class extends de{constructor(e={}){super(e),this._tDepth={value:null},this._distortionMap={value:null},this._tDiffuse={value:null},this._tDiffuseBlur={value:null},this._textureMatrix={value:null},this._hasBlur={value:!1},this._mirror={value:0},this._mixBlur={value:0},this._blurStrength={value:.5},this._minDepthThreshold={value:.9},this._maxDepthThreshold={value:1},this._depthScale={value:0},this._depthToBlurRatioBias={value:.25},this._distortion={value:1},this._mixContrast={value:1},this.setValues(e)}onBeforeCompile(e){var r;(r=e.defines)!=null&&r.USE_UV||(e.defines.USE_UV=""),e.uniforms.hasBlur=this._hasBlur,e.uniforms.tDiffuse=this._tDiffuse,e.uniforms.tDepth=this._tDepth,e.uniforms.distortionMap=this._distortionMap,e.uniforms.tDiffuseBlur=this._tDiffuseBlur,e.uniforms.textureMatrix=this._textureMatrix,e.uniforms.mirror=this._mirror,e.uniforms.mixBlur=this._mixBlur,e.uniforms.mixStrength=this._blurStrength,e.uniforms.minDepthThreshold=this._minDepthThreshold,e.uniforms.maxDepthThreshold=this._maxDepthThreshold,e.uniforms.depthScale=this._depthScale,e.uniforms.depthToBlurRatioBias=this._depthToBlurRatioBias,e.uniforms.distortion=this._distortion,e.uniforms.mixContrast=this._mixContrast,e.vertexShader=`
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
      `)}get tDiffuse(){return this._tDiffuse.value}set tDiffuse(e){this._tDiffuse.value=e}get tDepth(){return this._tDepth.value}set tDepth(e){this._tDepth.value=e}get distortionMap(){return this._distortionMap.value}set distortionMap(e){this._distortionMap.value=e}get tDiffuseBlur(){return this._tDiffuseBlur.value}set tDiffuseBlur(e){this._tDiffuseBlur.value=e}get textureMatrix(){return this._textureMatrix.value}set textureMatrix(e){this._textureMatrix.value=e}get hasBlur(){return this._hasBlur.value}set hasBlur(e){this._hasBlur.value=e}get mirror(){return this._mirror.value}set mirror(e){this._mirror.value=e}get mixBlur(){return this._mixBlur.value}set mixBlur(e){this._mixBlur.value=e}get mixStrength(){return this._blurStrength.value}set mixStrength(e){this._blurStrength.value=e}get minDepthThreshold(){return this._minDepthThreshold.value}set minDepthThreshold(e){this._minDepthThreshold.value=e}get maxDepthThreshold(){return this._maxDepthThreshold.value}set maxDepthThreshold(e){this._maxDepthThreshold.value=e}get depthScale(){return this._depthScale.value}set depthScale(e){this._depthScale.value=e}get depthToBlurRatioBias(){return this._depthToBlurRatioBias.value}set depthToBlurRatioBias(e){this._depthToBlurRatioBias.value=e}get distortion(){return this._distortion.value}set distortion(e){this._distortion.value=e}get mixContrast(){return this._mixContrast.value}set mixContrast(e){this._mixContrast.value=e}};const Ve=n.forwardRef(({mixBlur:S=0,mixStrength:e=1,resolution:r=256,blur:o=[0,0],minDepthThreshold:h=.9,maxDepthThreshold:v=1,depthScale:g=0,depthToBlurRatioBias:i=.25,mirror:_=0,distortion:d=1,mixContrast:a=1,distortionMap:s,reflectorOffset:D=0,...y},U)=>{pe({MeshReflectorMaterialImpl:Le});const u=V(({gl:l})=>l),B=V(({camera:l})=>l),W=V(({scene:l})=>l);o=Array.isArray(o)?o:[o,o];const b=o[0]+o[1]>0,$=o[0],G=o[1],F=n.useRef(null);n.useImperativeHandle(U,()=>F.current,[]);const[R]=n.useState(()=>new xe),[T]=n.useState(()=>new P),[w]=n.useState(()=>new P),[q]=n.useState(()=>new P),[A]=n.useState(()=>new J),[k]=n.useState(()=>new P(0,0,-1)),[M]=n.useState(()=>new Z),[E]=n.useState(()=>new P),[I]=n.useState(()=>new P),[j]=n.useState(()=>new Z),[C]=n.useState(()=>new J),[p]=n.useState(()=>new ge),ae=n.useCallback(()=>{var l;const f=F.current.parent||((l=F.current)==null||(l=l.__r3f.parent)==null?void 0:l.object);if(!f||(w.setFromMatrixPosition(f.matrixWorld),q.setFromMatrixPosition(B.matrixWorld),A.extractRotation(f.matrixWorld),T.set(0,0,1),T.applyMatrix4(A),w.addScaledVector(T,D),E.subVectors(w,q),E.dot(T)>0))return;E.reflect(T).negate(),E.add(w),A.extractRotation(B.matrixWorld),k.set(0,0,-1),k.applyMatrix4(A),k.add(q),I.subVectors(w,k),I.reflect(T).negate(),I.add(w),p.position.copy(E),p.up.set(0,1,0),p.up.applyMatrix4(A),p.up.reflect(T),p.lookAt(I),p.far=B.far,p.updateMatrixWorld(),p.projectionMatrix.copy(B.projectionMatrix),C.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),C.multiply(p.projectionMatrix),C.multiply(p.matrixWorldInverse),C.multiply(f.matrixWorld),R.setFromNormalAndCoplanarPoint(T,w),R.applyMatrix4(p.matrixWorldInverse),M.set(R.normal.x,R.normal.y,R.normal.z,R.constant);const m=p.projectionMatrix;j.x=(Math.sign(M.x)+m.elements[8])/m.elements[0],j.y=(Math.sign(M.y)+m.elements[9])/m.elements[5],j.z=-1,j.w=(1+m.elements[10])/m.elements[14],M.multiplyScalar(2/M.dot(j)),m.elements[2]=M.x,m.elements[6]=M.y,m.elements[10]=M.z+1,m.elements[14]=M.w},[B,D]),[X,ne,oe,L]=n.useMemo(()=>{const l={minFilter:N,magFilter:N,type:te},f=new H(r,r,l);f.depthBuffer=!0,f.depthTexture=new _e(r,r),f.depthTexture.format=De,f.depthTexture.type=ye;const m=new H(r,r,l),O=new Ie({gl:u,resolution:r,width:$,height:G,minDepthThreshold:h,maxDepthThreshold:v,depthScale:g,depthToBlurRatioBias:i}),se={mirror:_,textureMatrix:C,mixBlur:S,tDiffuse:f.texture,tDepth:f.depthTexture,tDiffuseBlur:m.texture,hasBlur:b,mixStrength:e,minDepthThreshold:h,maxDepthThreshold:v,depthScale:g,depthToBlurRatioBias:i,distortion:d,distortionMap:s,mixContrast:a,"defines-USE_BLUR":b?"":void 0,"defines-USE_DEPTH":g>0?"":void 0,"defines-USE_DISTORTION":s?"":void 0};return[f,m,O,se]},[u,$,G,C,r,_,b,S,e,h,v,g,i,d,s,a]);return re(()=>{var l;const f=F.current.parent||((l=F.current)==null||(l=l.__r3f.parent)==null?void 0:l.object);if(!f)return;f.visible=!1;const m=u.xr.enabled,O=u.shadowMap.autoUpdate;ae(),u.xr.enabled=!1,u.shadowMap.autoUpdate=!1,u.setRenderTarget(X),u.state.buffers.depth.setMask(!0),u.autoClear||u.clear(),u.render(W,p),b&&oe.render(u,X,ne),u.xr.enabled=m,u.shadowMap.autoUpdate=O,f.visible=!0,u.setRenderTarget(null)}),n.createElement("meshReflectorMaterialImpl",Se({attach:"material",key:"key"+L["defines-USE_BLUR"]+L["defines-USE_DEPTH"]+L["defines-USE_DISTORTION"],ref:F},L,y))}),t={listener:null,sound:null,analyser:null,freqData:new Float32Array(0),refCount:0};function Ne(S){const{camera:r}=V(),o=Me(Te,S);n.useEffect(()=>(t.refCount===0&&(t.listener=new Be,r.add(t.listener),t.sound=new we(t.listener),t.sound.setBuffer(o),t.sound.setLoop(!0),t.sound.setVolume(.5),t.analyser=new Ue(t.sound,1024),t.freqData=new Float32Array(1024/2)),t.refCount++,()=>{t.refCount--,t.refCount===0&&(t.sound?.stop(),t.listener&&r.remove(t.listener),t.sound=null,t.listener=null,t.analyser=null)}),[o,r]);function h(v){if(!t.analyser)return t.freqData;const g=t.analyser.getFrequencyData();for(let i=0;i<1024/2;i++){const _=g[i]/255*v+t.freqData[i]*(1-v);t.freqData[i]=_}return t.freqData}return{get sound(){return t.sound},get analyser(){return t.analyser},getLerpFreqData:h}}function We(){const S=Ae(K("/img/texture/matcap/2E763A_78A0B7_B3D1CF_14F209.png")),e=.1,r=.02,o=Ne(K("/sound/shaderToy_5.mp3")),{lerpV:h}=Q({lerpV:{value:.3,min:0,max:1,step:.1},play:ee(()=>{const{sound:a}=o;a&&!a.isPlaying&&a?.play()}),pause:ee(()=>{const{sound:a}=o;a&&a.isPlaying&&a.pause()})}),{geo:v,mat:g}=n.useMemo(()=>{const a=new Re;a.translate(0,.5,0);const s=new Ce({matcap:S});return{geo:a,mat:s}},[]),{count:i}=Q({count:{value:40,min:1,max:80,step:1}}),_=n.useMemo(()=>{const a=[];for(let s=0;s<i;s++){const D=s*e+(s-1)*r;a.push(D)}return a},[i]),d=n.useRef(null);return re(({clock:a},s)=>{const{analyser:D,getLerpFreqData:y}=o;if(!D)return;const U=y(h);d.current.children.forEach((u,B)=>{const W=Math.floor(B/i*(D.analyser.fftSize/2)),b=Math.max(.01,U[W]*2);u.scale.set(e,b,e)})}),c.jsx(Ee,{disableY:!0,children:c.jsx("group",{ref:d,children:_.map((a,s)=>c.jsx("mesh",{"position-x":a,scale:[e,0,e],geometry:v,material:g},s))})})}function qe(){return c.jsxs("mesh",{"rotation-x":-Math.PI/2,"position-y":-.1,scale:40,children:[c.jsx("planeGeometry",{args:[1,1]}),c.jsx(Ve,{resolution:1024,color:"#151515",metalness:.8,roughness:0})]})}const rt=ie(function(){return c.jsx("div",{className:"h-screen",children:c.jsxs(be,{camera:{position:[-2,1,3]},children:[c.jsx("color",{attach:"background",args:["#191920"]}),c.jsx("fog",{attach:"fog",args:["#191920",.1,20]}),c.jsx(Pe,{position:"top-left"}),c.jsx("ambientLight",{}),c.jsx("directionalLight",{position:[10,10,-10],intensity:100}),c.jsx(Fe,{makeDefault:!0}),c.jsx(We,{}),c.jsx(qe,{})]})})});export{rt as default};
