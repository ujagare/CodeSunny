import React, { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import Navbar from "./Navbar";
import StaggeredMenu from "./StaggeredMenu/StaggeredMenu";
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
import { Palette, Code, Zap, Rocket, Globe, Users } from "lucide-react";

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

const TestimonialCard = ({ quote, name, role, image }) => (
  <article className="rounded-2xl border p-6 border-white/10 bg-neutral-900/70">
    <blockquote className="text-[16px] sm:text-[18px] text-neutral-100">
      <span className="inline-flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-neutral-400"
        >
          <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
          <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path>
        </svg>
        "{quote}"
      </span>
    </blockquote>
    <div className="mt-5 flex items-center gap-3">
      <img
        className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
        src={image}
        alt={name}
      />
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-neutral-400">{role}</div>
      </div>
    </div>
  </article>
);

const ShineBorderCard = ({ icon, title, text }) => (
  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1a1f3a] to-[#0f1420] border border-blue-500/20">
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
    <div
      style={{
        backgroundImage:
          "radial-gradient(transparent,transparent, #3b82f6, #06b6d4, transparent,transparent)",
        backgroundSize: "300% 300%",
        animation: "shine 14s linear infinite",
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: "1px",
      }}
      className="absolute inset-0 size-full rounded-[inherit] pointer-events-none"
    />
    <div className="relative rounded-3xl bg-gradient-to-br from-[#1a1f3a] to-[#0f1420] p-8 h-full transition hover:from-[#1f2442] hover:to-[#12172a]">
      <div className="w-14 h-14 mb-6 rounded-2xl bg-black border border-blue-500/30 flex items-center justify-center text-3xl">
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-base leading-relaxed">{text}</p>
    </div>
    <style jsx>{`
      @keyframes shine {
        0% {
          background-position: 0% 0%;
        }
        50% {
          background-position: 100% 100%;
        }
        100% {
          background-position: 0% 0%;
        }
      }
    `}</style>
  </div>
);

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
    <div className="w-full bg-[#050515] relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Mobile StaggeredMenu */}
        <div className="md:hidden">
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={false}
            menuButtonColor="#fff"
            openMenuButtonColor="#fff"
            changeMenuColorOnOpen={false}
            colors={["#B19EEF", "#5227FF"]}
            accentColor="#0071BC"
            isFixed={true}
            onMenuOpen={() => console.log("Menu opened")}
            onMenuClose={() => console.log("Menu closed")}
          />
        </div>
        <main className="w-full relative flex items-center justify-center overflow-hidden md:mt-0 z-20 bg-[#050515]">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 pointer-events-none"></div>
          <div className="w-full h-[85vh] md:h-[calc(100vh-5rem)] min-h-[500px] flex items-center justify-center">
            <div className="w-full h-full scale-75 md:scale-100 origin-center md:mr-0">
              <Spline
                scene="https://prod.spline.design/O-UQSVU5QlYbnHEc/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none">
            <div className="flex flex-col items-center pt-24 md:pt-16 lg:pt-20">
              <h1
                className="text-3xl md:text-5xl lg:text-7xl font-bold text-center neue-machina"
                style={{
                  fontFamily: "NeueMachina",
                  fontWeight: "normal",
                }}
              >
                <GradientText
                  colors={["#00CED1", "#1E90FF", "#00CED1", "#1E90FF"]}
                  animationSpeed={3}
                  showBorder={false}
                  className="inline-block"
                >
                  Creative Solutions
                  <br />
                  That Drive Real Business Growth
                </GradientText>
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

        {/* Online Shopping Section */}
        <section className="py-16 border-t border-zinc-200 dark:border-zinc-700">
          <div className="overflow-hidden group w-full relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-zinc-50 dark:from-[#09090b] to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-zinc-50 dark:from-[#09090b] to-transparent z-10"></div>
          </div>
        </section>

        {/* Services Hero Section */}
        <section className="relative py-12 md:py-20 lg:py-32 overflow-hidden border-t border-white/5">
          <div className="w-full px-4 md:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left Side - Text Content */}
              <div className="text-left max-w-4xl lg:w-1/2 px-4 md:px-8 lg:px-16 w-full">
                <h1
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-medium tracking-tight leading-tight mb-6 md:mb-8 text-white"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  We build the solutions that drive
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    {" "}
                    digital business growth.
                  </span>
                </h1>
                <p
                  className="text-base md:text-lg lg:text-xl text-zinc-400 leading-relaxed mb-8 md:mb-10 font-light tracking-tight max-w-2xl"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  We take ownership of complex web development projects like
                  custom applications, e-commerce platforms, and scalable
                  systems — freeing up your team to focus on core business
                  operations.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12 md:mb-16">
                  <div className="inline-block bg-transparent w-full sm:w-auto">
                    <style jsx>{`
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
                  <p className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.15em] md:tracking-[0.2em] uppercase font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 break-words">
                    // Built with React, Next.js, Node.js, and Cloud
                    Infrastructure
                  </p>
                </div>
              </div>

              {/* Right Side - RadialOrbitalTimeline */}
              <div className="lg:w-1/2 w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
                <RadialOrbitalTimeline timelineData={timelineData} />
              </div>
            </div>
          </div>
        </section>

        {/* Electric Border Cards Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-4xl lg:text-6xl font-medium tracking-tight leading-tight text-center mb-4 text-white"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Our
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                {" "}
                Services
              </span>
            </h2>
            <p
              className="text-base md:text-lg text-center mb-12 max-w-3xl mx-auto text-gray-400"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Comprehensive digital solutions tailored to elevate your business
              and drive measurable results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ElectricBorder
                color="#60a5fa"
                speed={0.1}
                chaos={0.01}
                borderRadius={18}
              >
                <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group">
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
                    <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                      Web Development
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                      Frontend, Backend, and Full Stack solutions built with
                      modern technologies for scalable and high-performance
                      websites.
                    </p>
                  </div>
                </div>
              </ElectricBorder>
              <ElectricBorder
                color="#60a5fa"
                speed={0.1}
                chaos={0.01}
                borderRadius={18}
              >
                <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group">
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
                    <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                      UI/UX Design
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                      Modern and responsive design that creates intuitive user
                      experiences and beautiful interfaces for your brand.
                    </p>
                  </div>
                </div>
              </ElectricBorder>
              <ElectricBorder
                color="#60a5fa"
                speed={0.1}
                chaos={0.01}
                borderRadius={18}
              >
                <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group">
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
                    <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                      Digital Marketing
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                      SEO optimization and Social Media strategies to grow your
                      online presence and reach your target audience
                      effectively.
                    </p>
                  </div>
                </div>
              </ElectricBorder>
              <ElectricBorder
                color="#60a5fa"
                speed={0.1}
                chaos={0.01}
                borderRadius={18}
              >
                <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group">
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
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                      E-commerce Solutions
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                      Complete online store development with payment
                      integration, inventory management, and seamless shopping
                      experiences.
                    </p>
                  </div>
                </div>
              </ElectricBorder>
              <ElectricBorder
                color="#60a5fa"
                speed={0.1}
                chaos={0.01}
                borderRadius={18}
              >
                <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group">
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
                    <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                      SEO Optimisation
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                      Search engine optimization to boost your rankings,
                      increase visibility, and drive organic traffic to your
                      website.
                    </p>
                  </div>
                </div>
              </ElectricBorder>
              <ElectricBorder
                color="#60a5fa"
                speed={0.1}
                chaos={0.01}
                borderRadius={18}
              >
                <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group">
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
                    <h3 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                      Cloud Solutions
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed">
                      Reliable hosting and deployment services with scalable
                      infrastructure to keep your applications running 24/7.
                    </p>
                  </div>
                </div>
              </ElectricBorder>
            </div>
          </div>
        </section>

        <section className="relative pt-32 pb-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10 relative mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EDFB81] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EDFB81]"></span>
              </span>
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Global delivery in seconds
              </span>
            </div>

            <h1
              className="text-4xl lg:text-6xl font-medium tracking-tight leading-tight mb-6 text-white"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Success stories from
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                {" "}
                our clients.
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Real results from real businesses. Discover how we've helped
              companies achieve their digital transformation goals.
            </p>
          </div>

          <div className="w-full relative py-8 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 w-64 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 80% 100% at left center, black 20%, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 100% at left center, black 20%, transparent 80%)",
              }}
            ></div>
            <div
              className="absolute inset-y-0 right-0 w-64 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(270deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 80% 100% at right center, black 20%, transparent 80%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 100% at right center, black 20%, transparent 80%)",
              }}
            ></div>

            <div>
              {/* Row 1 */}
              <div className="flex gap-6 animate-[marquee-reverse_600s_linear_infinite] hover:[animation-play-state:paused] w-max mb-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex gap-6">
                    <article
                      className="w-64 h-40 rounded-[32px] p-4 flex flex-col justify-between shadow-xl relative"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        borderImage:
                          "linear-gradient(135deg, #60a5fa, #34d399) 1",
                      }}
                    >
                      <blockquote className="text-sm text-white leading-snug">
                        "Prepaid cards for everything - perfect for all my
                        needs!"
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                            src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=256&auto=format&fit=crop"
                            alt="Aisha"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Aisha Green
                            </div>
                            <div className="text-xs text-neutral-300">
                              Online Shopper
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </article>

                    <article
                      className="w-64 h-40 rounded-[32px] p-4 flex flex-col justify-between shadow-xl relative"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        borderImage:
                          "linear-gradient(135deg, #60a5fa, #34d399) 1",
                      }}
                    >
                      <blockquote className="text-sm text-white leading-snug">
                        "Use our cards for online shopping and payments
                        seamlessly."
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                            src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop"
                            alt="Michael"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Michael Chen
                            </div>
                            <div className="text-xs text-neutral-300">
                              Digital Buyer
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </article>

                    <article
                      className="w-64 h-40 rounded-[32px] p-4 flex flex-col justify-between shadow-xl relative"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        borderImage:
                          "linear-gradient(135deg, #60a5fa, #34d399) 1",
                      }}
                    >
                      <blockquote className="text-sm text-white leading-snug">
                        "Perfect for subscriptions and secure purchases on the
                        internet."
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256&auto=format&fit=crop"
                            alt="Priya"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Priya Patel
                            </div>
                            <div className="text-xs text-neutral-300">
                              Subscription User
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </article>

                    <article
                      className="w-64 h-40 rounded-[32px] p-4 flex flex-col justify-between shadow-xl relative"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        borderImage:
                          "linear-gradient(135deg, #60a5fa, #34d399) 1",
                      }}
                    >
                      <blockquote className="text-sm text-white leading-snug">
                        "Securely purchase without a bank account - game
                        changer!"
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                            src="https://images.unsplash.com/photo-1546456073-6712f79251bb?q=80&w=256&auto=format&fit=crop"
                            alt="Jonas"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Jonas Weber
                            </div>
                            <div className="text-xs text-neutral-300">
                              Freelancer
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </article>

                    <article
                      className="w-64 h-40 rounded-[32px] p-4 flex flex-col justify-between shadow-xl relative"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        borderImage:
                          "linear-gradient(135deg, #60a5fa, #34d399) 1",
                      }}
                    >
                      <blockquote className="text-sm text-white leading-snug">
                        "Cards work everywhere - online shopping made so easy!"
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                            src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=256&auto=format&fit=crop"
                            alt="Liam"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Liam O'Connor
                            </div>
                            <div className="text-xs text-neutral-300">
                              E-commerce User
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {/* Row 2 */}
              <div className="flex gap-6 animate-[marquee_600s_linear_infinite] w-max hover:[animation-play-state:paused]">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex gap-6">
                    <article
                      className="w-64 h-40 rounded-[32px] p-4 flex flex-col justify-between shadow-xl relative"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        borderImage:
                          "linear-gradient(135deg, #60a5fa, #34d399) 1",
                      }}
                    >
                      <blockquote className="text-sm text-white leading-snug">
                        "Integrations were seamless. We saved 120+ hours first
                        quarter."
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop"
                            alt="Rachel"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Rachel Adams
                            </div>
                            <div className="text-xs text-neutral-300">
                              Product Manager
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </article>

                    <article
                      className="w-64 h-40 rounded-[32px] p-4 flex flex-col justify-between shadow-xl relative"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        borderImage:
                          "linear-gradient(135deg, #60a5fa, #34d399) 1",
                      }}
                    >
                      <blockquote className="text-sm text-white leading-snug">
                        "Switching platforms was our best decision this year."
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop"
                            alt="Carlos"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Carlos Rivera
                            </div>
                            <div className="text-xs text-neutral-300">CEO</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </article>

                    <article
                      className="w-64 h-40 rounded-[32px] p-4 flex flex-col justify-between shadow-xl relative"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        borderImage:
                          "linear-gradient(135deg, #60a5fa, #34d399) 1",
                      }}
                    >
                      <blockquote className="text-sm text-white leading-snug">
                        "Transparency removed all doubt. We know where we
                        stand."
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                            src="https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=256&auto=format&fit=crop"
                            alt="Sofia"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Sofia Martinez
                            </div>
                            <div className="text-xs text-neutral-300">
                              Analytics Lead
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </article>

                    <article
                      className="w-64 h-40 rounded-[32px] p-4 flex flex-col justify-between shadow-xl relative"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        borderImage:
                          "linear-gradient(135deg, #60a5fa, #34d399) 1",
                      }}
                    >
                      <blockquote className="text-sm text-white leading-snug">
                        "Predictive models helped us spot trends early and act
                        faster."
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                            src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop"
                            alt="Noah"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Noah Bennett
                            </div>
                            <div className="text-xs text-neutral-300">
                              Strategy Director
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </article>

                    <article
                      className="w-64 h-40 rounded-[32px] p-4 flex flex-col justify-between shadow-xl relative"
                      style={{
                        background: "transparent",
                        border: "2px solid transparent",
                        borderImage:
                          "linear-gradient(135deg, #60a5fa, #34d399) 1",
                      }}
                    >
                      <blockquote className="text-sm text-white leading-snug">
                        "The platform is intuitive, secure, and delivers
                        measurable results."
                      </blockquote>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop"
                            alt="Emma"
                          />
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Emma Wilson
                            </div>
                            <div className="text-xs text-neutral-300">
                              Tech Lead
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-3 h-3 fill-amber-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-100%);
              }
            }
            @keyframes marquee-reverse {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(0%);
              }
            }
          `}</style>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
