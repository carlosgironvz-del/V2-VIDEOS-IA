import React from 'react';

/* ───────────── Utilidades deterministas (mismo motor que el video de la cafeína) ───────────── */
export const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
export const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const wave = (f: number, speed = .06, amount = 1, phase = 0) => Math.sin(f * speed + phase) * amount;
export const seeded = (n: number) => { const a = Math.sin(n * 127.1 + 311.7) * 43758.5453; return a - Math.floor(a); };
/** easeOutBack: entrada con rebote (anticipación + overshoot). */
export const back = (n: number) => { const t = clamp(n), c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
export const popAt = (f: number, at: number, dur = 14) => back((f - at) / dur);
type Point = {x: number; y: number};

export function joint(a: Point, b: Point, l1: number, l2: number, bend: number): Point {
  const dx = b.x - a.x, dy = b.y - a.y, d = clamp(Math.hypot(dx, dy), 1, l1 + l2 - .01);
  const angle = Math.atan2(dy, dx) + bend * Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  return {x: a.x + Math.cos(angle) * l1, y: a.y + Math.sin(angle) * l1};
}

/** Aparece con rebote alrededor de (x,y). */
export const Pop: React.FC<{f: number; at?: number; x: number; y: number; dur?: number; children?: React.ReactNode}> = ({f, at = 0, x, y, dur = 14, children}) => {
  const p = popAt(f, at, dur);
  if (p <= 0.001) return null;
  return <g transform={`translate(${x} ${y}) scale(${p}) translate(${-x} ${-y})`} opacity={clamp(p * 2)}>{children}</g>;
};

export const T: React.FC<{x: number; y: number; size?: number; fill?: string; weight?: number; anchor?: 'start' | 'middle' | 'end'; ls?: number; children?: React.ReactNode; stroke?: boolean; opacity?: number}> =
  ({x, y, size = 24, fill = '#fff4d8', weight = 800, anchor = 'middle', ls = 1, children, stroke = true, opacity = 1}) =>
    <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} fontWeight={weight} letterSpacing={ls} opacity={opacity}
      style={stroke ? {paintOrder: 'stroke', stroke: 'rgba(20,14,34,.55)', strokeWidth: size * .22, strokeLinejoin: 'round'} : undefined}>{children}</text>;

