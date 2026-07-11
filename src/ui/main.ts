import { BlobTracker, setConfig, getConfig, loadConfigFromStorage, resetConfig, exportConfigAsJson, importConfigFromJson, applyPreset, PRESETS } from '../index';
import type { Config } from '../types';
import './styles.css';

function section(id: string, label: string, content: string, open = false): string {
  const cls = open ? 'control-group open' : 'control-group collapsed';
  return `<div class="${cls}" data-section="${id}">
    <div class="section-header" data-toggle="${id}">
      <span>${label}</span>
      <span class="toggle-icon">▼</span>
    </div>
    <div class="section-content">${content}</div>
  </div>`;
}

function createUI(): void {
  const app = document.getElementById('app')!;

  const sourceSection = section('source', 'source', `
    <button id="toggleBtn">toggle camera</button>
    <button id="loadVideoBtn">load video</button>
    <button id="recordBtn">record camera</button>
    <button id="exportBtn" style="display:none">export video</button>
    <input type="file" id="videoInput" accept="video/*" style="display:none" />
  `);

  const trackingSection = section('tracking', 'tracking', `
    <label>threshold <span class="value-display" id="thresholdVal">127</span></label>
    <input type="range" id="threshold" min="0" max="255" value="127" />
    <label>min area <span class="value-display" id="minAreaVal">10</span></label>
    <input type="range" id="minArea" min="1" max="100" value="10" />
    <label>max area <span class="value-display" id="maxAreaVal">500</span></label>
    <input type="range" id="maxArea" min="100" max="2000" value="500" />
    <label>max blobs <span class="value-display" id="maxBlobsVal">50</span></label>
    <input type="range" id="maxBlobs" min="1" max="100" value="50" />
    <label>resolution <span class="value-display" id="resScaleVal">1.00</span></label>
    <input type="range" id="resScale" min="0.25" max="1" step="0.05" value="1.0" />
    <div class="checkbox-label">
      <input type="checkbox" id="enableSkip" checked /><span>frame skip</span>
    </div>
  `, true);

  const smoothingSection = section('smoothing', 'smoothing', `
    <label>motion <span class="value-display" id="motionSmoothVal">0.5</span></label>
    <input type="range" id="motionSmooth" min="0" max="1" step="0.1" value="0.5" />
    <label>line smoothness <span class="value-display" id="lineSmoothVal">8</span></label>
    <input type="range" id="lineSmooth" min="2" max="16" value="8" />
  `);

  const shapesSection = section('shapes', 'shapes', `
    <label>outline</label>
    <input type="color" id="outlineColor" value="#ffffff" class="color-picker" />
    <label>thickness <span class="value-display" id="thicknessVal">2</span></label>
    <input type="range" id="thickness" min="1" max="5" value="2" />
    <div class="checkbox-label"><input type="checkbox" id="shapeSniperReticle" checked /><span>sniper reticle</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeHexScanner" /><span>hex scanner</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeRadarSweep" /><span>radar sweep</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeSegmentedRing" /><span>segmented ring</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeTickDiamond" /><span>tick diamond</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeTriOrbit" /><span>tri-orbit</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeCornerNotch" /><span>corner notch</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeDataNodeBadge" /><span>data node badge</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeCutCornerPanel" /><span>cut-corner panel</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeRadarPing" /><span>radar ping</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeChevronLock" /><span>chevron lock</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeAsymmetricBracket" /><span>asymmetric bracket</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapePulse" /><span>pulse</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeRetroFrame" /><span>retro frame</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeBracket" /><span>bracket</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeRect" /><span>rectangle</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeConcentric" /><span>concentric</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeCrosshair" /><span>crosshair</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeInner" /><span>inner</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeRing" /><span>ring</span></div>
    <div class="checkbox-label"><input type="checkbox" id="shapeDiamond" /><span>diamond</span></div>
    <label>glow <span class="value-display" id="glowIntensityVal">0</span></label>
    <input type="range" id="glowIntensity" min="0" max="20" value="0" />
  `, true);

  const presetsSection = section('presets', 'presets', `
    ${PRESETS.map(p => `<div class="checkbox-label"><input type="checkbox" id="preset${p.name}" /><span>${p.label}</span></div>`).join('')}
    <label>trail color</label>
    <input type="color" id="trailColor" value="#ffffff" class="color-picker" />
    <div class="checkbox-label"><input type="checkbox" id="drawTrails" checked /><span>trails</span></div>
    <label>glow <span class="value-display" id="trailGlowVal">0</span></label>
    <input type="range" id="trailGlow" min="0" max="15" value="0" />
    <label>length <span class="value-display" id="trailLengthVal">10</span></label>
    <input type="range" id="trailLength" min="2" max="50" value="10" />
  `);

  const overlaysSection = section('overlays', 'overlays', `
    <div class="checkbox-label"><input type="checkbox" id="showGrid" /><span>grid</span></div>
    <div class="checkbox-label"><input type="checkbox" id="showCornerMarks" /><span>corner marks</span></div>
    <div class="checkbox-label"><input type="checkbox" id="showTimestamp" /><span>timestamp</span></div>
    <div class="checkbox-label"><input type="checkbox" id="showCounter" /><span>counter</span></div>
    <div class="checkbox-label"><input type="checkbox" id="showTraceLine" /><span>trace line</span></div>
    <div class="checkbox-label"><input type="checkbox" id="showVelocityText" /><span>velocity text</span></div>
    <div class="checkbox-label"><input type="checkbox" id="showBoundingBox" /><span>bounding box</span></div>
  `);

  const transformSection = section('transform', 'transform', `
    <div class="checkbox-label"><input type="checkbox" id="drawMirror" /><span>mirror</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawKaleidoscope" /><span>kaleidoscope</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawTileMirror" /><span>tile mirror</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawFractal" /><span>fractal</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawTunnel" /><span>tunnel</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawRippleMirror" /><span>ripple</span></div>
    <label>segments <span class="value-display" id="mirrorSegmentsVal">6</span></label>
    <input type="range" id="mirrorSegments" min="2" max="12" value="6" />
  `);

  const distortSection = section('distort', 'distort', `
    <div class="checkbox-label"><input type="checkbox" id="drawRGBSplit" /><span>rgb split</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawChromatic" /><span>chromatic</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawBlockGlitch" /><span>block glitch</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawVHS" /><span>vhs</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawTear" /><span>tear</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawShift" /><span>shift</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawWave" /><span>wave</span></div>
    <label>offset <span class="value-display" id="glitchOffsetVal">5</span></label>
    <input type="range" id="glitchOffset" min="1" max="20" value="5" />
    <label>twist <span class="value-display" id="twistAngleVal">30</span></label>
    <input type="range" id="twistAngle" min="10" max="90" value="30" />
  `);

  const colorFxSection = section('color fx', 'color fx', `
    <div class="checkbox-label"><input type="checkbox" id="drawInvert" /><span>invert</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawSolarize" /><span>solarize</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawEdge" /><span>edge detect</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawThermal" /><span>thermal</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawColorShift" /><span>color shift</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawPosterize" /><span>posterize</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawPixelate" /><span>pixelate</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawQuantize" /><span>quantize</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawThreshold" /><span>threshold</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawBlur" /><span>blur</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawZoomBlur" /><span>zoom blur</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawSharpen" /><span>sharpen</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawBloom" /><span>bloom</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawFilmGrain" /><span>film grain</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawVignette" /><span>vignette</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawNoise" /><span>noise</span></div>
    <label>levels <span class="value-display" id="colorLevelsVal">6</span></label>
    <input type="range" id="colorLevels" min="2" max="16" value="6" />
  `);

  const colorGradeSection = section('color grade', 'color grade', `
    <div class="checkbox-label"><input type="checkbox" id="drawCold" /><span>cold</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawWarm" /><span>warm</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawNoir" /><span>noir</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawSepia" /><span>sepia</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawDuotone" /><span>duotone</span></div>
  `);

  const feedbackSection = section('feedback', 'feedback', `
    <div class="checkbox-label"><input type="checkbox" id="drawFeedback" /><span>feedback</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawReflection" /><span>reflection</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawFloorReflection" /><span>floor</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawGlass" /><span>glass</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawDropShadow" /><span>drop shadow</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawSparkle" /><span>sparkle</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawFilmBurn" /><span>film burn</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawLensFlare" /><span>lens flare</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawTwist" /><span>twist</span></div>
  `);

  const screenFxSection = section('screen fx', 'screen fx', `
    <div class="checkbox-label"><input type="checkbox" id="drawScanlines" /><span>scanlines</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawCRT" /><span>crt</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawGlitch" /><span>glitch</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawInterference" /><span>interference</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawStatic" /><span>static</span></div>
    <label>intensity <span class="value-display" id="staticIntensityVal">10</span></label>
    <input type="range" id="staticIntensity" min="1" max="20" value="10" />
    <div class="checkbox-label"><input type="checkbox" id="drawJitter" /><span>jitter</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawColorBleed" /><span>color bleed</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawTrackingLines" /><span>tracking lines</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawColorBars" /><span>color bars</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawDateStamp" /><span>date stamp</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawLetterbox" /><span>letterbox</span></div>
    <label>bar height <span class="value-display" id="letterboxHeightVal">50</span></label>
    <input type="range" id="letterboxHeight" min="20" max="100" value="50" />
    <div class="checkbox-label"><input type="checkbox" id="drawMatrix" /><span>matrix</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawStrobe" /><span>strobe</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawHologram" /><span>hologram</span></div>
    <div class="checkbox-label"><input type="checkbox" id="drawMotionTrail" /><span>motion trail</span></div>
  `);

  const neonLaserSection = section('neon/laser', 'neon/laser', `
    <div class="checkbox-label"><input type="checkbox" id="drawNeon" /><span>neon</span></div>
    <label>color</label>
    <input type="color" id="neonColor" value="#00ffff" class="color-picker" />
    <div class="checkbox-label"><input type="checkbox" id="drawLaser" /><span>laser</span></div>
    <label>laser color</label>
    <input type="color" id="laserColor" value="#ff0044" class="color-picker" />
    <label>laser mid</label>
    <input type="color" id="laserMidColor" value="#00ff00" class="color-picker" />
    <label>laser corner</label>
    <input type="color" id="laserCornerColor" value="#00ff00" class="color-picker" />
    <label>width <span class="value-display" id="laserWidthVal">2</span></label>
    <input type="range" id="laserWidth" min="1" max="5" value="2" />
    <label>threshold <span class="value-display" id="laserThresholdVal">200</span></label>
    <input type="range" id="laserThreshold" min="50" max="500" value="200" />
  `);

  const configSection = section('config', 'config', `
    <button id="resetConfigBtn">reset defaults</button>
    <button id="exportConfigBtn">export config</button>
    <button id="importConfigBtn">import config</button>
    <input type="file" id="configInput" accept=".json" style="display:none" />
  `);

  app.innerHTML = `
    <div id="canvas-container">
      <canvas id="videoCanvas"></canvas>
      <div id="dropZone">drop video here</div>
      <div id="status">
        <div>
          <span id="statusText">ready</span> / fps: <span id="fps">0</span> /
          blobs: <span id="blobCount">0</span>
        </div>
      </div>
    </div>
    <div id="controls">
      <input type="text" id="searchBar" placeholder="search controls..." />
      ${sourceSection}
      ${trackingSection}
      ${smoothingSection}
      ${shapesSection}
      ${presetsSection}
      ${overlaysSection}
      ${transformSection}
      ${distortSection}
      ${colorFxSection}
      ${colorGradeSection}
      ${feedbackSection}
      ${screenFxSection}
      ${neonLaserSection}
      ${configSection}
      <div class="info">
        <a href="https://instagram.com/manojxshrestha" target="_blank" class="social-link">
          <img src="/Instagram.png" alt="Instagram" class="social-icon" />
          <span>@manojxshrestha</span>
        </a>
      </div>
    </div>
  `;
}

