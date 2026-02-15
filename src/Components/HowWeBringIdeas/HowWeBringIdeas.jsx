import React, { useEffect, useRef, useState } from "react";
import { processSteps } from "./processSteps";
import ProcessStep from "./ProcessStep";
import Timeline from "./Timeline";

const HowWeBringIdeas = () => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = sectionRef.current.offsetHeight;

      // Better scroll progress calculation
      // Progress from 0 to 1 as section scrolls through viewport
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      let progress = 0;
      if (sectionTop < windowHeight && sectionBottom > 0) {
        // Calculate how much of the section has been scrolled
        const scrolled = windowHeight - sectionTop;
        const totalScrollDistance = sectionHeight + windowHeight;
        progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance));
      }

      setScrollProgress(progress);

      // Determine which steps should be visible
      const stepElements = sectionRef.current.querySelectorAll("[data-step]");
      const newVisibleSteps = [];
      stepElements.forEach((el, index) => {
        const stepRect = el.getBoundingClientRect();
        if (stepRect.top < windowHeight * 0.85) {
          newVisibleSteps.push(index);
        }
      });
      setVisibleSteps(newVisibleSteps);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-16 md:py-28 px-5 md:px-8 overflow-hidden"
    >
      <div className="relative max-w-[1200px] mx-auto">
        {/* Section Title */}
        <h2
          className="text-center text-2xl md:text-[3.25rem] font-normal text-white mb-12 md:mb-28 tracking-tight leading-tight"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          How we bring ideas to life
        </h2>

        {/* Process Steps Container */}
        <div className="relative">
          {/* Timeline */}
          <Timeline progress={scrollProgress} />

          {/* Steps */}
          <div className="relative z-10 space-y-16 md:space-y-36">
            {processSteps.map((step, index) => (
              <div key={step.id} data-step={index}>
                <ProcessStep
                  step={step}
                  index={index}
                  isVisible={visibleSteps.includes(index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeBringIdeas;