/* ───────────── Definiciones de degradados y filtros ───────────── */
export const ArtDefs = () => <defs>
  <radialGradient id="bg-purple" cx="48%" cy="30%" r="78%"><stop stopColor="#6641a4"/><stop offset=".52" stopColor="#302052"/><stop offset="1" stopColor="#100d25"/></radialGradient>
  <radialGradient id="bg-teal" cx="50%" cy="35%" r="80%"><stop stopColor="#34b7ad"/><stop offset=".5" stopColor="#14566b"/><stop offset="1" stopColor="#10253e"/></radialGradient>
  <radialGradient id="bg-gold" cx="48%" cy="35%" r="75%"><stop stopColor="#fff2a3"/><stop offset=".46" stopColor="#d99439"/><stop offset="1" stopColor="#592c48"/></radialGradient>
  <radialGradient id="bg-crimson" cx="50%" cy="35%" r="80%"><stop stopColor="#d65d70"/><stop offset=".48" stopColor="#702b50"/><stop offset="1" stopColor="#241b37"/></radialGradient>
  <radialGradient id="bg-night" cx="50%" cy="30%" r="80%"><stop stopColor="#3b4f9e"/><stop offset=".5" stopColor="#1a2356"/><stop offset="1" stopColor="#080b1f"/></radialGradient>
  <radialGradient id="bg-cozy" cx="50%" cy="36%" r="78%"><stop stopColor="#ffd894"/><stop offset=".45" stopColor="#d07a43"/><stop offset="1" stopColor="#3f1d33"/></radialGradient>
  <radialGradient id="bg-neon" cx="50%" cy="32%" r="80%"><stop stopColor="#ff5cbf"/><stop offset=".48" stopColor="#5b2194"/><stop offset="1" stopColor="#130a2c"/></radialGradient>
  <radialGradient id="bg-brand" cx="50%" cy="38%" r="80%"><stop stopColor="#6b4c8f"/><stop offset=".5" stopColor="#2f2152"/><stop offset="1" stopColor="#120c22"/></radialGradient>
  <linearGradient id="skin" x2="1" y2="1"><stop stopColor="#f6c18e"/><stop offset=".56" stopColor="#d78e65"/><stop offset="1" stopColor="#a95e55"/></linearGradient>
  <linearGradient id="hair" x2=".8" y2="1"><stop stopColor="#5a3a40"/><stop offset=".52" stopColor="#2d1f33"/><stop offset="1" stopColor="#121629"/></linearGradient>
  <linearGradient id="coat" x2="1" y2="1"><stop stopColor="#c6f6e8"/><stop offset=".48" stopColor="#67bbaa"/><stop offset="1" stopColor="#31677c"/></linearGradient>
  <linearGradient id="gold" x2=".8" y2="1"><stop stopColor="#fff1ae"/><stop offset=".45" stopColor="#ffc459"/><stop offset="1" stopColor="#e56e55"/></linearGradient>
  <linearGradient id="pajama" x2="1" y2="1"><stop stopColor="#c9d4ff"/><stop offset=".5" stopColor="#8796e8"/><stop offset="1" stopColor="#4b4fa6"/></linearGradient>
  <linearGradient id="party" x2="1" y2="1"><stop stopColor="#ff9ad5"/><stop offset=".5" stopColor="#e2408f"/><stop offset="1" stopColor="#7b1f6a"/></linearGradient>
  <linearGradient id="pants" x2="1" y2="1"><stop stopColor="#7a86d8"/><stop offset="1" stopColor="#363a86"/></linearGradient>
  <linearGradient id="sofa" x2=".4" y2="1"><stop stopColor="#ef8a6e"/><stop offset=".55" stopColor="#c04f55"/><stop offset="1" stopColor="#7d2d48"/></linearGradient>
  <linearGradient id="blanket" x2="1" y2="1"><stop stopColor="#a8f0d8"/><stop offset=".5" stopColor="#4fb39c"/><stop offset="1" stopColor="#25706f"/></linearGradient>
  <linearGradient id="screen" x2=".6" y2="1"><stop stopColor="#8ff6ff"/><stop offset=".55" stopColor="#3f7de0"/><stop offset="1" stopColor="#2a2f8f"/></linearGradient>
  <linearGradient id="device" x2="1" y2="1"><stop stopColor="#3e3757"/><stop offset="1" stopColor="#15121f"/></linearGradient>
  <linearGradient id="lemon" x2="1" y2="1"><stop stopColor="#fff9a8"/><stop offset=".5" stopColor="#ffe03d"/><stop offset="1" stopColor="#e3a612"/></linearGradient>
  <linearGradient id="green" x2="0" y2="1"><stop stopColor="#d7ff8f"/><stop offset="1" stopColor="#3fbf6a"/></linearGradient>
  <linearGradient id="red" x2="0" y2="1"><stop stopColor="#ffb0a0"/><stop offset="1" stopColor="#e2364f"/></linearGradient>
  <linearGradient id="wood" x2="1" y2="1"><stop stopColor="#d9a06a"/><stop offset="1" stopColor="#8a5434"/></linearGradient>
  <linearGradient id="cream" x2="1" y2="1"><stop stopColor="#fffaf0"/><stop offset="1" stopColor="#e9d6bd"/></linearGradient>
  <linearGradient id="slipper" x2="1" y2="1"><stop stopColor="#ffd0e4"/><stop offset="1" stopColor="#e889b3"/></linearGradient>
  <radialGradient id="iris" cx="40%" cy="35%"><stop stopColor="#a3734b"/><stop offset=".7" stopColor="#5a3423"/><stop offset="1" stopColor="#2c1812"/></radialGradient>
  <radialGradient id="glow"><stop stopColor="#b1fff4" stopOpacity=".62"/><stop offset="1" stopColor="#55e4d0" stopOpacity="0"/></radialGradient>
  <radialGradient id="warmglow"><stop stopColor="#ffe9a8" stopOpacity=".85"/><stop offset="1" stopColor="#ffb257" stopOpacity="0"/></radialGradient>
  <radialGradient id="pinkglow"><stop stopColor="#ffb3e6" stopOpacity=".85"/><stop offset="1" stopColor="#ff4fb4" stopOpacity="0"/></radialGradient>
  <radialGradient id="moon" cx="40%" cy="35%"><stop stopColor="#fffbe8"/><stop offset=".7" stopColor="#f2e3b0"/><stop offset="1" stopColor="#c9b27c"/></radialGradient>
  <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="12"/><feOffset dy="12"/><feComponentTransfer><feFuncA type="linear" slope=".42"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="blur6"><feGaussianBlur stdDeviation="6"/></filter>
  <pattern id="grain" width="90" height="90" patternUnits="userSpaceOnUse"><circle cx="9" cy="18" r="1" fill="#fff" opacity=".12"/><circle cx="61" cy="47" r=".8" fill="#fff" opacity=".1"/><circle cx="35" cy="78" r=".7" fill="#fff" opacity=".08"/></pattern>
  <pattern id="stripes" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(8)"><rect width="22" height="22" fill="url(#pajama)"/><rect width="7" height="22" fill="#eef2ff" opacity=".38"/></pattern>
</defs>;

/* ───────────── Fondo vivo (grano + partículas + halo) — ancho/alto variables para 9:16 y 16:9 ───────────── */
export function Backdrop({palette, f, w = 720, h = 1280}: {palette: string; f: number; w?: number; h?: number}) {
  const n = w > h ? 34 : 24;
  return <g>
    <rect width={w} height={h} fill={`url(#bg-${palette})`}/>
    <ellipse cx={w / 2 + wave(f, .012, 25)} cy={h * .4} rx={w * .45} ry={h * .22} fill="url(#glow)" opacity=".32"/>
    <rect width={w} height={h} fill="url(#grain)"/>
    {Array.from({length: n}, (_, i) => <circle key={i} cx={seeded(i) * w + wave(f, .01, 8, i)} cy={(seeded(i + 38) * h - f * (.18 + i % 4 * .08) + h * 4) % h} r={1 + seeded(i + 72) * 2.5} fill="#fff3d1" opacity={.12 + seeded(i + 8) * .3}/>)}
  </g>;
}

export function Label({x, y, text, color = '#fff4d8', size = 20}: {x: number; y: number; text: string; color?: string; size?: number}) {
  return <text x={x} y={y} textAnchor="middle" fill={color} fontSize={size} fontWeight="800" letterSpacing="2.5" style={{paintOrder: 'stroke', stroke: 'rgba(24,18,38,.5)', strokeWidth: 5}}>{text}</text>;
}

/* ───────────── Personaje recurrente: "Pantu", en pijama y pantuflas ───────────── */
export type Mood = 'calm' | 'happy' | 'tired' | 'worry' | 'shock' | 'yawn' | 'proud' | 'blissful';
export type Pose = 'rest' | 'wave' | 'phone' | 'shrug' | 'cheer' | 'dance' | 'point' | 'mug';

function Hand({x, y, angle, s = 1, open = true}: {x: number; y: number; angle: number; s?: number; open?: boolean}) {
  const deg = angle * 180 / Math.PI;
  return <g transform={`translate(${x} ${y}) rotate(${deg}) scale(${s})`}>
    {open ? [-12, -4, 4, 12].map((o, i) => <path key={i} d={`M6 ${o * .9}L${26 - Math.abs(o) * .5} ${o * 1.25}`} stroke="url(#skin)" strokeWidth="8" strokeLinecap="round"/>)
      : <path d="M8 -8L22 -6M8 0L24 0M8 8L21 6" stroke="#d58f69" strokeWidth="8" strokeLinecap="round"/>}
    <path d="M2 -12Q-6 -22 -2 -28" stroke="url(#skin)" strokeWidth="8" strokeLinecap="round" fill="none"/>
    <ellipse cx="4" cy="0" rx="15" ry="14" fill="url(#skin)" stroke="#f5c19c" strokeWidth="2"/>
  </g>;
}

function Arm({sh, hand, bend, sleeve, f}: {sh: Point; hand: Point; bend: number; sleeve: string; f: number}) {
  const el = joint(sh, hand, 88, 84, bend);
  const ang = Math.atan2(hand.y - el.y, hand.x - el.x);
  return <g>
    <path d={`M${sh.x} ${sh.y}L${el.x} ${el.y}`} stroke={sleeve} strokeWidth="32" strokeLinecap="round"/>
    <path d={`M${el.x} ${el.y}L${hand.x} ${hand.y}`} stroke={sleeve} strokeWidth="28" strokeLinecap="round"/>
    <path d={`M${mix(el.x, hand.x, .78)} ${mix(el.y, hand.y, .78)}L${hand.x} ${hand.y}`} stroke="url(#skin)" strokeWidth="20" strokeLinecap="round"/>
    <path d={`M${mix(el.x, hand.x, .7) - 2} ${mix(el.y, hand.y, .7)}l4 4`} stroke="#eef2ff" strokeWidth="6" strokeLinecap="round" opacity=".7"/>
    <Hand x={hand.x} y={hand.y} angle={ang} open={wave(f, .03) > -2}/>
  </g>;
}

export function Character({f, mood = 'calm', pose = 'rest', outfit = 'pajama', talk = false, cap = true, glasses = false, gray = false}:
  {f: number; mood?: Mood; pose?: Pose; outfit?: 'pajama' | 'party'; talk?: boolean; cap?: boolean; glasses?: boolean; gray?: boolean}) {
  const blink = (f % 137 < 4) || (f % 193 >= 99 && f % 193 < 102);
  const breathe = wave(f, .075, 4), sway = wave(f, .035, 4);
  const dance = pose === 'dance' ? wave(f, .28, 14) : 0;
  const shrugUp = pose === 'shrug' ? -14 - wave(f, .1, 3) : 0;
  const shirt = outfit === 'party' ? 'url(#party)' : 'url(#stripes)';
  const sleeve = outfit === 'party' ? '#d23d86' : '#8f9cec';
  const shL = {x: 298, y: 808 + breathe + shrugUp}, shR = {x: 422, y: 808 + breathe + shrugUp};
  const targets: Record<Pose, [Point, Point, number, number]> = {
    rest: [{x: 268 + wave(f, .04, 4), y: 955}, {x: 452 + wave(f, .04, 4, 1), y: 955}, -1, 1],
    wave: [{x: 268, y: 955}, {x: 520 + wave(f, .22, 26), y: 640 + wave(f, .22, 8, 1)}, -1, -1],
    phone: [{x: 268, y: 955}, {x: 410, y: 760 + wave(f, .05, 4)}, -1, 1],
    shrug: [{x: 190 + wave(f, .1, 4), y: 790}, {x: 530 - wave(f, .1, 4), y: 790}, 1, -1],
    cheer: [{x: 220 + wave(f, .3, 14), y: 590 + wave(f, .3, 12)}, {x: 500 - wave(f, .3, 14, 1), y: 590 + wave(f, .3, 12, 1)}, 1, -1],
    dance: [{x: 215, y: 640 + wave(f, .28, 40)}, {x: 505, y: 640 - wave(f, .28, 40)}, 1, -1],
    point: [{x: 268, y: 955}, {x: 545, y: 720 + wave(f, .06, 6)}, -1, -1],
    mug: [{x: 268, y: 955}, {x: 400, y: 800 + wave(f, .05, 3)}, -1, 1],
  };
  const [hL, hR, bL, bR] = targets[pose];
  const lid = blink ? 1 : mood === 'tired' ? .55 + wave(f, .05, .08) : mood === 'blissful' ? .8 : mood === 'yawn' ? .7 : mood === 'shock' ? -.15 : .12;
  const mouthOpen = talk ? clamp(.35 + wave(f, .55, .4) + wave(f, .9, .25)) : 0;
  // [inclinación (+ = interior arriba, preocupado), curvatura, elevación]
  const brow = {calm: [0, 0, 0], happy: [4, 6, -3], tired: [7, -4, 4], worry: [13, -8, 0], shock: [5, 6, -12], yawn: [5, -4, 2], proud: [-5, 8, -2], blissful: [4, 5, -2]}[mood];
  const capSwing = wave(f, .07, 9) + sway * 2 + dance * .6;
  return <g transform={`translate(${sway + dance * .3} 0) rotate(${dance * .12} 360 1040)`}>
    <ellipse cx="360" cy="1052" rx="150" ry="26" fill="#0d0b20" opacity=".42" filter="url(#soft)"/>
    {/* piernas y pantuflas */}
    <path d={`M284 958L296 1030L354 1030L360 990L366 1030L424 1030L436 958Z`} fill="url(#pants)" stroke="#a5b0ff" strokeWidth="3"/>
    {[322, 398].map((x, i) => <g key={x} transform={`translate(${x} ${1036 + (pose === 'dance' ? Math.max(0, wave(f, .28, 10, i * Math.PI)) * -1 : 0)})`}>
      <ellipse cx={i ? 8 : -8} cy="8" rx="48" ry="18" fill="url(#slipper)" stroke="#fff0f7" strokeWidth="3"/>
      <ellipse cx={i ? 2 : -2} cy="-4" rx="30" ry="12" fill="#fff5fa"/>
      {Array.from({length: 6}, (_, k) => <circle key={k} cx={(i ? 2 : -2) - 24 + k * 9.5} cy={-6 + wave(f, .1, 1.2, k)} r="5" fill="#ffffff" opacity=".9"/>)}
      <circle cx={i ? 40 : -40} cy="0" r="7" fill="#ff9cc5"/>
    </g>)}
    {/* torso */}
    <path d={`M288 ${812 + breathe + shrugUp * .4}Q300 ${778 + breathe} 360 ${776 + breathe}Q420 ${778 + breathe} 432 ${812 + breathe + shrugUp * .4}L448 966Q360 990 272 966Z`} fill={shirt} stroke={outfit === 'party' ? '#ffc4e6' : '#dfe5ff'} strokeWidth="5" filter="url(#shadow)"/>
    {outfit === 'pajama' ? <>
      <path d={`M330 ${784 + breathe}L360 ${826 + breathe}L390 ${784 + breathe}`} fill="none" stroke="#eef2ff" strokeWidth="9" strokeLinejoin="round"/>
      {[850, 892, 934].map(y => <circle key={y} cx="360" cy={y + breathe * .5} r="5" fill="#fff6d6" stroke="#5a5fb0" strokeWidth="2"/>)}
      <path d="M388 880h34v28q-17 8-34 0Z" fill="#aab5ff" stroke="#eef2ff" strokeWidth="3"/>
    </> : <>
      <path d={`M336 ${784 + breathe}L360 ${846 + breathe}L384 ${784 + breathe}`} fill="#2a1438"/>
      {Array.from({length: 7}, (_, i) => <circle key={i} cx={300 + seeded(i + 3) * 120} cy={840 + seeded(i + 9) * 110} r="3" fill="#fff2a8" opacity={.5 + wave(f, .3, .5, i)}/>)}
    </>}
    <Arm sh={shL} hand={hL} bend={bL} sleeve={sleeve} f={f}/>
    <Arm sh={shR} hand={hR} bend={bR} sleeve={sleeve} f={f}/>
    {pose === 'phone' && <g transform={`translate(${hR.x - 10} ${hR.y - 62}) rotate(-8)`}><rect width="44" height="78" rx="9" fill="url(#device)" stroke="#9aa3d9" strokeWidth="3"/><rect x="5" y="8" width="34" height="58" rx="4" fill="url(#screen)" opacity={.75 + wave(f, .2, .2)}/></g>}
    {pose === 'mug' && <g transform={`translate(${hR.x - 34} ${hR.y - 52})`}><path d="M0 0h46l-5 52q-18 8-36 0Z" fill="url(#cream)" stroke="#fff" strokeWidth="3"/><path d="M45 12q18 0 14 18q-3 12-16 10" fill="none" stroke="#f3e5d0" strokeWidth="7"/>{[10, 26].map((x, i) => <path key={x} d={`M${x} -8q${-8 + wave(f, .05, 5, i)} -16 0 -32`} stroke="#fff" strokeWidth="5" fill="none" opacity=".5" strokeLinecap="round"/>)}</g>}
    {/* cuello y cabeza */}
    <path d="M342 748L340 790Q360 806 380 790L378 748Z" fill="url(#skin)"/>
    <g transform={`rotate(${wave(f, .03, 2.5) + (pose === 'shrug' ? 6 : 0)} 360 760)`}>
      <ellipse cx="278" cy="680" rx="15" ry="22" fill="url(#skin)"/><ellipse cx="442" cy="680" rx="15" ry="22" fill="url(#skin)"/>
      <ellipse cx="360" cy="668" rx="86" ry="102" fill="url(#skin)" stroke="#ffe0bb" strokeWidth="5" filter="url(#shadow)"/>
      <ellipse cx="360" cy="752" rx="54" ry="10" fill="#b8684f" opacity=".25"/>
      {/* cabello */}
      <path d="M276 650Q262 560 340 548Q372 520 404 548Q462 560 446 652Q436 606 410 592Q372 616 300 600Q284 618 276 650Z" fill={gray ? '#c9c4d6' : 'url(#hair)'} stroke={gray ? '#efeaf7' : '#76515b'} strokeWidth="4"/>
      <path d={`M300 600Q318 ${582 + wave(f, .05, 3)} 344 590`} stroke={gray ? '#fff' : '#7d5560'} strokeWidth="5" fill="none" strokeLinecap="round" opacity=".7"/>
      {/* ojos */}
      {[328, 392].map((x, i) => <g key={x}>
        <ellipse cx={x} cy="672" rx="17" ry="19" fill="#fffaf2"/>
        <circle cx={x + 2} cy="675" r="10.5" fill="url(#iris)"/><circle cx={x + 2} cy="675" r="5" fill="#140c10"/>
        <circle cx={x + 6} cy="670" r="3.2" fill="#fff"/><circle cx={x - 2} cy="680" r="1.5" fill="#fff" opacity=".8"/>
        {lid > 0 && <path d={`M${x - 20} 650L${x + 20} 650L${x + 20} ${652 + lid * 40}Q${x} ${658 + lid * 42} ${x - 20} ${652 + lid * 40}Z`} fill="#e9a77c"/>}
        <path d={`M${x - 18} ${653 + Math.max(0, lid) * 40}Q${x} ${659 + Math.max(0, lid) * 42} ${x + 18} ${653 + Math.max(0, lid) * 40}`} stroke="#5d3637" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d={`M${x - 18} ${640 - brow[1] * (i ? -.3 : .3) + brow[0] * .3}Q${x} ${630 - brow[1] * .4} ${x + 18} ${640 + brow[1] * (i ? .3 : -.3) * 1 + brow[0] * .3}`} transform={`translate(0 ${brow[2]}) rotate(${(i ? 1 : -1) * brow[0]} ${x} 636)`} stroke={gray ? '#d8d2e2' : '#3a2530'} strokeWidth="7" fill="none" strokeLinecap="round"/>
      </g>)}
      {glasses && <g fill="none" stroke="#2f2440" strokeWidth="5"><circle cx="328" cy="674" r="24"/><circle cx="392" cy="674" r="24"/><path d="M352 672q8-6 16 0"/></g>}
      {/* nariz y mejillas */}
      <path d="M358 684Q352 704 362 708Q370 708 372 702" fill="none" stroke="#b86a54" strokeWidth="4" strokeLinecap="round"/>
      <circle cx="302" cy="706" r="14" fill="#ef887b" opacity=".3"/><circle cx="418" cy="706" r="14" fill="#ef887b" opacity=".3"/>
      {/* boca */}
      <Mouth mood={mood} open={mouthOpen} f={f}/>
      {/* gorro de dormir con pompón (follow-through) */}
      {cap && outfit === 'pajama' && <g>
        <path d={`M272 618Q300 520 380 518Q${452 + capSwing} 528 ${488 + capSwing * 1.6} ${612 + capSwing * .4}Q430 560 448 616Q360 590 272 618Z`} fill="url(#stripes)" stroke="#e7ebff" strokeWidth="4"/>
        <path d="M268 622Q360 588 452 622L448 600Q360 572 272 600Z" fill="#fff7fb" stroke="#e0d9f0" strokeWidth="3"/>
        <circle cx={492 + capSwing * 1.6} cy={622 + capSwing * .4} r="19" fill="#fff9fc" stroke="#e8def5" strokeWidth="3"/>
      </g>}
    </g>
  </g>;
}

function Mouth({mood, open, f}: {mood: Mood; open: number; f: number}) {
  const y = 728;
  if (mood === 'yawn') {const o = 22 + wave(f, .08, 6); return <g><ellipse cx="360" cy={y + 4} rx="24" ry={o} fill="#4a1a2a" stroke="#8a4655" strokeWidth="4"/><ellipse cx="360" cy={y + o - 6} rx="14" ry="8" fill="#e5707e"/></g>;}
  if (mood === 'shock') return <g><ellipse cx="360" cy={y + 2} rx="15" ry={18 + open * 4} fill="#4a1a2a" stroke="#8a4655" strokeWidth="4"/><ellipse cx="360" cy={y + 12} rx="9" ry="5" fill="#e5707e"/></g>;
  if (open > .05) {
    const h = 6 + open * 18;
    return <g><path d={`M336 ${y - 4}Q360 ${y - 8} 384 ${y - 4}Q380 ${y + h} 360 ${y + h + 2}Q340 ${y + h} 336 ${y - 4}Z`} fill="#4a1a2a" stroke="#8a4655" strokeWidth="4" strokeLinejoin="round"/>
      <path d={`M340 ${y - 3}H380`} stroke="#fff" strokeWidth="4" opacity=".9"/><ellipse cx="360" cy={y + h - 2} rx="11" ry={2 + open * 3} fill="#e5707e"/></g>;
  }
  if (mood === 'happy' || mood === 'proud') return <g><path d={`M334 ${y - 6}Q360 ${y + 24} 386 ${y - 6}Q360 ${y + 4} 334 ${y - 6}Z`} fill="#4a1a2a" stroke="#8a4655" strokeWidth="4" strokeLinejoin="round"/><path d={`M340 ${y - 3}Q360 ${y + 3} 380 ${y - 3}`} stroke="#fff" strokeWidth="4" fill="none"/></g>;
  if (mood === 'worry') return <path d={`M340 ${y + 4}Q350 ${y - 4} 360 ${y + 2}Q370 ${y + 8} 380 ${y}`} fill="none" stroke="#8a4655" strokeWidth="5" strokeLinecap="round"/>;
  if (mood === 'tired') return <path d={`M344 ${y + 2}Q360 ${y - 2} 376 ${y + 3}`} fill="none" stroke="#8a4655" strokeWidth="5" strokeLinecap="round"/>;
  return <path d={`M342 ${y - 4}Q360 ${y + 12} 378 ${y - 4}`} fill="none" stroke="#8a4655" strokeWidth="5" strokeLinecap="round"/>;
}

/* ───────────── Cerebro (heredado del video de la cafeína) ───────────── */
export function Brain({f, tint = '#e1a9cb', mood = 'calm'}: {f: number; tint?: string; mood?: 'calm' | 'happy' | 'hot' | 'think'}) {
  const shake = mood === 'hot' ? wave(f, 1.3, 4) : 0;
  return <g filter="url(#shadow)" transform={`translate(${shake} ${wave(f, .08, 3)})`}>
    <path d="M-125 33Q-151 2-126-26Q-143-66-101-77Q-91-119-47-108Q-15-143 14-112Q58-138 77-103Q126-109 128-68Q164-37 134-5Q155 34 123 55Q115 99 72 92Q43 125 5 97Q-35 124-65 92Q-111 104-113 67Q-148 57-125 33Z" fill={tint} stroke="#ffe6db" strokeWidth="8"/>
    <path d="M-7-111Q-13-57-4-14Q-12 34-2 101M-105-68Q-64-58-76-27Q-91-5-60 6M79-96Q43-69 69-45Q98-29 75-6M-96 59Q-61 33-42 62M91 49Q57 24 39 56" fill="none" stroke="#a85383" strokeWidth="9" strokeLinecap="round" opacity=".8"/>
    {mood === 'happy' ? <><path d="M-48 2q10-14 20 0M30 2q10-14 20 0" stroke="#292239" strokeWidth="6" fill="none" strokeLinecap="round"/><path d="M-24 34Q0 60 24 34Z" fill="#5a2140" stroke="#743b62" strokeWidth="4"/></>
      : mood === 'hot' ? <><path d="M-50-8l22 10M50-8l-22 10" stroke="#292239" strokeWidth="6" strokeLinecap="round"/><ellipse cx="-38" cy="10" rx="7" ry="9" fill="#292239"/><ellipse cx="39" cy="10" rx="7" ry="9" fill="#292239"/><path d="M-20 48q10-10 20 0t20 0" stroke="#743b62" strokeWidth="5" fill="none"/></>
        : <><ellipse cx="-38" cy="5" rx="7" ry={mood === 'think' ? 6 : 11} fill="#292239"/><ellipse cx="39" cy="5" rx="7" ry={mood === 'think' ? 6 : 11} fill="#292239"/><path d={mood === 'think' ? 'M-16 44H18' : 'M-21 42Q0 55 22 40'} fill="none" stroke="#743b62" strokeWidth="5" strokeLinecap="round"/></>}
  </g>;
}

/* ───────────── Piezas reutilizables ───────────── */
export function Phone({f, x = 360, y = 780, s = 1, children}: {f: number; x?: number; y?: number; s?: number; children?: React.ReactNode}) {
  return <g transform={`translate(${x} ${y + wave(f, .05, 6)}) rotate(${wave(f, .03, 2)}) scale(${s})`} filter="url(#shadow)">
    <rect x="-150" y="-280" width="300" height="560" rx="44" fill="url(#device)" stroke="#9aa3d9" strokeWidth="6"/>
    <rect x="-132" y="-252" width="264" height="504" rx="28" fill="#141a3f"/>
    <rect x="-132" y="-252" width="264" height="504" rx="28" fill="url(#screen)" opacity=".28"/>
    <rect x="-40" y="-268" width="80" height="12" rx="6" fill="#0a0a14"/>
    {children}
  </g>;
}

export function Bubble({x, y, w, text, f, at, mine = false, size = 22}: {x: number; y: number; w: number; text: string; f: number; at: number; mine?: boolean; size?: number}) {
  return <Pop f={f} at={at} x={mine ? x + w : x} y={y}>
    <rect x={x} y={y - 26} width={w} height="52" rx="20" fill={mine ? '#7df2c9' : '#fff6e8'}/>
    <path d={mine ? `M${x + w - 8} ${y + 18}l18 10l-6-18Z` : `M${x + 8} ${y + 18}l-18 10l6-18Z`} fill={mine ? '#7df2c9' : '#fff6e8'}/>
    <text x={x + 18} y={y + 8} fontSize={size} fontWeight="760" fill="#231a36">{text}</text>
  </Pop>;
}

export function Sofa({f, x = 360, y = 930, s = 1}: {f: number; x?: number; y?: number; s?: number}) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#shadow)">
    <ellipse cx="0" cy="138" rx="300" ry="26" fill="#120c1f" opacity=".45" filter="url(#soft)"/>
    <path d="M-250 -60Q-250 -120 -190 -120H190Q250 -120 250 -60V40H-250Z" fill="url(#sofa)" stroke="#ffb59a" strokeWidth="5"/>
    <path d="M-280 -10Q-300 -60 -250 -60Q-220 -60 -220 -20V110H-280Z" fill="url(#sofa)" stroke="#ffb59a" strokeWidth="5"/>
    <path d="M280 -10Q300 -60 250 -60Q220 -60 220 -20V110H280Z" fill="url(#sofa)" stroke="#ffb59a" strokeWidth="5"/>
    <rect x="-225" y="20" width="450" height="92" rx="26" fill="#d9605d" stroke="#ffb59a" strokeWidth="5"/>
    <path d="M0 24V108" stroke="#a63e4f" strokeWidth="4" opacity=".6"/>
    {[-240, 240].map(px => <rect key={px} x={px - 8} y="110" width="16" height="30" rx="5" fill="url(#wood)"/>)}
  </g>;
}

