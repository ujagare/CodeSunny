import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiMongodb, SiPostgresql, SiDocker } from 'react-icons/si';

const techLogos = [
  { node: <SiReact />, title: "React" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiTypescript />, title: "TypeScript" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
  { node: <SiNodedotjs />, title: "Node.js" },
  { node: <SiMongodb />, title: "MongoDB" },
  { node: <SiPostgresql />, title: "PostgreSQL" },
  { node: <SiDocker />, title: "Docker" },
];

export function LogoLoopDemo() {
  return (
    <div className="w-full py-0 md:py-32">
      <div className="pl-[1vw] pr-[3vw] md:pl-[1vw] md:pr-[5vw] mb-24 mt-12 md:mt-0">
        <h2 style={{ 
          fontFamily: 'Poppins', 
          fontSize: 'clamp(24px, 5vw, 38px)', 
          fontWeight: 500, 
          background: 'linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'gradient 3s linear infinite',
          textAlign: 'left' 
        }}>
          (TRUSTED BY)
        </h2>
      </div>
      
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div 
          style={{
            display: 'flex',
            gap: 'clamp(60px, 15vw, 120px)',
            animation: 'scroll 20s linear infinite',
            width: 'max-content'
          }}
        >
          {[...techLogos, ...techLogos, ...techLogos].map((logo, index) => (
            <div 
              key={index}
              style={{
                fontSize: 'clamp(40px, 10vw, 64px)',
                color: '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              {logo.node}
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}

export default LogoLoopDemo;
