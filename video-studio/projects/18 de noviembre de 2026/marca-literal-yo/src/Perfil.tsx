import React, {useEffect, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {ArtDefs, Character, Stars, seeded} from './art';
import {LiteralYoLogo} from './logo';

/* Fotos de perfil 1080×1080 para TikTok / Instagram / YouTube (zona segura circular ≈ 900 px). */
function useFont() {
  const [handle] = useState(() => delayRender('Cargando tipografía'));
  useEffect(() => { const font = new FontFace('StudioSans', `url(${staticFile('UbuntuSans.ttf')})`, {weight: '100 900'}); font.load().then(l => { document.fonts.add(l); continueRender(handle); }).catch(cancelRender); }, [handle]);
}

const Fondo = ({f}: {f: number}) => <>
  <radialGradient id="perfil-bg" cx="50%" cy="42%" r="70%"><stop stopColor="#5d3f86"/><stop offset=".55" stopColor="#321c3a"/><stop offset="1" stopColor="#150c1c"/></radialGradient>
  <rect width="1080" height="1080" fill="url(#perfil-bg)"/>
  <rect width="1080" height="1080" fill="url(#grain)"/>
  <Stars f={f} n={18} x0={60} x1={1020} y0={60} y1={1020}/>
  {Array.from({length: 26}, (_, i) => <circle key={i} cx={seeded(i) * 1080} cy={seeded(i + 40) * 1080} r={2 + seeded(i + 7) * 3} fill="#d7f36b" opacity={.12 + seeded(i + 3) * .25}/>)}
</>;

export const PerfilLogo: React.FC = () => {
  useFont(); const f = useCurrentFrame();
  return <AbsoluteFill style={{fontFamily: 'StudioSans, sans-serif'}}>
    <svg width="1080" height="1080" viewBox="0 0 1080 1080"><ArtDefs/><Fondo f={f}/><LiteralYoLogo f={f} x={520} y={600} s={1.55} still/></svg>
  </AbsoluteFill>;
};

export const PerfilPersonaje: React.FC = () => {
  useFont(); const f = useCurrentFrame();
  return <AbsoluteFill style={{fontFamily: 'StudioSans, sans-serif'}}>
    <svg width="1080" height="1080" viewBox="0 0 1080 1080"><ArtDefs/><Fondo f={f}/>
      <g transform="translate(66 -315) scale(1.32)"><Character f={f} mood="happy" pose="wave"/></g>
      <LiteralYoLogo f={f} x={480} y={200} s={.7} still/>
    </svg>
  </AbsoluteFill>;
};
