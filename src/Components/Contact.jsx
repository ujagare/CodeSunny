import React from 'react'
import Navbar from "./Navbar";
import StaggeredMenu from "./StaggeredMenu/StaggeredMenu";
import Footer from "./Footer";
import GradientText from "./GradientText";
import webDevImage from '../assets/images/web-development.png';
import uiUxImage from '../assets/images/ui-ux-design.png';
import digitalMarketingImage from '../assets/images/digital-marketing.png';
import seoImage from '../assets/images/seo-optimization.png';

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

const Contact = () => {

  return (
    <div className="w-full overflow-x-hidden bg-[#050515] relative">
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

      <section className="w-full pt-32 md:pt-6 px-4 pb-6">
        <div className="overflow-hidden ring-1 ring-black/5 bg-white/70 rounded-2xl mx-auto" style={{backdropFilter: 'blur(8px)'}}>
          <div className="md:p-8 ring-white/10 text-white bg-black bg-[url(https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/f6fde9e4-e981-4763-98e7-63ee9ff8d84f_1600w.jpg)] bg-cover pt-6 px-6 pb-6" style={{backgroundColor: 'rgb(0, 0, 0)', color: 'rgb(230, 238, 248)', backdropFilter: 'blur(8px)'}}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-black tracking-tight text-sm font-semibold">CS</div>
                <div className="text-sm text-white/80">CodeSunny • Digital Solutions</div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 ring-1 ring-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M12 7v14"></path>
                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                  </svg>
                  <span className="text-sm font-medium">Docs</span>
                </button>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="m10 17 5-5-5-5"></path>
                    <path d="M15 12H3"></path>
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  </svg>
                  <span className="text-sm font-medium">Get Started</span>
                </button>
              </div>
            </div>

            <div className="max-w-2xl text-center mt-12 mx-auto mb-12">
              <h1 className="sm:text-4xl md:text-5xl text-3xl font-semibold text-white tracking-tight">Let's Build Something Amazing Together</h1>
              <p className="text-white/70 mt-3">Get in touch with us to discuss your project. We're here to help bring your ideas to life.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 px-4">
          <div className="relative">
            <img src={webDevImage} alt="Web Development" className="w-full h-36 object-cover rounded-xl ring-1 ring-black/5" />
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-sm font-medium">Web Development</div>
                <div className="text-xs opacity-80">Modern solutions</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img src={uiUxImage} alt="UI/UX Design" className="w-full h-36 object-cover rounded-xl ring-1 ring-black/5" />
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-sm font-medium">UI/UX Design</div>
                <div className="text-xs opacity-80">Beautiful interfaces</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img src={digitalMarketingImage} alt="Digital Marketing" className="w-full h-36 object-cover rounded-xl ring-1 ring-black/5" />
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-sm font-medium">Digital Marketing</div>
                <div className="text-xs opacity-80">Grow your business</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img src={seoImage} alt="SEO Optimization" className="w-full h-36 object-cover rounded-xl ring-1 ring-black/5" />
            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-sm font-medium">SEO Optimization</div>
                <div className="text-xs opacity-80">Rank higher</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="md:pt-40 bg-center z-[70] bg-cover pt-40 pb-40 relative" style={{maskImage: 'linear-gradient(90deg, transparent, black 55%, black 60%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, black 55%, black 60%, transparent)'}} id="contact">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 top-10 h-[70vh] w-[60vh] rounded-full blur-3xl opacity-25" style={{background: 'radial-gradient(closest-side, rgba(255,255,255,0.15), rgba(0,0,0,0))'}}></div>
        </div>

        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-neutral-100 animate-in">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M4 6l8 5 8-5"></path>
                <rect width="20" height="14" x="2" y="5" rx="2"></rect>
              </svg>
              Let's Work Together
            </span>
            <h2 className="mt-4 text-4xl sm:text-6xl tracking-tight font-semibold animate-in" data-delay="100">
              <GradientText
                colors={["#00CED1", "#1E90FF", "#00CED1", "#1E90FF"]}
                animationSpeed={3}
                showBorder={false}
                className="inline-block"
              >
                Ready to collaborate?
              </GradientText>
            </h2>
            <p className="mt-4 text-neutral-400 text-lg max-w-2xl mx-auto animate-in" data-delay="200">
              Whether you need help with product design, strategy, or education, I'm here to help bring your vision to life.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur animate-in" data-delay="300">
              <h3 className="text-xl font-semibold text-white mb-6">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
                    <input type="text" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
                    <input type="email" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Project Budget</label>
                  <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-neutral-100 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20">
                    <option>$5k - $10k</option>
                    <option>$10k - $25k</option>
                    <option>$25k - $50k</option>
                    <option>$50k+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Message</label>
                  <textarea rows="4" className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-neutral-100 placeholder-neutral-400 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20" placeholder="Tell me about your project..."></textarea>
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 border border-white/20 px-6 py-3 text-neutral-100 hover:bg-white/15 transition">
                  <span className="font-medium">Send Message</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                  </svg>
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur animate-in" data-delay="400">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 border-white/10 p-3 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                      <path d="M4 6l8 5 8-5"></path>
                      <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Email</h3>
                    <p className="text-neutral-400">hello@designer.com</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur animate-in" data-delay="500">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white/10 border-white/10 p-3 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
                      <path d="M8 2v4"></path>
                      <path d="M16 2v4"></path>
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M3 10h18"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Schedule a Call</h3>
                    <p className="text-neutral-400">Book a free consultation</p>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur animate-in" data-delay="600">
                <h3 className="text-lg font-semibold text-white mb-4">Follow Me</h3>
                <div className="flex items-center gap-4">
                  <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-neutral-400 hover:text-white hover:bg-white/15 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-neutral-400 hover:text-white hover:bg-white/15 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-neutral-400 hover:text-white hover:bg-white/15 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94"></path>
                      <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32"></path>
                      <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72"></path>
                    </svg>
                  </a>
                  <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-neutral-400 hover:text-white hover:bg-white/15 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-25 w-[60%] h-8" style={{background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 30%, transparent 70%)'}}></div>
          <div className="h-px bg-white/10 w-full"></div>
        </div>
      </section>

      <Footer />
      </div>
    </div>
  )
}

export default Contact