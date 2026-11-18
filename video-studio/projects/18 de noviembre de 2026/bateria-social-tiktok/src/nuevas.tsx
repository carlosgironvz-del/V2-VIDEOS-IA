import React from 'react';
import {Brain, Character, Check, ClockFace, Cross, Heart, Molecule, Moon, Pop, Stars, T, Zzz, clamp, ease, mix, seeded, wave} from './art';
import {LiteralYoLogo} from './logo';

/* Escenas nuevas del TikTok "Soy ese que se despierta antes de la alarma" (lienzo 720×1280, zona focal y∈[500,1110]). */

export function AlarmClock({f, x, y, s = 1, time, ringing = false, beaten = false}: {f: number; x: number; y: number; s?: number; time: string; ringing?: boolean; beaten?: boolean}) {
  const shake = ringing ? wave(f, 2.2, 5) : 0;
  return <g transform={`translate(${x + shake} ${y}) rotate(${ringing ? wave(f, 2.2, 4) : 0}) scale(${s})`} filter="url(#shadow)">
    {[-1, 1].map(k => <g key={k}><circle cx={k * 62} cy="-78" r="26" fill="url(#gold)" stroke="#fff2c7" strokeWidth="4"/><path d={`M${k * 50} -60L${k * 40} -48`} stroke="#3b2a12" strokeWidth="6"/></g>)}
    <rect x="-110" y="-62" width="220" height="130" rx="34" fill="url(#device)" stroke="#9aa3d9" strokeWidth="6"/>
    <rect x="-90" y="-44" width="180" height="94" rx="16" fill="#0d1230"/>
    <text x="0" y="22" textAnchor="middle" fontSize="58" fontWeight="900" fill={beaten ? '#7df2c9' : '#ff5c7a'} letterSpacing="2" style={{fontVariantNumeric: 'tabular-nums'}}>{time}</text>
    <path d="M-80 68l-16 26M80 68l16 26" stroke="#9aa3d9" strokeWidth="9" strokeLinecap="round"/>
    {ringing && [0, 1, 2].map(i => <path key={i} d={`M${130 + i * 18} ${-50 - i * 10}q18 40 0 80`} stroke="#ffd36b" strokeWidth="6" fill="none" opacity={.4 + wave(f, .6, .5, i)} strokeLinecap="round"/>)}
    {beaten && <Cross x={0} y={0} s={4} color="#ff5c7a"/>}
  </g>;
}

