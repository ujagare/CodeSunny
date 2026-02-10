import React, { useEffect, useRef, useState } from "react";

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.25)",
  staticOnMobile = false,
  staticOpacity = 0.6,
}) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isStatic, setIsStatic] = useState(false);

  useEffect(() => {
    if (!staticOnMobile || typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const apply = () => {
      if (mediaQuery.matches) {
        setIsStatic(true);
        setOpacity(staticOpacity);
        if (divRef.current) {
          const rect = divRef.current.getBoundingClientRect();
          setPosition({ x: rect.width / 2, y: rect.height / 2 });
        }
      } else {
        setIsStatic(false);
        setOpacity(0);
      }
    };
    apply();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", apply);
    } else {
      mediaQuery.addListener(apply);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", apply);
      } else {
        mediaQuery.removeListener(apply);
      }
    };
  }, [staticOnMobile, staticOpacity]);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused || isStatic) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    if (isStatic) return;
    setOpacity(0.6);
  };
  const handleMouseLeave = () => {
    if (isStatic) return;
    setOpacity(0);
  };
  const handleFocus = () => {
    if (isStatic) return;
    setIsFocused(true);
    setOpacity(0.6);
  };
  const handleBlur = () => {
    if (isStatic) return;
    setIsFocused(false);
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
};

export default SpotlightCard;
