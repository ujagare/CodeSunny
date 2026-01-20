import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import LogoLoopDemo from './logo-loop-demo';

const TrainingPrograms = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="w-full py-[80px] md:py-[120px] px-[5vw] text-white font-body" ref={ref}>
      {/* Primary Products Title */}
      <motion.div 
        className="mb-[60px] md:mb-[80px]"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 style={{ 
          fontFamily: 'Poppins', 
          fontSize: 'clamp(24px, 5vw, 76px)', 
          fontWeight: 500, 
          background: 'linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradient 3s linear infinite',
          letterSpacing: '-0.04em' 
        }} className="uppercase inline-block leading-[0.9] border-b-[1.5px] border-cyan-400 pb-2">
          PRIMARY PRODUCTS
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 lg:gap-0">
        {/* Left Column Label - Desktop Only */}
        <div className="hidden md:block md:col-span-4 md:self-end">
          <div className="inline-block border-b border-cyan-400 pb-1">
            <h3 style={{ 
              fontFamily: 'Poppins', 
              fontSize: 'clamp(18px, 4vw, 38px)', 
              fontWeight: 500, 
              background: 'linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradient 3s linear infinite'
            }} className="uppercase leading-tight">
              WEB SERVICES
            </h3>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="md:col-span-8">
          <div className="w-full">
            <img 
              src={new URL('../../assets/images/Research.jpeg', import.meta.url).href}
              alt="Web Services" 
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Mobile Label - Below Image */}
          <div className="md:hidden mt-6">
            <div className="inline-block border-b border-cyan-400 pb-1">
              <h3 style={{ 
                fontFamily: 'Poppins', 
                fontSize: 'clamp(18px, 4vw, 38px)', 
                fontWeight: 500, 
                background: 'linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradient 3s linear infinite'
              }} className="uppercase leading-tight">
                WEB SERVICES
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Content Below */}
      <div className="w-full mt-[60px] md:mt-[80px] space-y-[60px] md:space-y-[80px]">
        {/* Online Training Programs */}
        <motion.div 
          className="space-y-4 md:space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 style={{ 
            fontFamily: 'Poppins', 
            fontSize: 'clamp(24px, 4vw, 38px)', 
            fontWeight: 600, 
            background: 'linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradient 3s linear infinite'
          }} className="leading-tight">
            CUSTOM WEB DEVELOPMENT
          </h4>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(16px, 3vw, 30.4px)', fontWeight: 300, color: '#D1D5DB' }} className="leading-[1.6]">
            Transform your vision into reality with our custom web development services. We create scalable, 
            high-performance websites and web applications tailored to your business needs. From responsive 
            design to seamless user experiences, our expert developers leverage cutting-edge technologies 
            to build solutions that drive engagement, boost conversions, and accelerate your digital growth 
            in today's competitive online landscape.
          </p>
        </motion.div>

        {/* Digital Marketing Services */}
        <motion.div 
          className="space-y-4 md:space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 style={{ 
            fontFamily: 'Poppins', 
            fontSize: 'clamp(24px, 4vw, 38px)', 
            fontWeight: 600, 
            background: 'linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradient 3s linear infinite'
          }} className="leading-tight">
            DIGITAL MARKETING & SEO
          </h4>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(16px, 3vw, 30.4px)', fontWeight: 300, color: '#D1D5DB' }} className="leading-[1.6]">
            Amplify your online presence with our comprehensive digital marketing strategies. We combine SEO 
            optimization, content marketing, social media management, and data-driven campaigns to increase 
            your visibility and reach your target audience. Our proven approach helps businesses build brand 
            authority, generate quality leads, and achieve measurable results that contribute to long-term 
            success in the digital marketplace.
          </p>
        </motion.div>
      </div>

      {/* Logo Loop Section */}
      <LogoLoopDemo />
    </section>
  );
};

export default TrainingPrograms;
