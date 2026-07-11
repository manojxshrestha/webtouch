import type { TrailPoint } from '../types';

export function drawDottedLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  _thickness: number
): void {
  const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  if (d === 0) return;

  const dx = (x2 - x1) / d;
  const dy = (y2 - y1) / d;
  const gap = 8;
  const dl = gap / 2;
  let cd = 0;

  while (cd < d) {
    const sx = x1 + dx * cd;
    const sy = y1 + dy * cd;
    const ed = Math.min(cd + dl, d);
    const ex = x1 + dx * ed;
    const ey = y1 + dy * ed;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    cd += gap;
  }
}

export function drawBrackets(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  thickness: number
): void {
  const bl = Math.min(w, h) * 0.3;
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;

  ctx.beginPath();
  ctx.moveTo(x, y + bl);
  ctx.lineTo(x, y);
  ctx.lineTo(x + bl, y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + w - bl, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + bl);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x, y + h - bl);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + w - bl, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w, y + h - bl);
  ctx.stroke();
}

type TrailEffect = (
  ctx: CanvasRenderingContext2D,
  history: TrailPoint[],
  config: { trailGlow: number; thickness: number; trailLength: number },
  rgb: { r: number; g: number; b: number },
  time: number
) => void;

function drawRibbon(ctx: CanvasRenderingContext2D, history: TrailPoint[], config: { trailGlow: number; thickness: number; trailLength: number }, rgb: { r: number; g: number; b: number }) {
  const n = history.length;
  if (n < 2) return;
  const baseWidth = config.thickness * 2;
  for (let i = 1; i < n; i++) {
    const p0 = history[i - 1], p1 = history[i];
    const dx = p1.x - p0.x, dy = p1.y - p0.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const t = i / n;
    const w = baseWidth * t;
    const alpha = t * 0.8;
    ctx.beginPath();
    ctx.moveTo(p0.x - nx * w * 0.5, p0.y - ny * w * 0.5);
    ctx.lineTo(p0.x + nx * w * 0.5, p0.y + ny * w * 0.5);
    ctx.lineTo(p1.x + nx * w * 0.5, p1.y + ny * w * 0.5);
    ctx.lineTo(p1.x - nx * w * 0.5, p1.y - ny * w * 0.5);
    ctx.closePath();
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
    ctx.fill();
  }
}

function drawParticleTrail(ctx: CanvasRenderingContext2D, history: TrailPoint[], config: { trailGlow: number; thickness: number; trailLength: number }, rgb: { r: number; g: number; b: number }) {
  const n = history.length;
  const maxR = config.thickness * 1.5;
  for (let i = 0; i < n; i++) {
    const p = history[i];
    const t = i / n;
    const scatter = (1 - t) * 3;
    const ox = (Math.random() - 0.5) * scatter;
    const oy = (Math.random() - 0.5) * scatter;
    ctx.beginPath();
    ctx.arc(p.x + ox, p.y + oy, maxR * t, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${t * 0.9})`;
    ctx.fill();
  }
}

function drawLightRibbon(ctx: CanvasRenderingContext2D, history: TrailPoint[], config: { trailGlow: number; thickness: number; trailLength: number }, rgb: { r: number; g: number; b: number }) {
  const n = history.length;
  if (n < 2) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.shadowBlur = config.trailGlow;
  ctx.shadowColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  const baseWidth = config.thickness * 1.5;
  for (let i = 1; i < n; i++) {
    const p0 = history[i - 1], p1 = history[i];
    const t = i / n;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineWidth = baseWidth * t;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${t * 0.6})`;
    ctx.stroke();
  }
  ctx.restore();
}

function drawEcho(ctx: CanvasRenderingContext2D, history: TrailPoint[], config: { trailGlow: number; thickness: number; trailLength: number }, rgb: { r: number; g: number; b: number }) {
  const n = history.length;
  const step = Math.max(1, Math.floor(n / 6));
  const radius = config.thickness * 3;
  for (let i = n - 1; i >= 0; i -= step) {
    const p = history[i];
    const t = i / n;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${t * 0.5})`;
    ctx.lineWidth = config.thickness;
    ctx.stroke();
  }
}

function drawLiquidLine(ctx: CanvasRenderingContext2D, history: TrailPoint[], config: { trailGlow: number; thickness: number; trailLength: number }, rgb: { r: number; g: number; b: number }) {
  const n = history.length;
  if (n < 2) return;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)`;
  for (let i = 1; i < n; i++) {
    const p0 = history[i - 1], p1 = history[i];
    const speed = Math.hypot(p1.vx, p1.vy);
    const w = Math.max(config.thickness, config.thickness * 4 - speed * 0.5);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineWidth = w;
    ctx.stroke();
  }
}

