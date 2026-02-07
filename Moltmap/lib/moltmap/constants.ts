/**
 * Configuration constants for Moltmap 3D
 */

export const MOLTMAP_CONFIG = {
  // Camera settings
  camera: {
    defaultDistance: 6, // Closer for better view
    minDistance: 1.5,
    maxDistance: 12,
    flyToDuration: 2000, // ms - Google Earth style smooth animation
    homePosition: [0, 0, 6] as [number, number, number],
  },

  // Zoom thresholds for LOD
  zoom: {
    biomeLabelsVisible: 0.5,
    submoltLabelsVisible: 0.5,
    submoltLabelsHidden: 1.5,
    postsVisible: 1.0, // Show posts when zoomed in
    postsHidden: 0.8, // Hide posts when zoomed out
  },

  // Earth settings
  earth: {
    radius: 1.0,
    atmosphereRadius: 1.05,
    cloudRadius: 1.02,
  },

  // Content placement
  placement: {
    submoltSpread: 0.15, // radians (~8.5 degrees) spread around biome center
    postSpread: 0.1, // radians (~5.7 degrees) spread around submolt
    postMinHeight: 0.01,
    postMaxHeight: 0.15,
    postBaseScale: 0.02,
  },

  // Performance
  performance: {
    maxVisiblePosts: 1000,
    instancingBatchSize: 100,
  },

  // Agent observability
  agent: {
    orbSize: 0.05,
    trailLength: 20,
    trailFadeTime: 2000, // ms
  },
} as const;
