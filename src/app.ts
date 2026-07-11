import type { Blob } from './types';
import { getConfig } from './core/config';
import { detectBlobs } from './detection/detect';
import { matchBlobs } from './detection/match';
import { render } from './rendering';

class BlobTracker {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;
  private animationId: number | null = null;
  private lastFrameTime = 0;
  private fps = 0;
  private frameCount = 0;
  private blobs: Blob[] = [];
  private prevBlobs: Blob[] = [];
  private isTracking = false;
  private videoMode = false;
  private detectionCanvas: HTMLCanvasElement;
  private detectionCtx: CanvasRenderingContext2D;
  private lastVideoWidth = 0;
  private lastVideoHeight = 0;
  private feedbackCanvas: HTMLCanvasElement;
  private feedbackCtx: CanvasRenderingContext2D;
  private currentVideoUrl: string | null = null;

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    this.detectionCanvas = document.createElement('canvas');
    this.detectionCtx = this.detectionCanvas.getContext('2d', { willReadFrequently: true })!;
    this.feedbackCanvas = document.createElement('canvas');
    this.feedbackCtx = this.feedbackCanvas.getContext('2d')!;
  }

  async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      this.video = document.createElement('video');
      this.video.srcObject = this.stream;
      this.video.autoplay = true;
      this.video.playsInline = true;
      this.video.onloadedmetadata = () => {
        this.isTracking = true;
        this.processFrame();
      };
    } catch (err) {
      console.error('Camera access denied:', err);
      throw err;
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.video = null;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lastVideoWidth = 0;
    this.lastVideoHeight = 0;
    this.isTracking = false;
    this.videoMode = false;
  }

  loadVideoFile(file: File): void {
    if (!file.type.startsWith('video/')) return;
    this.stopCamera();
    if (this.currentVideoUrl) {
      URL.revokeObjectURL(this.currentVideoUrl);
      this.currentVideoUrl = null;
    }
    this.video = document.createElement('video');
    this.currentVideoUrl = URL.createObjectURL(file);
    this.video.src = this.currentVideoUrl;
    this.video.autoplay = true;
    this.video.loop = true;
    this.video.playsInline = true;
    this.video.onloadedmetadata = () => {
      this.videoMode = true;
      this.isTracking = true;
      this.prevBlobs = [];
      this.frameCount = 0;
      this.processFrame();
    };
  }

  private processFrame(): void {
    if (!this.video || this.video.readyState !== this.video.HAVE_ENOUGH_DATA) {
      this.animationId = requestAnimationFrame(() => this.processFrame());
      return;
    }

    const now = performance.now();
    if (now - this.lastFrameTime > 0) {
      this.fps = 1000 / (now - this.lastFrameTime);
    }
    this.lastFrameTime = now;

    const vw = this.video.videoWidth;
    const vh = this.video.videoHeight;

    if (vw !== this.lastVideoWidth || vh !== this.lastVideoHeight) {
      this.canvas.width = vw;
      this.canvas.height = vh;
      this.lastVideoWidth = vw;
      this.lastVideoHeight = vh;
    }

    const config = getConfig();

    this.ctx.drawImage(this.video, 0, 0);

    const sc = config.resolutionScale;
    const pw = Math.floor(vw * sc);
    const ph = Math.floor(vh * sc);

    if (this.detectionCanvas.width !== pw || this.detectionCanvas.height !== ph) {
      this.detectionCanvas.width = pw;
      this.detectionCanvas.height = ph;
    }

    this.detectionCtx.drawImage(this.video, 0, 0, pw, ph);
    const imgData = this.detectionCtx.getImageData(0, 0, pw, ph);

    this.frameCount++;
    const shouldDetect = !config.enableSkip || this.frameCount % 2 === 0;

    if (shouldDetect) {
      this.blobs = detectBlobs(imgData);
      this.blobs.forEach((b) => {
        b.x *= 1 / sc;
        b.y *= 1 / sc;
        b.minX *= 1 / sc;
        b.maxX *= 1 / sc;
        b.minY *= 1 / sc;
        b.maxY *= 1 / sc;
        b.width *= 1 / sc;
        b.height *= 1 / sc;
      });
      this.blobs = matchBlobs(this.blobs, this.prevBlobs);
      for (const blob of this.blobs) {
        const prev = this.prevBlobs.find(p => p.id === blob.id);
        if (prev?.history) {
          blob.history = prev.history;
        } else {
          blob.history = [];
        }
        blob.history.push({ x: blob.x, y: blob.y, vx: blob.vx || 0, vy: blob.vy || 0 });
        if (blob.history.length > config.trailLength) {
          blob.history.shift();
        }
      }
      this.prevBlobs = this.blobs;
    }

    render(this.ctx, this.canvas, this.blobs, this.frameCount, this.fps, this.feedbackCanvas, this.feedbackCtx);

    document.getElementById('fps')!.textContent = Math.round(this.fps).toString();
    document.getElementById('blobCount')!.textContent = this.blobs.length.toString();

    if (this.videoMode && this.video.requestVideoFrameCallback) {
      this.video.requestVideoFrameCallback(() => this.processFrame());
    } else {
      this.animationId = requestAnimationFrame(() => this.processFrame());
    }
  }

  getFps(): number {
    return this.fps;
  }

  getBlobs(): Blob[] {
    return this.blobs;
  }

  isActive(): boolean {
    return this.isTracking;
  }
}

export { BlobTracker };
