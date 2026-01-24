import{w as G,o as u,r as b}from"./chunk-EPOLDU6W-B0aIzJ9t.js";import{X as U,a3 as B,B as M,aY as P,y,aw as E,au as O,aB as _,an as R,aH as N,E as S,C as q,O as H,g as j,U as F,u as W,A as k,f as Q,d as A,al as J}from"./OrbitControls-BjQ9zg-v.js";import{j as K}from"./three-custom-shader-material.es-B9lUb-dr.js";import{u as L}from"./useUniformTime-qY0f1_oE.js";import{a as Z}from"./asset-BvcpElq9.js";import{P as $}from"./Perf-C8NO2NiO.js";import{u as Y}from"./leva.esm-BHWSPH14.js";import{u as X}from"./Texture-Ccgoykxo.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-C5BQWJi5.js";import"./index-C_sia4Et.js";import"./client-Cu2R2QOy.js";import"./index-XD7JBPcQ.js";const ee=new B(-1,1,1,-1,0,1);class te extends M{constructor(){super(),this.setAttribute("position",new P([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new P([0,2,0,0,2,0],2))}}const re=new te;class ne{constructor(r){this._mesh=new U(re,r)}dispose(){this._mesh.geometry.dispose()}render(r){r.render(this._mesh,ee)}get material(){return this._mesh.material}set material(r){this._mesh.material=r}}class ae{constructor(r,s,n){this.variables=[],this.currentTextureIndex=0;let v=_;const x={passThruTexture:{value:null}},l=d(C(),x),c=new ne(l);this.setDataType=function(t){return v=t,this},this.addVariable=function(t,e,o){const i=this.createShaderMaterial(e),a={name:t,initialValueTexture:o,material:i,dependencies:null,renderTargets:[],wrapS:null,wrapT:null,minFilter:y,magFilter:y};return this.variables.push(a),a},this.setVariableDependencies=function(t,e){t.dependencies=e},this.init=function(){if(n.capabilities.maxVertexTextures===0)return"No support for vertex shader textures.";for(let t=0;t<this.variables.length;t++){const e=this.variables[t];e.renderTargets[0]=this.createRenderTarget(r,s,e.wrapS,e.wrapT,e.minFilter,e.magFilter),e.renderTargets[1]=this.createRenderTarget(r,s,e.wrapS,e.wrapT,e.minFilter,e.magFilter),this.renderTexture(e.initialValueTexture,e.renderTargets[0]),this.renderTexture(e.initialValueTexture,e.renderTargets[1]);const o=e.material,i=o.uniforms;if(e.dependencies!==null)for(let a=0;a<e.dependencies.length;a++){const m=e.dependencies[a];if(m.name!==e.name){let g=!1;for(let T=0;T<this.variables.length;T++)if(m.name===this.variables[T].name){g=!0;break}if(!g)return"Variable dependency not found. Variable="+e.name+", dependency="+m.name}i[m.name]={value:null},o.fragmentShader=`
uniform sampler2D `+m.name+`;
`+o.fragmentShader}}return this.currentTextureIndex=0,null},this.compute=function(){const t=this.currentTextureIndex,e=this.currentTextureIndex===0?1:0;for(let o=0,i=this.variables.length;o<i;o++){const a=this.variables[o];if(a.dependencies!==null){const m=a.material.uniforms;for(let g=0,T=a.dependencies.length;g<T;g++){const w=a.dependencies[g];m[w.name].value=w.renderTargets[t].texture}}this.doRenderTarget(a.material,a.renderTargets[e])}this.currentTextureIndex=e},this.getCurrentRenderTarget=function(t){return t.renderTargets[this.currentTextureIndex]},this.getAlternateRenderTarget=function(t){return t.renderTargets[this.currentTextureIndex===0?1:0]},this.dispose=function(){c.dispose();const t=this.variables;for(let e=0;e<t.length;e++){const o=t[e];o.initialValueTexture&&o.initialValueTexture.dispose();const i=o.renderTargets;for(let a=0;a<i.length;a++)i[a].dispose()}};function f(t){t.defines.resolution="vec2( "+r.toFixed(1)+", "+s.toFixed(1)+" )"}this.addResolutionDefine=f;function d(t,e){e=e||{};const o=new E({name:"GPUComputationShader",uniforms:e,vertexShader:h(),fragmentShader:t});return f(o),o}this.createShaderMaterial=d,this.createRenderTarget=function(t,e,o,i,a,m){return t=t||r,e=e||s,o=o||S,i=i||S,a=a||y,m=m||y,new O(t,e,{wrapS:o,wrapT:i,minFilter:a,magFilter:m,format:R,type:v,depthBuffer:!1})},this.createTexture=function(){const t=new Float32Array(r*s*4),e=new N(t,r,s,R,_);return e.needsUpdate=!0,e},this.renderTexture=function(t,e){x.passThruTexture.value=t,this.doRenderTarget(l,e),x.passThruTexture.value=null},this.doRenderTarget=function(t,e){const o=n.getRenderTarget(),i=n.xr.enabled,a=n.shadowMap.autoUpdate;n.xr.enabled=!1,n.shadowMap.autoUpdate=!1,c.material=t,n.setRenderTarget(e),c.render(n),c.material=l,n.xr.enabled=i,n.shadowMap.autoUpdate=a,n.setRenderTarget(o)};function h(){return`void main()	{

	gl_Position = vec4( position, 1.0 );

}
`}function C(){return`uniform sampler2D passThruTexture;

void main() {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	gl_FragColor = texture2D( passThruTexture, uv );

}
`}}}const oe=`#define GLSLIFY 1
uniform sampler2D uTexPos;
uniform sampler2D uTexVel;

attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main(){
  vec3 pos = texture(uTexPos, aTexCoord).xyz;
  csm_Position.xyz = pos;

  vTexCoord = aTexCoord;

}`,se=`#define GLSLIFY 1
uniform sampler2D uTexPos;
uniform sampler2D uTexPoint;

varying vec2 vTexCoord;

void main(){
  vec4 particle = texture(uTexPos, vTexCoord);
  vec3 pos = particle.xyz;
  float life = particle.w;

  vec3 col = sin(vec3(3,2,1) + dot(cos(pos), vec3(2.)))*.5+.5;

  vec2 uv = gl_PointCoord-.5;
  // float d = length(uv);
  float d = texture(uTexPoint, gl_PointCoord).r;
  d *= pow(.2/length(uv),2.);
  // d = .1/d;
  if(d<.01){
    discard;
  }

  float fadeInOut = smoothstep(.5,.0,abs(life-.5));

  csm_FragColor.rgb = col * d;
  csm_FragColor.a = fadeInOut;
}`,ie=`#define GLSLIFY 1
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

// uniform sampler2D texPos;
// uniform sampler2D texVel;
uniform float uTime;
uniform float uDelta;

void main(){
  float t =uTime;
  
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture(texPos, uv).rgb;
  vec3 vel = texture(texVel, uv).rgb;

  // 速度大小
  float velLen = snoise(pos);
  velLen = smoothstep(-.4, 1., velLen) * 2.;

  // 速度方向改变
  vec3 velOff = vec3(
    snoise(pos+vec3(1.,0.,t)),
    snoise(pos+vec3(0.,1.,0.)),
    snoise(pos+vec3(0.,0.,1.))
  );

  vel = velOff;
  vel = normalize(vel) * velLen;

  gl_FragColor = vec4(vel, 1);
}`,le=`#define GLSLIFY 1
// uniform sampler2D texPos;
// uniform sampler2D texVel;
uniform float uTime;
uniform float uDelta;
uniform sampler2D uDefaultPos;

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec3 pos_def = texture(uDefaultPos, uv).xyz;

  float t = uTime;
  float dt = uDelta;

  vec4 particle = texture(texPos, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;

  vec3 vel = texture(texVel, uv).rgb;
  pos += vel * uDelta;

  life += dt * .1;

  if(life >= 1.){
    pos = pos_def;
    life = mod(life, 1.);
  }

  gl_FragColor = vec4(pos, life);
}`,{cos:V,sin:z,random:D,PI:I,ceil:ue,sqrt:ce}=Math;function xe(p){const r=p.image.data;for(let s=0;s<r?.length;s++){const n=s*4,v=D()*I,x=D()*I*2,l=D()*1+2,c=l*V(x)*V(v),f=l*V(x)*z(v),d=l*z(x);r[n+0]=c,r[n+1]=f,r[n+2]=d,r[n+3]=D()}}function de(p){const r=p.image.data;for(let s=0;s<r?.length;s++){const n=s*4;r[n+0]=1,r[n+1]=1,r[n+2]=1,r[n+3]=0}}function me(p){const{gl:r}=J(),s=L(),{gpuCompute:n,posVar:v,velVar:x}=b.useMemo(()=>{const l=new ae(p,p,r),c=l.createTexture(),f=l.createTexture();xe(c),de(f);const d=l.addVariable("texPos",le,c),h=l.addVariable("texVel",ie,f);return d.material.uniforms={...s,uDefaultPos:new F(c)},h.material.uniforms={...s},l.setVariableDependencies(d,[d,h]),l.setVariableDependencies(h,[d,h]),l.init(),{gpuCompute:l,posVar:d,velVar:h}},[r,p]);return{gpuCompute:n,posVar:v,velVar:x}}function pe(){const r=ue(ce(4e3)),{geo:s}=b.useMemo(()=>{const t=new Float32Array(12e3),e=new Float32Array(4e3*2);for(let i=0;i<r;i++)for(let a=0;a<r;a++){const g=(a*r+i)*2,T=(i+.5)/r,w=(a+.5)/r;e[g+0]=T,e[g+1]=w}const o=new M;return o.setAttribute("position",new j(t,3)),o.setAttribute("aTexCoord",new j(e,2)),{geo:o}},[]),{gpuCompute:n,posVar:v,velVar:x}=me(r),l=L(),c=X(Z("/img/texture/particle/star_09.png"));c.minFilter=y,c.magFilter=y;const f={...l,uTexPos:new F(n.getCurrentRenderTarget(v).texture),uTexVel:new F(n.getCurrentRenderTarget(x).texture),uTexPoint:new F(c)},d=b.useRef(null),h=b.useRef(null);W(()=>{n.compute(),f.uTexPos.value=n.getCurrentRenderTarget(v).texture,f.uTexVel.value=n.getCurrentRenderTarget(x).texture,d.current.map=n.getCurrentRenderTarget(v).texture,h.current.map=n.getCurrentRenderTarget(x).texture});const C=b.useRef(null);return Y({showHelper:{value:!1,onChange(t){C.current.visible=t}}}),u.jsxs(u.Fragment,{children:[u.jsx("points",{geometry:s,children:u.jsx(K,{baseMaterial:Q,color:16777215,uniforms:f,vertexShader:oe,fragmentShader:se,size:.1,sizeAttenuation:!0,transparent:!0,blending:k})}),u.jsxs("group",{ref:C,children:[u.jsxs("mesh",{scale:2,position:[-4,0,0],children:[u.jsx("planeGeometry",{}),u.jsx("meshBasicMaterial",{ref:d,side:A})]}),u.jsxs("mesh",{scale:2,position:[4,0,0],children:[u.jsx("planeGeometry",{}),u.jsx("meshBasicMaterial",{ref:h,side:A})]})]})]})}const _e=G(function(){return u.jsx("div",{className:"h-screen",children:u.jsxs(q,{children:[u.jsx($,{position:"top-left"}),u.jsx(H,{}),u.jsx(pe,{})]})})});export{_e as default};
