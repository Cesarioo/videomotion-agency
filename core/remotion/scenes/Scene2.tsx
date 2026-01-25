import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 30], [0.5, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 100,
        backgroundColor: '#e0e0e0',
      }}
    >
      <div style={{ transform: `scale(${scale})` }}>Scene 2</div>
    </AbsoluteFill>
  );
};

