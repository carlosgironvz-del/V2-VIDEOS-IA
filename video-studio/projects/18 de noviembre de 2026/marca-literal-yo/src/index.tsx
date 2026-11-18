import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {PerfilLogo, PerfilPersonaje} from './Perfil';

export const Root: React.FC = () => <>
  <Composition id="perfil-logo" component={PerfilLogo} durationInFrames={60} fps={30} width={1080} height={1080}/>
  <Composition id="perfil-personaje" component={PerfilPersonaje} durationInFrames={60} fps={30} width={1080} height={1080}/>
</>;
registerRoot(Root);
