import React from 'react';
import {Hand, wave} from './art';

/**
 * Logotipo de "Literal Yo": globo de diálogo verde lima con la palabra LITERAL y un gran YO,
 * y una mano en pijama que se levanta detrás del globo ("¡yo!").
 * Paleta: berenjena #321c3a · lima #d7f36b · crema #fff4d9. Centrado en (x, y); ancho ≈ 460·s.
 */
export function LiteralYoLogo({f, x, y, s = 1, still = false}: {f: number; x: number; y: number; s?: number; still?: boolean}) {
  const w = still ? 0 : 1;
  const raise = wave(f, .12, 10) * w, tilt = wave(f, .06, 2.5) * w;
  const handX = 196 + wave(f, .2, 6) * w, handY = -196 + raise;
  return <g transform={`translate(${x} ${y}) scale(${s}) rotate(${tilt})`}>
    {/* brazo detrás del globo */}
    <path d={`M150 -40L${handX - 8} ${handY + 34}`} stroke="url(#stripes)" strokeWidth="44" strokeLinecap="round"/>
    <path d={`M150 -40L${handX - 8} ${handY + 34}`} stroke="#c9d4ff" strokeWidth="44" strokeLinecap="round" opacity=".25"/>
    <Hand x={handX} y={handY} angle={-Math.PI / 2 + .18 + wave(f, .2, .12) * w} s={1.5}/>
    {[0, 1, 2].map(i => <path key={i} d={`M${handX + 40 + i * 6} ${handY - 40 + i * 30}l${26 + i * 4} ${-14 + i * 12}`} stroke="#fff4d9" strokeWidth="7" strokeLinecap="round" opacity={still ? .9 : .5 + wave(f, .25, .45, i)}/>)}
    {/* globo */}
    <g filter="url(#shadow)">
      <path d="M-230 -110Q-230 -140 -200 -140H200Q230 -140 230 -110V60Q230 90 200 90H-40L-110 150L-90 90H-200Q-230 90 -230 60Z" fill="#d7f36b" stroke="#fff" strokeWidth="6" strokeLinejoin="round"/>
      <text x="0" y="-52" textAnchor="middle" fontSize="54" fontWeight="900" fill="#321c3a" letterSpacing="12">LITERAL</text>
      <text x="0" y="66" textAnchor="middle" fontSize="136" fontWeight="900" fill="#321c3a" letterSpacing="6">YO</text>
    </g>
  </g>;
}
