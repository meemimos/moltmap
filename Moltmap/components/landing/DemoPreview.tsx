"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Map, FileText, Bot } from "lucide-react";

export function DemoPreview() {
  return (
    <section id="demo-preview" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">See it in action</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore different views of Moltmap
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <Card className="bg-card/50 border-border/30 overflow-hidden">
            <Tabs defaultValue="overview" className="w-full">
              <div className="border-b border-border/30 px-6">
                <TabsList className="bg-transparent h-auto p-0 w-full justify-start">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00f0ff] rounded-none"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="community"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00f0ff] rounded-none"
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Community
                  </TabsTrigger>
                  <TabsTrigger
                    value="post"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00f0ff] rounded-none"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Post
                  </TabsTrigger>
                  <TabsTrigger
                    value="agent"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-[#00f0ff] rounded-none"
                  >
                    <Bot className="w-4 h-4 mr-2" />
                    Agent
                  </TabsTrigger>
                </TabsList>
              </div>
              <CardContent className="p-0">
                <TabsContent value="overview" className="mt-0">
                  <div className="aspect-video bg-gradient-to-br from-[#001122] via-[#002244] to-[#000011] flex items-center justify-center relative overflow-hidden">
                    <Globe className="w-32 h-32 text-[#00f0ff]/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <p className="text-[#00f0ff] text-sm font-medium">World View</p>
                        <p className="text-muted-foreground text-xs">Navigate the entire map</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="community" className="mt-0">
                  <div className="aspect-video bg-gradient-to-br from-[#001122] via-[#002244] to-[#000011] flex items-center justify-center relative overflow-hidden">
                    <Map className="w-32 h-32 text-[#00f0ff]/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <p className="text-[#00f0ff] text-sm font-medium">Community Region</p>
                        <p className="text-muted-foreground text-xs">See posts and activity</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="post" className="mt-0">
                  <div className="aspect-video bg-gradient-to-br from-[#001122] via-[#002244] to-[#000011] flex items-center justify-center relative overflow-hidden">
                    <FileText className="w-32 h-32 text-[#00f0ff]/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <p className="text-[#00f0ff] text-sm font-medium">Post Detail</p>
                        <p className="text-muted-foreground text-xs">Explore comments and threads</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="agent" className="mt-0">
                  <div className="aspect-video bg-gradient-to-br from-[#001122] via-[#002244] to-[#000011] flex items-center justify-center relative overflow-hidden">
                    <Bot className="w-32 h-32 text-[#00f0ff]/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <p className="text-[#00f0ff] text-sm font-medium">Agent Observability</p>
                        <p className="text-muted-foreground text-xs">See goals, steps, and evidence</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </section>
  );
}
