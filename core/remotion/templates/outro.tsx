import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

const BG = '#2c3e50';

export type OutroSceneProps = {
  logo?: string;
  agency_name?: string;
  tagline?: string;
};

export const OutroScene: React.FC<OutroSceneProps> = ({
  logo = 'https://pub-2932e499ab424f33983dc4145a780d77.r2.dev/public/logo.png',
  agency_name = 'CHOCOMOTION',
  tagline = "The only SEO agency you'll need",
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  // Slide in from bottom animation
  const slideIn = interpolate(frame, [0, 25], [height, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const logoIn = spring({ frame: frame - 20, fps, config: { damping: 12, stiffness: 140 } });
  const logoScale = interpolate(logoIn, [0, 1], [0.7, 1]);
  const logoY = interpolate(logoIn, [0, 1], [60, 0]);
  const logoRotate = interpolate(logoIn, [0, 1], [180, 0]);

  const textIn = spring({ frame: frame - 35, fps, config: { damping: 14, stiffness: 120 } });
  const textOpacity = interpolate(textIn, [0, 1], [0, 1]);
  const textY = interpolate(textIn, [0, 1], [24, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${slideIn}px)`,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
        <div
          style={{
            transform: `translateY(${logoY}px) rotate(${logoRotate}deg) scale(${logoScale})`,
          }}
        >
          <img
            src={logo}
            alt={`${agency_name} logo`}
            style={{ width: 240, height: 240, objectFit: 'contain' }}
          />
        </div>

        <div style={{ textAlign: 'center', transform: `translateY(${textY}px)`, opacity: textOpacity }}>
          <div
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: 2,
              color: '#ffffff',
            }}
          >
            {agency_name}
          </div>
          <div
            style={{
              marginTop: 12,
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 36,
              color: '#e2e8f0',
            }}
          >
            {tagline}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
