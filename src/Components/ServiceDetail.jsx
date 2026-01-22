import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Rocket } from "lucide-react";
import ElectricBorder from "./ElectricBorder";
import StaggeredMenu from "./StaggeredMenu/StaggeredMenu";

const menuItems = [
  { label: "Home", ariaLabel: "Go to home page", link: "/" },
  { label: "About", ariaLabel: "Learn about us", link: "/about" },
  { label: "Services", ariaLabel: "View our services", link: "/services" },
  { label: "Contact", ariaLabel: "Get in touch", link: "/contact" },
];

const socialItems = [
  { label: "Twitter", link: "https://twitter.com", ariaLabel: "Visit our Twitter profile" },
  { label: "GitHub", link: "https://github.com", ariaLabel: "Visit our GitHub profile" },
  { label: "LinkedIn", link: "https://linkedin.com", ariaLabel: "Visit our LinkedIn profile" },
];

const ServiceDetail = ({ 
  title, 
  subtitle, 
  description, 
  splineUrl, 
  floatingIcons = [], 
  services = [] 
}) => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden font-[Manrope] text-white selection:bg-blue-500/30">
      <div className="fixed inset-0 bg-black -z-20"></div>

      <div className="fixed top-0 w-full h-screen -z-10">
        <iframe 
          src={splineUrl}
          frameBorder="0" 
          width="100%"
          height="100%"
          className="w-full h-full"
          title="Background Animation"
        />
      </div>

      <div className="hidden md:block">
        <Navbar />
      </div>

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
        />
      </div>

      <main className="flex-1 flex flex-col items-center pt-24 pb-16 px-6">
        <section className="container mx-auto px-4 sm:px-6 py-12 md:py-24 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter mb-4 sm:mb-6 leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">{title}</span> {subtitle}
              </h1>
              <p className="text-gray-300 text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-lg font-extralight tracking-wide">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="shiny-cta">
                  <span>Start Project</span>
                  <Rocket className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[500px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping"></div>
                  <div className="absolute inset-8 rounded-full border-2 border-cyan-500/30 animate-pulse"></div>
                  <div className="absolute inset-16 rounded-full border-2 border-purple-500/20" style={{animation: 'spin 20s linear infinite'}}></div>
                </div>
                
                {floatingIcons.map((item, index) => (
                  <div key={index} className={`absolute ${item.position} animate-float`} style={{animationDelay: `${index * 0.5}s`}}>
                    <div className={`${item.size} rounded-2xl bg-gradient-to-br ${item.gradient} backdrop-blur-sm border ${item.border} flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                      <item.icon className={`${item.iconSize} ${item.color}`} />
                    </div>
                  </div>
                ))}
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent my-16" role="separator"></div>

        <section className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Our {title} Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {services.map((service, index) => (
              <ElectricBorder
                key={index}
                color="#60a5fa"
                speed={0.1}
                chaos={0.01}
                borderRadius={18}
                className="h-full"
              >
                <article className="relative bg-transparent p-8 rounded-[18px] overflow-hidden group h-full hover:bg-blue-950/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="relative w-16 h-16 mb-6 rounded-lg bg-black border border-blue-500/30 flex items-center justify-center group-hover:border-blue-400/50 transition-colors duration-300">
                      <service.icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 text-white">
                      {service.title}
                    </h3>
                    <p className="text-white text-base leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </article>
              </ElectricBorder>
            ))}
          </div>
        </section>
      </main>

      <Footer />

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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ServiceDetail;
