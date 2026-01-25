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

interface BounceTextProps {
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function BounceText({
  text = "Start Building|There's never been a better time",
  primaryColor = "#1e3a8a",
  secondaryColor = "#3b82f6",
}: BounceTextProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const parts = text.includes("|") ? text.split("|") : [text, ""];
  const title = parts[0];
  const subtitle = parts[1] || "";

  const slideIn = spring({
    frame,
    fps,
    from: -100,
    to: 0,
    config: {
      damping: 100,
      mass: 1,
      stiffness: 200,
    },
  });

  const fadeIn = spring({
    frame: frame - 15, // Slight delay for subtitle
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 100,
      mass: 1,
    },
  });

  const scaleIn = spring({
    frame,
    fps,
    from: 0.5,
    to: 0.8,
    config: {
      damping: 100,
      mass: 1,
      stiffness: 200,
    },
  });

  const containerFadeIn = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 100,
      mass: 1,
    },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${scaleIn})`,
        width: "80%",
        padding: "2rem 3rem",
        background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
        borderRadius: "20px",
        opacity: containerFadeIn,
      }}
    >
      <div
        style={{
          transform: `translateX(${slideIn}%)`,
        }}
      >
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "900",
            color: "white",
            margin: 0,
            lineHeight: "1",
            fontFamily: "Inter, sans-serif",
            textShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <h2
            style={{
              fontSize: "1.8rem",
              color: "white",
              margin: 0,
              marginTop: "0.75rem",
              fontWeight: "500",
              opacity: fadeIn,
              fontFamily: "Inter, sans-serif",
              textShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            {subtitle}
          </h2>
        )}
      </div>
    </div>
  );
}
