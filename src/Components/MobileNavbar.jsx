import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import logoImage from "../assets/images/1.png";
import LightRays from "./LightRays";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { title: "Home", href: "/" },
    { title: "Services", href: "/services" },
    { title: "Projects", href: "/projects" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Mobile Logo */}
      <div className="fixed top-8 left-8 z-[90]">
        <img
          src={logoImage}
          alt="CodeSunny Logo"
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-8 right-8 z-[90] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 group ${
          scrolled
            ? "bg-black text-white"
            : "bg-[#050515] text-white border border-white/20"
        }`}
      >
        <div className="relative w-6 h-4 flex flex-col justify-between items-end">
          <span className="w-full h-[2px] bg-current transition-all duration-300 group-hover:w-1/2" />
          <span className="w-3/4 h-[2px] bg-current transition-all duration-300 group-hover:w-full" />
        </div>
      </button>

      {/* Fullscreen Menu */}
      <div
        className={`fixed inset-0 z-[100] bg-[#050515] text-white transition-all duration-700 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* LightRays Background Effect */}
        <div className="absolute inset-0 w-full h-full">
          <LightRays
            raysOrigin="top-center"
            raysColor="#667fff"
            raysSpeed={1}
            lightSpread={1.1}
            rayLength={2.3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.02}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={2}
            saturation={1}
          />
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-8 right-8 w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors duration-300 z-50"
        >
          <X size={24} />
        </button>

        {/* Logo in fullscreen menu */}
        <div className="absolute top-8 left-8 z-50">
          <img
            src={logoImage}
            alt="CodeSunny Logo"
            className="w-12 h-12 object-contain"
          />
        </div>

        <div className="h-full flex flex-col justify-center px-8 md:px-[120px] max-w-[1440px] mx-auto relative z-20">
          <nav className="flex flex-col gap-4">
            {links.map((link, idx) => (
              <Link
                key={link.title}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="group w-fit"
              >
                <span
                  className="block text-[clamp(3rem,10vw,8rem)] font-medium leading-none tracking-tighter transition-transform duration-500 group-hover:translate-x-4"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  {link.title}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
            <div>
              <p className="text-white/40 text-sm uppercase tracking-widest mb-4">
                Contact
              </p>
              <a
                href="mailto:info@codesunny.in"
                className="text-2xl hover:text-white/60 transition-colors block mb-4"
              >
                info@codesunny.in
              </a>
              <a
                href="tel:+918975805789"
                className="text-xl hover:text-white/60 transition-colors block"
              >
                +91 8975805789
              </a>
            </div>
            <div className="flex gap-8 items-end justify-end">
              {["Instagram", "Twitter", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-white/40 hover:text-white transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
