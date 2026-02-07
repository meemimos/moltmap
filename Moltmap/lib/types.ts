/**
 * Type definitions for Moltbook API data
 */

export interface Submolt {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  subscriber_count: number;
  last_activity_at?: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  submolt: {
    id: string;
    name: string;
    display_name: string;
  };
  created_at: string;
  upvotes: number;
  comment_count: number;
}

export interface AgentEvent {
  type: 'goal.set' | 'move.to' | 'tool.call' | 'thought.emit';
  timestamp: number;
  goal?: string;
  level?: 'biome' | 'submolt' | 'post';
  id?: string;
  tool?: string;
  status?: 'start' | 'end';
  text?: string;
  confidence?: number;
  meta?: any;
}
