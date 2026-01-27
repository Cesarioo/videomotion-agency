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
        musicSrc: staticFile('music.mp3'),
        scenes: [
          {
            template: 'google-search',
            durationInFrames: 110,
            props: {
              text: 'How to create a video with AI',
              primaryColor: '#4285F4',
              secondaryColor: '#DB4437',
            },
          },
          {
            template: 'google-result',
            durationInFrames: 260,
            props: {
              text: 'Using Remotion and AI!',
              primaryColor: '#0F9D58',
              secondaryColor: '#F4B400',
            },
          },
          {
            template: '3pillars',
            durationInFrames: 110,
            props: {
              text: '3pillars of Content',
              primaryColor: '#2c3e50',
              secondaryColor: '#27ae60',
            },
          },
          {
            template: 'circleFeatures',
            durationInFrames: 190,
            props: {
              text: 'Website Audit Plan',
              primaryColor: '#0ea5e9',
              secondaryColor: '#7c3aed',
            },
          },
          {
            template: 'planning',
            durationInFrames: 200,
            props: {
              text: 'Client Planning',
              primaryColor: '#22c55e',
              secondaryColor: '#1f2937',
            },
          },
          {
            template: 'delivery',
            durationInFrames: 485,
            props: {
              text: 'Delivery',
              primaryColor: '#ef4444',
              secondaryColor: '#22c55e',
            },
          },
          {
            template: 'seogoesup',
            durationInFrames: 200,
            props: {
              text: 'SEO goes up',
              primaryColor: '#4285F4',
              secondaryColor: '#34A853',
            },
          },
          {
            template: 'outro',
            durationInFrames: 160,
            props: {
              text: 'Outro',
              primaryColor: '#0f172a',
              secondaryColor: '#fbbf24',
            },
          },
        ]
      }}
      calculateMetadata={async ({ props }) => {
        const FPS = 30;
        const BUFFER_FRAMES = 10;
        const OUTRO_OVERLAP = 25; // Must match Main.tsx
        const scenes = (props as unknown as MainProps).scenes || [];

        // Adjust scene durations based on audio length
        const adjustedScenes: Scene[] = await Promise.all(
          scenes.map(async (scene, index) => {
            try {
              const audioSrc = staticFile(`${scene.template}.mp3`);
              const audioDurationInSeconds = await getAudioDurationInSeconds(audioSrc);
              const audioDurationInFrames = Math.ceil(audioDurationInSeconds * FPS);

              // Check if this scene is followed by outro (will have overlap)
              const nextScene = scenes[index + 1];
              const isBeforeOutro = nextScene?.template === 'outro';

              // For scenes before outro, audio must finish before overlap starts
              // Effective duration is reduced by the overlap amount
              const effectiveDuration = isBeforeOutro
                ? scene.durationInFrames - OUTRO_OVERLAP
                : scene.durationInFrames;

              // Calculate gap between audio end and effective video end
              const gap = effectiveDuration - audioDurationInFrames;

              // If gap is less than buffer, extend to audio + buffer (+ overlap if before outro)
              if (gap < BUFFER_FRAMES) {
                const extraForOverlap = isBeforeOutro ? OUTRO_OVERLAP : 0;
                return {
                  ...scene,
                  durationInFrames: audioDurationInFrames + BUFFER_FRAMES + extraForOverlap,
                };
              }
            } catch (e) {
              // If audio file not found, keep original duration
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
