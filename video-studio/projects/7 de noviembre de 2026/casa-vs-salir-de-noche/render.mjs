import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import {execFileSync, execSync} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
function findStudio(dir) {
  let curr = dir;
  while (curr !== path.dirname(curr)) {
    if (fsSync.existsSync(path.join(curr, 'remotion/package.json'))) return curr;
    curr = path.dirname(curr);
  }
  return path.resolve(dir, '../..');
}
const studio = findStudio(here);
const remotion = path.join(studio, 'remotion');
const require = createRequire(path.join(remotion, 'package.json'));
const {bundle} = require('@remotion/bundler');
const {selectComposition, renderMedia, renderStill} = require('@remotion/renderer');

const timeline = JSON.parse(await fs.readFile(path.join(here, process.argv.includes('--short') ? 'src/timeline-short.json' : 'timeline.json'), 'utf8'));
const renders = path.join(here, 'renders');
const stillsDir = path.join(renders, 'stills');
await fs.mkdir(stillsDir, {recursive: true});

const stills = process.argv.includes('--stills');
const draft = process.argv.includes('--draft');
const horizontal = process.argv.includes('--horizontal') || process.argv.includes('--aspect=horizontal');
const bothAspects = process.argv.includes('--both') || process.argv.includes('--aspect=both');
const baseId = 'casa-vs-salir-de-noche';
const short = process.argv.includes('--short');

console.log(`[Proyecto: ${baseId}] Compilando bundle Remotion autónomo...`);
const serveUrl = await bundle({
  entryPoint: path.join(here, 'src/index.tsx'),
  publicDir: path.join(here, 'public'),
  webpackOverride: (config) => {
    config.resolve.modules = [
      path.join(remotion, 'node_modules'),
      'node_modules'
    ];
    return config;
  }
});

const chromiumOptions = {gl: 'angle'};
// Navegador: REMOTION_BROWSER o el headless-shell preinstalado (entornos sin acceso a remotion.media)
const preinstalled = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = process.env.REMOTION_BROWSER || (fsSync.existsSync(preinstalled) ? preinstalled : null);

if (stills) {
  // --stills [--horizontal] [--only=id1,id2]: un fotograma por escena (al 67%) + hoja de contactos
  const id = short ? `${baseId}-short` : horizontal ? `${baseId}-16x9` : baseId;
  const tag = short ? 'short' : horizontal ? '16x9' : '9x16';
  const only = (process.argv.find(a => a.startsWith('--only=')) || '').slice(7).split(',').filter(Boolean);
  const composition = await selectComposition({serveUrl, id, chromiumOptions, browserExecutable});
  const dir = path.join(stillsDir, tag);
  await fs.mkdir(dir, {recursive: true});
  const list = timeline.scenes.filter(sc => !only.length || only.includes(sc.id));
  console.log(`Generando stills ${tag} para ${list.length} escenas...`);
  for (const scene of list) {
    const frame = scene.start + Math.floor(scene.frames * 0.67);
    const idx = String(timeline.scenes.indexOf(scene) + 1).padStart(2, '0');
    await renderStill({serveUrl, composition, output: path.join(dir, `${idx}-${scene.id}.png`), frame, imageFormat: 'png', scale: 1/3, chromiumOptions, browserExecutable});
    console.log(`  ✓ STILL ${idx} ${scene.id} @${(frame / 30).toFixed(2)}s`);
  }
  if (!only.length) {
    const contactSheet = path.join(renders, `contact-sheet-${tag}.jpg`);
    try {
      execSync(`ffmpeg -v error -y -pattern_type glob -i '${dir}/*.png' -vf 'scale=${horizontal ? 320 : 180}:-1,tile=8x8:padding=6:margin=6' -frames:v 1 -q:v 3 '${contactSheet}'`);
      console.log(`[OK] Hoja de contactos: ${contactSheet}`);
    } catch (err) { console.warn(`No se pudo generar la hoja de contactos: ${err.message}`); }
  }
} else {
  const targets = [];
  if (short) {
    targets.push({ id: `${baseId}-short`, name: draft ? 'short-bateria-social-720p.mp4' : 'short-bateria-social-1080p.mp4', label: 'Short 9:16' });
  } else if (bothAspects) {
    targets.push({ id: baseId, name: draft ? 'preview-720p.mp4' : 'master-1080p.mp4', label: '9:16 Vertical' });
    targets.push({ id: `${baseId}-16x9`, name: draft ? 'preview-16x9-720p.mp4' : 'master-16x9-1080p.mp4', label: '16:9 Horizontal' });
  } else if (horizontal) {
    targets.push({ id: `${baseId}-16x9`, name: draft ? 'preview-16x9-720p.mp4' : 'master-16x9-1080p.mp4', label: '16:9 Horizontal' });
  } else {
    targets.push({ id: baseId, name: draft ? 'preview-720p.mp4' : 'master-1080p.mp4', label: '9:16 Vertical' });
  }

  for (const target of targets) {
    console.log(`\nRenderizando ${target.name} [${target.label}] (${draft ? '720p Borrador' : '1080p Master'})...`);
    const composition = await selectComposition({serveUrl, id: target.id, chromiumOptions, browserExecutable});
    const final = path.join(renders, target.name);
    const partial = path.join(renders, `partial-${target.name}`);
    let progress = -1;

    await renderMedia({
      serveUrl, composition, outputLocation: partial, codec: 'h264', crf: draft ? 23 : 17,
      pixelFormat: 'yuv420p', audioCodec: 'aac', audioBitrate: '192k',
      scale: draft ? 2/3 : 1, concurrency: 4, chromiumOptions, browserExecutable,
      onProgress: ({progress: p}) => {
        const n = Math.floor(p * 20) * 5;
        if (n !== progress) { progress = n; console.log(`RENDER [${target.label}] ${n}%`); }
      }
    });

    const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', partial], {encoding: 'utf8'}));
    // Masterización EBU R128: -18.5 LUFS integrados, true peak < -1.5 dBFS (video copiado sin recomprimir)
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', partial, '-c:v', 'copy', '-af', 'loudnorm=I=-18.5:TP=-1.5:LRA=9', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final]);
    await fs.rm(partial);
    console.log(`[ÉXITO] Video guardado en: ${final}`);
    console.log(`Duración: ${probe.format.duration}s | Tamaño: ${(Number(probe.format.size) / 1024 / 1024).toFixed(1)} MB | Resolución: ${probe.streams[0].width}x${probe.streams[0].height}`);
  }
}
