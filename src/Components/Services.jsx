import React, { useEffect, lazy, Suspense } from "react";
import Lenis from "lenis";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import Footer from "./Footer";
import geairImage from "../assets/images/geair.jpg";
import ElectricBorder from "./ElectricBorder";
import MetaTags from "./MetaTags";
import SpotlightCard from "./SpotlightCard";
import HowWeBringIdeas from "./HowWeBringIdeas/HowWeBringIdeas";
import KineticTeamHybrid from "./ui/kinetic-team-hybrid";

const AnimatedBeamDemo = lazy(() => import("./AnimatedBeamDemo"));
const ScrollBasedVelocityDemo = lazy(() =>
  import("./ScrollBasedVelocityDemo").then((module) => ({
    default: module.ScrollBasedVelocityDemo,
  })),
);

const Services = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <MetaTags
        title="Our Services - CodeSunny Digital Solutions"
        description="Explore CodeSunny's comprehensive services: web development, UI/UX design, digital marketing, e-commerce solutions, SEO optimization, and cloud services."
        keywords="services, web development, UI/UX design, digital marketing, e-commerce, SEO, cloud solutions"
        url="https://codesunny.com/services"
      />
      <div className="w-full min-h-screen bg-[#050515] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-transparent pointer-events-none"></div>
        <header className="fixed top-0 left-0 right-0 z-[1000] h-20 bg-transparent">
          {/* Desktop Navbar */}
          <nav className="hidden md:block bg-black">
            <Navbar />
          </nav>

          {/* Mobile Navigation */}
          <nav className="md:hidden">
            <MobileNavbar />
          </nav>
        </header>

        <div className="relative z-10">
          {/* New Hero Section */}
          <section
            className="w-full min-h-screen md:min-h-auto md:bg-center lg:pt-48 lg:pb-48 max-w-none mr-auto ml-auto pt-0 pr-8 pb-32 md:pb-32 pl-8 relative flex items-center"
            aria-labelledby="services-hero-heading"
          >
            <div
              className="absolute top-0 right-0 bottom-0 left-0"
              data-container-bg="true"
            ></div>
            <div className="grid lg:grid-cols-2 max-w-7xl mr-auto ml-auto items-center w-full px-4">
              {/* Left Column: Copy & Form */}
              <article className="max-w-2xl z-10 mt-24 md:mt-0">
                <p
                  className="hidden md:block uppercase text-xs font-semibold tracking-tight font-dm-sans mb-6"
                  style={{ color: "#0071BC" }}
                >
                  Comprehensive Digital Solutions
                </p>
                <h1
                  id="services-hero-heading"
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-stone-50 tracking-tight font-instrument-serif mb-8"
                >
                  <span className="block">
                    <span style={{ color: "#0071BC" }}>Expert</span> Services
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
                    <Link
                      to="/contact"
                      className="shiny-cta-services focus:ring-2 focus:ring-blue-500"
                    >
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
                    </Link>
                  </div>
                </div>
              </article>
              {/* Right Column: UI Mockups */}
              <aside className="mt-8 sm:mt-0 relative perspective-1000">
                <img
                  src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4aa0ba0f-cf6d-4050-bf33-824539eb56e0_1600w.png"
                  alt="CodeSunny digital solutions product interface mockup"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block"
                />
              </aside>
            </div>
            <div className="spline-container absolute top-0 left-0 w-full h-full -z-10">
              <iframe
                src="https://my.spline.design/retrofuturismbganimation-Lb3VtL1bNaYUnirKNzn0FvaW"
                title="Decorative background animation"
                style={{ border: "none" }}
                width="100%"
                height="100%"
              ></iframe>
            </div>
          </section>

          <section
            className="relative"
            aria-labelledby="services-features-heading"
          >
            <div className="mx-auto max-w-7xl px-6 md:px-8 pt-16 md:pt-24">
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <article className="space-y-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_1px_rgba(16,185,129,0.7)]"></span>
                    Now in public beta
                    <span className="text-slate-500">•</span>
                    <Link
                      to="/contact"
                      className="text-sky-300 hover:text-sky-200 transition-colors underline/30"
                    >
                      See what's new
                    </Link>
                  </div>
                  <h2
                    id="services-features-heading"
                    className="text-4xl lg:text-6xl font-medium tracking-tight capitalize text-white"
                  >
                    Build, launch, and scale in days not months.
                  </h2>
                  <p className="text-base sm:text-lg text-slate-400 max-w-xl">
                    Ship beautiful experiences with a powerful toolkit for
                    design, data, and delivery. Opinionated where it matters,
                    flexible where it counts.
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
                    <Link
                      to="/contact"
                      className="shiny-cta-demo focus:ring-2 focus:ring-blue-500"
                    >
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
                    </Link>
                  </div>
                  <div className="flex items-center gap-6 pt-3">
                    <div className="flex -space-x-2">
                      <img
                        src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=80&auto=format&fit=crop"
                        alt="Client testimonial - professional headshot"
                        className="h-8 w-8 rounded-full ring-2 ring-[#0b0f1a] object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=80&auto=format&fit=crop"
                        alt="Client testimonial - professional headshot"
                        className="h-8 w-8 rounded-full ring-2 ring-[#0b0f1a] object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop"
                        alt="Client testimonial - professional headshot"
                        className="h-8 w-8 rounded-full ring-2 ring-[#0b0f1a] object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="text-xs text-slate-400">
                      Trusted by 4,000+ teams
                      <span className="mx-2 text-slate-600">•</span>
                      99.99% uptime
                    </div>
                  </div>
                </article>

                <aside className="relative">
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
                          <span className="text-sky-300">
                            # Deploy globally
                          </span>
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
                            <span className="text-violet-300">import</span>{" "}
                            {"{ "}
                            <span className="text-sky-300">client</span>
                            {" } "}
                            <span className="text-violet-300">from</span>{" "}
                            <span className="text-emerald-300">
                              "@axiom/sdk"
                            </span>
                            ;{`\n\n`}
                            <span className="text-violet-300">const</span>{" "}
                            <span className="text-sky-300">res</span> ={" "}
                            <span className="text-violet-300">await</span>{" "}
                            <span className="text-sky-300">client</span>.
                            <span className="text-amber-300">projects</span>.
                            <span className="text-amber-300">create</span>({"{"}
                            \n
                            {"  "}
                            <span className="text-sky-300">name</span>:{" "}
                            <span className="text-emerald-300">"my-app"</span>
                            ,\n
                            {"  "}
                            <span className="text-sky-300">region</span>:{" "}
                            <span className="text-emerald-300">"global"</span>
                            ,\n
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
                        alt="CodeSunny web development dashboard and analytics interface"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-56 sm:h-64 object-cover"
                      />
                    </div>
                  </div>
                </aside>
              </div>

              <div className="mt-14 md:mt-20">
                <div className="text-center text-xs text-slate-500 mb-5">
                  Backed by teams who value speed and craft
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                    <span className="tracking-tight text-sm font-medium">
                      NX
                    </span>
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

          {/* Team Section */}
          <section aria-labelledby="team-section-heading">
            <h2 id="team-section-heading" className="sr-only">
              Our Team
            </h2>
            <KineticTeamHybrid />
          </section>

          {/* How We Bring Ideas to Life Section */}
          <HowWeBringIdeas />

          <section aria-labelledby="scroll-demo-heading">
            <h2 id="scroll-demo-heading" className="sr-only">
              Scroll Animation
            </h2>
            <div className="bg-transparent">
              <Suspense
                fallback={<div className="min-h-[200px]" aria-hidden="true" />}
              >
                <ScrollBasedVelocityDemo />
              </Suspense>
            </div>
          </section>

          <footer>
            <Footer />
          </footer>
        </div>
      </div>
    </>
  );
};

export default Services;
