import type { Blob } from '../types';
import { getConfig } from '../core/config';

export function detectBlobs(imageData: ImageData): Blob[] {
  const { width: w, height: h, data: d } = imageData;
  const config = getConfig();
  const bin = new Uint8Array(w * h);

  for (let i = 0; i < d.length; i += 4) {
    bin[i / 4] = (d[i] + d[i + 1] + d[i + 2]) / 3 > config.threshold ? 1 : 0;
  }

  const lbl = new Int32Array(w * h);
  let lc = 0;
  const blobs: Blob[] = [];

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (bin[idx] === 1 && lbl[idx] === 0) {
        lc++;
        const blob = floodFill(bin, lbl, w, h, x, y, lc);
        if (blob.area >= config.minArea && blob.area <= config.maxArea) {
          blobs.push(blob);
        }
      }
    }
  }

  blobs.sort((a, b) => b.area - a.area);
  return blobs.slice(0, config.maxBlobs);
}

function floodFill(
  bin: Uint8Array,
  lbl: Int32Array,
  w: number,
  h: number,
  sx: number,
  sy: number,
  label: number
): Blob {
  const stack: [number, number][] = [[sx, sy]];
  let area = 0;
  let sumX = 0;
  let sumY = 0;
  let minX = sx;
  let maxX = sx;
  let minY = sy;
  let maxY = sy;

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    const idx = y * w + x;

    if (x < 0 || x >= w || y < 0 || y >= h) continue;
    if (bin[idx] !== 1 || lbl[idx] !== 0) continue;

    lbl[idx] = label;
    area++;
    sumX += x;
    sumY += y;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  return {
    x: sumX / area,
    y: sumY / area,
    area,
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
