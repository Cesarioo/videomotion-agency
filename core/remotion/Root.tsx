import { Composition, staticFile } from 'remotion';
import { getAudioDurationInSeconds } from '@remotion/media-utils';
import { Main, MainProps, Scene } from './factory/Main';

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
        scenes: [],
        musicSrc: staticFile('music.mp3'),
      }}
      calculateMetadata={async ({ props }) => {
        const FPS = 30;
        const BUFFER_FRAMES = 10;
        const OUTRO_OVERLAP = 25;
        const scenes = (props as unknown as MainProps).scenes || [];

        if (scenes.length === 0) {
          return {
            durationInFrames: 30,
            props,
          };
        }

        // Adjust scene durations based on audio length
        const adjustedScenes: Scene[] = await Promise.all(
          scenes.map(async (scene, index) => {
            try {
              const audioSrc = staticFile(`${scene.template}.mp3`);
              const audioDurationInSeconds = await getAudioDurationInSeconds(audioSrc);
              const audioDurationInFrames = Math.ceil(audioDurationInSeconds * FPS);

              const nextScene = scenes[index + 1];
              const isBeforeOutro = nextScene?.template === 'outro';

              const effectiveDuration = isBeforeOutro
                ? scene.durationInFrames - OUTRO_OVERLAP
                : scene.durationInFrames;

              const gap = effectiveDuration - audioDurationInFrames;

              if (gap < BUFFER_FRAMES) {
                const extraForOverlap = isBeforeOutro ? OUTRO_OVERLAP : 0;
                return {
                  ...scene,
                  durationInFrames: audioDurationInFrames + BUFFER_FRAMES + extraForOverlap,
                };
              }
            } catch (e) {
              console.warn(`Audio not found for ${scene.template}, using base duration`);
            }
            return scene;
          })
        );

        const durationInFrames = adjustedScenes.reduce((acc, scene) => acc + scene.durationInFrames, 0);

        return {
          durationInFrames: Math.max(durationInFrames, 30),
          props: {
            ...props,
            scenes: adjustedScenes,
          },
        };
      }}
    />
  );
};
