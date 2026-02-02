import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGsapAnimations = () => {
  useEffect(() => {
    // Batch DOM reads to avoid forced reflows
    const fadeElements = document.querySelectorAll("[data-gsap-fade]");
    const scaleElements = document.querySelectorAll("[data-gsap-scale]");
    const slideLeftElements = document.querySelectorAll("[data-gsap-slide-left]");
    const slideRightElements = document.querySelectorAll("[data-gsap-slide-right]");

    // Use requestAnimationFrame to batch animations
    requestAnimationFrame(() => {
      // Fade in elements on scroll
      fadeElements.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "top 50%",
              scrub: false,
              markers: false,
            },
          },
        );
      });

      // Scale animations on scroll
      scaleElements.forEach((element) => {
        gsap.fromTo(
          element,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              end: "top 55%",
              scrub: false,
              markers: false,
            },
          },
        );
      });

      // Slide in from left
      slideLeftElements.forEach((element) => {
        gsap.fromTo(
          element,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "top 50%",
              scrub: false,
              markers: false,
            },
          },
        );
      });

      // Slide in from right
      slideRightElements.forEach((element) => {
        gsap.fromTo(
          element,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "top 50%",
              scrub: false,
              markers: false,
            },
          },
        );
      });
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
};
