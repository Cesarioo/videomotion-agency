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

interface AnimatedTextProps {
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function AnimatedText({
  text = "Hello Remotion",
  primaryColor = "#ffffff",
  secondaryColor = "#cccccc",
}: AnimatedTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chars = text.split("");

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        textAlign: "center",
      }}
    >
      {chars.map((char, i) => {
        const delay = i * 5;

        const opacity = spring({
          frame: frame - delay,
          fps,
          from: 0,
          to: 1,
          config: { mass: 0.5, damping: 10 },
        });

        const y = spring({
          frame: frame - delay,
          fps,
          from: -50,
          to: 0,
          config: { mass: 0.5, damping: 10 },
        });

        const rotate = spring({
          frame: frame - delay,
          fps,
          from: -180,
          to: 0,
          config: { mass: 0.5, damping: 12 },
        });

        // Alternate colors for a bit of flair if secondary is different
        const charColor = i % 2 === 0 ? primaryColor : secondaryColor;

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              color: charColor,
              fontSize: "5rem",
              fontWeight: "bold",
              transform: `translateY(${y}px) rotate(${rotate}deg)`,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </div>
  );
}
