export type ShapeStyle = 'bracket' | 'rect' | 'concentric' | 'crosshair' | 'inner' | 'ring' | 'diamond' | 'pulse' | 'retroframe' | 'sniperReticle' | 'hexScanner' | 'radarSweep' | 'segmentedRing' | 'tickDiamond' | 'triOrbit' | 'cornerNotch' | 'dataNodeBadge' | 'cutCornerPanel' | 'radarPing' | 'chevronLock' | 'asymmetricBracket' | 'none';

export type TrailEffect = 'ribbon' | 'particleTrail' | 'lightRibbon' | 'echo' | 'liquidLine' | 'sparkTrail' | 'waveRibbon' | 'glowStreak';

export interface Preset {
  name: string;
  label: string;
  shapeStyle: ShapeStyle;
  trailEffect: TrailEffect;
  trailColor: string;
  trailGlow: number;
  trailLength: number;
}

export interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface Blob {
  x: number;
  y: number;
  area: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  vx?: number;
  vy?: number;
  id?: number;
  history?: TrailPoint[];
}

export interface Config {
  threshold: number;
  minArea: number;
  maxArea: number;
  maxBlobs: number;
  resolutionScale: number;
  enableSkip: boolean;
  outlineColor: string;
  trailColor: string;
  thickness: number;
  preset: string;
  shapeStyle: ShapeStyle;
  glowIntensity: number;
  drawTrails: boolean;
  trailEffect: TrailEffect;
  trailGlow: number;
  trailLength: number;
  showGrid: boolean;
  showCornerMarks: boolean;
  showTimestamp: boolean;
  showCounter: boolean;
  showTraceLine: boolean;
  showVelocityText: boolean;
  showBoundingBox: boolean;
  motionSmoothing: number;
  lineSmoothing: number;
  drawMirror: boolean;
  drawKaleidoscope: boolean;
  drawTileMirror: boolean;
  drawFractal: boolean;
  drawTunnel: boolean;
  drawRippleMirror: boolean;
  mirrorSegments: number;
  drawRGBSplit: boolean;
  drawChromatic: boolean;
  drawBlockGlitch: boolean;
  drawVHS: boolean;
  drawTear: boolean;
  drawShift: boolean;
  drawWave: boolean;
  glitchOffset: number;
  drawInvert: boolean;
  drawSolarize: boolean;
  drawScanlines: boolean;
  drawCRT: boolean;
  drawGlitch: boolean;
  drawInterference: boolean;
  drawEdge: boolean;
  drawThermal: boolean;
  drawFeedback: boolean;
  drawDuotone: boolean;
  drawBloom: boolean;
  drawFilmGrain: boolean;
  drawColorShift: boolean;
  drawPosterize: boolean;
  drawPixelate: boolean;
  drawQuantize: boolean;
  drawThreshold: boolean;
  drawBlur: boolean;
  drawZoomBlur: boolean;
  drawSharpen: boolean;
  drawVignette: boolean;
  drawNoise: boolean;
  colorLevels: number;
  drawDateStamp: boolean;
  drawLetterbox: boolean;
  letterboxHeight: number;
  drawTrackingLines: boolean;
  drawColorBleed: boolean;
  colorBleedIntensity: number;
  drawStatic: boolean;
  staticIntensity: number;
  drawJitter: boolean;
  jitterAmount: number;
  drawColorBars: boolean;
  drawCold: boolean;
  drawWarm: boolean;
  drawNoir: boolean;
  drawSepia: boolean;
  drawNeon: boolean;
  neonColor: string;
  drawLaser: boolean;
  laserColor: string;
  laserMidColor: string;
  laserCornerColor: string;
  laserWidth: number;
  laserThreshold: number;
  drawHologram: boolean;
  drawMotionTrail: boolean;
  motionTrailLength: number;
  drawStrobe: boolean;
  strobeSpeed: number;
  drawMatrix: boolean;
  drawLensFlare: boolean;
  drawTwist: boolean;
  twistAngle: number;
  drawFilmBurn: boolean;
  drawDropShadow: boolean;
  drawSparkle: boolean;
  drawReflection: boolean;
  drawFloorReflection: boolean;
  drawGlass: boolean;
  feedbackDecay: number;
  trailColorEnd: string;
  trailThickness: number;
  exportWidth: number;
  exportHeight: number;
  exportFps: number;
  exportBitrate: 'low' | 'medium' | 'high';
}

export interface AppState {
  isTracking: boolean;
  videoMode: boolean;
  isRecording: boolean;
  fps: number;
  frameCount: number;
}
