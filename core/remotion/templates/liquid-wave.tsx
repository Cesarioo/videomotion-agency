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

import { useCurrentFrame, useVideoConfig } from "remotion";

interface LiquidWaveProps {
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function LiquidWave({
  text = "",
  primaryColor = "#1e3a8a",
  secondaryColor = "#3b82f6",
}: LiquidWaveProps) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const numberOfPoints = 50;
  const points = Array.from({ length: numberOfPoints + 1 }).map((_, i) => {
    const x = (i / numberOfPoints) * width;
    const waveHeight = Math.sin(frame / 20 + i / 5) * 50;
    const y = height / 2 + waveHeight;
    return `${x},${y}`;
  });

  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} style={{ background: "#111827", position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
        </defs>
        <path
          d={`M 0,${height} ${points.join(" ")} ${width},${height} Z`}
          fill="url(#gradient)"
          style={{
            filter: "blur(10px)",
          }}
        />
      </svg>
      {text && (
        <div
          style={{
            position: "absolute",
            top: "30%", // Position above the wave
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "5rem",
            fontWeight: "bold",
            color: "white",
            textShadow: "0 4px 10px rgba(0,0,0,0.5)",
            zIndex: 10,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
