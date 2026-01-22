import React, { forwardRef, useRef } from "react";
import { AnimatedBeam } from "./AnimatedBeam";
import chatgptLogo from "../assets/images/ai logo/512px-ChatGPT-Logo.svg.png";
import claudeLogo from "../assets/images/ai logo/claude-color.svg";
import bardLogo from "../assets/images/ai logo/512px-Google_Bard_logo.svg.png";
import openaiLogo from "../assets/images/ai logo/openai.svg";
import replitLogo from "../assets/images/ai logo/32px-New_Replit_Logo.svg.png";
import grokLogo from "../assets/images/ai logo/icons8-grok-50.png";
import aiLogo from "../assets/images/ai logo/icons8-ai-80.png";

const Circle = forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={`z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] ${className || ""}`}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamDemo() {
  const containerRef = useRef(null);
  const div1Ref = useRef(null);
  const div2Ref = useRef(null);
  const div3Ref = useRef(null);
  const div4Ref = useRef(null);
  const div5Ref = useRef(null);
  const div6Ref = useRef(null);
  const div7Ref = useRef(null);

  return (
    <div
      className="relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      <div className="flex size-full max-h-[200px] max-w-lg flex-col items-stretch justify-between gap-10">
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div1Ref}>
            <img
              src={chatgptLogo}
              alt="ChatGPT"
              className="w-full h-full object-contain"
            />
          </Circle>
          <Circle ref={div5Ref}>
            <img
              src={bardLogo}
              alt="Bard"
              className="w-full h-full object-contain"
            />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div2Ref}>
            <img
              src={claudeLogo}
              alt="Claude"
              className="w-full h-full object-contain"
            />
          </Circle>
          <Circle ref={div4Ref} className="size-16">
            <img
              src={aiLogo}
              alt="AI"
              className="w-full h-full object-contain"
            />
          </Circle>
          <Circle ref={div6Ref}>
            <img
              src={replitLogo}
              alt="Replit"
              className="w-full h-full object-contain"
            />
          </Circle>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Circle ref={div3Ref}>
            <img
              src={grokLogo}
              alt="Grok"
              className="w-full h-full object-contain"
            />
          </Circle>
          <Circle ref={div7Ref}>
            <img
              src={openaiLogo}
              alt="OpenAI"
              className="w-full h-full object-contain"
            />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse
      />
    </div>
  );
}
