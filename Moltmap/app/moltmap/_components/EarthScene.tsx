"use client"

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Earth from './Earth';
import Atmosphere from './Atmosphere';
import Starfield from './Starfield';
import SubmoltMarkers from './SubmoltMarkers';
import PostPins from './PostPins';
import BiomeOverlay from './BiomeOverlay';
import CameraRig from './CameraRig';
import Labels from './Labels';
import EarthHUD from './EarthHUD';
import InfoPanel from './InfoPanel';
import CameraControls from './CameraControls';
import AgentOverlay from './AgentOverlay';
import { MOLTMAP_CONFIG } from '@/lib/moltmap/constants';
import { getSubmoltPosition, getBiomePosition, latLonToPosition } from '@/lib/moltmap/geo';
import { classifyBiome, BIOMES } from '@/lib/moltmap/mapping';
import type { Submolt, Post } from '@/lib/types';

export default function EarthScene() {
  const [submolts, setSubmolts] = useState<Submolt[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmolt, setSelectedSubmolt] = useState<Submolt | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cameraTarget, setCameraTarget] = useState<{ lat: number; lon: number; distance?: number } | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<{ type: 'submolt' | 'post'; id: string } | null>(null);
  const orbitControlsRef = useRef<any>(null);

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [submoltsRes, postsRes] = await Promise.all([
          fetch('/api/submolts'),
          fetch('/api/posts?sort=hot&limit=500'),
        ]);

        if (!submoltsRes.ok || !postsRes.ok) {
          throw new Error('Failed to load data');
        }

        const submoltsData = await submoltsRes.json();
        const postsData = await postsRes.json();

        const submoltsArray = Array.isArray(submoltsData) ? submoltsData : [];
        const postsArray = Array.isArray(postsData) ? postsData : [];

        if (submoltsData?.error || postsData?.error) {
          throw new Error(submoltsData?.error || postsData?.error || 'Failed to load data');
        }

        setSubmolts(submoltsArray);
        setPosts(postsArray);
        console.log('Loaded data:', { submolts: submoltsArray.length, posts: postsArray.length });
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Couldn\'t load Moltbook data — try again soon.');
        setSubmolts([]);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Get top posts for selected submolt
  const topHotPosts = selectedSubmolt
    ? posts
        .filter(p => p.submolt.name === selectedSubmolt.name)
        .sort((a, b) => ((b.upvotes || 0) + (b.comment_count || 0) * 2) - ((a.upvotes || 0) + (a.comment_count || 0) * 2))
        .slice(0, 10)
    : [];

  const topNewPosts = selectedSubmolt
    ? posts
        .filter(p => p.submolt.name === selectedSubmolt.name)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
    : [];

  const handleSubmoltClick = (submolt: Submolt, lat: number, lon: number) => {
    console.log('EarthScene: Submolt clicked', submolt.display_name);
    setSelectedSubmolt(submolt);
    setSelectedPost(null);
    // Calculate distance based on subscriber count (larger = closer)
    const sizeFactor = Math.min(1.5, Math.max(0.5, Math.sqrt(submolt.subscriber_count) / 100));
    setCameraTarget({ lat, lon, distance: 2.5 + sizeFactor });
  };

  const handlePostClick = (post: Post) => {
    console.log('EarthScene: Post clicked', post.title);
    setSelectedPost(post);
    // Find submolt for this post
    const submolt = submolts.find(s => s.name === post.submolt.name);
    if (submolt) {
      setSelectedSubmolt(submolt);
      const biome = classifyBiome(submolt.name, submolt.display_name, submolt.description);
      const biomePos = getBiomePosition(biome.name, biome.index, BIOMES.length);
      const submoltPos = getSubmoltPosition(submolt.name, biomePos.lat, biomePos.lon);
      setCameraTarget({ lat: submoltPos.lat, lon: submoltPos.lon, distance: 2.0 });
    }
  };

  const handleSearchResultClick = (item: Submolt | Post) => {
    if ('submolt' in item) {
      // It's a post
      handlePostClick(item);
    } else {
      // It's a submolt
      const biome = classifyBiome(item.name, item.display_name, item.description);
      const biomePos = getBiomePosition(biome.name, biome.index, BIOMES.length);
      const submoltPos = getSubmoltPosition(item.name, biomePos.lat, biomePos.lon);
      handleSubmoltClick(item, submoltPos.lat, submoltPos.lon);
    }
  };

  const handleResetView = () => {
    setSelectedSubmolt(null);
    setSelectedPost(null);
    setCameraTarget(null);
  };

  const handleZoomIn = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.dollyIn(0.5);
    }
  };

  const handleZoomOut = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.dollyOut(0.5);
    }
  };

  const handleResetHeading = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  const handleClosePanel = () => {
    setSelectedSubmolt(null);
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#000011] z-50">
        <div className="text-foreground text-lg">Loading Moltmap...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#000011] z-50 gap-4">
        <div className="text-destructive text-lg">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, MOLTMAP_CONFIG.camera.defaultDistance], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: hoveredEntity ? 'pointer' : 'default',
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[5, 3, 5]}
            intensity={1.0}
            castShadow={false}
          />

          {/* Background */}
          <Starfield />

          {/* Earth */}
          <Earth />

          {/* Atmosphere */}
          <Atmosphere />

          {/* Biome overlay */}
          <BiomeOverlay />

          {/* Content markers */}
          <SubmoltMarkers
            submolts={submolts}
            onSubmoltClick={handleSubmoltClick}
            searchQuery={searchQuery}
            hoveredId={hoveredEntity?.type === 'submolt' ? hoveredEntity.id : null}
            onHover={(id) => setHoveredEntity(id ? { type: 'submolt', id } : null)}
          />

          <PostPins
            posts={posts}
            submolts={submolts}
            selectedSubmolt={selectedSubmolt}
            onPostClick={handlePostClick}
            searchQuery={searchQuery}
            hoveredId={hoveredEntity?.type === 'post' ? hoveredEntity.id : null}
            onHover={(id) => setHoveredEntity(id ? { type: 'post', id } : null)}
          />

          {/* Labels */}
          <Labels
            submolts={submolts}
            selectedSubmolt={selectedSubmolt}
            glanceMode={false}
          />

          {/* Camera controls */}
          <CameraRig
            target={cameraTarget}
            onAnimationComplete={() => {
              // Optional: callback when animation completes
            }}
          />

          {/* Orbit controls */}
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={false}
            minDistance={MOLTMAP_CONFIG.camera.minDistance}
            maxDistance={MOLTMAP_CONFIG.camera.maxDistance}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Top HUD */}
        <EarthHUD
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchResultClick={handleSearchResultClick}
          onResetView={handleResetView}
          submolts={submolts}
          posts={posts}
        />

        {/* Agent overlay (optional) */}
        <AgentOverlay
          selectedPost={null}
          onPostClose={() => {}}
        />
      </div>

      {/* Right-side Info Panel */}
      <InfoPanel
        submolt={selectedSubmolt}
        post={selectedPost}
        onClose={handleClosePanel}
        onPostClick={handlePostClick}
        topHotPosts={topHotPosts}
        topNewPosts={topNewPosts}
      />

      {/* Bottom-right Camera Controls */}
      <CameraControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetHeading={handleResetHeading}
      />
    </div>
  );
}
