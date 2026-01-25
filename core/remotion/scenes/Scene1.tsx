import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 100,
        backgroundColor: 'white',
      }}
    >
      <div style={{ opacity }}>Scene 1</div>
    </AbsoluteFill>
  );
};

