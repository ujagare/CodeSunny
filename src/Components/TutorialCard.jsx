import React from "react";
import { Eye, Heart } from "lucide-react";

const TutorialCard = ({
  title,
  views,
  likes,
  thumbnail,
  link,
  label,
  schoolName = "CODESUNNY",
  subtitle = "Complete",
  techName = "Tutorial",
  tagline = "(Learn Everything)",
}) => {
  const hasStats = Boolean(views || likes);
  const imageFileName =
    typeof thumbnail === "string" && thumbnail.includes("/")
      ? thumbnail.split("/").pop()
      : "";
  const imageLabel = imageFileName
    ? imageFileName.replace(/\.(png|jpe?g|webp|gif|svg)$/i, "")
    : "";
  const displayLabel = label || imageLabel;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group w-[65vw] max-w-[280px] sm:w-[360px] sm:max-w-none md:w-[640px] cursor-pointer overflow-hidden rounded-2xl border border-sky-400/50 bg-[#0b0b14]/80 md:bg-transparent p-3 md:p-6 transition-all duration-300 hover:ring-1 hover:ring-sky-400/30 flex-shrink-0"
    >
      {/* Image Section */}
      <div className="relative aspect-[16/9] md:aspect-[16/10] w-full overflow-hidden rounded-xl mb-3 md:mb-6 bg-[#0b0b14]">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          data-no-parallax="true"
          loading="lazy"
          decoding="async"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Overlay intentionally empty for clean image */}
      </div>

      {/* Content Section */}
      <div className="p-0">
        {displayLabel ? (
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 truncate">
            {displayLabel}
          </p>
        ) : null}
        
        {/* Stats */}
        {hasStats ? (
          <div className="flex items-center gap-3 text-[10px] sm:text-xs md:text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Eye className="h-3 w-3 md:h-4 md:w-4" />
              <span>{views}</span>
            </div>
            <span className="text-gray-600">|</span>
            <div className="flex items-center gap-1.5">
              <Heart className="h-3 w-3 md:h-4 md:w-4" />
              <span>{likes}</span>
            </div>
          </div>
        ) : null}
      </div>
    </a>
  );
};

export default TutorialCard;