function Bed({f, children, y = 900}: {f: number; children?: React.ReactNode; y?: number}) {
  return <g>
    <path d={`M120 ${y - 300}Q120 ${y - 340} 160 ${y - 340}H560Q600 ${y - 340} 600 ${y - 300}V${y}H120Z`} fill="url(#wood)" stroke="#f6d4a8" strokeWidth="6" filter="url(#shadow)"/>
    <ellipse cx="360" cy={y - 335} rx="165" ry="52" fill="url(#cream)" stroke="#fff" strokeWidth="4"/>
    {children}
    <path d={`M90 ${y - 40}Q360 ${y - 90 + wave(f, .05, 5)} 630 ${y - 40}L650 ${y + 150}H70Z`} fill="url(#blanket)" stroke="#d6fff1" strokeWidth="6" filter="url(#shadow)"/>
    {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M${130 + i * 110} ${y - 50}l10 190`} stroke="#ecfff8" strokeWidth="5" opacity=".3"/>)}
  </g>;
}

function BedCharacter({f, mood}: {f: number; mood: any}) {
  return <g transform="translate(90 170) scale(.75)"><Character f={f} mood={mood} pose="rest"/></g>;
}

function AlarmWake({f, d}: {f: number; d: number}) {
  const awake = f > 26;
  return <g>
    <Moon x={600} y={540} r={40} f={f}/><Stars f={f} n={10} y0={490} y1={640}/>
    <Bed f={f} y={980}><BedCharacter f={f} mood={awake ? 'shock' : 'sleep'}/></Bed>
    {!awake && <Zzz f={f} x={460} y={680}/>}
    <g filter="url(#shadow)"><rect x="560" y="760" width="140" height="150" rx="14" fill="url(#wood)" stroke="#f6d4a8" strokeWidth="4"/></g><AlarmClock f={f} x={630} y={712} s={.5} time="5:59" ringing={f > 26 && f < 40}/>
    <Pop f={f} at={28} x={200} y={600}><T x={180} y={600} size={70} fill="#ffd36b">!</T></Pop>
  </g>;
}

function LabBed({f}: {f: number}) {
  const pts = Array.from({length: 40}, (_, i) => `${i * 7},${Math.sin(i * .7 + f * .3) * (12 + seeded(i) * 10)}`).join(' ');
  return <g>
    <g transform="translate(560 545) scale(.78)" filter="url(#shadow)"><rect x="-130" y="-80" width="260" height="160" rx="18" fill="url(#device)" stroke="#9aa3d9" strokeWidth="6"/><rect x="-112" y="-62" width="224" height="124" rx="10" fill="#0d1230"/><polyline points={pts} transform="translate(-100 0)" fill="none" stroke="#7df2c9" strokeWidth="4"/><T x={0} y={-30} size={16} fill="#7df2c9" stroke={false}>EEG · SUEÑO</T><path d="M-30 80v40M30 80v40" stroke="#9aa3d9" strokeWidth="8"/></g>
    <Bed f={f} y={1000}><BedCharacter f={f} mood="sleep"/></Bed>
    <path d={`M330 640Q380 ${560 + wave(f, .05, 6)} 400 600`} stroke="#ff9ad5" strokeWidth="5" fill="none"/><path d={`M390 650Q410 ${600 + wave(f, .05, 6, 1)} 380 620`} stroke="#7df2e0" strokeWidth="5" fill="none"/>
    <Zzz f={f} x={160} y={700}/>
  </g>;
}

function TwoClocks({f}: {f: number}) {
  return <g>
    {[['GRUPO A', '6:00', 200, 0], ['GRUPO B', '9:00', 520, 1]].map(([g, t, x, i]) => <Pop key={String(g)} f={f} at={8 + Number(i) * 40} x={Number(x)} y={800}>
      <AlarmClock f={f} x={Number(x)} y={820} s={.95} time={String(t)}/>
      <T x={Number(x)} y={660} size={32}>{String(g)}</T>
      <T x={Number(x)} y={970} size={24} fill="#dfe7ff">{i ? 'DUERME HASTA TARDE' : 'MADRUGA'}</T>
    </Pop>)}
    <T x={360} y={1080} size={26} fill="#ffd36b" opacity={clamp((f - 70) / 15)}>¿QUÉ HACE SU CUERPO?</T>
  </g>;
}

function ACTH({f, d}: {f: number; d: number}) {
  const prog = ease(f / (d * .8));
  const curve = (x: number) => { const t = (x - 120) / 480; return 1000 - (t < .55 ? 30 * t : 30 * .55 + Math.pow((t - .55) / .45, 1.6) * 300); };
  const xEnd = mix(120, 600, prog);
  const path = Array.from({length: 49}, (_, i) => { const x = mix(120, xEnd, i / 48); return `${i ? 'L' : 'M'}${x} ${curve(x)}`; }).join('');
  return <g filter="url(#shadow)">
    <g transform="translate(0 -60)"><Molecule f={f} label="ACTH" x={540} y={640} color="url(#red)" nodes={5}/></g>
    <path d="M110 1010H620M110 1010V700" stroke="#fff4d8" strokeWidth="6" strokeLinecap="round"/>
    {['3:00', '4:00', '5:00', '6:00'].map((t, i) => <T key={t} x={130 + i * 157} y={1052} size={22}>{t}</T>)}
    <rect x={130 + 2 * 157 - 4} y="700" width="161" height="310" fill="#ffd36b" opacity=".12"/>
    <path d={path} stroke="url(#red)" strokeWidth="10" fill="none" strokeLinecap="round"/>
    <circle cx={xEnd} cy={curve(xEnd)} r="14" fill="#fff4d8"/>
    <T x={200} y={740} size={22} anchor="start">HORMONA</T>
  </g>;
}

function CortisolSun({f, d}: {f: number; d: number}) {
  const rise = ease(f / (d * .7));
  return <g>
    <g transform={`translate(360 ${mix(1000, 720, rise)})`}><circle r="190" fill="url(#warmglow)" opacity=".7"/><circle r="110" fill="url(#gold)"/>{Array.from({length: 12}, (_, i) => <path key={i} d="M0 -130v-30" transform={`rotate(${i * 30 + f * .5})`} stroke="#ffd36b" strokeWidth="8" strokeLinecap="round"/>)}</g>
    <rect x="0" y="980" width="720" height="160" fill="#592c48" opacity=".9"/>
    <g transform="translate(560 940)" filter="url(#shadow)"><path d="M-50 -50h100l-10 90q-40 18 -80 0Z" fill="url(#cream)" stroke="#fff" strokeWidth="4"/><ellipse cy="-50" rx="50" ry="12" fill="#5a2a22"/><path d="M48 -26q30 -4 26 24q-4 20 -30 16" fill="none" stroke="#f3e5d0" strokeWidth="9"/>{[0, 1].map(i => <path key={i} d={`M${-14 + i * 26} -66q${wave(f, .05, 8, i)} -20 0 -40`} stroke="#fff" strokeWidth="6" fill="none" opacity=".5" strokeLinecap="round"/>)}</g>
    <Pop f={f} at={30} x={190} y={900}><g transform="translate(190 900)"><circle r="70" fill="url(#coat)" stroke="#c7fff1" strokeWidth="6"/><T x={0} y={9} size={22} fill="#123b50" stroke={false}>CORTISOL</T></g></Pop>
  </g>;
}

function BrainGearsAlarm({f}: {f: number}) {
  return <g>
    <g transform="translate(360 860) scale(1.45)"><Brain f={f} mood="think"/></g>
    {[[300, 820, 34, 3, '#ffd36b'], [372, 780, 24, -4.2, '#7df2e0'], [430, 840, 28, 3.6, '#ff9ad5']].map(([x, y, r, sp, c], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${f * Number(sp)})`}>{Array.from({length: 8}, (_, k) => <rect key={k} x={-Number(r) * .18} y={-Number(r) * 1.25} width={Number(r) * .36} height={Number(r) * .5} rx="4" fill={String(c)} transform={`rotate(${k * 45})`}/>)}<circle r={Number(r)} fill={String(c)}/><circle r={Number(r) * .38} fill="#2a1b45"/></g>)}
    <Pop f={f} at={14} x={520} y={580}><circle cx="430" cy="680" r="12" fill="#fff6e8"/><circle cx="465" cy="640" r="18" fill="#fff6e8"/><ellipse cx="540" cy="570" rx="130" ry="80" fill="#fff6e8"/><AlarmClock f={f} x={540} y={580} s={.45} time="6:00"/></Pop>
    <Pop f={f} at={50} x={200} y={600}><Check x={180} y={600} s={2.2} color="#3fbf6a"/></Pop>
  </g>;
}

