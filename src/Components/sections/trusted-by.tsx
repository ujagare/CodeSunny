import React from 'react';
import Image from 'next/image';

/**
 * TrustedBySection Component
 * 
 * Clones the "(TRUSTED BY)" section which consists of a horizontal marquee
 * or grid of partner/client logo placeholders as seen in the screenshots.
 * 
 * Styling is based on "Modern Brutalist" aesthetic: 
 * - High contrast (Grayscale)
 * - Meta label typography (14px, Uppercase, Medium)
 * - Minimalist alignment
 */

const logos = [
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/image_2026_SzE65DEYw5-3.png",
    alt: "Partner Logo 1",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/image_2027_4mwPHOpxnC-4.png",
    alt: "Partner Logo 2",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/image_2024_BCNKPVMvC2-5.png",
    alt: "Partner Logo 3",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/image_2023_F422nS5MW-6.png",
    alt: "Partner Logo 4",
  },
  {
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/image_2022_hW4xDTajV-8.png",
    alt: "Partner Logo 5",
  },
  {
    // Reusing first for better balance if needed, or keeping original set
    src: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/image_2026_SzE65DEYw5-3.png",
    alt: "Partner Logo 6",
  }
];

export default function TrustedBySection() {
  return (
    <section 
      className="py-[80px] md:py-[120px] bg-[#EFEFEF]"
      aria-labelledby="trusted-by-title"
    >
      <div className="container px-[5vw]">
        {/* Section Label */}
        <div className="mb-12 md:mb-16">
          <h2 
            id="trusted-by-title"
            className="font-meta text-[14px] font-medium uppercase tracking-[0.05em] text-[#000000]"
          >
            (TRUSTED BY)
          </h2>
        </div>

        {/* Logo Grid/Marquee Container */}
        <div className="flex flex-wrap items-center justify-between gap-y-12 md:gap-y-0 opacity-80">
          {logos.map((logo, index) => (
            <div 
              key={index} 
              className="w-1/2 sm:w-1/3 md:w-auto flex justify-center md:block"
            >
              <div className="relative h-[24px] w-[120px] md:w-[140px] grayscale transition-all duration-300 hover:grayscale-0">
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="object-left"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}