export function Blanket({f, y = 925}: {f: number; y?: number}) {
  return <g filter="url(#shadow)"><path d={`M210 ${y}Q360 ${y - 28 + wave(f, .05, 4)} 510 ${y}L522 ${y + 120}Q360 ${y + 140} 198 ${y + 120}Z`} fill="url(#blanket)" stroke="#d6fff1" strokeWidth="5"/>
    {[0, 1, 2, 3].map(i => <path key={i} d={`M${232 + i * 72} ${y + 8}l14 108`} stroke="#ecfff8" strokeWidth="5" opacity=".35"/>)}</g>;
}

export function Moon({x, y, r = 60, f}: {x: number; y: number; r?: number; f: number}) {
  return <g transform={`translate(${x} ${y + wave(f, .03, 4)})`}><circle r={r * 1.9} fill="url(#warmglow)" opacity=".35"/><circle r={r} fill="url(#moon)"/><circle cx={r * .45} cy={-r * .2} r={r * .9} fill="#1a2356" opacity=".0"/>
    <circle cx={-r * .3} cy={-r * .2} r={r * .14} fill="#d8c48c" opacity=".7"/><circle cx={r * .25} cy={r * .3} r={r * .2} fill="#d8c48c" opacity=".6"/><circle cx={r * .35} cy={-r * .35} r={r * .08} fill="#d8c48c" opacity=".7"/></g>;
}

