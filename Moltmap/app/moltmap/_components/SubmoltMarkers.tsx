"use client"

import { useMemo, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Raycaster, Vector2 } from 'three';
import { classifyBiome, BIOMES } from '@/lib/moltmap/mapping';
import { getSubmoltPosition, latLonToPosition, getBiomePosition } from '@/lib/moltmap/geo';
import { MOLTMAP_CONFIG } from '@/lib/moltmap/constants';
import type { Submolt } from '@/lib/types';

interface SubmoltMarkersProps {
  submolts: Submolt[];
  onSubmoltClick: (submolt: Submolt, lat: number, lon: number) => void;
  searchQuery: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}

export default function SubmoltMarkers({
  submolts,
  onSubmoltClick,
  searchQuery,
  hoveredId,
  onHover,
}: SubmoltMarkersProps) {
  // Early return check must be after useThree but before other logic
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera, gl } = useThree();
  const raycasterRef = useRef(new Raycaster());
  const mouseRef = useRef(new Vector2());

  // Calculate positions and create instances
  const { positions, colors, scales, submoltData } = useMemo(() => {
    if (submolts.length === 0) {
      return { positions: [], colors: [], scales: [], submoltData: [] };
    }
    const posArray: THREE.Vector3[] = [];
    const colorArray: THREE.Color[] = [];
    const scaleArray: number[] = [];
    const dataArray: Array<{ submolt: Submolt; lat: number; lon: number }> = [];

    submolts.forEach((submolt) => {
      const biome = classifyBiome(submolt.name, submolt.display_name, submolt.description);
      const biomePos = getBiomePosition(biome.name, biome.index, BIOMES.length);
      const { lat, lon } = getSubmoltPosition(submolt.name, biomePos.lat, biomePos.lon);
      
      const position = latLonToPosition(lat, lon, MOLTMAP_CONFIG.earth.radius + 0.02);
      posArray.push(position);
      
      const color = new THREE.Color(biome.color);
      // Highlight if matches search
      if (searchQuery && (
        submolt.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submolt.name.toLowerCase().includes(searchQuery.toLowerCase())
      )) {
        color.lerp(new THREE.Color(0x00ffff), 0.5); // Cyan highlight
      }
      colorArray.push(color);
      
      // Scale based on subscriber count
      const scale = Math.min(1.5, Math.max(0.8, Math.sqrt(submolt.subscriber_count) / 50));
      scaleArray.push(scale);
      
      dataArray.push({ submolt, lat, lon });
    });

    return { positions: posArray, colors: colorArray, scales: scaleArray, submoltData: dataArray };
  }, [submolts, searchQuery, hoveredId]);

  // Update instanced mesh - use useEffect for side effects
  useEffect(() => {
    if (!meshRef.current || positions.length === 0 || submolts.length === 0) return;

    const matrix = new THREE.Matrix4();
    positions.forEach((pos, i) => {
      matrix.makeScale(scales[i], scales[i], scales[i]);
      matrix.setPosition(pos);
      meshRef.current!.setMatrixAt(i, matrix);
      
      const color = colors[i];
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [positions, colors, scales, submolts.length]);

  // Handle hover and clicks with raycasting
  const handlePointerMove = (event: any) => {
    if (!meshRef.current || submoltData.length === 0) {
      onHover(null);
      return;
    }

    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    const intersects = raycasterRef.current.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId;
      if (instanceId !== undefined && instanceId < submoltData.length && submoltData[instanceId]) {
        onHover(submoltData[instanceId].submolt.id);
      } else {
        onHover(null);
      }
    } else {
      onHover(null);
    }
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    if (!meshRef.current || submoltData.length === 0) return;

    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    const intersects = raycasterRef.current.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId;
      if (instanceId !== undefined && instanceId < submoltData.length && submoltData[instanceId]) {
        const { submolt, lat, lon } = submoltData[instanceId];
        console.log('Submolt clicked:', submolt.display_name);
        onSubmoltClick(submolt, lat, lon);
      }
    }
  };

  // Create geometry for marker (much larger, more visible)
  const geometry = useMemo(() => {
    return new THREE.CylinderGeometry(0.1, 0.1, 0.3, 8);
  }, []);

  // Material with bright emissive for visibility
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      emissive: new THREE.Color(0x00ffff),
      emissiveIntensity: 2.0,
      color: new THREE.Color(0x00aaff),
    });
  }, []);

  // Return null only after all hooks are called
  if (submolts.length === 0) {
    return null;
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, submolts.length]}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
    />
  );
}
