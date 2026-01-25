import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import Footer from "./Footer";
import GradientText from "./GradientText";
import { ScrollBasedVelocityDemo } from "./ScrollBasedVelocityDemo";
import geairImage from "../assets/images/geair.jpg";
import earthImage from "../assets/images/earth.png";
import webDevImage from "../assets/images/web-development.png";
import uiUxImage from "../assets/images/ui-ux-design.png";
import digitalMarketingImage from "../assets/images/digital-marketing.png";
import ElectricBorder from "./ElectricBorder";
import AnimatedBeamDemo from "./AnimatedBeamDemo";

const Services = () => {
  const [activeStep, setActiveStep] = useState(1);
  const observerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-step]");

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const step = parseInt(entry.target.getAttribute("data-step"));
            setActiveStep(step);
          }
        });
      },
      { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" },
    );

    sections.forEach((section) => {
      if (section.classList.contains("workflow-step-content")) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#050515] relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        {/* Desktop Navbar */}
        <div className="hidden md:block bg-black">
          <Navbar />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNavbar />
        </div>

        {/* New Hero Section */}
        <section className="w-full min-h-screen md:min-h-auto md:bg-center lg:pt-48 lg:pb-48 max-w-none mr-auto ml-auto pt-0 pr-8 pb-32 md:pb-32 pl-8 relative flex items-center">
          <div
            className="absolute top-0 right-0 bottom-0 left-0"
            data-container-bg="true"
          ></div>
          <div className="grid lg:grid-cols-2 max-w-7xl mr-auto ml-auto items-center w-full px-4">
            {/* Left Column: Copy & Form */}
            <div className="max-w-2xl z-10 mt-24 md:mt-0">
              <p className="hidden md:block uppercase text-xs font-semibold tracking-tight font-dm-sans mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Comprehensive Digital Solutions
              </p>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-stone-50 tracking-tight font-instrument-serif mb-8">
                <span className="block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    Expert
                  </span>{" "}
                  Services
                </span>
                <span className="block">For Your Success.</span>
              </h1>
              <p className="leading-relaxed text-sm md:text-lg tracking-tight font-dm-sans max-w-2xl mb-10 text-stone-50">
                We deliver cutting-edge web development, UI/UX design, digital
                marketing, and cloud solutions to transform your business and
                drive sustainable growth.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 md:mb-16">
                <div className="inline-block bg-transparent w-full sm:w-auto">
                  <style>{`
                    @property --gradient-angle {
                      syntax: "<angle>";
                      initial-value: 0deg;
                      inherits: false;
                    }

                    .shiny-cta-services {
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
                      .shiny-cta-services {
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

                    .shiny-cta-services:active {
                      transform: translateY(1px);
                    }

                    .shiny-cta-services::before {
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

                    .shiny-cta-services::after {
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

                    .shiny-cta-services span {
                      position: relative;
                      z-index: 2;
                    }
                  `}</style>
                  <button className="shiny-cta-services focus:outline-none">
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
            </div>
            {/* Right Column: UI Mockups */}
            <div className="mt-8 sm:mt-0 relative perspective-1000">
              <img
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4aa0ba0f-cf6d-4050-bf33-824539eb56e0_1600w.png"
                alt="Product UI"
                className="w-full h-auto block"
              />
            </div>
          </div>
          <div className="spline-container absolute top-0 left-0 w-full h-full -z-10">
            <iframe
              src="https://my.spline.design/retrofuturismbganimation-Lb3VtL1bNaYUnirKNzn0FvaW"
              frameBorder="0"
              width="100%"
              height="100%"
            ></iframe>
          </div>
        </section>

        <section className="relative">
          <div className="mx-auto max-w-7xl px-6 md:px-8 pt-16 md:pt-24">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="space-y-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_1px_rgba(16,185,129,0.7)]"></span>
                  Now in public beta
                  <span className="text-slate-500">•</span>
                  <a
                    href="#changelog"
                    className="text-sky-300 hover:text-sky-200 transition-colors underline/30"
                  >
                    See what's new
                  </a>
                </div>
                <h1 className="text-4xl lg:text-6xl font-medium tracking-tight capitalize">
                  <GradientText
                    colors={["#00CED1", "#1E90FF", "#00CED1", "#1E90FF"]}
                    animationSpeed={3}
                    showBorder={false}
                    className="inline-block"
                  >
                    Build, launch, and scale in days not months.
                  </GradientText>
                </h1>
                <p className="text-base sm:text-lg text-slate-400 max-w-xl">
                  Ship beautiful experiences with a powerful toolkit for design,
                  data, and delivery. Opinionated where it matters, flexible
                  where it counts.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <style>{`
                    @property --gradient-angle {
                      syntax: "<angle>";
                      initial-value: 0deg;
                      inherits: false;
                    }

                    .shiny-cta-demo {
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
                    }

                    @keyframes border-spin {
                      to {
                        --gradient-angle: 360deg;
                      }
                    }

                    .shiny-cta-demo:active {
                      transform: translateY(1px);
                    }

                    .shiny-cta-demo::before {
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

                    .shiny-cta-demo::after {
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

                    .shiny-cta-demo span {
                      position: relative;
                      z-index: 2;
                    }
                  `}</style>
                  <a href="#demo" className="shiny-cta-demo focus:outline-none">
                    <span>Book a demo</span>
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
                  </a>
                </div>
                <div className="flex items-center gap-6 pt-3">
                  <div className="flex -space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=80&auto=format&fit=crop"
                      alt="User avatar"
                      className="h-8 w-8 rounded-full ring-2 ring-[#0b0f1a] object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=80&auto=format&fit=crop"
                      alt="User avatar"
                      className="h-8 w-8 rounded-full ring-2 ring-[#0b0f1a] object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop"
                      alt="User avatar"
                      className="h-8 w-8 rounded-full ring-2 ring-[#0b0f1a] object-cover"
                    />
                  </div>
                  <div className="text-xs text-slate-400">
                    Trusted by 4,000+ teams
                    <span className="mx-2 text-slate-600">•</span>
                    99.99% uptime
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-6 shadow-2xl ring-1 ring-black/10">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80"></span>
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80"></span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      app/console
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 pt-4">
                    <div className="rounded-lg border border-white/10 bg-black/50 p-4">
                      <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M12 19h8"></path>
                            <path d="m4 17 6-6-6-6"></path>
                          </svg>
                          CLI
                        </div>
                        <span className="text-[10px] text-slate-500">
                          v2.1.0
                        </span>
                      </div>
                      <pre className="text-[12px] leading-relaxed text-slate-300">
                        <span className="text-sky-300">
                          # Create a new project
                        </span>
                        {`\nnpx axiom@latest init my-app\n`}
                        <span className="text-sky-300">
                          # Start the dev server
                        </span>
                        {`\naxiom dev --open\n`}
                        <span className="text-sky-300"># Deploy globally</span>
                        {`\naxiom deploy --prod`}
                      </pre>
                    </div>
                    <div className="border-white/10 border rounded-lg pt-4 pr-4 pb-4 pl-4 overflow-hidden">
                      <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="m18 16 4-4-4-4"></path>
                            <path d="m6 8-4 4 4 4"></path>
                            <path d="m14.5 4-5 16"></path>
                          </svg>
                          API example
                        </div>
                        <span className="text-[10px] text-emerald-400/90 bg-emerald-400/10 px-2 py-0.5 rounded">
                          TypeScript
                        </span>
                      </div>
                      <pre className="text-[12px] leading-relaxed text-slate-300">
                        <code>
                          <span className="text-violet-300">import</span> {"{ "}
                          <span className="text-sky-300">client</span>
                          {" } "}
                          <span className="text-violet-300">from</span>{" "}
                          <span className="text-emerald-300">"@axiom/sdk"</span>
                          ;{`\n\n`}
                          <span className="text-violet-300">const</span>{" "}
                          <span className="text-sky-300">res</span> ={" "}
                          <span className="text-violet-300">await</span>{" "}
                          <span className="text-sky-300">client</span>.
                          <span className="text-amber-300">projects</span>.
                          <span className="text-amber-300">create</span>({"{"}\n
                          {"  "}
                          <span className="text-sky-300">name</span>:{" "}
                          <span className="text-emerald-300">"my-app"</span>,\n
                          {"  "}
                          <span className="text-sky-300">region</span>:{" "}
                          <span className="text-emerald-300">"global"</span>,\n
                          {"}"});\n\n
                          <span className="text-sky-300">console</span>.
                          <span className="text-amber-300">log</span>(
                          <span className="text-sky-300">res</span>.
                          <span className="text-amber-300">url</span>);
                        </code>
                      </pre>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg overflow-hidden border border-white/10 bg-slate-800/50">
                    <img
                      src={geairImage}
                      alt="Product screenshot"
                      className="w-full h-56 sm:h-64 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-14 md:mt-20">
              <div className="text-center text-xs text-slate-500 mb-5">
                Backed by teams who value speed and craft
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                  <span className="tracking-tight text-sm font-medium">NX</span>
                </div>
                <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                  <span className="tracking-tight text-sm font-medium">
                    PRM
                  </span>
                </div>
                <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                  <span className="tracking-tight text-sm font-medium">
                    LNT
                  </span>
                </div>
                <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                  <span className="tracking-tight text-sm font-medium">
                    RST
                  </span>
                </div>
                <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                  <span className="tracking-tight text-sm font-medium">
                    ARC
                  </span>
                </div>
                <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                  <span className="tracking-tight text-sm font-medium">
                    FLX
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-20">
              <AnimatedBeamDemo />
            </div>
            <h2
              className="text-4xl lg:text-6xl font-medium tracking-tight leading-tight text-center mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <GradientText
                colors={["#00CED1", "#1E90FF", "#00CED1", "#1E90FF"]}
                animationSpeed={3}
                showBorder={false}
                className="inline-block"
              >
                Our Services
              </GradientText>
            </h2>
            <p
              className="text-base md:text-lg text-center mb-12 max-w-3xl mx-auto text-gray-400"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Comprehensive digital solutions tailored to elevate your business
              and drive measurable results.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link to="/services/web-development" className="block h-full">
                <ElectricBorder
                  color="#60a5fa"
                  speed={0.1}
                  chaos={0.01}
                  borderRadius={18}
                  className="h-full"
                >
                  <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                          stroke="url(#gradient1)"
                          viewBox="0 0 24 24"
                        >
                          <defs>
                            <linearGradient
                              id="gradient1"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
                              />
                              <stop
                                offset="100%"
                                style={{ stopColor: "#34d399", stopOpacity: 1 }}
                              />
                            </linearGradient>
                          </defs>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-white">
                        Web Development
                      </h3>
                      <p className="text-white text-base leading-relaxed">
                        Frontend, Backend, and Full Stack solutions built with
                        modern technologies for scalable and high-performance
                        websites.
                      </p>
                    </div>
                  </div>
                </ElectricBorder>
              </Link>
              <Link to="/services/ui-ux-design" className="block h-full">
                <ElectricBorder
                  color="#60a5fa"
                  speed={0.1}
                  chaos={0.01}
                  borderRadius={18}
                  className="h-full"
                >
                  <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                          stroke="url(#gradient2)"
                          viewBox="0 0 24 24"
                        >
                          <defs>
                            <linearGradient
                              id="gradient2"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
                              />
                              <stop
                                offset="100%"
                                style={{ stopColor: "#34d399", stopOpacity: 1 }}
                              />
                            </linearGradient>
                          </defs>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-white">
                        UI/UX Design
                      </h3>
                      <p className="text-white text-base leading-relaxed">
                        Modern and responsive design that creates intuitive user
                        experiences and beautiful interfaces for your brand.
                      </p>
                    </div>
                  </div>
                </ElectricBorder>
              </Link>
              <Link to="/services/digital-marketing" className="block h-full">
                <ElectricBorder
                  color="#60a5fa"
                  speed={0.1}
                  chaos={0.01}
                  borderRadius={18}
                  className="h-full"
                >
                  <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                          stroke="url(#gradient3)"
                          viewBox="0 0 24 24"
                        >
                          <defs>
                            <linearGradient
                              id="gradient3"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
                              />
                              <stop
                                offset="100%"
                                style={{ stopColor: "#34d399", stopOpacity: 1 }}
                              />
                            </linearGradient>
                          </defs>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-white">
                        Digital Marketing
                      </h3>
                      <p className="text-white text-base leading-relaxed">
                        SEO optimization and Social Media strategies to grow
                        your online presence and reach your target audience
                        effectively.
                      </p>
                    </div>
                  </div>
                </ElectricBorder>
              </Link>
              <Link to="/services/ecommerce-solutions" className="block h-full">
                <ElectricBorder
                  color="#60a5fa"
                  speed={0.1}
                  chaos={0.01}
                  borderRadius={18}
                  className="h-full"
                >
                  <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                          stroke="url(#gradient4)"
                          viewBox="0 0 24 24"
                        >
                          <defs>
                            <linearGradient
                              id="gradient4"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
                              />
                              <stop
                                offset="100%"
                                style={{ stopColor: "#34d399", stopOpacity: 1 }}
                              />
                            </linearGradient>
                          </defs>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-white">
                        E-commerce Solutions
                      </h3>
                      <p className="text-white text-base leading-relaxed">
                        Complete online store development with payment
                        integration, inventory management, and seamless shopping
                        experiences.
                      </p>
                    </div>
                  </div>
                </ElectricBorder>
              </Link>
              <Link to="/services/seo-optimization" className="block h-full">
                <ElectricBorder
                  color="#60a5fa"
                  speed={0.1}
                  chaos={0.01}
                  borderRadius={18}
                  className="h-full"
                >
                  <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                          stroke="url(#gradient5)"
                          viewBox="0 0 24 24"
                        >
                          <defs>
                            <linearGradient
                              id="gradient5"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
                              />
                              <stop
                                offset="100%"
                                style={{ stopColor: "#34d399", stopOpacity: 1 }}
                              />
                            </linearGradient>
                          </defs>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-white">
                        SEO Optimisation
                      </h3>
                      <p className="text-white text-base leading-relaxed">
                        Search engine optimization to boost your rankings,
                        increase visibility, and drive organic traffic to your
                        website.
                      </p>
                    </div>
                  </div>
                </ElectricBorder>
              </Link>
              <Link to="/services/cloud-solutions" className="block h-full">
                <ElectricBorder
                  color="#60a5fa"
                  speed={0.1}
                  chaos={0.01}
                  borderRadius={18}
                  className="h-full"
                >
                  <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
                          stroke="url(#gradient6)"
                          viewBox="0 0 24 24"
                        >
                          <defs>
                            <linearGradient
                              id="gradient6"
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                style={{ stopColor: "#60a5fa", stopOpacity: 1 }}
                              />
                              <stop
                                offset="100%"
                                style={{ stopColor: "#34d399", stopOpacity: 1 }}
                              />
                            </linearGradient>
                          </defs>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold mb-3 text-white">
                        Cloud Solutions
                      </h3>
                      <p className="text-white text-base leading-relaxed">
                        Reliable hosting and deployment services with scalable
                        infrastructure to keep your applications running 24/7.
                      </p>
                    </div>
                  </div>
                </ElectricBorder>
              </Link>
            </div>
          </div>
        </section>

        <div className="bg-transparent">
          <ScrollBasedVelocityDemo />
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Services;
