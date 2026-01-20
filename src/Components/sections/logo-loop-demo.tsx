"use client";

import LogoLoop from '@/components/ui/LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss } from 'react-icons/si';

const techLogos = [
  { node: <SiReact className="text-gray-500" />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs className="text-gray-500" />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript className="text-gray-500" />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss className="text-gray-500" />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

export function LogoLoopDemo() {
  return (
    <section className="w-full bg-[#EFEFEF] py-[120px] px-[5vw]">
      <div className="mb-[80px]">
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '38px', fontWeight: 500, color: '#000000' }} className="uppercase inline-block border-b border-black pb-1">
          TRUSTED BY
        </h2>
      </div>
      <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}}>
        <LogoLoop
          logos={techLogos}
          speed={120}
          direction="left"
          logoHeight={48}
          gap={150}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#EFEFEF"
          ariaLabel="Technology partners"
        />
      </div>
    </section>
  );
}
