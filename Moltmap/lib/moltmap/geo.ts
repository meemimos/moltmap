/**
 * Geographic utilities for lat/lon placement on sphere
 */

import { SeededRNG, clamp } from './seeds';
import { MOLTMAP_CONFIG } from './constants';
import * as THREE from 'three';

/**
 * Convert lat/lon to 3D position on sphere
 */
export function latLonToPosition(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Convert 3D position to lat/lon
 */
export function positionToLatLon(position: THREE.Vector3): { lat: number; lon: number } {
  const radius = position.length();
  const lat = 90 - (Math.acos(position.y / radius) * 180 / Math.PI);
  const lon = (Math.atan2(position.z, -position.x) * 180 / Math.PI) - 180;
  return { lat, lon };
}

/**
 * Get deterministic lat/lon within a biome region
 */
export function getBiomePosition(biomeName: string, biomeIndex: number, totalBiomes: number): { lat: number; lon: number } {
  const rng = new SeededRNG(biomeName);
  
  // Distribute biomes around the sphere
  const latBand = (biomeIndex / totalBiomes) * 180 - 90; // -90 to 90
  const lonBase = (biomeIndex * 137.5) % 360 - 180; // Golden angle distribution
  
  // Add some variation within the biome region
  const latVariation = rng.random(-30, 30);
  const lonVariation = rng.random(-60, 60);
  
  return {
    lat: clamp(latBand + latVariation, -85, 85), // Avoid poles
    lon: lonBase + lonVariation,
  };
}

/**
 * Get deterministic position for submolt within biome
 */
export function getSubmoltPosition(
  submoltName: string,
  biomeLat: number,
  biomeLon: number
): { lat: number; lon: number } {
  const rng = new SeededRNG(submoltName);
  
  // Spread around biome center
  const latOffset = rng.random(-MOLTMAP_CONFIG.placement.submoltSpread * 180 / Math.PI, MOLTMAP_CONFIG.placement.submoltSpread * 180 / Math.PI);
  const lonOffset = rng.random(-MOLTMAP_CONFIG.placement.submoltSpread * 180 / Math.PI, MOLTMAP_CONFIG.placement.submoltSpread * 180 / Math.PI);
  
  return {
    lat: clamp(biomeLat + latOffset, -85, 85),
    lon: biomeLon + lonOffset,
  };
}

/**
 * Get deterministic position for post near submolt
 */
export function getPostPosition(
  postId: string,
  submoltLat: number,
  submoltLon: number
): { lat: number; lon: number } {
  const rng = new SeededRNG(postId);
  
  // Spread around submolt
  const latOffset = rng.random(-MOLTMAP_CONFIG.placement.postSpread * 180 / Math.PI, MOLTMAP_CONFIG.placement.postSpread * 180 / Math.PI);
  const lonOffset = rng.random(-MOLTMAP_CONFIG.placement.postSpread * 180 / Math.PI, MOLTMAP_CONFIG.placement.postSpread * 180 / Math.PI);
  
  return {
    lat: clamp(submoltLat + latOffset, -85, 85),
    lon: submoltLon + lonOffset,
  };
}

/**
 * Calculate distance between two lat/lon points (great circle distance)
 */
export function latLonDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 1; // Unit sphere
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
