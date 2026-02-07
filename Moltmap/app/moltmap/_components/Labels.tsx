"use client"

import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { classifyBiome, BIOMES } from '@/lib/moltmap/mapping';
import { getSubmoltPosition, getBiomePosition, latLonToPosition } from '@/lib/moltmap/geo';
import { MOLTMAP_CONFIG } from '@/lib/moltmap/constants';
import type { Submolt } from '@/lib/types';

interface LabelsProps {
  submolts: Submolt[];
  selectedSubmolt: Submolt | null;
  glanceMode: boolean;
}

export default function Labels({ submolts, selectedSubmolt, glanceMode }: LabelsProps) {
  const { camera } = useThree();
  const zoom = camera.position.length();

  // Show biome labels when zoomed out
  const showBiomeLabels = zoom < MOLTMAP_CONFIG.zoom.biomeLabelsVisible;
  
  // Show submolt labels at medium zoom
  const showSubmoltLabels = 
    zoom >= MOLTMAP_CONFIG.zoom.submoltLabelsVisible &&
    zoom < MOLTMAP_CONFIG.zoom.submoltLabelsHidden;

  return (
    <>
      {/* Biome labels */}
      {showBiomeLabels && !glanceMode && BIOMES.map((biome) => {
        const { lat, lon } = getBiomePosition(biome.name, biome.index, BIOMES.length);
        const position = latLonToPosition(lat, lon, MOLTMAP_CONFIG.earth.radius + 0.1);
        
        return (
          <Text
            key={biome.name}
            position={position}
            fontSize={0.15}
            color={biome.color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {biome.name}
          </Text>
        );
      })}

      {/* Submolt labels - show more by default */}
      {submolts.slice(0, 100).map((submolt) => {
        const biome = classifyBiome(submolt.name, submolt.display_name, submolt.description);
        const biomePos = getBiomePosition(biome.name, biome.index, BIOMES.length);
        const { lat, lon } = getSubmoltPosition(submolt.name, biomePos.lat, biomePos.lon);
        const position = latLonToPosition(lat, lon, MOLTMAP_CONFIG.earth.radius + 0.05);
        const isSelected = selectedSubmolt?.id === submolt.id;

        if (!isSelected && !glanceMode) return null;

        return (
          <Text
            key={submolt.id}
            position={position}
            fontSize={0.08}
            color={isSelected ? "#00ffff" : "#888888"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#000000"
          >
            {submolt.display_name}
          </Text>
        );
      })}
    </>
  );
}
