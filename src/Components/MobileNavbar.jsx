import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/1.png";
import { X } from "lucide-react";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const links = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* Logo - Fixed on left side */}
      <Link
        to="/"
        className="fixed top-6 left-6 z-[1001] md:hidden"
        aria-label="CodeSunny Home"
      >
        <img
          src={logo}
          alt="CodeSunny Logo"
          className="w-10 h-10 object-contain rounded-lg"
        />
      </Link>

      {/* Menu Button - Animated Hamburger to Cross */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center md:hidden z-[1001] transition-all duration-300"
        style={{
          background: "linear-gradient(135deg, #000000 0%, #1a1a3e 100%)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
        }}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="w-5 h-4 flex flex-col justify-center items-center relative">
          {/* Top line */}
          <span
            className={`w-full h-[2px] bg-white absolute transition-all duration-300 ease-in-out ${
              isOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "top-0"
            }`}
          />
          {/* Bottom line */}
          <span
            className={`h-[2px] bg-white absolute transition-all duration-300 ease-in-out ${
              isOpen
                ? "w-full -rotate-45 top-1/2 -translate-y-1/2"
                : "w-3/4 top-full -translate-y-full right-0"
            }`}
          />
        </div>
      </button>

      {/* Fullscreen Menu */}
      <div
        className="fixed inset-0 text-white z-[1000]"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #0a0a2e 50%, #1a1a3e 100%)",
          transform: isOpen ? "translateY(0)" : "translateY(-100%)",
          opacity: isOpen ? 1 : 0,
          transition:
            "transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease-out",
        }}
      >
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent opacity-50"></div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>

        {/* Menu Content */}
        <div className="h-full flex flex-col justify-center px-8 relative z-10 -mt-16">
          <nav className="flex flex-col gap-6">
            {links.map((link, index) => (
              <Link
                key={link.title}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="text-5xl font-medium hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2"
                style={{
                  animation: isOpen
                    ? `slideInRight 0.5s ease-out ${index * 0.1}s both`
                    : "none",
                }}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Contact Info */}
          <div
            className="mt-16 pt-8 border-t border-white/20"
            style={{
              animation: isOpen
                ? "slideInRight 0.5s ease-out 0.4s both"
                : "none",
            }}
          >
            <p className="text-white/50 text-xs uppercase mb-3 tracking-wider">
              Contact
            </p>
            <a
              href="mailto:info@codesunny.com"
              className="text-lg hover:text-blue-400 transition-colors block mb-2"
            >
              info@codesunny.com
            </a>
            <a
              href="tel:+919876543210"
              className="text-lg hover:text-blue-400 transition-colors block"
            >
              +91 98765 43210
            </a>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default MobileNavbar;
