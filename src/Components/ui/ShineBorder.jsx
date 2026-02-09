import React from "react";
import { cn } from "../../lib/utils";

export function ShineBorder({ shineColor, className }) {
  const colors = Array.isArray(shineColor) && shineColor.length
    ? shineColor
    : ["#7C9BFE", "#7CE7FE", "#9B7CFE"];

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] p-[1px]",
        className
      )}
      aria-hidden="true"
    >
      <div
        className="h-full w-full rounded-[inherit] border border-transparent bg-[conic-gradient(from_0deg,var(--shine-colors))] animate-spin"
        style={{
          animationDuration: "8s",
          ["--shine-colors"]: colors.join(", "),
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
    </div>
  );
}
