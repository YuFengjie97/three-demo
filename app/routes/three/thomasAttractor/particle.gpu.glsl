uniform float uTime;
uniform float uDelta;
uniform float speed;
// uniform float bFactor;

// const float bFactor = 0.208186;
const float bFactor = 0.2;


vec3 getVel(vec3 p){
  vec3 v = sin(p.yzx)- bFactor * p;
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 particle = texture(posTex, uv);
  vec3 pos = particle.xyz;

  vec3 vel = getVel(pos);
  pos += vel * uDelta * speed;

  float seed = dot(vel, vec3(1));


  gl_FragColor = vec4(pos, seed);
}