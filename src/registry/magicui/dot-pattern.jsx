import React from "react";
import { cn } from "@/lib/utils";

export function DotPattern({ className }) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-white/30",
        className
      )}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="dot-pattern"
          x="0"
          y="0"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
  );
}
