import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useImageParallax = () => {
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Apply parallax to all images with data-parallax-img attribute
      const parallaxImages = document.querySelectorAll("[data-parallax-img]");

      parallaxImages.forEach((img) => {
        gsap.to(img, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            scrub: true,
            markers: false,
          },
        });
      });

      // Apply parallax to video containers with data-parallax-video attribute
      const parallaxVideoContainers = document.querySelectorAll(
        "[data-parallax-video]",
      );

      parallaxVideoContainers.forEach((container) => {
        gsap.to(container, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: container.closest(".group") || container,
            scrub: 1,
            markers: false,
          },
        });
      });

      // Also apply to all img tags by default
      const allImages = document.querySelectorAll("img");
      allImages.forEach((img) => {
        // Skip if already has parallax attribute
        if (img.hasAttribute("data-parallax-img")) return;

        // Skip small images (like logos, icons)
        if (img.width < 100 || img.height < 100) return;

        gsap.to(img, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: img,
            scrub: true,
            markers: false,
          },
        });
      });
    }, 500);

    // Cleanup
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.vars.trigger &&
          (trigger.vars.trigger.tagName === "IMG" ||
            trigger.vars.trigger.tagName === "VIDEO")
        ) {
          trigger.kill();
        }
      });
    };
  }, []);
};
