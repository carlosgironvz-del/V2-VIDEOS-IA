import React from 'react';
import {
  Battery, Blanket, Brain, Bubble, Character, Check, ClockFace, Cross, Heart, House, Molecule, Moon, Person, Phone, Pop,
  Scale, Slipper, Sofa, Stars, T, Zzz, clamp, ease, mix, popAt, seeded, wave,
} from './art';

type P = {f: number; d: number; items?: string[]};
/* Todas las escenas se dibujan en el lienzo 720×1280; zona focal y∈[500,1110]. */

const Room = ({f, lamp = true}: {f: number; lamp?: boolean}) => <g>
  <g transform="translate(70 520)" filter="url(#shadow)"><rect width="190" height="170" rx="12" fill="#1a2356" stroke="url(#wood)" strokeWidth="12"/><Stars f={f} n={6} x0={12} x1={178} y0={14} y1={150}/><Moon x={130} y={52} r={26} f={f}/><path d="M95 0V170M0 85H190" stroke="#8a5434" strokeWidth="6"/></g>
  {lamp && <g transform="translate(600 640)"><circle cy="10" r="160" fill="url(#warmglow)" opacity={.5 + wave(f, .04, .06)}/><path d="M-50 0L-30 -70H30L50 0Z" fill="#ffe1a0" stroke="#fff4d0" strokeWidth="4"/><path d="M0 0V200M-40 200H40" stroke="#c88a45" strokeWidth="9" strokeLinecap="round"/></g>}
</g>;

const SeatedCharacter = ({f, mood = 'blissful', pose = 'rest', y = 0, talk = false}: {f: number; mood?: any; pose?: any; y?: number; talk?: boolean}) =>
  <g transform={`translate(70 ${236 + y}) scale(.8)`}><Character f={f} mood={mood} pose={pose} talk={talk}/></g>;

function Couch({f, proud = false}: {f: number; proud?: boolean}) {
  return <g>
    <Room f={f}/>
    <SeatedCharacter f={f} mood={proud ? 'proud' : 'blissful'} pose={proud ? 'cheer' : 'mug'}/>
    <Sofa f={f} y={985}/>
    <Blanket f={f} y={960}/>
    {Array.from({length: 5}, (_, i) => { const t = ((f + i * 22) % 110) / 110; return <Heart key={i} x={200 + i * 80 + wave(f, .05, 12, i)} y={900 - t * 260} s={.7 + seeded(i) * .6} fill={i % 2 ? '#ff7aa8' : '#ffd36b'}/>; })}
    {proud && Array.from({length: 26}, (_, i) => <rect key={i} x={seeded(i) * 720} y={(500 + seeded(i + 4) * 200 + f * (2 + seeded(i) * 2)) % 700 + 460} width="10" height="18" rx="3" fill={['#ffd36b', '#7df2e0', '#ff7aa8', '#d7f36b'][i % 4]} transform={`rotate(${f * 4 + i * 30} ${seeded(i) * 720} 700)`}/>)}
  </g>;
}

function PhoneHook({f}: P) {
  return <g>
    <g transform="translate(-150 120) scale(.82)"><Character f={f} mood="shock" pose="rest"/></g>
    <Phone f={f} x={480} y={790} s={.86}>
      <T x={0} y={-198} size={20} fill="#cfe0ff">AMIGOS · 22:00</T>
      <Bubble x={-118} y={-120} w={220} text="¿Salimos hoy?" f={f} at={10}/>
      <Bubble x={-118} y={-50} w={190} text="¡Va a estar épico!" f={f} at={34} size={19}/>
      <Pop f={f} at={56} x={0} y={40}>{[0, 1, 2].map(i => <circle key={i} cx={-90 + i * 22} cy={40} r="8" fill="#fff6e8" opacity={.5 + wave(f, .3, .5, i)}/>)}</Pop>
    </Phone>
    <Pop f={f} at={6} x={600} y={520}><circle cx="600" cy="520" r="30" fill="#ff4f7a" stroke="#fff" strokeWidth="5"/><T x={600} y={531} size={28} stroke={false}>2</T></Pop>
  </g>;
}

function Roadmap({f}: P) {
  const icons = ['CEREBRO', 'RELOJ', 'BATERÍA', 'LA CUENTA'];
  const pts = [[150, 1000], [300, 820], [470, 960], [590, 640]];
  const prog = clamp(f / 150);
  const path = 'M150 1000C220 900 240 820 300 820S420 980 470 960S560 760 590 640';
  return <g filter="url(#shadow)">
    <path d={path} fill="none" stroke="#fff4d8" strokeWidth="14" strokeDasharray="2 26" strokeLinecap="round" opacity=".6"/>
    <path d={path} fill="none" stroke="#ffd36b" strokeWidth="10" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - prog}/>
    {pts.map(([x, y], i) => <Pop key={i} f={f} at={i * 34} x={x} y={y}>
      <circle cx={x} cy={y} r="56" fill={['#e1a9cb', '#182c48', '#3fbf6a', '#ffc459'][i]} stroke="#fff4d8" strokeWidth="7"/>
      {i === 0 && <g transform={`translate(${x} ${y}) scale(.36)`}><Brain f={f}/></g>}
      {i === 1 && <ClockFace f={f} x={x} y={y} r={40} hour={10} spin={.4}/>}
      {i === 2 && <Battery x={x} y={y} level={.35 + wave(f, .05, .3)} f={f} s={.26} label={false}/>}
      {i === 3 && <g><path d={`M${x - 30} ${y - 6}h60M${x - 30} ${y + 14}h60`} stroke="#3b2a12" strokeWidth="9" strokeLinecap="round"/></g>}
      <T x={x} y={y + 92} size={22}>{icons[i]}</T>
    </Pop>)}
  </g>;
}

function Dial({f, value, label = 'ACTIVACIÓN BASE'}: {f: number; value: number; label?: string}) {
  const v = clamp(value + wave(f, .09, .05)), a = mix(-90, 90, v);
  return <g transform="translate(360 900)" filter="url(#shadow)">
    {[['#7df2c9', -90, -30], ['#ffd36b', -30, 30], ['#ff6b8a', 30, 90]].map(([c, a0, a1], i) => { const r = 230, p0 = (Number(a0) - 90) * Math.PI / 180, p1 = (Number(a1) - 90) * Math.PI / 180;
      return <path key={i} d={`M${Math.cos(p0) * r} ${Math.sin(p0) * r}A${r} ${r} 0 0 1 ${Math.cos(p1) * r} ${Math.sin(p1) * r}`} stroke={String(c)} strokeWidth="46" fill="none"/>; })}
    {Array.from({length: 11}, (_, i) => <path key={i} d="M0 -270v22" transform={`rotate(${-90 + i * 18})`} stroke="#fff4d8" strokeWidth="5"/>)}
    <g transform={`rotate(${a})`}><path d="M-12 0L0 -205L12 0Z" fill="#fff4d8" stroke="#2a1b45" strokeWidth="3"/></g><circle r="26" fill="url(#gold)" stroke="#fff" strokeWidth="5"/>
    <T x={-200} y={60} size={22}>BAJO</T><T x={200} y={60} size={22}>ALTO</T><T x={0} y={100} size={28}>{label}</T>
  </g>;
}

function Speaker({f, x = 360, y = 800, s = 1, loud = 1}: {f: number; x?: number; y?: number; s?: number; loud?: number}) {
  const pump = 1 + Math.max(0, Math.sin(f * (.25 + loud * .2))) * .06 * loud;
  return <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#shadow)">
    {Array.from({length: 4}, (_, i) => { const t = ((f * (0.6 + loud * .8) + i * 25) % 100) / 100; return <circle key={i} r={150 + t * 240 * (0.5 + loud * .5)} fill="none" stroke={loud > .6 ? '#ff7ad1' : '#7df2e0'} strokeWidth={8 * (1 - t)} opacity={(1 - t) * .8}/>; })}
    <rect x="-130" y="-190" width="260" height="380" rx="30" fill="url(#device)" stroke="#9aa3d9" strokeWidth="6"/>
    <circle cy="-95" r="52" fill="#251f38" stroke="#9aa3d9" strokeWidth="5"/><circle cy="-95" r={22 * pump} fill="#3d3657"/>
    <circle cy="60" r={96 * pump} fill="#251f38" stroke="#9aa3d9" strokeWidth="6"/><circle cy="60" r={56 * pump} fill="#3d3657" stroke="#5a5280" strokeWidth="4"/><circle cy="60" r="18" fill="#9aa3d9"/>
  </g>;
}

