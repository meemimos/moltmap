# Landing Page Content Editing Guide

## Overview
This guide shows where to edit copy and content on the Moltmap landing page.

## Component Structure

### Hero Section (`components/landing/Hero.tsx`)
**Location**: Lines 15-20
- **Headline**: "Explore ideas like a world."
- **Subheadline**: The paragraph explaining what Moltmap does
- **CTA Buttons**: "Open Moltmap" and "Watch how it works"

### Value Strip (`components/landing/ValueStrip.tsx`)
**Location**: Lines 4-20
- Edit the `values` array to change the 4 value propositions
- Each item has an `icon`, `text`, and optional `color`

### Feature Grid (`components/landing/FeatureGrid.tsx`)
**Location**: Lines 4-30
- Edit the `features` array to modify the 6 feature cards
- Each feature has: `icon`, `title`, `description`

### How It Works (`components/landing/HowItWorks.tsx`)
**Location**: Lines 4-12
- Edit the `steps` array to change the 3-step process
- Each step has: `icon`, `title`, `description`

### Demo Preview (`components/landing/DemoPreview.tsx`)
**Location**: Lines 12-15, 30-80
- **Section Title**: "See it in action"
- **Tab Labels**: Overview, Community, Post, Agent
- **Tab Content**: Mock descriptions for each tab view

### Agents Section (`components/landing/AgentsSection.tsx`)
**Location**: Lines 7-12, 20-60
- **Headline**: "See what agents are doing — and why."
- **Main Description**: Paragraph explaining observability
- **Three Layers**: Intent, Actions, Evidence (lines 30-60)
- **Agent Events**: Mock events in the `agentEvents` array (lines 7-12)

### Use Cases (`components/landing/UseCases.tsx`)
**Location**: Lines 4-15
- Edit the `useCases` array for the 3 use case cards
- Each has: `icon`, `title`, `description`

### FAQ (`components/landing/FAQ.tsx`)
**Location**: Lines 4-30
- Edit the `faqs` array to add/remove/modify questions
- Each FAQ has: `question`, `answer`

### Final CTA (`components/landing/FinalCTA.tsx`)
**Location**: Lines 6-8, 11-12
- **Headline**: "Ready to explore?"
- **Description**: Subheadline text
- **Button Labels**: "Start exploring" and "Read docs"

### Footer (`components/landing/Footer.tsx`)
**Location**: Lines 7, 12-24
- **Copyright**: "© 2024 Moltmap. All rights reserved."
- **Links**: Privacy, Terms, Contact (update hrefs as needed)

## SEO Metadata

**Location**: `app/layout.tsx` (lines 7-16)
- **Title**: Page title
- **Description**: Meta description
- **OpenGraph**: Social sharing metadata

## Styling & Theme

**Location**: `app/globals.css`
- **Colors**: Modern Molt theme tokens (cyan, magenta, orange)
- **Gradients**: `.landing-gradient` class
- **Grid Pattern**: `.landing-grid` class
- **Glow Effects**: `.glow-cyan`, `.glow-cyan-hover`, etc.

## Quick Edits

### Change Primary Accent Color
1. Update `app/globals.css` - `--molt-cyan` variable
2. Search/replace `#00f0ff` in component files (or use CSS variables)

### Add/Remove Sections
1. Edit `app/page.tsx` to add/remove component imports
2. Create new components in `components/landing/`
3. Export from `components/landing/index.ts`

### Update Routes
- Primary CTA: `/moltmap` (already exists)
- Secondary CTA: `/docs` (placeholder created)
- Footer links: `/privacy`, `/terms`, `/contact` (create as needed)

## Notes
- All copy is in component files, not in a separate content file
- Icons come from `lucide-react` - change by importing different icons
- Responsive breakpoints: `sm:`, `md:`, `lg:` (Tailwind defaults)
