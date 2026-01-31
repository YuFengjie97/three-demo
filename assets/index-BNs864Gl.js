import{w as r,o as e,r as c}from"./chunk-EPOLDU6W-D-U-5P6E.js";import{C as n,O as i,b as x,J as a}from"./OrbitControls-CmBRG4Bd.js";import{j as v}from"./three-custom-shader-material.es-B41VK_Vk.js";import{u as p}from"./useUniformTime-DeKYjdeE.js";import{P as m}from"./Perf-9NpNtL2P.js";import"./index-7OC5HNn7.js";import"./three-custom-shader-material.es-DobAws7m.js";import"./index-n5PR1bfd.js";import"./client-EdRjCdko.js";const l=`#define GLSLIFY 1
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

uniform float uTime;

// attribute vec3 normal;
attribute vec4 tangent;

varying vec3 vCol;

// https://www.shadertoy.com/view/Xd2GR3
// { 2d cell id, distance to border, distnace to center )
vec4 hexagon( vec2 p ) 
{
	vec2 q = vec2( p.x*2.0*0.5773503, p.y + p.x*0.5773503 );
	
	vec2 pi = floor(q);
	vec2 pf = fract(q);

	float v = mod(pi.x + pi.y, 3.0);

	float ca = step(1.0,v);
	float cb = step(2.0,v);
	vec2  ma = step(pf.xy,pf.yx);
	
    // distance to borders
	float e = dot( ma, 1.0-pf.yx + ca*(pf.x+pf.y-1.0) + cb*(pf.yx-2.0*pf.xy) );

	// distance to center	
	p = vec2( q.x + floor(0.5+p.y/1.5), 4.0*p.y/3.0 )*0.5 + 0.5;
	float f = length( (fract(p) - 0.5)*vec2(1.0,0.85) );		
	
	return vec4( pi + ca - cb*ma, e, f );
}

void transform(inout vec3 pos){
  vec4 hex = hexagon(pos.xy);
  float height = snoise(vec3(hex.xy, uTime));
  pos.z += height;

  vCol = s1(vec3(3,2,1) + dot(cos(hex.xy*20.),vec2(2.)));
}

vec3 calcNormal(inout vec3 pos) {
  float e = .01;
  
  vec3 biTangent = normalize(cross(normal, tangent.xyz));

  vec3 posA = pos + tangent.xyz * e;
  vec3 posB = pos + biTangent.xyz * e;

  transform(pos);
  transform(posA);
  transform(posB);

  vec3 toA = posA - pos;
  vec3 toB = posB - pos;

  return normalize(cross(toA, toB));
}

void main(){
  vec3 pos = csm_Position;
  pos *= 20.;

  csm_Normal = calcNormal(pos);

  csm_Position = pos;
}
`,y=`#define GLSLIFY 1
varying vec3 vCol;

void main(){
  csm_DiffuseColor.rgb = vCol;
}`;function d(){const t={...p()},{geo:s}=c.useMemo(()=>{const o=new x(1,1,400,400);return o.computeTangents(),console.log(o),{geo:o}},[]);return e.jsx("mesh",{geometry:s,scale:2,"rotation-x":-Math.PI/2,children:e.jsx(v,{uniforms:t,baseMaterial:a,vertexShader:l,fragmentShader:y,roughness:.1,metalness:.5})})}const T=r(function(){return e.jsx("div",{className:"h-screen",children:e.jsxs(n,{camera:{position:[0,6,6]},children:[e.jsx(m,{position:"top-left"}),e.jsx("axesHelper",{args:[20]}),e.jsx(i,{}),e.jsx("ambientLight",{}),e.jsx("pointLight",{position:[0,6,0],intensity:10}),e.jsx(d,{})]})})});export{T as default};
