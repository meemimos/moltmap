"use client"

import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
// Inline shaders for MVP1
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vViewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
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
`;
import { MOLTMAP_CONFIG } from '@/lib/moltmap/constants';

export default function Atmosphere() {
  const { camera } = useThree();
  
  const { material, geometry } = useMemo(() => {
    const geo = new THREE.SphereGeometry(MOLTMAP_CONFIG.earth.atmosphereRadius, 64, 64);
    
    const mat = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        viewDirection: { value: new THREE.Vector3() },
        intensity: { value: 0.5 },
      },
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });

    return { material: mat, geometry: geo };
  }, []);

  // Update view direction based on camera
  useMemo(() => {
    const updateViewDirection = () => {
      if (material.uniforms) {
        const viewDir = camera.position.clone().normalize();
        material.uniforms.viewDirection.value = viewDir;
      }
    };
    
    updateViewDirection();
    camera.addEventListener('change', updateViewDirection);
    
    return () => {
      camera.removeEventListener('change', updateViewDirection);
    };
  }, [camera, material]);

  return (
    <mesh geometry={geometry} material={material}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
