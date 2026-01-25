import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useScrollTrigger = () => {
  useEffect(() => {
    // Parallax effect
    const parallaxElements = document.querySelectorAll("[data-parallax]");
    parallaxElements.forEach((element) => {
      gsap.to(element, {
        y: (i, target) => -ScrollTrigger.getScrollerProxy().scrollTop() * 0.5,
        scrollTrigger: {
          trigger: element,
          start: "top center",
          end: "bottom center",
          scrub: 1,
          markers: false,
        },
      });
    });

    // Pin elements
    const pinElements = document.querySelectorAll("[data-pin]");
    pinElements.forEach((element) => {
      ScrollTrigger.create({
        trigger: element,
        pin: true,
        start: "top center",
        end: "bottom center",
        markers: false,
      });
    });

    // Counter animation
    const counterElements = document.querySelectorAll("[data-counter]");
    counterElements.forEach((element) => {
      const target = parseInt(element.getAttribute("data-counter"), 10);
      gsap.fromTo(
        element,
        { innerText: 0 },
        {
          innerText: target,
          duration: 2,
          snap: { innerText: 1 },
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

    // Stagger animation
    const staggerElements = document.querySelectorAll("[data-stagger]");
    staggerElements.forEach((container) => {
      const children = container.querySelectorAll("[data-stagger-item]");
      gsap.fromTo(
        children,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            end: "top 50%",
            scrub: false,
            markers: false,
          },
        },
      );
    });

    // Text reveal animation
    const revealElements = document.querySelectorAll("[data-text-reveal]");
    revealElements.forEach((element) => {
      const text = element.innerText;
      element.innerHTML = text
        .split("")
        .map((char) => `<span class="inline-block">${char}</span>`)
        .join("");

      const chars = element.querySelectorAll("span");
      gsap.fromTo(
        chars,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.02,
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

    // Rotate animation
    const rotateElements = document.querySelectorAll("[data-rotate]");
    rotateElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          rotation: -180,
          opacity: 0,
        },
        {
          rotation: 0,
          opacity: 1,
          duration: 1,
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

    // Blur animation
    const blurElements = document.querySelectorAll("[data-blur]");
    blurElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          filter: "blur(10px)",
          opacity: 0,
        },
        {
          filter: "blur(0px)",
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
