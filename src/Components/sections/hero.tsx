"use client";

import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const animateWords = (text: string, delay: number = 0) => {
    return text.split(' ').map((word, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: delay + index * 0.1,
          ease: [0.33, 1, 0.68, 1]
        }}
        style={{ display: 'inline-block', marginRight: '0.3em' }}
      >
        {word}
      </motion.span>
    ));
  };

  const animateParagraphLines = (lines: string[], delay: number = 0) => {
    return lines.map((line, lineIndex) => (
      <span key={lineIndex} className="block overflow-hidden">
        {line.split(' ').map((word, wordIndex) => (
          <motion.span
            key={wordIndex}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: delay + (lineIndex * 3 + wordIndex) * 0.05,
              ease: [0.33, 1, 0.68, 1]
            }}
            style={{ display: 'inline-block', marginRight: '0.3em' }}
          >
            {word}
          </motion.span>
        ))}
      </span>
    ));
  };

  return (
    <section 
      className="relative w-full min-h-screen pt-[100px] pb-0 bg-[#EFEFEF] flex flex-col"
    >
      <div className="relative flex-1 flex flex-col justify-between px-4 md:px-8 max-w-[1600px] mx-auto w-full">
        
        {/* Huge Animated Text Heading */}
        <div className="w-full mt-[80px] md:mt-[120px] relative overflow-hidden">
          <h1 
            className="flex flex-col text-black uppercase"
            style={{ 
              fontSize: '152px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              lineHeight: '1.1',
              letterSpacing: '-0.04em'
            }}
          >
            <span className="flex items-center gap-4 overflow-hidden">
              <motion.span 
                className="text-[0.8em]"
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              >
                ✳︎
              </motion.span>
              <span className="overflow-hidden inline-block">{animateWords('Digital', 0.2)}</span>
              <span className="overflow-hidden inline-block">{animateWords('Solutions', 0.4)}</span>
            </span>
            
            <span className="ml-[20vw] md:ml-[35vw] lg:ml-[450px] block relative">
              {/* Commitment Statement positioned to the left of TRANSFORM */}
              <div 
                className="absolute left-0 top-[50%] -translate-y-1/2 -translate-x-[120%] z-10"
              >
                <h2 className="text-[20px] md:text-[24.7px] leading-[1.4] font-medium tracking-tight text-black text-right lowercase">
                  {animateParagraphLines([
                    'We deliver innovative solutions',
                    'that transform your digital presence',
                    'and accelerate business growth'
                  ], 0.6)}
                </h2>
              </div>
              
              <span className="overflow-hidden inline-block">{animateWords('Built For', 0.6)}</span>
            </span>
            
            <span className="block ml-[10vw] md:ml-[15vw] lg:ml-[200px] overflow-hidden -mt-4 md:-mt-6">
              {animateWords('Success', 0.9)}
            </span>
          </h1>
        </div>

        {/* Footer Link Section */}
        <div className="w-full pt-[60px] md:pt-[100px] pb-[50px] overflow-hidden">
          <motion.a 
            href="#how-we-help" 
            className="group inline-flex items-center no-underline border-b border-black pb-1"
            style={{ fontFamily: 'Poppins', fontSize: '30.4px', fontWeight: 400, color: '#000000' }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8, ease: [0.33, 1, 0.68, 1] }}
          >
            <span>Explore Our Services</span>
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
