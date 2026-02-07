"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Simple icon components (no external dependency)
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const LayersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
import type { Submolt, Post } from '@/lib/types';

interface EarthHUDProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchResultClick: (item: Submolt | Post) => void;
  onResetView: () => void;
  submolts: Submolt[];
  posts: Post[];
}

export default function EarthHUD({
  searchQuery,
  onSearchChange,
  onSearchResultClick,
  onResetView,
  submolts,
  posts,
}: EarthHUDProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Filter search results
  const searchResults = searchQuery.length >= 2
    ? [
        ...submolts
          .filter(s =>
            s.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .slice(0, 5)
          .map(s => ({ type: 'submolt' as const, item: s })),
        ...posts
          .filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.content && p.content.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .slice(0, 5)
          .map(p => ({ type: 'post' as const, item: p })),
      ]
    : [];

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    setShowResults(value.length >= 2);
  };

  const handleResultClick = (item: Submolt | Post) => {
    onSearchResultClick(item);
    setShowResults(false);
    onSearchChange('');
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
      {/* Top bar - Google Earth style */}
      <div className="flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/50 pointer-events-auto">
        {/* Search input - full width */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <SearchIcon />
          </div>
          <Input
            placeholder="Search communities & posts..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => {
              setSearchFocused(true);
              if (searchQuery.length >= 2) setShowResults(true);
            }}
            onBlur={() => {
              // Delay to allow click on results
              setTimeout(() => setShowResults(false), 200);
            }}
            className="pl-10 h-10 bg-background/90 border-border/50 text-foreground placeholder:text-muted-foreground/70"
          />
          
          {/* Search results dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-md border border-border/50 rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50">
              {searchResults.map((result, idx) => (
                <button
                  key={result.type === 'submolt' ? result.item.id : result.item.id}
                  onClick={() => handleResultClick(result.item)}
                  className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors border-b border-border/30 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {result.type === 'submolt' ? result.item.display_name : result.item.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.type === 'submolt' 
                          ? `Community • ${result.item.subscriber_count} subscribers`
                          : `Post • in ${result.item.submolt.display_name}`
                        }
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Icon buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetView}
            className="h-10 w-10 p-0"
            title="Home / Reset View"
          >
            <HomeIcon />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0"
            title="Layers (Coming soon)"
            disabled
          >
            <LayersIcon />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0"
            title="Settings (Coming soon)"
            disabled
          >
            <SettingsIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
