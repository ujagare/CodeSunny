import React from "react";

const Timeline = ({ progress }) => {
  return (
    <>
      {/* Desktop Timeline */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 z-0">
        {/* Background line */}
        <div className="absolute inset-0 bg-[#1f1f2e]" />
        {/* Gradient glow line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] transition-all duration-300"
          style={{
            height: `${Math.min(progress * 100, 100)}%`,
            background:
              "linear-gradient(180deg, #4f46e5 0%, #7c3aed 50%, #4f46e5 100%)",
            boxShadow:
              "0 0 20px 2px rgba(124, 58, 237, 0.5), 0 0 40px 4px rgba(79, 70, 229, 0.3)",
          }}
        />
        {/* Glow effect at the progress point */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full transition-all duration-300"
          style={{
            top: `${Math.min(progress * 100, 100)}%`,
            background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)",
            boxShadow: "0 0 30px 10px rgba(124, 58, 237, 0.6)",
            opacity: progress > 0 ? 1 : 0,
          }}
        />
      </div>
      {/* Mobile Timeline - hidden for cleaner mobile view */}
    </>
  );
};

export default Timeline;
