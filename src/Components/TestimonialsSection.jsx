import { TestimonialCard } from "./TestimonialCard";

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className = ""
}) {
  const firstRow = testimonials.slice(0, testimonials.length / 2);
  const secondRow = testimonials.slice(testimonials.length / 2);

  return (
    <section className={`bg-[#050515] text-white py-12 sm:py-24 md:py-32 px-4 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 sm:gap-8">
          <h2 className="max-w-[720px] text-4xl lg:text-6xl font-medium tracking-tight leading-tight text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            Trusted by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              {" "}
              Industry Leaders
            </span>
          </h2>
          <p className="text-md max-w-[600px] font-medium text-gray-400 sm:text-xl">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-6">
          <div className="group flex overflow-hidden p-2 gap-4 flex-row" style={{ '--duration': '200s', '--gap': '1rem' }}>
            <div className="flex shrink-0 justify-around gap-4 animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(8)].map((_, setIndex) => (
                firstRow.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050515]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#050515]" />
          </div>

          <div className="group flex overflow-hidden p-2 gap-4 flex-row" style={{ '--duration': '200s', '--gap': '1rem' }}>
            <div className="flex shrink-0 justify-around gap-4 flex-row group-hover:[animation-play-state:paused]" style={{ animation: 'marquee 200s linear infinite reverse' }}>
              {[...Array(8)].map((_, setIndex) => (
                secondRow.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`reverse-${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#050515]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#050515]" />
          </div>
        </div>
      </div>
    </section>
  );
}
