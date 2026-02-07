"use client"

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useMapStore } from '@/lib/moltmap/store';

// Dynamic import Cesium
let Cesium: any = null;
if (typeof window !== 'undefined') {
  Cesium = require('cesium');
}

interface ControlsProps {
  viewerRef: React.MutableRefObject<any>;
  onHome?: () => void;
}

export default function Controls({ viewerRef, onHome }: ControlsProps) {
  const [overviewMode, setOverviewMode] = useState(true);
  const { closePanel } = useMapStore();

  const handleZoomIn = () => {
    if (viewerRef.current && Cesium) {
      const height = viewerRef.current.camera.positionCartographic.height;
      viewerRef.current.camera.zoomIn(height * 0.5);
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current && Cesium) {
      const height = viewerRef.current.camera.positionCartographic.height;
      viewerRef.current.camera.zoomOut(height * 0.5);
    }
  };

  const handleResetHeading = () => {
    if (viewerRef.current && Cesium) {
      const currentPosition = viewerRef.current.camera.positionCartographic;
      viewerRef.current.camera.setView({
        destination: Cesium.Cartesian3.fromRadians(
          currentPosition.longitude,
          currentPosition.latitude,
          currentPosition.height
        ),
        orientation: {
          heading: 0, // North
          pitch: currentPosition.height > 1000000 ? -Cesium.Math.PI / 2 : viewerRef.current.camera.pitch,
          roll: 0,
        },
      });
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    }
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

  const handleMapToggle = () => {
    setOverviewMode(!overviewMode);
    // Toggle labels visibility
    if (viewerRef.current && Cesium) {
      const entities = viewerRef.current.entities.values;
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (entity.label) {
          entity.label.show = !overviewMode;
        }
      }
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-30 pointer-events-none">
      <div className="flex flex-col items-center gap-2 pointer-events-auto">
        {/* Zoom controls */}
        <div className="flex flex-col gap-1 bg-background/80 backdrop-blur-md border border-border/50 rounded-md p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="h-8 w-8 p-0"
            title="Zoom In"
          >
            +
          </Button>
          <div className="h-px bg-border/50 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="h-8 w-8 p-0"
            title="Zoom Out"
          >
            −
          </Button>
        </div>

        {/* Compass / Reset heading */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetHeading}
          className="h-10 w-10 p-0 bg-background/80 backdrop-blur-md border border-border/50 rounded-md"
          title="Reset Heading / Compass"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </Button>

        {/* Map toggle (Overview/Focused) */}
        <Button
          variant={overviewMode ? "default" : "ghost"}
          size="sm"
          onClick={handleMapToggle}
          className="h-10 w-10 p-0 bg-background/80 backdrop-blur-md border border-border/50 rounded-md"
          title={overviewMode ? "Overview Mode" : "Focused Mode"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </Button>

        {/* Home button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHome}
          className="h-10 w-10 p-0 bg-background/80 backdrop-blur-md border border-border/50 rounded-md"
          title="Home / Reset View"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Button>

        {/* 3D badge with tooltip */}
        <div 
          className="px-2 py-1 bg-background/80 backdrop-blur-md border border-border/50 rounded text-xs text-muted-foreground cursor-help"
          title="Phase 2: 3D terrain & buildings coming soon"
        >
          3D
        </div>
      </div>
    </div>
  );
}
