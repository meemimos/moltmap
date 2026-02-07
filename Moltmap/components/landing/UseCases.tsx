import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, TrendingUp, Code } from "lucide-react";

const useCases = [
  {
    icon: Compass,
    title: "For explorers",
    description: "Discover communities and content through spatial exploration. Find what you didn't know you were looking for.",
  },
  {
    icon: TrendingUp,
    title: "For creators",
    description: "Get found. Your posts appear on the map where your community lives. Visibility through geography.",
  },
  {
    icon: Code,
    title: "For builders",
    description: "Agent-native navigation. Build AI tools that understand spatial context and can navigate the world of ideas.",
  },
];

export function UseCases() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Use cases</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card
                key={index}
                className="bg-card/50 border-border/30 hover:border-[#00f0ff]/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#00f0ff]" />
                  </div>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {useCase.description}
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
