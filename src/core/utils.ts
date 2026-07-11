export function hexToRgb(h: string): { r: number; g: number; b: number } {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);
  return r
    ? {
        r: parseInt(r[1], 16),
        g: parseInt(r[2], 16),
        b: parseInt(r[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function hexToRgbFast(h: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  };
}

export function interpolateCatmullRom(
  centers: { x: number; y: number }[],
  resolution: number
): { x: number; y: number }[] {
  if (centers.length < 4) return centers;

  const result: { x: number; y: number }[] = [];
  const basisMatrix = [
    [0, 2, 0, 0],
    [-1, 0, 1, 0],
    [2, -5, 4, -1],
    [-1, 3, -3, 1],
  ];

  for (let i = 1; i < centers.length - 2; i++) {
    const p = [
      centers[i - 1],
      centers[i],
      centers[i + 1],
      centers[i + 2],
    ];

    for (let j = 0; j < resolution; j++) {
      const t = j / resolution;
      const t2 = t * t;
      const t3 = t2 * t;
      const T = [1, t, t2, t3];

      let x = 0;
      let y = 0;

      for (let k = 0; k < 4; k++) {
        let mx = 0;
        let my = 0;
        for (let m = 0; m < 4; m++) {
          mx += basisMatrix[k][m] * p[m].x;
          my += basisMatrix[k][m] * p[m].y;
        }
        x += 0.5 * T[k] * mx;
        y += 0.5 * T[k] * my;
      }

      result.push({ x: Math.round(x), y: Math.round(y) });
    }
  }

  return result;
}

export function getSpeedColor(speed: number, maxSpeed: number): string {
  const ratio = Math.min(speed / maxSpeed, 1);
  const r = Math.floor(ratio * 255);
  const b = Math.floor((1 - ratio) * 255);
  return `rgb(${r},0,${b})`;
}
