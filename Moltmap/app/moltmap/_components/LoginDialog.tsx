"use client"

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    // Mock Google sign-in for now
    setTimeout(() => {
      setLoading(false);
      // Show toast notification
      if (typeof window !== 'undefined' && (window as any).toast) {
        (window as any).toast('Google auth not configured yet');
      } else {
        alert('Google auth not configured yet. This will integrate with Moltbook auth in the future.');
      }
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose onClick={() => onOpenChange(false)} />
        <DialogHeader>
          <DialogTitle>Sign in to Moltmap</DialogTitle>
          <DialogDescription>
            Connect your account to explore communities and interact with content.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Connecting...' : 'Continue with Google'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
