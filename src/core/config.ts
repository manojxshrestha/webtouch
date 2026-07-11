import type { Config, Preset, ShapeStyle, TrailEffect } from '../types';

export const defaultConfig: Config = {
  threshold: 127,
  minArea: 10,
  maxArea: 500,
  maxBlobs: 50,
  resolutionScale: 1.0,
  enableSkip: true,
  outlineColor: '#ffffff',
  trailColor: '#ffffff',
  thickness: 2,
  preset: 'ribbon',
  shapeStyle: 'sniperReticle',
  glowIntensity: 0,
  drawTrails: true,
  trailEffect: 'ribbon',
  trailGlow: 0,
  trailLength: 10,
  showGrid: false,
  showCornerMarks: false,
  showTimestamp: false,
  showCounter: false,
  showTraceLine: false,
  showVelocityText: false,
  showBoundingBox: false,
  motionSmoothing: 0.5,
  lineSmoothing: 8,
  drawMirror: false,
  drawKaleidoscope: false,
  drawTileMirror: false,
  drawFractal: false,
  drawTunnel: false,
  drawRippleMirror: false,
  mirrorSegments: 6,
  drawRGBSplit: false,
  drawChromatic: false,
  drawBlockGlitch: false,
  drawVHS: false,
  drawTear: false,
  drawShift: false,
  drawWave: false,
  glitchOffset: 5,
  drawInvert: false,
  drawSolarize: false,
  drawScanlines: false,
  drawCRT: false,
  drawGlitch: false,
  drawInterference: false,
  drawEdge: false,
  drawThermal: false,
  drawFeedback: false,
  drawDuotone: false,
  drawBloom: false,
  drawFilmGrain: false,
  drawColorShift: false,
  drawPosterize: false,
  drawPixelate: false,
  drawQuantize: false,
  drawThreshold: false,
  drawBlur: false,
  drawZoomBlur: false,
  drawSharpen: false,
  drawVignette: false,
  drawNoise: false,
  colorLevels: 6,
  drawDateStamp: false,
  drawLetterbox: false,
  letterboxHeight: 50,
  drawTrackingLines: false,
  drawColorBleed: false,
  colorBleedIntensity: 3,
  drawStatic: false,
  staticIntensity: 10,
  drawJitter: false,
  jitterAmount: 5,
  drawColorBars: false,
  drawCold: false,
  drawWarm: false,
  drawNoir: false,
  drawSepia: false,
  drawNeon: false,
  neonColor: '#00ffff',
  drawLaser: false,
  laserColor: '#ff0044',
  laserMidColor: '#00ff00',
  laserCornerColor: '#00ff00',
  laserWidth: 2,
  laserThreshold: 200,
  drawHologram: false,
  drawMotionTrail: false,
  motionTrailLength: 10,
  drawStrobe: false,
  strobeSpeed: 5,
  drawMatrix: false,
  drawLensFlare: false,
  drawTwist: false,
  twistAngle: 30,
  drawFilmBurn: false,
  drawDropShadow: false,
  drawSparkle: false,
  drawReflection: false,
  drawFloorReflection: false,
  drawGlass: false,
  feedbackDecay: 0.05,
  trailColorEnd: '#000000',
  trailThickness: 2,
  exportWidth: 1920,
  exportHeight: 1080,
  exportFps: 30,
  exportBitrate: 'high',
};

const CONFIG_STORAGE_KEY = 'webtouch:config';
const CONFIG_SCHEMA_VERSION = 1;

interface StoredConfig {
  schemaVersion: number;
  config: Partial<Config>;
}

let config = { ...defaultConfig };
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function migrateConfig(stored: StoredConfig): StoredConfig {
  while (stored.schemaVersion < CONFIG_SCHEMA_VERSION) {
    if (stored.schemaVersion === 0) {
      stored.config.drawVignette ??= false;
      stored.config.drawNoise ??= false;
      stored.config.showCornerMarks ??= false;
      stored.config.showTimestamp ??= false;
      stored.config.showCounter ??= false;
      stored.config.showTraceLine ??= false;
    }
    stored.schemaVersion++;
  }
  return stored;
}

