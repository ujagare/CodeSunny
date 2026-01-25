import React from "react";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import Footer from "./Footer";
import GradientText from "./GradientText";

const Contact = () => {
  return (
    <div className="w-full min-h-screen relative overflow-hidden font-[Inter] text-gray-100 selection:bg-indigo-600/50">
      {/* Base Background Color */}
      <div className="fixed inset-0 bg-[#050515] -z-20"></div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-transparent pointer-events-none -z-15"></div>

      {/* 3-D Earth Background */}
      <div className="fixed top-0 w-full h-screen -z-10">
        <iframe
          src="https://my.spline.design/worldplanet-inmHh7fVCul1jUFrNRYlotVU"
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

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 w-full mb-32">
          {/* Hero Text */}
          <section className="w-full lg:max-w-md space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-tight font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 pb-2">
              Get in Touch With Us
            </h1>
            <p className="text-lg text-neutral-300 font-light tracking-tight">
              Have a project in mind? We'd love to hear from you. Reach out to
              discuss your ideas, requirements, and how we can help transform
              your vision into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="shiny-cta">
                <span>Send Message</span>
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
                  className="w-4 h-4"
                >
                  <path d="m22 2-7 20-4-9-9-4Z"></path>
                  <path d="M22 2 11 13"></path>
                </svg>
              </button>
            </div>
          </section>

          {/* 3D Cards Wrapper */}
          <div className="relative flex flex-col items-center space-y-8 perspective-1000 hidden lg:flex">
            {/* Feature Card */}
            <section
              aria-label="Feature card"
              className="w-full max-w-sm overflow-hidden rounded-xl shadow-lg shadow-black/30 bg-white/5 backdrop-blur-md transform-3d animate-float"
              style={{ transform: "rotateY(20deg) rotateZ(-15deg)" }}
            >
              <header className="p-6">
                <div className="flex gap-3 items-start">
                  <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-indigo-950 shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-400"
                    >
                      <circle cx="12" cy="12" r="1"></circle>
                      <path d="M12 1v6m4.22-4.22-4.24 4.24m5.08 4.22h-6m4.24 4.24-4.24-4.24m-4.24 4.24v-6m-4.22 4.22 4.24-4.24m-5.08-4.22h6m-4.24-4.24 4.24 4.24"></path>
                    </svg>
                  </span>
                  <h2 className="text-sm leading-6 font-light tracking-tight text-white">
                    Let's Connect
                  </h2>
                </div>
              </header>

              <div className="border-t border-white/10"></div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xs text-neutral-400 font-light tracking-tight">
                    RESPONSE TIME
                  </h3>
                  <p className="mt-2 text-sm text-neutral-200 font-light tracking-tight">
                    We typically respond to inquiries within 24 hours during
                    business days.
                  </p>
                </div>

                <div className="flex">
                  <div className="w-24">
                    <h3 className="text-xs text-neutral-400 font-light tracking-tight">
                      CHANNELS
                    </h3>
                  </div>
                  <ul className="flex flex-wrap gap-2">
                    <li className="px-2.5 py-0.5 rounded-md text-xs bg-indigo-900/40 text-indigo-200 font-light tracking-tight">
                      Email
                    </li>
                    <li className="px-2.5 py-0.5 rounded-md text-xs bg-pink-900/40 text-pink-200 font-light tracking-tight">
                      Phone
                    </li>
                    <li className="px-2.5 py-0.5 rounded-md text-xs bg-green-900/40 text-green-200 font-light tracking-tight">
                      Chat
                    </li>
                  </ul>
                </div>

                <div className="flex">
                  <div className="w-24">
                    <h3 className="text-xs text-neutral-400 font-light tracking-tight">
                      AVAILABILITY
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-sm font-light tracking-tight">
                      Always Open
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Project Details Card */}
            <section
              aria-label="Project details"
              className="absolute -bottom-24 left-2/3 w-full max-w-sm overflow-hidden rounded-xl shadow-lg shadow-black/30 bg-white/5 backdrop-blur-md transform-3d animate-float-delayed"
              style={{
                transform: "rotateY(20deg) rotateZ(-15deg) translateZ(50px)",
              }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-light tracking-tight text-white">
                    Contact Info
                  </span>
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
                    className="text-gray-400"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xs text-neutral-400 font-light tracking-tight mb-2">
                    EMAIL
                  </h3>
                  <p className="text-sm text-neutral-200 font-light tracking-tight">
                    hello@codesunny.com
                  </p>
                </div>
                <div>
                  <h3 className="text-xs text-neutral-400 font-light tracking-tight mb-2">
                    PHONE
                  </h3>
                  <p className="text-sm text-neutral-200 font-light tracking-tight">
                    +1 (555) 123-4567
                  </p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-100 text-black px-4 py-2 text-sm hover:bg-neutral-200 transition font-light tracking-tight">
                    Schedule a Call
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
                    >
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Contact Form Section */}
        <section
          className="md:pt-40 bg-center z-[70] bg-cover pt-40 pb-40 relative w-full"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 55%, black 60%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 55%, black 60%, transparent)",
          }}
          id="contact"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className="absolute -left-40 top-10 h-[70vh] w-[60vh] rounded-full blur-3xl opacity-25"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(255,255,255,0.15), rgba(0,0,0,0))",
              }}
            ></div>
          </div>

          <div className="max-w-4xl mx-auto px-6 flex flex-col items-center justify-center">
            <div className="text-center w-full">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-100 animate-in">
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
                  className="h-4 w-4"
                >
                  <path d="M4 6l8 5 8-5"></path>
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                </svg>
                Let's Work Together
              </span>
              <h2 className="mt-4 text-4xl sm:text-6xl tracking-tight font-semibold animate-in">
                <GradientText
                  colors={["#00CED1", "#1E90FF", "#00CED1", "#1E90FF"]}
                  animationSpeed={3}
                  showBorder={false}
                  className="inline-block"
                >
                  Ready to collaborate?
                </GradientText>
              </h2>
              <p className="mt-4 text-neutral-400 text-lg max-w-2xl mx-auto animate-in">
                Whether you need help with web development, design, or digital
                marketing, we're here to help bring your vision to life.
              </p>
            </div>

            <div className="mt-12 grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur animate-in">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Send a Message
                </h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Project Budget
                    </label>
                    <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-neutral-100 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20">
                      <option>$5k - $10k</option>
                      <option>$10k - $25k</option>
                      <option>$25k - $50k</option>
                      <option>$50k+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Message
                    </label>
                    <textarea
                      rows="4"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20"
                      placeholder="Tell me about your project..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 border border-white/20 px-6 py-3 text-neutral-100 hover:bg-white/15 transition"
                  >
                    <span className="font-medium">Send Message</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="m22 2-7 20-4-9-9-4Z"></path>
                      <path d="M22 2 11 13"></path>
                    </svg>
                  </button>
                </form>
              </div>

              <div className="space-y-8">
                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur animate-in">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 border-white/10 p-3 shadow-lg">
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
                        className="h-6 w-6 text-white"
                      >
                        <path d="M4 6l8 5 8-5"></path>
                        <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Email
                      </h3>
                      <p className="text-neutral-400">hello@codesunny.com</p>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur animate-in">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 border-white/10 p-3 shadow-lg">
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
                        className="h-6 w-6 text-white"
                      >
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Schedule a Call
                      </h3>
                      <p className="text-neutral-400">
                        Book a free consultation
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur animate-in">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Follow Us
                  </h3>
                  <div className="flex items-center gap-4">
                    <a
                      href="#"
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-neutral-400 hover:text-white hover:bg-white/15 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-neutral-400 hover:text-white hover:bg-white/15 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="20"
                          height="20"
                          x="2"
                          y="2"
                          rx="5"
                          ry="5"
                        ></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-neutral-400 hover:text-white hover:bg-white/15 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect width="4" height="12" x="2" y="9"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-25 w-[60%] h-8"
              style={{
                background:
                  "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, transparent 70%)",
              }}
            ></div>
            <div className="h-px bg-white/10 w-full"></div>
          </div>
        </section>
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

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-3d {
          transform-style: preserve-3d;
        }

        @keyframes float {
          0%, 100% { transform: rotateY(20deg) rotateZ(-15deg) translateY(0); }
          50% { transform: rotateY(20deg) rotateZ(-15deg) translateY(-10px); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: rotateY(20deg) rotateZ(-15deg) translateZ(50px) translateY(0); }
          50% { transform: rotateY(20deg) rotateZ(-15deg) translateZ(50px) translateY(-10px); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default Contact;