function WeekAlarm({f, d}: {f: number; d: number}) {
  const days = ['L', 'M', 'M', 'J', 'V'];
  return <g>
    {days.map((dd, i) => { const x = 128 + i * 116; return <Pop key={i} f={f} at={6 + i * 12} x={x} y={760}>
      <rect x={x - 50} y="660" width="100" height="190" rx="20" fill="url(#cream)" stroke="#fff" strokeWidth="4" filter="url(#shadow)"/>
      <T x={x} y={712} size={34} fill="#3a2a40" stroke={false}>{dd}</T>
      <T x={x} y={776} size={26} fill="#c04f55" stroke={false}>6:00</T>
      <Check x={x} y={820} color="#3fbf6a"/>
    </Pop>; })}
    {(() => { const p = ease((f - 80) / 30); return p > 0 && <g opacity={p}>
      <AlarmClock f={f} x={210} y={1010} s={.55} time="6:00" beaten/>
      <g transform="translate(330 610) scale(.42)"><Character f={f} mood="happy" pose="wave"/></g>
      <T x={470} y={1120} size={26}>¡LE GANAS!</T>
    </g>; })()}
  </g>;
}

function BrainWorry({f}: {f: number}) {
  return <g>
    <g transform="translate(360 860) scale(1.4)"><Brain f={f} mood="hot" tint="#e8a0b8"/></g>
    <ClockFace f={f} x={170} y={620} r={70} hour={5} spin={4}/>
    <Pop f={f} at={12} x={500} y={600}><rect x="340" y="550" width="330" height="100" rx="30" fill="#fff6e8"/><path d="M400 648l-20 34l50-34Z" fill="#fff6e8"/><T x={505} y={590} size={22} fill="#e2364f" stroke={false}>¿Y SI NO SUENA?</T><T x={505} y={628} size={22} fill="#e2364f" stroke={false}>¿Y SI LLEGO TARDE?</T></Pop>
    {[0, 1, 2].map(i => { const t = ((f + i * 14) % 42) / 42; return <path key={i} d={`M${300 + i * 60} ${740 - t * 90}q-12 -18 0 -36`} stroke="#fff" strokeWidth="7" fill="none" opacity={(1 - t) * .7} strokeLinecap="round"/>; })}
  </g>;
}

