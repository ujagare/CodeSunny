export function TestimonialCard({ author, text, href, className = "" }) {
  const Card = href ? "a" : "div";

  return (
    <Card
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`flex flex-col rounded-lg border border-blue-500/30 bg-gradient-to-b from-blue-500/10 to-transparent p-3 md:p-6 max-w-[240px] md:max-w-[320px] hover:from-blue-500/20 hover:to-blue-500/5 transition-colors duration-300 ${className}`}
    >
      <div className="flex items-center gap-2 md:gap-3">
        <img
          src={author.avatar}
          alt={`${author.name} - testimonial author`}
          loading="lazy"
          className="h-8 w-8 md:h-12 md:w-12 rounded-full object-cover"
        />
        <div className="flex flex-col items-start">
          <h3 className="text-sm md:text-md font-semibold leading-none text-white">
            {author.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-400">{author.handle}</p>
        </div>
      </div>
      <p className="mt-3 md:mt-4 text-xs md:text-sm text-gray-300">{text}</p>
    </Card>
  );
}