function scheduleSave(): void {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const payload: StoredConfig = {
        schemaVersion: CONFIG_SCHEMA_VERSION,
        config,
      };
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // storage full or unavailable
    }
  }, 300);
}

export function loadConfigFromStorage(): void {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) return;
    const parsed: StoredConfig = JSON.parse(raw);
    const migrated = migrateConfig(parsed);
    config = { ...defaultConfig, ...migrated.config };
  } catch {
    // corrupt storage, use defaults
  }
}

export function getConfig(): Config {
  return config;
}

export function setConfig(newConfig: Partial<Config>): void {
  config = { ...config, ...newConfig };
  scheduleSave();
}

export function resetConfig(): void {
  config = { ...defaultConfig };
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  } catch {
    // unavailable
  }
}

export function exportConfigAsJson(): string {
  const payload: StoredConfig = {
    schemaVersion: CONFIG_SCHEMA_VERSION,
    config,
  };
  return JSON.stringify(payload, null, 2);
}

export function importConfigFromJson(json: string): void {
  try {
    const parsed: StoredConfig = JSON.parse(json);
    const migrated = migrateConfig(parsed);
    config = { ...defaultConfig, ...migrated.config };
    scheduleSave();
  } catch {
    throw new Error('Invalid config file');
  }
}

const _s = (shape: ShapeStyle, trail: TrailEffect, color: string, glow: number, length: number) =>
  ({ shapeStyle: shape, trailEffect: trail, trailColor: color, trailGlow: glow, trailLength: length });

export const PRESETS: Preset[] = [
  { name: 'ribbon',          label: 'Ribbon',        ..._s('sniperReticle',   'ribbon',        '#ffffff', 0,  10) },
  { name: 'particleTrail',   label: 'Particle Trail',..._s('dataNodeBadge',    'particleTrail', '#ff8800', 8,  15) },
  { name: 'lightRibbon',     label: 'Light Ribbon',  ..._s('pulse',            'lightRibbon',   '#00ffff', 12, 12) },
  { name: 'echo',            label: 'Echo',          ..._s('ring',             'echo',          '#44ff88', 4,  25) },
  { name: 'liquidLine',      label: 'Liquid Line',   ..._s('bracket',          'liquidLine',    '#ffffff', 0,  8)  },
  { name: 'sparkTrail',      label: 'Spark Trail',   ..._s('crosshair',        'sparkTrail',    '#ffff00', 10, 14) },
  { name: 'waveRibbon',      label: 'Wave Ribbon',   ..._s('radarSweep',       'waveRibbon',    '#ff44ff', 3,  18) },
  { name: 'glowStreak',      label: 'Glow Streak',   ..._s('segmentedRing',    'glowStreak',    '#ff0000', 14, 10) },
  { name: 'wireframeMesh',   label: 'Wireframe Mesh',..._s('hexScanner',        'ribbon',        '#00ff88', 2,  6)  },
  { name: 'ghostTrail',      label: 'Ghost Trail',   ..._s('concentric',       'echo',          '#8888ff', 8,  35) },
  { name: 'inkBleed',        label: 'Ink Bleed',     ..._s('rect',             'liquidLine',    '#ff4488', 0,  6)  },
  { name: 'signalDecay',     label: 'Signal Decay',  ..._s('inner',            'glowStreak',    '#88ff44', 6,  22) },
];

export function applyPreset(name: string): Partial<Config> {
  const p = PRESETS.find(p => p.name === name);
  if (!p) return {};
  return {
    preset: p.name,
    shapeStyle: p.shapeStyle,
    trailEffect: p.trailEffect,
    trailColor: p.trailColor,
    trailGlow: p.trailGlow,
    trailLength: p.trailLength,
  };
}
