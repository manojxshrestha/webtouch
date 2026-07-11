export function drawScanlines(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let y = 0; y < height; y += 3) {
    ctx.fillRect(0, y, width, 1);
  }
}

export function drawGlitch(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const frameData = ctx.getImageData(0, 0, width, height);
  const data = frameData.data;
  const numGlitches = 3 + Math.floor(Math.random() * 5);

  for (let g = 0; g < numGlitches; g++) {
    const y = Math.floor(Math.random() * height);
    const h = 1 + Math.floor(Math.random() * 10);
    const offset = Math.floor((Math.random() - 0.5) * 20);

    for (let row = y; row < Math.min(y + h, height); row++) {
      for (let x = 0; x < width; x++) {
        const idx = (row * width + x) * 4;
        const srcIdx = (row * width + ((x + offset + width) % width)) * 4;
        data[idx] = data[srcIdx];
        data[idx + 1] = data[srcIdx + 1];
        data[idx + 2] = data[srcIdx + 2];
      }
    }
  }

  ctx.putImageData(frameData, 0, 0);
}

export function drawInterference(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const frameData = ctx.getImageData(0, 0, width, height);
  const data = frameData.data;

  for (let y = 0; y < height; y += 2 + Math.floor(Math.random() * 4)) {
    const intensity = Math.random() > 0.5 ? 255 : 0;
    const alpha = Math.random() * 0.3;

    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      data[idx] = Math.floor(data[idx] * (1 - alpha) + intensity * alpha);
      data[idx + 1] = Math.floor(data[idx + 1] * (1 - alpha) + intensity * alpha);
      data[idx + 2] = Math.floor(data[idx + 2] * (1 - alpha) + intensity * alpha);
    }
  }

  ctx.putImageData(frameData, 0, 0);
}
