uniform float uTime;
uniform float uDelta;
uniform float uHeight;
uniform float uRotateSpeed;
uniform float uSwingAmp;
uniform float uSwingSpeed;

varying vec2 vUv;
varying vec3 vNormal2;
varying vec3 vPos;

mat2 rotate(float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c,-s,s,c);
}

void main(){
  vec3 pos = csm_Position;
  // vCol = pos;
  vPos = pos;

  float ang = atan(pos.z, pos.x);
  float radiusByH = smoothstep(.3*uHeight,-.7*uHeight,pos.y)*6. +
                    smoothstep(.5*uHeight,2.1*uHeight,pos.y)*10.;
  float radius = 2. +  sin(ang*8.)*.1 + radiusByH*1.5;
  pos.xz = vec2(cos(ang), sin(ang)) * radius;
  pos.xz = rotate(pos.y+uTime*uRotateSpeed) * pos.xz;

  // 摇摆
  float swingAng = sin(pos.y*.5+uTime*uSwingSpeed);
  vec2 swingOff = vec2(cos(swingAng), sin(swingAng))*uSwingAmp;
  pos.xz += swingOff;

  vUv = uv;
  vNormal2 = normal;

  csm_Position = pos;
}