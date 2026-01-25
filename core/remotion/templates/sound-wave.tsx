/**
 * Free Remotion Template Component
 * ---------------------------------
 * This template is free to use in your projects!
 * Credit appreciated but not required.
 *
 * Created by the team at https://www.reactvideoeditor.com
 *
 * Happy coding and building amazing videos! 🎉
 */

"use client";

import { random, useCurrentFrame, useVideoConfig } from "remotion";

interface SoundWaveProps {
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function SoundWave({
  text = "",
  primaryColor = "white",
  secondaryColor = "rgba(59, 130, 246, 0.6)",
}: SoundWaveProps) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const BAR_COUNT = 40;
  const bars = Array.from({ length: BAR_COUNT }).map((_, i) => {
    const seed = i * 1000;
    const height =
      Math.abs(Math.sin(frame / 10 + i / 2)) * 100 + random(seed) * 50;

    return {
      height,
      hue: (i / BAR_COUNT) * 180 + frame,
    };
  });

  return (
    <div
      style={{
        width,
        height,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        backdropFilter: "blur(8px)",
        boxShadow: `inset 0 0 100px ${secondaryColor}`,
        position: "relative",
      }}
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            width: "12px",
            height: `${bar.height}px`,
            background: primaryColor,
            borderRadius: "6px",
            transition: "height 0.1s ease",
            boxShadow: `0 0 10px ${secondaryColor}`,
          }}
        />
      ))}
      {text && (
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            color: "white",
            fontSize: "4rem",
            fontWeight: "bold",
            textShadow: "0 4px 8px rgba(0,0,0,0.5)",
            background: "rgba(0,0,0,0.4)",
            padding: "1rem 2rem",
            borderRadius: "1rem",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
