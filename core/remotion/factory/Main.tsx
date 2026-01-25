import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1 } from '../scenes/Scene1.js';
import { Scene2 } from '../scenes/Scene2.js';

export const Main: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={90}>
        <Scene1 />
      </Sequence>
      <Sequence from={90} durationInFrames={90}>
        <Scene2 />
      </Sequence>
    </AbsoluteFill>
  );
};

