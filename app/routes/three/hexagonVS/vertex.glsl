#pragma glslify: snoise = require('glsl-noise/simplex/3d')


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
