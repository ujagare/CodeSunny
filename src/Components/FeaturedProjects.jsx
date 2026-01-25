import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const projects = [
  {
    id: "puntopago",
    title: "Punto Pago",
    description: "The First Super-App in Latin America",
    imageUrl:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/5a18055b-361a-4f0d-a52c-8382a9793952-cuberto-com/assets/images/cover-1.jpg",
    videoUrl: "https://cuberto.com/assets/projects/puntopago/cover.mp4",
    link: "#",
    size: "lg",
  },
  {
    id: "kzero",
    title: "Kelvin Zero",
    description: "A digital product for passwordless authentication",
    imageUrl:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/5a18055b-361a-4f0d-a52c-8382a9793952-cuberto-com/assets/images/cover-7.jpg",
    videoUrl: "https://cuberto.com/assets/projects/kzero/cover.mp4",
    link: "#",
    size: "lg",
  },
  {
    id: "daoway",
    title: "DaoWay",
    description: "Astrology planner app: plan, achieve, thrive",
    imageUrl:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/5a18055b-361a-4f0d-a52c-8382a9793952-cuberto-com/assets/images/cover-2.jpg",
    videoUrl: "https://cuberto.com/assets/projects/daoway/cover.mp4",
    link: "#",
    size: "sm",
  },
  {
    id: "magma",
    title: "Magma",
    description: "The ultimate tool for building in the Web3 era",
    imageUrl:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/5a18055b-361a-4f0d-a52c-8382a9793952-cuberto-com/assets/images/cover-8.jpg",
    videoUrl: "https://cuberto.com/assets/projects/magma/cover.mp4",
    link: "#",
    size: "lg",
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
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-900 transition-transform duration-700">
          <div className="absolute inset-0 h-full w-full transition-opacity duration-500">
            <img
              src={project.imageUrl}
              alt={project.description}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          <div
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 parallax-video-container ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            data-parallax-video
          >
            <video
              ref={videoRef}
              src={project.videoUrl}
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-6 text-lg text-white">
          <b className="font-medium">{project.title}</b> – {project.description}
        </div>
      </a>
    </div>
  );
};

export default function FeaturedProjects() {
  const leftColumnProjects = [projects[0], projects[2]];
  const rightColumnProjects = [projects[1], projects[3]];

  return (
    <section className="text-white py-20">
      <div className="container mx-auto max-w-6xl px-8">
        <div className="mb-20">
          <h1
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
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
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
            href="#"
            className="inline-flex h-32 w-32 md:h-44 md:w-44 items-center justify-center rounded-full border border-gray-600 hover:bg-white transition-all duration-300 group"
          >
            <span className="text-sm uppercase tracking-widest text-white group-hover:text-black transition-colors">
              View all
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
