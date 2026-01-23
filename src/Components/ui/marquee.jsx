import * as React from "react"

export function Marquee({
  children,
  pauseOnHover = false,
  direction = "left",
  speed = 30,
  className = "",
  ...props
}) {
  return (
    <div 
      className={`w-full overflow-hidden sm:mt-24 mt-10 z-10 ${className}`}
      {...props}
    >
      <style>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .marquee-content {
          display: flex;
          gap: 2rem;
          animation: marquee-scroll ${speed}s linear infinite;
        }
        
        .marquee-content.reverse {
          animation: marquee-scroll ${speed}s linear infinite reverse;
        }
      `}</style>
      <div className="relative flex overflow-hidden py-4 px-8">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#050515] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#050515] to-transparent z-10"></div>
        <div 
          className={`marquee-content ${direction === "right" ? "reverse" : ""}`}
        >
          {children}
          {children}
        </div>
      </div>
    </div>
  )
}
