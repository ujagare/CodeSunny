"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import MagicBento from "./MagicBento";
import GradientText from "./GradientText";
import StarBorder from "./StarBorder";
import Loader from "./Loader";
import Footer from "./Footer";
import Orb from "./Orb";
import { ThreeDMarquee } from "./ThreeDMarquee";
import RadialOrbitalTimeline from "./RadialOrbitalTimeline";
import FramerEmbed from "./FramerEmbed";
import ElectricBorder from "./ElectricBorder";
import FeaturedProjects from "./FeaturedProjects";
import { MarqueeTestimonials } from "./MarqueeTestimonials";
import AboutSummary from "./AboutSummary";
import ClientLogos from "./ClientLogos";
import LightRays from "./LightRays";
import { Palette, Code, Zap, Rocket, Globe, Users } from "lucide-react";
import MetaTags from "./MetaTags";

const testimonials = [
  {
    author: {
      name: "Rajesh Kumar",
      handle: "@rajeshtech",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    text: "CodeSunny transformed our web presence. Their team delivered exceptional results on time and within budget.",
  },
  {
    author: {
      name: "Priya Sharma",
      handle: "@priyadesign",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    text: "The UI/UX design work was outstanding. They understood our vision perfectly and executed it flawlessly.",
  },
  {
    author: {
      name: "Amit Patel",
      handle: "@amitdev",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    text: "Best digital marketing agency we've worked with. Our ROI increased by 300% in just 6 months.",
  },
  {
    author: {
      name: "Neha Singh",
      handle: "@nehamarketing",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    text: "Their e-commerce solutions helped us scale from startup to 7-figure revenue. Highly recommended!",
  },
];

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "About", ariaLabel: "Learn about us", link: "/about" },
  { label: "Services", ariaLabel: "View our services", link: "/services" },
  { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
];

const socialItems = [
  { label: "Twitter", link: "https://twitter.com" },
  { label: "GitHub", link: "https://github.com" },
  { label: "LinkedIn", link: "https://linkedin.com" },
];

const timelineData = [
  {
    id: 1,
    title: "Design",
    date: "Phase 1",
    content: "UI/UX design and prototyping for modern web applications.",
    category: "Creative",
    icon: Palette,
    relatedIds: [2, 3],
    status: "completed",
    energy: 95,
  },
  {
    id: 2,
    title: "Development",
    date: "Phase 2",
    content:
      "Full-stack development with React, Node.js, and modern frameworks.",
    category: "Technical",
    icon: Code,
    relatedIds: [1, 4],
    status: "in-progress",
    energy: 80,
  },
  {
    id: 3,
    title: "Strategy",
    date: "Phase 3",
    content: "Digital strategy and business growth planning.",
    category: "Business",
    icon: Zap,
    relatedIds: [1, 5],
    status: "completed",
    energy: 90,
  },
  {
    id: 4,
    title: "Launch",
    date: "Phase 4",
    content: "Product launch and deployment to production.",
    category: "Deployment",
    icon: Rocket,
    relatedIds: [2, 6],
    status: "pending",
    energy: 60,
  },
  {
    id: 5,
    title: "Marketing",
    date: "Phase 5",
    content: "Digital marketing and SEO optimization.",
    category: "Growth",
    icon: Globe,
    relatedIds: [3, 6],
    status: "in-progress",
    energy: 75,
  },
  {
    id: 6,
    title: "Scale",
    date: "Phase 6",
    content: "Scaling infrastructure and team growth.",
    category: "Expansion",
    icon: Users,
    relatedIds: [4, 5],
    status: "pending",
    energy: 50,
  },
];

const serviceCards = [
  {
    link: "/services/web-development",
    title: "Web Development",
    description:
      "Frontend, Backend, and Full Stack solutions built with modern technologies for scalable and high-performance websites.",
    gradientId: "gradient1",
    svgPath: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
  {
    link: "/services/ui-ux-design",
    title: "UI/UX Design",
    description:
      "Modern and responsive design that creates intuitive user experiences and beautiful interfaces for your brand.",
    gradientId: "gradient2",
    svgPath:
      "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
  },
  {
    link: "/services/digital-marketing",
    title: "Digital Marketing",
    description:
      "SEO optimization and Social Media strategies to grow your online presence and reach your target audience effectively.",
    gradientId: "gradient3",
    svgPath:
      "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    link: "/services/ecommerce-solutions",
    title: "E-commerce Solutions",
    description:
      "Complete online store development with payment integration, inventory management, and seamless shopping experiences.",
    gradientId: "gradient4",
    svgPath:
      "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  },
  {
    link: "/services/seo-optimization",
    title: "SEO Optimisation",
    description:
      "Search engine optimization to boost your rankings, increase visibility, and drive organic traffic to your website.",
    gradientId: "gradient5",
    svgPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    link: "/services/cloud-solutions",
    title: "Cloud Solutions",
    description:
      "Reliable hosting and deployment services with scalable infrastructure to keep your applications running 24/7.",
    gradientId: "gradient6",
    svgPath:
      "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z",
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <MetaTags
        title="CodeSunny - Web Development & Digital Solutions Agency"
        description="Transform your business with CodeSunny. Expert web development, UI/UX design, digital marketing, e-commerce solutions, SEO optimization, and cloud services."
        keywords="web development, UI/UX design, digital marketing, e-commerce, SEO, cloud solutions, web agency, React development"
        url="https://codesunny.com"
      />
      <div className="w-full bg-[#050515] relative">
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/15 via-transparent to-transparent pointer-events-none"></div>

        {/* Fixed Navbar */}
        <header className="fixed top-0 left-0 right-0 z-[1000]">
          <nav className="hidden md:block">
            <Navbar />
          </nav>

          <nav className="md:hidden">
            <MobileNavbar />
          </nav>
        </header>

        {/* Main Content with padding-top for fixed navbar */}
        <main className="w-full relative flex items-center justify-center overflow-hidden bg-[#050515] hero pt-20">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 pointer-events-none"></div>

          {/* Mobile LightRays Effect - Only visible on mobile */}
          <div
            className="md:hidden absolute inset-0 w-full h-full"
            style={{ zIndex: 1 }}
          >
            <LightRays
              raysOrigin="top-center"
              raysColor="#667fff"
              raysSpeed={1}
              lightSpread={1.1}
              rayLength={2.3}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.02}
              distortion={0}
              className="custom-rays"
              pulsating={false}
              fadeDistance={2}
              saturation={1}
            />
          </div>

          {/* Desktop Spline */}
          <div className="hidden md:flex w-full h-[calc(100vh-5rem)] min-h-[500px] items-center justify-center spline-wrapper">
            <div className="w-full h-full scale-75 md:scale-100 origin-center md:mr-0">
              <Spline
                scene="https://prod.spline.design/O-UQSVU5QlYbnHEc/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>

          <div
            className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none"
            style={{ zIndex: 2 }}
          >
            <div className="flex flex-col items-center pt-24 md:pt-16 lg:pt-20">
              <h1
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black md:font-bold text-center neue-machina overflow-hidden"
                style={{
                  fontFamily: "NeueMachina",
                  fontWeight: "900",
                }}
              >
                {/* Mobile: Mixed color text with animation */}
                <span className="block md:hidden">
                  {"Creative Solutions That Drive Real Business Growth"
                    .split(" ")
                    .map((word, index) => (
                      <span
                        key={index}
                        className="inline-block overflow-hidden"
                        style={{ marginRight: "0.3em" }}
                      >
                        <motion.span
                          initial={{ opacity: 0, y: "100%" }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: index * 0.1,
                            ease: [0.33, 1, 0.68, 1],
                          }}
                          style={{
                            display: "inline-block",
                            color:
                              word === "Solutions" || word === "Creative"
                                ? "#FFFFFF"
                                : "#0071BC",
                          }}
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                </span>

                {/* Desktop: Mixed color text with animation */}
                <span className="hidden md:block">
                  {"Creative Solutions That Drive Real Business Growth"
                    .split(" ")
                    .map((word, index) => (
                      <span
                        key={index}
                        className="inline-block overflow-hidden"
                        style={{ marginRight: "0.3em" }}
                      >
                        <motion.span
                          initial={{ opacity: 0, y: "100%" }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: index * 0.1,
                            ease: [0.33, 1, 0.68, 1],
                          }}
                          style={{
                            display: "inline-block",
                            color:
                              word === "Solutions" || word === "Creative"
                                ? "#FFFFFF"
                                : "#0071BC",
                          }}
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                </span>
              </h1>
            </div>
            <div className="pointer-events-auto pb-[8vh]">
              <StarBorder
                thickness={1.5}
                speed="2.5s"
                color="cyan"
                className="cursor-pointer hover:scale-105 transition-transform min-w-[200px] md:min-w-[250px]"
              >
                Get Started
              </StarBorder>
            </div>
          </div>
        </main>

        <div className="relative" style={{ zIndex: 1 }}>
          <section
            className="relative pt-16 md:pt-32 lg:pt-40 pb-16 md:pb-40 lg:pb-48 overflow-hidden"
            aria-labelledby="about-heading"
          >
            {/* Desktop LightRays Effect - Only visible on desktop */}
            <div className="hidden md:block absolute inset-0 w-full h-full">
              <LightRays
                raysOrigin="top-center"
                raysColor="#667fff"
                raysSpeed={0.8}
                lightSpread={1.2}
                rayLength={1.8}
                followMouse={true}
                mouseInfluence={0.05}
                noiseAmount={0.01}
                distortion={0}
                className="custom-rays-desktop"
                pulsating={false}
                fadeDistance={1.5}
                saturation={0.8}
              />
            </div>
            <div className="w-full px-4 md:px-6 relative" style={{ zIndex: 2 }}>
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                <article className="text-left max-w-4xl lg:w-1/2 px-4 md:px-8 lg:px-16 w-full">
                  <h2
                    id="about-heading"
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 md:mb-8 text-white capitalize overflow-hidden"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      lineHeight: "0.95",
                    }}
                  >
                    <div className="whitespace-nowrap">
                      {"We build the solutions that"
                        .split(" ")
                        .map((word, index) => (
                          <span
                            key={index}
                            className="inline-block overflow-hidden"
                            style={{ marginRight: "0.3em" }}
                          >
                            <motion.span
                              initial={{ opacity: 0, y: "100%" }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.8,
                                delay: index * 0.1,
                                ease: [0.33, 1, 0.68, 1],
                              }}
                              style={{
                                display: "inline-block",
                              }}
                            >
                              {word}
                            </motion.span>
                          </span>
                        ))}
                    </div>
                    <div
                      className="whitespace-nowrap"
                      style={{ color: "#FFFFFF" }}
                    >
                      {"drive digital business growth."
                        .split(" ")
                        .map((word, index) => (
                          <span
                            key={index}
                            className="inline-block overflow-hidden"
                            style={{ marginRight: "0.3em" }}
                          >
                            <motion.span
                              initial={{ opacity: 0, y: "100%" }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.8,
                                delay: (5 + index) * 0.1,
                                ease: [0.33, 1, 0.68, 1],
                              }}
                              style={{
                                display: "inline-block",
                              }}
                            >
                              {word}
                            </motion.span>
                          </span>
                        ))}
                    </div>
                  </h2>
                  <p
                    className="text-base md:text-lg lg:text-xl text-zinc-400 leading-relaxed mb-8 md:mb-10 font-light tracking-tight max-w-2xl overflow-hidden"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    role="doc-subtitle"
                  >
                    {"We take ownership of complex web development projects like custom applications, e-commerce platforms, and scalable systems freeing up your team to focus on core business operations."
                      .split(" ")
                      .map((word, index) => (
                        <span
                          key={index}
                          className="inline-block overflow-hidden"
                          style={{ marginRight: "0.3em" }}
                        >
                          <motion.span
                            initial={{ opacity: 0, y: "100%" }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: index * 0.05,
                              ease: [0.33, 1, 0.68, 1],
                            }}
                            style={{ display: "inline-block" }}
                          >
                            {word}
                          </motion.span>
                        </span>
                      ))}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 md:mb-16">
                    <div className="inline-block bg-transparent w-full sm:w-auto">
                      <style>{`
                      @property --gradient-angle {
                        syntax: "<angle>";
                        initial-value: 0deg;
                        inherits: false;
                      }

                      .shiny-cta {
                        --gradient-angle: 0deg;
                        position: relative;
                        overflow: hidden;
                        border-radius: 9999px;
                        padding: 0.875rem 1.75rem;
                        font-size: 0.875rem;
                        line-height: 1.2;
                        font-weight: 500;
                        color: #ffffff;
                        background:
                          linear-gradient(#000000, #000000) padding-box,
                          conic-gradient(
                              from var(--gradient-angle),
                              transparent 0%,
                              #1d4ed8 5%,
                              #8484ff 15%,
                              #1d4ed8 30%,
                              transparent 40%,
                              transparent 100%
                            )
                            border-box;
                        border: 2px solid transparent;
                        box-shadow: inset 0 0 0 1px #1a1818;
                        cursor: pointer;
                        animation: border-spin 2.5s linear infinite;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        width: 100%;
                      }

                      @media (min-width: 640px) {
                        .shiny-cta {
                          width: auto;
                          padding: 1rem 2rem;
                          font-size: 0.9375rem;
                        }
                      }

                      @keyframes border-spin {
                        to {
                          --gradient-angle: 360deg;
                        }
                      }

                      .shiny-cta:active {
                        transform: translateY(1px);
                      }

                      .shiny-cta::before {
                        content: "";
                        pointer-events: none;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: calc(100% - 6px);
                        height: calc(100% - 6px);
                        background: radial-gradient(
                            circle at 2px 2px,
                            white 0.5px,
                            transparent 0
                          )
                          padding-box;
                        background-size: 4px 4px;
                        background-repeat: space;
                        mask-image: conic-gradient(
                          from calc(var(--gradient-angle) + 45deg),
                          black,
                          transparent 10% 90%,
                          black
                        );
                        border-radius: inherit;
                        opacity: 0.4;
                      }

                      .shiny-cta::after {
                        content: "";
                        pointer-events: none;
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 100%;
                        aspect-ratio: 1;
                        background: linear-gradient(
                          -50deg,
                          transparent,
                          #1d4ed8,
                          transparent
                        );
                        mask-image: radial-gradient(
                          circle at bottom,
                          transparent 40%,
                          black
                        );
                        opacity: 0.6;
                        animation: shimmer 4s linear infinite;
                      }

                      @keyframes shimmer {
                        to {
                          transform: translate(-50%, -50%) rotate(360deg);
                        }
                      }

                      .shiny-cta span {
                        position: relative;
                        z-index: 2;
                      }

                      @media (max-width: 768px) {
                        .hero {
                          height: 70vh;
                        }
                      }

                      .hero-spline {
                        width: 100%;
                        height: 100vh;
                        overflow: hidden;
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      }

                      .hero-spline canvas {
                        width: 100% !important;
                        height: 100% !important;
                        display: block !important;
                        object-fit: contain;
                        object-position: center;
                      }

                      @media (max-width: 768px) {
                        .hero-spline {
                          height: 70vh;
                        }
                      }

                      @media (max-width: 480px) {
                        .hero-spline {
                          height: 60vh;
                        }
                      }
                    `}</style>
                      <button className="shiny-cta focus:outline-none">
                        <span>Start Your Project</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ position: "relative", zIndex: 2 }}
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div
                    className="pt-6 md:pt-8 w-full"
                    style={{
                      borderTop: "1px solid",
                      borderImage:
                        "linear-gradient(to right, #60a5fa, #34d399) 1",
                    }}
                  >
                    <p
                      className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.15em] md:tracking-[0.2em] uppercase font-medium break-words"
                      style={{ color: "#02CAD4" }}
                    >
                      // Built with React, Next.js, Node.js, and Cloud
                      Infrastructure
                    </p>
                  </div>
                </article>

                <aside
                  className="lg:w-1/2 w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center"
                  style={{ willChange: "auto" }}
                >
                  <RadialOrbitalTimeline timelineData={timelineData} />
                </aside>
              </div>
            </div>
          </section>

          <section
            className="py-20 px-4 relative"
            aria-labelledby="services-heading"
            style={{ willChange: "auto" }}
          >
            <div className="max-w-7xl mx-auto relative" style={{ zIndex: 2 }}>
              <h2
                id="services-heading"
                className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-medium tracking-tight leading-tight text-left mb-12 text-white overflow-hidden"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  color: "#FFFFFF",
                  textAlign: "left",
                  textTransform: "lowercase",
                }}
              >
                {"Our services".split(" ").map((word, index) => (
                  <span
                    key={index}
                    className="inline-block overflow-hidden"
                    style={{ marginRight: "0.3em" }}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: "100%" }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: [0.33, 1, 0.68, 1],
                      }}
                      style={{ display: "inline-block" }}
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceCards.map((card, index) => (
                  <article key={index} className="block h-full">
                    <Link to={card.link} className="block h-full">
                      <ElectricBorder
                        color="#60a5fa"
                        speed={0.1}
                        chaos={0.01}
                        borderRadius={18}
                      >
                        <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group h-full">
                          <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative z-10">
                            <div className="relative w-16 h-16 mb-6 rounded-lg bg-black border border-blue-500/30 flex items-center justify-center">
                              <div
                                className="absolute top-0 left-0 w-4 h-4 border-t border-l border-transparent rounded-tl-lg"
                                style={{
                                  borderTopColor: "#60a5fa",
                                  borderLeftColor: "#60a5fa",
                                }}
                              ></div>
                              <div
                                className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-transparent rounded-br-lg"
                                style={{
                                  borderBottomColor: "#34d399",
                                  borderRightColor: "#34d399",
                                }}
                              ></div>
                              <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke={`url(#${card.gradientId})`}
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <defs>
                                  <linearGradient
                                    id={card.gradientId}
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="100%"
                                  >
                                    <stop
                                      offset="0%"
                                      style={{
                                        stopColor: "#60a5fa",
                                        stopOpacity: 1,
                                      }}
                                    />
                                    <stop
                                      offset="100%"
                                      style={{
                                        stopColor: "#34d399",
                                        stopOpacity: 1,
                                      }}
                                    />
                                  </linearGradient>
                                </defs>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d={card.svgPath}
                                />
                              </svg>
                            </div>
                            <h3 className="text-2xl font-semibold mb-3 text-white">
                              {card.title}
                            </h3>
                            <p className="text-white text-base leading-relaxed">
                              {card.description}
                            </p>
                          </div>
                        </div>
                      </ElectricBorder>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="projects-heading">
            <h2 id="projects-heading" className="sr-only">
              Featured Projects
            </h2>
            <FeaturedProjects />
          </section>

          <section aria-labelledby="clients-heading">
            <h2 id="clients-heading" className="sr-only">
              Our Clients
            </h2>
            <ClientLogos />
          </section>

          <section aria-labelledby="testimonials-heading">
            <h2 id="testimonials-heading" className="sr-only">
              Testimonials
            </h2>
            <MarqueeTestimonials
              title="Trusted by Industry Leaders"
              description="Join hundreds of companies that have transformed their business with CodeSunny"
              testimonials={testimonials}
            />
          </section>

          <footer>
            <Footer />
          </footer>
        </div>
      </div>
    </>
  );
}
