import React, { useEffect } from "react";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import HeroSection from "./sections/hero";
import Showreel from "./Showreel";
import AboutSummary from "./AboutSummary";
import TrainingPrograms from "./sections/training-programs";
import Leaders from "./sections/leaders";
import SocialContact from "./sections/social-contact";
import MetaTags from "./MetaTags";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <MetaTags
        title="About CodeSunny - Web Development & Digital Solutions"
        description="Learn about CodeSunny's mission, team, and expertise in web development, design, and digital marketing. Discover how we help businesses grow."
        keywords="about CodeSunny, web development team, digital agency, company mission, web developers"
        url="https://codesunny.com/about"
      />
      <div className="w-full bg-[#050515] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-transparent pointer-events-none"></div>
        <header className="fixed top-0 left-0 right-0 z-[1000]">
          {/* Desktop Navbar */}
          <nav className="hidden md:block">
            <Navbar />
          </nav>

          {/* Mobile Navigation */}
          <nav className="md:hidden">
            <MobileNavbar />
          </nav>
        </header>

        <div className="relative pt-20">
          <section aria-labelledby="hero-heading">
            <h1 id="hero-heading" className="sr-only">
              About CodeSunny
            </h1>
            <HeroSection />
          </section>
          <section aria-labelledby="showreel-heading">
            <h2 id="showreel-heading" className="sr-only">
              Our Showreel
            </h2>
            <Showreel />
          </section>
          <section aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="sr-only">
              About Summary
            </h2>
            <AboutSummary />
          </section>
          <section aria-labelledby="training-heading">
            <h2 id="training-heading" className="sr-only">
              Training Programs
            </h2>
            <TrainingPrograms />
          </section>
          <section aria-labelledby="leaders-heading">
            <h2 id="leaders-heading" className="sr-only">
              Our Leaders
            </h2>
            <Leaders />
          </section>
          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="sr-only">
              Social Contact
            </h2>
            <SocialContact />
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
