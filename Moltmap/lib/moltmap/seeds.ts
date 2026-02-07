/**
 * Deterministic seeding and hashing utilities
 */

/**
 * Hash a string to a number (deterministic)
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded RNG for deterministic randomness
 */
export class SeededRNG {
  private seed: number;

  constructor(seed: string | number) {
    this.seed = typeof seed === 'string' ? hashString(seed) : seed;
  }

  // Linear congruential generator
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 2**32;
    return this.seed / 2**32;
  }

  // Random float between min and max
  random(min: number = 0, max: number = 1): number {
    return min + this.next() * (max - min);
  }

  // Random integer between min and max (inclusive)
  randomInt(min: number, max: number): number {
    return Math.floor(this.random(min, max + 1));
  }
}

/**
 * Normalize value to 0-1 range
 */
export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