export function Stars({f, n = 14, y0 = 500, y1 = 760, x0 = 40, x1 = 680}: {f: number; n?: number; y0?: number; y1?: number; x0?: number; x1?: number}) {
  return <g>{Array.from({length: n}, (_, i) => { const x = mix(x0, x1, seeded(i + 101)), y = mix(y0, y1, seeded(i + 211)), s = 3 + seeded(i + 5) * 5, o = .4 + .6 * Math.abs(Math.sin(f * .05 + i));
    return <path key={i} d={`M${x} ${y - s}L${x + s * .3} ${y - s * .3}L${x + s} ${y}L${x + s * .3} ${y + s * .3}L${x} ${y + s}L${x - s * .3} ${y + s * .3}L${x - s} ${y}L${x - s * .3} ${y - s * .3}Z`} fill="#fff6d0" opacity={o}/>; })}</g>;
}

export function Heart({x, y, s = 1, fill = '#ff7aa8'}: {x: number; y: number; s?: number; fill?: string}) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 12C-18-2-26-12-20-22C-14-32-2-28 0-20C2-28 14-32 20-22C26-12 18-2 0 12Z" fill={fill} stroke="#fff" strokeWidth="2"/>;
}

export function Battery({x, y, level, f, s = 1, label = true, bolt = false}: {x: number; y: number; level: number; f: number; s?: number; label?: boolean; bolt?: boolean}) {
  const lv = clamp(level), col = lv > .55 ? 'url(#green)' : lv > .28 ? 'url(#gold)' : 'url(#red)';
  return <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#shadow)">
    <rect x="-80" y="-150" width="160" height="300" rx="28" fill="#1a1630" stroke="#e8f0ff" strokeWidth="10"/>
    <rect x="-34" y="-176" width="68" height="28" rx="8" fill="#e8f0ff"/>
    <rect x="-62" y={132 - 264 * lv} width="124" height={264 * lv} rx="16" fill={col}/>
    <rect x="-52" y={132 - 264 * lv + 8} width="18" height={Math.max(0, 264 * lv - 24)} rx="9" fill="#fff" opacity=".28"/>
    {bolt && <path d="M14 -70L-30 10H0L-14 76L32 -8H2Z" fill="#fff8c4" stroke="#3b2a12" strokeWidth="4" opacity={.7 + wave(f, .3, .3)}/>}
    {label && <T x={0} y={216} size={38}>{Math.round(lv * 100)}%</T>}
  </g>;
}

