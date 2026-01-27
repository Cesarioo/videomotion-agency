
import { AbsoluteFill, Sequence, staticFile } from 'remotion';
import { Audio } from '@remotion/media';
import { GoogleSearch } from '../templates/google-search';
import { GoogleSearchResults } from '../templates/google-results-fountain';
import { ThreeThemesScene } from '../templates/3pillars';
import { FirstPillarScene } from '../templates/circleFeatures';
import { SecondPillarScene } from '../templates/planning';
import { DeliveryScene } from '../templates/delivery';
import { SeoGoesUp } from '../templates/seogoesup';
import { OutroScene } from '../templates/outro';


const TEMPLATES = {
  'google-search': GoogleSearch,
  'google-result': GoogleSearchResults,
  '3pillars': ThreeThemesScene,
  'circleFeatures': FirstPillarScene,
  'planning': SecondPillarScene,
  'delivery': DeliveryScene,
  'seogoesup': SeoGoesUp,
  'outro': OutroScene
};


export interface Scene {
  template: keyof typeof TEMPLATES;
  durationInFrames: number;
  props: {
    text: string;
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface MainProps {
  scenes: Scene[];
  musicSrc?: string;
}

// Transition overlap duration in frames
const OUTRO_OVERLAP = 25;

export const Main: React.FC<MainProps> = ({ scenes, musicSrc }) => {
  let currentFrame = 0;

  if (!scenes || scenes.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  // Calculate scene timings, with overlap for outro transition
  const sceneTimings = scenes.map((scene, index) => {
    const isOutro = scene.template === 'outro';
    const isBeforeOutro = index < scenes.length - 1 && scenes[index + 1]?.template === 'outro';

    const from = currentFrame;
    // If this is the scene before outro, extend its duration to overlap
    const duration = isBeforeOutro
      ? scene.durationInFrames + OUTRO_OVERLAP
      : scene.durationInFrames;

    // Outro starts earlier to overlap with previous scene
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
            <Template {...scene.props} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
