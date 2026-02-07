// Atmosphere rim shader (fresnel effect)
uniform vec3 viewDirection;
uniform float intensity;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  
  // Fresnel effect (rim lighting)
  float fresnel = 1.0 - abs(dot(normal, viewDir));
  fresnel = pow(fresnel, 2.0);
  
  // Only show at edges
  float alpha = fresnel * intensity;
  
  // Subtle blue glow
  vec3 color = vec3(0.3, 0.5, 0.8) * alpha;
  
  gl_FragColor = vec4(color, alpha * 0.3);
}
