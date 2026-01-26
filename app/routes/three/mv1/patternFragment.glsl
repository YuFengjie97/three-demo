#pragma glslify: snoise = require('glsl-noise/simplex/3d')


#define s1(v) (sin(v)*.5+.5)

uniform float uTime;
uniform float uDelta;
uniform sampler2D uFreqTex;

varying vec2 vUv;




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

void main(){
  float t = uTime;
  float dt = uDelta;


  vec2 uv = vUv-.5;
  uv *= 200.;
  


  vec4 hex = hexagon(uv);

  // float d = pow(.2/min(hex.w,hex.z), 1.);
  // float d = .2/(hex.z-.1);
  // float d = .2/(hex.z);
  float d = smoothstep(1.5,1.49,hex.w) + 1./hex.z;

  float fre = texture(uFreqTex, vec2(.2, 0.)).r;

  float n = snoise(vec3(hex.xy*.1, fre*1. +t*.1));

  float alpha = 1.;
  if(n<0.5){
    // alpha = smoothstep(0.,.5,n);
    alpha = n;
  }

  vec3 col = sin(vec3(3,2,1)+ n * 10.)*.5+.5;
  col = col * d * (smoothstep(-1.,1.,n)*20.+.1);

  col=tanh(col / 100.);
  csm_FragColor = vec4(col, d * alpha);

}