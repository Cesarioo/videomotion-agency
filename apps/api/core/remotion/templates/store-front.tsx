
import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type StoreFrontProps = {
  text: string; // The company name to display
  primaryColor?: string;
  secondaryColor?: string;
};

const House: React.FC<Omit<StoreFrontProps, 'secondaryColor'>> = ({ text, primaryColor = '#3b82f6' }) => {
  const frame = useCurrentFrame();

  const textDelay = 15;
  const textOpacity = interpolate(frame - textDelay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const textTranslateY = interpolate(frame - textDelay, [0, 10], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const roofStyle: React.CSSProperties = {
    width: 0,
    height: 0,
    borderLeft: '180px solid transparent',
    borderRight: '180px solid transparent',
    borderBottom: `120px solid ${primaryColor}`,
    position: 'relative',
    zIndex: 1,
  };

  const bodyStyle: React.CSSProperties = {
    width: 320,
    height: 240,
    backgroundColor: primaryColor,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: -1,
  };

  const signStyle: React.CSSProperties = {
    marginTop: 30,
    backgroundColor: '#ffffff',
    padding: '12px 24px',
    borderRadius: 8,
    minWidth: 200,
    textAlign: 'center',
    transform: `translateY(${textTranslateY}px)`,
    opacity: textOpacity,
  };

  const Window = ({ style }: { style: React.CSSProperties }) => (
    <div style={{
      position: 'absolute',
      width: 60,
      height: 60,
      backgroundColor: '#bfdbfe',
      border: '4px solid #ffffff',
      borderRadius: 4,
      ...style,
    }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4, backgroundColor: '#ffffff', transform: 'translateX(-50%)' }} />
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 4, backgroundColor: '#ffffff', transform: 'translateY(-50%)' }} />
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={roofStyle}>
        <div style={{
          position: 'absolute',
          top: 40,
          right: -100,
          width: 40,
          height: 60,
          backgroundColor: '#4b5563',
          zIndex: -1,
        }} />
      </div>
      <div style={bodyStyle}>
        <div style={signStyle}>
          <h1 style={{
            margin: 0,
            fontSize: 28,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 800,
            color: '#1f2937',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {text}
          </h1>
        </div>
        <Window style={{ top: 100, left: 40 }} />
        <Window style={{ top: 100, right: 40 }} />
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: 80,
          height: 100,
          backgroundColor: '#374151',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          border: '4px solid #4b5563',
          borderBottom: 'none',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            right: 10,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#d1d5db',
          }} />
        </div>
      </div>
    </div>
  );
};


const Background: React.FC = () => {
    return (
        <AbsoluteFill>
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                }}
            />
        </AbsoluteFill>
    );
};

export const StoreFront: React.FC<StoreFrontProps> = ({
  text,
  primaryColor = '#3b82f6',
  secondaryColor = '#ffffff',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cameraDelay = fps; // Start animation after 1 second
  const cameraScale = spring({
    frame: frame - cameraDelay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 },
    from: 1,
    to: 0.4,
  });

  const numHouses = 5;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: secondaryColor,
      }}
    >
      <Background />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `scale(${cameraScale})`,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numHouses}, 1fr)`,
            gap: '80px',
          }}
        >
          {Array.from({ length: numHouses * numHouses }).map((_, i) => {
            const houseScale = spring({
              frame: frame - cameraDelay - i * 2,
              fps,
              config: { damping: 12, stiffness: 100, mass: 1 },
            });

            return (
              <div key={i} style={{ transform: `scale(${houseScale})` }}>
                <House text={text} primaryColor={primaryColor} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default StoreFront;

