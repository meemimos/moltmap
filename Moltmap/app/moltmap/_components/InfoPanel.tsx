"use client"

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { classifyBiome } from '@/lib/moltmap/mapping';
import type { Submolt, Post } from '@/lib/types';

interface InfoPanelProps {
  submolt: Submolt | null;
  post: Post | null;
  onClose: () => void;
  onPostClick: (post: Post) => void;
  topHotPosts?: Post[];
  topNewPosts?: Post[];
}

export default function InfoPanel({
  submolt,
  post,
  onClose,
  onPostClick,
  topHotPosts = [],
  topNewPosts = [],
}: InfoPanelProps) {
  const isOpen = submolt !== null || post !== null;

  if (!isOpen) {
    return null;
  }

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
          {submolt && !post && (
            <>
              {/* Header */}
              <div>
                <h2 className="text-2xl font-semibold mb-2">{submolt.display_name}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {classifyBiome(submolt.name, submolt.display_name, submolt.description).name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Community</span>
                </div>
              </div>

              {/* Media placeholder (Google Earth style) */}
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
                  <div className="text-xl font-bold">{topHotPosts.length + topNewPosts.length}</div>
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

              {/* Top Hot Posts */}
              {topHotPosts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Top Hot Posts</h3>
                  <div className="space-y-2">
                    {topHotPosts.slice(0, 10).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onPostClick(p)}
                        className="w-full p-3 rounded-md border border-border/50 hover:border-primary hover:bg-accent/50 transition-colors text-left"
                      >
                        <div className="font-medium text-sm truncate">{p.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {p.upvotes || 0} upvotes • {p.comment_count || 0} comments
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Top New Posts */}
              {topNewPosts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Top New Posts</h3>
                  <div className="space-y-2">
                    {topNewPosts.slice(0, 10).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => onPostClick(p)}
                        className="w-full p-3 rounded-md border border-border/50 hover:border-primary hover:bg-accent/50 transition-colors text-left"
                      >
                        <div className="font-medium text-sm truncate">{p.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(p.created_at).toLocaleDateString()} • {p.upvotes || 0} upvotes
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Action buttons */}
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
                  onClick={() => {
                    // TODO: Implement "Walk with Agent" feature
                    console.log('Walk with Agent clicked');
                  }}
                >
                  Walk with Agent
                </Button>
              </div>
            </>
          )}

          {post && (
            <>
              {/* Back button to submolt */}
              {submolt && (
                <button
                  onClick={() => onPostClick(post)}
                  className="text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                  ← Back to {submolt.display_name}
                </button>
              )}

              {/* Header */}
              <div>
                <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                <div className="text-sm text-muted-foreground">
                  by {post.author.name} in {post.submolt.display_name}
                </div>
              </div>

              {/* Media placeholder */}
              <div className="w-full h-48 bg-muted/50 rounded-md border border-border/50 flex items-center justify-center">
                <span className="text-sm text-muted-foreground">Post Image</span>
              </div>

              {/* Content snippet */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Content</h3>
                <p className="text-sm text-foreground leading-relaxed line-clamp-6">
                  {post.content}
                </p>
              </div>

              <Separator />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Upvotes</div>
                  <div className="text-xl font-bold">{post.upvotes || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Comments</div>
                  <div className="text-xl font-bold">{post.comment_count || 0}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Engagement</div>
                  <div className="text-xl font-bold">
                    {(post.upvotes || 0) + (post.comment_count || 0) * 2}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    window.open(`https://www.moltbook.com/post/${post.id}`, '_blank', 'noopener,noreferrer');
                  }}
                  >
                  Open Post
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.open(`https://www.moltbook.com/submolt/${post.submolt.name}`, '_blank', 'noopener,noreferrer');
                  }}
                >
                  View Community
                </Button>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-border/50">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Posted {new Date(post.created_at).toLocaleString()}</div>
                  <div>Post ID: {post.id}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
