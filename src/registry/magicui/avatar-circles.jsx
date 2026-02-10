import React from "react";
import { cn } from "@/lib/utils";

export function AvatarCircles({
  avatarUrls = [],
  numPeople = 0,
  className,
  maxVisible = 6,
  sizeClass = "h-11 w-11",
  iconSize = 22,
  showExtra = false,
}) {
  const visible = avatarUrls.slice(0, maxVisible);
  const extraCount = Math.max(numPeople - visible.length, 0);

  return (
    <div className={cn("flex items-center -space-x-3", className)}>
      {visible.map((avatar, idx) => (
        <div key={`${avatar.imageUrl ?? avatar.label ?? idx}`} className="block">
          {avatar.icon ? (
            <div
              className={cn(
                sizeClass,
                "rounded-full border-2 border-[#0b0b14] bg-[#2E3192] flex items-center justify-center"
              )}
            >
              <avatar.icon
                className={avatar.iconClassName ?? "text-white"}
                size={iconSize}
              />
            </div>
          ) : (
            <a
              href={avatar.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <img
                src={avatar.imageUrl}
                alt="avatar"
                className={cn(
                  sizeClass,
                  "rounded-full border-2 border-[#0b0b14] object-cover"
                )}
                loading="lazy"
                decoding="async"
              />
            </a>
          )}
        </div>
      ))}
      {showExtra && extraCount > 0 && (
        <div
          className={cn(
            sizeClass,
            "rounded-full border-2 border-[#0b0b14] bg-[#2E3192] text-white text-xs font-semibold flex items-center justify-center"
          )}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
}
