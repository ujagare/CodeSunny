import React from "react";
import alfanioLogo from "@/assets/images/clint projects/Alfanio.png";
import satvikLogo from "@/assets/images/clint projects/satvikvilla.png";
import visaLogo from "@/assets/images/clint projects/whitewings.png";
import oasisLogo from "@/assets/images/clint projects/Oasisi.png";
import SpotlightCard from "./SpotlightCard";

const caseStudies = [
  {
    id: "alfanio",
    title: "Alfanio",
    category: "Corporate Website",
    summary:
      "A clean, service-led brand site built to showcase capabilities and improve trust for enterprise buyers.",
    scope: "Information architecture, UI design, responsive build",
    stack: "React, React Router 7.6.0, Tailwind CSS, Express",
    analytics:
      "PostHog, Google Analytics (GA4), Google Tag Manager",
    monitoring: "Sentry",
    security: "HSTS",
    infra:
      "Nginx 1.18.0 (reverse proxy), Ubuntu, Node.js",
    misc:
      "PWA, Open Graph, Google Maps, Google Font API, Swiper, Lenis 1.1.20, Framer Motion",
    link: "https://alfanio.com/",
    logo: alfanioLogo,
  },
  {
    id: "satvik-villa-baner",
    title: "Satvik Villa Baner",
    category: "Real Estate",
    summary:
      "Luxury property website focused on premium visuals, clear highlights, and fast inquiry flow.",
    scope: "Brand visual direction, layout system, performance tuning",
    stack: "React, GSAP 3.13.0, Tailwind CSS",
    analytics: "Google Analytics (GA4), Google Tag Manager",
    monitoring: "Facebook Pixel",
    security: "HSTS, HTTP/3",
    infra: "LiteSpeed, Hostinger, jsDelivr CDN",
    misc:
      "PWA, Open Graph, Font Awesome, LottieFiles 5.12.2, Facebook Chat Plugin, Swiper, Lenis 1.0.29, core-js 3.32.2, Priority Hints, Web3Forms",
    link: "https://www.satvikvillabaner.com/",
    logo: satvikLogo,
  },
  {
    id: "white-wings-visa",
    title: "White Wings Visa",
    category: "Visa Services",
    summary:
      "Conversion-first service site with strong CTAs, trust signals, and simple lead capture.",
    scope: "UX copy, landing flow, contact conversion",
    stack: "React, GSAP 3.12.2, Tailwind CSS",
    analytics: "Google Analytics, Google Tag Manager",
    security: "HTTP/3",
    infra: "LiteSpeed",
    misc:
      "Open Graph, Google Font API, LottieFiles 5.12.2, Cloudflare CDN, unpkg, jsDelivr, cdnjs, Google Maps, Swiper, Lenis 1.0.29",
    link: "https://whitewingsvisa.com/",
    logo: visaLogo,
  },
  {
    id: "oasis-tours",
    title: "Oasis Tours & Travels",
    category: "Travel & Tourism",
    summary:
      "A lightweight travel website that presents packages clearly and guides users to booking.",
    scope: "Content structure, UI polish, deployment",
    stack: "Alpine.js 3.15.1, GSAP 3.12.2, Tailwind CSS",
    analytics: "Google Analytics (GA4), Google Tag Manager",
    security: "HSTS",
    infra: "Cloudflare CDN",
    misc: "PWA, Open Graph, Swiper, Lenis 1.0.29",
    link: "https://ujagare.github.io/Oasis-Tours-Travels/",
    logo: oasisLogo,
  },
];

export default function CaseStudies() {
  return (
    <section
      className="relative py-24 md:py-32 bg-[#050515] text-white"
      aria-labelledby="case-studies-heading"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="container mx-auto max-w-6xl px-6 relative">
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.4em] text-blue-300/80">
            Case Studies
          </p>
          <h2
            id="case-studies-heading"
            className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <span style={{ color: "#0071BC" }}>Real client</span> work, built to convert
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl">
            Selected projects that show how we structure content, design
            interfaces, and ship production-ready websites for service brands.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {caseStudies.map((project) => (
            <SpotlightCard
              key={project.id}
              className="bg-transparent border border-white/10 rounded-3xl p-4"
              spotlightColor="rgba(236, 72, 153, 0.35), rgba(59, 130, 246, 0.35)"
            >
              <article
                className="card-top w-full h-fit overflow-hidden relative transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-transparent rounded-[1.2em] group"
                style={{ backdropFilter: "blur(16px)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div
                  className="absolute inset-0 border-white/20 border rounded-[1.2em]"
                  style={{
                    maskImage: "linear-gradient(135deg, white, transparent 60%)",
                  }}
                ></div>
                <div
                  className="absolute inset-0 border-white/10 border rounded-[1.2em]"
                  style={{
                    maskImage: "linear-gradient(135deg, transparent 60%, white)",
                  }}
                ></div>

                <div className="flex flex-col lg:flex-row gap-6 h-full pt-6 pr-6 pb-7 pl-6">
                  <div className="flex flex-col flex-1">
                    <div className="flex gap-3 mb-3 items-center">
                      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-blue-300/80">
                        {project.category}
                      </span>
                    </div>
                    <h3
                      className="text-lg md:text-xl font-semibold tracking-tight mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-neutral-300 text-sm mb-4">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                        {project.stack}
                      </span>
                      {project.analytics ? (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                          {project.analytics}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-auto inline-flex items-center">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="shiny-cta focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050515]"
                      >
                        <span>View Live</span>
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
                  </div>

                  <div className="flex-1 lg:max-w-md">
                    <article className="relative overflow-hidden h-56 bg-gradient-to-br from-[#0f1322] to-[#050515] border-white/10 border rounded-2xl p-4">
                      <div className="absolute inset-0"></div>
                      <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-zinc-300"></span>
                            <span className="h-1 w-1 rounded-full bg-zinc-600"></span>
                            <span className="h-1 w-1 rounded-full bg-zinc-600"></span>
                          </div>
                          <span className="text-[11px] text-zinc-500 font-normal">
                            Preview
                          </span>
                        </div>
                        <div
                          className="flex-1 bg-cover bg-center rounded-lg mt-2 mb-2"
                          style={{ backgroundImage: `url(${project.logo})` }}
                        ></div>
                        <div className="mt-auto">
                          <h3 className="text-[15px] sm:text-base font-medium leading-snug tracking-tight text-zinc-100">
                            {project.title}
                          </h3>
                          <p className="mt-1 text-sm text-zinc-400">
                            {project.scope}
                          </p>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </article>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
