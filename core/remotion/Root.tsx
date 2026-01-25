import { Composition } from 'remotion';
import { Main, MainProps } from './factory/Main.js';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Main"
      component={Main as unknown as React.FC<object>}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        scenes: []
      }}
      calculateMetadata={async ({ props }) => {
        const scenes = (props as unknown as MainProps).scenes || [];
        const durationInFrames = scenes.reduce((acc, scene) => acc + scene.durationInFrames, 0);
        return {
          durationInFrames: Math.max(durationInFrames, 30), // Minimum 1 sec
        };
      }}
    />
  );
};
