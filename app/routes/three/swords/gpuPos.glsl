

uniform float uTime;
uniform float uDelta;



void main(){
  float t = uTime;
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  vec3 pos = texture(texPos, uv).rgb;
  vec3 vel = texture(texVel, uv).rgb;
  

  // pos += vel * .1;

  gl_FragColor = vec4(pos, 1.);
}