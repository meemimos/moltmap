/**
 * API helpers for fetching Moltbook data with caching
 */

const CACHE_DURATION = {
  submolts: 5 * 60 * 1000, // 5 minutes
  posts: 2 * 60 * 1000, // 2 minutes
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

async function fetchWithCache<T>(
  key: string,
  url: string,
  duration: number
): Promise<T> {
  const cached = cache.get(key);
  const now = Date.now();

  // Return cached data if still valid
  if (cached && (now - cached.timestamp) < duration) {
    return cached.data;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${key}: ${response.statusText}`);
    }
    const data = await response.json();
    
    // Update cache
    cache.set(key, { data, timestamp: now });
    
    return data;
  } catch (error) {
    // Return cached data even if expired, as fallback
    if (cached) {
      console.warn(`Using expired cache for ${key} due to fetch error:`, error);
      return cached.data;
    }
    throw error;
  }
}

export async function fetchSubmolts(): Promise<any[]> {
  try {
    const data = await fetchWithCache<any[]>(
      'submolts',
      '/api/submolts',
      CACHE_DURATION.submolts
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching submolts:', error);
    return [];
  }
}

export async function fetchPosts(sort: 'hot' | 'new' = 'hot', limit: number = 500): Promise<any[]> {
  try {
    const data = await fetchWithCache<any[]>(
      `posts-${sort}-${limit}`,
      `/api/posts?sort=${sort}&limit=${limit}`,
      CACHE_DURATION.posts
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export function clearCache() {
  cache.clear();
}
