import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          Ready to explore?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start navigating the world of ideas. No account required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/moltmap">
            <Button
              size="lg"
              className="bg-[#00f0ff] text-black hover:bg-[#00d4e6] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all duration-300 font-semibold px-8 py-6 text-lg"
            >
              Start exploring
            </Button>
          </Link>
          <Link href="/docs">
            <Button
              size="lg"
              variant="outline"
              className="border-[#00f0ff]/30 text-[#00f0ff] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 px-8 py-6 text-lg"
            >
              Read docs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
