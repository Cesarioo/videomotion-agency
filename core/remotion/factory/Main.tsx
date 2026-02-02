import { AbsoluteFill, Img, Sequence, staticFile } from 'remotion';
import { Audio } from '@remotion/media';
import { GoogleSearch } from '../templates/google-search';
import { GoogleSearchResults } from '../templates/google-results-fountain';
import { ThreeThemesScene } from '../templates/3pillars';
import { FirstPillarScene } from '../templates/circleFeatures';
import { SecondPillarScene } from '../templates/planning';
import { DeliveryScene } from '../templates/delivery';
import { SeoGoesUp } from '../templates/seogoesup';
import { OutroScene } from '../templates/outro';

import { SalesIssue } from '../templates/salesIssue';
import { SalesGoUp } from '../templates/salesgoup';

const TEMPLATES = {
  'google-search': GoogleSearch,
  'google-result': GoogleSearchResults,
  '3pillars': ThreeThemesScene,
  'circleFeatures': FirstPillarScene,
  'planning': SecondPillarScene,
  'delivery': DeliveryScene,
  'seogoesup': SeoGoesUp,
  'outro': OutroScene,
  'salesIssue': SalesIssue,
  'salesGoUp': SalesGoUp,
} as const;

export interface Scene {
  template: keyof typeof TEMPLATES;
  durationInFrames: number;
  props: Record<string, unknown>;
}

export interface MainProps {
  scenes: Scene[];
  musicSrc?: string;
}

const OUTRO_OVERLAP = 25;

export const Main: React.FC<MainProps> = ({ scenes, musicSrc }) => {
  if (!scenes || scenes.length === 0) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#fff', fontSize: 48, fontFamily: 'sans-serif' }}>
          No scenes provided
        </div>
      </AbsoluteFill>
    );
  }

  let currentFrame = 0;

  const sceneTimings = scenes.map((scene, index) => {
    const isOutro = scene.template === 'outro';
    const isBeforeOutro = index < scenes.length - 1 && scenes[index + 1]?.template === 'outro';

    const from = currentFrame;
    const duration = isBeforeOutro
      ? scene.durationInFrames + OUTRO_OVERLAP
      : scene.durationInFrames;

    const adjustedFrom = isOutro ? from - OUTRO_OVERLAP : from;

    currentFrame += scene.durationInFrames;

    return { scene, from: adjustedFrom, duration };
  });

  return (
    <AbsoluteFill>
      {musicSrc ? <Audio src={musicSrc} volume={0.10} /> : null}
      {sceneTimings.map(({ scene, from, duration }, index) => {
        const Template = TEMPLATES[scene.template];
        const sceneAudioSrc = staticFile(`${scene.template}.mp3`);

        return (
          <Sequence key={index} from={from} durationInFrames={duration}>
            <Audio src={sceneAudioSrc} volume={1} />
            <Template {...(scene.props as any)} />
          </Sequence>
        );
      })}
      {/* Watermark overlay */}
      <Img
        src={staticFile('chocologo.png')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          width: 80,
          height: 'auto',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
