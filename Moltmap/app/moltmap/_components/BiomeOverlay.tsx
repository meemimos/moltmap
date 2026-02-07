"use client"

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BIOMES } from '@/lib/moltmap/mapping';
import { getBiomePosition } from '@/lib/moltmap/geo';
import { MOLTMAP_CONFIG } from '@/lib/moltmap/constants';

/**
 * Procedural biome overlay on Earth surface
 * Uses shader to blend biome colors
 */
export default function BiomeOverlay() {
  const { material, geometry } = useMemo(() => {
    const geo = new THREE.SphereGeometry(MOLTMAP_CONFIG.earth.radius, 64, 64);
    
    // Create biome color map
    const biomeColors = new Float32Array(BIOMES.length * 3);
    BIOMES.forEach((biome, i) => {
      const color = new THREE.Color(biome.color);
      biomeColors[i * 3] = color.r;
      biomeColors[i * 3 + 1] = color.g;
      biomeColors[i * 3 + 2] = color.b;
    });

    // Simple shader that applies biome colors based on position
    const vertexShader = `
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      
      void main() {
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform vec3 biomeColors[${BIOMES.length}];
      uniform vec3 biomePositions[${BIOMES.length}];
      
      varying vec3 vWorldPosition;
      varying vec3 vNormal;
      
      void main() {
        vec3 pos = normalize(vWorldPosition);
        vec3 color = vec3(0.2, 0.25, 0.3); // Base color
        
        // Blend biome colors based on proximity
        for (int i = 0; i < ${BIOMES.length}; i++) {
          vec3 biomePos = normalize(biomePositions[i]);
          float dist = distance(pos, biomePos);
          float influence = 1.0 - smoothstep(0.0, 1.5, dist);
          color = mix(color, biomeColors[i], influence * 0.3); // Subtle blend
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Calculate biome positions
    const biomePositions = BIOMES.map(biome => {
      const { lat, lon } = getBiomePosition(biome.name, biome.index, BIOMES.length);
      return new THREE.Vector3().setFromSpherical(
        new THREE.Spherical(MOLTMAP_CONFIG.earth.radius, (90 - lat) * Math.PI / 180, (lon + 180) * Math.PI / 180)
      );
    });

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        biomeColors: { value: biomeColors },
        biomePositions: { value: biomePositions },
      },
      transparent: true,
      opacity: 0.4, // Subtle overlay
    });

    return { material: mat, geometry: geo };
  }, []);

  return (
    <mesh geometry={geometry} material={material}>
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
