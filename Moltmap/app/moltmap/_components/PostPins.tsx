"use client"

import { useMemo, useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Raycaster, Vector2 } from 'three';
import { classifyBiome, BIOMES } from '@/lib/moltmap/mapping';
import { getSubmoltPosition, getPostPosition, latLonToPosition, getBiomePosition } from '@/lib/moltmap/geo';
import { MOLTMAP_CONFIG } from '@/lib/moltmap/constants';
import { clamp } from '@/lib/moltmap/seeds';
import type { Post, Submolt } from '@/lib/types';

interface PostPinsProps {
  posts: Post[];
  submolts: Submolt[];
  selectedSubmolt: Submolt | null;
  onPostClick: (post: Post) => void;
  searchQuery: string;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}

export default function PostPins({
  posts,
  submolts,
  selectedSubmolt,
  onPostClick,
  searchQuery,
  hoveredId,
  onHover,
}: PostPinsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera, gl } = useThree();
  const raycasterRef = useRef(new Raycaster());
  const mouseRef = useRef(new Vector2());

  // Filter posts - Google Earth style: only show when zoomed in or submolt selected
  const visiblePosts = useMemo(() => {
    if (posts.length === 0) return [];
    
    const distance = camera.position.length();
    const isZoomedIn = distance < 4.0; // Show posts when camera is close
    
    // Only show posts when:
    // 1. A submolt is selected (show its posts)
    // 2. Camera is zoomed in close (< 4.0 distance)
    if (!selectedSubmolt && !isZoomedIn) {
      return []; // Hide posts when zoomed out and no submolt selected
    }
    
    const filtered = selectedSubmolt
      ? posts.filter(p => p.submolt.name === selectedSubmolt.name)
      : posts; // Show all posts when zoomed in
    
    // Limit to top posts by engagement
    const sorted = [...filtered].sort((a, b) => {
      const aEngagement = (a.upvotes || 0) + (a.comment_count || 0) * 2;
      const bEngagement = (b.upvotes || 0) + (b.comment_count || 0) * 2;
      return bEngagement - aEngagement;
    });
    
    return sorted.slice(0, MOLTMAP_CONFIG.performance.maxVisiblePosts);
  }, [posts, selectedSubmolt, camera]);

  // Calculate positions
  const { positions, scales, colors, postData } = useMemo(() => {
    const posArray: THREE.Vector3[] = [];
    const scaleArray: number[] = [];
    const colorArray: THREE.Color[] = [];
    const dataArray: Post[] = [];

    if (visiblePosts.length === 0) {
      return { positions: posArray, scales: scaleArray, colors: colorArray, postData: dataArray };
    }

    visiblePosts.forEach((post) => {
      // Find submolt for this post
      const submolt = submolts.find(s => s.name === post.submolt.name);
      if (!submolt) return;

      // Get submolt position
      const biome = classifyBiome(submolt.name, submolt.display_name, submolt.description);
      const biomePos = getBiomePosition(biome.name, biome.index, BIOMES.length);
      const submoltPos = getSubmoltPosition(submolt.name, biomePos.lat, biomePos.lon);
      
      // Get post position near submolt
      const postPos = getPostPosition(post.id, submoltPos.lat, submoltPos.lon);
      const position = latLonToPosition(
        postPos.lat,
        postPos.lon,
        MOLTMAP_CONFIG.earth.radius + 0.01
      );
      posArray.push(position);

      // Scale based on upvotes
      const upvotes = post.upvotes || 0;
      const height = clamp(
        MOLTMAP_CONFIG.placement.postMinHeight + Math.sqrt(upvotes) * 0.01,
        MOLTMAP_CONFIG.placement.postMinHeight,
        MOLTMAP_CONFIG.placement.postMaxHeight
      );
      scaleArray.push(height);

      // Color based on activity (hot = warmer)
      const hotness = (upvotes || 0) + (post.comment_count || 0) * 2;
      const isHot = hotness > 50;
      const color = isHot ? new THREE.Color(0xffaa00) : new THREE.Color(0x00aaff);
      
      // Highlight if hovered
      if (hoveredId === post.id) {
        color.lerp(new THREE.Color(0x00ffff), 0.7); // Strong cyan highlight on hover
      }
      // Highlight if matches search
      else if (searchQuery && post.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        color.lerp(new THREE.Color(0x00ffff), 0.5); // Cyan highlight
      }
      
      colorArray.push(color);
      dataArray.push(post);
    });

    return { positions: posArray, scales: scaleArray, colors: colorArray, postData: dataArray };
  }, [visiblePosts, submolts, searchQuery, hoveredId]);

  // Update instanced mesh - use useEffect for side effects
  useEffect(() => {
    if (!meshRef.current || positions.length === 0 || visiblePosts.length === 0) return;

    const matrix = new THREE.Matrix4();
    positions.forEach((pos, i) => {
      const scale = scales[i];
      matrix.makeScale(0.05, scale, 0.05); // Make posts much bigger
      matrix.setPosition(pos);
      meshRef.current!.setMatrixAt(i, matrix);
      
      const color = colors[i];
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [positions, scales, colors, visiblePosts.length]);

  // Handle hover and clicks with raycasting
  const handlePointerMove = (event: any) => {
    if (!meshRef.current || postData.length === 0) {
      onHover(null);
      return;
    }

    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    const intersects = raycasterRef.current.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId;
      if (instanceId !== undefined && instanceId < postData.length && postData[instanceId]) {
        onHover(postData[instanceId].id);
      } else {
        onHover(null);
      }
    } else {
      onHover(null);
    }
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    if (!meshRef.current || postData.length === 0) return;

    const rect = gl.domElement.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    const intersects = raycasterRef.current.intersectObject(meshRef.current);

    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId;
      if (instanceId !== undefined && instanceId < postData.length && postData[instanceId]) {
        console.log('Post clicked:', postData[instanceId].title);
        onPostClick(postData[instanceId]);
      }
    }
  };

  // Create geometry and material - must be called before early return
  const geometry = useMemo(() => {
    return new THREE.BoxGeometry(1, 1, 1);
  }, []);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      emissive: new THREE.Color(0xffaa00),
      emissiveIntensity: 2.0,
      color: new THREE.Color(0xffaa00),
    });
  }, []);

  // Return null only after ALL hooks are called
  if (visiblePosts.length === 0) {
    return null;
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, visiblePosts.length]}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
    />
  );
}
