// Renderiza las fotos de perfil de "Literal Yo" (PNG 1080×1080) y una vista previa con recorte circular.
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
let studio = here; while (!fs.existsSync(path.join(studio, 'remotion/package.json'))) studio = path.dirname(studio);
const remotion = path.join(studio, 'remotion');
const require = createRequire(path.join(remotion, 'package.json'));
const {bundle} = require('@remotion/bundler');
const {selectComposition, renderStill} = require('@remotion/renderer');
const pre = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const browserExecutable = process.env.REMOTION_BROWSER || (fs.existsSync(pre) ? pre : null);
const out = path.join(here, 'renders'); fs.mkdirSync(out, {recursive: true});

const serveUrl = await bundle({entryPoint: path.join(here, 'src/index.tsx'), publicDir: path.join(here, 'public'),
  webpackOverride: (c) => { c.resolve.modules = [path.join(remotion, 'node_modules'), 'node_modules']; return c; }});
for (const id of ['perfil-logo', 'perfil-personaje']) {
  const composition = await selectComposition({serveUrl, id, browserExecutable});
  const file = path.join(out, `${id}.png`);
  await renderStill({serveUrl, composition, output: file, frame: 20, imageFormat: 'png', browserExecutable});
  // vista previa de cómo se verá recortada en círculo
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', file, '-vf', "format=rgba,geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(lte(hypot(X-540,Y-540),540),255,0)',scale=360:360", path.join(out, `${id}-circulo.png`)]);
  console.log(`✓ ${file}`);
}
