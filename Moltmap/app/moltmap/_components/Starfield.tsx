"use client"

import { Stars } from '@react-three/drei';

export default function Starfield() {
  return (
    <Stars
      radius={50}
      depth={50}
      count={2000}
      factor={2}
      saturation={0.1}
      fade
      speed={0.1}
    />
  );
}
