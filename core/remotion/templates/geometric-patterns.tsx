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

import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface GeometricPatternsProps {
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function GeometricPatterns({
  text = "",
  primaryColor = "#0f172a",
  secondaryColor = "#1e293b",
}: GeometricPatternsProps) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const patterns = Array.from({ length: 20 }).map((_, i) => {
    const rotation = spring({
      frame: frame - i * 3,
      fps: 30,
      from: 0,
      to: 360,
      config: { damping: 100 },
    });

    const scale = spring({
      frame: frame - i * 3,
      fps: 30,
      from: 0.5,
      to: 1,
      config: { damping: 100 },
    });

    return { rotation, scale, index: i };
  });

  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {patterns.map(({ rotation, scale, index }) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "100%",
            height: "100%",
            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
            border: "2px solid rgba(255,255,255,0.1)",
            borderRadius: `${index * 5}%`,
          }}
        />
      ))}
      {text && (
        <div
          style={{
            zIndex: 10,
            color: "white",
            fontSize: "4rem",
            fontWeight: "bold",
            textShadow: "0 4px 8px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
