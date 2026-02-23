import{r as E,w as se,o as n}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{aA as ne,R as ie,aB as J,C as ce,aC as ae,e as xe,U as N,h as le,u as ve,A as me,g as ue}from"./extends-D4P9RtWV.js";import{j as ee}from"./three-custom-shader-material.es-CZEjquAF.js";import{a as te}from"./asset-BvcpElq9.js";import{u as oe}from"./useUniformTime-CJanb7xe.js";import{d as pe,w as fe}from"./index-jtwq2L8m.js";import{O as ye}from"./OrbitControls-B0FQFszE.js";import{L as de}from"./Loader-C5B-FrZC.js";import{u as ge}from"./Gltf-DOWYLoBM.js";import{u as ze}from"./Texture-DuyHYiDQ.js";import{G as he}from"./GPUComputationRenderer-D_JtaFqY.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-B7Ao4tUH.js";import"./constants-czf0ebvd.js";const Ce=`#define GLSLIFY 1
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

uniform float uTime;
uniform float uDelta;

// attribute vec3 normal;

varying vec3 vPos;
varying vec3 vCol;

void main(){
  float t = uTime;
  vec3 p = csm_Position;

  // vec3 vel = vec3(
  //   snoise3(p*.4+vec3(1.,0.,0.)),
  //   snoise3(p*.4+vec3(0.,1.,t)),
  //   snoise3(p*.4+vec3(0.,0.,1.))
  // );
  // p += vel*.2;

  p += sin(p.zxy*2.+vec3(0,2,0)*t)     *.2;
  p += sin(p.zxy*4.)*0.5               *.2;
  p += sin(p.zxy*8.)*0.2               *.2;

  // vCol = sin(vec3(3,2,1)+p-t*.1)*.5+.5;
  vCol = sin(vec3(3,2,1)+normal-t*.1)*.5+.5;

  csm_Position = p;
}
`,we=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;

varying vec3 vCol;

