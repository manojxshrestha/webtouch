import type { Blob } from '../types';

function distance(p1: Blob, p2: Blob): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

export function matchBlobs(current: Blob[], previous: Blob[]): Blob[] {
  if (previous.length === 0) return current;

  const matched: Blob[] = [];
  const used = new Set<number>();

  for (const curr of current) {
    let bestMatch: number | null = null;
    let bestDist = Infinity;

    for (let i = 0; i < previous.length; i++) {
      if (used.has(i)) continue;
      const prev = previous[i];
      const dist = distance(curr, prev);
      if (dist < bestDist && dist < 100) {
        bestDist = dist;
        bestMatch = i;
      }
    }

    if (bestMatch !== null) {
      used.add(bestMatch);
      const prev = previous[bestMatch];
      const alpha = 0.3;
      matched.push({
        ...curr,
        x: alpha * curr.x + (1 - alpha) * prev.x,
        y: alpha * curr.y + (1 - alpha) * prev.y,
        vx: curr.x - prev.x || 0,
        vy: curr.y - prev.y || 0,
        id: prev.id,
      });
    } else {
      matched.push({ ...curr, vx: 0, vy: 0, id: Math.random() });
    }
  }

  return matched;
}
