import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  random,
} from 'remotion';
import { TrendingUp, DollarSign, Sparkles } from 'lucide-react';

// --- Colors ---
const BG_COLOR = '#2c3e50';
const SUCCESS_GREEN = '#27ae60';
const GOLD = '#f1c40f';
const TEXT_COLOR = '#ffffff';

// --- Timeline Constants ---
const INTRO_END = 40;
const GRAPH_START = 20;
const GRAPH_PEAK = 90;
const COUNTER_START = 30;
const COUNTER_END = 120;
const CELEBRATION_START = 80;
const FINAL_TEXT_START = 140;
const SCENE_END = 220;

// --- Custom Confetti ---

const CONFETTI_COLORS = [
  SUCCESS_GREEN,
  '#2ecc71',
  GOLD,
  '#f39c12',
  '#3498db',
  '#9b59b6',
  '#1abc9c',
  '#e91e63',
];

type ConfettiPieceData = {
  id: number;
  x: number;
  delay: number;
  color: string;
  size: number;
  shape: 'rect' | 'circle' | 'square';
  rotationSpeed: number;
  wobbleSpeed: number;
  wobbleAmount: number;
  fallSpeed: number;
  horizontalDrift: number;
  initialRotation: number;
};

const ConfettiPiece: React.FC<{
  piece: ConfettiPieceData;
  frame: number;
  startFrame: number;
}> = ({ piece, frame, startFrame }) => {
  const actualStart = startFrame + piece.delay;
  
  if (frame < actualStart) return null;

  const progress = frame - actualStart;
  
  // Vertical fall with gravity
  const gravity = 0.12;
  const baseY = piece.fallSpeed * progress + gravity * progress * progress * 0.5;
  const y = -100 + baseY;
  
  // Horizontal wobble and drift
  const wobble = Math.sin(progress * piece.wobbleSpeed) * piece.wobbleAmount;
  const drift = piece.horizontalDrift * progress * 0.3;
  const x = piece.x + wobble + drift;
  
  // 3D-like rotation
  const rotationX = progress * piece.rotationSpeed * 0.8;
  const rotationY = progress * piece.rotationSpeed * 1.2;
  const rotationZ = piece.initialRotation + progress * piece.rotationSpeed;
  
  const scaleX = Math.abs(Math.cos(rotationY * 0.05));
  const scaleY = Math.abs(Math.cos(rotationX * 0.05));
  
  const opacity = interpolate(progress, [0, 10, 80, 100], [0, 1, 1, 0], { 
    extrapolateRight: 'clamp' 
  });

  if (y > 1200) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: piece.shape === 'rect' ? piece.size * 2.5 : piece.size,
    height: piece.size,
    backgroundColor: piece.color,
    borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'rect' ? 2 : 0,
    transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg) scaleX(${scaleX}) scaleY(${scaleY})`,
    opacity,
    boxShadow: `0 2px 8px ${piece.color}40`,
  };

  return <div style={style} />;
};

const ConfettiEffect: React.FC<{ frame: number; width: number; startFrame: number }> = ({ frame, width, startFrame }) => {
  const pieces = useMemo(() => {
    const result: ConfettiPieceData[] = [];
    const count = 100;
    
    for (let i = 0; i < count; i++) {
      const seed = `sales-confetti-${i}`;
      result.push({
        id: i,
        x: random(seed + '-x') * (width + 200) - 100,
        delay: random(seed + '-delay') * 20,
        color: CONFETTI_COLORS[Math.floor(random(seed + '-color') * CONFETTI_COLORS.length)],
        size: 10 + random(seed + '-size') * 15,
        shape: (['rect', 'circle', 'square'] as const)[Math.floor(random(seed + '-shape') * 3)],
        rotationSpeed: 3 + random(seed + '-rot') * 8,
        wobbleSpeed: 0.1 + random(seed + '-wobble-speed') * 0.15,
        wobbleAmount: 25 + random(seed + '-wobble-amt') * 50,
        fallSpeed: 5 + random(seed + '-fall') * 5,
        horizontalDrift: (random(seed + '-drift') - 0.5) * 4,
        initialRotation: random(seed + '-init-rot') * 360,
      });
    }
    return result;
  }, [width]);

  if (frame < startFrame) return null;

  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {pieces.map((piece) => (
        <ConfettiPiece key={piece.id} piece={piece} frame={frame} startFrame={startFrame} />
      ))}
    </div>
  );
};

// --- Floating Dollar Signs ---

const FloatingDollar: React.FC<{
  x: number;
  delay: number;
  size: number;
  frame: number;
  startFrame: number;
}> = ({ x, delay, size, frame, startFrame }) => {
  const actualStart = startFrame + delay;
  if (frame < actualStart) return null;

  const progress = frame - actualStart;
  const y = interpolate(progress, [0, 100], [1200, -200], { extrapolateRight: 'clamp' });
  const opacity = interpolate(progress, [0, 20, 80, 100], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const rotation = Math.sin(progress * 0.05) * 15;
  const scale = 0.8 + Math.sin(progress * 0.08) * 0.2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity,
        transform: `rotate(${rotation}deg) scale(${scale})`,
        color: GOLD,
        filter: `drop-shadow(0 0 20px ${GOLD}80)`,
      }}
    >
      <DollarSign size={size} strokeWidth={2.5} />
    </div>
  );
};

const FloatingDollars: React.FC<{ frame: number; width: number; startFrame: number }> = ({ frame, width, startFrame }) => {
  const dollars = useMemo(() => {
    const result = [];
    for (let i = 0; i < 15; i++) {
      const seed = `dollar-${i}`;
      result.push({
        x: random(seed + '-x') * width,
        delay: random(seed + '-delay') * 60,
        size: 40 + random(seed + '-size') * 60,
      });
    }
    return result;
  }, [width]);

  return (
    <>
      {dollars.map((d, i) => (
        <FloatingDollar key={i} {...d} frame={frame} startFrame={startFrame} />
      ))}
    </>
  );
};

// --- Rising Graph Line ---

const GraphLine: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const graphProgress = interpolate(
    frame,
    [GRAPH_START, GRAPH_PEAK],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const graphOpacity = interpolate(
    frame,
    [GRAPH_START, GRAPH_START + 20, SCENE_END - 30, SCENE_END],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Create path points for the rising line
  const points: string[] = [];
  const width = 800;
  const height = 400;
  const segments = 50;

  for (let i = 0; i <= segments * graphProgress; i++) {
    const x = (i / segments) * width;
    // Exponential growth curve
    const normalizedX = i / segments;
    const y = height - (Math.pow(normalizedX, 2) * height * 0.9 + normalizedX * height * 0.1);
    points.push(`${x},${y}`);
  }

  const pathD = points.length > 1 ? `M ${points.join(' L ')}` : '';

  // Glow pulse
  const glowPulse = 0.5 + 0.5 * Math.sin(frame * 0.1);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: graphOpacity,
      }}
    >
      {/* Grid lines */}
      <svg width={width + 100} height={height + 100} style={{ position: 'absolute', left: -50, top: -50 }}>
        {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={`h-${i}`}
            x1={50}
            y1={50 + height * (1 - ratio)}
            x2={50 + width}
            y2={50 + height * (1 - ratio)}
            stroke={TEXT_COLOR}
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        ))}
        {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <line
            key={`v-${i}`}
            x1={50 + width * ratio}
            y1={50}
            x2={50 + width * ratio}
            y2={50 + height}
            stroke={TEXT_COLOR}
            strokeOpacity={0.1}
            strokeWidth={1}
          />
        ))}
      </svg>

      {/* Main graph */}
      <svg width={width} height={height}>
        {/* Glow effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="lineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SUCCESS_GREEN} />
            <stop offset="100%" stopColor={GOLD} />
          </linearGradient>
        </defs>

        {/* Area under curve */}
        {points.length > 1 && (
          <path
            d={`${pathD} L ${(segments * graphProgress / segments) * width},${height} L 0,${height} Z`}
            fill="url(#lineGradient)"
            fillOpacity={0.15}
          />
        )}

        {/* Main line */}
        <path
          d={pathD}
          stroke="url(#lineGradient)"
          strokeWidth={6}
          fill="none"
          filter="url(#glow)"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 ${20 * glowPulse}px ${SUCCESS_GREEN})` }}
        />

        {/* End point dot */}
        {graphProgress > 0.1 && (
          <circle
            cx={(segments * graphProgress / segments) * width}
            cy={height - (Math.pow(graphProgress, 2) * height * 0.9 + graphProgress * height * 0.1)}
            r={12}
            fill={GOLD}
            style={{ filter: `drop-shadow(0 0 15px ${GOLD})` }}
          />
        )}
      </svg>
    </div>
  );
};

