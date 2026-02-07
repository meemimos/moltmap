# Moltmap Landing Page - Implementation Plan

## Overview
Build a modern, dark-themed marketing landing page for Moltmap with a "modern molt" aesthetic (dark, minimal, neon-on-interaction).

## Design System & Styling Tokens

### Color Palette ("Modern Molt")
- **Background**: Deep space (`#000011` base) with subtle gradients
- **Primary Accent**: Electric cyan (`#00f0ff`, `#0ff` - subtle, not obnoxious)
- **Hover Accents**: Magenta (`#ff00ff`) / Orange (`#ff6b35`) - only on interaction
- **Text**: High contrast white/light gray (`#f8f9fa`, `#e9ecef`)
- **Cards**: Dark glass (`rgba(15, 15, 25, 0.6)`) with subtle borders
- **Grid/Noise**: Subtle background pattern (CSS gradients + SVG noise)

### Typography
- **Headlines**: Bold, large (4xl-6xl), lots of whitespace
- **Body**: Clean, readable (base-lg)
- **Font**: Inter (already configured)

### Interaction Patterns
- **Hover**: Subtle lift (translate-y), soft glow (box-shadow with accent color)
- **Transitions**: Smooth (200-300ms ease-out)
- **No heavy animations**: Keep it fast and lightweight

## Component Architecture

### File Structure
```
/app/page.tsx                          # Main landing page (orchestrates all sections)
/components/landing/
  Hero.tsx                             # Hero section (headline + CTA + visual)
  ValueStrip.tsx                       # Trust/value bullets strip
  FeatureGrid.tsx                      # 6 feature cards grid
  HowItWorks.tsx                       # 3-step process section
  DemoPreview.tsx                      # Interactive demo with tabs
  AgentsSection.tsx                    # AI agents observability section
  UseCases.tsx                         # 3 use case cards
  FAQ.tsx                              # Accordion FAQ section
  FinalCTA.tsx                         # Final call-to-action section
  Footer.tsx                           # Footer with links
  index.ts                             # Barrel exports
```

### Required shadcn/ui Components (to install/create)
- `card.tsx` - For feature cards, use cases
- `accordion.tsx` - For FAQ section
- `tabs.tsx` - For demo preview section

### Required Dependencies
- `lucide-react` - For icons (Globe, Map, Users, Eye, etc.)

## Section Breakdown

### 1. Hero Section (`Hero.tsx`)
**Layout**: Two-column (left: copy, right: visual)
- **Left Column**:
  - Headline: "Explore ideas like a world."
  - Subheadline: "Moltmap turns Moltbook into an Earth-like map where communities become places, posts become cities, and discovery feels alive — for humans and AI agents."
  - CTAs:
    - Primary: "Open Moltmap" → `/moltmap`
    - Secondary: "Watch how it works" → scroll to demo section
- **Right Column**:
  - Stylized globe placeholder (SVG/CSS)
  - Floating pins animation (subtle, CSS-based)
  - Dark glass card container

**Styling**: Large typography, generous padding, gradient background

### 2. Value Strip (`ValueStrip.tsx`)
**Layout**: Horizontal row (4 items)
- "Google Earth-style navigation"
- "Click-to-focus, fly-to, and reveal"
- "Agent Observability: see steps + reasons"
- "Fast: 60fps target"

**Styling**: Compact, icon + text, subtle borders

### 3. Feature Grid (`FeatureGrid.tsx`)
**Layout**: 3x2 grid (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
**Features**:
1. Earth-like Exploration (Globe icon)
2. Communities as Regions (Map icon)
3. Posts as Cities (Pin icon)
4. Comments as Interiors (Building icon)
5. Agent Glass Box (Eye icon)
6. Deterministic World (Repeat icon)

**Each Card**:
- Icon (lucide-react, large, accent color)
- Title
- 2-line description
- Hover: lift + glow effect

### 4. How It Works (`HowItWorks.tsx`)
**Layout**: 3-step timeline (horizontal on desktop, vertical on mobile)
- Step 1: "Pick a region/community" (icon: MapPin)
- Step 2: "Zoom into posts/cities" (icon: ZoomIn)
- Step 3: "Enter a post to explore comments + let an agent guide you" (icon: MessageSquare)
- Visual: Connecting line/rail between steps

### 5. Demo Preview (`DemoPreview.tsx`)
**Layout**: Centered card with tabs
- **Tabs**: Overview / Community / Post / Agent
- **Content**: Mock screenshot-style UI for each tab
  - Overview: Globe with pins
  - Community: Region detail view
  - Post: Post detail panel
  - Agent: Agent observability panel
- **Interaction**: Tab switching changes content (no real integration)

### 6. AI Agents Section (`AgentsSection.tsx`)
**Layout**: Two-column (left: copy, right: mock UI)
- **Left**:
  - Headline: "See what agents are doing — and why."
  - Explanation of observability layers:
    - Intent layer
    - Actions layer
    - Evidence layer
- **Right**:
  - "Agent trail" mock component
  - List of events: `goal.set`, `move.to`, `tool.call`, `thought.emit`
  - Clickable events (highlight mock pin in demo)

### 7. Use Cases (`UseCases.tsx`)
**Layout**: 3 cards in a row (responsive)
- **For explorers**: "Discover communities" (icon: Compass)
- **For creators**: "Get found" (icon: TrendingUp)
- **For builders**: "Agent-native navigation" (icon: Code)

### 8. FAQ (`FAQ.tsx`)
**Layout**: Accordion component (shadcn/ui)
**Questions** (6-8):
- Is this Google Earth?
- Is it real geography?
- Can I use it without AI?
- How does deterministic layout work?
- What about privacy/logging for agents?
- Performance requirements?
- How do I get started?
- Is it open source?

### 9. Final CTA (`FinalCTA.tsx`)
**Layout**: Centered section with large CTA buttons
- "Start exploring" → `/moltmap`
- "Read docs" → `/docs` (placeholder if missing)

### 10. Footer (`Footer.tsx`)
**Layout**: Minimal footer
- Links: Privacy, Terms, Contact (placeholders OK)
- Copyright: "© 2024 Moltmap"

## SEO & Metadata

### Update `app/layout.tsx`
- Title: "Moltmap - Explore ideas like a world"
- Description: "Moltmap turns Moltbook into an Earth-like map where communities become places, posts become cities, and discovery feels alive — for humans and AI agents."
- OpenGraph tags (simple)

## Routes to Create/Verify
- `/` - Landing page (main)
- `/moltmap` - Already exists ✓
- `/docs` - Create placeholder if missing
- `/about` - Optional placeholder

## Implementation Order
1. Install dependencies (`lucide-react`)
2. Create missing shadcn components (`card`, `accordion`, `tabs`)
3. Update `globals.css` with theme tokens (cyan accent, gradients)
4. Create component files (Hero → Footer)
5. Build main `app/page.tsx` orchestrator
6. Update `app/layout.tsx` metadata
7. Create placeholder routes if needed
8. Test responsive behavior
9. Polish interactions and hover effects

## Technical Notes
- **Performance**: Use CSS for animations (no heavy JS)
- **Accessibility**: Proper heading hierarchy, ARIA labels
- **Responsive**: Mobile-first approach
- **Lighthouse**: Optimize images (use SVG/placeholders), lazy load if needed
