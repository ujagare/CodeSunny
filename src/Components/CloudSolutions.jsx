import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  Cloud,
  Server,
  Shield,
  Zap,
  BarChart,
  Lock,
  Rocket,
} from "lucide-react";
import ElectricBorder from "./ElectricBorder";
import MobileNavbar from "./MobileNavbar";

const CloudSolutions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full min-h-screen relative overflow-hidden font-[Manrope] text-white selection:bg-indigo-500/30">
      {/* Base Background Color */}
      <div className="fixed inset-0 bg-black -z-20"></div>

      {/* Spline Background */}
      <div className="fixed top-0 w-full h-screen -z-10">
        <iframe
          src="https://my.spline.design/retrofuturismbganimation-Lb3VtL1bNaYUnirKNzn0FvaW/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="w-full h-full"
        ></iframe>
      </div>

      <div className="hidden md:block">
        <Navbar />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <MobileNavbar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-6">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16 md:py-32 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-light tracking-tighter mb-6 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Cloud
                </span>{" "}
                Solutions
              </h1>
              <p className="text-gray-300 text-base sm:text-lg md:text-3xl mb-8 max-w-2xl mx-auto font-extralight tracking-wide">
                Reliable hosting and deployment services with scalable
                infrastructure to keep your applications running 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="shiny-cta">
                  <span>Start Project</span>
                  <Rocket className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent my-16"></div>
        </div>

        {/* Service Cards Grid */}
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            Our Cloud Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {[
              {
                icon: Cloud,
                title: "Cloud Infrastructure",
                description:
                  "Scalable cloud hosting solutions with AWS, Google Cloud, and Azure for reliable and flexible infrastructure.",
              },
              {
                icon: Server,
                title: "Server Management",
                description:
                  "24/7 server monitoring, maintenance, updates, and optimization to ensure peak performance.",
              },
              {
                icon: Shield,
                title: "Security & Compliance",
                description:
                  "Enterprise-grade security, SSL certificates, firewalls, and compliance with industry standards.",
              },
              {
                icon: Zap,
                title: "Performance Optimization",
                description:
                  "CDN integration, caching strategies, and load balancing for lightning-fast application performance.",
              },
              {
                icon: BarChart,
                title: "Monitoring & Analytics",
                description:
                  "Real-time monitoring, logging, and analytics to track application health and performance metrics.",
              },
              {
                icon: Lock,
                title: "Backup & Disaster Recovery",
                description:
                  "Automated backups, disaster recovery plans, and business continuity solutions for data protection.",
              },
            ].map((service, index) => (
              <ElectricBorder
                key={index}
                color="#818cf8"
                speed={0.1}
                chaos={0.01}
                borderRadius={18}
                className="h-full"
              >
                <div className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="relative w-16 h-16 mb-6 rounded-lg bg-black border border-indigo-500/30 flex items-center justify-center">
                      <div
                        className="absolute top-0 left-0 w-4 h-4 border-t border-l border-transparent rounded-tl-lg"
                        style={{
                          borderTopColor: "#818cf8",
                          borderLeftColor: "#818cf8",
                        }}
                      ></div>
                      <div
                        className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-transparent rounded-br-lg"
                        style={{
                          borderBottomColor: "#c084fc",
                          borderRightColor: "#c084fc",
                        }}
                      ></div>
                      <service.icon className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-white">
                      {service.title}
                    </h3>
                    <p className="text-white text-sm sm:text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </ElectricBorder>
            ))}
          </div>
        </div>
      </main>

      <Footer />

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
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          padding: 2px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default CloudSolutions;