export function ClockFace({f, x = 360, y = 760, r = 139, hour = 10, minute = 0, spin = .0}: {f: number; x?: number; y?: number; r?: number; hour?: number; minute?: number; spin?: number}) {
  const m = minute + f * spin * 60, h = hour + m / 60;
  return <g transform={`translate(${x} ${y})`} filter="url(#shadow)">
    <circle r={r} fill="#182c48" stroke="#e9d7a1" strokeWidth={r * .09}/><circle r={r * .85} fill="none" stroke="#afdfd2" strokeWidth="3" strokeDasharray="3 17"/>
    {Array.from({length: 12}, (_, i) => <path key={i} d={`M0 ${-r * .8}v${r * .1}`} transform={`rotate(${i * 30})`} stroke="#fff0bd" strokeWidth="5"/>)}
    <path d={`M0 0L${r * .45 * Math.sin(h / 12 * Math.PI * 2)} ${-r * .45 * Math.cos(h / 12 * Math.PI * 2)}`} stroke="#ffcd66" strokeWidth="9" strokeLinecap="round"/>
    <path d={`M0 0L${r * .66 * Math.sin(m / 60 * Math.PI * 2)} ${-r * .66 * Math.cos(m / 60 * Math.PI * 2)}`} stroke="#84eadc" strokeWidth="7" strokeLinecap="round"/><circle r="11" fill="#fff1bd"/>
  </g>;
}

