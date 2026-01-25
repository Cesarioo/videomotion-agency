import { Composition } from 'remotion';
import { Main } from './factory/Main.js';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

