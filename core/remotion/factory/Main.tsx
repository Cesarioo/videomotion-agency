import { AbsoluteFill, Sequence } from 'remotion';
import AnimatedList from '../templates/animated-list.js';
import AnimatedText from '../templates/animated-text.js';
import BounceText from '../templates/bounce-text.js';
import BubblePopText from '../templates/bubble-pop-text.js';
import CardFlip from '../templates/card-flip.js';
import FloatingBubbleText from '../templates/floating-bubble-text.js';
import GeometricPatterns from '../templates/geometric-patterns.js';
import GlitchText from '../templates/glitch-text.js';
import LiquidWave from '../templates/liquid-wave.js';
import MatrixRain from '../templates/matrix-rain.js';
import ParticleExplosion from '../templates/particle-explosion.js';
import PulsingText from '../templates/pulsing-text.js';
import SlideText from '../templates/slide-text.js';
import SoundWave from '../templates/sound-wave.js';
import TypewriterSubtitle from '../templates/typewriter-subtitle.js';

const TEMPLATES = {
  'animated-list': AnimatedList,
  'animated-text': AnimatedText,
  'bounce-text': BounceText,
  'bubble-pop-text': BubblePopText,
  'card-flip': CardFlip,
  'floating-bubble-text': FloatingBubbleText,
  'geometric-patterns': GeometricPatterns,
  'glitch-text': GlitchText,
  'liquid-wave': LiquidWave,
  'matrix-rain': MatrixRain,
  'particle-explosion': ParticleExplosion,
  'pulsing-text': PulsingText,
  'slide-text': SlideText,
  'sound-wave': SoundWave,
  'typewriter-subtitle': TypewriterSubtitle,
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
}

export const Main: React.FC<MainProps> = ({ scenes }) => {
  let currentFrame = 0;

  if (!scenes || scenes.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: 'black' }} />;
  }

  return (
    <AbsoluteFill>
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
