import React from "react";
import { NavigationProvider } from "./contexts/NavigationContext";
import AppRoutes from "./Utils/Routes";
import { useLenis } from "./hooks/useLenis";
import { useGsapAnimations } from "./hooks/useGsapAnimations";
import { useScrollTrigger } from "./hooks/useScrollTrigger";
import { useImageParallax } from "./hooks/useImageParallax";
import { useTextReveal } from "./hooks/useTextReveal";

const App = () => {
  // Initialize smooth scrolling
  useLenis();

  // Initialize GSAP animations
  useGsapAnimations();

  // Initialize ScrollTrigger animations
  useScrollTrigger();

  // Initialize image parallax effect
  useImageParallax();

  // Initialize text reveal effect
  useTextReveal();

  return (
    <NavigationProvider>
      <div id="main">
        <AppRoutes />
      </div>
    </NavigationProvider>
  );
};

export default App;