function CharacterProud({f}: {f: number}) {
  return <g>
    {Array.from({length: 24}, (_, i) => <rect key={i} x={seeded(i) * 720} y={(seeded(i + 4) * 700 + f * (2 + seeded(i) * 2)) % 660 + 470} width="10" height="18" rx="3" fill={['#ffd36b', '#7df2e0', '#ff7aa8', '#d7f36b'][i % 4]} transform={`rotate(${f * 4 + i * 30} ${seeded(i) * 720} 760)`}/>)}
    <Character f={f} mood="proud" pose="cheer"/>
    <AlarmClock f={f} x={590} y={1010} s={.5} time="6:00" beaten/>
  </g>;
}

function SoyYo({f}: {f: number}) {
  const typed = 'soy yo'.slice(0, clamp(Math.floor((f - 40) / 4), 0, 6));
  const clickAt = 110, pressed = f > clickAt, press = f > clickAt && f < clickAt + 6 ? .92 : 1;
  const cx = mix(640, 360, ease((f - 80) / 26)), cy = mix(1180, 1070, ease((f - 80) / 26));
  return <g>
    <Pop f={f} at={0} x={360} y={660} dur={18}><LiteralYoLogo f={f} x={350} y={680} s={1}/></Pop>
    <g transform={`translate(360 ${1000 - wave(f, .05, 4)})`}><Pop f={f} at={20} x={0} y={-130}><g transform="translate(-280 -165) scale(.3)"><Character f={f} mood="happy" pose="wave" cap={false}/></g></Pop></g>
    <Pop f={f} at={30} x={360} y={950}><g filter="url(#shadow)"><rect x="90" y="910" width="540" height="76" rx="38" fill="#fff6e8"/><circle cx="135" cy="948" r="24" fill="#9aa3d9"/><text x="175" y="960" fontSize="32" fontWeight="760" fill="#231a36">{typed}{f % 30 < 15 && f > 40 ? '|' : ''}</text>{typed.length === 6 && <Heart x={590} y={950} s={1.1}/>}</g></Pop>
    <Pop f={f} at={70} x={360} y={1070}><g transform={`translate(360 1070) scale(${press}) translate(-360 -1070)`}><rect x="200" y="1036" width="320" height="70" rx="35" fill={pressed ? '#3d3657' : '#ff3b6f'} stroke="#fff" strokeWidth="4"/><T x={pressed ? 345 : 360} y={1082} size={28} stroke={false}>{pressed ? 'SIGUIENDO' : 'SEGUIR'}</T>{pressed && <Check x={470} y={1070} s={.9} color="#d7f36b"/>}</g></Pop>
    {f > 80 && <g transform={`translate(${cx} ${cy})`}><path d="M0 0L0 44L12 32L22 54L32 50L22 28L38 28Z" fill="#fff" stroke="#231a36" strokeWidth="3"/></g>}
    {Array.from({length: 6}, (_, i) => { const t = ((f + i * 18) % 100) / 100; return f > 50 && <Heart key={i} x={620 + wave(f, .08, 14, i)} y={1000 - t * 420} s={.6 + seeded(i) * .5} fill={i % 2 ? '#ff7aa8' : '#d7f36b'}/>; })}
  </g>;
}

