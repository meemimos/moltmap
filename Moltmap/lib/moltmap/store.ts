/**
 * State management for Cesium map interactions
 */

import { create } from 'zustand';
import type { Submolt } from '@/lib/types';

interface MapStore {
  selectedSubmolt: Submolt | null;
  hoveredSubmoltId: string | null;
  searchQuery: string;
  searchResults: Submolt[];
  panelOpen: boolean;
  
  setSelectedSubmolt: (submolt: Submolt | null) => void;
  setHoveredSubmoltId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: Submolt[]) => void;
  setPanelOpen: (open: boolean) => void;
  closePanel: () => void;
}

export const useMapStore = create<MapStore>((set) => ({
  selectedSubmolt: null,
  hoveredSubmoltId: null,
  searchQuery: '',
  searchResults: [],
  panelOpen: false,

  setSelectedSubmolt: (submolt) => set({ 
    selectedSubmolt: submolt,
    panelOpen: submolt !== null,
  }),

  setHoveredSubmoltId: (id) => set({ hoveredSubmoltId: id }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSearchResults: (results) => set({ searchResults: results }),

  setPanelOpen: (open) => set({ panelOpen: open }),

  closePanel: () => set({ 
    panelOpen: false,
    selectedSubmolt: null,
  }),
}));
