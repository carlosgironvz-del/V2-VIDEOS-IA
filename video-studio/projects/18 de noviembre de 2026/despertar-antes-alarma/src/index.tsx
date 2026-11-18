import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {CasaFilm, timeline} from './Film';

export const ProjectRoot: React.FC = () => <>
  <Composition id="despertar-antes-alarma" component={CasaFilm} durationInFrames={timeline.durationInFrames} fps={30} width={1080} height={1920} defaultProps={{aspectRatio: '9:16' as const}}/>
</>;

registerRoot(ProjectRoot);
