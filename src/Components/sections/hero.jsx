import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const animateWords = (text, delay = 0) => {
    return text.split(" ").map((word, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: delay + index * 0.1,
          ease: [0.33, 1, 0.68, 1],
        }}
        style={{
          display: "inline-block",
          marginRight: "0.3em",
          color: "#0071BC",
        }}
      >
        {word}
      </motion.span>
    ));
  };

  const animateParagraphLines = (lines, delay = 0) => {
    return lines.map((line, lineIndex) => (
      <span key={lineIndex} className="block overflow-hidden">
        {line.split(" ").map((word, wordIndex) => (
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: delay + (lineIndex * 3 + wordIndex) * 0.05,
              ease: [0.33, 1, 0.68, 1],
            }}
            style={{
              display: "inline-block",
              marginRight: "0.3em",
              color: "#FFFFFF",
            }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    ));
  };

  return (
    <section className="relative w-full min-h-[80vh] md:min-h-screen pt-[100px] pb-0 flex flex-col">
      <div className="relative flex-1 flex flex-col justify-between pl-6 pr-2 md:pl-20 md:pr-4 lg:pl-32 lg:pr-6 max-w-[1800px] mx-auto w-full overflow-visible">
        {/* Huge Animated Text Heading */}
        <div className="w-full mt-[10px] md:mt-[20px] relative overflow-visible">
          <h1
            className="flex flex-col text-black uppercase w-full md:w-auto"
            style={{
              fontSize: "clamp(50px, 10vw, 152px)",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              lineHeight: "1.1",
              letterSpacing: "-0.04em",
            }}
          >
            <span className="flex items-center justify-center md:justify-start gap-1 md:gap-2 overflow-hidden flex-wrap md:flex-nowrap">
              <motion.span
                className="text-[0.8em]"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                style={{ color: "#0071BC" }}
              >
                ✳︎
              </motion.span>
              <span className="overflow-hidden inline-block">
                {animateWords("Digital", 0.2)}
              </span>
              <span className="overflow-hidden inline-block">
                {animateWords("Solutions", 0.4)}
              </span>
            </span>

            <span className="ml-0 md:ml-[35vw] lg:ml-[450px] block relative text-center md:text-left">
              {/* Commitment Statement positioned to the left of TRANSFORM */}
              <div className="hidden md:block absolute left-0 top-[50%] -translate-y-1/2 -translate-x-[110%] z-10 pr-4">
                <h2 className="text-[20px] md:text-[24.7px] leading-[1.4] font-medium tracking-tight text-white text-right lowercase">
                  {animateParagraphLines(
                    [
                      "We deliver innovative solutions",
                      "that transform your digital presence",
                      "and accelerate business growth",
                    ],
                    0.6,
                  )}
                </h2>
              </div>

              <span className="overflow-hidden inline-block">
                {animateWords("Built For", 0.6)}
              </span>
            </span>

            <span className="block ml-0 md:ml-[15vw] lg:ml-[200px] overflow-hidden -mt-0 md:-mt-6 text-center md:text-left">
              {animateWords("Success", 0.9)}
            </span>
          </h1>

          {/* Mobile Paragraph - Below heading */}
          <div className="md:hidden mt-8">
            <h2 className="text-[20px] leading-[1.4] font-medium tracking-tight text-white text-center lowercase">
              {animateParagraphLines(
                [
                  "We deliver innovative solutions",
                  "that transform your digital presence",
                  "and accelerate business growth",
                ],
                0.6,
              )}
            </h2>
          </div>
        </div>

        {/* Footer Link Section */}
        <div className="w-full pt-[20px] md:pt-[40px] pb-[100px] md:pb-[150px] overflow-hidden pl-6 pr-8 md:pl-20 md:pr-24 lg:pl-32 lg:pr-40 text-left">
          <motion.a
            href="#how-we-help"
            className="group inline-flex items-center no-underline border-b border-cyan-400 pb-1"
            style={{
              fontFamily: "Poppins",
              fontSize: "clamp(20px, 5vw, 30.4px)",
              fontWeight: 400,
              color: "#FFFFFF",
            }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <span>Explore Our Services</span>
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
