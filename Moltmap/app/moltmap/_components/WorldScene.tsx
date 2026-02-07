"use client"

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import Earth from './Earth';
import Atmosphere from './Atmosphere';
import Starfield from './Starfield';
import SubmoltMarkers from './SubmoltMarkers';
import PostPins from './PostPins';
import BiomeOverlay from './BiomeOverlay';
import CameraController from './CameraController';
import Labels from './Labels';
import HUD from './HUD';
import AgentOverlay from './AgentOverlay';
import DetailSheet from './DetailSheet';
import { MOLTMAP_CONFIG } from '@/lib/moltmap/constants';
import type { Submolt, Post } from '@/lib/types';

export default function WorldScene() {
  const [submolts, setSubmolts] = useState<Submolt[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmolt, setSelectedSubmolt] = useState<Submolt | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [glanceMode, setGlanceMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cameraTarget, setCameraTarget] = useState<{ lat: number; lon: number } | null>(null);

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
        // Set empty arrays on error
        setSubmolts([]);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSubmoltClick = (submolt: Submolt, lat: number, lon: number) => {
    console.log('WorldScene: Submolt clicked', submolt.display_name);
    setSelectedSubmolt(submolt);
    setSelectedPost(null);
    setCameraTarget({ lat, lon });
  };

  const handlePostClick = (post: Post) => {
    console.log('WorldScene: Post clicked', post.title);
    setSelectedPost(post);
    setSelectedSubmolt(null);
  };

  const handleResetView = () => {
    setSelectedSubmolt(null);
    setSelectedPost(null);
    setCameraTarget(null);
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
      <Canvas
        camera={{ position: [0, 0, MOLTMAP_CONFIG.camera.defaultDistance], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block'
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
            glanceMode={glanceMode}
            searchQuery={searchQuery}
          />

          <PostPins
            posts={posts}
            submolts={submolts}
            selectedSubmolt={selectedSubmolt}
            onPostClick={handlePostClick}
            glanceMode={glanceMode}
            searchQuery={searchQuery}
          />

          {/* Labels */}
          <Labels
            submolts={submolts}
            selectedSubmolt={selectedSubmolt}
            glanceMode={glanceMode}
          />

          {/* Camera controls */}
          <CameraController
            target={cameraTarget}
            onReset={handleResetView}
          />

          {/* Orbit controls */}
          <OrbitControls
            enablePan={false}
            minDistance={MOLTMAP_CONFIG.camera.minDistance}
            maxDistance={MOLTMAP_CONFIG.camera.maxDistance}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays - positioned above canvas */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <HUD
          glanceMode={glanceMode}
          onGlanceModeChange={setGlanceMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onResetView={handleResetView}
          submolts={submolts}
          posts={posts}
        />

        <AgentOverlay
          selectedPost={null}
          onPostClose={() => {}}
        />
      </div>

      {/* Detail Sheet - outside pointer-events-none so it can receive clicks */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <DetailSheet
          submolt={selectedSubmolt}
          post={selectedPost}
          onClose={() => {
            setSelectedSubmolt(null);
            setSelectedPost(null);
          }}
        />
      </div>
    </div>
  );
}
