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

// --- Colors ---
const BG_COLOR = '#2c3e50';
const SUCCESS_GREEN = '#27ae60';
const WARNING_YELLOW = '#f39c12';
const ERROR_RED = '#e74c3c';
const TRACK_COLOR = '#2d2d44';
const TEXT_COLOR = '#ffffff';

// --- Timeline Constants ---
const HOOK_END = 120; // Extended for confetti
const IMPRESSIONS_START = 130;
const IMPRESSIONS_END = 200; // Counter finishes at 200, pause 50 frames
const CLICKS_START = 200;
const CLICKS_END = 260; // Counter finishes at 320, pause 50 frames
const SALES_START = 260;
const SALES_END = 350; // Counter finishes at 460, pause 30 frames
const TITLE_END = 370;
const FINAL_TEXT_START = 380;
const FINAL_TEXT_END = 480;

// --- SVG Icons ---

const EyeIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
      fill={color}
    />
  </svg>
);

const CursorIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M4 2l16 12.5-7 1.5-3 7-1.5-8L4 2z"
      fill={color}
      stroke={color}
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

const DollarIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"
      fill={color}
    />
  </svg>
);

// --- Sub-Components ---

const Checkmark: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const delay = 50;
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 8, stiffness: 200 },
  });

  const scaleValue = interpolate(scale, [0, 1], [0, 1.3]);
  const finalScale = frame > delay + 10 
    ? interpolate(frame, [delay + 10, delay + 20], [1.3, 1], { extrapolateRight: 'clamp' })
    : scaleValue;

  if (frame < delay) return null;

  return (
    <div
      style={{
        position: 'absolute',
        right: -100,
        top: '50%',
        transform: `translateY(-50%) scale(${finalScale})`,
      }}
    >
      <svg width="80" height="80" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill={SUCCESS_GREEN} />
        <path
          d="M9 12l2 2 4-4"
          stroke="white"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// --- Custom Confetti ---

const CONFETTI_COLORS = [
  SUCCESS_GREEN,
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#f1c40f',
  '#e74c3c',
  '#1abc9c',
  '#e91e63',
  '#00bcd4',
  '#ff9800',
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
}> = ({ piece, frame }) => {
  const startFrame = 55 + piece.delay;
  
  if (frame < startFrame) return null;

  const progress = frame - startFrame;
  
  // Vertical fall with gravity acceleration
  const gravity = 0.15;
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
  
  // Scale based on rotation to simulate 3D flip
  const scaleX = Math.abs(Math.cos(rotationY * 0.05));
  const scaleY = Math.abs(Math.cos(rotationX * 0.05));
  
  // Fade out as it falls
  const opacity = interpolate(progress, [0, 10, 50, 70], [0, 1, 1, 0], { 
    extrapolateRight: 'clamp' 
  });

  // Don't render if off screen
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

const ConfettiEffect: React.FC<{ frame: number; width: number; height: number }> = ({ frame, width, height }) => {
  const startFrame = 55;
  
  // Generate confetti pieces deterministically using Remotion's random
  const pieces = useMemo(() => {
    const result: ConfettiPieceData[] = [];
    const count = 80;
    
    for (let i = 0; i < count; i++) {
      const seed = `confetti-${i}`;
      result.push({
        id: i,
        x: random(seed + '-x') * (width + 200) - 100,
        delay: random(seed + '-delay') * 15,
        color: CONFETTI_COLORS[Math.floor(random(seed + '-color') * CONFETTI_COLORS.length)],
        size: 8 + random(seed + '-size') * 12,
        shape: (['rect', 'circle', 'square'] as const)[Math.floor(random(seed + '-shape') * 3)],
        rotationSpeed: 3 + random(seed + '-rot') * 8,
        wobbleSpeed: 0.1 + random(seed + '-wobble-speed') * 0.15,
        wobbleAmount: 20 + random(seed + '-wobble-amt') * 40,
        fallSpeed: 6 + random(seed + '-fall') * 6,
        horizontalDrift: (random(seed + '-drift') - 0.5) * 3,
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
        <ConfettiPiece key={piece.id} piece={piece} frame={frame} />
      ))}
    </div>
  );
};

// --- Metric Card with Growing Icon and Number ---

const MetricCard: React.FC<{
  icon: React.FC<{ size: number; color: string }>;
  label: string;
  value: number;
  maxValue: number;
  color: string;
  frame: number;
  fps: number;
  startFrame: number;
  endFrame?: number;
  duration: number;
  shake?: boolean;
  shakeStart?: number;
  showBigZero?: boolean;
}> = ({
  icon: Icon,
  label,
  value,
  maxValue,
  color,
  frame,
  fps,
  startFrame,
  endFrame,
  duration,
  shake = false,
  shakeStart = 0,
  showBigZero = false,
}) => {
  // Entrance animation - 3D revolve in from right (like on a ball)
  const entranceProgress = interpolate(
    frame,
    [startFrame, startFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const entranceRotateY = interpolate(entranceProgress, [0, 1], [120, 0], { easing: Easing.out(Easing.cubic) });
  const entranceScale = interpolate(entranceProgress, [0, 0.5, 1], [0.3, 0.8, 1], { easing: Easing.out(Easing.cubic) });
  const entranceOpacity = interpolate(entranceProgress, [0, 0.4, 1], [0, 1, 1]);

  // Exit animation - 3D revolve out to left (like on a ball)
  const exitProgress = endFrame
    ? interpolate(frame, [endFrame - 15, endFrame], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const exitRotateY = interpolate(exitProgress, [0, 1], [0, -120], { easing: Easing.in(Easing.cubic) });
  const exitScale = interpolate(exitProgress, [0, 0.5, 1], [1, 0.8, 0.3], { easing: Easing.in(Easing.cubic) });
  const exitOpacity = interpolate(exitProgress, [0, 0.6, 1], [1, 1, 0]);

  const rotateY = entranceRotateY + exitRotateY;
  const scale = entranceScale * exitScale;
  const opacity = entranceOpacity * exitOpacity;

  // Icon scale grows as number increases
  const countStart = startFrame + 10;
  const countProgress = interpolate(
    frame,
    [countStart, countStart + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  );

  const currentValue = Math.round(countProgress * value);
  const iconScale = interpolate(countProgress, [0, 1], [0.6, 1.2]);

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Shake effect for sales
  let shakeX = 0;
  if (shake && frame > shakeStart) {
    const shakeProgress = frame - shakeStart;
    if (shakeProgress < 60) {
      shakeX = Math.sin(shakeProgress * 2.5) * 15 * (1 - shakeProgress / 60);
    }
  }

  // Color pulse for when complete
  const isComplete = countProgress >= 0.99;
  const pulseOpacity = isComplete ? 0.15 + 0.1 * Math.sin(frame * 0.15) : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: `perspective(1000px) rotateY(${rotateY}deg) scale(${scale}) translateX(${shakeX}px)`,
        transformStyle: 'preserve-3d',
        opacity,
        position: 'absolute',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          opacity: pulseOpacity,
          transform: 'translateY(-20px)',
        }}
      />

      {/* Icon container with scale */}
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: '50%',
          backgroundColor: `${color}20`,
          border: `4px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 30,
          transform: `scale(${iconScale})`,
          boxShadow: `0 10px 40px ${color}40`,
        }}
      >
        <Icon size={100} color={color} />
      </div>

      {/* Number display */}
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: showBigZero && value === 0 ? 180 : 72,
          fontWeight: 900,
          color: color,
          textShadow: showBigZero && value === 0
            ? `0 10px 60px ${color}80`
            : `0 4px 20px ${color}60`,
          marginBottom: 10,
        }}
      >
        {formatNumber(currentValue)}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 32,
          fontWeight: 600,
          color: TEXT_COLOR,
          textTransform: 'uppercase',
          letterSpacing: 3,
        }}
      >
        {label}
      </div>
    </div>
  );
};

const FinalText: React.FC<{ frame: number; amountSpent: string }> = ({ frame, amountSpent }) => {
  if (frame < FINAL_TEXT_START) return null;

  const FLIP_START = FINAL_TEXT_START + 50;
  const FLIP_END = FLIP_START + 20;

  // Swipe in from the right
  const entranceProgress = interpolate(
    frame,
    [FINAL_TEXT_START, FINAL_TEXT_START + 20],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const entranceX = interpolate(entranceProgress, [0, 1], [1500, 0], { easing: Easing.out(Easing.cubic) });
  const entranceOpacity = interpolate(entranceProgress, [0, 0.3, 1], [0, 1, 1]);

  // 3D flip rotation (rotateX for down-to-up flip - other direction)
  const flipProgress = interpolate(
    frame,
    [FLIP_START, FLIP_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const rotateX = interpolate(flipProgress, [0, 1], [0, -180], { easing: Easing.inOut(Easing.cubic) });

  // Swipe out to the left (after flip)
  const exitProgress = interpolate(
    frame,
    [FINAL_TEXT_END - 20, FINAL_TEXT_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const exitX = interpolate(exitProgress, [0, 1], [0, -1500], { easing: Easing.in(Easing.cubic) });
  const exitOpacity = interpolate(exitProgress, [0, 0.7, 1], [1, 1, 0]);

  const translateX = entranceX + exitX;
  const opacity = entranceOpacity * exitOpacity;

  // Determine which face is visible (for negative rotation)
  const showSecondFace = rotateX < -90;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translateX(${translateX}px)`,
        opacity,
        perspective: '1000px',
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg)`,
          transformStyle: 'preserve-3d',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Front face - Problem text */}
        <div
          style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 96,
            fontWeight: 900,
            color: ERROR_RED,
            textShadow: '0 8px 60px rgba(231, 76, 60, 0.6)',
            textAlign: 'center',
            lineHeight: 1.3,
            backfaceVisibility: 'hidden',
            opacity: showSecondFace ? 0 : 1,
          }}
        >
          {amountSpent} spent.<br />0 sales.
        </div>

        {/* Back face - Solution text (centered) */}
        <div
          style={{
            position: 'absolute',
            transform: 'rotateX(-180deg)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 96,
            fontWeight: 900,
            color: SUCCESS_GREEN,
            textShadow: '0 8px 60px rgba(39, 174, 96, 0.6)',
            textAlign: 'center',
            lineHeight: 1.3,
            backfaceVisibility: 'hidden',
            opacity: showSecondFace ? 1 : 0,
            whiteSpace: 'nowrap',
          }}
        >
          Let's fix that!
        </div>
      </div>
    </div>
  );
};

// --- Main Hook Section ---

const HookSection: React.FC<{
  frame: number;
  fps: number;
  width: number;
  height: number;
  campaignName: string;
}> = ({ frame, fps, width, height, campaignName }) => {
  // Only show during hook phase
  const hookOpacity = interpolate(
    frame,
    [HOOK_END - 20, HOOK_END],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  if (frame > HOOK_END + 10) return null;

  const fillProgress = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
  });

  const fillPercent = interpolate(fillProgress, [0, 1], [0, 100]);

  // Text animation
  const textOpacity = interpolate(
    frame,
    [40, 60],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const textScale = interpolate(
    frame,
    [40, 60],
    [0.8, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(1.5)) }
  );

  // Gradient pulse on complete
  const isComplete = fillPercent > 99;
  const pulseOpacity = isComplete ? 0.4 + 0.2 * Math.sin(frame * 0.2) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: hookOpacity,
      }}
    >
      {/* Gradient pulse background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at center, ${SUCCESS_GREEN}50 0%, transparent 50%)`,
          opacity: pulseOpacity,
        }}
      />

      {/* Campaign label */}
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 52,
          fontWeight: 600,
          color: TEXT_COLOR,
          marginBottom: 40,
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}
      >
        {campaignName}
      </div>

      {/* Progress bar container */}
      <div style={{ position: 'relative', width: 800 }}>
        <div
          style={{
            width: '100%',
            height: 80,
            backgroundColor: TRACK_COLOR,
            borderRadius: 40,
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            style={{
              width: `${fillPercent}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${SUCCESS_GREEN}, #2ecc71, #58d68d)`,
              borderRadius: 40,
            }}
          />
        </div>

        {/* Percentage text */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 40,
            fontWeight: 800,
            color: TEXT_COLOR,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          {Math.round(fillPercent)}%
        </div>

        {/* Checkmark */}
        <Checkmark frame={frame} fps={fps} />
      </div>

      {/* Campaign launched text */}
      <div
        style={{
          marginTop: 60,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 72,
          fontWeight: 800,
          color: TEXT_COLOR,
          opacity: textOpacity,
          transform: `scale(${textScale})`,
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        Campaign launched! 🚀
      </div>

      {/* Confetti */}
      <ConfettiEffect frame={frame} width={width} height={height} />
    </div>
  );
};

// --- Main Problem Section ---

const ProblemSection: React.FC<{
  frame: number;
  fps: number;
  impressionsValue: number;
  clicksValue: number;
  salesValue: number;
  amountSpent: string;
}> = ({ frame, fps, impressionsValue, clicksValue, salesValue, amountSpent }) => {
  if (frame < HOOK_END - 20) return null;

  const sectionOpacity = interpolate(
    frame,
    [HOOK_END - 20, HOOK_END + 10],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Title exit animation - swipe left
  const titleExitProgress = interpolate(
    frame,
    [TITLE_END - 20, TITLE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const titleTranslateX = interpolate(titleExitProgress, [0, 1], [0, -1500], { easing: Easing.in(Easing.cubic) });
  const titleOpacity = interpolate(titleExitProgress, [0, 0.8, 1], [1, 1, 0]);

  // Don't render title after it's gone
  const showTitle = frame < TITLE_END + 10;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: sectionOpacity,
      }}
    >
      {/* Title with swipe out */}
      {showTitle && (
        <div
          style={{
            position: 'absolute',
            top: 80,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: 48,
            fontWeight: 600,
            color: TEXT_COLOR,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: titleOpacity * 0.8,
            transform: `translateX(${titleTranslateX}px)`,
          }}
        >
          Campaign Results
        </div>
      )}

      {/* Metric cards - centered, one at a time with 3D perspective */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        <MetricCard
          icon={EyeIcon}
          label="Impressions"
          value={impressionsValue}
          maxValue={impressionsValue}
          color={SUCCESS_GREEN}
          frame={frame}
          fps={fps}
          startFrame={IMPRESSIONS_START}
          endFrame={IMPRESSIONS_END}
          duration={40}
        />
        <MetricCard
          icon={CursorIcon}
          label="Clicks"
          value={clicksValue}
          maxValue={impressionsValue}
          color={WARNING_YELLOW}
          frame={frame}
          fps={fps}
          startFrame={CLICKS_START}
          endFrame={CLICKS_END}
          duration={40}
        />
        <MetricCard
          icon={DollarIcon}
          label="Sales"
          value={salesValue}
          maxValue={impressionsValue}
          color={ERROR_RED}
          frame={frame}
          fps={fps}
          startFrame={SALES_START}
          endFrame={SALES_END}
          duration={60}
          shake={true}
          shakeStart={SALES_START + 50}
          showBigZero={true}
        />
      </div>

      {/* Final text - big in the middle */}
      <FinalText frame={frame} amountSpent={amountSpent} />
    </div>
  );
};

// --- Props Type ---
export type SalesIssueProps = {
  campaignName?: string;
  impressionsValue?: number;
  clicksValue?: number;
  salesValue?: number;
  amountSpent?: string;
};

// --- Main Component ---
export const SalesIssue: React.FC<SalesIssueProps> = ({
  campaignName = 'Marketing Campaign',
  impressionsValue = 150000,
  clicksValue = 4500,
  salesValue = 0,
  amountSpent = '$15,000',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: BG_COLOR }}>
      <HookSection frame={frame} fps={fps} width={width} height={height} campaignName={campaignName} />
      <ProblemSection
        frame={frame}
        fps={fps}
        impressionsValue={impressionsValue}
        clicksValue={clicksValue}
        salesValue={salesValue}
        amountSpent={amountSpent}
      />
    </AbsoluteFill>
  );
};
