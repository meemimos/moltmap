"use client"

import { useEffect, useRef, useState } from 'react';
import type { Submolt } from '@/lib/types';
import { getSubmoltPosition, getFootprintRadius, getCategoryColor } from '@/lib/moltmap/cesium-mapping';

// Set Cesium base URL before importing
if (typeof window !== 'undefined') {
  (window as any).CESIUM_BASE_URL = '/cesium';
}

// Dynamic import Cesium
let Cesium: any = null;
if (typeof window !== 'undefined') {
  Cesium = require('cesium');
}

interface CesiumMapProps {
  submolts: Submolt[];
  selectedSubmoltId: string | null;
  hoveredSubmoltId: string | null;
  onSubmoltClick: (submolt: Submolt | null) => void;
  onSubmoltHover: (submoltId: string | null) => void;
  viewerRef: React.MutableRefObject<any>;
}

export default function CesiumMap({
  submolts,
  selectedSubmoltId,
  hoveredSubmoltId,
  onSubmoltClick,
  onSubmoltHover,
  viewerRef: externalViewerRef,
}: CesiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const entitiesRef = useRef<Map<string, any>>(new Map());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || externalViewerRef.current || !Cesium) return;

    try {
      // Use ellipsoid terrain (no external dependency, works without Ion token)
      const terrainProvider = new Cesium.EllipsoidTerrainProvider();

      // Try Cesium Ion imagery, fallback to OpenStreetMap
      let imageryProvider;
      try {
        imageryProvider = new Cesium.IonImageryProvider({ assetId: 2 });
      } catch (e) {
        console.warn('Cesium Ion imagery not available, using OpenStreetMap');
        imageryProvider = new Cesium.OpenStreetMapImageryProvider({
          url: 'https://a.tile.openstreetmap.org/',
        });
      }

      // Create Cesium viewer
      const viewer = new Cesium.Viewer(containerRef.current!, {
        terrainProvider,
        imageryProvider,
        baseLayerPicker: false,
        vrButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        animation: false,
        fullscreenButton: false,
        shouldAnimate: true,
        requestRenderMode: false,
      });

      // Enable lighting
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.dynamicAtmosphereLighting = true;

      // Set default view (equator, 15M height)
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(0, 0, 15000000),
      });

      externalViewerRef.current = viewer;
      setIsReady(true);
      console.log('Cesium viewer initialized');

      // Handle clicks
      viewer.cesiumWidget.screenSpaceEventHandler.setInputAction((click: any) => {
        const pickedObject = viewer.scene.pick(click.position);
        if (pickedObject && pickedObject.id) {
          const entity = pickedObject.id;
          const submoltId = entity.id;
          const submolt = submolts.find(s => s.id === submoltId);
          if (submolt) {
            onSubmoltClick(submolt);
          }
        } else {
          // Empty click - deselect
          onSubmoltClick(null);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Handle hover
      viewer.cesiumWidget.screenSpaceEventHandler.setInputAction((movement: any) => {
        const pickedObject = viewer.scene.pick(movement.endPosition);
        if (pickedObject && pickedObject.id) {
          const entity = pickedObject.id;
          const submoltId = entity.id;
          onSubmoltHover(submoltId);
        } else {
          onSubmoltHover(null);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    } catch (error) {
      console.error('Error initializing Cesium:', error);
    }

    // Cleanup
    return () => {
      if (externalViewerRef.current) {
        externalViewerRef.current.destroy();
        externalViewerRef.current = null;
      }
    };
  }, [externalViewerRef]);

  // Add/update entities when submolts change
  useEffect(() => {
    if (!externalViewerRef.current || !isReady) return;

    const viewer = externalViewerRef.current;
    const entities = entitiesRef.current;

    // Remove old entities
    entities.forEach((entity, id) => {
      if (!submolts.find(s => s.id === id)) {
        viewer.entities.remove(entity);
        entities.delete(id);
      }
    });

    // Add/update entities
    submolts.forEach((submolt) => {
      const { lat, lon } = getSubmoltPosition(submolt);
      const radius = getFootprintRadius(submolt);
      const color = getCategoryColor(submolt);

      let entity = entities.get(submolt.id);

      if (!entity) {
        // Generate avatar image (only in browser)
        let avatarImage = Cesium.buildModuleUrl('Widgets/Images/NavigationHelp/TouchPanZoom.svg');
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          try {
            avatarImage = generateAvatarInitials(submolt.display_name);
          } catch (e) {
            console.warn('Failed to generate avatar, using default:', e);
          }
        }

        // Create new entity
        entity = viewer.entities.add({
          id: submolt.id,
          position: Cesium.Cartesian3.fromDegrees(lon, lat),
          billboard: {
            image: avatarImage,
            scale: 0.8,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY, // Always on top
          },
          label: {
            text: submolt.display_name,
            font: '14px sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -40),
            show: false, // Show only when zoomed in
          },
          ellipse: {
            semiMajorAxis: radius,
            semiMinorAxis: radius,
            material: new Cesium.ColorMaterialProperty(
              Cesium.Color.fromCssColorString(color).withAlpha(0.12)
            ),
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString(color).withAlpha(0.4),
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
        });

        entities.set(submolt.id, entity);
      } else {
        // Update existing entity
        entity.position = Cesium.Cartesian3.fromDegrees(lon, lat);
        if (entity.ellipse) {
          entity.ellipse.semiMajorAxis = radius;
          entity.ellipse.semiMinorAxis = radius;
        }
      }
    });
  }, [submolts, isReady]);

  // Update hover state
  useEffect(() => {
    if (!externalViewerRef.current || !isReady) return;

    entitiesRef.current.forEach((entity, id) => {
      const isHovered = hoveredSubmoltId === id;
      const isSelected = selectedSubmoltId === id;

      if (entity.ellipse) {
        if (isSelected) {
          entity.ellipse.outlineColor = Cesium.Color.CYAN.withAlpha(0.8);
          entity.ellipse.outlineWidth = 3;
        } else if (isHovered) {
          entity.ellipse.outlineColor = Cesium.Color.CYAN.withAlpha(0.6);
          entity.ellipse.outlineWidth = 2.5;
        } else {
          const submolt = submolts.find(s => s.id === id);
          if (submolt) {
            const color = getCategoryColor(submolt);
            entity.ellipse.outlineColor = Cesium.Color.fromCssColorString(color).withAlpha(0.4);
            entity.ellipse.outlineWidth = 2;
          }
        }
      }
    });

    // Update cursor
    if (containerRef.current) {
      containerRef.current.style.cursor = hoveredSubmoltId ? 'pointer' : 'default';
    }
  }, [hoveredSubmoltId, selectedSubmoltId, submolts, isReady]);

  // Fly to selected submolt
  useEffect(() => {
    if (!externalViewerRef.current || !isReady || !selectedSubmoltId || !Cesium) return;

    const entity = entitiesRef.current.get(selectedSubmoltId);
    if (!entity || !entity.position) return;

    const submolt = submolts.find(s => s.id === selectedSubmoltId);
    if (!submolt) return;

    const radius = getFootprintRadius(submolt);
    const range = Math.max(1000, Math.min(10000, radius * 2.5));
    
    // Get entity position
    const position = entity.position.getValue(Cesium.JulianDate.now());
    const cartographic = Cesium.Cartographic.fromCartesian(position);
    
    // Calculate destination (above the point at the calculated range)
    const destination = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      range
    );

    externalViewerRef.current.camera.flyTo({
      destination,
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
      duration: 2.0,
      complete: () => {
        // Show label when zoomed in
        if (entity.label) {
          entity.label.show = true;
        }
      },
    });
  }, [selectedSubmoltId, submolts, isReady]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ cursor: hoveredSubmoltId ? 'pointer' : 'default' }}
    />
  );
}
