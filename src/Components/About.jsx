import React from "react";
import Navbar from "./Navbar";
import StaggeredMenu from "./StaggeredMenu/StaggeredMenu";
import HeroSection from "./sections/hero";
import BrandVideo from "./sections/brand-video";
import AboutVision from "./sections/about-vision";
import TrainingPrograms from "./sections/training-programs";
import Leaders from "./sections/leaders";
import SocialContact from "./sections/social-contact";

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

const About = () => {
  return (
    <div className="w-full bg-[#050515] relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-transparent pointer-events-none"></div>
      <div className="relative z-10">
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar />
      </div>
      
      {/* Mobile Logo */}
      <div className="md:hidden fixed top-0 left-0 z-40 px-4 py-4 bg-gradient-to-r from-[#000000] to-[#0a0a2e]">
        <img 
          src={new URL('../assets/images/Logo.png', import.meta.url).href}
          alt="CodeSunny Logo" 
          className="w-16 h-16 object-contain"
        />
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
      
      <HeroSection />
      <BrandVideo />
      <AboutVision />
      <TrainingPrograms />
      <Leaders />
      <SocialContact />
      </div>
    </div>
  );
};

export default About;
