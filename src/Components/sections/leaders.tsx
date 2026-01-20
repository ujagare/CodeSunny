import React from 'react';
import Image from 'next/image';

const Leaders = () => {
  const leaders = [
    {
      name: 'Harsh Sharma',
      role: 'FOUNDER & CEO',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/harshBhaiya_gIiC2DRXHp-10.png',
      width: 'w-full md:w-[48%]',
      height: 'aspect-[3/4]',
    },
    {
      name: 'Adarsh Gupta',
      role: 'MANAGING DIRECTOR & INSTR.',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/adarshBhaiya_gjPNHYWpm_-11.png',
      width: 'w-full md:w-[48%]',
      height: 'aspect-[1/1] md:aspect-[4/5]',
      alignSelf: 'self-end',
      marginTop: 'md:mt-40'
    },
    {
      name: 'Dhanesh Malviya',
      role: 'CHRO & INSTR.',
      image: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/dhaneshBhaiya_q5y-hoJ1-9-12.png',
      width: 'w-full md:w-[48%]',
      height: 'aspect-[3/4]',
    },
  ];

  return (
    <section className="bg-[#1C1C1C] text-white pt-[120px] pb-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-full">
        {/* Section Header */}
        <div className="mb-20">
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '133px', fontWeight: 500, color: '#FFFFFF', paddingBottom: '16px' }} className="uppercase tracking-tighter leading-[0.9] border-b border-white inline-block w-full">
            OUR LEADERS*
          </h2>
        </div>

        {/* Leaders Grid - Manual layout to match the asymmetrical design */}
        <div className="flex flex-col gap-24">
          {/* First Row: Harsh (Left) and Adarsh (Right offset) */}
          <div className="flex flex-col md:flex-row justify-between items-start">
            {/* Harsh Sharma */}
            <div className="w-full md:w-[48%] mb-20 md:mb-0">
              <div className="relative aspect-[3/4] w-full border border-white/20 mb-6">
                <Image
                  src={leaders[0].image}
                  alt={leaders[0].name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="flex justify-between items-end border-b border-white/30" style={{ paddingBottom: '16px' }}>
                <h3 style={{ fontFamily: 'Poppins', fontSize: '28.5px', fontWeight: 300, color: '#FFFFFF' }} className="uppercase">{leaders[0].name}</h3>
                <span style={{ fontFamily: 'Poppins', fontSize: '28.5px', fontWeight: 300, color: '#FFFFFF' }}>{leaders[0].role}</span>
              </div>
            </div>

            {/* Adarsh Gupta - Offset down */}
            <div className="w-full md:w-[45%] md:mt-40">
              <div className="relative aspect-[4/5] w-full border border-white/20 mb-6 mt-24 md:mt-48">
                <Image
                  src={leaders[1].image}
                  alt={leaders[1].name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="flex justify-between items-end border-b border-white/30" style={{ paddingBottom: '16px' }}>
                <h3 style={{ fontFamily: 'Poppins', fontSize: '28.5px', fontWeight: 300, color: '#FFFFFF' }} className="uppercase">{leaders[1].name}</h3>
                <span style={{ fontFamily: 'Poppins', fontSize: '28.5px', fontWeight: 300, color: '#FFFFFF' }} className="text-right">{leaders[1].role}</span>
              </div>
            </div>
          </div>

          {/* Second Row: Dhanesh (Left-aligned) */}
          <div className="flex flex-col md:flex-row justify-start">
            <div className="w-full md:w-[48%]">
              <div className="relative aspect-[3/4] w-full border border-white/20 mb-6">
                <Image
                  src={leaders[2].image}
                  alt={leaders[2].name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="flex justify-between items-end border-b border-white/30" style={{ paddingBottom: '16px' }}>
                <h3 style={{ fontFamily: 'Poppins', fontSize: '28.5px', fontWeight: 300, color: '#FFFFFF' }} className="uppercase">{leaders[2].name}</h3>
                <span style={{ fontFamily: 'Poppins', fontSize: '28.5px', fontWeight: 300, color: '#FFFFFF' }}>{leaders[2].role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaders;