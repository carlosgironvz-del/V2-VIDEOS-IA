import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Sequence, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import timelineData from './timeline.json';
import {ArtDefs, Backdrop, Label, back, clamp, ease, mix, wave} from './art';
import {Graphic} from './scenes';

export const timeline = timelineData;
type Word = {word: string; start: number; end: number};
type Scene = {id: string; act: string; chapter: string; palette: string; art: string; text: string; kicker?: string; items?: string[]; sfx?: string; start: number; frames: number; words: Word[]; audio: string};
const scenes = timeline.scenes as unknown as Scene[];
const asset = (file: string) => staticFile(file.split('/').pop() || file);
const CHANNEL = 'CIENCIA EN PANTUFLAS';

/* ── Ducking: la música baja a 0.18 mientras se habla y sube a 0.34 en silencios, intro y cierre ── */
const speaking = new Uint8Array(timeline.durationInFrames + 1);
for (const s of scenes) for (const w of s.words) {
  const a = Math.max(0, Math.floor(s.start + w.start * 30) - 4), b = Math.min(timeline.durationInFrames, Math.ceil(s.start + w.end * 30) + 6);
  for (let i = a; i < b; i++) speaking[i] = 1;
}
const duckCurve = new Float32Array(timeline.durationInFrames + 1);
{ let v = .34; for (let i = 0; i <= timeline.durationInFrames; i++) { const target = speaking[i] ? .18 : .34; v += (target - v) * (target < v ? .25 : .06); duckCurve[i] = v; } }
const outroStart = scenes[scenes.length - 1].start;

function Captions({scene, f, horizontal}: {scene: Scene; f: number; horizontal: boolean}) {
  const t = f / 30, words = scene.words || [];
  if (!words.length) return null;
  let ai = words.findIndex(w => t >= w.start && t < w.end);
  if (ai < 0) ai = Math.max(0, words.findIndex(w => w.start > t) - 1);
  if (t >= words[words.length - 1].end) ai = words.length - 1;
  const maxW = horizontal ? 7 : 5, maxC = horizontal ? 44 : 30;
  const groups: Word[][] = [];
  for (const w of words) { const g = groups[groups.length - 1]; if (!g || g.length >= maxW || g.map(x => x.word).join(' ').length + w.word.length > maxC) groups.push([w]); else g.push(w); }
  const active = words[ai], group = groups.find(g => g.includes(active)) || groups[0], pop = ease((t - group[0].start) * 12);
  const box: React.CSSProperties = horizontal
    ? {left: 120, top: 612, width: 1040, fontSize: 33}
    : {left: 48, top: 150, width: 624, fontSize: 35};
  return <div style={{position: 'absolute', ...box, textAlign: 'center', lineHeight: 1.3, fontWeight: 760, letterSpacing: -.5, transform: `translateY(${mix(7, 0, pop)}px)`, color: '#fff8ee', textShadow: '0 3px 17px rgba(9,8,20,.75)'}}>
    {group.map((w, i) => <span key={`${w.start}-${i}`} style={{display: 'inline-block', padding: '2px 6px', borderRadius: 6, background: w === active ? 'rgba(26,19,43,.72)' : 'transparent', color: w === active ? '#ffe087' : '#fff8ee', opacity: t >= w.start ? 1 : .52}}>{w.word} </span>)}
  </div>;
}

function wrap(text: string, max: number) {
  const out: string[] = [];
  for (const w of text.split(' ')) { const l = out[out.length - 1]; if (l !== undefined && (l + ' ' + w).length <= max) out[out.length - 1] = l + ' ' + w; else out.push(w); }
  return out;
}

function Kicker({text, f, x, y, max, size}: {text: string; f: number; x: number; y: number; max: number; size: number}) {
  const p = back((f - 12) / 16);
  if (p <= 0) return null;
  const lines = wrap(text, max), w = Math.max(...lines.map(l => l.length)) * size * .64 + 56, h = lines.length * size * 1.15 + 30;
  return <g transform={`translate(${x} ${y + wave(f, .07, 4)}) rotate(${-3 + wave(f, .05, 1.5)}) scale(${p})`} filter="url(#shadow)">
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="18" fill="#fff4d8" stroke="#2a1b45" strokeWidth="5"/>
    <rect x={-w / 2 + 8} y={h / 2 - 12} width={w - 16} height="6" rx="3" fill="#ffd36b" opacity=".9"/>
    {lines.map((l, i) => <text key={i} x="0" y={-h / 2 + 15 + size * .92 + i * size * 1.15} textAnchor="middle" fontSize={size} fontWeight="900" fill="#2a1b45" letterSpacing="1">{l}</text>)}
  </g>;
}

