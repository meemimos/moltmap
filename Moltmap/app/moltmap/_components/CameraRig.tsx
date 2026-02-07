"use client"

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { latLonToPosition } from '@/lib/moltmap/geo';
import { MOLTMAP_CONFIG } from '@/lib/moltmap/constants';
import * as THREE from 'three';

// Smooth easing function (cubic bezier-like)
function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface CameraRigProps {
  target: { lat: number; lon: number; distance?: number } | null;
  onAnimationComplete?: () => void;
}

export default function CameraRig({ target, onAnimationComplete }: CameraRigProps) {
  const { camera } = useThree();
  const animationRef = useRef<{
    active: boolean;
    startTime: number;
    startPosition: THREE.Vector3;
    targetPosition: THREE.Vector3;
    startLookAt: THREE.Vector3;
    targetLookAt: THREE.Vector3;
  } | null>(null);

  useEffect(() => {
    if (!target) {
      // Reset to home view
      const homePos = new THREE.Vector3(...MOLTMAP_CONFIG.camera.homePosition);
      animationRef.current = {
        active: true,
        startTime: performance.now(),
        startPosition: camera.position.clone(),
        targetPosition: homePos,
        startLookAt: new THREE.Vector3(0, 0, 0),
        targetLookAt: new THREE.Vector3(0, 0, 0),
      };
      return;
    }

    // Fly to target - Google Earth style
    const lookAtTarget = latLonToPosition(target.lat, target.lon, MOLTMAP_CONFIG.earth.radius);
    
    // Calculate camera position
    // Distance based on target size or default
    const targetDistance = target.distance || 3.0;
    const surfacePoint = latLonToPosition(target.lat, target.lon, MOLTMAP_CONFIG.earth.radius);
    const direction = surfacePoint.clone().normalize();
    const cameraPos = surfacePoint.clone().add(direction.multiplyScalar(targetDistance));

    animationRef.current = {
      active: true,
      startTime: performance.now(),
      startPosition: camera.position.clone(),
      targetPosition: cameraPos,
      startLookAt: camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(10)),
      targetLookAt: lookAtTarget,
    };
  }, [target, camera]);

  useFrame(() => {
    if (!animationRef.current || !animationRef.current.active) return;

    const elapsed = performance.now() - animationRef.current.startTime;
    const progress = Math.min(elapsed / MOLTMAP_CONFIG.camera.flyToDuration, 1);
    const eased = easeInOutCubic(progress);

    // Interpolate position
    camera.position.lerpVectors(
      animationRef.current.startPosition,
      animationRef.current.targetPosition,
      eased
    );

    // Interpolate look-at
    const currentLookAt = new THREE.Vector3().lerpVectors(
      animationRef.current.startLookAt,
      animationRef.current.targetLookAt,
      eased
    );
    camera.lookAt(currentLookAt);

    if (progress >= 1) {
      animationRef.current.active = false;
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }
  });

  return null;
}
