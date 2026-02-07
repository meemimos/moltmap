"use client"

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { latLonToPosition } from '@/lib/moltmap/geo';
import { MOLTMAP_CONFIG } from '@/lib/moltmap/constants';
// Ease-in-out function
function easeInOut(t: number): number {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
import * as THREE from 'three';

interface CameraControllerProps {
  target: { lat: number; lon: number } | null;
  onReset: () => void;
}

export default function CameraController({ target, onReset }: CameraControllerProps) {
  const { camera } = useThree();
  const animationRef = useRef<{
    active: boolean;
    startTime: number;
    startPosition: THREE.Vector3;
    targetPosition: THREE.Vector3;
    startDistance: number;
    targetDistance: number;
  } | null>(null);

  useEffect(() => {
    if (!target) {
      // Reset to default view
      animationRef.current = {
        active: true,
        startTime: performance.now(),
        startPosition: camera.position.clone(),
        targetPosition: new THREE.Vector3(0, 0, MOLTMAP_CONFIG.camera.defaultDistance),
        startDistance: camera.position.length(),
        targetDistance: MOLTMAP_CONFIG.camera.defaultDistance,
      };
      return;
    }

    // Fly to target
    const targetWorldPos = latLonToPosition(
      target.lat,
      target.lon,
      MOLTMAP_CONFIG.earth.radius + 2
    );

    // Calculate camera position looking at target
    const lookAtTarget = latLonToPosition(target.lat, target.lon, MOLTMAP_CONFIG.earth.radius);
    const direction = targetWorldPos.clone().sub(lookAtTarget).normalize();
    const cameraDistance = 3; // Zoom in closer when viewing a target
    const cameraPos = lookAtTarget.clone().add(direction.multiplyScalar(cameraDistance));

    animationRef.current = {
      active: true,
      startTime: performance.now(),
      startPosition: camera.position.clone(),
      targetPosition: cameraPos,
      startDistance: camera.position.length(),
      targetDistance: cameraDistance,
    };
  }, [target, camera]);

  useFrame(() => {
    if (!animationRef.current || !animationRef.current.active) return;

    const elapsed = performance.now() - animationRef.current.startTime;
    const progress = Math.min(elapsed / MOLTMAP_CONFIG.camera.flyToDuration, 1);
    const eased = easeInOut(progress);

    // Interpolate position
    camera.position.lerpVectors(
      animationRef.current.startPosition,
      animationRef.current.targetPosition,
      eased
    );

    // Look at Earth center or target
    if (target) {
      const lookAt = latLonToPosition(target.lat, target.lon, MOLTMAP_CONFIG.earth.radius);
      camera.lookAt(lookAt);
    } else {
      camera.lookAt(0, 0, 0);
    }

    if (progress >= 1) {
      animationRef.current.active = false;
    }
  });

  return null;
}
