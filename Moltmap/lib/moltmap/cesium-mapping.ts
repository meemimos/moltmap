/**
 * Cesium-specific mapping utilities for submolt placement and styling
 */

import type { Submolt } from '@/lib/types';

/**
 * Get deterministic lat/lon position for a submolt
 */
export function getSubmoltPosition(submolt: Submolt): { lat: number; lon: number } {
  const category = classifySubmoltCategory(submolt);
  const categoryIndex = getCategoryIndex(category);
  
  // Lat band: -60 to 60, distributed by category
  const latBase = -60 + (categoryIndex * 30);
  
  // Lon: hash of name for distribution
  const hash = simpleHash(submolt.name);
  const lonBase = (hash % 360) - 180;
  
  // Add small offset within category band
  const latOffset = (hash % 20) - 10;
  const lonOffset = ((hash * 7) % 40) - 20;
  
  return {
    lat: Math.max(-85, Math.min(85, latBase + latOffset)),
    lon: lonBase + lonOffset,
  };
}

/**
 * Get footprint radius in meters based on subscriber count
 */
export function getFootprintRadius(submolt: Submolt): number {
  const minRadius = 10000; // 10km
  const maxRadius = 250000; // 250km
  const radius = Math.sqrt(submolt.subscriber_count) * 100;
  return Math.max(minRadius, Math.min(maxRadius, radius));
}

/**
 * Get category color for styling
 */
export function getCategoryColor(submolt: Submolt): string {
  const category = classifySubmoltCategory(submolt);
  const colors: Record<string, string> = {
    tech: '#2a4a5a',
    creator: '#4a3a5a',
    discussion: '#4a4a3a',
    ai: '#3a4a4a',
    crypto: '#4a2a5a',
    other: '#3a3a3a',
  };
  return colors[category] || colors.other;
}

/**
 * Classify submolt into a category
 */
function classifySubmoltCategory(submolt: Submolt): string {
  const name = submolt.name.toLowerCase();
  const desc = (submolt.description || '').toLowerCase();
  const text = `${name} ${desc}`;
  
  if (text.includes('tech') || text.includes('code') || text.includes('dev')) return 'tech';
  if (text.includes('creator') || text.includes('content')) return 'creator';
  if (text.includes('ai') || text.includes('agent')) return 'ai';
  if (text.includes('crypto') || text.includes('web3') || text.includes('blockchain')) return 'crypto';
  if (text.includes('discuss') || text.includes('talk')) return 'discussion';
  return 'other';
}

/**
 * Get category index for lat band distribution
 */
function getCategoryIndex(category: string): number {
  const indices: Record<string, number> = {
    tech: 0,
    creator: 1,
    discussion: 2,
    ai: 3,
    crypto: 4,
    other: 5,
  };
  return indices[category] || 5;
}

/**
 * Simple hash function for deterministic placement
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