// --- Spending / Revenue Counter ---

const SpendingRevenueCounter: React.FC<{
  frame: number;
  fps: number;
  spendingValue: number;
  revenueValue: number;
}> = ({ frame, fps, spendingValue, revenueValue }) => {
  const entrance = spring({
    frame: frame - COUNTER_START,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const countProgress = interpolate(
    frame,
    [COUNTER_START + 10, COUNTER_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const currentSpending = Math.round(countProgress * spendingValue);
  const currentRevenue = Math.round(countProgress * revenueValue);

  const formatCurrency = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toLocaleString()}`;
  };

  // Exit animation
  const exitProgress = interpolate(
    frame,
    [SCENE_END - 40, SCENE_END - 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const exitOpacity = interpolate(exitProgress, [0, 1], [1, 0]);
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.8]);

  if (frame < COUNTER_START) return null;

  const pulse = 1 + 0.03 * Math.sin(frame * 0.15);

  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: '50%',
        transform: `translateX(-50%) scale(${scale * exitScale * pulse})`,
        opacity: opacity * exitOpacity,
        display: 'flex',
        gap: 120,
        alignItems: 'center',
      }}
    >
      {/* Spending */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 120,
            fontWeight: 900,
            color: SUCCESS_GREEN,
            textShadow: `0 0 60px ${SUCCESS_GREEN}80`,
            lineHeight: 1,
          }}
        >
          {formatCurrency(currentSpending)}
        </div>
        <div
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 36,
            fontWeight: 600,
            color: TEXT_COLOR,
            textTransform: 'uppercase',
            letterSpacing: 4,
            marginTop: 10,
            opacity: 0.8,
          }}
        >
          Spending
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: 4,
          height: 150,
          backgroundColor: TEXT_COLOR,
          opacity: 0.2,
          borderRadius: 2,
        }}
      />

      {/* Revenue */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 120,
            fontWeight: 900,
            color: GOLD,
            textShadow: `0 0 60px ${GOLD}80`,
            lineHeight: 1,
          }}
        >
          {formatCurrency(currentRevenue)}
        </div>
        <div
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 36,
            fontWeight: 600,
            color: TEXT_COLOR,
            textTransform: 'uppercase',
            letterSpacing: 4,
            marginTop: 10,
            opacity: 0.8,
          }}
        >
          Revenue
        </div>
      </div>
    </div>
  );
};

// --- Intro Text ---

const IntroText: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exitOpacity = interpolate(
    frame,
    [INTRO_END - 20, INTRO_END],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (frame > INTRO_END + 10) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity: opacity * exitOpacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
      }}
    >
      <div style={{ color: SUCCESS_GREEN }}>
        <TrendingUp size={150} strokeWidth={2} />
      </div>
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 80,
          fontWeight: 800,
          color: TEXT_COLOR,
          textAlign: 'center',
          textShadow: '0 4px 30px rgba(0,0,0,0.3)',
        }}
      >
        Sales Skyrocketing!
      </div>
    </div>
  );
};

// --- Final Celebration Text ---

const FinalText: React.FC<{ frame: number; fps: number; revenueValue: number }> = ({ frame, fps, revenueValue }) => {
  if (frame < FINAL_TEXT_START) return null;

  const entrance = spring({
    frame: frame - FINAL_TEXT_START,
    fps,
    config: { damping: 10, stiffness: 80 },
  });

  const scale = interpolate(entrance, [0, 1], [0.5, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  const exitOpacity = interpolate(
    frame,
    [SCENE_END - 30, SCENE_END],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const formatCurrency = (num: number): string => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toLocaleString()}`;
  };

  const pulse = 1 + 0.02 * Math.sin(frame * 0.12);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 120,
        left: '50%',
        transform: `translateX(-50%) scale(${scale * pulse})`,
        opacity: opacity * exitOpacity,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Sparkles size={60} color={GOLD} strokeWidth={2} />
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 56,
          fontWeight: 800,
          color: TEXT_COLOR,
          textShadow: '0 4px 30px rgba(0,0,0,0.4)',
        }}
      >
        <span style={{ color: GOLD }}>{formatCurrency(revenueValue)}</span> in revenue generated
      </div>
      <Sparkles size={60} color={GOLD} strokeWidth={2} />
    </div>
  );
};

// --- Props Type ---
export type SalesGoUpProps = {
  spendingValue?: number;
  revenueValue?: number;
};

// --- Main Component ---
export const SalesGoUp: React.FC<SalesGoUpProps> = ({
  spendingValue = 15000,
  revenueValue = 45000,
}) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_COLOR }}>
      {/* Background gradient */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse at center bottom, ${SUCCESS_GREEN}15 0%, transparent 60%)`,
        }}
      />

      {/* Intro text */}
      <IntroText frame={frame} fps={fps} />

      {/* Rising graph */}
      <GraphLine frame={frame} fps={fps} />

      {/* Spending / Revenue counter */}
      <SpendingRevenueCounter
        frame={frame}
        fps={fps}
        spendingValue={spendingValue}
        revenueValue={revenueValue}
      />

      {/* Floating dollar signs */}
      <FloatingDollars frame={frame} width={width} startFrame={CELEBRATION_START} />

      {/* Confetti */}
      <ConfettiEffect frame={frame} width={width} startFrame={CELEBRATION_START} />

      {/* Final text */}
      <FinalText frame={frame} fps={fps} revenueValue={revenueValue} />
    </AbsoluteFill>
  );
};
