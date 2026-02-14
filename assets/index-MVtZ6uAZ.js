import{r as e,w as z,o as s}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{e as w,aj as C,_ as b,C as T,A,d as I,f as L,h as j}from"./extends-BlC2n1ra.js";import{d as S,U as D}from"./index-TeDTk6Ud.js";import{a as M}from"./asset-BvcpElq9.js";import{u as _}from"./useUniformTime-CTUI4CFg.js";import{j as E}from"./three-custom-shader-material.es-D7WJHKEE.js";import{T as F,p as P}from"./troika-three-text.esm-D4eO4ECZ.js";import"./index-7OC5HNn7.js";const U=e.forwardRef(({sdfGlyphSize:u=64,anchorX:c="center",anchorY:v="middle",font:a,fontSize:h=1,children:m,characters:l,onSync:f,...o},n)=>{const i=w(({invalidate:r})=>r),[t]=e.useState(()=>new F),[x,y]=e.useMemo(()=>{const r=[];let g="";return e.Children.forEach(m,p=>{typeof p=="string"||typeof p=="number"?g+=p:r.push(p)}),[r,g]},[m]);return C(()=>new Promise(r=>P({font:a,characters:l},r)),["troika-text",a,l]),e.useLayoutEffect(()=>{t.sync(()=>{i(),f&&f(t)})}),e.useEffect(()=>()=>t.dispose(),[t]),e.createElement("primitive",b({object:t,ref:n,font:a,text:y,anchorX:c,anchorY:v,fontSize:h,sdfGlyphSize:u},o),x)}),G=`#define GLSLIFY 1
#define s1(v) (sin(v)*.5+.5)
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

attribute float aTextId;

varying vec3 vCol;
varying vec2 vUv;
varying float vTextId;
varying float vLife;

// https://www.shadertoy.com/view/lsKcDD
mat3 lookAt( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);            // 相机前
	vec3 cp = vec3(sin(cr), cos(cr),0.0);  // 滚角
	vec3 cu = normalize( cross(cw,cp) );   // 相机右
	vec3 cv = normalize( cross(cu,cw) );   // 相机上
  return mat3( -cu, cv, cw );
}

void main(){
  float t = uTime;
  vec3 pos = csm_Position;
  // pos = lookAt(pos, cameraPosition, 0.) * pos;

  pos.z += snoise(vec3(pos.xy*2., aTextId+t))*.3;

  float lifeSpeed = (.1+s1(aTextId)*.2);
  float life = fract(t*lifeSpeed);
  float offsetRange = 15.;
  pos.z += life * offsetRange;
  
  csm_Position = pos;

  vCol = vec3(s1(aTextId*.2),.0,.0);
  // vCol = s1(vec3(3,2,1)+aTextId);

  vUv = uv;
  vTextId = aTextId;
  vLife = life;
}`,N=`#define GLSLIFY 1
//
// Description : Array and textureless GLSL 2D simplex noise function.
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

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

#define s1(v) (sin(v)*.5+.5)

uniform float uTime;

varying vec3 vCol;
varying vec2 vUv;
varying float vTextId;
varying float vLife;

float fbm(vec2 p){
  float n = 0.;
  n += snoise(p+vec2(vTextId*.2));
  n += .5*snoise(p*2.);
  n += .25*snoise(p*4.);
  n += .125*snoise(p*6.);
  return n;
}

void main(){
  float t = uTime;
  csm_FragColor = vec4(vCol*4.4,1);

  float n = fbm(vUv*4.) + sin(t+vTextId*.2);
  float burn = -n;
  n = smoothstep(0.,0.1,n);
  float glow = pow(.1/(burn), 4.);

  csm_FragColor.rgb += glow*vec3(1.,.1,.0);
  float transparent = 1.-abs(vLife-.5)*2.;
  csm_FragColor.a = n * transparent;
}`,q=`
我就踩着那宵小登高楼

人活一世何必随波流

你辱我，骂我何惧，强压怒火道友再来三喝碗酒

世人愚钝，笑我疯过头，人不轻狂怎风流

人间游，笑王侯，平凡何物看我随手丢

上山顶，摸星空，鲲化为鹏遨九州

安稳一世白走一遭，幡然醒悟怎奈白了头

翻重岭，测吉凶，何人敢定我去留

坐孤舟不言愁一壶浊酒入我喉

皆妖魔，杀，全部杀无赦，

我的心怀慈悲，左手拿着花名册，

杀，看那梅花落，七步之内必定尸骨堕，

再杀，踏江河走荒漠，苍穹如何被我斩破，一念之差，杀

因果

那是啥

剑下拜倒

鬼魅神佛

报应

有何惧

剑下拜倒

鬼魅神佛

看似疯癫性若仙，疯言乱语道真玄。

有缘参透其中秘，真假朦胧尽难全。

踩着那宵小登高楼，

人活一世何必随波流

你辱我，骂我何惧，强压怒火道友再来三喝碗酒

世人愚钝，笑我疯过头，人不轻狂怎风流，

人间游，笑王侯，平凡何物看我随手丢

神游天边的疯子，浑身上下筋骨都松弛，世间万物都有因果，小心引火烧身，悔不该当时

山尖为笔，汪洋为墨，星空为纸留下我傲人的提词

词如野火烧不尽的草原，原来为人一世

一生二二生三三生万物，身无碎银难行半步，步履蹒跚寻山间古树，树下观天腾云驾雾

呼，想把我卷入？善恶怎分，神识稳固，

侧耳倾听，万物声音，好像都在喊着一句不过众生皆苦

苦啊

我苦啊

世人皆苦

何处是家

苦啊

我苦啊

何人不苦

处处是家

尘世纷扰心缠乱，真言疯语意绵绵。

悟性开启方知晓，玄妙深藏在此间。
`,{random:d,floor:R}=Math;function k(){const u=M("/font/ttf/subset-STXINWEI.TTF"),c=q.split(/\n\s|，/),v=400,a=e.useMemo(()=>Array.from({length:v},(o,n)=>{const i=c[R(d()*c.length)],t=(d()-.5)*20,x=(d()-.5)*15,y=-d()*15;return{str:i,pos:[t,x,y]}}),[v]),m={..._()},l=e.useMemo(()=>new E({uniforms:m,baseMaterial:L,vertexShader:G,fragmentShader:N,side:I,transparent:!0,alphaTest:.1,depthWrite:!1,blending:A}),[]);function f(o){return function(n){const i=n.geometry,t=i.getAttribute("position").count,x=new Float32Array(t).fill(o);i.setAttribute("aTextId",new j(x,1))}}return a.map((o,n)=>s.jsx(U,{position:o.pos,font:u,material:l,onSync:f(n),children:o.str},n))}const J=z(function(){return e.useRef(null),s.jsx("div",{className:"h-screen",children:s.jsxs(T,{children:[s.jsx("fog",{attach:"fog",args:["#000000",10,20]}),s.jsx("directionalLight",{position:[0,5,10]}),s.jsx(k,{}),s.jsx(S,{children:s.jsx(D,{delay:[2,2.5],duration:[.1,.12],strength:[.2,.3],ratio:.85})})]})})});export{J as default};
