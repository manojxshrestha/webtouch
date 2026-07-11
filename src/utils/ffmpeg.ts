import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let ffmpegLoaded = false;

const FFMPEG_CDN_SOURCES = [
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/umd',
  'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd',
];

export interface ExportOptions {
  width: number;
  height: number;
  fps: number;
  bitrate: 'low' | 'medium' | 'high';
}

const BITRATE_MAP: Record<string, string> = {
  low: '1M',
  medium: '5M',
  high: '12M',
};

export async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpegLoaded && ffmpeg) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();
  ffmpeg.on('log', ({ message }) => {
    console.log('[FFmpeg]', message);
  });

  let lastError: unknown;
  for (const baseURL of FFMPEG_CDN_SOURCES) {
    try {
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      ffmpegLoaded = true;
      return ffmpeg;
    } catch (err) {
      lastError = err;
      console.warn(`ffmpeg-core load failed from ${baseURL}, trying next`, err);
    }
  }

  throw new Error(`All FFmpeg CDN sources failed: ${lastError}`);
}

export async function convertWebmToMp4(webmBlob: Blob, options: ExportOptions): Promise<Blob> {
  console.log('Starting MP4 conversion...', options);
  const ff = await loadFFmpeg();
  console.log('FFmpeg loaded, converting...');

  const webmData = await webmBlob.arrayBuffer();
  await ff.writeFile('input.webm', new Uint8Array(webmData));

  const args = [
    '-i', 'input.webm',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-b:v', BITRATE_MAP[options.bitrate],
    '-vf', `scale=${options.width}:${options.height}:flags=lanczos`,
    '-r', String(options.fps),
    '-pix_fmt', 'yuv420p',
    'output.mp4',
  ];
  await ff.exec(args);

  const mp4Data = await ff.readFile('output.mp4');
  console.log('Conversion complete, file size:', (mp4Data as Uint8Array).byteLength);

  await ff.deleteFile('input.webm');
  await ff.deleteFile('output.mp4');

  const blob = new Blob([mp4Data as unknown as BlobPart], { type: 'video/mp4' });
  return blob;
}
