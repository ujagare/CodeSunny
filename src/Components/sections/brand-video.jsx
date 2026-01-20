import React from 'react';

const BrandVideo = () => {
  return (
    <section 
      className="w-full h-auto overflow-hidden"
      aria-label="Brand Showreel"
    >
      <div className="container mx-auto px-[5vw]">
        <div className="relative w-full aspect-video md:mt-[100px] mb-[120px] bg-[#D1D1D1]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ 
              filter: 'grayscale(0%)',
              backgroundColor: '#D1D1D1' 
            }}
          >
            <source 
              src="https://ik.imagekit.io/sheryians/About%20Us/Webreel1_1_Y25mvxPxf.mp4?updatedAt=1710514764579" 
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
          
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ backgroundColor: 'rgba(0,0,0,0.05)' }} 
          />
        </div>
      </div>
    </section>
  );
};

export default BrandVideo;