void main(){
  // csm_FragColor = vec4(1,0,0,1);

  // csm_DiffuseColor = vec4(vCol,1);
}
`,De=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;
uniform sampler2D uPosTex;

attribute vec2 aParticleCoord;

varying vec3 vCol;
varying float vLife;

void main(){
  float t = uTime;
  vec4 particle = texture(uPosTex, aParticleCoord);
  vec3 pos = particle.xyz;
  float life = particle.w;
  vLife = sin(life*PI);

  csm_Position = pos;
  vCol = sin(vec3(3,2,1)+pos+dot(aParticleCoord,vec2(.1)))*.5+.5;
}
`,be=`#define GLSLIFY 1
uniform sampler2D uParticleTex;

varying vec3 vCol;
varying float vLife;

void main(){
  // vec2 uv = gl_PointCoord-.5;
  // vec3 col = vec3(1,0,0);
  // float d = length(uv);
  // d = smoothstep(.2,0.,d);
  // csm_FragColor = vec4(col*d, d);

  vec2 uv = gl_PointCoord;
  float d = texture(uParticleTex, uv).r;
  csm_FragColor = vec4(vCol*d, d*vLife);
}`,Te=`#define GLSLIFY 1
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

uniform float uTime;
uniform float uDelta;
uniform sampler2D uDefaultPosTex;
uniform sampler3D uNoise3DTex;

void main(){
  float t = uTime;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(texPos, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;

  life += uDelta;
  if(life>1.){
    life = fract(life);  // 重置life
    pos = texture(uDefaultPosTex, uv).xyz; // 根据默认位置重置
  }

  // flowfield
  vec3 vel = vec3(
    snoise(pos*.4+vec3(1.,0.,0.)),
    snoise(pos*.4+vec3(0.,1.,t)),
    snoise(pos*.4+vec3(0.,0.,1.))
  );
  // vec3 vel = texture(uNoise3DTex, pos*.4+vec3(0.,t,0.)).rgb;

  float strength = snoise(pos+vec3(0,t,0));
  strength = smoothstep(.1,0.,strength);

  pos += vel * strength * uDelta * 4.;
  gl_FragColor = vec4(pos, life);
}`,je=1/3,d=1/6,Q=i=>Math.floor(i)|0,$=new Float64Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);function _e(i=Math.random){const t=Le(i),r=new Float64Array(t).map(s=>$[s%12*3]),e=new Float64Array(t).map(s=>$[s%12*3+1]),o=new Float64Array(t).map(s=>$[s%12*3+2]);return function(l,v,c){let u,f,_,h;const a=(l+v+c)*je,p=Q(l+a),m=Q(v+a),M=Q(c+a),L=(p+m+M)*d,R=p-L,U=m-L,re=M-L,g=l-R,z=v-U,y=c-re;let C,w,D,b,T,j;g>=z?z>=y?(C=1,w=0,D=0,b=1,T=1,j=0):g>=y?(C=1,w=0,D=0,b=1,T=0,j=1):(C=0,w=0,D=1,b=1,T=0,j=1):z<y?(C=0,w=0,D=1,b=0,T=1,j=1):g<y?(C=0,w=1,D=0,b=0,T=1,j=1):(C=0,w=1,D=0,b=1,T=1,j=0);const V=g-C+d,Y=z-w+d,B=y-D+d,O=g-b+2*d,W=z-T+2*d,X=y-j+2*d,H=g-1+3*d,K=z-1+3*d,Z=y-1+3*d,G=p&255,I=m&255,k=M&255;let P=.6-g*g-z*z-y*y;if(P<0)u=0;else{const x=G+t[I+t[k]];P*=P,u=P*P*(r[x]*g+e[x]*z+o[x]*y)}let A=.6-V*V-Y*Y-B*B;if(A<0)f=0;else{const x=G+C+t[I+w+t[k+D]];A*=A,f=A*A*(r[x]*V+e[x]*Y+o[x]*B)}let S=.6-O*O-W*W-X*X;if(S<0)_=0;else{const x=G+b+t[I+T+t[k+j]];S*=S,_=S*S*(r[x]*O+e[x]*W+o[x]*X)}let F=.6-H*H-K*K-Z*Z;if(F<0)h=0;else{const x=G+1+t[I+1+t[k+1]];F*=F,h=F*F*(r[x]*H+e[x]*K+o[x]*Z)}return 32*(u+f+_+h)}}function Le(i){const r=new Uint8Array(512);for(let e=0;e<512/2;e++)r[e]=e;for(let e=0;e<512/2-1;e++){const o=e+~~(i()*(256-e)),s=r[e];r[e]=r[o],r[o]=s}for(let e=256;e<512;e++)r[e]=r[e-256];return r}function Pe(i=32,t=.1){return E.useMemo(()=>{const o=new Float32Array(131072),s=_e();let l=0;for(let c=0;c<32;c++)for(let u=0;u<32;u++)for(let f=0;f<32;f++){const _=s(f*t,u*t,c*t);o[l]=_;const h=s(f*t+100,u*t,c*t);o[l+1]=h;const a=s(f*t,u*t+100,c*t);o[l+2]=a,o[l+3]=1,l+=4}const v=new ne(o,32,32,32);return v.format=ie,v.wrapS=J,v.wrapT=J,v.wrapR=J,v.needsUpdate=!0,v},[])}const{random:q,sqrt:Ae,ceil:Se}=Math;function Fe(i,t){const r=i.image.data;for(let e=0;e<r.length/4;e++){const o=e*4,s=e*3,l=t[s+0],v=t[s+1],c=t[s+2];r[o+0]=l??(q()-.5)*10,r[o+1]=v??(q()-.5)*10,r[o+2]=c??(q()-.5)*10,r[o+3]=q()}}function Me({...i}){const t=i.geometry;console.log(t);const r=t.getAttribute("position"),e=r.count,o=Se(Ae(e));console.log({count:e,size:o});const{gl:s}=xe(),l=oe(),v=Pe(),{gpuCompute:c,posVar:u}=E.useMemo(()=>{const a=new he(o,o,s),p=a.createTexture();Fe(p,r.array);const m=a.addVariable("texPos",Te,p);return m.material.uniforms={...l,uDefaultPosTex:new N(p),uNoise3DTex:new N(v)},a.setVariableDependencies(m,[m]),a.init(),{gpuCompute:a,posVar:m}},[s,o]),{particleCoord:f}=E.useMemo(()=>{const a=new Float32Array(e*2);for(let p=0;p<o;p++)for(let m=0;m<o;m++){const L=(m*o+p)*2,R=(p+.5)/o,U=(m+.5)/o;a[L+0]=R,a[L+1]=U}return{particleCoord:a}},[e,o]);t.setAttribute("aParticleCoord",new le(f,2));const _=ze(te("/img/texture/particle/star_09.png")),h={...l,uPosTex:new N(c.getCurrentRenderTarget(u).texture),uParticleTex:new N(_)};return ve(()=>{c.compute(),h.uPosTex.value=c.getCurrentRenderTarget(u).texture}),n.jsx("points",{...i,children:n.jsx(ee,{uniforms:h,baseMaterial:ue,vertexShader:De,fragmentShader:be,size:.07,transparent:!0,depthWrite:!1,blending:me,toneMapped:!1})})}function Ge({...i}){const r={...oe()};return n.jsx(n.Fragment,{children:n.jsx("mesh",{...i,children:n.jsx(ee,{uniforms:r,baseMaterial:ae,vertexShader:Ce,fragmentShader:we,toneMapped:!0})})})}function Ie(){const{nodes:i,materials:t}=ge(te("/model/tree-transformed.glb")),r=i.Oak_Bark_2_SHD_trunk_0.geometry,e=i.olqeejih_2K_rsSprite1_0.geometry;return console.log({trunkGeo:r,leafGeo:e}),n.jsxs(n.Fragment,{children:[n.jsx(Ge,{geometry:r,scale:.3}),n.jsx(Me,{geometry:e,scale:.3})]})}const Ze=se(function(){return n.jsxs("div",{className:"h-screen",children:[n.jsxs(ce,{camera:{position:[0,0,5]},children:[n.jsx(ye,{target:[0,3,0]}),n.jsx("ambientLight",{intensity:10}),n.jsx(E.Suspense,{fallback:null,children:n.jsx(Ie,{})}),n.jsx(pe,{children:n.jsx(fe,{})})]}),n.jsx(de,{})]})});export{Ze as default};
