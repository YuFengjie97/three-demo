uniform vec3 uDepthCol;
uniform vec3 uSurfaceCol;


varying vec3 vCol;



void main(){
  csm_DiffuseColor.rgb = vCol;
}