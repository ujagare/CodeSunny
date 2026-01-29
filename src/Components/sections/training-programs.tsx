"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const TrainingPrograms = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="w-full bg-[#EFEFEF] py-[120px] px-[5vw] text-black font-body" ref={ref}>
      {/* Primary Products Title */}
      <motion.div 
        className="mb-[80px]"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '76px', fontWeight: 500, color: '#000000 !important', letterSpacing: '-0.04em' }} className="uppercase inline-block w-full leading-[0.9] border-b-[1.5px] border-black pb-2">
          PRIMARY PRODUCTS
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-0">
        {/* Left Column Label */}
        <div className="md:col-span-4">
          <div className="inline-block border-b border-black pb-1">
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '38px', fontWeight: 500, color: '#000000' }} className="uppercase leading-tight">
              TRAINING<br />PROGRAMS
            </h3>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="md:col-span-8">
          <div className="w-full">
            <img 
              src="/11349654.jpg" 
              alt="Training Programs" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Full Width Content Below */}
      <div className="w-full mt-[80px] space-y-[80px]">
        {/* Online Training Programs */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h4 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '38px', fontWeight: 600, color: '#000000' }} className="leading-tight">
            ONLINE TRAINING PROGRAMS
          </h4>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '30.4px', fontWeight: 300, color: '#000000' }} className="leading-[1.6]">
            Experience a seamless learning journey with our online training programs at Sheryians
            Pvt. Ltd. Dive into a world of knowledge from the comfort of your home, with engaging live
            sessions and interactive modules on our user-friendly platform, sheryians.com and Difference
            (mobile application). Benefit from the flexibility of online learning, allowing you to acquire
            cutting-edge skills at your own pace, anytime, anywhere
          </p>
        </motion.div>

        {/* Offline Training Programs */}
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '38px', fontWeight: 600, color: '#000000' }} className="leading-tight">
            OFFLINE TRAINING PROGRAMS
          </h4>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '30.4px', fontWeight: 300, color: '#000000' }} className="leading-[1.6]">
            For those seeking a more traditional approach, our offline training programs provide a dynamic
            and immersive learning environment. Join us in person to engage with passionate instructors,
            participate in hands-on activities, and collaborate with fellow learners. Our offline programs
            offer a unique opportunity to build connections, share experiences, and enhance your skills in a
            supportive, face-to-face&nbsp;setting
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TrainingPrograms;
