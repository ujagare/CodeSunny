import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useGsapAnimations = () => {
  useEffect(() => {
    // Fade in elements on scroll
    const fadeElements = document.querySelectorAll("[data-gsap-fade]");
    fadeElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 30,
        },
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
    const scaleElements = document.querySelectorAll("[data-gsap-scale]");
    scaleElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          scale: 0.8,
          opacity: 0,
        },
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
    const slideLeftElements = document.querySelectorAll(
      "[data-gsap-slide-left]",
    );
    slideLeftElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          x: -50,
          opacity: 0,
        },
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
    const slideRightElements = document.querySelectorAll(
      "[data-gsap-slide-right]",
    );
    slideRightElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          x: 50,
          opacity: 0,
        },
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

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
};
