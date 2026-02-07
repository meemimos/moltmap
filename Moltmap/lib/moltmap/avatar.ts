/**
 * Generate community avatar (initials) as data URL
 */

export function generateAvatarInitials(name: string): string {
  // Extract initials (first 2 letters, uppercase)
  const words = name.trim().split(/\s+/);
  let initials = '';
  if (words.length >= 2) {
    initials = words[0][0] + words[1][0];
  } else {
    initials = name.substring(0, 2).toUpperCase();
  }
  initials = initials.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 2);
  if (initials.length < 2) {
    initials = initials + initials;
  }

  // Generate color from name hash
  const hash = simpleHash(name);
  const hue = hash % 360;
  const saturation = 60 + (hash % 20);
  const lightness = 45 + (hash % 15);

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  // Draw circle background
  ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  ctx.beginPath();
  ctx.arc(32, 32, 32, 0, Math.PI * 2);
  ctx.fill();

  // Draw text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initials, 32, 32);

  return canvas.toDataURL();
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
