import { NextResponse } from "next/server";
import type { AgentEvent } from "../../../../lib/types";

/**
 * Server-Sent Events stream for agent observability
 * Streams mock events for MVP1
 */
export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false;
      
      const sendEvent = (event: AgentEvent) => {
        if (isClosed) return;
        try {
          const data = JSON.stringify(event);
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch (err) {
          // Controller might be closed
          isClosed = true;
          clearInterval(interval);
        }
      };

      // Send initial goal
      sendEvent({
        type: 'goal.set',
        timestamp: Date.now(),
        goal: 'Explore Moltmap and discover interesting posts',
      });

      // Simulate agent activity
      const eventTypes: AgentEvent['type'][] = ['move.to', 'tool.call', 'thought.emit'];
      const biomes = ['Silicon Valley', 'Creator Coast', 'Agora', 'Mind Palace', 'Chaos Bay', 'Crypto Quarter'];
      const tools = ['search', 'read', 'analyze', 'navigate'];
      const thoughts = [
        'Interesting patterns in this region',
        'High activity detected',
        'Exploring new territory',
        'Found relevant content',
        'Analyzing engagement metrics',
      ];

      let eventCount = 0;
      let interval: NodeJS.Timeout | null = null;
      
      interval = setInterval(() => {
        if (isClosed) {
          if (interval) clearInterval(interval);
          return;
        }
        
        eventCount++;
        
        // Rate limit: ~1 event per 2-3 seconds
        if (Math.random() > 0.4) return;

        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        switch (eventType) {
          case 'move.to':
            const level = ['biome', 'submolt', 'post'][Math.floor(Math.random() * 3)] as 'biome' | 'submolt' | 'post';
            sendEvent({
              type: 'move.to',
              timestamp: Date.now(),
              level,
              id: level === 'biome' 
                ? biomes[Math.floor(Math.random() * biomes.length)]
                : `item-${Math.floor(Math.random() * 100)}`,
            });
            break;
            
          case 'tool.call':
            sendEvent({
              type: 'tool.call',
              timestamp: Date.now(),
              tool: tools[Math.floor(Math.random() * tools.length)],
              status: Math.random() > 0.5 ? 'start' : 'end',
            });
            break;
            
          case 'thought.emit':
            sendEvent({
              type: 'thought.emit',
              timestamp: Date.now(),
              text: thoughts[Math.floor(Math.random() * thoughts.length)],
              confidence: Math.random(),
            });
            break;
        }

        // Stop after reasonable number of events (for demo)
        if (eventCount > 50) {
          if (interval) clearInterval(interval);
          isClosed = true;
          try {
            controller.close();
          } catch (err) {
            // Already closed
          }
        }
      }, 2500); // ~2.5 seconds between events

      // Cleanup on client disconnect
      return () => {
        isClosed = true;
        if (interval) clearInterval(interval);
        try {
          controller.close();
        } catch (err) {
          // Already closed
        }
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