function Hypnogram({f, d}: {f: number; d: number}) {
  // Profundidad del sueño a lo largo de la noche: ciclos de ~90 min que se vuelven más ligeros hacia la mañana
  const depth = [0, 3, 3, 2, 1, 0.4, 2, 3, 2, 1, 0.3, 1.6, 2, 1, 0.2, 1, 1.2, 0.5, 0.1, .6, .3, 0];
  const x0 = 190, x1 = 640, top = 660, step = 92;
  const xs = depth.map((_, i) => mix(x0, x1, i / (depth.length - 1)));
  const prog = ease(f / (d * .85)), xEnd = mix(x0, x1, prog);
  const path = depth.map((v, i) => `${i ? 'L' : 'M'}${xs[i]} ${top + v * step}${i < depth.length - 1 ? `H${xs[i + 1]}` : ''}`).join('');
  return <g filter="url(#shadow)">
    <Moon x={150} y={560} r={30} f={f}/>
    <g transform={`translate(470 ${mix(600, 550, prog)})`} opacity={prog}><circle r="34" fill="url(#gold)"/></g>
    {['LIGERO', 'MEDIO', 'PROFUNDO'].map((l, i) => <T key={l} x={x0 - 10} y={top + i * step * 1.4 + 8} size={18} anchor="end" opacity={.8}>{l}</T>)}
    <rect x={x0} y={top - 20} width={x1 - x0} height={3 * step + 40} rx="16" fill="#0d1230" opacity=".45"/>
    <clipPath id="hypnoClip"><rect x={x0 - 10} y={top - 30} width={xEnd - x0 + 10} height={3 * step + 60}/></clipPath>
    <path d={path} stroke="#7df2e0" strokeWidth="8" fill="none" strokeLinejoin="round" clipPath="url(#hypnoClip)"/>
    {['11 P.M.', '2 A.M.', '6 A.M.'].map((l, i) => <T key={l} x={mix(x0, x1, i / 2)} y={top + 3 * step + 70} size={22}>{l}</T>)}
    <path d={`M${mix(x0, x1, .72)} ${top - 50}H${x1}`} stroke="#ffd36b" strokeWidth="5" strokeDasharray="6 10"/>
    <T x={mix(x0, x1, .86)} y={top - 62} size={20} fill="#ffd36b">MÁS LIGERO</T>
    <g transform={`translate(${xEnd - 360 * .22} ${top - 160 + Math.min(...depth.slice(Math.floor(prog * (depth.length - 1)))) * 0})`}><g transform="scale(.22)"><Character f={f} mood={prog > .95 ? 'shock' : 'sleep'}/></g></g>
  </g>;
}

export function NewGraphic({kind, f, d}: {kind: string; f: number; d: number}) {
  switch (kind) {
    case 'alarmWake': return <AlarmWake f={f} d={d}/>;
    case 'hypnogram': return <Hypnogram f={f} d={d}/>;
    case 'labBed': return <LabBed f={f}/>;
    case 'twoClocks': return <TwoClocks f={f}/>;
    case 'acth': return <ACTH f={f} d={d}/>;
    case 'cortisolSun': return <CortisolSun f={f} d={d}/>;
    case 'brainGearsAlarm': return <BrainGearsAlarm f={f}/>;
    case 'weekAlarm': return <WeekAlarm f={f} d={d}/>;
    case 'brainWorry': return <BrainWorry f={f}/>;
    case 'characterProud': return <CharacterProud f={f}/>;
    case 'soyYo': return <SoyYo f={f}/>;
    default: return <g/>;
  }
}
