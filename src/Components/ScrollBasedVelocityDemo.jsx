import { useState, useEffect } from "react";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "./ui/scroll-based-velocity";

export function ScrollBasedVelocityDemo() {
  const [scrollDirection, setScrollDirection] = useState("down");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-16 md:py-20 lg:py-24">
      <ScrollVelocityContainer className="text-3xl font-bold tracking-[-0.02em] md:text-5xl lg:text-6xl md:leading-tight text-gray-300/50 w-full uppercase space-y-0">
        <ScrollVelocityRow baseVelocity={0.3} direction={1}>
          <span className="flex items-center gap-8">
            WEB DEVELOPMENT{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              →
            </span>{" "}
            UI/UX DESIGN{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              →
            </span>{" "}
            DIGITAL MARKETING{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              →
            </span>{" "}
            CLOUD SOLUTIONS{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              →
            </span>{" "}
            E-COMMERCE SOLUTIONS{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              →
            </span>{" "}
            SEO OPTIMIZATION{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              →
            </span>{" "}
            AI AUTOMATION{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              →
            </span>
          </span>
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={0.3} direction={-1}>
          <span className="flex items-center gap-8">
            CUSTOM WEB APPS{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              ←
            </span>{" "}
            SOCIAL MEDIA MARKETING{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              ←
            </span>{" "}
            CUSTOM WEB APPS{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              ←
            </span>{" "}
            SOCIAL MEDIA MARKETING{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              ←
            </span>{" "}
            CUSTOM WEB APPS{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              ←
            </span>{" "}
            SOCIAL MEDIA MARKETING{" "}
            <span
              className="text-5xl md:text-7xl inline-block align-middle leading-none pb-2 md:pb-4 transition-transform duration-700 ease-in-out"
              style={{
                transform:
                  scrollDirection === "down"
                    ? "rotate(0deg)"
                    : "rotate(180deg)",
              }}
            >
              ←
            </span>
          </span>
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050515]"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#050515]"></div>
    </div>
  );
}