function drawSparkTrail(ctx: CanvasRenderingContext2D, history: TrailPoint[], config: { trailGlow: number; thickness: number; trailLength: number }, rgb: { r: number; g: number; b: number }) {
  const n = history.length;
  if (n < 2) return;
  ctx.beginPath();
  ctx.moveTo(history[0].x, history[0].y);
  for (let i = 1; i < n; i++) ctx.lineTo(history[i].x, history[i].y);
  ctx.lineWidth = config.thickness * 0.6;
  ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},0.4)`;
  ctx.stroke();
  for (let i = 0; i < n; i++) {
    if (Math.random() > 0.12) continue;
    const p = history[i];
    ctx.save();
    ctx.shadowBlur = config.trailGlow;
    ctx.shadowColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, config.thickness, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }
}

function drawWaveRibbon(ctx: CanvasRenderingContext2D, history: TrailPoint[], config: { trailGlow: number; thickness: number; trailLength: number }, rgb: { r: number; g: number; b: number }, time: number) {
  const n = history.length;
  if (n < 2) return;
  const amp = config.thickness * 2;
  const freq = 0.5;
  for (let i = 1; i < n; i++) {
    const p0 = history[i - 1], p1 = history[i];
    const dx = p1.x - p0.x, dy = p1.y - p0.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const wave0 = Math.sin(i * freq + time * 0.005) * amp;
    const wave1 = Math.sin((i + 1) * freq + time * 0.005) * amp;
    ctx.beginPath();
    ctx.moveTo(p0.x + nx * wave0, p0.y + ny * wave0);
    ctx.lineTo(p1.x + nx * wave1, p1.y + ny * wave1);
    ctx.lineWidth = config.thickness;
    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${(i / n) * 0.8})`;
    ctx.stroke();
  }
}

function drawGlowStreak(ctx: CanvasRenderingContext2D, history: TrailPoint[], config: { trailGlow: number; thickness: number; trailLength: number }, rgb: { r: number; g: number; b: number }) {
  const n = history.length;
  if (n < 2) return;
  ctx.save();
  ctx.shadowBlur = config.trailGlow;
  ctx.shadowColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  ctx.lineCap = 'round';
  ctx.lineWidth = config.thickness * 2;
  for (let i = 1; i < n; i++) {
    const p0 = history[i - 1], p1 = history[i];
    const t = i / n;
    const alpha = t * t * t;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
    ctx.stroke();
  }
  ctx.restore();
}

const TRAIL_EFFECTS: Record<string, TrailEffect> = {
  ribbon: drawRibbon,
  particleTrail: drawParticleTrail,
  lightRibbon: drawLightRibbon,
  echo: drawEcho,
  liquidLine: drawLiquidLine,
  sparkTrail: drawSparkTrail,
  waveRibbon: drawWaveRibbon,
  glowStreak: drawGlowStreak,
};

export function renderTrails(
  ctx: CanvasRenderingContext2D,
  blobs: { id?: number; history?: TrailPoint[] }[],
  config: { trailEffect: string; trailGlow: number; thickness: number; trailLength: number },
  rgb: { r: number; g: number; b: number },
  time: number
): void {
  const effect = TRAIL_EFFECTS[config.trailEffect];
  if (!effect) return;
  for (const blob of blobs) {
    const h = blob.history;
    if (!h || h.length < 2) continue;
    effect(ctx, h, config, rgb, time);
  }
}

export function drawSniperReticle(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number
) {
  const gap = r * 0.35, tick = r * 0.25;
  ctx.lineWidth = thickness; ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy - r + tick);
  ctx.moveTo(cx, cy + r); ctx.lineTo(cx, cy + r - tick);
  ctx.moveTo(cx - r, cy); ctx.lineTo(cx - r + tick, cy);
  ctx.moveTo(cx + r, cy); ctx.lineTo(cx + r - tick, cy);
  ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
  ctx.globalAlpha = 0.5;
  ctx.beginPath(); ctx.arc(cx, cy, gap, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1;
}