function bindEvents(tracker: BlobTracker): void {
  let isTracking = false;
  let isRecording = false;
  let mediaRecorder: MediaRecorder | null = null;
  let recordedChunks: Blob[] = [];

  // Accordion toggle (event delegation)
  document.getElementById('controls')!.addEventListener('click', (e) => {
    const header = (e.target as HTMLElement).closest('.section-header') as HTMLElement | null;
    if (!header) return;
    const sectionId = header.dataset.toggle;
    if (!sectionId) return;
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    if (!section) return;
    const isOpen = section.classList.contains('open');
    section.classList.toggle('open', !isOpen);
    section.classList.toggle('collapsed', isOpen);
    // Remember section state in localStorage
    try {
      const state = JSON.parse(localStorage.getItem('webtouch:sections') || '{}');
      state[sectionId] = !isOpen;
      localStorage.setItem('webtouch:sections', JSON.stringify(state));
    } catch {}
  });

  // Restore section accordion state from localStorage
  try {
    const state = JSON.parse(localStorage.getItem('webtouch:sections') || '{}');
    document.querySelectorAll('[data-section]').forEach((el) => {
      const id = (el as HTMLElement).dataset.section!;
      if (state[id] === false) {
        el.classList.remove('open');
        el.classList.add('collapsed');
      } else if (state[id] === true) {
        el.classList.remove('collapsed');
        el.classList.add('open');
      }
    });
  } catch {}

  // Search bar
  const searchBar = document.getElementById('searchBar') as HTMLInputElement;
  if (searchBar) {
    searchBar.addEventListener('input', () => {
      const q = searchBar.value.toLowerCase().trim();
      document.querySelectorAll('#controls .control-group').forEach((group) => {
        if (!q) {
          group.classList.remove('filtered-out');
          return;
        }
        const labels = group.querySelectorAll('.checkbox-label span, label:not(.checkbox-label)');
        let match = false;
        labels.forEach((l) => {
          if (l.textContent?.toLowerCase().includes(q)) match = true;
        });
        group.classList.toggle('filtered-out', !match);
        if (match) {
          group.classList.remove('collapsed');
          group.classList.add('open');
        }
      });
    });
  }

  const toggleBtn = document.getElementById('toggleBtn')!;
  const loadVideoBtn = document.getElementById('loadVideoBtn')!;
  const recordBtn = document.getElementById('recordBtn')!;
  const exportBtn = document.getElementById('exportBtn') as HTMLButtonElement;
  const videoInput = document.getElementById('videoInput') as HTMLInputElement;
  const statusText = document.getElementById('statusText')!;

  toggleBtn.addEventListener('click', async () => {
    if (tracker.isActive()) {
      tracker.stopCamera();
      isTracking = false;
      statusText.textContent = 'ready';
    } else {
      try {
        await tracker.startCamera();
        isTracking = true;
        statusText.textContent = 'tracking';
      } catch {
        statusText.textContent = 'error';
      }
    }
  });

  loadVideoBtn.addEventListener('click', () => {
    videoInput.click();
  });

  videoInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      tracker.stopCamera();
      tracker.loadVideoFile(file);
      isTracking = true;
      statusText.textContent = 'video';
      exportBtn.style.display = 'block';
    }
  });

  const dropZone = document.getElementById('dropZone')!;
  const canvasContainer = document.getElementById('canvas-container')!;

  canvasContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('active');
  });

  canvasContainer.addEventListener('dragleave', () => {
    dropZone.classList.remove('active');
  });

  canvasContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    const file = e.dataTransfer?.files[0];
    if (file) {
      tracker.stopCamera();
      tracker.loadVideoFile(file);
      isTracking = true;
      statusText.textContent = 'video';
      exportBtn.style.display = 'block';
    }
  });

  recordBtn.addEventListener('click', async () => {
    if (!isTracking) {
      try {
        await tracker.startCamera();
        isTracking = true;
        statusText.textContent = 'tracking';
      } catch {
        statusText.textContent = 'error';
      }
    } else if (!isRecording) {
      const canvas = document.getElementById('videoCanvas') as HTMLCanvasElement;
      const stream = canvas.captureStream(30);
      
      let mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp9';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8';
      }

      mediaRecorder = new MediaRecorder(stream, { mimeType });
      recordedChunks = [];
      let progress = 0;

      const progressInterval = setInterval(() => {
        progress += 2;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          if (mediaRecorder) mediaRecorder.stop();
        } else {
          recordBtn.textContent = `recording ${progress}%`;
        }
      }, 100);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        clearInterval(progressInterval);
        recordBtn.textContent = 'recording 100%';
        const blob = new Blob(recordedChunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webtouch-' + Date.now() + '.webm';
        a.click();
        URL.revokeObjectURL(url);
        setTimeout(() => {
          recordBtn.textContent = 'record camera';
          statusText.textContent = 'tracking';
        }, 500);
      };

      mediaRecorder.start(100);
      isRecording = true;
      recordBtn.textContent = 'stop';
      statusText.textContent = 'recording';
    } else if (mediaRecorder) {
      mediaRecorder.stop();
      isRecording = false;
      recordBtn.textContent = 'record camera';
      statusText.textContent = 'tracking';
    }
  });

  exportBtn.addEventListener('click', async () => {
    exportBtn.disabled = true;
    statusText.textContent = 'exporting';

    const cfg = { ...getConfig() };
    const exportW = cfg.exportWidth;
    const exportH = cfg.exportHeight;
    const exportFps = cfg.exportFps;

    const canvas = document.getElementById('videoCanvas') as HTMLCanvasElement;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = exportW;
    exportCanvas.height = exportH;
    const exportCtx = exportCanvas.getContext('2d')!;

    const stream = exportCanvas.captureStream(exportFps);
    
    const mimeTypes = [`video/webm;codecs=h264`, `video/webm;codecs=vp9`, `video/webm;codecs=vp8`, `video/webm`];
    let mimeType = 'video/webm';
    for (const mt of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mt)) {
        mimeType = mt;
        break;
      }
    }

    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];
    let progress = 0;

    const drawExportFrame = () => {
      exportCtx.drawImage(canvas, 0, 0, exportW, exportH);
    };

    const progressInterval = setInterval(() => {
      drawExportFrame();
      progress += 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        recorder.stop();
      } else {
        exportBtn.textContent = `exporting ${progress}%`;
      }
    }, 1000 / exportFps);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      clearInterval(progressInterval);
      exportBtn.textContent = 'converting to mp4...';
      
      const webmBlob = new Blob(chunks, { type: 'video/webm' });
      
      try {
        const { convertWebmToMp4 } = await import('../utils/ffmpeg');
        console.log('Converting webm to mp4...');
        const mp4Blob = await convertWebmToMp4(webmBlob, {
          width: exportW,
          height: exportH,
          fps: exportFps,
          bitrate: cfg.exportBitrate,
        });
        console.log('MP4 conversion successful, size:', mp4Blob.size);
        
        const url = URL.createObjectURL(mp4Blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webtouch-' + Date.now() + '.mp4';
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('MP4 conversion failed:', err);
        exportBtn.textContent = 'fallback to webm...';
        const url = URL.createObjectURL(webmBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webtouch-' + Date.now() + '.webm';
        a.click();
        URL.revokeObjectURL(url);
      }
      
      setTimeout(() => {
        exportBtn.textContent = 'export video';
        exportBtn.disabled = false;
        statusText.textContent = isTracking ? 'tracking' : 'ready';
      }, 500);
    };

    recorder.start(100);
    statusText.textContent = 'exporting 0%';
  });

  const shapeCheckboxes = [
    'shapeSniperReticle', 'shapeHexScanner', 'shapeRadarSweep', 'shapeSegmentedRing',
    'shapeTickDiamond', 'shapeTriOrbit', 'shapeCornerNotch', 'shapeDataNodeBadge',
    'shapeCutCornerPanel', 'shapeRadarPing', 'shapeChevronLock', 'shapeAsymmetricBracket',
    'shapePulse', 'shapeRetroFrame',
    'shapeBracket', 'shapeRect', 'shapeConcentric', 'shapeCrosshair',
    'shapeInner', 'shapeRing', 'shapeDiamond'
  ];
  shapeCheckboxes.forEach(id => {
    const el = document.getElementById(id) as HTMLInputElement;
    el.addEventListener('change', () => {
      if (el.checked) {
        shapeCheckboxes.forEach(otherId => {
          const other = document.getElementById(otherId) as HTMLInputElement;
          if (otherId !== id) other.checked = false;
        });
      }
      const checked = shapeCheckboxes.find(cid => (document.getElementById(cid) as HTMLInputElement).checked);
      const shapeMap: Record<string, Config['shapeStyle']> = {
        shapeSniperReticle: 'sniperReticle',
        shapeHexScanner: 'hexScanner',
        shapeRadarSweep: 'radarSweep',
        shapeSegmentedRing: 'segmentedRing',
        shapeTickDiamond: 'tickDiamond',
        shapeTriOrbit: 'triOrbit',
        shapeCornerNotch: 'cornerNotch',
        shapeDataNodeBadge: 'dataNodeBadge',
        shapeCutCornerPanel: 'cutCornerPanel',
        shapeRadarPing: 'radarPing',
        shapeChevronLock: 'chevronLock',
        shapeAsymmetricBracket: 'asymmetricBracket',
        shapePulse: 'pulse',
        shapeRetroFrame: 'retroframe',
        shapeBracket: 'bracket',
        shapeRect: 'rect',
        shapeConcentric: 'concentric',
        shapeCrosshair: 'crosshair',
        shapeInner: 'inner',
        shapeRing: 'ring',
        shapeDiamond: 'diamond',
      };
      const shape = checked ? shapeMap[checked] : 'none';
      setConfig({ shapeStyle: shape });
    });
  });

  const rangeControls: Record<string, string> = {
    threshold: 'threshold',
    minArea: 'minArea',
    maxArea: 'maxArea',
    maxBlobs: 'maxBlobs',
    resScale: 'resolutionScale',
    thickness: 'thickness',
    motionSmooth: 'motionSmoothing',
    lineSmooth: 'lineSmoothing',
    trailGlow: 'trailGlow',
    trailLength: 'trailLength',
    mirrorSegments: 'mirrorSegments',
    glitchOffset: 'glitchOffset',
    colorLevels: 'colorLevels',
    glowIntensity: 'glowIntensity',
    letterboxHeight: 'letterboxHeight',
    staticIntensity: 'staticIntensity',
    laserWidth: 'laserWidth',
    laserThreshold: 'laserThreshold',
    twistAngle: 'twistAngle',
  };

  Object.entries(rangeControls).forEach(([id, configKey]) => {
    const el = document.getElementById(id) as HTMLInputElement;
    const display = document.getElementById(id + 'Val');

    el.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      setConfig({ [configKey]: value });
      if (display) {
        display.textContent = id === 'resScale' ? value.toFixed(2) : value.toString();
      }
    });
  });

  const checkboxes: Record<string, string> = {
    enableSkip: 'enableSkip',
    drawTrails: 'drawTrails',
    showGrid: 'showGrid',
    showCornerMarks: 'showCornerMarks',
    showTimestamp: 'showTimestamp',
    showCounter: 'showCounter',
    showTraceLine: 'showTraceLine',
    showVelocityText: 'showVelocityText',
    showBoundingBox: 'showBoundingBox',
    drawMirror: 'drawMirror',
    drawKaleidoscope: 'drawKaleidoscope',
    drawTileMirror: 'drawTileMirror',
    drawFractal: 'drawFractal',
    drawTunnel: 'drawTunnel',
    drawRippleMirror: 'drawRippleMirror',
    drawRGBSplit: 'drawRGBSplit',
    drawChromatic: 'drawChromatic',
    drawBlockGlitch: 'drawBlockGlitch',
    drawVHS: 'drawVHS',
    drawTear: 'drawTear',
    drawShift: 'drawShift',
    drawWave: 'drawWave',
    drawInvert: 'drawInvert',
    drawSolarize: 'drawSolarize',
    drawScanlines: 'drawScanlines',
    drawCRT: 'drawCRT',
    drawGlitch: 'drawGlitch',
    drawInterference: 'drawInterference',
    drawEdge: 'drawEdge',
    drawThermal: 'drawThermal',
    drawFeedback: 'drawFeedback',
    drawDuotone: 'drawDuotone',
    drawBloom: 'drawBloom',
    drawFilmGrain: 'drawFilmGrain',
    drawColorShift: 'drawColorShift',
    drawPosterize: 'drawPosterize',
    drawPixelate: 'drawPixelate',
    drawQuantize: 'drawQuantize',
    drawThreshold: 'drawThreshold',
    drawBlur: 'drawBlur',
    drawZoomBlur: 'drawZoomBlur',
    drawSharpen: 'drawSharpen',
    drawVignette: 'drawVignette',
    drawNoise: 'drawNoise',
    drawDateStamp: 'drawDateStamp',
    drawLetterbox: 'drawLetterbox',
    drawTrackingLines: 'drawTrackingLines',
    drawColorBleed: 'drawColorBleed',
    drawStatic: 'drawStatic',
    drawJitter: 'drawJitter',
    drawColorBars: 'drawColorBars',
    drawCold: 'drawCold',
    drawWarm: 'drawWarm',
    drawNoir: 'drawNoir',
    drawSepia: 'drawSepia',
    drawNeon: 'drawNeon',
    drawLaser: 'drawLaser',
    drawHologram: 'drawHologram',
    drawMotionTrail: 'drawMotionTrail',
    drawStrobe: 'drawStrobe',
    drawMatrix: 'drawMatrix',
    drawLensFlare: 'drawLensFlare',
    drawTwist: 'drawTwist',
    drawFilmBurn: 'drawFilmBurn',
    drawDropShadow: 'drawDropShadow',
    drawSparkle: 'drawSparkle',
    drawReflection: 'drawReflection',
    drawFloorReflection: 'drawFloorReflection',
    drawGlass: 'drawGlass',
  };

  Object.entries(checkboxes).forEach(([id, configKey]) => {
    const el = document.getElementById(id) as HTMLInputElement;
    el.addEventListener('change', (e) => {
      setConfig({ [configKey]: (e.target as HTMLInputElement).checked });
    });
  });

  const presetCheckboxes: string[] = [];
  PRESETS.forEach(p => presetCheckboxes.push('preset' + p.name));
  presetCheckboxes.forEach(id => {
    const el = document.getElementById(id) as HTMLInputElement;
    el.addEventListener('change', () => {
      if (el.checked) {
        presetCheckboxes.forEach(otherId => {
          const other = document.getElementById(otherId) as HTMLInputElement;
          if (otherId !== id) other.checked = false;
        });
      }
      const checked = presetCheckboxes.find(cid => (document.getElementById(cid) as HTMLInputElement).checked);
      if (!checked) return;
      const name = checked.replace('preset', '');
      const updates = applyPreset(name);
      setConfig(updates);
    });
  });

  document.getElementById('outlineColor')!.addEventListener('input', (e) => {
    setConfig({ outlineColor: (e.target as HTMLInputElement).value });
  });

  document.getElementById('trailColor')!.addEventListener('input', (e) => {
    setConfig({ trailColor: (e.target as HTMLInputElement).value });
  });

  document.getElementById('neonColor')!.addEventListener('input', (e) => {
    setConfig({ neonColor: (e.target as HTMLInputElement).value });
  });

  document.getElementById('laserColor')!.addEventListener('input', (e) => {
    setConfig({ laserColor: (e.target as HTMLInputElement).value });
  });

  document.getElementById('laserMidColor')!.addEventListener('input', (e) => {
    setConfig({ laserMidColor: (e.target as HTMLInputElement).value });
  });

  document.getElementById('laserCornerColor')!.addEventListener('input', (e) => {
    setConfig({ laserCornerColor: (e.target as HTMLInputElement).value });
  });

  document.getElementById('resetConfigBtn')!.addEventListener('click', () => {
    if (confirm('Reset all settings to defaults?')) {
      resetConfig();
      location.reload();
    }
  });

  document.getElementById('exportConfigBtn')!.addEventListener('click', () => {
    const json = exportConfigAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webtouch-config.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importConfigBtn')!.addEventListener('click', () => {
    document.getElementById('configInput')!.click();
  });

  document.getElementById('configInput')!.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importConfigFromJson(reader.result as string);
        location.reload();
      } catch {
        alert('Invalid config file');
      }
    };
    reader.readAsText(file);
  });
}

