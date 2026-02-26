#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uDelta;

varying vec3 vCol;

// 笛卡尔 -> 球面坐标
vec3 rtp(vec3 p){
  float r = length(p);
  float the = acos(p.z/r);
  float phi = atan(p.y,p.x);
  return vec3(r,the,phi);
}

// 球面坐标 -> 笛卡尔
vec3 xyz(vec3 rtp){
  float r = rtp.x;
  float the = rtp.y;
  float phi = rtp.z;
  float x = r*sin(the)*cos(phi);
  float y = r*sin(the)*sin(phi);
  float z = r*cos(the);
  return vec3(x,y,z);
}

vec3 turbulence(vec3 p){
  p += sin(p.zxy   +uTime) * 1.  * .2;
  p += sin(p.zxy*2.+uTime) * .5  * .2;
  p += sin(p.zxy*4.+uTime) * .25 * .2;
  return p;
}

vec3 snoise3x3(vec3 p){
  vec3 v = vec3(
    snoise3(p + vec3(1.,0.,0.)),
    snoise3(p + vec3(0.,uTime,0.)),
    snoise3(p + vec3(0.,0.,1.))
  );
  return normalize(v);
}

vec3 snoise3X3(vec3 p){
  vec3 offset1 = vec3(12.34, 56.78,   90.12);
  vec3 offset2 = vec3(54.32, 98.76+uTime, 21.09);
  vec3 offset3 = vec3(43.21, 87.65,   10.98);

  vec3 vel = vec3(
    snoise3(p * vec3(1.) + offset1), // X轴噪音
    snoise3(p * vec3(1.) + offset2), // Y轴噪音
    snoise3(p * vec3(1.) + offset3)  // Z轴噪音
  );
  return normalize(vel);
}


void main(){
  vec3 p = csm_Position;
  vec3 p1 = rtp(p);
  // p1 = turbulence(p1);
  p1 += snoise3X3(cos(p1*2.))*.1;
  
  vCol = sin(vec3(3,2,1)+p1)*.5+.5;

  vec3 p2 = xyz(p1);
  csm_Position = p2;
}