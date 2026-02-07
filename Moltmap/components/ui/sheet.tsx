"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  side?: "left" | "right" | "top" | "bottom"
}

export function Sheet({ open, onOpenChange, children, side = "right" }: SheetProps) {
  if (!open) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] pointer-events-auto"
        onClick={() => onOpenChange(false)}
      />
      {/* Sheet Panel */}
      <div
        className={cn(
          "fixed h-full overflow-hidden bg-card text-card-foreground z-[9999] shadow-2xl pointer-events-auto",
          {
            "right-0 top-0 w-full sm:w-[540px]": side === "right",
            "left-0 top-0 w-full sm:w-[540px]": side === "left",
            "top-0 left-0 right-0 h-[400px]": side === "top",
            "bottom-0 left-0 right-0 h-[400px]": side === "bottom",
          }
        )}
      >
        {children}
      </div>
    </>
  )
}

export function SheetContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("h-full flex flex-col overflow-hidden", className)}>
      {children}
    </div>
  )
}

export function SheetHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 border-b border-border", className)}>
      {children}
    </div>
  )
}

export function SheetTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-lg font-semibold", className)}>
      {children}
    </h2>
  )
}

export function SheetDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm text-muted-foreground mt-1", className)}>
      {children}
    </p>
  )
}

export function SheetClose({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="absolute right-4 top-4 h-8 w-8 rounded-sm p-0 opacity-70 hover:opacity-100"
      aria-label="Close"
    >
      <span className="sr-only">Close</span>
      <span className="text-lg">×</span>
    </Button>
  )
}