export function drawHexScanner(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number
) {
  ctx.lineWidth = thickness; ctx.strokeStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

export function drawRadarSweep(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number, time: number
) {
  ctx.lineWidth = thickness; ctx.strokeStyle = color; ctx.globalAlpha = 0.4;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1;
  const angle = (time * 0.003) % (Math.PI * 2);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
  ctx.stroke();
}

export function drawSegmentedRing(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number, time: number
) {
  ctx.lineWidth = thickness * 1.5; ctx.strokeStyle = color;
  ctx.setLineDash([r * 0.5, r * 0.25]);
  ctx.lineDashOffset = -time * 0.02;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.setLineDash([]);
}

export function drawTickDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number
) {
  ctx.lineWidth = thickness; ctx.strokeStyle = color;
  const pts = [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]];
  ctx.beginPath();
  pts.forEach(([x, y], i) => i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y));
  ctx.closePath(); ctx.stroke();
  const tick = r * 0.15;
  for (let i = 0; i < 4; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % 4];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const nx = -(y2 - y1) / r, ny = (x2 - x1) / r;
    ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(mx + nx * tick, my + ny * tick); ctx.stroke();
  }
}

export function drawTriOrbit(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number, time: number
) {
  ctx.lineWidth = thickness * 1.2; ctx.strokeStyle = color;
  const rot = time * 0.001;
  for (let i = 0; i < 3; i++) {
    const start = rot + (Math.PI * 2 / 3) * i;
    ctx.beginPath();
    ctx.arc(cx, cy, r, start, start + 1.2);
    ctx.stroke();
  }
}

export function drawCornerNotch(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number
) {
  ctx.lineWidth = thickness; ctx.strokeStyle = color;
  const s = r * 0.85, n = r * 0.3;
  const corners = [[-s, -s], [s, -s], [s, s], [-s, s]];
  corners.forEach(([dx, dy]) => {
    const x = cx + dx, y = cy + dy;
    ctx.beginPath();
    ctx.moveTo(x - Math.sign(dx) * n, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y - Math.sign(dy) * n);
    ctx.stroke();
  });
}

export function drawDataNodeBadge(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number
) {
  ctx.lineWidth = thickness; ctx.strokeStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    if (i % 2 === 0) { ctx.moveTo(x, y); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.moveTo(x, y); }
  }
  ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2); ctx.stroke();
}

export function drawCutCornerPanel(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number
) {
  ctx.lineWidth = thickness; ctx.strokeStyle = color;
  const s = r * 0.9, c = s * 0.4;
  ctx.beginPath();
  ctx.moveTo(cx - s + c, cy - s); ctx.lineTo(cx + s - c, cy - s); ctx.lineTo(cx + s, cy - s + c);
  ctx.lineTo(cx + s, cy + s - c); ctx.lineTo(cx + s - c, cy + s); ctx.lineTo(cx - s + c, cy + s);
  ctx.lineTo(cx - s, cy + s - c); ctx.lineTo(cx - s, cy - s + c);
  ctx.closePath(); ctx.stroke();
}

export function drawRadarPing(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number, time: number
) {
  const cycle = 1200;
  const t = (time % cycle) / cycle;
  ctx.lineWidth = thickness; ctx.strokeStyle = color;
  ctx.globalAlpha = 1 - t;
  ctx.beginPath(); ctx.arc(cx, cy, r * (0.4 + t * 0.6), 0, Math.PI * 2); ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.35, 0, Math.PI * 2); ctx.stroke();
}

export function drawChevronLock(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number
) {
  ctx.lineWidth = thickness; ctx.strokeStyle = color;
  const outer = r, inner = r * 0.6, w = r * 0.25;
  const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  dirs.forEach(([dx, dy]) => {
    const px = -dy, py = dx;
    ctx.beginPath();
    ctx.moveTo(cx + dx * outer + px * w, cy + dy * outer + py * w);
    ctx.lineTo(cx + dx * inner, cy + dy * inner);
    ctx.lineTo(cx + dx * outer - px * w, cy + dy * outer - py * w);
    ctx.stroke();
  });
}

export function drawAsymmetricBracket(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, r: number,
  color: string, thickness: number
) {
  ctx.lineWidth = thickness; ctx.strokeStyle = color;
  const s = r * 0.9, long = r * 0.6, short = r * 0.3;
  const corners: [number, number, number, number][] = [
    [-1, -1, long, short], [1, -1, short, long], [1, 1, long, short], [-1, 1, short, long],
  ];
  corners.forEach(([sx, sy, lx, ly]) => {
    const x = cx + sx * s, y = cy + sy * s;
    ctx.beginPath();
    ctx.moveTo(x, y + sy * -ly);
    ctx.lineTo(x, y);
    ctx.lineTo(x + sx * -lx, y);
    ctx.stroke();
  });
}
