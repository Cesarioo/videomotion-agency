import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from 'remotion';
import { Search, ClipboardList, Truck } from 'lucide-react';

// --- Colors ---
const COLOR_TECH = '#2c3e50';
const COLOR_CONTENT = '#27ae60';
const COLOR_LINKS = '#8e44ad';
const TEXT_COLOR = '#ffffff';

// --- Animated Icon Wrappers ---

const AuditIcon: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 30], [0.82, 1], { extrapolateRight: 'clamp', easing: Easing.elastic(1) });
  const driftX = Math.sin(frame * 0.05) * 4;
  const driftY = Math.cos(frame * 0.06) * 3;

  return (
    <div style={{ transform: `translate(${driftX}px, ${driftY}px) scale(${scale})` }}>
      <Search size={size} color={TEXT_COLOR} strokeWidth={2.5} />
    </div>
  );
};

const PlanningIcon: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 30], [0.85, 1], { extrapolateRight: 'clamp', easing: Easing.elastic(1) });
  const rotation = Math.sin(frame * 0.04) * 3;

  return (
    <div style={{ transform: `scale(${scale}) rotate(${rotation}deg)` }}>
      <ClipboardList size={size} color={TEXT_COLOR} strokeWidth={2.5} />
    </div>
  );
};

const DeliveryIcon: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 30], [0.85, 1], { extrapolateRight: 'clamp', easing: Easing.elastic(1) });
  const bounceY = Math.sin(frame * 0.15) * 3;
  const speedShift = interpolate(frame % 30, [0, 15, 30], [0, -4, 0], { extrapolateRight: 'clamp' });

  return (
    <div style={{ transform: `translate(${speedShift}px, ${bounceY}px) scale(${scale})` }}>
      <Truck size={size} color={TEXT_COLOR} strokeWidth={2.5} />
    </div>
  );
};

// --- Panel Component ---

const Panel: React.FC<{
  title: string;
  color: string;
  delay: number;
  zIndex: number;
  widthPercentage: number;
  children: React.ReactNode;
}> = ({ title, color, delay, zIndex, widthPercentage, children }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  // Entrance spring animation (coming in from left)
  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12 },
  });

  const translateX = interpolate(entrance, [0, 1], [-width, 0]);

  return (
    <div
      style={{
        width: `${widthPercentage}%`,
        height: '100%',
        backgroundColor: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateX(${translateX}px)`,
        zIndex,
        overflow: 'hidden', // Revert back to hidden since logo stays inside
        borderRight: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {children}

        {title && (
          <h2 style={{
            fontFamily: 'Montserrat, sans-serif',
            color: TEXT_COLOR,
            fontSize: 50,
            textTransform: 'uppercase',
            letterSpacing: 4,
            margin: 0,
            marginTop: 40,
            whiteSpace: 'nowrap'
          }}>
            {title}
          </h2>
        )}
      </div>
    </div>
  );
};


// --- Props Type ---
export type ThreeThemesScenesProps = {
  pillar1?: string;
  pillar2?: string;
  pillar3?: string;
};

// --- Main Scene ---

export const ThreeThemesScene: React.FC<ThreeThemesScenesProps> = ({
  pillar1 = 'Audit',
  pillar2 = 'Planning',
  pillar3 = 'Deliverying',
}) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();

  // --- ANIMATION CONFIG ---
  const SLIDE_START = 90;
  const DURATION = 30;

  const progress = interpolate(frame, [SLIDE_START, SLIDE_START + DURATION], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Slide Everything to the Right by 100% of width
  const containerSlide = interpolate(progress, [0, 1], [0, width]);
  const bgProgress = interpolate(frame, [SLIDE_START - 30, SLIDE_START], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const bgColor = interpolateColors(bgProgress, [0, 1], ['#2c3e50', COLOR_TECH]);

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor }}>
      
      {/* Container that holds all panels and slides right */}
      <div 
        style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            width: '100%', 
            height: '100%',
            transform: `translateX(${containerSlide}px)` // Slide the whole group
        }}
      >

        {/* 1. Audit */}
        <Panel
            title={pillar1}
            color={COLOR_TECH}
            delay={0}
            zIndex={3}
            widthPercentage={33.333}
        >
            {/* The Logo - Now standard position */}
            <AuditIcon size={150} />
        </Panel>

        {/* 2. Planning */}
        <Panel 
            title={pillar2} 
            color={COLOR_CONTENT} 
            delay={5} 
            zIndex={2} 
            widthPercentage={33.333} 
        >
            <PlanningIcon size={120} />
        </Panel>

        {/* 3. Deliverying */}
        <Panel 
            title={pillar3} 
            color={COLOR_LINKS} 
            delay={10} 
            zIndex={1} 
            widthPercentage={33.333} 
        >
            <DeliveryIcon size={120} />
        </Panel>
      </div>

    </AbsoluteFill>
  );
};
