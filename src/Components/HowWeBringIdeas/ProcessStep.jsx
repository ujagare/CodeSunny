import React from "react";

const ProcessStep = ({ step, index, isVisible }) => {
  const isLeft = step.position === "left";

  // Parse description to handle bold text
  const parseDescription = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className={`relative w-full transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Mobile Layout */}
      <div className="block md:hidden">
        <div className="flex items-start gap-4">
          {/* Number */}
          <span
            className="text-[3.5rem] font-extralight tracking-tight leading-none shrink-0"
            style={{
              color: "#2a2a3a",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {step.number}
          </span>
          {/* Content */}
          <div className="flex-1 pt-2">
            <h3 className="text-[1.5rem] font-medium text-white mb-3 tracking-tight leading-tight">
              {step.title}
            </h3>
            <p className="text-[#8b8b9e] text-sm leading-[1.7]">
              {parseDescription(step.description)}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-start w-full">
        {/* Left Content */}
        <div className={`w-[42%] ${isLeft ? "pr-12" : ""}`}>
          {isLeft && (
            <div className="text-left">
              <h3 className="text-[2.25rem] lg:text-[2.5rem] font-medium text-white mb-5 tracking-tight leading-tight">
                {step.title}
              </h3>
              <p className="text-[#8b8b9e] text-base lg:text-[1.1rem] leading-[1.75] max-w-[500px]">
                {parseDescription(step.description)}
              </p>
            </div>
          )}
        </div>

        {/* Center Timeline with Number */}
        <div className="w-[16%] flex flex-col items-center relative">
          <span
            className="text-[4.5rem] lg:text-[5.5rem] font-extralight tracking-tight leading-none"
            style={{
              color: "#2a2a3a",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {step.number}
          </span>
        </div>

        {/* Right Content */}
        <div className={`w-[42%] ${!isLeft ? "pl-12" : ""}`}>
          {!isLeft && (
            <div className="text-left">
              <h3 className="text-[2.25rem] lg:text-[2.5rem] font-medium text-white mb-5 tracking-tight leading-tight">
                {step.title}
              </h3>
              <p className="text-[#8b8b9e] text-base lg:text-[1.1rem] leading-[1.75] max-w-[500px]">
                {parseDescription(step.description)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessStep;
