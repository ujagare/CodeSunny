import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  MessageCircle,
  Linkedin,
  Github,
} from "lucide-react";
import { FooterBackgroundGradient, TextHoverEffect } from "./HoverFooter";
import GradientText from "./GradientText";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 },
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);
  const footerLinks = [
    {
      title: "About Us",
      links: [
        { label: "Company History", href: "#" },
        { label: "Meet the Team", href: "#" },
        { label: "Our Mission", href: "#" },
        { label: "Careers", href: "#" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Web Development", href: "#" },
        { label: "Mobile Apps", href: "#" },
        { label: "UI/UX Design", href: "#" },
        { label: "Digital Marketing", href: "#" },
      ],
    },
    {
      title: "Helpful Links",
      links: [
        { label: "FAQs", href: "#" },
        { label: "Support", href: "#" },
        {
          label: "Live Chat",
          href: "#",
          pulse: true,
        },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-[#00CED1]" />,
      text: "info@codesunny.in",
      href: "mailto:info@codesunny.in",
    },
    {
      icon: <Phone size={18} className="text-[#00CED1]" />,
      text: "+91 8975805789",
      href: "tel:+918975805789",
    },
    {
      icon: <MapPin size={18} className="text-[#00CED1]" />,
      text: "India",
    },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, label: "Facebook", href: "#" },
    { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
    { icon: <MessageCircle size={20} />, label: "WhatsApp", href: "#" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "#" },
    { icon: <Github size={20} />, label: "Github", href: "#" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative h-fit rounded-3xl m-4 md:m-8 mb-0 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto p-6 md:p-14 z-40 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-8 lg:gap-16 pb-8 md:pb-12">
          {/* Brand section */}
          <div className="flex flex-col -mt-2 md:-mt-6">
            <img
              src="/src/assets/images/Logo.png"
              alt="CodeSunny Logo"
              className="w-24 h-24 md:w-32 md:h-32 object-contain mb-0"
            />
            <p className="text-sm leading-relaxed text-white mb-4">
              Innovative solutions for digital growth.
            </p>
            {/* Social icons */}
            <div className="flex space-x-4 text-white">
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="hover:text-[#00CED1] transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* About & Services - Side by Side */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-2">
            {footerLinks.slice(0, 2).map((section) => (
              <div key={section.title}>
                <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-left md:text-left">
                  <span className="text-white">{section.title}</span>
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label} className="relative">
                      <a
                        href={link.href}
                        className="text-white hover:text-[#00CED1] transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                      {link.pulse && (
                        <span className="absolute top-0 right-[-10px] w-2 h-2 rounded-full bg-[#00CED1] animate-pulse"></span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Helpful Links & Contact - Side by Side */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-2">
            {/* Helpful Links */}
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-left md:text-left">
                <span className="text-white">{footerLinks[2].title}</span>
              </h4>
              <ul className="space-y-2 md:space-y-3">
                {footerLinks[2].links.map((link) => (
                  <li key={link.label} className="relative">
                    <a
                      href={link.href}
                      className="text-white hover:text-[#00CED1] transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                    {link.pulse && (
                      <span className="absolute top-0 right-[-10px] w-2 h-2 rounded-full bg-[#00CED1] animate-pulse"></span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact section */}
            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-left md:text-left">
                <span className="text-white">Contact Us</span>
              </h4>
              <ul className="space-y-3 md:space-y-4">
                {contactInfo.map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    {item.icon}
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white hover:text-[#00CED1] transition-colors text-sm"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-white hover:text-[#00CED1] transition-colors text-sm">
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row justify-center items-center text-sm">
          {/* Copyright */}
          <p className="text-center text-white">
            &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

export default Footer;
