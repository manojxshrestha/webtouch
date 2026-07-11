import type { Blob } from '../types';
import { getConfig } from '../core/config';
import { hexToRgb } from '../core/utils';
import {
  drawBrackets,
  renderTrails,
  drawSniperReticle,
  drawHexScanner,
  drawRadarSweep,
  drawSegmentedRing,
  drawTickDiamond,
  drawTriOrbit,
  drawCornerNotch,
  drawDataNodeBadge,
  drawCutCornerPanel,
  drawRadarPing,
  drawChevronLock,
  drawAsymmetricBracket,
} from './shapes';
import { drawScanlines, drawGlitch, drawInterference } from './effects';

const tracePaths = new Map<number, { x: number; y: number }[]>();

export function applyVideoEffects(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  feedbackCanvas?: HTMLCanvasElement,
  feedbackCtx?: CanvasRenderingContext2D
): void {
  const config = getConfig();
  const { width, height } = canvas;

  // --- PASS 1: TRANSFORM (geometry warps) ---

  if (config.drawWave) {
    const time = Date.now() * 0.003;
    const amplitude = config.glitchOffset * 2;
    const frequency = 0.015;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
      const offset = Math.sin(y * frequency + time) * amplitude;
      for (let x = 0; x < width; x++) {
        const srcX = Math.min(Math.max(Math.floor(x + offset), 0), width - 1);
        const srcI = (y * width + srcX) * 4;
        const dstI = (y * width + x) * 4;
        data[dstI] = tempData[srcI];
        data[dstI + 1] = tempData[srcI + 1];
        data[dstI + 2] = tempData[srcI + 2];
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawRippleMirror) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
    const time = Date.now() * 0.002;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - width / 2;
        const dy = y - height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const offset = Math.sin(dist * 0.05 - time) * 10;
        
        const srcX = Math.min(Math.max(Math.floor(x + offset), 0), width - 1);
        const srcI = (y * width + srcX) * 4;
        const dstI = (y * width + x) * 4;
        
        data[dstI] = tempData[srcI];
        data[dstI + 1] = tempData[srcI + 1];
        data[dstI + 2] = tempData[srcI + 2];
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawTunnel) {
    const segments = config.mirrorSegments;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(canvas, 0, 0);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    
    for (let i = 0; i < segments; i++) {
      const scale = 1 - (i / segments) * 0.8;
      const alpha = 1 - (i / segments) * 0.9;
      ctx.globalAlpha = alpha;
      ctx.save();
      ctx.scale(scale, scale);
      ctx.drawImage(tempCanvas, -width / 2, -height / 2);
      ctx.restore();
    }
    ctx.restore();
  }

  if (config.drawFractal) {
    const segments = config.mirrorSegments;
    const angle = (Math.PI * 2) / segments;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(canvas, 0, 0);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    for (let i = 0; i < segments; i++) {
      ctx.save();
      ctx.rotate(angle * i);
      ctx.scale(0.5, 0.5);
      ctx.drawImage(tempCanvas, -width / 2, -height / 2);
      ctx.scale(-1, 1);
      ctx.drawImage(tempCanvas, -width / 2, -height / 2);
      ctx.restore();
    }
    ctx.restore();
  }

  if (config.drawTwist) {
    const angle = (config.twistAngle || 30) * Math.PI / 180;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
    const cx = width / 2;
    const cy = height / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const newAngle = Math.atan2(dy, dx) + angle * (dist / 200);
        const srcX = Math.floor(cx + dist * Math.cos(newAngle));
        const srcY = Math.floor(cy + dist * Math.sin(newAngle));
        
        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
          const dstI = (y * width + x) * 4;
          const srcI = (srcY * width + srcX) * 4;
          data[dstI] = tempData[srcI];
          data[dstI + 1] = tempData[srcI + 1];
          data[dstI + 2] = tempData[srcI + 2];
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // --- PASS 2: DISTORT (pixel displacement) ---

  if (config.drawEdge) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data.length);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        const iL = (y * width + x - 1) * 4;
        const iR = (y * width + x + 1) * 4;
        const iT = ((y - 1) * width + x) * 4;
        const iB = ((y + 1) * width + x) * 4;

        const gx = Math.abs(data[iR] - data[iL]);
        const gy = Math.abs(data[iB] - data[iT]);
        const edge = Math.min(255, gx + gy);

        output[i] = output[i + 1] = output[i + 2] = edge;
        output[i + 3] = 255;
      }
    }
    for (let i = 0; i < data.length; i++) {
      data[i] = output[i];
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawChromatic) {
    const offset = config.glitchOffset * 2;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const iR = (y * width + Math.min(x + offset, width - 1)) * 4;
        const iG = (y * width + x) * 4;
        const iB = (y * width + Math.max(x - offset, 0)) * 4;

        data[iR] = tempData[i];
        data[iG + 1] = tempData[iG + 1];
        data[iB + 2] = tempData[iB + 2];
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawVHS) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      if (Math.random() < 0.1) {
        const offset = Math.floor(Math.random() * 20 - 10);
        for (let x = 0; x < width; x++) {
          const srcX = Math.max(0, Math.min(width - 1, x + offset));
          const srcI = (y * width + srcX) * 4;
          const dstI = (y * width + x) * 4;
          data[dstI] = data[srcI];
          data[dstI + 1] = data[srcI + 1];
          data[dstI + 2] = data[srcI + 2];
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
    
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let y = 0; y < height; y += 3) {
      ctx.fillRect(0, y, width, 1);
    }
  }

  if (config.drawTear) {
    const tearY = Math.floor(Math.random() * height);
    const tearHeight = 5 + Math.random() * 20;
    const imageData = ctx.getImageData(0, tearY, width, tearHeight);
    ctx.putImageData(imageData, 0, tearY + (Math.random() - 0.5) * 50);
  }

  if (config.drawShift) {
    const numSlices = 3 + Math.floor(Math.random() * 5);
    for (let i = 0; i < numSlices; i++) {
      const sy = Math.floor(Math.random() * height);
      const sh = 5 + Math.floor(Math.random() * 20);
      const offset = (Math.random() - 0.5) * config.glitchOffset * 3;
      const imageData = ctx.getImageData(0, sy, width, sh);
      ctx.putImageData(imageData, offset, sy);
    }
  }

  if (config.drawBlockGlitch) {
    const numBlocks = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numBlocks; i++) {
      const bw = 30 + Math.random() * 100;
      const bh = 5 + Math.random() * 40;
      const bx = Math.random() * (width - bw);
      const by = Math.random() * (height - bh);
      const offsetX = (Math.random() - 0.5) * config.glitchOffset * 4;
      try {
        const imageData = ctx.getImageData(bx, by, bw, bh);
        ctx.putImageData(imageData, Math.max(0, Math.min(width - bw, bx + offsetX)), by);
      } catch (e) {}
    }
  }

  if (config.drawRGBSplit) {
    const offset = config.glitchOffset;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const iR = (y * width + Math.min(x + offset, width - 1)) * 4;
        const iB = (y * width + Math.max(x - offset, 0)) * 4;

        data[iR] = tempData[i];
        data[iB + 2] = tempData[i + 2];
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawHologram) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
    
    for (let y = 0; y < height; y++) {
      const offset = Math.sin(y * 0.1) * 3;
      for (let x = 0; x < width; x++) {
        const srcX = Math.floor(x + offset);
        if (srcX >= 0 && srcX < width) {
          const srcI = (y * width + srcX) * 4;
          const dstI = (y * width + x) * 4;
          data[dstI + 2] = tempData[srcI + 2];
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
    
    for (let y = 0; y < height; y += 4) {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.fillRect(0, y, width, 1);
    }
  }

  // --- PASS 3: COLOR FX (per-pixel color manipulation) ---

  if (config.drawInvert) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawSolarize) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = data[i] > 127 ? 255 - data[i] : data[i];
      data[i + 1] = data[i + 1] > 127 ? 255 - data[i + 1] : data[i + 1];
      data[i + 2] = data[i + 2] > 127 ? 255 - data[i + 2] : data[i + 2];
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawDuotone) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const color1 = { r: 65, g: 105, b: 225 };
    const color2 = { r: 255, g: 20, b: 147 };

    for (let i = 0; i < data.length; i += 4) {
      const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
      const r = color1.r + (color2.r - color1.r) * gray;
      const g = color1.g + (color2.g - color1.g) * gray;
      const b = color1.b + (color2.b - color1.b) * gray;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawThermal) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
      const heat = Math.floor((gray / 255) * 255);

      if (heat < 64) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = Math.floor(255 * (heat / 64));
      } else if (heat < 128) {
        data[i] = 0;
        data[i + 1] = Math.floor(255 * ((heat - 64) / 64));
        data[i + 2] = 255 - Math.floor(255 * ((heat - 64) / 64));
      } else if (heat < 192) {
        data[i] = Math.floor(255 * ((heat - 128) / 64));
        data[i + 1] = 255;
        data[i + 2] = 0;
      } else {
        data[i] = 255;
        data[i + 1] = 255 - Math.floor(255 * ((heat - 192) / 63));
        data[i + 2] = 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawPosterize) {
    const levels = config.colorLevels;
    const step = 255 / levels;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] / step) * step;
      data[i + 1] = Math.floor(data[i + 1] / step) * step;
      data[i + 2] = Math.floor(data[i + 2] / step) * step;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawPixelate) {
    const blockSize = config.colorLevels;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        const i = (y * width + x) * 4;
        for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
          for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
            const pi = ((y + dy) * width + (x + dx)) * 4;
            data[pi] = data[i];
            data[pi + 1] = data[i + 1];
            data[pi + 2] = data[i + 2];
          }
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawQuantize) {
    const levels = config.colorLevels;
    const step = 255 / levels;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.floor(data[i] / step) * step;
      data[i + 1] = Math.floor(data[i + 1] / step) * step;
      data[i + 2] = Math.floor(data[i + 2] / step) * step;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawThreshold) {
    const threshold = 128;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      const val = gray > threshold ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = val;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawColorShift) {
    const hueShift = 30;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i] / 255;
      let g = data[i + 1] / 255;
      let b = data[i + 2] / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
        }
      }

      h = (h + hueShift / 360) % 1;

      let r1: number, g1: number, b1: number;
      if (s === 0) {
        r1 = g1 = b1 = l;
      } else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r1 = hue2rgb(p, q, h + 1 / 3);
        g1 = hue2rgb(p, q, h);
        b1 = hue2rgb(p, q, h - 1 / 3);
      }

      data[i] = r1 * 255;
      data[i + 1] = g1 * 255;
      data[i + 2] = b1 * 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawColorBleed) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const i = (y * width + x) * 4;
        const iL = (y * width + x - 1) * 4;
        const iR = (y * width + x + 1) * 4;
        
        for (let c = 0; c < 3; c++) {
          data[i + c] = (tempData[i + c] * 2 + tempData[iL + c] + tempData[iR + c]) / 4;
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawBlur) {
    const radius = config.colorLevels;
    ctx.save();
    ctx.filter = `blur(${radius}px)`;
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();
  }

  if (config.drawZoomBlur) {
    const centerX = width / 2;
    const centerY = height / 2;
    const intensity = config.colorLevels;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const offset = Math.min(intensity, dist * 0.1);
        
        const srcX = Math.floor(centerX + dx * (1 - offset / dist));
        const srcY = Math.floor(centerY + dy * (1 - offset / dist));
        
        if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
          const dstI = (y * width + x) * 4;
          const srcI = (srcY * width + srcX) * 4;
          data[dstI] = tempData[srcI];
          data[dstI + 1] = tempData[srcI + 1];
          data[dstI + 2] = tempData[srcI + 2];
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawSharpen) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);
    const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const ki = (ky + 1) * 3 + (kx + 1);
              const i = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += data[i] * kernel[ki];
            }
          }
          const dstI = (y * width + x) * 4 + c;
          output[dstI] = Math.max(0, Math.min(255, sum));
        }
      }
    }
    for (let i = 0; i < data.length; i++) {
      data[i] = output[i];
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawBloom) {
    const intensity = config.glowIntensity || 5;
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = Math.floor(width / 4);
    tempCanvas.height = Math.floor(height / 4);
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.filter = `blur(${intensity}px)`;
    tempCtx.drawImage(tempCanvas, 0, 0);
    tempCtx.filter = 'none';
    
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.6;
    ctx.drawImage(tempCanvas, 0, 0, width, height);
    ctx.restore();
  }

  if (config.drawFilmGrain) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const intensity = config.colorLevels * 2;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);
    
    ctx.fillStyle = 'rgba(255, 248, 220, 0.05)';
    ctx.fillRect(0, 0, width, height);
  }

  // --- PASS 4: COLOR GRADE (final look) ---

  if (config.drawCold) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, data[i] - 30);
      data[i + 1] = Math.max(0, data[i + 1] - 10);
      data[i + 2] = Math.min(255, data[i + 2] + 40);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawWarm) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] + 40);
      data[i + 1] = Math.max(0, data[i + 1] - 10);
      data[i + 2] = Math.max(0, data[i + 2] - 30);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawNoir) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      const val = gray > 100 ? 255 : gray * 0.5;
      data[i] = data[i + 1] = data[i + 2] = val;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawSepia) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // --- PASS 5: COMPOSITE (multi-layer compositing) ---

  if (config.drawFeedback && feedbackCanvas && feedbackCtx) {
    if (feedbackCanvas.width !== width || feedbackCanvas.height !== height) {
      feedbackCanvas.width = width;
      feedbackCanvas.height = height;
    }
    feedbackCtx.globalCompositeOperation = 'destination-out';
    feedbackCtx.fillStyle = `rgba(0,0,0,${config.feedbackDecay})`;
    feedbackCtx.fillRect(0, 0, feedbackCanvas.width, feedbackCanvas.height);
    feedbackCtx.globalCompositeOperation = 'source-over';
    feedbackCtx.globalAlpha = 0.7;
    feedbackCtx.drawImage(canvas, 0, 0);
    ctx.drawImage(feedbackCanvas, 0, 0);
  }

  if (config.drawMirror) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(canvas, -width, 0);
    ctx.restore();
    ctx.drawImage(canvas, 0, 0);
  }

  if (config.drawKaleidoscope) {
    const segments = config.mirrorSegments;
    const angle = (Math.PI * 2) / segments;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    for (let i = 0; i < segments; i++) {
      ctx.save();
      ctx.rotate(angle * i);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.clip();
      ctx.scale(1, 1);
      ctx.translate(i % 2 === 0 ? 0 : -width / 2, 0);
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }

  if (config.drawTileMirror) {
    const segments = config.mirrorSegments;
    const tileW = width / segments;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d')!;
    tempCtx.drawImage(canvas, 0, 0);

    ctx.save();
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < segments; col++) {
        ctx.save();
        ctx.translate(col * tileW, row * height / 2);
        if ((col + row) % 2 === 1) {
          ctx.scale(-1, 1);
        }
        ctx.drawImage(tempCanvas, -col * tileW, -row * height / 2);
        ctx.restore();
      }
    }
    ctx.restore();
  }

  if (config.drawLensFlare) {
    const time = Date.now() * 0.001;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    for (let y = 0; y < height; y += 150) {
      const offset = Math.sin(time + y * 0.01) * 20;
      const gradient = ctx.createLinearGradient(0, y + offset, width, y + offset);
      gradient.addColorStop(0, 'rgba(255, 200, 100, 0)');
      gradient.addColorStop(0.3, 'rgba(255, 200, 100, 0.1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
      gradient.addColorStop(0.7, 'rgba(255, 200, 100, 0.1)');
      gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, y + offset - 10, width, 20);
    }
    ctx.restore();
  }

  if (config.drawFilmBurn) {
    const time = Date.now() * 0.001;
    const edgeY = height * 0.7 + Math.sin(time * 2) * 50;
    
    const gradient = ctx.createLinearGradient(0, edgeY, 0, height);
    gradient.addColorStop(0, 'rgba(255, 100, 0, 0)');
    gradient.addColorStop(0.3, 'rgba(255, 100, 0, 0.3)');
    gradient.addColorStop(0.6, 'rgba(255, 50, 0, 0.6)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, edgeY, width, height - edgeY);
  }

  if (config.drawVignette) {
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.6, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.6)');
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  if (config.drawNoise) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const intensity = (config.staticIntensity || 10) * 2;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawStatic) {
    const intensity = config.staticIntensity || 10;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity * 5;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawJitter) {
    const amount = config.jitterAmount || 5;
    const offsetX = (Math.random() - 0.5) * amount;
    const offsetY = (Math.random() - 0.5) * amount;
    const imageData = ctx.getImageData(0, 0, width, height);
    ctx.putImageData(imageData, offsetX, offsetY);
  }

  // --- PASS 6: SCREEN FX (screen-space overlays) ---

  if (config.drawStrobe) {
    const speed = config.strobeSpeed || 5;
    if (Math.floor(Date.now() / (100 / speed)) % 2 === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(0, 0, width, height);
    }
  }

  if (config.drawMatrix) {
    const cols = Math.floor(width / 12);
    const drops: number[] = new Array(cols).fill(0);
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.font = '12px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      if (Math.random() < 0.02) {
        const char = String.fromCharCode(33 + Math.floor(Math.random() * 94));
        const green = Math.floor(Math.random() * 155) + 100;
        ctx.fillStyle = `rgb(0, ${green}, 0)`;
        ctx.fillText(char, i * 12, drops[i] * 12);
        
        if (drops[i] * 12 > height) drops[i] = 0;
        drops[i]++;
      }
    }
  }

  if (config.drawSparkle) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness > 200 && Math.random() < 0.01) {
        const x = (i / 4) % width;
        const y = Math.floor((i / 4) / width);
        
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + 5, y);
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x, y + 5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        ctx.restore();
      }
    }
  }

  if (config.drawCRT) {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, width, height);
    
    for (let y = 0; y < height; y += 2) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(0, y, width, 1);
    }
    
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height)
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(0.7, 'rgba(255,255,255,0)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  if (config.drawDateStamp) {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const now = new Date();
    const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2, '0')} ${now.getFullYear()}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    ctx.font = '16px monospace';
    ctx.fillStyle = '#ffff00';
    ctx.fillText(`${dateStr} ${timeStr}`, 20, height - 30);
    
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${dateStr} ${timeStr}`, 22, height - 28);
  }

  if (config.drawLetterbox) {
    const barHeight = config.letterboxHeight || 50;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, barHeight);
    ctx.fillRect(0, height - barHeight, width, barHeight);
  }

  if (config.drawTrackingLines) {
    for (let y = 0; y < height; y += 3) {
      if (Math.random() < 0.3) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillRect(0, y, width, 1);
      }
      if (Math.random() < 0.2) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0, y + 1, width, 1);
      }
    }
  }

  if (config.drawColorBars) {
    const bh = Math.min(config.letterboxHeight || 50, height / 4);
    const barWidth = width / 7;
    const colors = [
      [255, 255, 255],
      [255, 255, 0],
      [0, 255, 255],
      [0, 255, 0],
      [255, 0, 255],
      [0, 0, 255],
      [255, 0, 0]
    ];

    ctx.save();
    ctx.globalAlpha = 0.7;
    for (let i = 0; i < 7; i++) {
      ctx.fillStyle = `rgb(${colors[i][0]},${colors[i][1]},${colors[i][2]})`;
      ctx.fillRect(i * barWidth, height - bh, barWidth, bh);
    }
    ctx.restore();
  }
}

export function render(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  blobs: Blob[],
  _frameCount: number,
  _fps: number,
  feedbackCanvas?: HTMLCanvasElement,
  feedbackCtx?: CanvasRenderingContext2D
): void {
  const config = getConfig();
  const { width, height } = canvas;
  const orgb = hexToRgb(config.outlineColor);
  const trgb = hexToRgb(config.trailColor);
  const ocol = `rgb(${orgb.r},${orgb.g},${orgb.b})`;

  applyVideoEffects(ctx, canvas, feedbackCanvas, feedbackCtx);

  if (config.drawReflection) {
    const imageData = ctx.getImageData(0, 0, width, height);
    ctx.save();
    ctx.scale(1, -1);
    ctx.globalAlpha = 0.3;
    ctx.drawImage(canvas, 0, -height * 2);
    ctx.restore();
    ctx.putImageData(imageData, 0, 0);
    
    const gradient = ctx.createLinearGradient(0, height * 0.6, 0, height);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, height * 0.6, width, height * 0.4);
  }

  if (config.drawFloorReflection) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const tempData = new Uint8ClampedArray(data);
    
    const midY = height / 2;
    for (let y = 0; y < midY; y++) {
      for (let x = 0; x < width; x++) {
        const dstI = ((height - 1 - y) * width + x) * 4;
        const srcI = (y * width + x) * 4;
        const alpha = y / midY * 0.4;
        data[dstI] = tempData[srcI] * alpha;
        data[dstI + 1] = tempData[srcI + 1] * alpha;
        data[dstI + 2] = tempData[srcI + 2] * alpha;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }

  if (config.drawGlass) {
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height)
    );
    gradient.addColorStop(0, 'rgba(255,255,255,0)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    gradient.addColorStop(1, 'rgba(200,220,255,0.2)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    for (let y = 0; y < height; y += 2) {
      ctx.fillRect(0, y, width, 1);
    }
  }

  if (config.drawNeon && blobs.length > 0) {
    ctx.save();
    ctx.shadowColor = config.neonColor || '#00ffff';
    ctx.shadowBlur = 15;
    ctx.strokeStyle = config.neonColor || '#00ffff';
    ctx.lineWidth = config.thickness;
    
    blobs.forEach(blob => {
      const r = Math.min(blob.width, blob.height) / 2;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }

  if (config.drawLaser && blobs.length >= 2) {
    const laserColor = config.laserColor || '#ff0044';
    const laserMidColor = config.laserMidColor || '#00ff00';
    const laserCornerColor = config.laserCornerColor || '#00ff00';
    const threshold = config.laserThreshold || 200;
    const lw = config.laserWidth || 2;
    
    ctx.save();
    ctx.strokeStyle = laserColor;
    ctx.lineWidth = lw;
    ctx.shadowColor = laserColor;
    ctx.shadowBlur = 15;
    
    const connected: boolean[] = new Array(blobs.length).fill(false);
    
    for (let i = 0; i < blobs.length; i++) {
      let nearestDist = Infinity;
      let nearestJ = -1;
      
      for (let j = i + 1; j < blobs.length; j++) {
        const dist = Math.sqrt((blobs[j].x - blobs[i].x) ** 2 + (blobs[j].y - blobs[i].y) ** 2);
        if (dist < threshold && dist < nearestDist) {
          nearestDist = dist;
          nearestJ = j;
        }
      }
      
      if (nearestJ !== -1) {
        connected[i] = true;
        connected[nearestJ] = true;
        
        ctx.globalAlpha = 1 - (nearestDist / threshold);
        ctx.beginPath();
        ctx.moveTo(blobs[i].x, blobs[i].y);
        ctx.lineTo(blobs[nearestJ].x, blobs[nearestJ].y);
        ctx.stroke();
        
        const midX = (blobs[i].x + blobs[nearestJ].x) / 2;
        const midY = (blobs[i].y + blobs[nearestJ].y) / 2;
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = laserMidColor;
        ctx.shadowColor = laserMidColor;
        ctx.beginPath();
        ctx.arc(midX, midY, lw * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    for (let i = 0; i < blobs.length; i++) {
      if (connected[i]) {
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = laserCornerColor;
        ctx.shadowColor = laserCornerColor;
        ctx.beginPath();
        ctx.arc(blobs[i].x, blobs[i].y, lw * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  if (config.drawMotionTrail && blobs.length > 0) {
    const trailLength = config.motionTrailLength || 10;
    const trailColor = config.laserColor || '#ff0044';
    
    blobs.forEach(blob => {
      if (blob.vx !== undefined && blob.vy !== undefined) {
        ctx.save();
        ctx.strokeStyle = trailColor;
        ctx.lineWidth = 1;
        
        for (let t = 0; t < trailLength; t++) {
          const alpha = 1 - (t / trailLength);
          ctx.globalAlpha = alpha * 0.5;
          
          const prevX = blob.x - (blob.vx || 0) * t * 2;
          const prevY = blob.y - (blob.vy || 0) * t * 2;
          
          ctx.beginPath();
          ctx.arc(prevX, prevY, 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }
    });
  }

  if (config.drawDropShadow && blobs.length > 0) {
    const shadowOffset = 5;
    ctx.save();
    blobs.forEach(blob => {
      const r = Math.min(blob.width, blob.height) / 2;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(blob.x + shadowOffset, blob.y + shadowOffset, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  if (config.showTraceLine) {
    blobs.forEach((blob) => {
      if (blob.id === undefined) return;
      if (!tracePaths.has(blob.id)) tracePaths.set(blob.id, []);
      const path = tracePaths.get(blob.id)!;
      path.push({ x: blob.x, y: blob.y });
      if (path.length > 200) path.shift();
      if (path.length >= 2) {
        ctx.strokeStyle = `rgba(${orgb.r},${orgb.g},${orgb.b},0.3)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (let i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.stroke();
      }
    });
  }

  if (config.showGrid) {
    ctx.strokeStyle = `rgba(${orgb.r},${orgb.g},${orgb.b},0.3)`;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  const time = Date.now();

  if (config.drawTrails && blobs.length >= 2) {
    renderTrails(ctx, blobs, config, trgb, time);
  }
  blobs.forEach((blob) => {
    const { minX: x, minY: y, width: w, height: h, x: cx, y: cy } = blob;
    const r = Math.min(w, h) / 2;

    let blobColor = ocol;

    if (config.glowIntensity > 0) {
      ctx.shadowColor = blobColor;
      ctx.shadowBlur = config.glowIntensity;
    }

    switch (config.shapeStyle) {
      case 'concentric':
        drawConcentricRings(ctx, cx, cy, r, blobColor);
        break;
      case 'bracket':
        drawBrackets(ctx, x, y, w, h, blobColor, config.thickness);
        break;
      case 'rect':
        ctx.strokeStyle = blobColor;
        ctx.lineWidth = config.thickness;
        ctx.strokeRect(x, y, w, h);
        break;
      case 'crosshair':
        ctx.strokeStyle = blobColor;
        ctx.lineWidth = config.thickness;
        const size = r * 0.8;
        ctx.beginPath();
        ctx.moveTo(cx - size, cy);
        ctx.lineTo(cx + size, cy);
        ctx.moveTo(cx, cy - size);
        ctx.lineTo(cx, cy + size);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'inner':
        ctx.strokeStyle = blobColor;
        ctx.lineWidth = config.thickness;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'ring':
        ctx.strokeStyle = blobColor;
        ctx.lineWidth = config.thickness;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'diamond':
        ctx.strokeStyle = blobColor;
        ctx.lineWidth = config.thickness;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r, cy);
        ctx.lineTo(cx, cy + r);
        ctx.lineTo(cx - r, cy);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'pulse':
        const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
        ctx.strokeStyle = blobColor;
        ctx.lineWidth = config.thickness;
        ctx.beginPath();
        ctx.arc(cx, cy, r * pulse, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'retroframe':
        ctx.save();
        ctx.strokeStyle = blobColor;
        ctx.lineWidth = config.thickness * 2;
        
        const fw = w * 1.1;
        const fh = h * 1.1;
        const inset = (fw - w) / 2;
        
        ctx.strokeRect(x - inset, y - inset, fw, fh);
        
        ctx.lineWidth = config.thickness;
        ctx.strokeRect(x - inset - 4, y - inset - 4, fw + 8, fh + 8);
        
        ctx.fillStyle = blobColor;
        const cornerSize = 8;
        ctx.fillRect(x - inset - cornerSize, y - inset - cornerSize, cornerSize, cornerSize);
        ctx.fillRect(x + fw + inset, y - inset - cornerSize, cornerSize, cornerSize);
        ctx.fillRect(x - inset - cornerSize, y + fh + inset, cornerSize, cornerSize);
        ctx.fillRect(x + fw + inset, y + fh + inset, cornerSize, cornerSize);
        
        ctx.restore();
        break;
      case 'sniperReticle':
        drawSniperReticle(ctx, cx, cy, r, blobColor, config.thickness);
        break;
      case 'hexScanner':
        drawHexScanner(ctx, cx, cy, r, blobColor, config.thickness);
        break;
      case 'radarSweep':
        drawRadarSweep(ctx, cx, cy, r, blobColor, config.thickness, time);
        break;
      case 'segmentedRing':
        drawSegmentedRing(ctx, cx, cy, r, blobColor, config.thickness, time);
        break;
      case 'tickDiamond':
        drawTickDiamond(ctx, cx, cy, r, blobColor, config.thickness);
        break;
      case 'triOrbit':
        drawTriOrbit(ctx, cx, cy, r, blobColor, config.thickness, time);
        break;
      case 'cornerNotch':
        drawCornerNotch(ctx, cx, cy, r, blobColor, config.thickness);
        break;
      case 'dataNodeBadge':
        drawDataNodeBadge(ctx, cx, cy, r, blobColor, config.thickness);
        break;
      case 'cutCornerPanel':
        drawCutCornerPanel(ctx, cx, cy, r, blobColor, config.thickness);
        break;
      case 'radarPing':
        drawRadarPing(ctx, cx, cy, r, blobColor, config.thickness, time);
        break;
      case 'chevronLock':
        drawChevronLock(ctx, cx, cy, r, blobColor, config.thickness);
        break;
      case 'asymmetricBracket':
        drawAsymmetricBracket(ctx, cx, cy, r, blobColor, config.thickness);
        break;
    }

    ctx.shadowBlur = 0;

    if (config.showVelocityText) {
      const speed = Math.sqrt((blob.vx || 0) ** 2 + (blob.vy || 0) ** 2).toFixed(1);
      ctx.fillStyle = blobColor;
      ctx.font = '8px Space Mono';
      ctx.fillText(speed, cx + r + 4, cy);
    }
  });

  if (config.showBoundingBox) {
    blobs.forEach((blob) => {
      ctx.strokeStyle = ocol;
      ctx.lineWidth = 1;
      ctx.strokeRect(blob.minX, blob.minY, blob.width, blob.height);
    });
  }

  if (config.drawScanlines) {
    drawScanlines(ctx, width, height);
  }

  if (config.drawGlitch) {
    drawGlitch(ctx, width, height);
  }

  if (config.drawInterference) {
    drawInterference(ctx, width, height);
  }

  if (config.showCornerMarks) {
    const len = 30;
    const margin = 12;
    ctx.strokeStyle = `rgba(${orgb.r},${orgb.g},${orgb.b},0.7)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, margin + len); ctx.lineTo(margin, margin); ctx.lineTo(margin + len, margin);
    ctx.moveTo(width - margin - len, margin); ctx.lineTo(width - margin, margin); ctx.lineTo(width - margin, margin + len);
    ctx.moveTo(margin, height - margin - len); ctx.lineTo(margin, height - margin); ctx.lineTo(margin + len, height - margin);
    ctx.moveTo(width - margin - len, height - margin); ctx.lineTo(width - margin, height - margin); ctx.lineTo(width - margin, height - margin - len);
    ctx.stroke();
  }

  if (config.showTimestamp) {
    const now = new Date();
    const t = now.toLocaleTimeString();
    ctx.font = '11px Space Mono';
    ctx.fillStyle = `rgba(${orgb.r},${orgb.g},${orgb.b},0.8)`;
    ctx.fillText(t, width - ctx.measureText(t).width - 12, 18);
  }

  if (config.showCounter) {
    ctx.font = '11px Space Mono';
    ctx.fillStyle = `rgba(${orgb.r},${orgb.g},${orgb.b},0.8)`;
    ctx.fillText(`blobs: ${blobs.length}`, 12, 18);
  }
}

function drawConcentricRings(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
): void {
  const rgb = {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16),
  };

  for (let i = 1; i <= 5; i++) {
    const ratio = i / 5;
    ctx.beginPath();
    ctx.arc(x, y, r * ratio, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.3 * ratio})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