createUI();

// Load persisted config after UI is built, then sync control values
loadConfigFromStorage();
const cfg = getConfig();

function syncUIFromConfig(c: Config): void {
  // Sliders
  const sliderMap: Record<string, number> = {
    threshold: c.threshold, minArea: c.minArea, maxArea: c.maxArea, maxBlobs: c.maxBlobs,
    resScale: c.resolutionScale, thickness: c.thickness, glowIntensity: c.glowIntensity,
    trailGlow: c.trailGlow, trailLength: c.trailLength, motionSmooth: c.motionSmoothing,
    lineSmooth: c.lineSmoothing, mirrorSegments: c.mirrorSegments, glitchOffset: c.glitchOffset,
    colorLevels: c.colorLevels, letterboxHeight: c.letterboxHeight,
    staticIntensity: c.staticIntensity, laserWidth: c.laserWidth, laserThreshold: c.laserThreshold,
    twistAngle: c.twistAngle,
  };
  Object.entries(sliderMap).forEach(([id, val]) => {
    const el = document.getElementById(id) as HTMLInputElement;
    const display = document.getElementById(id + 'Val');
    if (el) el.value = String(val);
    if (display) display.textContent = id === 'resScale' ? val.toFixed(2) : val.toString();
  });

  // Checkboxes
  const checkboxMap: Record<string, boolean> = {
    enableSkip: c.enableSkip, drawTrails: c.drawTrails,
    showGrid: c.showGrid, showCornerMarks: c.showCornerMarks, showTimestamp: c.showTimestamp,
    showCounter: c.showCounter, showTraceLine: c.showTraceLine, showVelocityText: c.showVelocityText,
    showBoundingBox: c.showBoundingBox, drawMirror: c.drawMirror, drawKaleidoscope: c.drawKaleidoscope,
    drawTileMirror: c.drawTileMirror, drawFractal: c.drawFractal, drawTunnel: c.drawTunnel,
    drawRippleMirror: c.drawRippleMirror, drawRGBSplit: c.drawRGBSplit, drawChromatic: c.drawChromatic,
    drawBlockGlitch: c.drawBlockGlitch, drawVHS: c.drawVHS, drawTear: c.drawTear, drawShift: c.drawShift,
    drawWave: c.drawWave, drawInvert: c.drawInvert, drawSolarize: c.drawSolarize,
    drawScanlines: c.drawScanlines, drawCRT: c.drawCRT, drawGlitch: c.drawGlitch,
    drawInterference: c.drawInterference, drawEdge: c.drawEdge, drawThermal: c.drawThermal,
    drawFeedback: c.drawFeedback, drawDuotone: c.drawDuotone, drawBloom: c.drawBloom,
    drawFilmGrain: c.drawFilmGrain, drawColorShift: c.drawColorShift, drawPosterize: c.drawPosterize,
    drawPixelate: c.drawPixelate, drawQuantize: c.drawQuantize, drawThreshold: c.drawThreshold,
    drawBlur: c.drawBlur, drawZoomBlur: c.drawZoomBlur, drawSharpen: c.drawSharpen,
    drawVignette: c.drawVignette, drawNoise: c.drawNoise, drawDateStamp: c.drawDateStamp,
    drawLetterbox: c.drawLetterbox, drawTrackingLines: c.drawTrackingLines,
    drawColorBleed: c.drawColorBleed, drawStatic: c.drawStatic, drawJitter: c.drawJitter,
    drawColorBars: c.drawColorBars, drawCold: c.drawCold, drawWarm: c.drawWarm, drawNoir: c.drawNoir,
    drawSepia: c.drawSepia, drawNeon: c.drawNeon, drawLaser: c.drawLaser, drawHologram: c.drawHologram,
    drawMotionTrail: c.drawMotionTrail, drawStrobe: c.drawStrobe, drawMatrix: c.drawMatrix,
    drawLensFlare: c.drawLensFlare, drawTwist: c.drawTwist, drawFilmBurn: c.drawFilmBurn,
    drawDropShadow: c.drawDropShadow, drawSparkle: c.drawSparkle, drawReflection: c.drawReflection,
    drawFloorReflection: c.drawFloorReflection, drawGlass: c.drawGlass,
  };
  Object.entries(checkboxMap).forEach(([id, val]) => {
    const el = document.getElementById(id) as HTMLInputElement;
    if (el) el.checked = val;
  });

  // Color pickers
  const colorMap: Record<string, string> = {
    outlineColor: c.outlineColor, trailColor: c.trailColor, neonColor: c.neonColor,
    laserColor: c.laserColor, laserMidColor: c.laserMidColor, laserCornerColor: c.laserCornerColor,
  };
  Object.entries(colorMap).forEach(([id, val]) => {
    const el = document.getElementById(id) as HTMLInputElement;
    if (el) el.value = val;
  });

  // Shape radio buttons
  const shapeIdMap: Record<string, string> = {
    sniperReticle: 'shapeSniperReticle', hexScanner: 'shapeHexScanner',
    radarSweep: 'shapeRadarSweep', segmentedRing: 'shapeSegmentedRing',
    tickDiamond: 'shapeTickDiamond', triOrbit: 'shapeTriOrbit',
    cornerNotch: 'shapeCornerNotch', dataNodeBadge: 'shapeDataNodeBadge',
    cutCornerPanel: 'shapeCutCornerPanel', radarPing: 'shapeRadarPing',
    chevronLock: 'shapeChevronLock', asymmetricBracket: 'shapeAsymmetricBracket',
    pulse: 'shapePulse', retroframe: 'shapeRetroFrame',
    bracket: 'shapeBracket', rect: 'shapeRect', concentric: 'shapeConcentric',
    crosshair: 'shapeCrosshair', inner: 'shapeInner', ring: 'shapeRing',
    diamond: 'shapeDiamond',
  };
  const shapeEl = document.getElementById(shapeIdMap[c.shapeStyle] || 'shapeSniperReticle') as HTMLInputElement;
  if (shapeEl) shapeEl.checked = true;

  // Preset radio button
  const presetEl = document.getElementById('preset' + c.preset) as HTMLInputElement;
  if (presetEl) presetEl.checked = true;
}

syncUIFromConfig(cfg);

const tracker = new BlobTracker('videoCanvas');
bindEvents(tracker);
