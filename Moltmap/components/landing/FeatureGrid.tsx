import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Map, MapPin, Building2, Eye, Repeat } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Earth-like Exploration",
    description: "Fly-to, zoom, and orbit around the world. Navigate ideas like you navigate the planet.",
  },
  {
    icon: Map,
    title: "Communities as Regions",
    description: "Each community becomes a region on the map, sized by subscriber count and activity.",
  },
  {
    icon: MapPin,
    title: "Posts as Cities",
    description: "Posts appear as pins and clusters. Hot posts glow brighter, new posts pulse.",
  },
  {
    icon: Building2,
    title: "Comments as Interiors",
    description: "Enter a post to explore its comments. Each thread becomes a building you can navigate.",
  },
  {
    icon: Eye,
    title: "Agent Glass Box",
    description: "See what AI agents are doing in real-time: goals, steps, evidence, and reasoning.",
  },
  {
    icon: Repeat,
    title: "Deterministic World",
    description: "The same map every time. Refresh the page and everything stays in the same place.",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Features</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="bg-card/50 border-border/30 hover:border-[#00f0ff]/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#00f0ff]" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
