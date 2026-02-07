"use client"

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import type { AgentEvent, Post } from '@/lib/types';

interface AgentOverlayProps {
  selectedPost: Post | null;
  onPostClose: () => void;
}

export default function AgentOverlay({ selectedPost, onPostClose }: AgentOverlayProps) {
  const [agentPanelOpen, setAgentPanelOpen] = useState(false);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [currentGoal, setCurrentGoal] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<string>('');

  // Subscribe to SSE events
  useEffect(() => {
    const eventSource = new EventSource('/api/agent/events');
    
    eventSource.onmessage = (event) => {
      try {
        const data: AgentEvent = JSON.parse(event.data);
        
        setEvents(prev => {
          const newEvents = [data, ...prev].slice(0, 10); // Keep last 10
          return newEvents;
        });

        // Update state based on event type
        switch (data.type) {
          case 'goal.set':
            if (data.goal) setCurrentGoal(data.goal);
            break;
          case 'move.to':
            if (data.level && data.id) {
              setCurrentStep(`Moving to ${data.level}: ${data.id}`);
              // 3D orb animation will be added in MVP2
            }
            break;
          case 'tool.call':
            if (data.tool && data.status) {
              setCurrentStep(`${data.status === 'start' ? 'Using' : 'Finished'} ${data.tool}`);
            }
            break;
          case 'thought.emit':
            if (data.text) {
              setCurrentStep(`Thinking: ${data.text}`);
            }
            break;
        }
      } catch (err) {
        console.error('Error parsing agent event:', err);
      }
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="pointer-events-auto">
      {/* Agent panel toggle button - in bottom bar */}
      <div className="absolute bottom-0 right-6 h-[10vh] z-20 flex items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAgentPanelOpen(true)}
          className="h-9 px-3 text-xs bg-background/80 border-border/50 hover:bg-background/100"
        >
          Agent
        </Button>
      </div>

      {/* Agent observability panel */}
      <Sheet open={agentPanelOpen} onOpenChange={setAgentPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Agent Observability</SheetTitle>
            <SheetClose onClick={() => setAgentPanelOpen(false)} />
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-150px)] mt-4">
            <div className="space-y-4">
              {currentGoal && (
                <div>
                  <div className="text-sm font-semibold mb-1">Current Goal</div>
                  <div className="text-sm text-muted-foreground">{currentGoal}</div>
                </div>
              )}
              {currentStep && (
                <div>
                  <div className="text-sm font-semibold mb-1">Current Step</div>
                  <div className="text-sm text-muted-foreground">{currentStep}</div>
                </div>
              )}
              <div>
                <div className="text-sm font-semibold mb-2">Recent Events</div>
                <div className="space-y-2">
                  {events.map((event, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-md border border-border text-xs"
                    >
                      <div className="font-medium">{event.type}</div>
                      {event.goal && <div className="text-muted-foreground mt-1">{event.goal}</div>}
                      {event.text && <div className="text-muted-foreground mt-1">{event.text}</div>}
                      {event.level && event.id && (
                        <div className="text-muted-foreground mt-1">
                          {event.level}: {event.id}
                        </div>
                      )}
                      <div className="text-muted-foreground mt-1 text-[10px]">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

    </div>
  );
}
