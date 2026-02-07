"use client"

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MOLTMAP_CONFIG } from '@/lib/moltmap/constants';

// Inline shaders for MVP1
const earthVertexShader = `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  
  void main() {
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const earthFragmentShader = `
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
`;

export default function Earth() {
  const { material, geometry } = useMemo(() => {
    const geo = new THREE.SphereGeometry(MOLTMAP_CONFIG.earth.radius, 64, 64);
    
    const mat = new THREE.ShaderMaterial({
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
      uniforms: {
        lightDirection: { value: new THREE.Vector3(5, 3, 5).normalize() },
        time: { value: 0 },
      },
    });

    return { material: mat, geometry: geo };
  }, []);

  useFrame((state) => {
    if (material.uniforms) {
      material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh geometry={geometry} material={material} />
  );
}
