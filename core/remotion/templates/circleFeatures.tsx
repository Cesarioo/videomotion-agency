import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

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

const SearchIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 512 512">
    <g>
      <ellipse style={{ fill: '#ffffff' }} cx="158.537" cy="158.536" rx="129.777" ry="129.777" />
      <path
        style={{ fill: color }}
        d="M270.636,46.433c-61.912-61.912-162.291-61.911-224.202,0.001s-61.912,162.291-0.001,224.202c57.054,57.054,146.703,61.394,208.884,13.294l14.18,14.182l28.615-28.613l-14.182-14.182C332.029,193.137,327.69,103.487,270.636,46.433z M250.301,250.302c-50.681,50.681-132.852,50.681-183.534,0c-50.68-50.681-50.68-132.852,0.002-183.533s132.85-50.681,183.531,0C300.982,117.45,300.982,199.621,250.301,250.302z"
      />
      <path
        style={{ fill: color }}
        d="M305.823,258.865l-46.959,46.958c-2.669,2.67-2.669,6.996,0,9.665l174.339,174.338c12.132,12.133,68.755-44.49,56.623-56.623L315.488,258.865C312.819,256.196,308.493,256.196,305.823,258.865z"
      />
      <rect
        x="409.379"
        y="442.628"
        transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 1084.9951 449.4294)"
        style={{ fill: color }}
        width="80.077"
        height="13.594"
      />
      <rect
        x="260.671"
        y="293.889"
        transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 725.9606 300.6683)"
        style={{ fill: color }}
        width="80.077"
        height="13.594"
      />
    </g>
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
