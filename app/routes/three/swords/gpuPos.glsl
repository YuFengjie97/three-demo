

uniform float uTime;
uniform float uDelta;



void main(){
  float t = uTime;
  float dt = uDelta;
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 obj = texture(texPos, uv);
  vec3 pos = obj.xyz;
  float id = obj.w;
  vec3 vel = texture(texVel, uv).xyz;
  
  pos += vel * dt;

  gl_FragColor = vec4(pos, id);
}