export function Molecule({f, label, x = 360, y = 760, color = 'url(#gold)', nodes = 6}: {f: number; label: string; x?: number; y?: number; color?: string; nodes?: number}) {
  return <g transform={`translate(${x} ${y}) rotate(${wave(f, .02, 8)})`} filter="url(#shadow)">
    <circle r="170" fill="url(#glow)" opacity=".6"/>
    {Array.from({length: nodes}, (_, i) => { const a = i * Math.PI * 2 / nodes + f * .008, rr = 112 + wave(f, .07, 6, i), px = Math.cos(a) * rr, py = Math.sin(a) * rr;
      return <g key={i}><path d={`M0 0L${px} ${py}`} stroke="#9af9e9" strokeWidth="11" opacity=".74"/><circle cx={px} cy={py} r={24 + (i % 2) * 6} fill={color} stroke="#fff2c7" strokeWidth="5"/></g>; })}
    <circle r="66" fill="url(#coat)" stroke="#c7fff1" strokeWidth="7"/>
    <g transform={`rotate(${-wave(f, .02, 8)})`}><text y="10" textAnchor="middle" fill="#123b50" fontSize={label.length > 9 ? 19 : 24} fontWeight="900">{label}</text></g>
  </g>;
}

export function Scale({f, tilt, leftLabel, rightLabel, left, right}: {f: number; tilt: number; leftLabel: string; rightLabel: string; left?: React.ReactNode; right?: React.ReactNode}) {
  const a = tilt + wave(f, .06, 2.2), rad = a * Math.PI / 180, L = 200;
  const lx = 360 - Math.cos(rad) * L, ly = 640 - Math.sin(rad) * L, rx = 360 + Math.cos(rad) * L, ry = 640 + Math.sin(rad) * L;
  const pan = (x: number, y: number, label: string, content?: React.ReactNode) => <g>
    <path d={`M${x} ${y}L${x - 70} ${y + 140}M${x} ${y}L${x + 70} ${y + 140}`} stroke="#f3e2b0" strokeWidth="4"/>
    {content && <g transform={`translate(${x} ${y + 132})`}>{content}</g>}
    <path d={`M${x - 92} ${y + 140}Q${x} ${y + 190} ${x + 92} ${y + 140}Z`} fill="url(#gold)" stroke="#fff2c7" strokeWidth="5"/>
    <T x={x} y={y + 230} size={26}>{label}</T>
  </g>;
  return <g filter="url(#shadow)">
    <path d="M360 640L330 1010H390Z" fill="url(#wood)" stroke="#f6d4a8" strokeWidth="4"/><rect x="270" y="1000" width="180" height="26" rx="12" fill="url(#wood)"/>
    <path d={`M${lx} ${ly}L${rx} ${ry}`} stroke="#f6d4a8" strokeWidth="14" strokeLinecap="round"/><circle cx="360" cy="640" r="18" fill="url(#gold)" stroke="#fff" strokeWidth="4"/>
    {pan(lx, ly, leftLabel, left)}{pan(rx, ry, rightLabel, right)}
  </g>;
}

