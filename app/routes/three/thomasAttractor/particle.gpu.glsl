uniform float uTime;
uniform float uDelta;
uniform float speed;
// uniform float bFactor;




vec3 getVel(vec3 p, float bFactor){
  // bFactor = 0.208186;
  bFactor = .19;
  // bFactor = (sin(uTime)*.5+.5)*.29+.01;
  vec3 v = sin(p.yzx)- bFactor * p;
  return v;
}

vec3 getVel2(vec3 p){
  // 输入 p 是当前位置，返回速度向量 v
  float a = 1.4;
  vec3 v;
  v.x = -a * p.x - 4.0 * p.y - 4.0 * p.z - (p.y * p.y);
  v.y = -a * p.y - 4.0 * p.z - 4.0 * p.x - (p.z * p.z);
  v.z = -a * p.z - 4.0 * p.x - 4.0 * p.y - (p.x * p.x);
  // 这是一个循环结构，可以用 swizzle 简化写法吗？
  // 可以尝试： v = -a * p - 4.0 * p.yzx - 4.0 * p.zxy - p.yzx * p.yzx;
  return v;
}

vec3 getVel3(vec3 p){
  float a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
  vec3 v;
  v.x = (p.z - b) * p.x - d * p.y;
  v.y = d * p.x + (p.z - b) * p.y;
  v.z = c + a * p.z - (p.z * p.z * p.z) / 3.0 - (p.x * p.x + p.y * p.y) * (1.0 + e * p.z) + f * p.z * p.x * p.x * p.x;
  return v;
}

vec3 getVel4(vec3 p){
  float sigma = 10.0;
  float rho = 28.0;
  float beta = 8.0 / 3.0;
  vec3 v;
  v.x = sigma * (p.y - p.x);
  v.y = p.x * (rho - p.z) - p.y;
  v.z = p.x * p.y - beta * p.z;
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(posTex, uv);
  vec3 pos = particle.xyz;
  float seed = particle.w;

  vec3 vel = getVel(pos, seed);
  // vec3 vel = getVel4(pos)*.1;

  pos += vel * uDelta * speed;

  gl_FragColor = vec4(pos, seed);
}