import React from "react";

export function SpinningText({
  children,
  duration = 10,
  radius = 80,
  fontSize = 16,
  reverse = false,
  className = "",
}) {
  const text = children || "";
  const characters = text.split("");

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: radius * 2,
        height: radius * 2,
        position: "relative",
        zIndex: 9999,
      }}
    >
      <svg
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        style={{
          animation: `spin-slow ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <path
            id="circlePath"
            d={`M ${radius},${radius} m -${radius},0 a ${radius},${radius} 0 1,1 ${radius * 2},0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <text
          fontSize={fontSize}
          fill="currentColor"
          fontWeight="600"
          style={{ textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
        >
          <textPath href="#circlePath" startOffset="0%">
            {characters.map((char, i) => (
              <tspan key={i}>{char}</tspan>
            ))}
          </textPath>
        </text>
      </svg>
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
