import React from 'react';

/**
 * TeamIntro Component
 * 
 * This component clones the transition header "PEOPLE WHO MAKES US A TEAM"
 * which separates the white background content from the dark-themed leaders section.
 * 
 * Based on the design system:
 * - High-contrast monochrome palette.
 * - Bold, uppercase typography (Modern Brutalist/Swiss-inspired).
 * - Structural division using horizontal rules.
 * - Left-aligned content with 5vw container padding.
 */

const TeamIntro: React.FC = () => {
  return (
    <section 
      className="w-full bg-[#EFEFEF] pt-[120px] md:pt-[160px]"
      aria-label="Team Introduction"
    >
      <div className="container mx-auto px-[5vw]">
        <div className="flex flex-col items-start gap-5">
          {/* Main Transition Heading */}
          <h2 
            className="text-black font-bold uppercase tracking-[-0.04em] leading-[0.9]"
            style={{ 
              fontSize: 'clamp(2rem, 4vw, 64px)',
              fontFamily: 'var(--font-display, "Inter", sans-serif)'
            }}
          >
            People who makes us a team
          </h2>

          {/* Brutalist Horizontal Rule */}
          <div 
            className="w-full h-[1px] bg-black" 
            aria-hidden="true" 
          />
        </div>
      </div>
    </section>
  );
};

export default TeamIntro;