import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const BG_COLOR = '#2c3e50';
const RING_COLOR = '#e5e7eb';
const SHADOW = '0 18px 36px rgba(15, 23, 42, 0.12)';
const RING_RADIUS = 320;
const RING_SIZE = RING_RADIUS * 2;

type AuditItem = {
  label: string;
  color: string;
  Icon: React.FC<{ size: number; color: string }>;
  angle: number;
};

const SearchIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 1 0 14 15.5l.27.28v.79L20 21.49 21.49 20 15.5 14zM10.5 15A4.5 4.5 0 1 1 15 10.5 4.5 4.5 0 0 1 10.5 15z"
    />
  </svg>
);

const GearIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
    />
  </svg>
);

const ContentIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1.5V8h4.5L14 3.5zM7 12h10v2H7v-2zm0 4h10v2H7v-2zm0-8h6v2H7V8z"
    />
  </svg>
);

const LinkIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
    />
  </svg>
);

const AUDITS: AuditItem[] = [
  { label: 'SEO', color: '#0ea5e9', Icon: SearchIcon, angle: -90 },
  { label: 'Technical', color: '#111827', Icon: GearIcon, angle: 0 },
  { label: 'Content', color: '#22c55e', Icon: ContentIcon, angle: 90 },
  { label: 'Backlinks', color: '#7c3aed', Icon: LinkIcon, angle: 180 },
];

const IconOrbitItem: React.FC<{ item: AuditItem; index: number; radius: number; rotation: number }> = ({
  item,
  index,
  radius,
  rotation,
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
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

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

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${popScale})`,
        opacity: popOpacity,
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
          border: `2px solid ${item.color}22`,
        }}
      >
        <div style={{ transform: iconTransform, transformOrigin: iconTransformOrigin }}>
          <item.Icon size={64} color={item.color} />
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          textAlign: 'center',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: 20,
          color: '#ffffff',
          textShadow: '0 2px 6px rgba(15, 23, 42, 0.5)',
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {item.label}
      </div>
    </div>
  );
};

export const FirstPillarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = interpolate(frame, [0, 180], [0, 60], {
    extrapolateRight: 'extend',
  });

  const ringAppear = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 90 },
  });
  const ringScale = interpolate(ringAppear, [0, 1], [0.6, 1]);
  const ringOpacity = interpolate(ringAppear, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG_COLOR }}>
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
          opacity: ringOpacity,
        }}
      />

      {AUDITS.map((item, index) => (
        <IconOrbitItem key={item.label} item={item} index={index} radius={RING_RADIUS} rotation={rotation} />
      ))}
    </AbsoluteFill>
  );
};
