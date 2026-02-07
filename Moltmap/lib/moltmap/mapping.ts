/**
 * Content mapping: biomes, submolts, posts
 */

export interface Biome {
  name: string;
  keywords: string[];
  color: string; // Low saturation color
  index: number;
}

export const BIOMES: Biome[] = [
  {
    name: "Silicon Valley",
    keywords: ["infra", "infrastructure", "tools", "dev", "engineering", "code", "memory", "agents", "automation", "ops", "cicd", "deployment", "architecture", "tech", "software", "system", "api", "backend"],
    color: "#2a4a5a", // Dark blue-gray
    index: 0,
  },
  {
    name: "Creator Coast",
    keywords: ["creator", "content", "marketing", "media", "video", "audio", "design", "art", "creative", "publishing", "storytelling"],
    color: "#4a3a5a", // Purple-gray
    index: 1,
  },
  {
    name: "Agora",
    keywords: ["general", "introductions", "announcements", "discussion", "community", "welcome", "hello", "meta", "social"],
    color: "#4a4a3a", // Yellow-gray
    index: 2,
  },
  {
    name: "Mind Palace",
    keywords: ["philosophy", "aithoughts", "thinking", "ideas", "theory", "concepts", "abstract", "mind", "thought", "reasoning", "consciousness"],
    color: "#3a4a4a", // Cyan-gray
    index: 3,
  },
  {
    name: "Chaos Bay",
    keywords: ["shitposts", "memes", "chaos", "random", "funny", "humor", "joke", "meme", "absurd", "wild"],
    color: "#5a3a3a", // Red-gray
    index: 4,
  },
  {
    name: "Crypto Quarter",
    keywords: ["crypto", "blockchain", "web3", "token", "tokens", "dao", "defi", "nft", "ethereum", "bitcoin", "staking", "tokenomics", "degen", "trading", "finance"],
    color: "#4a2a5a", // Purple-gray
    index: 5,
  },
  {
    name: "The Commons",
    keywords: [], // Default
    color: "#3a3a3a", // Neutral gray
    index: 6,
  },
];

/**
 * Classify submolt into a biome based on keywords
 */
export function classifyBiome(
  name: string,
  displayName?: string,
  description?: string
): Biome {
  const text = `${name} ${displayName || ''} ${description || ''}`.toLowerCase();

  // Score each biome
  const scores = new Map<string, number>();
  
  for (const biome of BIOMES) {
    if (biome.keywords.length === 0) continue; // Skip default
    let score = 0;
    for (const keyword of biome.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        score++;
      }
    }
    scores.set(biome.name, score);
  }

  // Find biome with highest score
  let maxScore = 0;
  let selectedBiome = BIOMES[BIOMES.length - 1]; // Default to Commons
  
  for (const [biomeName, score] of scores.entries()) {
    if (score > maxScore) {
      maxScore = score;
      selectedBiome = BIOMES.find(b => b.name === biomeName) || selectedBiome;
    }
  }

  return selectedBiome;
}
