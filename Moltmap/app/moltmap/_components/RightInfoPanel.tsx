"use client"

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMapStore } from '@/lib/moltmap/store';
import { getCategoryColor } from '@/lib/moltmap/cesium-mapping';
import type { Submolt } from '@/lib/types';

interface RightInfoPanelProps {
  submolt: Submolt | null;
  onClose: () => void;
}

export default function RightInfoPanel({ submolt, onClose }: RightInfoPanelProps) {
  const { panelOpen } = useMapStore();

  if (!panelOpen || !submolt) {
    return null;
  }

  const categoryColor = getCategoryColor(submolt);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[400px] bg-background/95 backdrop-blur-md border-l border-border/50 shadow-2xl pointer-events-auto z-40 flex flex-col">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-background/80 hover:bg-background border border-border/50 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
        aria-label="Close"
      >
        ×
      </button>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">{submolt.display_name}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: categoryColor, color: categoryColor }}
              >
                Community
              </Badge>
            </div>
          </div>

          {/* Media placeholder */}
          <div className="w-full h-48 bg-muted/50 rounded-md border border-border/50 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Community Image</span>
          </div>

          {/* Description */}
          {submolt.description && (
            <div>
              <h3 className="text-sm font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {submolt.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Subscribers</div>
              <div className="text-xl font-bold">{submolt.subscriber_count.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Posts</div>
              <div className="text-xl font-bold">—</div>
            </div>
            {submolt.last_activity_at && (
              <div>
                <div className="text-xs text-muted-foreground mb-1">Activity</div>
                <div className="text-sm font-medium">
                  {new Date(submolt.last_activity_at).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Action buttons - REQUIRED */}
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => {
                window.open(`https://www.moltbook.com/submolt/${submolt.name}`, '_blank', 'noopener,noreferrer');
              }}
            >
              Open Community
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  // Try to fetch feed
                  const response = await fetch(`/api/submolts/${submolt.name}/feed`);
                  if (response.ok) {
                    const posts = await response.json();
                    if (Array.isArray(posts) && posts.length > 0) {
                      // TODO: Show posts in panel or navigate
                      alert(`Found ${posts.length} posts. Posts view coming soon!`);
                    } else {
                      alert('No posts found in this community yet.');
                    }
                  } else {
                    alert('Posts feature coming soon!');
                  }
                } catch (e) {
                  alert('Posts feature coming soon!');
                }
              }}
            >
              View Top Posts
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Mock action
                console.log('Follow clicked');
                alert('Follow feature coming soon!');
              }}
            >
              Follow
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                // Mock action
                console.log('Walk with Agent clicked');
                alert('Walk with Agent feature coming soon!');
              }}
            >
              Walk with Agent
            </Button>
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-border/50">
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                <span className="font-medium">ID:</span> {submolt.id}
              </div>
              <div>
                <span className="font-medium">Name:</span> {submolt.name}
              </div>
              {submolt.created_at && (
                <div>
                  <span className="font-medium">Created:</span>{' '}
                  {new Date(submolt.created_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
