import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useTextReveal = () => {
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll("[data-reveal-text]");

      console.log("Text reveal elements found:", revealElements.length);

      revealElements.forEach((element) => {
        // Skip if already processed
        if (element.hasAttribute("data-reveal-processed")) return;
        element.setAttribute("data-reveal-processed", "true");

        const text = element.innerText;

        // Split text into spans for each character
        element.innerHTML = text
          .split("")
          .map((char) => {
            if (char === " ") {
              return '<span style="display: inline-block; width: 0.25em;"></span>';
            }
            return `<span style="display: inline-block; overflow: hidden;"><span style="display: inline-block;">${char}</span></span>`;
          })
          .join("");

        const spans = element.querySelectorAll("span > span");

        gsap.fromTo(
          spans,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "power4.out",
            stagger: 0.02,
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "top 30%",
              scrub: true,
              markers: false,
            },
          },
        );
      });
    }, 500);

    // Cleanup
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => {
        // Only kill triggers related to text reveal
        if (
          trigger.vars.trigger &&
          trigger.vars.trigger.hasAttribute &&
          trigger.vars.trigger.hasAttribute("data-reveal-text")
        ) {
          trigger.kill();
        }
      });
    };
  }, []);
};
