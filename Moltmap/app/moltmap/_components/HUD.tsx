"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Submolt, Post } from '@/lib/types';

interface HUDProps {
  glanceMode: boolean;
  onGlanceModeChange: (value: boolean) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onResetView: () => void;
  submolts: Submolt[];
  posts: Post[];
}

export default function HUD({
  glanceMode,
  onGlanceModeChange,
  searchQuery,
  onSearchChange,
  onResetView,
  submolts,
  posts,
}: HUDProps) {
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [biomeLegendOpen, setBiomeLegendOpen] = useState(false);
  const [communitiesOpen, setCommunitiesOpen] = useState(false);

  // Filter search results
  const searchResults = searchQuery
    ? [
        ...submolts.filter(s =>
          s.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        ...posts.filter(p =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      ]
    : [];

  return (
    <div className="pointer-events-auto">
      {/* Data status indicator and instructions */}
      <div className="absolute top-4 right-4 z-30 px-4 py-3 bg-background/95 backdrop-blur-md border border-border/50 rounded text-xs space-y-2 max-w-xs">
        <div className="font-semibold">Data Status</div>
        <div>Communities: {submolts.length}</div>
        <div>Posts: {posts.length}</div>
        <div className="pt-2 border-t border-border/50 mt-2">
          <div className="font-semibold mb-1">How to use:</div>
          <div className="text-muted-foreground text-[10px] space-y-1">
            <div>• Click markers on globe to explore</div>
            <div>• Click posts to see details</div>
            <div>• Use search to find content</div>
            <div>• Drag to rotate, scroll to zoom</div>
          </div>
        </div>
      </div>

      {/* Bottom control bar - compact, 10% of screen */}
      <div className="absolute bottom-0 left-0 right-0 h-[10vh] z-20 flex items-center justify-center gap-4 px-6 bg-background/95 backdrop-blur-md border-t border-border/50">
        <Input
          placeholder="Search biomes, districts, posts..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setSearchResultsOpen(e.target.value.length > 0);
          }}
          className="w-64 h-9 bg-background/80 border-border/50 text-foreground placeholder:text-muted-foreground/70 text-sm"
        />
        <div className="flex items-center gap-2">
          <Button
            variant={glanceMode ? "default" : "outline"}
            size="sm"
            onClick={() => onGlanceModeChange(!glanceMode)}
            className="h-9 px-3 text-xs bg-background/80 border-border/50 hover:bg-background/100"
          >
            Glance
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBiomeLegendOpen(true)}
            className="h-9 px-3 text-xs bg-background/80 border-border/50 hover:bg-background/100"
          >
            Biomes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommunitiesOpen(true)}
            className="h-9 px-3 text-xs bg-background/80 border-border/50 hover:bg-background/100"
          >
            Communities ({submolts.length})
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetView}
            className="h-9 px-3 text-xs bg-background/80 border-border/50 hover:bg-background/100"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Search results */}
      <Sheet open={searchResultsOpen} onOpenChange={setSearchResultsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Search Results</SheetTitle>
            <SheetClose onClick={() => setSearchResultsOpen(false)} />
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)] mt-4">
            <div className="space-y-2">
              {searchResults.length === 0 ? (
                <div className="text-muted-foreground">No results found</div>
              ) : (
                searchResults.map((item) => (
                  <div
                    key={'id' in item ? item.id : item.name}
                    className="p-3 rounded-md border border-border hover:border-primary cursor-pointer transition-colors"
                  >
                    <div className="font-medium text-sm">
                      {'title' in item ? item.title : item.display_name}
                    </div>
                    {'submolt' in item && (
                      <div className="text-xs text-muted-foreground mt-1">
                        in {item.submolt.display_name}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Biome legend */}
      <Sheet open={biomeLegendOpen} onOpenChange={setBiomeLegendOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Biomes</SheetTitle>
            <SheetClose onClick={() => setBiomeLegendOpen(false)} />
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)] mt-4">
            <div className="space-y-3">
              {[
                { name: "Silicon Valley", color: "#2a4a5a" },
                { name: "Creator Coast", color: "#4a3a5a" },
                { name: "Agora", color: "#4a4a3a" },
                { name: "Mind Palace", color: "#3a4a4a" },
                { name: "Chaos Bay", color: "#5a3a3a" },
                { name: "Crypto Quarter", color: "#4a2a5a" },
                { name: "The Commons", color: "#3a3a3a" },
              ].map((biome) => (
                <div key={biome.name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: biome.color }}
                  />
                  <div className="text-sm">{biome.name}</div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Communities list */}
      <Sheet open={communitiesOpen} onOpenChange={setCommunitiesOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Communities ({submolts.length})</SheetTitle>
            <SheetClose onClick={() => setCommunitiesOpen(false)} />
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)] mt-4">
            <div className="space-y-2">
              {submolts.length === 0 ? (
                <div className="text-muted-foreground">No communities found</div>
              ) : (
                submolts.map((submolt) => (
                  <div
                    key={submolt.id}
                    className="p-3 rounded-md border border-border hover:border-primary cursor-pointer transition-colors"
                  >
                    <div className="font-medium text-sm">{submolt.display_name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {submolt.subscriber_count} subscribers
                    </div>
                    {submolt.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {submolt.description}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
