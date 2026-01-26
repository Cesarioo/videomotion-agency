
import { AbsoluteFill, Sequence } from 'remotion';
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
  voiceoverSrc?: string;
  musicSrc?: string;
}

export const Main: React.FC<MainProps> = ({ scenes, voiceoverSrc, musicSrc }) => {
  let currentFrame = 0;

  if (!scenes || scenes.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  return (
    <AbsoluteFill>
      {musicSrc ? <Audio src={musicSrc} volume={0.18} /> : null}
      {voiceoverSrc ? <Audio src={voiceoverSrc} volume={1} /> : null}
      {scenes.map((scene, index) => {
        const Template = TEMPLATES[scene.template];
        const from = currentFrame;
        currentFrame += scene.durationInFrames;

        return (
          <Sequence key={index} from={from} durationInFrames={scene.durationInFrames}>
            <Template {...scene.props} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
