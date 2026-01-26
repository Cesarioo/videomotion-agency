import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

export type GoogleSearchProps = {
  text: string;
};

const DURATION_OF_TYPING = 60;
const CURSOR_BLINK_SPEED = 15;

// --- Colors ---
const GOOGLE_BLUE = '#4285F4';
const GOOGLE_RED = '#EA4335';
const GOOGLE_YELLOW = '#FBBC05';
const GOOGLE_GREEN = '#34A853';

// --- Components ---

const GoogleLogo: React.FC = () => {
  const style: React.CSSProperties = {
    fontSize: 160,
    fontFamily: '"Product Sans", Arial, sans-serif',
    fontWeight: 500,
    letterSpacing: -2,
    marginBottom: 40,
    userSelect: 'none',
  };

  return (
    <div style={style}>
      <span style={{ color: GOOGLE_BLUE }}>G</span>
      <span style={{ color: GOOGLE_RED }}>o</span>
      <span style={{ color: GOOGLE_YELLOW }}>o</span>
      <span style={{ color: GOOGLE_BLUE }}>g</span>
      <span style={{ color: GOOGLE_GREEN }}>l</span>
      <span style={{ color: GOOGLE_RED }}>e</span>
    </div>
  );
};

const Icons = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
    <svg viewBox="0 0 24 24" width="32" height="32">
      <path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z" />
      <path fill="#34a853" d="m11 18.08h2v3.92h-2z" />
      <path fill="#fbbc05" d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z" />
      <path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.41c1.36 1.33 3.14 2.13 5.09 2.13 3.83 0 6.91-3.09 6.91-6.9h-2c0 3.15-2.55 5.01-5.05 5.01z" />
    </svg>
    <svg viewBox="0 0 24 24" width="32" height="32">
      <path fill="#4285f4" d="M17 6h-2V4.5c0-.83-.67-1.5-1.5-1.5H5c-3.31 0-6 2.69-6 6v3h1.5v-3c0-2.48 2.02-4.5 4.5-4.5h8.5V6z" />
      <path fill="#34a853" d="M16 17v-2h1.5v2c0 2.48-2.02 4.5-4.5 4.5H9v1.5h4c3.31 0 6-2.69 6-6z" />
      <path fill="#fbbc05" d="M6 14.5V17h1.5v-2.5h2V13h-2c-.83 0-1.5.67-1.5 1.5z" />
      <path fill="#ea4335" d="M4.5 9V6H3v3c0 .83.67 1.5 1.5 1.5h2.5V9h-2.5z" />
      <path fill="none" d="M0 0h24v24H0z" />
      <circle cx="12" cy="12" r="3.5" fill="#4285f4" />
    </svg>
  </div>
);

const SearchButton = ({ text }: { text: string }) => (
  <button
    style={{
      backgroundColor: '#f8f9fa',
      border: '1px solid #f8f9fa',
      borderRadius: 4,
      color: '#3c4043',
      fontFamily: 'arial,sans-serif',
      fontSize: 18,
      margin: '11px 4px',
      padding: '0 20px',
      height: 48,
      minWidth: 54,
      textAlign: 'center',
      cursor: 'pointer',
    }}
  >
    {text}
  </button>
);

// --- Main Component ---

export const GoogleSearch: React.FC<GoogleSearchProps> = ({ text }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // --- Animation Timeline ---
  const START_MOUSE = DURATION_OF_TYPING + 10;
  const END_MOUSE = START_MOUSE + 30;
  const START_CLICK = END_MOUSE;
  const END_CLICK = START_CLICK + 10;

  // 1. Dynamic Camera (Pan & Zoom during cursor movement)
  const camProgress = interpolate(frame, [START_MOUSE, END_MOUSE], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  // Scale: Zoom in during cursor movement only (1 -> 1.4)
  const currentScale = interpolate(frame, [START_MOUSE, END_MOUSE], [1, 1.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  // Pan: Starts at 0, moves to +200px (shifting scene right to reveal left side)
  const currentTranslateX = interpolate(camProgress, [0, 1], [0, 200]);
  const currentTranslateY = interpolate(camProgress, [0, 1], [0, 50]);

  // 2. Typing Animation
  const textProgress = interpolate(frame, [0, DURATION_OF_TYPING], [0, text.length], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const displayedText = text.slice(0, Math.round(textProgress));

  // 3. Mouse Movement
  const cursorMoveProgress = interpolate(frame, [START_MOUSE, END_MOUSE], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => t * (2 - t),
  });

  const startX = 0;
  const startY = 0;
  const endX = -430; // Target: The Loop Icon
  const endY = 60;   // MODIFIED: Click 10px lower (was 0)

  const currentCursorX = interpolate(cursorMoveProgress, [0, 1], [startX, endX]);
  const currentCursorY = interpolate(cursorMoveProgress, [0, 1], [startY, endY]);

  // 4. Click Animation
  const clickProgress = interpolate(frame, [START_CLICK, END_CLICK], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const barScale = interpolate(clickProgress, [0, 0.5, 1], [1, 0.98, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: 'white', overflow: 'hidden' }}>

      {/* CAMERA CONTAINER */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateX(${currentTranslateX}px) translateY(${currentTranslateY}px) scale(${currentScale})`,
          transformOrigin: 'center center',
        }}
      >
        <GoogleLogo />

        <div
          style={{
            width: 900,
            height: 60,
            border: '1px solid #dfe1e5',
            borderRadius: 24,
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
            boxShadow: '0 1px 6px rgba(32,33,36,0.28)',
            transform: `scale(${barScale})`,
          }}
        >
          {/* Target: The Loop */}
          <svg
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#9aa0a6"
            width="28"
            height="28"
            style={{ marginRight: 16 }}
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontSize: 20, color: '#202124' }}>
            {displayedText}
          </div>

          <Icons />
        </div>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 12 }}>
          <SearchButton text="Google Search" />
          <SearchButton text="I'm Feeling Lucky" />
        </div>

        {/* Cursor - MODIFIED: Removed the "frame > DURATION" condition so it's always visible */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(${currentCursorX}px, ${currentCursorY}px)`,
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))' }}
          >
            <path
              d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19177L11.7845 12.3673H5.65376Z"
              fill="black"
              stroke="white"
            />
          </svg>
        </div>

      </div>
    </AbsoluteFill>
  );
};