import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { Search, Settings, FileText, Link } from 'lucide-react';

const BG_COLOR = '#2c3e50';
const RING_COLOR = '#e5e7eb';
const SHADOW = '0 18px 36px rgba(15, 23, 42, 0.12)';
const RING_RADIUS = 320;
const RING_SIZE = RING_RADIUS * 2;

// Out animation timing
const TEXT_FADE_START = 120;
const TEXT_FADE_END = 145;
const CONVERGE_START = 150;
const CONVERGE_END = 180;
const EXPAND_START = 185;
const EXPAND_END = 220;

const ACCENT_GREEN = '#27ae60';

type AuditItem = {
  label: string;
  color: string;
  Icon: React.FC<{ size: number; color: string }>;
  angle: number;
};

// Wrapper components for Lucide icons to match expected props
const SearchIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <Search size={size} color={color} strokeWidth={2.5} />
);

const GearIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <Settings size={size} color={color} strokeWidth={2.5} />
);

const ContentIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <FileText size={size} color={color} strokeWidth={2.5} />
);

const LinkIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <Link size={size} color={color} strokeWidth={2.5} />
);

const DEFAULT_AUDITS: AuditItem[] = [
  { label: 'SEO', color: '#0ea5e9', Icon: SearchIcon, angle: -90 },
  { label: 'Technical', color: '#111827', Icon: GearIcon, angle: 0 },
  { label: 'Content', color: '#22c55e', Icon: ContentIcon, angle: 90 },
  { label: 'Backlinks', color: '#7c3aed', Icon: LinkIcon, angle: 180 },
];

const IconOrbitItem: React.FC<{
  item: AuditItem;
  index: number;
  radius: number;
  rotation: number;
  convergeProgress: number;
  textOpacity: number;
}> = ({
  item,
  index,
  radius,
  rotation,
  convergeProgress,
  textOpacity,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const delay = 18 + index * 16;

  const appear = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  const popScale = interpolate(appear, [0, 1], [0, 1]);
  const popOpacity = interpolate(appear, [0, 1], [0, 1]);

  const angle = ((item.angle + rotation) * Math.PI) / 180;
  const orbitX = Math.cos(angle) * radius;
  const orbitY = Math.sin(angle) * radius;

  // Animate position from orbit to center (0, 0)
  const x = interpolate(convergeProgress, [0, 1], [orbitX, 0]);
  const y = interpolate(convergeProgress, [0, 1], [orbitY, 0]);

  // Keep same size, just fade out at the end when expand takes over
  const convergeScale = 1;
  const convergeOpacity = interpolate(convergeProgress, [0.9, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const waveSlow = Math.sin(frame * 0.06);
  const waveFast = Math.sin(frame * 0.12);
  let iconTransform = 'none';
  let iconTransformOrigin: React.CSSProperties['transformOrigin'] = 'center';

  if (item.label === 'SEO') {
    const seoX = Math.cos(frame * 0.08) * 6;
    const seoY = Math.sin(frame * 0.08) * 6;
    iconTransform = `translate(${seoX}px, ${seoY}px)`;
  }

  if (item.label === 'Technical') {
    const gearRotation = frame * 2.2;
    iconTransform = `rotate(${gearRotation}deg)`;
  }

  if (item.label === 'Content') {
    const fold = 0.88 + (waveSlow + 1) * 0.06;
    const tilt = -6 + (waveSlow + 1) * 3;
    iconTransform = `rotate(${tilt}deg) scaleY(${fold})`;
    iconTransformOrigin = 'top right';
  }

  if (item.label === 'Backlinks') {
    const linkPulse = 0.9 + (waveFast + 1) * 0.05;
    const linkShift = Math.sin(frame * 0.1 + 1) * 4;
    iconTransform = `translateX(${linkShift}px) scaleX(${linkPulse})`;
  }

  // Combined scale and opacity
  const finalScale = popScale * convergeScale;
  const finalOpacity = popOpacity * convergeOpacity;

  // All icons are green from the start
  const iconColor = ACCENT_GREEN;
  const borderColor = `${ACCENT_GREEN}22`;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${finalScale})`,
        opacity: finalOpacity,
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 999,
          backgroundColor: 'white',
          boxShadow: SHADOW,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `2px solid ${borderColor}`,
        }}
      >
        <div style={{ transform: iconTransform, transformOrigin: iconTransformOrigin }}>
          <item.Icon size={64} color={iconColor} />
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          width: 140,
          textAlign: 'center',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 20,
          color: '#ffffff',
          textShadow: '0 2px 6px rgba(15, 23, 42, 0.5)',
          letterSpacing: 1,
          textTransform: 'uppercase',
          opacity: textOpacity,
        }}
      >
        {item.label}
      </div>
    </div>
  );
};

export type FirstPillarSceneProps = {
  feature1?: string;
  feature2?: string;
  feature3?: string;
  feature4?: string;
};

export const FirstPillarScene: React.FC<FirstPillarSceneProps> = ({
  feature1 = 'SEO',
  feature2 = 'Technical',
  feature3 = 'Content',
  feature4 = 'Backlinks',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Create audits with custom labels
  const AUDITS: AuditItem[] = [
    { label: feature1, color: '#0ea5e9', Icon: SearchIcon, angle: -90 },
    { label: feature2, color: '#111827', Icon: GearIcon, angle: 0 },
    { label: feature3, color: '#22c55e', Icon: ContentIcon, angle: 90 },
    { label: feature4, color: '#7c3aed', Icon: LinkIcon, angle: 180 },
  ];

  const rotation = interpolate(frame, [0, CONVERGE_START], [0, 60], {
    extrapolateRight: 'clamp',
  });

  const ringAppear = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const ringScale = interpolate(ringAppear, [0, 1], [0.6, 1]);
  const ringOpacity = interpolate(ringAppear, [0, 1], [0, 1]);

  // Text fade out before converge
  const textOpacity = interpolate(frame, [TEXT_FADE_START, TEXT_FADE_END], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Converge animation - icons move to center
  const convergeProgress = interpolate(frame, [CONVERGE_START, CONVERGE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  // Ring fades out during converge
  const ringOutOpacity = interpolate(frame, [CONVERGE_START, CONVERGE_END - 10], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Expanding circle animation - starts right when icons merge
  const expandProgress = interpolate(frame, [CONVERGE_END - 5, EXPAND_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Calculate the size needed to fill the screen (diagonal)
  const maxSize = Math.sqrt(width * width + height * height) * 1.2;
  // Start at 140px (same as icon container size) and expand to fill screen
  const expandSize = interpolate(expandProgress, [0, 1], [140, maxSize]);
  const expandOpacity = frame >= CONVERGE_END - 5 ? 1 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BG_COLOR }}>
      {/* Dashed ring */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: RING_SIZE,
          height: RING_SIZE,
          borderRadius: 9999,
          border: `2px dashed ${RING_COLOR}`,
          transform: `translate(-50%, -50%) scale(${ringScale})`,
          opacity: ringOpacity * ringOutOpacity,
        }}
      />

      {/* Orbiting icons */}
      {AUDITS.map((item, index) => (
        <IconOrbitItem
          key={item.label}
          item={item}
          index={index}
          radius={RING_RADIUS}
          rotation={rotation}
          convergeProgress={convergeProgress}
          textOpacity={textOpacity}
        />
      ))}

      {/* Central expanding green circle */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: expandSize,
          height: expandSize,
          borderRadius: '50%',
          backgroundColor: ACCENT_GREEN,
          transform: 'translate(-50%, -50%)',
          opacity: expandOpacity,
          zIndex: 100,
        }}
      />
    </AbsoluteFill>
  );
};