export function House({f, x = 360, y = 820, s = 1, warm = true}: {f: number; x?: number; y?: number; s?: number; warm?: boolean}) {
  return <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#shadow)">
    <path d="M-150 -40L0 -170L150 -40Z" fill="#c04f55" stroke="#ffb59a" strokeWidth="6" strokeLinejoin="round"/>
    <rect x="80" y="-160" width="34" height="70" fill="#8a3d4c"/>
    {[0, 1, 2].map(i => <path key={i} d={`M97 ${-170 - i * 26}q${wave(f, .05, 10, i)} -14 0 -26`} stroke="#fff" strokeWidth="6" fill="none" opacity={.35 - i * .08} strokeLinecap="round"/>)}
    <rect x="-125" y="-42" width="250" height="190" rx="8" fill="url(#cream)" stroke="#fff" strokeWidth="5"/>
    <rect x="-28" y="44" width="56" height="104" rx="8" fill="url(#wood)"/><circle cx="16" cy="98" r="5" fill="#ffd36b"/>
    {[-80, 80].map(wx => <g key={wx}><rect x={wx - 30} y="0" width="60" height="56" rx="6" fill={warm ? '#ffd36b' : '#3a4270'} opacity={warm ? .85 + wave(f, .1, .12) : 1}/><path d={`M${wx} 0v56M${wx - 30} 28h60`} stroke="#c88a45" strokeWidth="4"/></g>)}
    {warm && <circle cx="0" cy="40" r="170" fill="url(#warmglow)" opacity=".25"/>}
  </g>;
}

