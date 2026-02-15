import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, Minus, Plus } from "lucide-react";

// Import local images
import webDevImage from "../../assets/images/web-development.jpg";
import uiUxImage from "../../assets/images/ui-ux-design.png";
import digitalMarketingImage from "../../assets/images/digital-marketing.png";
import ecommerceImage from "../../assets/images/ecommerce.png";
import seoImage from "../../assets/images/seo-optimization.png";
import cloudImage from "../../assets/images/cloud-solutions.png";

/* ---------- Types ---------- */
// Service interface: { id, name, role, image }

/* ---------- Data ---------- */
const TEAM = [
  {
    id: "01",
    name: "Web Development",
    role: "Frontend, Backend, and Full Stack",
    image: webDevImage,
  },
  {
    id: "02",
    name: "UI/UX Design",
    role: "Modern and responsive design",
    image: uiUxImage,
  },
  {
    id: "03",
    name: "Digital Marketing",
    role: "SEO optimization and Social Media",
    image: digitalMarketingImage,
  },
  {
    id: "04",
    name: "E-commerce Solutions",
    role: "Complete online store development",
    image: ecommerceImage,
  },
  {
    id: "05",
    name: "SEO Optimisation",
    role: "Search engine optimization",
    image: seoImage,
  },
  {
    id: "06",
    name: "Cloud Solutions",
    role: "Reliable hosting and deployment",
    image: cloudImage,
  },
];

/* ---------- Main Component ---------- */
export default function KineticTeamHybrid() {
  const [activeId, setActiveId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  // Mouse position resources (Global for the floating card)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Mouse position for tilt effect
  const mouseXTilt = useMotionValue(0);
  const mouseYTilt = useMotionValue(0);

  // Smooth physics for the floating card
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Tilt values
  const rotateX = useSpring(0, { damping: 20, stiffness: 200 });
  const rotateY = useSpring(0, { damping: 20, stiffness: 200 });

  // Detect mobile for conditional rendering logic
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile) return;
    // Offset the cursor card so it doesn't block the text
    mouseX.set(e.clientX + 20);
    mouseY.set(e.clientY + 20);

    // Calculate tilt based on mouse position relative to card
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateXValue = ((e.clientY - centerY) / rect.height) * -15;
    const rotateYValue = ((e.clientX - centerX) / rect.width) * 15;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full cursor-default bg-transparent px-8 py-24 text-neutral-200 md:px-16 lg:px-24"
    >
      <div className="mx-auto w-full">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h1 className="text-4xl font-light tracking-tighter text-white sm:text-6xl md:text-8xl">
              Our <span className="text-neutral-600">Services</span>
            </h1>
          </div>
          <div className="h-px flex-1 bg-neutral-900 mx-8 hidden md:block" />
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
            Digital Solutions &apos;24
          </p>
        </motion.header>

        {/* The List */}
        <div className="flex flex-col">
          {TEAM.map((member, index) => (
            <TeamRow
              key={member.id}
              data={member}
              index={index}
              isActive={activeId === member.id}
              setActiveId={setActiveId}
              isMobile={isMobile}
              isAnyActive={activeId !== null}
            />
          ))}
        </div>
      </div>

      {/* DESKTOP ONLY: Global Floating Cursor Image */}
      {!isMobile && (
        <motion.div
          style={{ x: cursorX, y: cursorY }}
          className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const rotateXValue = ((e.clientY - centerY) / rect.height) * -20;
            const rotateYValue = ((e.clientX - centerX) / rect.width) * 20;

            rotateX.set(rotateXValue);
            rotateY.set(rotateYValue);
          }}
          onMouseLeave={() => {
            rotateX.set(0);
            rotateY.set(0);
          }}
        >
          <AnimatePresence mode="wait">
            {activeId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                  rotateX: rotateX,
                  rotateY: rotateY,
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
                className="relative h-64 w-80 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-2xl"
              >
                {/* Find the active image */}
                <motion.img
                  src={TEAM.find((t) => t.id === activeId)?.image}
                  alt="Preview"
                  style={{
                    transform: "translateZ(50px)",
                  }}
                  className="h-full w-full object-cover"
                />
                {/* Overlay Metadata */}
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4"
                  style={{
                    transform: "translateZ(75px)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-white/80">
                      Active
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ---------- Row Component ---------- */
function TeamRow({
  data,
  index,
  isActive,
  setActiveId,
  isMobile,
  isAnyActive,
}) {
  const isDimmed = isAnyActive && !isActive;

  return (
    <motion.div
      layout // This enables smooth height animation on mobile
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isDimmed ? 0.3 : 1,
        y: 0,
      }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseEnter={() => !isMobile && setActiveId(data.id)}
      onMouseLeave={() => !isMobile && setActiveId(null)}
      onClick={() => isMobile && setActiveId(isActive ? null : data.id)}
      className={`group relative border-t border-neutral-800 transition-colors duration-500 last:border-b overflow-hidden cursor-pointer`}
    >
      {/* Animated Background */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isActive ? "0%" : "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-[#0071BC]"
      />

      <div className="relative z-10 flex flex-col py-12 md:flex-row md:items-center md:justify-between md:py-20">
        {/* Name & Index Section */}
        <div className="flex items-baseline gap-6 md:gap-12 pl-4 md:pl-0 transition-transform duration-500 group-hover:translate-x-4">
          <span className="font-mono text-sm text-neutral-600">
            0{index + 1}
          </span>
          <h2 className="text-3xl font-medium tracking-tight text-neutral-400 transition-colors duration-300 group-hover:text-white md:text-5xl lg:text-6xl">
            {data.name}
          </h2>
        </div>

        {/* Role & Icon Section */}
        <div className="mt-6 flex items-center justify-between pl-12 pr-4 md:mt-0 md:justify-end md:gap-12 md:pl-0 md:pr-0">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-600 transition-colors group-hover:text-neutral-400 md:text-sm">
            {data.role}
          </span>

          {/* Mobile Toggle Icon */}
          <div className="block md:hidden text-neutral-500">
            {isActive ? <Minus size={22} /> : <Plus size={22} />}
          </div>

          {/* Desktop Arrow */}
          <motion.div
            animate={{ x: isActive ? 0 : -10, opacity: isActive ? 1 : 0 }}
            className="hidden md:block text-white"
          >
            <ArrowUpRight size={32} strokeWidth={1.5} />
          </motion.div>
        </div>
      </div>

      {/* MOBILE ONLY: Inline Accordion Image */}
      <AnimatePresence>
        {isMobile && isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden bg-neutral-900/50"
          >
            <div className="p-4">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <img
                  src={data.image}
                  alt={data.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-xs uppercase tracking-widest text-white">
                    Learn More
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
