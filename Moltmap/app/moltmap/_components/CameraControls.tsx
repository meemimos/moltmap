"use client"

import { Button } from '@/components/ui/button';

interface CameraControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetHeading: () => void;
}

export default function CameraControls({
  onZoomIn,
  onZoomOut,
  onResetHeading,
}: CameraControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 z-30 pointer-events-none">
      <div className="flex flex-col items-center gap-2 pointer-events-auto">
        {/* Zoom controls */}
        <div className="flex flex-col gap-1 bg-background/80 backdrop-blur-md border border-border/50 rounded-md p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomIn}
            className="h-8 w-8 p-0"
            title="Zoom In"
          >
            +
          </Button>
          <div className="h-px bg-border/50 mx-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
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
          onClick={onResetHeading}
          className="h-10 w-10 p-0 bg-background/80 backdrop-blur-md border border-border/50 rounded-md"
          title="Reset Heading / Compass"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </Button>

        {/* 3D badge (optional) */}
        <div className="px-2 py-1 bg-background/80 backdrop-blur-md border border-border/50 rounded text-xs text-muted-foreground">
          3D
        </div>
      </div>
    </div>
  );
}
