import React from "react";
import TutorialCard from "./TutorialCard";

import alfanioImg from "@/assets/images/clint projects/Alfanio.png";
import duostudioImg from "@/assets/images/clint projects/Duostudio.png";
import ecommerceImg from "@/assets/images/clint projects/Ecommerce.png";
import greenspacessImg from "@/assets/images/clint projects/Greenspacess.png";
import landwiseImg from "@/assets/images/clint projects/Landwise.png";
import oasisImg from "@/assets/images/clint projects/Oasisi.png";
import obysImg from "@/assets/images/clint projects/obys.png";
import satvikImg from "@/assets/images/clint projects/satvikvilla.png";
import sundownImg from "@/assets/images/clint projects/sundown .png";
import twogoodImg from "@/assets/images/clint projects/Twogood.png";
import whitewingsImg from "@/assets/images/clint projects/whitewings.png";

const tutorials = [
  {
    title: "Alfanio",
    thumbnail: alfanioImg,
    link: "https://alfanio.com/",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "Alfanio",
    tagline: "Project",
  },
  {
    title: "Satvik Villa Baner",
    thumbnail: satvikImg,
    link: "https://www.satvikvillabaner.com/",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "Satvik Villa",
    tagline: "Project",
  },
  {
    title: "White Wings Visa",
    thumbnail: whitewingsImg,
    link: "https://whitewingsvisa.com/",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "White Wings",
    tagline: "Project",
  },
  {
    title: "Landwise Solutions",
    thumbnail: landwiseImg,
    link: "https://www.landwisesolutions.in/",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "Landwise",
    tagline: "Project",
  },
  {
    title: "Oasis Tours & Travels",
    thumbnail: oasisImg,
    link: "https://ujagare.github.io/Oasis-Tours-Travels/",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "Oasis Tours",
    tagline: "Project",
  },
  {
    title: "Greenspacess",
    thumbnail: greenspacessImg,
    link: "#",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "Greenspacess",
    tagline: "Project",
  },
  {
    title: "Duostudio",
    thumbnail: duostudioImg,
    link: "https://ujagare.github.io/Duo-Studio/",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "Duostudio",
    tagline: "Project",
  },
  {
    title: "Sundown",
    thumbnail: sundownImg,
    link: "https://ujagare.github.io/Sundown-Studio/",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "Sundown",
    tagline: "Project",
  },
  {
    title: "Two Good",
    thumbnail: twogoodImg,
    link: "https://ujagare.github.io/Two-Good/",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "Two Good",
    tagline: "Project",
  },
  {
    title: "Obys",
    thumbnail: obysImg,
    link: "https://ujagare.github.io/obys-agenc/",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "Obys",
    tagline: "Project",
  },
  {
    title: "Ecommerce",
    thumbnail: ecommerceImg,
    link: "#",
    schoolName: "CODESUNNY",
    subtitle: "Client",
    techName: "Ecommerce",
    tagline: "Project",
  },
];

const TutorialMarquee = () => {
  const mid = Math.ceil(tutorials.length / 2);
  const topRow = tutorials.slice(0, mid);
  const bottomRow = tutorials.slice(mid);

  return (
    <section className="py-10 md:py-12 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white">
            Client Projects
          </h2>
        </div>
      </div>
      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-[#050515] via-[#050515]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-[#050515] via-[#050515]/80 to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-6">
          <div className="flex w-max gap-3 md:gap-6 animate-marquee hover:[animation-play-state:paused]">
            {[...topRow, ...topRow].map((tutorial, index) => (
              <TutorialCard
                key={`top-${index}`}
                {...tutorial}
                label={`${tutorial.title} Live Project`}
              />
            ))}
          </div>
          <div className="flex w-max gap-3 md:gap-6 animate-marquee-reverse hover:[animation-play-state:paused]">
            {[...bottomRow, ...bottomRow].map((tutorial, index) => (
              <TutorialCard
                key={`bottom-${index}`}
                {...tutorial}
                label={`${tutorial.title} Clone`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorialMarquee;
