export function TestimonialCard({ author, text, href, className = "" }) {
  const Card = href ? 'a' : 'div';
  
  return (
    <Card
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`flex flex-col rounded-lg border border-blue-500/30 bg-gradient-to-b from-blue-500/10 to-transparent p-6 max-w-[320px] hover:from-blue-500/20 hover:to-blue-500/5 transition-colors duration-300 ${className}`}
    >
      <div className="flex items-center gap-3">
        <img 
          src={author.avatar} 
          alt={author.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none text-white">
            {author.name}
          </h3>
          <p className="text-sm text-gray-400">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-300">
        {text}
      </p>
    </Card>
  );
}