function Shot({scene, index, horizontal}: {scene: Scene; index: number; horizontal: boolean}) {
  const f = useCurrentFrame();
  const W = horizontal ? 1280 : 720, H = horizontal ? 720 : 1280;
  const prev = scenes[index - 1], actChange = !prev || prev.act !== scene.act;
  // entrada: empujón con rebote desde un lado alterno + cámara continua (push-in y paneo suave)
  const dir = index % 2 ? 1 : -1, enter = back(f / 16), push = 1 + ease(f / scene.frames) * .045;
  const pan = wave(f, .012, 6) + (1 - clamp(f / 16)) * 60 * dir;
  const cx = horizontal ? 640 : 360, cy = horizontal ? 352 : 800, s = horizontal ? .74 : 1;
  const artT = `translate(${cx + pan} ${cy + wave(f, .014, 5)}) scale(${s * push * mix(.9, 1, enter)}) translate(-360 -800)`;
  const progress = clamp((scene.start + f) / timeline.durationInFrames);
  const flash = actChange ? 1 - clamp(f / 9) : 0;
  return <AbsoluteFill>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <ArtDefs/><Backdrop palette={scene.palette} f={f + scene.start} w={W} h={H}/>
      <g transform={artT} opacity={clamp(f / 6)}><Graphic kind={scene.art} f={f} d={scene.frames} items={scene.items}/></g>
      {horizontal
        ? <Label x={640} y={86} text={scene.chapter} size={22}/>
        : <Label x={360} y={466} text={scene.chapter} size={19}/>}
      {scene.kicker && (horizontal
        ? <Kicker text={scene.kicker} f={f} x={1095} y={330} max={11} size={32}/>
        : <Kicker text={scene.kicker} f={f} x={360} y={1166} max={24} size={34}/>)}
      <g fill="#fff0d1" opacity=".72" fontSize={horizontal ? 15 : 15} fontWeight="800" letterSpacing="2.1">
        <text x={horizontal ? 44 : 48} y={horizontal ? 42 : 74}>{CHANNEL}</text>
        <text x={horizontal ? 1236 : 672} y={horizontal ? 42 : 74} textAnchor="end">{scene.act.toUpperCase()} · {String(index + 1).padStart(2, '0')}/{scenes.length}</text>
      </g>
      {horizontal
        ? <><path d="M44 704H1236" stroke="#fff" strokeWidth="2" opacity=".18"/><path d={`M44 704H${44 + 1192 * progress}`} stroke="#ffe38a" strokeWidth="3" opacity=".8"/></>
        : <><path d="M48 1214H672" stroke="#fff" strokeWidth="2" opacity=".18"/><path d={`M48 1214H${48 + 624 * progress}`} stroke="#ffe38a" strokeWidth="3" opacity=".8"/></>}
      {flash > 0 && <rect width={W} height={H} fill="#fff4d8" opacity={flash * .55}/>}
    </svg>
    <Captions scene={scene} f={f} horizontal={horizontal}/>
  </AbsoluteFill>;
}

export const CasaFilm: React.FC<{aspectRatio?: '9:16' | '16:9'}> = ({aspectRatio = '9:16'}) => {
  const horizontal = aspectRatio === '16:9', [handle] = useState(() => delayRender('Cargando tipografía'));
  useEffect(() => { const font = new FontFace('StudioSans', `url(${asset('UbuntuSans.ttf')})`, {weight: '100 900'}); font.load().then(l => { document.fonts.add(l); continueRender(handle); }).catch(cancelRender); }, [handle]);
  const W = horizontal ? 1280 : 720, H = horizontal ? 720 : 1280;
  return <AbsoluteFill style={{background: '#100c1e', fontFamily: 'StudioSans, sans-serif'}}>
    <div style={{position: 'absolute', width: W, height: H, transform: 'scale(1.5)', transformOrigin: 'top left'}}>
      {scenes.map((scene, i) => <Sequence key={scene.id} from={scene.start} durationInFrames={scene.frames}>
        <Shot scene={scene} index={i} horizontal={horizontal}/>
        <Audio src={asset(scene.audio)} volume={1}/>
        {scene.sfx && (scene.sfx === 'laugh'
          ? <Sequence from={Math.max(0, Math.round(scene.words[scene.words.length - 1].end * 30) - 8)}><Audio src={asset('sfx_laugh.mp3')} volume={.14}/></Sequence>
          : <Audio src={asset(`sfx_${scene.sfx}.mp3`)} volume={scene.sfx === 'whoosh' ? .2 : .22}/>)}
      </Sequence>)}
    </div>
    <Audio src={asset('score.wav')} volume={(fr) => fr >= outroStart + 10 ? .36 : duckCurve[Math.min(fr, duckCurve.length - 1)]}/>
  </AbsoluteFill>;
};
