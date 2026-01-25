import React, { useEffect } from "react";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import HeroSection from "./sections/hero";
import Showreel from "./Showreel";
import AboutSummary from "./AboutSummary";
import TrainingPrograms from "./sections/training-programs";
import Leaders from "./sections/leaders";
import SocialContact from "./sections/social-contact";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="w-full bg-[#050515] relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-transparent pointer-events-none"></div>
      <div className="relative z-10">
        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <Navbar />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNavbar />
        </div>

        <HeroSection />
        <Showreel />
        <AboutSummary />
        <TrainingPrograms />
        <Leaders />
        <SocialContact />
      </div>
    </div>
  );
};

export default About;
