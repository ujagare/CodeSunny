"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AboutVision = () => {
  const [ref, inView] = useInView({ 
    triggerOnce: true, 
    threshold: 0.1 
  });

  return (
    <section className="w-full bg-[#EFEFEF] py-[120px] md:py-[160px]" ref={ref}>
      <div className="w-full px-0">
        <motion.div 
          className="mb-[80px] md:mb-[120px] px-[5vw]"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 
            className="uppercase text-left"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 500, 
              fontSize: '152px',
              lineHeight: '0.9',
              letterSpacing: '-0.04em',
              color: '#000000',
              textAlign: 'left'
            }}
          >
            ABOUT <br /> CODESUNNY
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-0 px-[5vw]">
          <div className="md:col-span-4">
            <p 
              style={{ fontFamily: 'Poppins', fontSize: '30.4px', fontWeight: 400, color: '#000000', textTransform: 'capitalize' }}
            >
              Your Digital Partner.
            </p>
          </div>

          <motion.div 
            className="md:col-span-8"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex flex-col gap-8">
              <div className="inline-block border-b-[1.5px] border-black pb-2 w-fit">
                <h3 
                  className="uppercase tracking-tight"
                  style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '76px' }}
                >
                  VISION THAT DRIVES US
                </h3>
              </div>
              
              <p 
                className="leading-[1.6] text-black"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '30.4px', fontWeight: 300, color: '#000000' }}
              >
                At CodeSunny, we deliver cutting-edge web solutions that transform businesses in the digital landscape. 
                Our team of expert developers and designers craft innovative, scalable, and user-centric digital experiences. 
                We are committed to providing comprehensive web services—from custom development to digital strategy—that 
                drive measurable results. Our mission is to empower businesses with technology that accelerates growth, 
                enhances online presence, and delivers exceptional value in today's competitive digital marketplace.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Full Width Image */}
        <div className="w-full mt-[80px] px-[5vw]">
          <img 
            src="/freepik__adjust__49155.jpeg" 
            alt="Sheryians" 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutVision;
