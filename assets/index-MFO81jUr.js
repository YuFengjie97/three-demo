import{w as m,o as e,r as p}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as l,B as f,h as r,A as u,g as d,U as i}from"./extends-YMrKHCaR.js";import{j as y}from"./three-custom-shader-material.es-CvH9ZsDg.js";import{u as g}from"./useUniformTime-ijtfSmMG.js";import{a as h}from"./asset-BvcpElq9.js";import{O as z}from"./OrbitControls-COI4Iw9o.js";import{u as C}from"./Texture-XdtwziCo.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-DIYVCsg1.js";const w=`#define GLSLIFY 1
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

#define s1(v) (sin(v)*.5+.5)

#define SP0 1.
#define SP1 1.
#define SP2 2.4

uniform float uTime;
uniform float uDelta;
uniform float count;

attribute float id;

varying vec3 vCol;

mat2 rotate(float a){
  float s = sin(a);
  float c = cos(a);
  return mat2(c,-s,s,c);
}

vec3 fold(vec3 p) {
	vec3 nc = vec3(-.5, -.809017, .309017);
	for (int i = 0; i < 5; i++) {
		p.xy = abs(p.xy);
		p -= 2.*min(0., dot(p, nc))*nc;
	}
	return p - vec3(0, 0, 1.275);
}

void main(){
  vec3 p = csm_Position;
  float t = uTime;

  float ii = (id / count);
  float ang = ii * PI * 2.;

  vec2 off = vec2(cos(ang), sin(ang));
  p.xy -= off*2.;

  p.yz = rotate(ang + t + ii * 20.) * p.yz;
  p.xz = rotate(ang + t + ii * 20.) * p.xz;
  // p.xy = rotate(ang + t * s1(ang)*2.) * p.xy;

  vec3 vel = vec3(
    snoise(p+vec3(1,0,0)),
    snoise(p+vec3(0,1,t)),
    snoise(p+vec3(0,0,1))
  );

  p += vel;

  vCol = s1(vec3(3,2,1)+id*.4+p);

  csm_Position = p;
}`,b=`#define GLSLIFY 1
uniform float uTime;
uniform float uDelta;
uniform sampler2D tex;

varying vec3 vCol;

void main(){
  // vec2 uv = gl_PointCoord-.5;
  // float d = length(uv);
  // d = .1/d;
  
  vec2 uv = gl_PointCoord;
  float d = texture(tex, uv).r;

  csm_FragColor = vec4(vCol*d, d);
}`;function j(){const{geo:s}=p.useMemo(()=>{const o=new f,n=new Float32Array(5e3);for(let t=0;t<5e3;t++)n[t]=t;o.setAttribute("id",new r(n,1));const v=new Float32Array(5e3*3);return o.setAttribute("position",new r(v,3)),{geo:o}},[]),c=g(),x=C(h("/img/texture/particle/star_09.png")),a={...c,count:new i(5e3),tex:new i(x)};return e.jsx("points",{geometry:s,children:e.jsx(y,{uniforms:a,baseMaterial:d,size:.2,vertexShader:w,fragmentShader:b,transparent:!0,alphaTest:1e-4,depthWrite:!1,blending:u})})}const B=m(function(){return e.jsx("div",{className:"h-screen",children:e.jsxs(l,{children:[e.jsx(z,{}),e.jsx("axesHelper",{args:[10]}),e.jsx(j,{})]})})});export{B as default};
