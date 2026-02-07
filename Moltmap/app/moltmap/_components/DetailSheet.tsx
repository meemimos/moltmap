"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { classifyBiome } from '@/lib/moltmap/mapping';
import type { Submolt, Post } from '@/lib/types';

interface DetailSheetProps {
  submolt: Submolt | null;
  post: Post | null;
  onClose: () => void;
}

export default function DetailSheet({ submolt, post, onClose }: DetailSheetProps) {
  const isOpen = submolt !== null || post !== null;

  console.log('DetailSheet render:', { isOpen, submolt: submolt?.display_name, post: post?.title });

  if (!isOpen) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} side="right">
      <SheetContent className="w-full sm:w-[540px]">
        <div className="h-full flex flex-col">
          <SheetHeader className="flex-shrink-0 border-b border-border">
            <SheetClose onClick={onClose} />
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {submolt && (
              <>
                {/* Header */}
                <div>
                  <SheetTitle className="text-2xl mb-2">{submolt.display_name}</SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    Community / District
                  </SheetDescription>
                </div>

                <Separator />

                {/* Biome Badge */}
                <div>
                  <div className="text-sm font-semibold mb-2">Category</div>
                  <Badge variant="outline" className="text-xs">
                    {classifyBiome(submolt.name, submolt.display_name, submolt.description).name}
                  </Badge>
                </div>

                {/* Description */}
                {submolt.description && (
                  <div>
                    <div className="text-sm font-semibold mb-2">About</div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {submolt.description}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-semibold mb-1">Subscribers</div>
                    <div className="text-2xl font-bold">{submolt.subscriber_count.toLocaleString()}</div>
                  </div>
                  {submolt.last_activity_at && (
                    <div>
                      <div className="text-sm font-semibold mb-1">Last Activity</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(submolt.last_activity_at).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-xs text-muted-foreground">
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
              </>
            )}

            {post && (
              <>
                {/* Header */}
                <div>
                  <SheetTitle className="text-2xl mb-2">{post.title}</SheetTitle>
                  <SheetDescription className="text-sm text-muted-foreground">
                    by {post.author.name} in {post.submolt.display_name}
                  </SheetDescription>
                </div>

                <Separator />

                {/* Content */}
                <div>
                  <div className="text-sm font-semibold mb-2">Content</div>
                  <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-semibold mb-1">Upvotes</div>
                    <div className="text-2xl font-bold">{post.upvotes || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-1">Comments</div>
                    <div className="text-2xl font-bold">{post.comment_count || 0}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-1">Engagement</div>
                    <div className="text-2xl font-bold">
                      {(post.upvotes || 0) + (post.comment_count || 0) * 2}
                    </div>
                  </div>
                </div>

                {/* Community Link */}
                <div>
                  <div className="text-sm font-semibold mb-2">Community</div>
                  <div className="p-3 rounded-md border border-border bg-muted/50">
                    <div className="font-medium text-sm">{post.submolt.display_name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {post.submolt.name}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    size="default"
                    onClick={() => {
                      window.open(`https://www.moltbook.com/post/${post.id}`, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    Open on Moltbook →
                  </Button>
                  {post.comment_count > 0 && (
                    <div className="text-xs text-muted-foreground text-center">
                      {post.comment_count} comment{post.comment_count !== 1 ? 's' : ''} available on Moltbook
                    </div>
                  )}
                </div>

                <Separator />

                {/* Metadata */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Post ID:</span> {post.id}
                  </div>
                  <div>
                    <span className="font-medium">Author:</span> {post.author.name} ({post.author.id})
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>{' '}
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
