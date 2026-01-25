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

interface MatrixRainProps {
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export default function MatrixRain({
  text = "",
  primaryColor = "#0a1933",
  secondaryColor = "#1e40af",
}: MatrixRainProps) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
  const columns = Math.floor(width / 20);
  const drops = Array.from({ length: columns }).map((_, i) => ({
    x: i * 20,
    y: random(i) * height,
    speed: random(i) * 5 + 5,
    char: characters[Math.floor(random(i) * characters.length)],
  }));

  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
        position: "relative",
      }}
    >
      {drops.map((drop, i) => {
        const y = (drop.y + frame * drop.speed) % height;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: drop.x,
              top: y,
              color: `rgba(255, 255, 255, ${1 - (y / height) * 0.6})`,
              fontSize: "25px",
              fontFamily: "monospace",
              fontWeight: "bold",
              textShadow: "0 0 8px rgba(59, 130, 246, 0.9)",
            }}
          >
            {characters[Math.floor((frame + i) / 5) % characters.length]}
          </div>
        );
      })}
      {text && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "6rem",
            fontWeight: "bold",
            color: "white",
            textShadow: "0 0 20px rgba(255,255,255,0.8)",
            fontFamily: "monospace",
            textAlign: "center",
            width: "100%",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
