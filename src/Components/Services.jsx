import React, { useEffect, useRef, useState } from 'react';
import Navbar from "./Navbar";
import StaggeredMenu from "./StaggeredMenu/StaggeredMenu";
import Footer from "./Footer";
import GradientText from "./GradientText";
import geairImage from '../assets/images/geair.jpg';
import webDevImage from '../assets/images/web-development.png';
import uiUxImage from '../assets/images/ui-ux-design.png';
import digitalMarketingImage from '../assets/images/digital-marketing.png';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];

const Services = () => {
  const [activeStep, setActiveStep] = useState(1);
  const observerRef = useRef(null);

  useEffect(() => {
    const sections = document.querySelectorAll('[data-step]');
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const step = parseInt(entry.target.getAttribute('data-step'));
            setActiveStep(step);
          }
        });
      },
      { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' }
    );

    sections.forEach((section) => {
      if (section.classList.contains('workflow-step-content')) {
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
          colors={['#B19EEF', '#5227FF']}
          accentColor="#0071BC"
          isFixed={true}
          onMenuOpen={() => console.log('Menu opened')}
          onMenuClose={() => console.log('Menu closed')}
        />
      </div>

      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 md:px-8 pt-16 md:pt-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_1px_rgba(16,185,129,0.7)]"></span>
                Now in public beta
                <span className="text-slate-500">•</span>
                <a href="#changelog" className="text-sky-300 hover:text-sky-200 transition-colors underline/30">See what's new</a>
              </div>
              <h1 className="sm:text-5xl lg:text-6xl xl:text-7xl text-4xl font-semibold tracking-tight">
                <GradientText
                  colors={["#00CED1", "#1E90FF", "#00CED1", "#1E90FF"]}
                  animationSpeed={3}
                  showBorder={false}
                  className="inline-block"
                >
                  Build, launch, and scale in days — not months.
                </GradientText>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 max-w-xl">
                Ship beautiful experiences with a powerful toolkit for design, data, and delivery. Opinionated where it matters, flexible where it counts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#get-started" className="inline-flex items-center justify-center gap-2 rounded-md bg-sky-500/90 hover:bg-sky-400 text-slate-900 px-5 py-3 text-sm font-medium ring-1 ring-sky-300/40 hover:ring-sky-300 transition-all">
                  Start free
                </a>
                <a href="#demo" className="inline-flex items-center justify-center gap-2 hover:text-white hover:bg-white/4 ring-1 ring-white/10 hover:ring-white/20 transition-all text-sm text-slate-200 rounded-md pt-3 pr-5 pb-3 pl-5">
                  Book a demo
                </a>
              </div>
              <div className="flex items-center gap-6 pt-3">
                <div className="flex -space-x-2">
                  <img src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=80&auto=format&fit=crop" alt="User avatar" className="h-8 w-8 rounded-full ring-2 ring-[#0b0f1a] object-cover" />
                  <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=80&auto=format&fit=crop" alt="User avatar" className="h-8 w-8 rounded-full ring-2 ring-[#0b0f1a] object-cover" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=80&auto=format&fit=crop" alt="User avatar" className="h-8 w-8 rounded-full ring-2 ring-[#0b0f1a] object-cover" />
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
                  <div className="text-[11px] text-slate-400">app/console</div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <div className="rounded-lg border border-white/10 bg-black/50 p-4">
                    <div className="flex items-center justify-between pb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M12 19h8"></path>
                          <path d="m4 17 6-6-6-6"></path>
                        </svg>
                        CLI
                      </div>
                      <span className="text-[10px] text-slate-500">v2.1.0</span>
                    </div>
                    <pre className="text-[12px] leading-relaxed text-slate-300">
                      <span className="text-sky-300"># Create a new project</span>
                      {`\nnpx axiom@latest init my-app\n`}
                      <span className="text-sky-300"># Start the dev server</span>
                      {`\naxiom dev --open\n`}
                      <span className="text-sky-300"># Deploy globally</span>
                      {`\naxiom deploy --prod`}
                    </pre>
                  </div>
                  <div className="border-white/10 border rounded-lg pt-4 pr-4 pb-4 pl-4 overflow-hidden">
                    <div className="flex items-center justify-between pb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="m18 16 4-4-4-4"></path>
                          <path d="m6 8-4 4 4 4"></path>
                          <path d="m14.5 4-5 16"></path>
                        </svg>
                        API example
                      </div>
                      <span className="text-[10px] text-emerald-400/90 bg-emerald-400/10 px-2 py-0.5 rounded">TypeScript</span>
                    </div>
                    <pre className="text-[12px] leading-relaxed text-slate-300">
                      <code>
                        <span className="text-violet-300">import</span> {'{ '}<span className="text-sky-300">client</span>{' } '}<span className="text-violet-300">from</span> <span className="text-emerald-300">"@axiom/sdk"</span>;
                        {`\n\n`}
                        <span className="text-violet-300">const</span> <span className="text-sky-300">res</span> = <span className="text-violet-300">await</span> <span className="text-sky-300">client</span>.<span className="text-amber-300">projects</span>.<span className="text-amber-300">create</span>({'{'}\n
                        {'  '}<span className="text-sky-300">name</span>: <span className="text-emerald-300">"my-app"</span>,\n
                        {'  '}<span className="text-sky-300">region</span>: <span className="text-emerald-300">"global"</span>,\n
                        {'}'});\n\n
                        <span className="text-sky-300">console</span>.<span className="text-amber-300">log</span>(<span className="text-sky-300">res</span>.<span className="text-amber-300">url</span>);
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
            <div className="text-center text-xs text-slate-500 mb-5">Backed by teams who value speed and craft</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                <span className="tracking-tight text-sm font-medium">NX</span>
              </div>
              <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                <span className="tracking-tight text-sm font-medium">PRM</span>
              </div>
              <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                <span className="tracking-tight text-sm font-medium">LNT</span>
              </div>
              <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                <span className="tracking-tight text-sm font-medium">RST</span>
              </div>
              <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                <span className="tracking-tight text-sm font-medium">ARC</span>
              </div>
              <div className="flex items-center justify-center rounded-md border border-white/10 bg-white/2 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/4 transition-colors">
                <span className="tracking-tight text-sm font-medium">FLX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Workflows Section */}
      <section id="workflows" className="relative border-b border-white/10 z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row">
            
            {/* Sticky Left Side */}
            <div className="lg:w-1/2 lg:h-screen sticky top-0 flex flex-col justify-center py-12 lg:py-0 pr-0 lg:pr-20 border-r-0 lg:border-r border-white/10 z-20">
              <span className="text-xs uppercase tracking-widest text-blue-500 mb-4 font-mono">Process_Map</span>
              <h2 className="text-4xl md:text-6xl uppercase tracking-tighter mb-12">
                <GradientText
                  colors={["#00CED1", "#1E90FF", "#00CED1", "#1E90FF"]}
                  animationSpeed={3}
                  showBorder={false}
                  className="inline-block"
                >
                  Digital <br /> Protocol
                </GradientText>
              </h2>

              {/* Steps Navigation */}
              <div className="space-y-6 relative mb-12 hidden lg:block">
                <div className="group cursor-pointer flex items-center gap-6">
                  <div className="h-12 w-0.5 bg-neutral-800 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ${activeStep === 1 ? 'bg-white' : 'bg-neutral-800'}`}></div>
                  </div>
                  <div>
                    <h3 className={`text-lg uppercase tracking-widest transition-colors duration-500 ${activeStep === 1 ? 'text-white' : 'text-neutral-600'}`}>01 / Architecture</h3>
                    <p className="text-xs text-neutral-500 font-mono mt-1">Foundational analysis & strategy.</p>
                  </div>
                </div>
                <div className="group cursor-pointer flex items-center gap-6">
                  <div className="h-12 w-0.5 bg-neutral-800 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ${activeStep === 2 ? 'bg-white' : 'bg-neutral-800'}`}></div>
                  </div>
                  <div>
                    <h3 className={`text-lg uppercase tracking-widest transition-colors duration-500 ${activeStep === 2 ? 'text-white' : 'text-neutral-600'}`}>02 / Development</h3>
                    <p className="text-xs text-neutral-500 font-mono mt-1">Next.js application build.</p>
                  </div>
                </div>
                <div className="group cursor-pointer flex items-center gap-6">
                  <div className="h-12 w-0.5 bg-neutral-800 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ${activeStep === 3 ? 'bg-white' : 'bg-neutral-800'}`}></div>
                  </div>
                  <div>
                    <h3 className={`text-lg uppercase tracking-widest transition-colors duration-500 ${activeStep === 3 ? 'text-white' : 'text-neutral-600'}`}>03 / Scale</h3>
                    <p className="text-xs text-neutral-500 font-mono mt-1">SEO & Revenue Optimisation.</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Visual Display */}
              <div className="w-full aspect-video bg-neutral-900 border border-white/10 relative overflow-hidden rounded-lg hidden lg:block shadow-2xl">
                {/* Image 1 */}
                <div className={`absolute inset-0 flex items-center justify-center bg-[#080808] transition-all duration-700 ${activeStep === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <img src={webDevImage} alt="Technical Audit" className="w-full h-full object-cover" />
                </div>
                
                {/* Image 2 */}
                <div className={`absolute inset-0 flex items-center justify-center bg-[#080808] transition-all duration-700 ${activeStep === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <img src={uiUxImage} alt="Modern Development" className="w-full h-full object-cover" />
                </div>
                
                {/* Image 3 */}
                <div className={`absolute inset-0 flex items-center justify-center bg-[#080808] transition-all duration-700 ${activeStep === 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <img src={digitalMarketingImage} alt="Growth" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Scrolling Right Side */}
            <div className="lg:w-1/2">
              <div className="h-[10vh] hidden lg:block"></div>
              
              <div className="min-h-[80vh] flex flex-col justify-center px-0 lg:px-20 py-20 border-b border-white/10 lg:border-b-0 workflow-step-content" data-step="1">
                <span className="text-xs font-mono text-neutral-600 mb-2">PHASE_01</span>
                <h3 className="text-3xl text-white mb-6 tracking-tight">Technical Audit & Architecture</h3>
                <div className="w-full aspect-video bg-neutral-900 border border-white/10 relative overflow-hidden rounded-lg mb-8 flex lg:hidden items-center justify-center">
                  <img src={webDevImage} alt="Technical Audit" className="w-full h-full object-cover" />
                </div>
                <p className="text-neutral-400 leading-relaxed mb-8">
                  Before code touches screen, we map your digital ecosystem. We analyse site structure, keyword gaps, and competitor velocity.
                </p>
                <ul className="space-y-4 text-sm text-neutral-300 font-mono">
                  <li className="flex items-center gap-3">
                    <span className="text-purple-500">✓</span> Site Architecture Mapping
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-neutral-600">✓</span> Competitor Analysis
                  </li>
                </ul>
              </div>

              <div className="min-h-[80vh] flex flex-col justify-center px-0 lg:px-20 py-20 border-b border-white/10 lg:border-b-0 workflow-step-content" data-step="2">
                <span className="text-xs font-mono text-neutral-600 mb-2">PHASE_02</span>
                <h3 className="text-3xl text-white mb-6 tracking-tight">Modern Development</h3>
                <div className="w-full aspect-video bg-neutral-900 border border-white/10 relative overflow-hidden rounded-lg mb-8 flex lg:hidden items-center justify-center">
                  <img src={uiUxImage} alt="Modern Development" className="w-full h-full object-cover" />
                </div>
                <p className="text-neutral-400 leading-relaxed mb-8">
                  We engineer bespoke web applications using modern frameworks (Next.js, React) ensuring lightning-fast load times.
                </p>
                <ul className="space-y-4 text-sm text-neutral-300 font-mono">
                  <li className="flex items-center gap-3">
                    <span className="text-blue-500">✓</span> Modern Stack (Next.js)
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-neutral-600">✓</span> Core Web Vitals Optimisation
                  </li>
                </ul>
              </div>

              <div className="min-h-[80vh] flex flex-col justify-center px-0 lg:px-20 py-20 workflow-step-content" data-step="3">
                <span className="text-xs font-mono text-neutral-600 mb-2">PHASE_03</span>
                <h3 className="text-3xl text-white mb-6 tracking-tight">Search & Revenue Growth</h3>
                <div className="w-full aspect-video bg-neutral-900 border border-white/10 relative overflow-hidden rounded-lg mb-8 flex lg:hidden items-center justify-center">
                  <img src={digitalMarketingImage} alt="Growth" className="w-full h-full object-cover" />
                </div>
                <p className="text-neutral-400 leading-relaxed mb-8">
                  A beautiful site is useless if no one sees it. We deploy advanced on-page and off-page SEO strategies.
                </p>
                <ul className="space-y-4 text-sm text-neutral-300 font-mono">
                  <li className="flex items-center gap-3">
                    <span className="text-green-500">✓</span> Keyword Domination
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-neutral-600">✓</span> Conversion Rate Optimisation
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  );
};

export default Services;
