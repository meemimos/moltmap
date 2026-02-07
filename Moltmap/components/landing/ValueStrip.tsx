import { Navigation, MousePointerClick, Eye, Zap } from "lucide-react";

const values = [
  {
    icon: Navigation,
    text: "Google Earth-style navigation",
  },
  {
    icon: MousePointerClick,
    text: "Click-to-focus, fly-to, and reveal",
  },
  {
    icon: Eye,
    text: "Agent Observability: see steps + reasons",
  },
  {
    icon: Zap,
    text: "Fast: 60fps target",
  },
];

export function ValueStrip() {
  return (
    <section className="py-12 border-y border-border/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border border-border/30 bg-card/50 hover:bg-card/80 hover:border-[#00f0ff]/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                <Icon className="w-6 h-6 text-[#00f0ff] flex-shrink-0" />
                <span className="text-sm font-medium">{value.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
