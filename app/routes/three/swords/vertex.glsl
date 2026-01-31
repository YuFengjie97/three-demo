uniform float uTime;
uniform sampler2D uTexPos;
uniform sampler2D uTexVel;


attribute float instanceId;
attribute vec2 texCoord;


varying vec3 vCol;
varying vec3 vPos;
varying vec2 vUv;


mat2 rotate(float a){
  float c = cos(a);
  float s = sin(a);
  return mat2(c,-s,s,c);
}

mat3 rotateX(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(
    1,0,0,
    0,c,-s,
    0,s,c
  );
}
mat3 rotateY(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(
    c,0,s,
    0,1,0,
    -s,0,c
  );
}
mat3 rotateZ(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(
    c,-s,0,
    s,c,0,
    0,0,1
  );
}

void main(){

  float t = uTime;

  float id = instanceId;

  // 这里是模型的顶点位置,不是gpu里的粒子位置
  vec3 pos = csm_Position;

  // 因为用的是csm,不需要手动对mesh的变换进行手动转换
  // pos = mat3(modelMatrix) * pos;

  // 速度向量
  vec3 vel = texture(uTexVel, texCoord).rgb;


  float the = acos(vel.y);
  float phi = atan(vel.z, vel.x);
  pos = rotateY(phi) * rotateZ(the+PI) *  pos;  // 这里theta + PI 是因为模型默认指向vec3(0,-1,0)


  // 所有顶点位置都按照gpu粒子位置进行偏移来更新模型位置
  pos += texture(uTexPos, texCoord).rgb;

  vUv = uv;
  vPos = pos;
  vCol = sin(vec3(3,2,1) + id*1.3)*.5+.5;
  csm_Position = pos;
}