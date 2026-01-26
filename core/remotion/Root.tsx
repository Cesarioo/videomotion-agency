import { Composition, staticFile } from 'remotion';
import { Main, MainProps } from './factory/Main';

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
        voiceoverSrc: staticFile('voicover.mp3'),
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
            durationInFrames: 120,
            props: {
              text: '3pillars of Content',
              primaryColor: '#2c3e50',
              secondaryColor: '#27ae60',
            },
          },
          {
            template: 'circleFeatures',
            durationInFrames: 200,
            props: {
              text: 'Website Audit Plan',
              primaryColor: '#0ea5e9',
              secondaryColor: '#7c3aed',
            },
          },
          {
            template: 'planning',
            durationInFrames: 250,
            props: {
              text: 'Client Planning',
              primaryColor: '#22c55e',
              secondaryColor: '#1f2937',
            },
          },
          {
            template: 'delivery',
            durationInFrames: 450,
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
            durationInFrames: 150,
            props: {
              text: 'Outro',
              primaryColor: '#0f172a',
              secondaryColor: '#fbbf24',
            },
          },
        ]
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
