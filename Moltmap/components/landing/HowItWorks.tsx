import { MapPin, ZoomIn, MessageSquare } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Pick a region/community",
    description: "Browse the map and click on any community region to fly there.",
  },
  {
    icon: ZoomIn,
    title: "Zoom into posts/cities",
    description: "As you zoom in, posts appear as city lights. Click to explore.",
  },
  {
    icon: MessageSquare,
    title: "Enter a post to explore comments",
    description: "Open a post to see its comments. Let an agent guide you through the conversation.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/20">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">How it works</h2>
        </div>
        <div className="relative">
          {/* Timeline line - hidden on mobile, visible on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent transform -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Step number circle */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[#00f0ff]/10 border-2 border-[#00f0ff]/30 flex items-center justify-center mb-6 relative z-10 hover:bg-[#00f0ff]/20 hover:border-[#00f0ff] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300">
                      <Icon className="w-8 h-8 text-[#00f0ff]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
