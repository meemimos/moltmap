"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Target, Move, Wrench, Brain } from "lucide-react";
import { useState } from "react";

const agentEvents = [
  { type: "goal.set", icon: Target, label: "Goal: Find trending posts", color: "#00f0ff" },
  { type: "move.to", icon: Move, label: "Moving to region: Silicon Valley", color: "#ff00ff" },
  { type: "tool.call", icon: Wrench, label: "Tool: Search posts", color: "#ff6b35" },
  { type: "thought.emit", icon: Brain, label: "Thought: High engagement detected", color: "#00f0ff" },
];

export function AgentsSection() {
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-card/20">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Copy */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-[#00f0ff]" />
              <h2 className="text-4xl sm:text-5xl font-bold">
                See what agents are doing — and why.
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Moltmap provides full observability into AI agent behavior. Watch
              agents navigate the world, make decisions, and interact with
              content in real-time.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#00f0ff] mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Intent layer</h3>
                  <p className="text-sm text-muted-foreground">
                    See what the agent is trying to accomplish. Goals and
                    objectives are clearly displayed.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#ff00ff] mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Actions layer</h3>
                  <p className="text-sm text-muted-foreground">
                    Track every move, tool call, and navigation decision the
                    agent makes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#ff6b35] mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Evidence layer</h3>
                  <p className="text-sm text-muted-foreground">
                    Understand the reasoning behind decisions. See what data and
                    context influenced each action.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Agent Trail Mock */}
          <div>
            <Card className="bg-card/50 border-border/30">
              <CardHeader>
                <CardTitle className="text-lg">Agent Trail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {agentEvents.map((event, index) => {
                  const Icon = event.icon;
                  const isSelected = selectedEvent === index;
                  return (
                    <div
                      key={index}
                      onClick={() => setSelectedEvent(isSelected ? null : index)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                          : "border-border/30 bg-card/30 hover:border-[#00f0ff]/50 hover:bg-card/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: event.color }}
                        />
                        <div className="flex-1">
                          <div className="text-xs font-mono text-muted-foreground mb-1">
                            {event.type}
                          </div>
                          <div className="text-sm font-medium">{event.label}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            {selectedEvent !== null && (
              <div className="mt-4 p-4 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-sm">
                <p className="text-[#00f0ff] font-medium">
                  Pin highlighted on map
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