function Lemon({f, x = 360, y = 700, s = 1}: {f: number; x?: number; y?: number; s?: number}) {
  return <g transform={`translate(${x} ${y}) rotate(${wave(f, .03, 8)}) scale(${s})`} filter="url(#shadow)">
    <circle r="150" fill="url(#lemon)" stroke="#fff6b0" strokeWidth="10"/><circle r="122" fill="#fff9c8"/>
    {Array.from({length: 8}, (_, i) => <path key={i} d="M0 0L-38 -108Q0 -122 38 -108Z" transform={`rotate(${i * 45})`} fill="#ffe86a" stroke="#fffbe0" strokeWidth="5"/>)}
    <circle r="14" fill="#fffbe0"/>
  </g>;
}

function Beaker({x, y, level, label, f, color}: {x: number; y: number; level: number; label: string; f: number; color: string}) {
  const h = 230 * clamp(level);
  return <g transform={`translate(${x} ${y})`} filter="url(#shadow)">
    <path d="M-80 -260V0Q-80 30 -50 30H50Q80 30 80 0V-260" fill="#ffffff22" stroke="#eaf6ff" strokeWidth="7"/>
    <path d={`M-72 ${-h}Q0 ${-h - 10 + wave(f, .15, 6)} 72 ${-h}V0Q72 22 48 22H-48Q-72 22 -72 0Z`} fill={color} opacity=".9"/>
    {[-200, -150, -100, -50].map(t => <path key={t} d={`M-80 ${t}h22`} stroke="#eaf6ff" strokeWidth="4"/>)}
    <T x={0} y={84} size={28}>{label}</T>
  </g>;
}

function Bulb({x, y, f, bright, label, neon}: {x: number; y: number; f: number; bright: number; label: string; neon?: boolean}) {
  const fl = neon ? (Math.sin(f * .9) > -.85 ? 1 : .35) : 1;
  return <g transform={`translate(${x} ${y})`} filter="url(#shadow)">
    <circle cy="-40" r={150 * bright} fill={neon ? 'url(#pinkglow)' : 'url(#warmglow)'} opacity={.8 * fl * bright}/>
    <path d="M-70 -40A70 70 0 1 1 70 -40Q70 0 40 30V60H-40V30Q-70 0 -70 -40Z" fill={neon ? '#ffd0f0' : '#fff4c8'} opacity={.35 + bright * .65 * fl} stroke="#fff" strokeWidth="5"/>
    {neon ? <path d="M-30 -40q15 -40 30 0t30 0" stroke="#ff3fb0" strokeWidth="8" fill="none" opacity={fl}/> : <path d="M-22 -10v-30q22 -20 44 0v30" stroke="#c9a85a" strokeWidth="5" fill="none"/>}
    <rect x="-40" y="60" width="80" height="44" rx="8" fill="#9aa3d9"/><path d="M-40 74h80M-40 90h80" stroke="#5a5280" strokeWidth="4"/>
    <T x={0} y={160} size={28}>{label}</T>
  </g>;
}

function Gear({x, y, r, f, speed, color}: {x: number; y: number; r: number; f: number; speed: number; color: string}) {
  return <g transform={`translate(${x} ${y}) rotate(${f * speed})`}>{Array.from({length: 8}, (_, i) => <rect key={i} x={-r * .18} y={-r * 1.25} width={r * .36} height={r * .5} rx="4" fill={color} transform={`rotate(${i * 45})`}/>)}<circle r={r} fill={color}/><circle r={r * .38} fill="#2a1b45"/></g>;
}

function Disco({f, x = 360, y = 560, r = 90}: {f: number; x?: number; y?: number; r?: number}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d={`M0 ${-r - 80}V${-r}`} stroke="#ccc" strokeWidth="4"/>
    <circle r={r} fill="#c9d4ff" stroke="#fff" strokeWidth="4"/>
    {Array.from({length: 7}, (_, j) => Array.from({length: 9}, (_, i) => { const lon = ((i / 9) * Math.PI * 2 + f * .05) % (Math.PI * 2), lat = (j / 6 - .5) * Math.PI * .9; const vis = Math.cos(lon);
      if (vis < 0) return null; return <rect key={`${i}-${j}`} x={Math.sin(lon) * Math.cos(lat) * r - 7} y={Math.sin(lat) * r - 7} width={14 * vis} height="13" fill={seeded(i * 7 + j + Math.floor(f / 8)) > .7 ? '#fff' : '#8fa0e8'} opacity=".9"/>; }))}
  </g>;
}

function Beams({f, colors = ['#ff5cbf', '#7df2e0', '#ffd36b']}: {f: number; colors?: string[]}) {
  return <g opacity=".45" style={{mixBlendMode: 'screen'}}>{colors.map((c, i) => <path key={i} d="M0 0L-90 900L90 900Z" fill={c} opacity=".5" transform={`translate(${160 + i * 200} 470) rotate(${wave(f, .04 + i * .01, 32, i * 2)})`} filter="url(#blur6)"/>)}</g>;
}

function Crowd({f, y = 1080, n = 9, color = '#1b0f30'}: {f: number; y?: number; n?: number; color?: string}) {
  return <g>{Array.from({length: n}, (_, i) => <Person key={i} x={40 + i * (640 / (n - 1))} y={y + (i % 2) * 20} s={1 + seeded(i) * .3} color={color} f={f} phase={i * 1.3} bob={8}/>)}</g>;
}

function Calendar({f, days, highlight, title}: {f: number; days: string[]; highlight?: number; title: string}) {
  return <g filter="url(#shadow)">
    <rect x="80" y="560" width="560" height="470" rx="34" fill="url(#cream)" stroke="#fff" strokeWidth="6"/>
    <rect x="80" y="560" width="560" height="96" rx="34" fill="#c04f55"/><rect x="80" y="620" width="560" height="36" fill="#c04f55"/>
    <T x={360} y={624} size={34} stroke={false}>{title}</T>
    {days.map((dd, i) => { const x = 140 + i * 110, lv = 1 - i * .2, hl = i === highlight;
      return <Pop key={i} f={f} at={8 + i * 14} x={x} y={840}>
        <T x={x} y={720} size={30} fill="#3a2a40" stroke={false}>{dd}</T>
        <Battery x={x} y={850} level={lv} f={f} s={.38} label={false}/>
        {hl && <circle cx={x} cy={850} r={78} fill="none" stroke="#e2364f" strokeWidth="7" opacity={.5 + wave(f, .25, .5)}/>}
        {!hl && <Check x={x} y={960} color="#3fbf6a"/>}
      </Pop>; })}
  </g>;
}

function Ear({f}: P) {
  return <g>
    {Array.from({length: 9}, (_, i) => { const y0 = 560 + i * 60; const hl = i === 4; const pts = Array.from({length: 24}, (_, k) => `${40 + k * 16},${mix(y0, 790, k / 23) + Math.sin(k * .9 + f * .2 + i) * (hl ? 10 : 18) * (1 - k / 30)}`).join(' ');
      return <polyline key={i} points={pts} fill="none" stroke={hl ? '#ffd36b' : ['#ff7ad1', '#7df2e0', '#9aa3d9'][i % 3]} strokeWidth={hl ? 9 : 5} opacity={hl ? 1 : .45} strokeLinecap="round"/>; })}
    <g transform="translate(520 790)" filter="url(#shadow)">
      <path d="M-40 -150Q90 -170 100 -30Q106 60 40 90Q10 110 14 150Q10 190 -30 180Q-60 170 -50 130Q-40 80 -70 40Q-110 -20 -90 -90Q-76 -140 -40 -150Z" fill="url(#skin)" stroke="#ffe0bb" strokeWidth="6"/>
      <path d="M-40 -100Q40 -110 50 -30Q54 20 10 40Q-20 50 -26 90" fill="none" stroke="#b86a54" strokeWidth="10" strokeLinecap="round"/>
    </g>
  </g>;
}

