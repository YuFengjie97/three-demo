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

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(posTex, uv);
  vec3 pos = particle.xyz;
  float seed = particle.w;

  vec3 vel = getVel(pos, seed);
  pos += vel * uDelta * speed;

  gl_FragColor = vec4(pos, seed);
}