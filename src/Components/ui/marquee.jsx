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
      <div className="relative flex max-w-[90vw] overflow-hidden py-5">
        <div 
          className={`flex w-max animate-marquee ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""} ${direction === "right" ? "animate-marquee-reverse" : ""}`}
          style={{ "--duration": `${speed}s` }}
        >
          {children}
          {children}
        </div>
      </div>
    </div>
  )
}
