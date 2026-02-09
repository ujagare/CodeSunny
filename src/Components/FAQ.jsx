import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What services does CodeSunny offer?",
      answer: "We offer comprehensive web development services including frontend and backend development, UI/UX design, digital marketing, e-commerce solutions, SEO optimization, and cloud hosting services."
    },
    {
      question: "How long does it take to complete a project?",
      answer: "Project timelines vary based on complexity and requirements. A typical website takes 4-8 weeks, while larger applications may take 3-6 months. We provide detailed timelines during our initial consultation."
    },
    {
      question: "What technologies do you use?",
      answer: "We work with modern technologies including React, Next.js, Node.js, Express, MongoDB, PostgreSQL, AWS, Azure, and more. We choose the best tech stack based on your project requirements."
    },
    {
      question: "Do you provide ongoing support after project completion?",
      answer: "Yes! We offer maintenance packages and ongoing support to ensure your website or application runs smoothly. This includes updates, bug fixes, and technical assistance."
    },
    {
      question: "What is your pricing structure?",
      answer: "Our pricing is project-based and depends on scope, complexity, and timeline. We provide transparent quotes after understanding your requirements. Contact us for a free consultation and estimate."
    },
    {
      question: "Can you help with SEO and digital marketing?",
      answer: "Absolutely! We provide comprehensive SEO optimization, social media marketing, content strategy, and paid advertising campaigns to boost your online presence and drive traffic."
    },
    {
      question: "Do you work with startups and small businesses?",
      answer: "Yes! We work with businesses of all sizes, from startups to enterprises. We offer flexible solutions and packages tailored to your budget and growth stage."
    },
    {
      question: "How do we get started?",
      answer: "Simply contact us through our website or email. We'll schedule a free consultation to discuss your project, understand your goals, and provide a detailed proposal with timeline and pricing."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h2 
          className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-4 text-center"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-400 text-center mb-12 text-lg">
          Got questions? We've got answers.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border border-zinc-800 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm transition-all duration-300 hover:border-blue-500/50"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className={`font-medium text-lg pr-4 transition-colors ${
                  openIndex === index ? 'text-white' : 'text-gray-400'
                }`}>
                  {faq.question}
                </span>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <ChevronDown 
                    className={`w-5 h-5 text-blue-400 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 text-zinc-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
