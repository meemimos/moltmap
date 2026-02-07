// Earth surface shader
uniform vec3 lightDirection;
uniform float time;

varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(lightDirection);
  
  // Day/night terminator
  float dotNL = dot(normal, lightDir);
  float dayNight = smoothstep(-0.2, 0.2, dotNL);
  
  // Base color (subtle, low saturation)
  vec3 baseColor = vec3(0.2, 0.25, 0.3);
  
  // Day side (slightly brighter)
  vec3 dayColor = baseColor * 1.2;
  // Night side (darker)
  vec3 nightColor = baseColor * 0.4;
  
  // Blend day/night
  vec3 color = mix(nightColor, dayColor, dayNight);
  
  // Subtle variation based on position
  float variation = sin(vWorldPosition.x * 2.0 + vWorldPosition.z * 3.0) * 0.05;
  color += variation;
  
  gl_FragColor = vec4(color, 1.0);
}
