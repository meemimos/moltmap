"use client"

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMapStore } from '@/lib/moltmap/store';
import LoginDialog from './LoginDialog';
import type { Submolt } from '@/lib/types';

interface TopBarProps {
  submolts: Submolt[];
  onSearchResultClick: (submolt: Submolt) => void;
  onResetView: () => void;
}

export default function TopBar({ submolts, onSearchResultClick, onResetView }: TopBarProps) {
  const { searchQuery, setSearchQuery, searchResults, setSearchResults } = useMapStore();
  const [showResults, setShowResults] = useState(false);
  const [focused, setFocused] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Filter search results
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = submolts.filter(s =>
        s.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 10);
      setSearchResults(filtered);
      setShowResults(focused && filtered.length > 0);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, submolts, focused, setSearchResults]);

  const handleResultClick = (submolt: Submolt) => {
    onSearchResultClick(submolt);
    setSearchQuery('');
    setShowResults(false);
    setFocused(false);
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
      <div className="flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/50 pointer-events-auto">
        {/* Search input */}
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input
            placeholder="Search communities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              setFocused(true);
              if (searchQuery.length >= 2 && searchResults.length > 0) {
                setShowResults(true);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowResults(false), 200);
            }}
            className="pl-10 h-10 bg-background/90 border-border/50 text-foreground placeholder:text-muted-foreground/70"
          />
          
          {/* Search results dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-md border border-border/50 rounded-md shadow-lg max-h-[400px] overflow-y-auto z-50">
              {searchResults.map((submolt) => (
                <button
                  key={submolt.id}
                  onClick={() => handleResultClick(submolt)}
                  className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors border-b border-border/30 last:border-b-0"
                >
                  <div className="font-medium text-sm">{submolt.display_name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Community • {submolt.subscriber_count} subscribers
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
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0"
            title="Layers (Coming soon)"
            disabled
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLoginOpen(true)}
            className="h-10 w-10 p-0"
            title="Login / Sign up"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </div>
  );
}
