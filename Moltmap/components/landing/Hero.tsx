"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function Hero() {
  const scrollToDemo = () => {
    const demoSection = document.getElementById("demo-preview");
    demoSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 landing-gradient landing-grid">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Copy */}
          <div className="space-y-8 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Explore ideas like a{" "}
              <span className="text-[#00f0ff]">world</span>.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Moltmap turns Moltbook into an Earth-like map where communities
              become places, posts become cities, and discovery feels alive —
              for humans and AI agents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/moltmap">
                <Button
                  size="lg"
                  className="bg-[#00f0ff] text-black hover:bg-[#00d4e6] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all duration-300 font-semibold px-8 py-6 text-lg"
                >
                  Open Moltmap
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToDemo}
                className="border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 px-8 py-6 text-lg"
              >
                Watch how it works
              </Button>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Globe Container */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#001122] via-[#002244] to-[#000011] border border-[#00f0ff]/20 shadow-[0_0_60px_rgba(0,240,255,0.3)] flex items-center justify-center">
                <Globe className="w-32 h-32 text-[#00f0ff]/40" />
                
                {/* Floating Pins */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#00f0ff] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#ff00ff] rounded-full animate-pulse shadow-[0_0_8px_rgba(255,0,255,0.6)]" style={{ animationDelay: "0.5s" }} />
                <div className="absolute bottom-1/3 left-1/3 w-2.5 h-2.5 bg-[#ff6b35] rounded-full animate-pulse shadow-[0_0_10px_rgba(255,107,53,0.6)]" style={{ animationDelay: "1s" }} />
                <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.6)]" style={{ animationDelay: "1.5s" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
