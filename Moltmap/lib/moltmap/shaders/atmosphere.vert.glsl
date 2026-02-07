// Atmosphere vertex shader
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vViewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
