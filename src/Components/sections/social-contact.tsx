import React from 'react';

const SocialContact = () => {
  const socialMedia = [
    { name: 'Instagram', url: '#' },
    { name: 'LinkedIn', url: '#' },
    { name: 'Youtube', url: '#' },
    { name: 'Discord', url: '#' },
    { name: 'Telegram', url: '#' },
    { name: 'Facebook', url: '#' },
  ];

  const contactInfo = [
    { label: 'PHONE', value: '+91 9993478545' },
    { label: 'EMAIL', value: 'HELLO@SHERYIANS.COM' },
    { label: 'ADDRESS', value: '23-B SECTOR C INDRAPURI BHOPAL 462022' },
  ];

  return (
    <section className="inverse-section py-20 lg:py-32 px-12 md:px-24 lg:px-32">
      <div className="max-w-full">
        {/* OUR SOCIAL MEDIA SECTION */}
        <div className="mb-24 lg:mb-40">
          <div className="w-full border-b border-white mb-16" style={{ paddingBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Poppins', fontSize: '95px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.02em' }} className="uppercase inline-flex items-start">
              OUR SOCIAL MEDIA
              <span className="text-6xl ml-1">*</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-12 lg:gap-x-24">
            {socialMedia.map((social) => (
              <div key={social.name} className="group cursor-pointer">
                <div className="inline-block border-b border-white pr-12 transition-all duration-300 hover:pr-16" style={{ paddingBottom: '16px' }}>
                  <span style={{ fontFamily: 'Poppins', fontSize: '38px', fontWeight: 400, color: 'RGB(255, 255, 255)', textTransform: 'capitalize' }} className="tracking-tight">
                    {social.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT US SECTION */}
        <div>
          <div className="w-full border-b border-white mb-20" style={{ paddingBottom: '16px' }}>
            <h2 style={{ fontFamily: 'Poppins', fontSize: '95px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.02em' }} className="uppercase inline-flex items-start">
              CONTACT US
              <span className="text-6xl ml-1">*</span>
            </h2>
          </div>

          <div className="flex flex-col gap-12 lg:gap-16">
            {contactInfo.map((info) => (
              <div key={info.label} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] items-start">
                <div className="mb-2 md:mb-0">
                  <div className="inline-block border-b border-white" style={{ paddingBottom: '16px' }}>
                    <h3 style={{ fontFamily: 'Poppins', fontSize: '38px', fontWeight: 400, color: 'RGB(255, 255, 255)', textTransform: 'capitalize' }} className="uppercase tracking-wider">
                      {info.label}
                    </h3>
                  </div>
                </div>
                <div>
                  <div className="inline-block border-b border-white" style={{ paddingBottom: '16px' }}>
                    <span style={{ fontFamily: 'Poppins', fontSize: '38px', fontWeight: 400, color: 'RGB(255, 255, 255)', textTransform: 'capitalize' }} className="uppercase tracking-tight">
                      {info.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialContact;