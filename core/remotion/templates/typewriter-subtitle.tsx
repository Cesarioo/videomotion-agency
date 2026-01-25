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

import { interpolate, useCurrentFrame } from "remotion";

interface TypewriterSubtitleProps {
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function TypewriterSubtitle({
  text = "I like typing...",
  primaryColor = "white",
  secondaryColor = "#60a5fa",
}: TypewriterSubtitleProps) {
  const frame = useCurrentFrame();

  const visibleCharacters = Math.floor(
    interpolate(frame, [0, 45], [0, text.length], {
      extrapolateRight: "clamp",
    })
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {text
        .slice(0, visibleCharacters)
        .split("")
        .map((char, index) => {
          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                fontFamily: "'Courier New', monospace",
                fontSize: "3rem",
                fontWeight: "bold",
                color: primaryColor,
                transition: "all 0.05s ease-out",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      <span
        style={{
          fontSize: "3rem",
          color: secondaryColor,
          opacity: frame % 15 < 7 ? 1 : 0,

          marginLeft: "0.2rem",
          verticalAlign: "middle",
        }}
      >
        ▌
      </span>
    </div>
  );
}
