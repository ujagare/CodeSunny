import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Spline from '@splinetool/react-spline';

const AboutVision = () => {
  const [ref, inView] = useInView({ 
    triggerOnce: true, 
    threshold: 0.1 
  });

  return (
    <section className="w-full py-[80px] md:py-[120px] lg:py-[160px]" ref={ref}>
      <div className="w-full px-0">
        <motion.div 
          className="mb-[60px] md:mb-[120px] px-[5vw]"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 
            className="uppercase text-left"
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 500, 
              fontSize: 'clamp(48px, 10vw, 152px)',
              lineHeight: 'clamp(1.2, 0.9, 0.9)',
              letterSpacing: 'clamp(0.02em, -0.04em, -0.04em)',
              background: 'linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient 3s linear infinite',
              textAlign: 'left'
            }}
          >
            ABOUT <br /> CODESUNNY
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 lg:gap-0 px-[5vw]">
          <div className="md:col-span-4 hidden md:block">
            <p 
              style={{ fontFamily: 'Poppins', fontSize: 'clamp(20px, 4vw, 30.4px)', fontWeight: 400, color: '#D1D5DB', textTransform: 'capitalize' }}
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
              <div className="inline-block border-b-[1.5px] border-cyan-400 pb-2 w-fit">
                <h3 
                  className="uppercase tracking-tight"
                  style={{ 
                    fontFamily: 'Poppins', 
                    fontWeight: 500, 
                    fontSize: 'clamp(24px, 5vw, 76px)', 
                    background: 'linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradient 3s linear infinite'
                  }}
                >
                  VISION THAT DRIVES US
                </h3>
              </div>
              
              <p 
                className="leading-[1.6] text-black"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(18px, 3vw, 30.4px)', fontWeight: 300, color: '#D1D5DB' }}
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

        {/* Full Width Spline Canvas */}
        <div className="w-full mt-[80px] md:mt-[120px] px-[5vw]">
          {/* Canvas Header Text */}
          <div className="mb-8 md:mb-12 text-center">
            <h3 style={{ 
              fontFamily: 'Poppins', 
              fontSize: 'clamp(32px, 8vw, 76px)', 
              fontWeight: 500, 
              background: 'linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient 3s linear infinite',
              marginBottom: '20px'
            }} className="uppercase">
              INNOVATIVE WEB SOLUTIONS
            </h3>
            <p style={{ 
              fontFamily: 'Poppins', 
              fontSize: 'clamp(16px, 3vw, 30.4px)', 
              fontWeight: 300, 
              color: '#D1D5DB',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Experience the future of web development with our cutting-edge technologies and creative design approach
            </p>
          </div>
          
          <main className="w-full" style={{ height: 'clamp(400px, 60vh, 600px)', position: 'relative' }}>
            <Spline scene="https://prod.spline.design/SqEZYZ3r4fYXYyo2/scene.splinecode" />
            <style>{`
              #spline-watermark,
              a[href*="spline.design"],
              [class*="watermark"],
              [class*="logo"],
              svg[class*="logo"],
              div[style*="spline"] a,
              canvas + div,
              canvas ~ div a {
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
              }
            `}</style>
          </main>
        </div>
      </div>
    </section>
  );
};

export default AboutVision;
