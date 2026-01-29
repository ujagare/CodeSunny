import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AboutSummary = () => {
  return (
    <section className="py-20 md:py-40 overflow-hidden">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-left mb-16 md:mb-20">
          <h2
            className="uppercase inline-block leading-[0.9] border-b-[1.5px] border-cyan-400 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 text-4xl md:text-6xl lg:text-7xl"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: "500",
              color: "#fff",
            }}
          >
            About Us
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-16">
          {/* Left Column: Video Figure */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <div className="relative overflow-hidden w-full max-w-lg aspect-[4/5] md:aspect-square rounded-2xl md:rounded-3xl">
              <div className="w-full h-full">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  loading="lazy"
                  className="w-full h-full object-cover"
                >
                  <source
                    src="https://cuberto.com/assets/home/summary/2.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>

          {/* Right Column: Text Content */}
          <div className="w-full md:w-full flex flex-col items-start text-left md:pl-8">
            <div className="mb-8 space-y-6">
              <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed tracking-tight text-zinc-400 font-medium">
                At CodeSunny, we don't believe in cookie-cutter solutions or
                shortcuts. Every project receives our full attention and
                expertise. We build products exactly as envisioned during the
                design phase, maintaining the highest standards of quality,
                performance, and user experience. Our commitment to excellence
                ensures that your digital presence stands out and delivers
                measurable value to your business and customers.
              </p>
            </div>

            <div>
              <style>{`
                @property --gradient-angle {
                  syntax: "<angle>";
                  initial-value: 0deg;
                  inherits: false;
                }

                .shiny-cta {
                  --gradient-angle: 0deg;
                  position: relative;
                  overflow: hidden;
                  border-radius: 9999px;
                  padding: 0.875rem 1.75rem;
                  font-size: 0.875rem;
                  line-height: 1.2;
                  font-weight: 500;
                  color: #ffffff;
                  background:
                    linear-gradient(#000000, #000000) padding-box,
                    conic-gradient(
                        from var(--gradient-angle),
                        transparent 0%,
                        #1d4ed8 5%,
                        #8484ff 15%,
                        #1d4ed8 30%,
                        transparent 40%,
                        transparent 100%
                      )
                      border-box;
                  border: 2px solid transparent;
                  box-shadow: inset 0 0 0 1px #1a1818;
                  cursor: pointer;
                  animation: border-spin 2.5s linear infinite;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 0.5rem;
                  width: 100%;
                }

                @media (min-width: 640px) {
                  .shiny-cta {
                    width: auto;
                    padding: 1rem 2rem;
                    font-size: 0.9375rem;
                  }
                }

                @keyframes border-spin {
                  to {
                    --gradient-angle: 360deg;
                  }
                }

                .shiny-cta:active {
                  transform: translateY(1px);
                }

                .shiny-cta::before {
                  content: "";
                  pointer-events: none;
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  width: calc(100% - 6px);
                  height: calc(100% - 6px);
                  background: radial-gradient(
                      circle at 2px 2px,
                      white 0.5px,
                      transparent 0
                    )
                    padding-box;
                  background-size: 4px 4px;
                  background-repeat: space;
                  mask-image: conic-gradient(
                    from calc(var(--gradient-angle) + 45deg),
                    black,
                    transparent 10% 90%,
                    black
                  );
                  border-radius: inherit;
                  opacity: 0.4;
                }

                .shiny-cta::after {
                  content: "";
                  pointer-events: none;
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  width: 100%;
                  aspect-ratio: 1;
                  background: linear-gradient(
                    -50deg,
                    transparent,
                    #1d4ed8,
                    transparent
                  );
                  mask-image: radial-gradient(
                    circle at bottom,
                    transparent 40%,
                    black
                  );
                  opacity: 0.6;
                  animation: shimmer 4s linear infinite;
                }

                @keyframes shimmer {
                  to {
                    transform: translate(-50%, -50%) rotate(360deg);
                  }
                }

                .shiny-cta span {
                  position: relative;
                  z-index: 2;
                }
              `}</style>
              <a href="/services/" className="inline-block">
                <button className="shiny-cta focus:outline-none">
                  <span>What we do</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ position: "relative", zIndex: 2 }}
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSummary;
