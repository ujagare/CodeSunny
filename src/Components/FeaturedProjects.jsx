import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

import alfanioLogo from "@/assets/images/Alfanio.png";
import satvikLogo from "@/assets/images/savik.png";
import visaLogo from "@/assets/images/whitewings.png";
import oasisLogo from "@/assets/images/Oasis.png";

import alfanioVideo from "@/assets/video/ALFANIO video.mp4";
import satvikVideo from "@/assets/video/satvikvilla.mp4";
import whitewingsVideo from "@/assets/video/whitewings.mp4";
import oasisVideo from "@/assets/video/Oasis tours and tavel .mp4";

const projects = [
  {
    id: "alfanio",
    title: "Alfanio",
    description: "Corporate brand website with a clean service-led layout.",
    imageUrl: alfanioLogo,
    videoUrl: alfanioVideo,
    link: "https://alfanio.com/",
  },
  {
    id: "satvik-villa-baner",
    title: "Satvik Villa Baner",
    description: "Luxury real-estate website focused on premium property views.",
    imageUrl: satvikLogo,
    videoUrl: satvikVideo,
    link: "https://www.satvikvillabaner.com/",
  },
  {
    id: "white-wings-visa",
    title: "White Wings Visa",
    description: "Lead-focused visa services site with clear conversion CTAs.",
    imageUrl: visaLogo,
    videoUrl: whitewingsVideo,
    link: "https://whitewingsvisa.com/",
  },
  {
    id: "oasis-tours",
    title: "Oasis Tours & Travels",
    description: "Travel services website with a clean booking-first structure.",
    imageUrl: oasisLogo,
    videoUrl: oasisVideo,
    link: "https://ujagare.github.io/Oasis-Tours-Travels/",
  },
];

const ProjectCard = ({ project }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="mb-20 last:mb-0">
      <a
        href={project.link}
        className="group block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="relative w-full max-w-[480px] aspect-[3/4] overflow-hidden rounded-3xl bg-gray-900 transition-transform duration-700 mx-auto md:mx-0"
          style={{ willChange: "auto" }}
        >
          <div className="absolute inset-0 h-full w-full transition-opacity duration-500">
            <img
              src={project.imageUrl}
              alt={`${project.title} - ${project.description}`}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{ objectPosition: "center bottom" }}
              data-no-parallax="true"
            />
          </div>

          <div
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 parallax-video-container ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            data-parallax-video
            data-no-parallax="true"
          >
            <video
              ref={videoRef}
              src={project.videoUrl}
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover block"
              style={{
                objectFit: "cover",
                objectPosition: "center top",
                transform: "scale(1.08)",
              }}
              aria-label={`${project.title} project video - ${project.description}`}
            />
          </div>
        </div>

        <div className="mt-6 text-lg text-white">
          <b className="font-medium">{project.title}</b> - {project.description}
        </div>
      </a>
    </div>
  );
};

export default function FeaturedProjects() {
  const leftColumnProjects = [projects[0], projects[2]];
  const rightColumnProjects = [projects[1], projects[3]];

  return (
    <section className="text-white py-20" style={{ willChange: "auto" }}>
      <div className="container mx-auto max-w-6xl px-8">
        <div className="mb-20">
          <h2
            className="text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-medium tracking-tight leading-tight text-left text-white overflow-hidden"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              color: "#FFFFFF",
              textAlign: "left",
              whiteSpace: "nowrap",
            }}
          >
            {"Featured projects".split(" ").map((word, index) => (
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
          </h2>
        </div>

        <div
          className="flex flex-col md:flex-row gap-12"
          style={{ willChange: "auto" }}
        >
          <div className="flex-1">
            {leftColumnProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="flex-1 md:mt-40">
            {rightColumnProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <div className="mt-20 flex justify-center">
          <a
            href="/contact"
            className="inline-flex h-32 w-32 md:h-44 md:w-44 items-center justify-center rounded-full border border-gray-600 hover:bg-white transition-all duration-300 group hover:scale-105 hover:shadow-[0_0_26px_rgba(34,211,238,0.6)]"
            aria-label="Start a project with CodeSunny"
          >
            <span className="text-sm uppercase tracking-widest text-white group-hover:text-black transition-colors">
              Start a project
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
