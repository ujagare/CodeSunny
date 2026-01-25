import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const Showreel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sectionRef = useRef(null);

  const previewVideo = "https://cuberto.com/assets/showreel/short.mp4";
  const fullVideo = "https://cuberto.com/assets/showreel/full-1440-60.mp4";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-500, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="showreel"
        className="cb-showreel relative w-full overflow-hidden bg-transparent py-8 md:py-12 flex items-center justify-center"
      >
        {/* Scrolling Background Text */}
        <div className="pointer-events-none absolute left-0 top-[10%] z-0 w-full select-none overflow-hidden opacity-[0.03]">
          <motion.div style={{ x: x1 }} className="flex whitespace-nowrap">
            <span className="pr-20 text-[15vw] font-bold uppercase leading-none text-white">
              Our Showreel Our Showreel Our Showreel
            </span>
          </motion.div>
          <motion.div style={{ x: x2 }} className="flex whitespace-nowrap">
            <span className="pr-20 text-[15vw] font-bold uppercase leading-none text-white">
              Our Showreel Our Showreel Our Showreel
            </span>
          </motion.div>
        </div>

        <div className="relative z-10 px-8 md:px-16 lg:px-[160px] w-full flex flex-col items-center">
          <motion.div
            style={{ scale, opacity }}
            className="relative mx-auto max-w-[1200px]"
          >
            <div
              className="group relative cursor-pointer overflow-hidden rounded-[1.5rem] bg-neutral-900 shadow-2xl transition-all duration-700 md:rounded-[2.5rem] lg:rounded-[4rem]"
              onClick={toggleModal}
            >
              <div className="aspect-video w-full overflow-hidden">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                >
                  <source src={previewVideo} type="video/mp4" />
                </video>
              </div>
              <div className="absolute inset-0 bg-white/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fullscreen Video Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95"
              onClick={toggleModal}
            />

            <button
              className="absolute right-10 top-10 z-[10000] text-white transition-transform hover:rotate-90"
              onClick={toggleModal}
            >
              <X size={48} strokeWidth={1} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative z-[10000] w-full max-w-[1440px] px-4 md:px-8"
            >
              <div className="overflow-hidden rounded-2xl bg-black shadow-2xl md:rounded-3xl">
                <video
                  autoPlay
                  controls
                  playsInline
                  className="aspect-video w-full object-contain"
                >
                  <source src={fullVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Showreel;