function OwlLark({f}: P) {
  return <g>
    <rect x="0" y="480" width="360" height="660" fill="#ffd36b" opacity=".18"/><rect x="360" y="480" width="360" height="660" fill="#0a0f2e" opacity=".35"/>
    <g transform={`translate(180 ${640 + wave(f, .04, 6)})`}><circle r="60" fill="url(#gold)"/>{Array.from({length: 10}, (_, i) => <path key={i} d="M0 -76v-20" transform={`rotate(${i * 36 + f})`} stroke="#ffd36b" strokeWidth="6" strokeLinecap="round"/>)}</g>
    <Moon x={540} y={620} r={52} f={f}/><Stars f={f} n={8} x0={380} x1={700} y0={500} y1={720}/>
    <path d="M40 960Q360 930 680 960" stroke="url(#wood)" strokeWidth="18" fill="none" strokeLinecap="round"/>
    {/* alondra */}
    <g transform={`translate(190 ${905 + wave(f, .2, 4)})`} filter="url(#shadow)"><ellipse rx="56" ry="44" fill="#d9a06a"/><ellipse cx="-6" cy="12" rx="34" ry="24" fill="#fff0d0"/><circle cx="34" cy="-30" r="30" fill="#d9a06a"/><circle cx="44" cy="-34" r="6" fill="#1a1020"/><circle cx="46" cy="-36" r="2" fill="#fff"/><path d="M62 -30l24 6l-24 6Z" fill="#ffb347"/><path d={`M-20 -10q-40 ${-30 + wave(f, .4, 20)} -70 -6`} stroke="#b07a4a" strokeWidth="14" fill="none" strokeLinecap="round"/><path d="M28 -58l6 -18l8 16" fill="#b07a4a"/></g>
    {/* búho */}
    <g transform={`translate(530 ${880 + wave(f, .05, 3)}) rotate(${wave(f, .04, 6)})`} filter="url(#shadow)"><path d="M-70 60Q-80 -60 -50 -90L-36 -120L-14 -92H14L36 -120L50 -90Q80 -60 70 60Q0 90 -70 60Z" fill="#7a5a8c" stroke="#c7b2d8" strokeWidth="5"/><path d="M-40 10Q0 40 40 10Q40 60 0 70Q-40 60 -40 10Z" fill="#cdb8e0"/>
      {[-28, 28].map(x => <g key={x}><circle cx={x} cy="-46" r="26" fill="#fff6d0"/><circle cx={x} cy="-46" r={13} fill="#ffb347"/><circle cx={x} cy="-46" r="7" fill="#1a1020"/><circle cx={x + 3} cy="-50" r="3" fill="#fff"/></g>)}<path d="M-8 -22l8 16l8 -16Z" fill="#ffb347"/></g>
    <T x={190} y={1060} size={30}>ALONDRA</T><T x={530} y={1060} size={30}>BÚHO</T>
  </g>;
}

function Graph({f}: P) {
  const g1 = ease(f / 40) * 150, g2 = ease((f - 50) / 50) * 340;
  return <g filter="url(#shadow)">
    <path d="M110 1020H630M110 1020V560" stroke="#fff4d8" strokeWidth="6" strokeLinecap="round"/>
    <rect x="180" y={1020 - g1} width="150" height={g1} rx="14" fill="#9aa3d9"/><rect x="410" y={1020 - g2} width="150" height={g2} rx="14" fill="url(#green)"/>
    <T x={255} y={1070} size={26}>LO QUE ESPERAS</T><T x={485} y={1070} size={26}>LO QUE PASA</T>
    {g2 > 300 && <g transform={`translate(485 ${1000 - g2})`}><Pop f={f} at={100} x={0} y={0}><circle r="34" fill="#ffd36b" stroke="#fff" strokeWidth="4"/><path d="M-14 -4q4 -8 8 0M6 -4q4 -8 8 0M-14 8q14 14 28 0" stroke="#3b2a12" strokeWidth="4" fill="none" strokeLinecap="round"/></Pop></g>}
  </g>;
}

function Train({f}: P) {
  const sh = wave(f, .6, 1.5);
  return <g>
    {Array.from({length: 8}, (_, i) => <rect key={i} x={((i * 120 - f * 9) % 960 + 960) % 960 - 120} y="1035" width="70" height="10" rx="4" fill="#fff4d8" opacity=".35"/>)}
    <path d="M0 1030H720" stroke="#9aa3d9" strokeWidth="8"/>
    <g transform={`translate(0 ${sh})`} filter="url(#shadow)">
      <rect x="30" y="610" width="660" height="400" rx="40" fill="#e9eef8" stroke="#fff" strokeWidth="6"/><rect x="30" y="900" width="660" height="40" fill="#c04f55"/>
      {[0, 1].map(i => <rect key={i} x={70 + i * 330} y="650" width="250" height="210" rx="20" fill="#1a2356"/>)}
      <g transform="translate(-70 420) scale(.62)"><Character f={f} mood="happy" talk={f % 120 < 60} cap={false}/></g>
      <g transform="translate(260 420) scale(.62)"><g transform="translate(720 0) scale(-1 1)"><Character f={f + 40} mood="happy" outfit="party" talk={f % 120 >= 60}/></g></g>
      {[120, 610].map(x => <circle key={x} cx={x} cy="1005" r="28" fill="#2a1b45" stroke="#9aa3d9" strokeWidth="6"/>)}
    </g>
    <Pop f={f} at={20} x={300} y={570}><rect x="160" y="530" width="180" height="62" rx="24" fill="#fff6e8"/><T x={250} y={572} size={26} fill="#231a36" stroke={false}>¡Hola!</T></Pop>
    <Pop f={f} at={60} x={460} y={570}><rect x="380" y="530" width="220" height="62" rx="24" fill="#7df2c9"/><T x={490} y={572} size={26} fill="#231a36" stroke={false}>¿A dónde vas?</T></Pop>
  </g>;
}

function Circles({f}: P) {
  return <g transform="translate(360 790)">
    {[270, 190, 110].map((r, k) => <circle key={r} r={r} fill="none" stroke="#fff4d8" strokeWidth="4" strokeDasharray="6 12" opacity={k === 0 ? 1 - ease(f / 120) * .7 : .7}/>)}
    {Array.from({length: 16}, (_, i) => { const a = i / 16 * Math.PI * 2 + f * .006, o = 1 - ease((f - 20 - i * 4) / 40); return <circle key={i} cx={Math.cos(a) * 270} cy={Math.sin(a) * 270} r="16" fill="#9aa3d9" opacity={Math.max(.15, o)}/>; })}
    {Array.from({length: 8}, (_, i) => { const a = i / 8 * Math.PI * 2 - f * .01; return <circle key={i} cx={Math.cos(a) * 190} cy={Math.sin(a) * 190} r="20" fill="#7df2c9"/>; })}
    {Array.from({length: 4}, (_, i) => { const a = i / 4 * Math.PI * 2 + f * .015; return <Heart key={i} x={Math.cos(a) * 110} y={Math.sin(a) * 110} s={1.3 + wave(f, .2, .15, i)}/>; })}
    <g transform="translate(-360 -800) scale(1)"><g transform="translate(270 540) scale(.25)"><Character f={f} mood="happy"/></g></g>
  </g>;
}

function Brand({f}: P) {
  const clickAt = 95, pressed = f > clickAt, press = f > clickAt && f < clickAt + 6 ? .92 : 1;
  const cx = mix(620, 360, ease((f - 55) / 35)), cy = mix(1150, 1010, ease((f - 55) / 35));
  return <g>
    <Pop f={f} at={0} x={360} y={640} dur={20}><circle cx="360" cy="640" r="200" fill="url(#glow)" opacity=".55"/><Slipper f={f} x={360} y={660} s={1.45}/></Pop>
    <Pop f={f} at={14} x={360} y={860}><T x={360} y={850} size={56} fill="#fff4d9" ls={3}>CIENCIA EN</T><T x={360} y={914} size={64} fill="#d7f36b" ls={4}>PANTUFLAS</T></Pop>
    <Pop f={f} at={28} x={360} y={950}><T x={360} y={952} size={20} fill="#fff4d9" ls={5} opacity={.85}>LA CIENCIA DE TU DÍA A DÍA</T></Pop>
    <Pop f={f} at={40} x={360} y={1010}><g transform={`translate(360 1010) scale(${press}) translate(-360 -1010)`}>
      <rect x="190" y="978" width="340" height="72" rx="36" fill={pressed ? '#3d3657' : '#e2364f'} stroke="#fff" strokeWidth="4"/>
      <T x={pressed ? 345 : 360} y={1025} size={28} stroke={false}>{pressed ? 'SUSCRITO' : 'SUSCRIBIRME'}</T>
      {pressed && <Check x={460} y={1014} s={.9} color="#d7f36b"/>}
    </g></Pop>
    {pressed && <g transform={`translate(590 1014) rotate(${wave(f, .8, 18) * clamp(1 - (f - clickAt) / 40)})`}><path d="M-20 10Q-22 -24 0 -26Q22 -24 20 10L26 18H-26Z" fill="#ffd36b" stroke="#fff" strokeWidth="3"/><circle cy="24" r="6" fill="#ffd36b"/></g>}
    {f > 50 && <g transform={`translate(${cx} ${cy})`}><path d="M0 0L0 44L12 32L22 54L32 50L22 28L38 28Z" fill="#fff" stroke="#231a36" strokeWidth="3"/></g>}
  </g>;
}

