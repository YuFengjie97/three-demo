// uniform sampler2D texPos;
// uniform sampler2D texVel;
uniform float uTime;
uniform float uDelta;
uniform sampler2D uDefaultPos;


void main(){
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec3 pos_def = texture(uDefaultPos, uv).xyz;

  float t = uTime;
  float dt = uDelta;

  vec4 particle = texture(texPos, uv);
  vec3 pos = particle.xyz;
  float life = particle.w;


  vec3 vel = texture(texVel, uv).rgb;
  pos += vel * uDelta;

  life += dt * 2.1;

  if(life >= 1.){
    pos = pos_def;
    life = mod(life, 1.);
  }

  gl_FragColor = vec4(pos, life);
}