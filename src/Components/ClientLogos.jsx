import React from "react";
import { motion } from "framer-motion";

// Import logos
import alfa from "../assets/images/clint logos/white logo/alfa.png";
import greenspacess from "../assets/images/clint logos/white logo/greenspacess.png";
import landwise from "../assets/images/clint logos/white logo/land wise.png";
import oasis from "../assets/images/clint logos/white logo/oasis.png";
import satvik from "../assets/images/clint logos/white logo/satvik.png";
import swadist from "../assets/images/clint logos/white logo/swadist.png";
import vibha from "../assets/images/clint logos/white logo/vibha.png";
import sundownLogo from "../assets/images/clint logos/64d3dd9edfb41666c35b15c2_Sundown logo.svg";
import logoSvg from "../assets/images/clint logos/logo.svg";

const ClientLogos = () => {
  const sectionStyle = {
    background: "transparent",
  };
  const logos = [
    { id: 1, src: alfa, alt: "Alfa" },
    { id: 2, src: greenspacess, alt: "Greenspacess" },
    { id: 3, src: landwise, alt: "Landwise" },
    { id: 4, src: oasis, alt: "Oasis" },
    { id: 5, src: satvik, alt: "Satvik" },
    { id: 6, src: swadist, alt: "Swadist" },
    { id: 7, src: vibha, alt: "Vibha" },
    {
      id: 8,
      src: sundownLogo,
      alt: "Sundown",
      isSvg: true,
      hideOnMobile: true,
    },
    { id: 9, src: logoSvg, alt: "Logo", isSvg: true },
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-8" style={sectionStyle}>
      <div className="max-w-7xl mx-auto bg-transparent">
        {/* Heading */}
        <div className="mb-16 md:mb-20">
          <h1
            className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-medium text-white leading-tight capitalize overflow-hidden"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              color: "#FFFFFF",
              textAlign: "left",
            }}
          >
            {"Global clients".split(" ").map((word, index) => (
              <span
                key={index}
                className="inline-block overflow-hidden"
                style={{ marginRight: "0.3em" }}
              >
                <motion.span
                  initial={{ opacity: 0, y: "100%" }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16 lg:gap-20 items-center justify-items-center bg-transparent">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex items-center justify-center h-24 md:h-28 ${
                logo.hideOnMobile ? "hidden md:flex" : ""
              }`}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={`max-h-full max-w-full object-contain transition-all duration-300 bg-transparent ${
                  logo.isSvg
                    ? "brightness-0 invert"
                    : "filter grayscale hover:grayscale-0"
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
