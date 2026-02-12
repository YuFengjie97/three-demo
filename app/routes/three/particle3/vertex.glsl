#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')


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
    snoise3(p+vec3(1,0,0)),
    snoise3(p+vec3(0,1,t)),
    snoise3(p+vec3(0,0,1))
  );

  p += vel;

  vCol = s1(vec3(3,2,1)+id*.4+p);

  csm_Position = p;
}