import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {CasaFilm, timeline} from './Film';

export const ProjectRoot: React.FC = () => <>
  <Composition id="casa-vs-salir-de-noche" component={CasaFilm} durationInFrames={timeline.durationInFrames} fps={30} width={1080} height={1920} defaultProps={{aspectRatio: '9:16' as const}}/>
  <Composition id="casa-vs-salir-de-noche-16x9" component={CasaFilm} durationInFrames={timeline.durationInFrames} fps={30} width={1920} height={1080} defaultProps={{aspectRatio: '16:9' as const}}/>
</>;

registerRoot(ProjectRoot);
