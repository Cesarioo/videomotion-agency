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

interface CardFlipProps {
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function CardFlip({
  text = "Front|Back",
  primaryColor = "#1e3a8a",
  secondaryColor = "#3b82f6",
}: CardFlipProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const [frontText, backText] = text.includes("|") ? text.split("|") : [text, text];

  const rotation = spring({
    frame,
    fps,
    from: 0,
    to: 360,
    config: {
      damping: 15,
      mass: 0.5,
    },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        perspective: "1000px",
      }}
    >
      <div
        style={{
          width: "300px",
          height: "400px",
          transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "white",
          }}
        >
          {frontText}
        </div>
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
            borderRadius: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            color: "white",
            transform: "rotateY(180deg)",
          }}
        >
          {backText}
        </div>
      </div>
    </div>
  );
}