export function Graphic({kind, f, d, items}: {kind: string; f: number; d: number; items?: string[]}) {
  const p: P = {f, d, items};
  switch (kind) {
    case 'phone': return <PhoneHook {...p}/>;
    case 'couch': return <Couch f={f}/>;
    case 'couchProud': return <Couch f={f} proud/>;
    case 'brainHappy': return <g><g transform="translate(360 760) scale(1.5)"><Brain f={f} mood="happy"/></g>{Array.from({length: 6}, (_, i) => { const a = i / 6 * Math.PI * 2 + f * .02; return <g key={i} transform={`translate(${360 + Math.cos(a) * 260} ${770 + Math.sin(a) * 200})`}><Stars f={f + i * 9} n={1} x0={0} x1={0} y0={0} y1={0}/><circle r="10" fill="#ffd36b" opacity=".8"/></g>; })}<Pop f={f} at={30} x={560} y={600}><circle cx="560" cy="600" r="48" fill="#3fbf6a" stroke="#fff" strokeWidth="6"/><Check x={560} y={600} s={1.6} color="#fff"/></Pop></g>;
    case 'roadmap': return <Roadmap {...p}/>;
    case 'characterHappy': return <g><Room f={f}/><Character f={f} mood="happy" pose="wave" talk/></g>;
    case 'dial': return <g><g transform="translate(360 640) scale(.7)"><Brain f={f}/></g><Dial f={f} value={.5 + wave(f, .03, .35)}/></g>;
    case 'speakerSoft': return <g><Speaker f={f} x={250} y={800} s={.9} loud={.3}/><g transform="translate(500 800)"><rect x="-26" y="-200" width="52" height="400" rx="26" fill="#1a1630" stroke="#e8f0ff" strokeWidth="6"/><rect x="-16" y={190 - 340 * clamp(.3 + f / 300)} width="32" height={340 * clamp(.3 + f / 300)} rx="16" fill="url(#gold)"/><T x={0} y={250} size={24}>VOLUMEN</T></g></g>;
    case 'brainHot': return <g><g transform="translate(360 790) scale(1.55)"><Brain f={f} tint="#f08a8a" mood="hot"/></g>{[0, 1, 2, 3].map(i => { const t = ((f + i * 15) % 60) / 60; return <path key={i} d={`M${260 + i * 66} ${600 - t * 120}q-14 -20 0 -40t0 -40`} stroke="#fff" strokeWidth="9" fill="none" opacity={(1 - t) * .7} strokeLinecap="round"/>; })}{[[150, 620], [570, 650], [600, 940]].map(([x, y], i) => <Pop key={i} f={f} at={12 + i * 12} x={x} y={y}><path d={`M${x} ${y - 44}L${x + 44} ${y + 34}H${x - 44}Z`} fill="#ffd36b" stroke="#fff" strokeWidth="5" strokeLinejoin="round"/><T x={x} y={y + 26} size={44} fill="#3b2a12" stroke={false}>!</T></Pop>)}</g>;
    case 'party': return <g><Beams f={f}/><Disco f={f}/><Crowd f={f} y={1100} color="#2a0f40"/><g transform="translate(40 30) scale(.9)"><Character f={f} mood="happy" pose="dance" outfit="party"/></g><Battery x={600} y={640} level={.4 + ease(f / 120) * .6} f={f} s={.42} bolt label={false}/></g>;
    case 'lemon': return <g><Lemon f={f} x={360} y={660} s={.9}/>{[0, 1, 2].map(i => { const t = ((f + i * 20) % 60) / 60; return <path key={i} transform={`translate(360 ${800 + t * 160})`} d="M0 -18Q14 0 0 14Q-14 0 0 -18Z" fill="#fff36b" stroke="#fff" strokeWidth="3" opacity={1 - t * .5}/>; })}<g transform="translate(360 1030)" filter="url(#shadow)"><path d="M-140 -20Q0 -70 140 -20Q120 70 0 80Q-120 70 -140 -20Z" fill="#4a1a2a"/><path d="M-90 -6Q0 -40 90 -6Q80 60 0 66Q-80 60 -90 -6Z" fill="#e5707e"/><path d="M0 -20V50" stroke="#c4505e" strokeWidth="5"/></g></g>;
    case 'lemonDrops': return <g><Lemon f={f} x={360} y={600} s={.42}/><Beaker x={220} y={1010} level={.25 + ease(f / 90) * .6} label="INTROVERTIDOS" f={f} color="#9af9e9"/><Beaker x={500} y={1010} level={.2 + ease(f / 90) * .32} label="EXTROVERTIDOS" f={f} color="#ffd36b"/></g>;
    case 'magnifier': return <g><g filter="url(#shadow)"><rect x="150" y="560" width="420" height="500" rx="20" fill="url(#cream)"/>{Array.from({length: 8}, (_, i) => <rect key={i} x="190" y={620 + i * 50} width={300 - (i % 3) * 60} height="14" rx="7" fill="#c9b8a8"/>)}<T x={360} y={605} size={30} fill="#3a2a40" stroke={false}>TEORÍA</T></g>{(() => { const mx = 360 + wave(f, .04, 120), my = 800 + wave(f, .06, 90); return <g transform={`translate(${mx} ${my})`} filter="url(#shadow)"><circle r="96" fill="#bff6ff44" stroke="#fff4d8" strokeWidth="14"/><path d="M68 68L150 150" stroke="url(#wood)" strokeWidth="30" strokeLinecap="round"/><T x={0} y={22} size={70} fill="#ffd36b">?</T></g>; })()}</g>;
    case 'spectrum': { const xs = Array.from({length: 13}, (_, i) => i); return <g filter="url(#shadow)"><defs><linearGradient id="spec" x2="1"><stop stopColor="#7df2e0"/><stop offset=".5" stopColor="#ffd36b"/><stop offset="1" stopColor="#ff5cbf"/></linearGradient></defs>
      {xs.map(i => { const h = Math.exp(-Math.pow((i - 6) / 2.6, 2)) * 300 * ease((f - i * 3) / 30); return <rect key={i} x={86 + i * 44} y={960 - h} width="36" height={h} rx="10" fill="url(#spec)" opacity=".85"/>; })}
      <rect x="80" y="980" width="560" height="34" rx="17" fill="url(#spec)"/><circle cx={360 + wave(f, .035, 180)} cy="997" r="30" fill="#fff4d8" stroke="#2a1b45" strokeWidth="5"/><T x={110} y={1070} size={24} anchor="start">INTRO</T><T x={610} y={1070} size={24} anchor="end">EXTRO</T><T x={360} y={620} size={26}>CASI TODOS AQUÍ</T></g>; }
    case 'dopamine': return <g><Molecule f={f} label="DOPAMINA" y={780} color="url(#party)"/>{Array.from({length: 12}, (_, i) => { const a = i / 12 * Math.PI * 2 + f * .03, r = 250 + wave(f, .1, 20, i); return <circle key={i} cx={360 + Math.cos(a) * r} cy={780 + Math.sin(a) * r} r={5 + (i % 3) * 3} fill="#fff2a8" opacity={.5 + wave(f, .2, .5, i)}/>; })}</g>;
    case 'brainSparks': return <g><g transform="translate(360 800) scale(1.5)"><Brain f={f} mood="happy" tint="#f0b6dc"/></g><circle cx="360" cy="830" r={40 + wave(f, .3, 12)} fill="url(#warmglow)"/>{Array.from({length: 7}, (_, i) => { const a = i / 7 * Math.PI * 2 + f * .02; const x = 360 + Math.cos(a) * 260, y = 800 + Math.sin(a) * 210; return <path key={i} d={`M${x} ${y}l14 -28l-6 22l18 -4l-16 30l6 -22Z`} fill="#ffd36b" opacity={.4 + wave(f, .4, .6, i)} transform={`scale(1.6) translate(${-x * .375} ${-y * .375})`}/>; })}<Pop f={f} at={40} x={560} y={580}><circle cx="560" cy="580" r="54" fill="url(#gold)" stroke="#fff" strokeWidth="6"/><T x={560} y={594} size={40} fill="#5a2a12" stroke={false}>$</T></Pop></g>;
    case 'bulbs': return <g><Bulb x={210} y={800} f={f} bright={1} label="EXTRO" neon/><Bulb x={510} y={830} f={f} bright={.45} label="INTRO"/></g>;
    case 'characterShrug': return <g><Room f={f}/><Sofa f={f} y={860} s={.75}/><g transform="translate(0 -10)"><Character f={f} mood="calm" pose="shrug" talk/></g><Pop f={f} at={20} x={360} y={470}><T x={230} y={600} size={66} fill="#ffd36b">?</T><T x={490} y={580} size={50} fill="#fff4d8">?</T></Pop></g>;
    case 'batteryFull': return <g><Battery x={360} y={790} level={.92 + wave(f, .1, .06)} f={f} s={1.2} bolt/>{[0, 1, 2, 3, 4, 5].map(i => { const a = i / 6 * Math.PI * 2 + f * .02; return <circle key={i} cx={360 + Math.cos(a) * 250} cy={790 + Math.sin(a) * 240} r="9" fill="#d7ff8f" opacity=".7"/>; })}</g>;
    case 'phoneSurvey': return <Phone f={f} x={360} y={800} s={.95}><T x={0} y={-190} size={20} fill="#cfe0ff">ENCUESTA · 15:30</T><Bubble x={-118} y={-110} w={236} text="¿Cómo te sientes?" f={f} at={8} size={21}/>
      {['#ff8a8a', '#ffb347', '#ffd36b', '#b6f08a', '#3fbf6a'].map((c, i) => <Pop key={i} f={f} at={30 + i * 6} x={-92 + i * 46} y={20}><circle cx={-92 + i * 46} cy={20} r="20" fill={c}/><path d={`M${-100 + i * 46} ${26 + (2 - i) * 2}q8 ${(i - 2) * 4} 16 0`} stroke="#2a1b45" strokeWidth="3" fill="none"/></Pop>)}
      <Pop f={f} at={70} x={0} y={130}><rect x="-110" y="100" width="220" height="16" rx="8" fill="#fff4d8" opacity=".4"/><circle cx={mix(-100, 70, ease((f - 75) / 30))} cy="108" r="16" fill="#7df2c9"/></Pop></Phone>;
    case 'batteryDrain': { const lv = mix(.9, .14, ease((f - 20) / (d - 40))); return <g><Battery x={250} y={790} level={lv} f={f} s={1}/><g transform="translate(470 650)"><ClockFace f={f} x={0} y={0} r={90} hour={20} spin={2.2}/></g><Pop f={f} at={30} x={470} y={900}><g transform="translate(270 590) scale(.5)"><Character f={f} mood={lv < .4 ? 'tired' : 'calm'}/></g></Pop></g>; }
    case 'twoBatteries': { const lv = mix(.9, .25, ease(f / d)); return <g><g transform="translate(-130 70) scale(.75)"><Character f={f} mood={lv < .5 ? 'tired' : 'calm'}/></g><g transform="translate(310 70) scale(.75)"><Character f={f + 30} mood={lv < .5 ? 'tired' : 'happy'} outfit="party" cap={false}/></g><Battery x={200} y={560} level={lv} f={f} s={.4} label={false}/><Battery x={530} y={560} level={lv + .05} f={f} s={.4} label={false}/><T x={200} y={1100} size={26}>INTRO</T><T x={530} y={1100} size={26}>EXTRO</T></g>; }
    case 'brainGears': return <g><g transform="translate(360 790) scale(1.6)"><Brain f={f} mood="think"/></g><Gear x={300} y={740} r={36} f={f} speed={3} color="#ffd36b"/><Gear x={370} y={700} r={26} f={f} speed={-4.2} color="#7df2e0"/><Gear x={430} y={760} r={30} f={f} speed={3.6} color="#ff9ad5"/>
      {['CARAS', 'TONOS', 'QUÉ DIGO', 'CÓMO ME VEO'].map((w, i) => { const a = -Math.PI * .9 + i * Math.PI * .6, x = 360 + Math.cos(a) * 270, y = 760 + Math.sin(a) * 260 + (i > 1 ? 120 : 0); return <Pop key={w} f={f} at={10 + i * 18} x={x} y={y}><rect x={x - 96} y={y - 30} width="192" height="58" rx="28" fill="#fff6e8"/><T x={x} y={y + 9} size={22} fill="#231a36" stroke={false}>{w}</T></Pop>; })}</g>;
    case 'calendar': return <Calendar f={f} days={['L', 'M', 'M', 'J', 'V']} highlight={4} title="ESTA SEMANA"/>;
    case 'speakerLoud': return <g><Beams f={f}/><Speaker f={f} x={360} y={800} s={1} loud={1}/><Pop f={f} at={10} x={360} y={1070}><rect x="150" y="1040" width="420" height="40" rx="20" fill="#1a1630"/><rect x="156" y="1046" width={408 * clamp(.6 + wave(f, .4, .35))} height="28" rx="14" fill="url(#red)"/></Pop></g>;
    case 'dbMeter': return <g filter="url(#shadow)">{[[30, 'SUSURRO', '#7df2e0'], [60, 'PLÁTICA', '#b6f08a'], [85, 'TRÁFICO', '#ffd36b'], [100, 'ANTRO', '#ff5c7a']].map(([v, l, c], i) => { const h = Number(v) * 4.2 * ease((f - i * 16) / 26); return <g key={i}><rect x={110 + i * 135} y={1040 - h} width="100" height={h} rx="16" fill={String(c)}/><T x={160 + i * 135} y={1030 - h} size={30}>{h > 10 ? `${v}` : ''}</T><T x={160 + i * 135} y={1085} size={20}>{String(l)}</T></g>; })}<T x={360} y={560} size={26}>DECIBELES (dB)</T></g>;
    case 'ear': return <Ear {...p}/>;
    case 'shout': { const sh = wave(f, 1.4, 4); return <g><Beams f={f}/><g transform="translate(-140 100) scale(.85)"><Character f={f} mood="shock" talk outfit="party" cap={false}/></g><g transform={`translate(${250 + sh} 100) scale(.85)`}><g transform="translate(720 0) scale(-1 1)"><Character f={f + 20} mood="worry" outfit="pajama"/></g></g>
      <Pop f={f} at={14} x={250} y={560}><path d="M120 500H380Q400 500 400 520V590Q400 610 380 610H260L230 650L230 610H120Q100 610 100 590V520Q100 500 120 500Z" fill="#fff6e8" stroke="#231a36" strokeWidth="5"/><T x={250} y={576} size={46} fill="#e2364f" stroke={false}>¿QUÉ?</T></Pop>
      {Array.from({length: 6}, (_, i) => { const t = ((f + i * 12) % 72) / 72; return <T key={i} x={80 + i * 110} y={1050 - t * 400} size={38} fill="#ff9ad5" opacity={1 - t}>♪</T>; })}</g>; }
    case 'disco': return <g><Beams f={f} colors={['#ff5cbf', '#7df2e0', '#ffd36b', '#9aa3d9']}/><Disco f={f} y={560}/><Crowd f={f} y={1080} n={10}/><g transform="translate(90 140) scale(.75)"><Character f={f} mood="worry"/></g>{[['BAÑO', 140, 760], ['FILA', 590, 820]].map(([t, x, y], i) => <Pop key={i} f={f} at={20 + i * 20} x={Number(x)} y={Number(y)}><rect x={Number(x) - 70} y={Number(y) - 30} width="140" height="56" rx="12" fill="#1a1630" stroke="#ff5cbf" strokeWidth="4"/><T x={Number(x)} y={Number(y) + 9} size={24} fill="#ff9ad5">{String(t)}</T></Pop>)}</g>;
    case 'brainClock': return <g><Moon x={580} y={560} r={46} f={f}/><Stars f={f} n={10}/><g transform="translate(360 800) scale(1.6)"><Brain f={f} tint="#c9a8e8"/></g><circle cx="360" cy="830" r={60 + wave(f, .2, 8)} fill="url(#warmglow)" opacity=".7"/><ClockFace f={f} x={360} y={830} r={44} hour={22} spin={1}/><Pop f={f} at={50} x={360} y={1060}><rect x="190" y="1030" width="340" height="56" rx="28" fill="#1a1630" stroke="#ffd36b" strokeWidth="3"/><T x={360} y={1067} size={22} fill="#ffd36b">NÚCLEO SUPRAQUIASMÁTICO</T></Pop></g>;
    case 'melatonin': return <g><Moon x={360} y={600} r={80} f={f}/><Stars f={f} n={16} y0={480} y1={1100}/>{Array.from({length: 7}, (_, i) => { const t = ((f * .7 + i * 30) % 210) / 210; return <g key={i} transform={`translate(${200 + seeded(i) * 320 + wave(f, .04, 20, i)} ${1080 - t * 420}) scale(${.5 + t * .4})`} opacity={1 - Math.abs(t - .5) * 1.6}><circle r="28" fill="url(#coat)" stroke="#c7fff1" strokeWidth="4"/><T x={0} y={8} size={22} fill="#123b50" stroke={false}>M</T></g>; })}<g transform="translate(360 1040) scale(.6)"><Brain f={f} tint="#c9a8e8"/></g></g>;
    case 'adenosine': { const fill = ease(f / d); return <g filter="url(#shadow)"><g transform="translate(300 790)"><path d="M-130 -250H130M-130 250H130" stroke="url(#wood)" strokeWidth="22" strokeLinecap="round"/><path d="M-110 -240Q-110 -60 0 0Q110 -60 110 -240Z M-110 240Q-110 60 0 0Q110 60 110 240Z" fill="#ffffff22" stroke="#eaf6ff" strokeWidth="6"/>
      <path d={`M${-110 + fill * 60} ${-240 + fill * 160}Q0 ${-230 + fill * 170} ${110 - fill * 60} ${-240 + fill * 160}Q90 -40 0 0Q-90 -40 ${-110 + fill * 60} ${-240 + fill * 160}Z`} fill="#c9a8e8" opacity={1 - fill}/>
      <path d={`M-110 240Q-100 ${240 - fill * 170} 0 ${240 - fill * 200}Q100 ${240 - fill * 170} 110 240Z`} fill="#c9a8e8"/>
      {Array.from({length: 8}, (_, i) => <T key={i} x={-60 + (i % 4) * 40} y={180 - Math.floor(i / 4) * 40} size={22} fill="#3a1f55" stroke={false} opacity={clamp(fill * 8 - i)}>A</T>)}</g>
      <Pop f={f} at={50} x={560} y={900}><g transform="translate(560 900) scale(.9)"><path d="M-50 -50h100l-10 90q-40 18 -80 0Z" fill="url(#cream)" stroke="#fff" strokeWidth="4"/><ellipse cy="-50" rx="50" ry="12" fill="#5a2a22"/><path d="M48 -26q30 -4 26 24q-4 20 -30 16" fill="none" stroke="#f3e5d0" strokeWidth="9"/></g><T x={560} y={1010} size={22}>CAFEÍNA</T></Pop></g>; }
    case 'owlLark': return <OwlLark {...p}/>;
    case 'characterSleepy': return <g><Moon x={600} y={560} r={44} f={f}/><ClockFace f={f} x={140} y={610} r={80} hour={23} spin={.4}/><Character f={f} mood="tired" pose="phone"/><Zzz f={f} x={470} y={600}/></g>;
    case 'ageLine': { const pts = [[140, 'ADOLESCENCIA', 0], [360, 'ADULTEZ', 1], [580, 'MADUREZ', 2]] as const; const sx = mix(140, 580, ease((f - 10) / (d * .7))); return <g filter="url(#shadow)"><path d="M90 1000H630" stroke="#fff4d8" strokeWidth="8" strokeLinecap="round"/>
      <path d="M140 640Q360 720 580 860" stroke="#7df2e0" strokeWidth="8" strokeDasharray="4 16" fill="none" strokeLinecap="round"/><T x={110} y={600} size={22} anchor="start">SE DUERME TARDE</T><T x={610} y={920} size={22} anchor="end">MADRUGA MÁS</T>
      {pts.map(([x, l, i]) => <g key={l}><circle cx={x} cy={1000} r="16" fill="#fff4d8"/><T x={x} y={1050} size={22}>{l}</T><g transform={`translate(${x - 360 * .3} ${770 + i * 20}) scale(.3)`}><Character f={f + i * 30} mood={i === 2 ? 'happy' : 'calm'} cap={false} gray={i === 2} glasses={i === 2}/></g></g>)}
      <g transform={`translate(${sx} ${mix(600, 820, (sx - 140) / 440)})`}><circle r="34" fill="url(#gold)" opacity=".9"/></g></g>; }
    case 'characterYawn': return <g><Room f={f}/><Character f={f} mood="yawn" glasses gray={f > d * .45}/><Zzz f={f} x={470} y={560}/></g>;
    case 'scaleEven': return <Scale f={f} tilt={wave(f, .05, 6)} leftLabel="SALIR" rightLabel="CASA" left={<T x={0} y={-10} size={60} fill="#ffd36b">?</T>} right={<T x={0} y={-10} size={60} fill="#ffd36b">?</T>}/>;
    case 'effortCurve': { const t = clamp(f / d), bx = mix(130, 600, t), by = 600 + Math.pow((bx - 130) / 470, .6) * 380; return <g filter="url(#shadow)"><path d="M110 1020H640M110 1020V560" stroke="#fff4d8" strokeWidth="6" strokeLinecap="round"/><path d={Array.from({length: 40}, (_, i) => { const x = mix(130, 600, i / 39); return `${i ? 'L' : 'M'}${x} ${600 + Math.pow((x - 130) / 470, .6) * 380}`; }).join('')} stroke="url(#gold)" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <circle cx={bx} cy={by - 24} r="24" fill="#7df2e0" stroke="#fff" strokeWidth="4"/><T x={370} y={1072} size={24}>ESFUERZO →</T><g transform="translate(80 800) rotate(-90)"><T x={0} y={0} size={24}>VALOR →</T></g></g>; }
    case 'checklist': { const it = items || []; return <g filter="url(#shadow)"><rect x="110" y="530" width="500" height="590" rx="26" fill="url(#cream)" stroke="#fff" strokeWidth="6"/><rect x="270" y="510" width="180" height="50" rx="14" fill="url(#wood)"/>
      {it.map((s, i) => <Pop key={s} f={f} at={10 + i * Math.max(12, (d - 60) / it.length)} x={150} y={620 + i * 96}><Cross x={160} y={620 + i * 96} color="#e2364f"/><T x={195} y={630 + i * 96} size={27} fill="#3a2a40" anchor="start" stroke={false}>{s}</T></Pop>)}</g>; }
    case 'homeStuff': { const door = ease((f - 20) / 30); return <g><g filter="url(#shadow)"><rect x="80" y="540" width="200" height="440" rx="22" fill="#e9eef8" stroke="#fff" strokeWidth="5"/><rect x="88" y="560" width="184" height="400" fill="#fff7d6" opacity={door}/><path d={`M80 540h${200 * (1 - door * .8)}v440h${-200 * (1 - door * .8)}Z`} fill="#dfe6f3" stroke="#fff" strokeWidth="5"/>{door > .5 && <><rect x="110" y="640" width="60" height="60" rx="10" fill="#ff9a62"/><rect x="190" y="660" width="40" height="80" rx="8" fill="#9af9e9"/><circle cx="150" cy="820" r="30" fill="#ffd36b"/></>}</g>
      <g transform="translate(470 680)" filter="url(#shadow)"><rect x="-150" y="-110" width="300" height="190" rx="18" fill="url(#device)" stroke="#9aa3d9" strokeWidth="6"/><rect x="-134" y="-96" width="268" height="162" rx="10" fill="url(#screen)"/><path d="M-14 -40L26 -15L-14 10Z" fill="#fff"/><path d="M-50 80L-70 120M50 80L70 120" stroke="#9aa3d9" strokeWidth="8"/></g>
      <g transform="translate(-10 120) scale(.9)"><Blanket f={f} y={850}/></g>{[0, 1, 2].map(i => <Pop key={i} f={f} at={60 + i * 14} x={330 + i * 70} y={1070}><ellipse cx={330 + i * 70} cy={1070 - (i % 2) * 20} rx="16" ry="26" fill="#fff4d8" opacity=".75" transform={`rotate(-70 ${330 + i * 70} ${1070 - (i % 2) * 20})`}/></Pop>)}<T x={420} y={1120} size={22}>3 PASOS</T></g>; }
    case 'scaleHome': return <Scale f={f} tilt={mix(0, 22, ease(f / 40))} leftLabel="SALIR" rightLabel="CASA" left={<g transform="scale(.4) translate(0 -60)"><Disco f={f} x={0} y={0} r={70}/></g>} right={<House f={f} x={0} y={-60} s={.38}/>}/>;
    case 'wallet': return <g><g transform="translate(360 840)" filter="url(#shadow)"><rect x="-200" y="-110" width="400" height="230" rx="30" fill="url(#wood)" stroke="#f6d4a8" strokeWidth="6"/><path d={`M-200 -110H200L${200 - ease(f / 30) * 20} ${-110 - ease(f / 30) * 120}H${-200 + ease(f / 30) * 20}Z`} fill="#a86a40" stroke="#f6d4a8" strokeWidth="6"/><circle cx="0" cy="30" r="30" fill="url(#gold)" stroke="#fff" strokeWidth="4"/></g>
      {Array.from({length: 3}, (_, i) => { const t = clamp((f - 30 - i * 15) / 90); return t > 0 && <g key={i} transform={`translate(${360 + wave(f, .2, 60, i) + (i - 1) * 90} ${720 - t * 260})`} opacity={1 - t * .6}><ellipse rx="10" ry="16" fill="#8a7a6a"/><ellipse cx={-14} rx="16" ry={10 + wave(f, .9, 6)} fill="#c9b8a8"/><ellipse cx={14} rx="16" ry={10 + wave(f, .9, 6)} fill="#c9b8a8"/></g>; })}
      <Pop f={f} at={50} x={360} y={1080}><rect x="200" y="1040" width="320" height="64" rx="16" fill="#1a1630"/><T x={360} y={1083} size={26} fill="#ffd36b">QUINCENA: 12 DÍAS</T></Pop></g>;
    case 'brainPredict': return <g><g transform="translate(360 800)"><circle r="270" fill="none" stroke="#7df2e0" strokeWidth="3" opacity=".4"/><circle r="190" fill="none" stroke="#7df2e0" strokeWidth="3" opacity=".4"/><path d="M0 0L0 -270A270 270 0 0 1 120 -242Z" fill="#7df2e0" opacity=".3" transform={`rotate(${f * 3})`}/></g><g transform="translate(360 800) scale(1.3)"><Brain f={f} mood="think"/></g>{[[160, 600], [580, 680], [200, 1020], [560, 1000]].map(([x, y], i) => <Pop key={i} f={f} at={20 + i * 16} x={x} y={y}><circle cx={x} cy={y} r="30" fill="#e2364f" opacity={.6 + wave(f, .3, .4, i)}/><T x={x} y={y + 12} size={34} stroke={false}>!</T></Pop>)}</g>;
    case 'cityUnknown': return <g><Moon x={590} y={560} r={40} f={f}/><g filter="url(#shadow)">{Array.from({length: 7}, (_, i) => { const h = 200 + seeded(i + 2) * 260, x = i * 104 - 10; return <g key={i}><rect x={x} y={1100 - h} width="96" height={h} fill="#141a3f" stroke="#2c3670" strokeWidth="3"/>{Array.from({length: 8}, (_, k) => seeded(i * 9 + k) > .55 && <rect key={k} x={x + 14 + (k % 3) * 26} y={1100 - h + 20 + Math.floor(k / 3) * 46} width="14" height="20" fill="#ffd36b" opacity={.4 + wave(f, .05, .3, k)}/>)}</g>; })}</g>
      {Array.from({length: 6}, (_, i) => <T key={i} x={100 + i * 105 + wave(f, .04, 16, i)} y={640 + seeded(i + 30) * 200 + wave(f, .06, 14, i)} size={50 + seeded(i) * 30} fill="#ffd36b" opacity={.5 + wave(f, .1, .4, i)}>?</T>)}
      <g transform="translate(470 1060)"><path d="M0 0V-260" stroke="#3a4270" strokeWidth="10"/><circle cy="-262" r="16" fill="#ffe9a8"/><path d="M0 -250L-80 0H80Z" fill="#ffe9a8" opacity=".12"/></g><g transform="translate(250 590) scale(.45)"><Character f={f} mood="worry" pose="phone" cap={false}/></g></g>;
    case 'houseSafe': return <g>{Array.from({length: 30}, (_, i) => { const x = seeded(i) * 720, y = ((seeded(i + 50) * 700 + f * 14) % 700) + 480; const dx = x - 360, dy = y - 820; const inside = dx * dx + dy * dy < 290 * 290; return !inside && <path key={i} d={`M${x} ${y}l-4 22`} stroke="#9fd6ff" strokeWidth="3" opacity=".6"/>; })}<circle cx="360" cy="820" r="290" fill="#ffe9a8" opacity=".08" stroke="#ffe9a8" strokeWidth="5" strokeDasharray="10 14" transform={`rotate(${f * .4} 360 820)`}/><House f={f} y={880} s={1.2}/></g>;
    case 'remote': return <g><g transform="translate(360 690)" filter="url(#shadow)"><rect x="-230" y="-150" width="460" height="270" rx="22" fill="url(#device)" stroke="#9aa3d9" strokeWidth="6"/><rect x="-210" y="-130" width="420" height="230" rx="12" fill="url(#screen)" opacity={.6 + wave(f, .05, .2)}/><T x={0} y={0} size={34}>{['LUZ', 'VOLUMEN', 'COMIDA', 'DORMIR'][Math.floor(f / 30) % 4]}</T></g>
      <g transform={`translate(380 ${1000 + wave(f, .06, 8)}) rotate(${-20 + wave(f, .04, 6)})`} filter="url(#shadow)"><rect x="-50" y="-120" width="100" height="240" rx="40" fill="#2a2440" stroke="#9aa3d9" strokeWidth="5"/><circle cy="-80" r="16" fill="#e2364f"/>{[0, 1, 2, 3, 4, 5].map(i => <circle key={i} cx={-20 + (i % 2) * 40} cy={-30 + Math.floor(i / 2) * 40} r="12" fill={f % 30 < 6 && i === Math.floor(f / 30) % 6 ? '#ffd36b' : '#5a5280'}/>)}</g></g>;
    case 'calendar2020': return <g><g filter="url(#shadow)"><rect x="130" y="560" width="460" height="470" rx="30" fill="url(#cream)" stroke="#fff" strokeWidth="6"/><rect x="130" y="560" width="460" height="110" rx="30" fill="#4fb39c"/><T x={360} y={635} size={56} stroke={false}>2020</T></g><House f={f} x={360} y={900} s={.6}/><g transform="translate(560 1020)"><path d={`M0 0V${-80 * ease(f / 80)}`} stroke="#3fbf6a" strokeWidth="8"/>{ease(f / 80) > .5 && <><ellipse cx="-18" cy="-60" rx="20" ry="10" fill="#3fbf6a"/><ellipse cx="18" cy="-80" rx="20" ry="10" fill="#3fbf6a"/></>}<path d="M-30 0h60l-8 40h-44Z" fill="#c04f55"/></g></g>;
    case 'stories': return <Phone f={f} x={360} y={800} s={1}><defs><clipPath id="phoneScreen"><rect x="-132" y="-252" width="264" height="504" rx="28"/></clipPath></defs><g clipPath="url(#phoneScreen)">{[0, 1, 2, 3].map(i => <rect key={i} x={-120 + i * 62} y="-236" width="54" height="6" rx="3" fill="#fff" opacity={i < Math.floor(f / 40) % 5 ? 1 : .35}/>)}<rect x="-132" y="-220" width="264" height="470" fill="#5b2194" opacity=".8"/><Beams f={f}/><g transform="scale(.5) translate(-360 -700)"><Disco f={f} x={360} y={400}/><Crowd f={f} y={1040}/></g>
      {Array.from({length: 18}, (_, i) => <rect key={i} x={-120 + seeded(i) * 240} y={-200 + ((seeded(i + 3) * 400 + f * 3) % 420)} width="8" height="14" fill={['#ffd36b', '#7df2e0', '#ff7aa8'][i % 3]} transform={`rotate(${f * 5 + i * 20})`}/>)}</g></Phone>;
    case 'jomo': return <g><Room f={f}/><SeatedCharacter f={f} mood="blissful" pose="mug"/><Sofa f={f} y={985}/><Blanket f={f} y={960}/><Pop f={f} at={30} x={560} y={560}><g transform="translate(560 560)"><circle r="76" fill="#1a1630" stroke="#fff4d8" strokeWidth="5"/><g transform="scale(.2) translate(-360 -1000)"><Crowd f={f} y={1000} n={6}/></g><Cross x={0} y={0} s={3} color="#ff5c7a"/></g></Pop></g>;
    case 'phoneCancel': return <g><g transform="translate(-150 120) scale(.85)"><Character f={f} mood="happy" pose="cheer"/></g><Phone f={f} x={500} y={800} s={.8}><Bubble x={-118} y={-120} w={236} text="Oye, ¿y si mejor" f={f} at={6} size={20}/><Bubble x={-118} y={-56} w={236} text="lo dejamos para" f={f} at={6} size={20}/><Bubble x={-118} y={8} w={190} text="otro día?" f={f} at={6} size={20}/><Bubble x={-60} y={110} w={170} text="¡Claro!" f={f} at={40} mine/></Phone>
      {Array.from({length: 30}, (_, i) => f > 40 && <rect key={i} x={seeded(i) * 720} y={480 + ((seeded(i + 9) * 300 + (f - 40) * (4 + seeded(i) * 3)))} width="10" height="18" rx="3" fill={['#ffd36b', '#7df2e0', '#ff7aa8', '#d7f36b'][i % 4]} transform={`rotate(${f * 6 + i * 30} ${seeded(i) * 720} 700)`}/>)}</g>;
    case 'graph': return <Graph {...p}/>;
    case 'train': return <Train {...p}/>;
    case 'brainThink': return <g><g transform="translate(360 760) scale(1.3)"><Brain f={f} mood="think"/></g><Pop f={f} at={10} x={170} y={980}><g transform="translate(170 980)" filter="url(#shadow)"><rect x="-80" y="-100" width="160" height="200" rx="18" fill="#2a2440" stroke="#9aa3d9" strokeWidth="5"/><rect x="-62" y="-82" width="124" height="44" rx="8" fill="#b6f08a"/><T x={44} y={-48} size={26} fill="#1a3a12" anchor="end" stroke={false}>{Math.floor(f * 7) % 1000}</T>{Array.from({length: 9}, (_, i) => <rect key={i} x={-58 + (i % 3) * 42} y={-22 + Math.floor(i / 3) * 40} width="32" height="30" rx="6" fill="#5a5280"/>)}</g><Check x={170} y={1120} color="#9cf5a8"/></Pop>
      <Pop f={f} at={40} x={550} y={980}><g transform={`translate(550 980) rotate(${wave(f, .3, 3)})`} filter="url(#shadow)"><circle r="80" fill="#bff6ff66" stroke="#fff" strokeWidth="5"/><path d="M-30 -60L10 -10L-20 20L30 70" stroke="#fff" strokeWidth="4" fill="none"/><path d="M-70 80h140l-20 30h-100Z" fill="url(#wood)"/></g><Cross x={550} y={1140} color="#ff8a8a"/></Pop></g>;
    case 'solitude': return <g><rect x="0" y="480" width="360" height="660" fill="#ffd36b" opacity=".15"/><g transform="translate(-100 160) scale(.72)"><Character f={f} mood="blissful" pose="mug"/></g><Battery x={190} y={560} level={.4 + ease(f / d) * .5} f={f} s={.3} bolt label={false}/><T x={180} y={1100} size={24}>SOLEDAD ELEGIDA</T>
      <g transform="translate(530 620)"><ellipse rx="110" ry="50" fill="#5a6280"/><ellipse cx="-60" cy="10" rx="60" ry="36" fill="#5a6280"/><ellipse cx="60" cy="14" rx="60" ry="36" fill="#5a6280"/>{Array.from({length: 8}, (_, i) => { const t = ((f + i * 9) % 40) / 40; return <path key={i} d={`M${-80 + i * 22} ${50 + t * 300}l-3 16`} stroke="#9fb6d6" strokeWidth="3"/>; })}</g><g transform="translate(530 1000)"><circle cy="-130" r="34" fill="#7a8098"/><path d="M-50 0Q-50 -90 0 -92Q50 -90 50 0Z" fill="#7a8098"/></g><T x={530} y={1100} size={24}>AISLAMIENTO</T></g>;
    case 'circles': return <Circles {...p}/>;
    case 'tipBattery': return <g><Battery x={360} y={640} level={.5} f={f} s={.45} label={false}/>{[['CAFÉ', 150], ['CENA CHICA', 360], ['PELI', 570]].map(([l, x], i) => <Pop key={i} f={f} at={20 + i * 24} x={Number(x)} y={940}><rect x={Number(x) - 95} y={830} width="190" height="210" rx="26" fill="url(#cream)" stroke="#fff" strokeWidth="5" filter="url(#shadow)"/>
      {i === 0 && <g transform={`translate(${x} 920)`}><path d="M-34 -30h68l-8 64q-26 12 -52 0Z" fill="#c04f55"/><path d="M32 -14q24 0 18 22q-4 12 -20 10" fill="none" stroke="#c04f55" strokeWidth="7"/></g>}
      {i === 1 && <g transform={`translate(${x} 925)`}><ellipse rx="60" ry="22" fill="#fff" stroke="#c9b8a8" strokeWidth="4"/><ellipse rx="32" ry="12" fill="#ff9a62"/><path d="M-80 -30v60M80 -30v60" stroke="#9aa3d9" strokeWidth="6" strokeLinecap="round"/></g>}
      {i === 2 && <g transform={`translate(${x} 925)`}><path d="M-40 -40h80l-12 80h-56Z" fill="#e2364f"/><path d="M-26 -40v80M0 -40v80M26 -40v80" stroke="#fff" strokeWidth="6"/>{[-24, 0, 24].map(px => <circle key={px} cx={px} cy="-46" r="16" fill="#fff6d0"/>)}</g>}
      <T x={Number(x)} y={1012} size={22} fill="#3a2a40" stroke={false}>{String(l)}</T></Pop>)}</g>;
    case 'sunClock': return <g><g transform={`translate(360 ${mix(560, 640, ease(f / d))})`}><circle r="110" fill="url(#gold)" opacity=".9"/></g><ClockFace f={f} x={360} y={860} r={150} hour={18} minute={0}/><T x={360} y={1090} size={30}>6:00 P.M.</T></g>;
    case 'door': { const open = ease((f - 10) / 40), walk = ease((f - 50) / (d - 60)); return <g><g transform="translate(360 820)" filter="url(#shadow)"><rect x="-150" y="-280" width="300" height="540" rx="10" fill="#fff4c8"/><circle r="260" fill="url(#warmglow)" opacity={open * .6}/><path d={`M-150 -280L${-150 + 300 * (1 - open * .75)} ${-280 + open * 30}V${260 - open * 30}L-150 260Z`} fill="url(#wood)" stroke="#f6d4a8" strokeWidth="6"/><rect x="-90" y="-350" width="180" height="56" rx="10" fill="#3fbf6a"/><T x={0} y={-312} size={28} stroke={false}>SALIDA</T></g>
      <g transform={`translate(${mix(-120, 120, walk)} ${60 + Math.abs(wave(f, .3, 8))}) scale(.85)`} opacity={1 - clamp((walk - .85) * 6)}><Character f={f} mood="happy" pose="wave" outfit="party" cap={false}/></g></g>; }
    case 'balanceHeart': return <Scale f={f} tilt={wave(f, .04, 4)} leftLabel="TU ENERGÍA" rightLabel="TU GENTE" left={<g transform="translate(0 -50)"><Battery x={0} y={0} level={.8} f={f} s={.3} label={false}/></g>} right={<Heart x={0} y={-50} s={3}/>}/>;
    case 'brand': return <Brand {...p}/>;
    default: return <g/>;
  }
}
