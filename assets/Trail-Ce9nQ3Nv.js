import{r as o}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{B as R,ae as L,V as A,h as f,o as j,a8 as x,c as M,bf as E,av as S,e as D,aI as B,u as W,a6 as I}from"./extends-BlC2n1ra.js";var k=Object.defineProperty,N=(r,t,e)=>t in r?k(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e,a=(r,t,e)=>(N(r,typeof t!="symbol"?t+"":t,e),e);function P(r,t,e,i,s){let u;if(r=r.subarray||r.slice?r:r.buffer,e=e.subarray||e.slice?e:e.buffer,r=t?r.subarray?r.subarray(t,s&&t+s):r.slice(t,s&&t+s):r,e.set)e.set(r,i);else for(u=0;u<r.length;u++)e[u+i]=r[u];return e}function $(r){return r instanceof Float32Array?r:r instanceof R?r.getAttribute("position").array:r.map(t=>{const e=Array.isArray(t);return t instanceof A?[t.x,t.y,t.z]:t instanceof x?[t.x,t.y,0]:e&&t.length===3?[t[0],t[1],t[2]]:e&&t.length===2?[t[0],t[1],0]:t}).flat()}class q extends R{constructor(){super(),a(this,"type","MeshLine"),a(this,"isMeshLine",!0),a(this,"positions",[]),a(this,"previous",[]),a(this,"next",[]),a(this,"side",[]),a(this,"width",[]),a(this,"indices_array",[]),a(this,"uvs",[]),a(this,"counters",[]),a(this,"widthCallback",null),a(this,"_attributes"),a(this,"_points",[]),a(this,"points"),a(this,"matrixWorld",new L),Object.defineProperties(this,{points:{enumerable:!0,get(){return this._points},set(t){this.setPoints(t,this.widthCallback)}}})}setMatrixWorld(t){this.matrixWorld=t}setPoints(t,e){if(t=$(t),this._points=t,this.widthCallback=e??null,this.positions=[],this.counters=[],t.length&&t[0]instanceof A)for(let i=0;i<t.length;i++){const s=t[i],u=i/(t.length-1);this.positions.push(s.x,s.y,s.z),this.positions.push(s.x,s.y,s.z),this.counters.push(u),this.counters.push(u)}else for(let i=0;i<t.length;i+=3){const s=i/(t.length-1);this.positions.push(t[i],t[i+1],t[i+2]),this.positions.push(t[i],t[i+1],t[i+2]),this.counters.push(s),this.counters.push(s)}this.process()}compareV3(t,e){const i=t*6,s=e*6;return this.positions[i]===this.positions[s]&&this.positions[i+1]===this.positions[s+1]&&this.positions[i+2]===this.positions[s+2]}copyV3(t){const e=t*6;return[this.positions[e],this.positions[e+1],this.positions[e+2]]}process(){const t=this.positions.length/6;this.previous=[],this.next=[],this.side=[],this.width=[],this.indices_array=[],this.uvs=[];let e,i;this.compareV3(0,t-1)?i=this.copyV3(t-2):i=this.copyV3(0),this.previous.push(i[0],i[1],i[2]),this.previous.push(i[0],i[1],i[2]);for(let s=0;s<t;s++){if(this.side.push(1),this.side.push(-1),this.widthCallback?e=this.widthCallback(s/(t-1)):e=1,this.width.push(e),this.width.push(e),this.uvs.push(s/(t-1),0),this.uvs.push(s/(t-1),1),s<t-1){i=this.copyV3(s),this.previous.push(i[0],i[1],i[2]),this.previous.push(i[0],i[1],i[2]);const u=s*2;this.indices_array.push(u,u+1,u+2),this.indices_array.push(u+2,u+1,u+3)}s>0&&(i=this.copyV3(s),this.next.push(i[0],i[1],i[2]),this.next.push(i[0],i[1],i[2]))}this.compareV3(t-1,0)?i=this.copyV3(1):i=this.copyV3(t-1),this.next.push(i[0],i[1],i[2]),this.next.push(i[0],i[1],i[2]),!this._attributes||this._attributes.position.count!==this.counters.length?this._attributes={position:new f(new Float32Array(this.positions),3),previous:new f(new Float32Array(this.previous),3),next:new f(new Float32Array(this.next),3),side:new f(new Float32Array(this.side),1),width:new f(new Float32Array(this.width),1),uv:new f(new Float32Array(this.uvs),2),index:new f(new Uint16Array(this.indices_array),1),counters:new f(new Float32Array(this.counters),1)}:(this._attributes.position.copyArray(new Float32Array(this.positions)),this._attributes.position.needsUpdate=!0,this._attributes.previous.copyArray(new Float32Array(this.previous)),this._attributes.previous.needsUpdate=!0,this._attributes.next.copyArray(new Float32Array(this.next)),this._attributes.next.needsUpdate=!0,this._attributes.side.copyArray(new Float32Array(this.side)),this._attributes.side.needsUpdate=!0,this._attributes.width.copyArray(new Float32Array(this.width)),this._attributes.width.needsUpdate=!0,this._attributes.uv.copyArray(new Float32Array(this.uvs)),this._attributes.uv.needsUpdate=!0,this._attributes.index.copyArray(new Uint16Array(this.indices_array)),this._attributes.index.needsUpdate=!0),this.setAttribute("position",this._attributes.position),this.setAttribute("previous",this._attributes.previous),this.setAttribute("next",this._attributes.next),this.setAttribute("side",this._attributes.side),this.setAttribute("width",this._attributes.width),this.setAttribute("uv",this._attributes.uv),this.setAttribute("counters",this._attributes.counters),this.setAttribute("position",this._attributes.position),this.setAttribute("previous",this._attributes.previous),this.setAttribute("next",this._attributes.next),this.setAttribute("side",this._attributes.side),this.setAttribute("width",this._attributes.width),this.setAttribute("uv",this._attributes.uv),this.setAttribute("counters",this._attributes.counters),this.setIndex(this._attributes.index),this.computeBoundingSphere(),this.computeBoundingBox()}advance({x:t,y:e,z:i}){const s=this._attributes.position.array,u=this._attributes.previous.array,h=this._attributes.next.array,n=s.length;P(s,0,u,0,n),P(s,6,s,0,n-6),s[n-6]=t,s[n-5]=e,s[n-4]=i,s[n-3]=t,s[n-2]=e,s[n-1]=i,P(s,6,h,0,n-6),h[n-6]=t,h[n-5]=e,h[n-4]=i,h[n-3]=t,h[n-2]=e,h[n-1]=i,this._attributes.position.needsUpdate=!0,this._attributes.previous.needsUpdate=!0,this._attributes.next.needsUpdate=!0}}const H=`
  #include <common>
  #include <logdepthbuf_pars_vertex>
  #include <fog_pars_vertex>
  #include <clipping_planes_pars_vertex>

  attribute vec3 previous;
  attribute vec3 next;
  attribute float side;
  attribute float width;
  attribute float counters;
  
  uniform vec2 resolution;
  uniform float lineWidth;
  uniform vec3 color;
  uniform float opacity;
  uniform float sizeAttenuation;
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    return res;
  }
  
  void main() {
    float aspect = resolution.x / resolution.y;
    vColor = vec4(color, opacity);
    vUV = uv;
    vCounters = counters;
  
    mat4 m = projectionMatrix * modelViewMatrix;
    vec4 finalPosition = m * vec4(position, 1.0) * aspect;
    vec4 prevPos = m * vec4(previous, 1.0);
    vec4 nextPos = m * vec4(next, 1.0);
  
    vec2 currentP = fix(finalPosition, aspect);
    vec2 prevP = fix(prevPos, aspect);
    vec2 nextP = fix(nextPos, aspect);
  
    float w = lineWidth * width;
  
    vec2 dir;
    if (nextP == currentP) dir = normalize(currentP - prevP);
    else if (prevP == currentP) dir = normalize(nextP - currentP);
    else {
      vec2 dir1 = normalize(currentP - prevP);
      vec2 dir2 = normalize(nextP - currentP);
      dir = normalize(dir1 + dir2);
  
      vec2 perp = vec2(-dir1.y, dir1.x);
      vec2 miter = vec2(-dir.y, dir.x);
      //w = clamp(w / dot(miter, perp), 0., 4. * lineWidth * width);
    }
  
    //vec2 normal = (cross(vec3(dir, 0.), vec3(0., 0., 1.))).xy;
    vec4 normal = vec4(-dir.y, dir.x, 0., 1.);
    normal.xy *= .5 * w;
    //normal *= projectionMatrix;
    if (sizeAttenuation == 0.) {
      normal.xy *= finalPosition.w;
      normal.xy /= (vec4(resolution, 0., 1.) * projectionMatrix).xy * aspect;
    }
  
    finalPosition.xy += normal.xy * side;
    gl_Position = finalPosition;
    #include <logdepthbuf_vertex>
    #include <fog_vertex>
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    #include <clipping_planes_vertex>
    #include <fog_vertex>
  }
`,J=parseInt(S.replace(/\D+/g,"")),K=J>=154?"colorspace_fragment":"encodings_fragment",Q=`
  #include <fog_pars_fragment>
  #include <logdepthbuf_pars_fragment>
  #include <clipping_planes_pars_fragment>
  
  uniform sampler2D map;
  uniform sampler2D alphaMap;
  uniform float useGradient;
  uniform float useMap;
  uniform float useAlphaMap;
  uniform float useDash;
  uniform float dashArray;
  uniform float dashOffset;
  uniform float dashRatio;
  uniform float visibility;
  uniform float alphaTest;
  uniform vec2 repeat;
  uniform vec3 gradient[2];
  
  varying vec2 vUV;
  varying vec4 vColor;
  varying float vCounters;
  
  void main() {
    #include <logdepthbuf_fragment>
    vec4 diffuseColor = vColor;
    if (useGradient == 1.) diffuseColor = vec4(mix(gradient[0], gradient[1], vCounters), 1.0);
    if (useMap == 1.) diffuseColor *= texture2D(map, vUV * repeat);
    if (useAlphaMap == 1.) diffuseColor.a *= texture2D(alphaMap, vUV * repeat).a;
    if (diffuseColor.a < alphaTest) discard;
    if (useDash == 1.) diffuseColor.a *= ceil(mod(vCounters + dashOffset, dashArray) - (dashArray * dashRatio));
    diffuseColor.a *= step(vCounters, visibility);
    #include <clipping_planes_fragment>
    gl_FragColor = diffuseColor;     
    #include <fog_fragment>
    #include <tonemapping_fragment>
    #include <${K}>
  }
`;class X extends j{constructor(t){super({uniforms:{...E.fog,lineWidth:{value:1},map:{value:null},useMap:{value:0},alphaMap:{value:null},useAlphaMap:{value:0},color:{value:new M(16777215)},gradient:{value:[new M(16711680),new M(65280)]},opacity:{value:1},resolution:{value:new x(1,1)},sizeAttenuation:{value:1},dashArray:{value:0},dashOffset:{value:0},dashRatio:{value:.5},useDash:{value:0},useGradient:{value:0},visibility:{value:1},alphaTest:{value:0},repeat:{value:new x(1,1)}},vertexShader:H,fragmentShader:Q}),a(this,"lineWidth"),a(this,"map"),a(this,"useMap"),a(this,"alphaMap"),a(this,"useAlphaMap"),a(this,"color"),a(this,"gradient"),a(this,"resolution"),a(this,"sizeAttenuation"),a(this,"dashArray"),a(this,"dashOffset"),a(this,"dashRatio"),a(this,"useDash"),a(this,"useGradient"),a(this,"visibility"),a(this,"repeat"),this.type="MeshLineMaterial",Object.defineProperties(this,{lineWidth:{enumerable:!0,get(){return this.uniforms.lineWidth.value},set(e){this.uniforms.lineWidth.value=e}},map:{enumerable:!0,get(){return this.uniforms.map.value},set(e){this.uniforms.map.value=e}},useMap:{enumerable:!0,get(){return this.uniforms.useMap.value},set(e){this.uniforms.useMap.value=e}},alphaMap:{enumerable:!0,get(){return this.uniforms.alphaMap.value},set(e){this.uniforms.alphaMap.value=e}},useAlphaMap:{enumerable:!0,get(){return this.uniforms.useAlphaMap.value},set(e){this.uniforms.useAlphaMap.value=e}},color:{enumerable:!0,get(){return this.uniforms.color.value},set(e){this.uniforms.color.value=e}},gradient:{enumerable:!0,get(){return this.uniforms.gradient.value},set(e){this.uniforms.gradient.value=e}},opacity:{enumerable:!0,get(){return this.uniforms.opacity.value},set(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get(){return this.uniforms.resolution.value},set(e){this.uniforms.resolution.value.copy(e)}},sizeAttenuation:{enumerable:!0,get(){return this.uniforms.sizeAttenuation.value},set(e){this.uniforms.sizeAttenuation.value=e}},dashArray:{enumerable:!0,get(){return this.uniforms.dashArray.value},set(e){this.uniforms.dashArray.value=e,this.useDash=e!==0?1:0}},dashOffset:{enumerable:!0,get(){return this.uniforms.dashOffset.value},set(e){this.uniforms.dashOffset.value=e}},dashRatio:{enumerable:!0,get(){return this.uniforms.dashRatio.value},set(e){this.uniforms.dashRatio.value=e}},useDash:{enumerable:!0,get(){return this.uniforms.useDash.value},set(e){this.uniforms.useDash.value=e}},useGradient:{enumerable:!0,get(){return this.uniforms.useGradient.value},set(e){this.uniforms.useGradient.value=e}},visibility:{enumerable:!0,get(){return this.uniforms.visibility.value},set(e){this.uniforms.visibility.value=e}},alphaTest:{enumerable:!0,get(){return this.uniforms.alphaTest.value},set(e){this.uniforms.alphaTest.value=e}},repeat:{enumerable:!0,get(){return this.uniforms.repeat.value},set(e){this.uniforms.repeat.value.copy(e)}}}),this.setValues(t)}copy(t){return super.copy(t),this.lineWidth=t.lineWidth,this.map=t.map,this.useMap=t.useMap,this.alphaMap=t.alphaMap,this.useAlphaMap=t.useAlphaMap,this.color.copy(t.color),this.gradient=t.gradient,this.opacity=t.opacity,this.resolution.copy(t.resolution),this.sizeAttenuation=t.sizeAttenuation,this.dashArray=t.dashArray,this.dashOffset=t.dashOffset,this.dashRatio=t.dashRatio,this.useDash=t.useDash,this.useGradient=t.useGradient,this.visibility=t.visibility,this.alphaTest=t.alphaTest,this.repeat.copy(t.repeat),this}}const T={width:.2,length:1,decay:1,local:!1,stride:0,interval:1},Y=(r,t=1)=>(r.set(r.subarray(t)),r.fill(-1/0,-t),r);function Z(r,t){const{length:e,local:i,decay:s,interval:u,stride:h}={...T,...t},n=o.useRef(null),[b]=o.useState(()=>new A);o.useLayoutEffect(()=>{r&&(n.current=Float32Array.from({length:e*10*3},(l,p)=>r.position.getComponent(p%3)))},[e,r]);const v=o.useRef(new A),d=o.useRef(0);return W(()=>{if(r&&n.current){if(d.current===0){let l;i?l=r.position:(r.getWorldPosition(b),l=b);const p=1*s;for(let g=0;g<p;g++)l.distanceTo(v.current)<h||(Y(n.current,3),n.current.set(l.toArray(),n.current.length-3));v.current.copy(l)}d.current++,d.current=d.current%u}}),n}const it=o.forwardRef((r,t)=>{const{children:e}=r,{width:i,length:s,decay:u,local:h,stride:n,interval:b}={...T,...r},{color:v="hotpink",attenuation:d,target:l}=r,p=D(c=>c.size),g=D(c=>c.scene),C=o.useRef(null),[O,G]=o.useState(null),w=Z(O,{length:s,decay:u,local:h,stride:n,interval:b});o.useEffect(()=>{const c=l?.current||C.current.children.find(_=>_ instanceof B);c&&G(c)},[w,l]);const V=o.useMemo(()=>new q,[]),F=o.useMemo(()=>{var c,_;const U=new X({lineWidth:.1*i,color:v,sizeAttenuation:1,resolution:new x(p.width,p.height)});let m;if(e)if(Array.isArray(e))m=e.find(y=>{const z=y;return typeof z.type=="string"&&z.type==="meshLineMaterial"});else{const y=e;typeof y.type=="string"&&y.type==="meshLineMaterial"&&(m=y)}return typeof((c=m)==null?void 0:c.props)=="object"&&((_=m)==null?void 0:_.props)!==null&&U.setValues(m.props),U},[i,v,p,e]);return o.useEffect(()=>{F.uniforms.resolution.value.set(p.width,p.height)},[p]),W(()=>{w.current&&V.setPoints(w.current,d)}),o.createElement("group",null,I(o.createElement("mesh",{ref:t,geometry:V,material:F}),g),o.createElement("group",{ref:C},e))});export{it as T};
