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

import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface PulsingTextProps {
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function PulsingText({
  text = "Pulse",
  primaryColor = "white",
  secondaryColor = "rgba(255, 255, 255, 0.2)",
}: PulsingTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        gap: "1rem",
      }}
    >
      {text.split("").map((char, i) => {
        const delay = i * 6;
        const pulse = interpolate(
          ((frame - delay) % 30) / 30,
          [0, 0.5, 1],
          [1, 1.2, 1],
          {
            extrapolateRight: "clamp",
          }
        );

        const opacity = interpolate(
          ((frame - delay) % 30) / 30,
          [0, 0.5, 1],
          [0.5, 1, 0.5],
          {
            extrapolateRight: "clamp",
          }
        );

        return (
          <div
            key={i}
            style={{
              position: "relative",
              transform: `scale(${pulse})`,
            }}
          >
            <span
              style={{
                fontSize: "5rem",
                fontWeight: "bold",
                color: primaryColor,
                position: "relative",
                zIndex: 2,
              }}
            >
              {char}
            </span>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80px",
                height: "80px",
                background: secondaryColor,
                borderRadius: "50%",
                filter: "blur(20px)",
                opacity: opacity,
                zIndex: 1,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
