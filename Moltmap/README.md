# Moltmap 3D - Agent World Observatory

A 3D navigable Earth-like planet for exploring Moltbook content, with agent observability features.

## Overview

Moltmap Earth is a single high-quality 3D globe that visualizes:
- **Biomes** = Procedural regions (Silicon Valley, Creator Coast, etc.)
- **Submolts** = Country anchors on the planet surface
- **Posts** = City lights/pins near their submolt
- **Agent Activity** = Real-time observability of AI agent exploration

## Tech Stack

- **Next.js 14+** (App Router) + TypeScript
- **three.js** + **@react-three/fiber** + **@react-three/drei**
- **GLSL shaders** for Earth surface and atmosphere
- **Server-Sent Events (SSE)** for agent event streaming
- **InstancedMesh** for performance (300-1000 posts)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000/moltmap](http://localhost:3000/moltmap) in your browser.

## Features (MVP1)

### ✅ 3D Globe Scene
- Full-screen R3F canvas with Earth-like planet
- Day/night lighting with terminator effect
- Subtle atmosphere rim (fresnel shader)
- Starfield background
- Smooth orbit controls with zoom limits

### ✅ Procedural Biomes
- 7 biome regions with deterministic placement
- Soft borders, subtle color tints
- Biome legend UI

### ✅ Content Mapping
- Submolts → Country anchors (deterministic lat/lon)
- Posts → City lights (instanced for performance)
- Zoom-aware visibility (posts only when zoomed in)

### ✅ Interaction & Navigation
- Click submolt → smooth camera fly-to
- Click post → open details panel
- Hover highlights
- Reset view button
- Glance mode (biomes + submolts only)

### ✅ Agent Observability
- SSE event stream (`/api/agent/events`)
- Agent panel showing: goal, current step, recent events
- Event types: goal.set, move.to, tool.call, thought.emit
- Clickable events to focus camera

### ✅ Search
- Search biomes, submolts, posts
- Spotlight matching items
- Dim non-matching content

## Architecture

### Routes
- `/moltmap` - Main 3D globe view

### API Routes
- `/api/submolts` - Fetch districts (cached 5 min)
- `/api/posts` - Fetch posts (cached 2 min)
- `/api/agent/events` - SSE stream for agent events

### Key Components
- `WorldScene.tsx` - Main R3F canvas and scene setup
- `Earth.tsx` - Earth sphere with day/night shader
- `Atmosphere.tsx` - Atmosphere rim effect
- `SubmoltMarkers.tsx` - Instanced submolt markers
- `PostPins.tsx` - Instanced post pins (city lights)
- `CameraController.tsx` - Smooth fly-to animations
- `AgentOverlay.tsx` - Agent observability panel
- `HUD.tsx` - UI controls (search, glance, reset)

### Utilities
- `lib/moltmap/seeds.ts` - Deterministic hashing & RNG
- `lib/moltmap/geo.ts` - Lat/lon placement, surface projection
- `lib/moltmap/mapping.ts` - Biome classification
- `lib/moltmap/constants.ts` - Configuration

## Deterministic Placement

All content placement is deterministic:
- Biome positions: seeded by biome name
- Submolt positions: seeded by submolt name within biome
- Post positions: seeded by post ID near submolt

Refresh the page → same positions every time.

## Performance

- **Target**: 60fps with 300-1000 posts
- **Optimizations**:
  - InstancedMesh for posts and submolts
  - LOD: Hide posts when zoomed out
  - Simple shaders (no heavy textures)
  - Efficient raycasting for interactions

## MVP2 (Future)
- Real-time post updates
- Advanced LOD system
- Post clustering at distance
- Enhanced shader effects
- Agent path history visualization

## MVP3 (Future)
- Multiple agent tracking
- Agent goal visualization
- Tool usage heatmaps
- Thought sentiment analysis
- Export/recording capabilities

## Notes

- Shaders are inline for MVP1 (can be moved to `.glsl` files later)
- Agent events are mocked for MVP1 (ready for real agent integration)
- Biome overlay is simplified (full shader blending in MVP2)
- Raycasting for clicks works but could be optimized

## Troubleshooting

- **No 3D scene**: Check browser console for WebGL errors
- **Slow performance**: Reduce `maxVisiblePosts` in constants
- **SSE not working**: Check `/api/agent/events` route
- **Placement changes on refresh**: Check seeded RNG implementation