export function Person({x, y, s = 1, color = '#2a1b45', f, phase = 0, bob = 6}: {x: number; y: number; s?: number; color?: string; f: number; phase?: number; bob?: number}) {
  const b = wave(f, .25, bob, phase);
  return <g transform={`translate(${x} ${y + b}) scale(${s})`}><circle cx="0" cy="-70" r="22" fill={color}/><path d="M-30 0Q-30 -44 0 -46Q30 -44 30 0Z" fill={color}/>
    <path d={`M-24 -30L${-44 + wave(f, .25, 10, phase)} ${-80 + b}`} stroke={color} strokeWidth="12" strokeLinecap="round"/></g>;
}

export function Check({x, y, s = 1, color = '#9cf5a8'}: {x: number; y: number; s?: number; color?: string}) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-14 0L-4 12L16 -12" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>;
}
export function Cross({x, y, s = 1, color = '#ff8a8a'}: {x: number; y: number; s?: number; color?: string}) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-12 -12L12 12M12 -12L-12 12" stroke={color} strokeWidth="7" strokeLinecap="round"/>;
}

export function Zzz({f, x, y}: {f: number; x: number; y: number}) {
  return <g>{[0, 1, 2].map(i => { const t = ((f + i * 20) % 60) / 60; return <T key={i} x={x + t * 60 + i * 6} y={y - t * 90} size={26 + i * 8} opacity={1 - t} fill="#dfe7ff">Z</T>; })}</g>;
}

/* ───────────── Logotipo propuesto: "Ciencia en Pantuflas" ───────────── */
export function Slipper({f, x = 0, y = 0, s = 1}: {f: number; x?: number; y?: number; s?: number}) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx="0" cy="62" rx="120" ry="18" fill="#0c0818" opacity=".35" filter="url(#blur6)"/>
    <path d="M-110 30Q-120 -10 -70 -24Q10 -40 80 -10Q124 10 112 40Q96 64 0 62Q-100 62 -110 30Z" fill="url(#slipper)" stroke="#fff0f7" strokeWidth="6"/>
    <path d="M-20 -30Q30 -66 84 -12Q60 8 0 4Q-30 0 -20 -30Z" fill="#fff6fb" stroke="#f2d9e8" strokeWidth="4"/>
    {Array.from({length: 7}, (_, k) => <circle key={k} cx={-12 + k * 14} cy={-24 + Math.abs(k - 3) * 4 + wave(f, .1, 1.5, k)} r="9" fill="#fff"/>)}
    <g transform={`translate(28 -30) rotate(${f * 1.2})`}>
      <ellipse rx="70" ry="24" fill="none" stroke="#d7f36b" strokeWidth="5"/>
      <ellipse rx="70" ry="24" fill="none" stroke="#7df2e0" strokeWidth="5" transform="rotate(60)"/>
      <ellipse rx="70" ry="24" fill="none" stroke="#fff4d9" strokeWidth="5" transform="rotate(120)"/>
    </g>
    <circle cx="28" cy="-30" r="13" fill="#d7f36b" stroke="#fff" strokeWidth="3"/>
  </g>;
}
