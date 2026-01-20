import React from 'react';
import Image from 'next/image';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-transparent pointer-events-none">
      <div className="container flex items-center justify-between h-[100px] pointer-events-auto">
        {/* Logo Section */}
        <div className="flex items-center">
          <a href="/" className="inline-block" aria-label="Sheryians Coding School Home">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/Sheryians_Logo_wFKd9VClG-13.png"
              alt="Sheryians Logo"
              width={40}
              height={40}
              className="object-contain"
              style={{ width: 'auto', height: 40 }}
              priority
            />
          </a>
        </div>

        {/* Action Controls / Menu Section */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end gap-[4px] cursor-pointer group">
            <div className="w-[34px] h-[2px] bg-black"></div>
            <div className="w-[34px] h-[2px] bg-black"></div>
          </div>
          
          {/* Subtle Indicator / Scroll Prompt Dot (as seen in screenshots) */}
          <div className="relative flex items-center justify-center">
             <div className="w-[60px] h-[60px] rounded-full bg-black/5 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black"></div>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;