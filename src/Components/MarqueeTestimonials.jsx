import { TestimonialCard } from "./TestimonialCard";
import { motion } from "framer-motion";

export function MarqueeTestimonials({
  title,
  description,
  testimonials,
  className = "",
}) {
  const firstRow = testimonials.slice(0, testimonials.length / 2);
  const secondRow = testimonials.slice(testimonials.length / 2);

  return (
    <section
      className={`w-full text-white py-12 sm:py-24 md:py-32 ${className}`}
    >
      <div className="flex flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 sm:gap-8">
          <h2
            className="max-w-[720px] text-4xl lg:text-6xl font-medium tracking-tight text-white overflow-hidden"
            style={{ fontFamily: "Poppins, sans-serif", lineHeight: "0.95" }}
          >
            {"Trusted by Industry Leaders".split(" ").map((word, index) => (
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
          <p className="text-md max-w-[600px] font-medium text-gray-400 sm:text-xl overflow-hidden">
            {description.split(" ").map((word, index) => (
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
                    delay: index * 0.05,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  style={{ display: "inline-block" }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 gap-4 flex-row">
            <div className="flex shrink-0 gap-4 animate-marquee flex-row">
              {[...firstRow, ...firstRow, ...firstRow, ...firstRow].map(
                (testimonial, i) => (
                  <TestimonialCard key={`first-${i}`} {...testimonial} />
                ),
              )}
            </div>
          </div>

          <div className="group flex overflow-hidden p-2 gap-4 flex-row mt-6">
            <div className="flex shrink-0 gap-4 animate-marquee-reverse flex-row">
              {[...secondRow, ...secondRow, ...secondRow, ...secondRow].map(
                (testimonial, i) => (
                  <TestimonialCard key={`second-${i}`} {...testimonial} />
                ),
              )}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#050515]" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#050515]" />
        </div>
      </div>
    </section>
  );
}
