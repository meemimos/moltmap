"use client"

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import CesiumMap from './_components/CesiumMap';
import TopBar from './_components/TopBar';
import RightInfoPanel from './_components/RightInfoPanel';
import Controls from './_components/Controls';
import { useMapStore } from '@/lib/moltmap/store';
import type { Submolt } from '@/lib/types';

// Dynamic import Cesium for type checking
let Cesium: any = null;
if (typeof window !== 'undefined') {
  Cesium = require('cesium');
}

// Dynamically import to avoid SSR issues
const CesiumMapDynamic = dynamic(() => Promise.resolve(CesiumMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#000011]">
      <div className="text-muted-foreground">Loading Cesium...</div>
    </div>
  ),
});

export default function MoltmapPage() {
  const [submolts, setSubmolts] = useState<Submolt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<any>(null);
  
  const {
    selectedSubmolt,
    hoveredSubmoltId,
    setSelectedSubmolt,
    setHoveredSubmoltId,
    closePanel,
  } = useMapStore();

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/submolts');
        if (!response.ok) {
          throw new Error('Failed to load data');
        }

        const data = await response.json();
        const submoltsArray = Array.isArray(data) ? data : [];

        if (data?.error) {
          throw new Error(data.error || 'Failed to load data');
        }

        setSubmolts(submoltsArray);
        console.log('Loaded submolts:', submoltsArray.length);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Couldn\'t load Moltbook data — try again soon.');
        setSubmolts([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSubmoltClick = (submolt: Submolt | null) => {
    if (submolt) {
      setSelectedSubmolt(submolt);
    } else {
      closePanel();
    }
  };

  const handleSearchResultClick = (submolt: Submolt) => {
    setSelectedSubmolt(submolt);
  };

  const handleResetView = () => {
    closePanel();
    if (viewerRef.current && Cesium) {
      viewerRef.current.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 15000000),
        orientation: {
          heading: 0,
          pitch: -Cesium.Math.PI / 2,
          roll: 0,
        },
        duration: 2.0,
      });
    }
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
    <main className="fixed inset-0 w-full h-full overflow-hidden bg-[#000011]">
      {/* Cesium Map */}
      <CesiumMapDynamic
        submolts={submolts}
        selectedSubmoltId={selectedSubmolt?.id || null}
        hoveredSubmoltId={hoveredSubmoltId}
        onSubmoltClick={handleSubmoltClick}
        onSubmoltHover={setHoveredSubmoltId}
        viewerRef={viewerRef}
      />

      {/* UI Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <TopBar
          submolts={submolts}
          onSearchResultClick={handleSearchResultClick}
          onResetView={handleResetView}
        />
      </div>

      {/* Right-side Info Panel */}
      <RightInfoPanel
        submolt={selectedSubmolt}
        onClose={closePanel}
      />

      {/* Bottom-right Controls */}
      <Controls viewerRef={viewerRef} onHome={handleResetView} />
    </main>
  );
}
