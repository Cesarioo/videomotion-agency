import React from 'react';
import { AbsoluteFill, Sequence, staticFile, continueRender, delayRender } from 'remotion';
import { Audio } from '@remotion/media';
import { SalesIssue } from '../templates/salesIssue';
import { GoogleSearch } from '../templates/google-search';
import { GoogleSearchResults } from '../templates/google-results-fountain';
import { ThreeThemesScene } from '../templates/3pillars';
import { FirstPillarScene } from '../templates/circleFeatures';
import { SecondPillarScene } from '../templates/planning';
import { DeliveryScene } from '../templates/delivery';
import { SeoGoesUp } from '../templates/seogoesup';
import { OutroScene } from '../templates/outro';
import { StoreFront } from '../templates/store-front';
import { SalesGoUp } from '../templates/salesgoup';

// Optional Audio component that handles missing files gracefully
const OptionalAudio: React.FC<{ src: string; volume?: number }> = ({ src, volume = 1 }) => {
  const [audioExists, setAudioExists] = React.useState<boolean | null>(null);
  const [handle] = React.useState(() => delayRender());

  React.useEffect(() => {
    fetch(src, { method: 'HEAD' })
      .then((response) => {
        setAudioExists(response.ok);
        continueRender(handle);
      })
      .catch(() => {
        setAudioExists(false);
        continueRender(handle);
      });
  }, [src, handle]);

  if (audioExists === null || !audioExists) {
    return null;
  }

  return <Audio src={src} volume={volume} />;
};

const TEMPLATES = {
  'sales-issue': SalesIssue,
  'google-search': GoogleSearch,
  'google-result': GoogleSearchResults,
  '3pillars': ThreeThemesScene,
  'circleFeatures': FirstPillarScene,
  'planning': SecondPillarScene,
  'delivery': DeliveryScene,
  'seogoesup': SeoGoesUp,
  'outro': OutroScene,
  'store-front': StoreFront,
  'salesgoup': SalesGoUp
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
      {musicSrc ? <OptionalAudio src={musicSrc} volume={0.10} /> : null}
      {sceneTimings.map(({ scene, from, duration }, index) => {
        const Template = TEMPLATES[scene.template];
        const sceneAudioSrc = staticFile(`${scene.template}.mp3`);

        return (
          <Sequence key={index} from={from} durationInFrames={duration}>
            <OptionalAudio src={sceneAudioSrc} volume={1} />
            <Template {...(scene.props as any)} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
