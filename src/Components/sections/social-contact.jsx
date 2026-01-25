import React from "react";

const SocialContact = () => {
  const socialMedia = [
    { name: "Instagram", url: "#" },
    { name: "Youtube", url: "#" },
    { name: "Telegram", url: "#" },
    { name: "LinkedIn", url: "#" },
    { name: "Discord", url: "#" },
    { name: "Facebook", url: "#" },
  ];

  const contactInfo = [
    { label: "PHONE", value: "+91 89758075789" },
    { label: "EMAIL", value: "INFO@CODESUNNY.IN" },
    { label: "ADDRESS", value: "NEAR SB ROAD, PUNE 411016" },
  ];

  return (
    <section className="inverse-section py-12 md:py-20 lg:py-32 px-[12vw] md:px-[8vw]">
      <div className="max-w-full">
        {/* OUR SOCIAL MEDIA SECTION */}
        <div className="mb-16 md:mb-24 lg:mb-40">
          <div
            className="w-full border-b border-cyan-400 mb-10 md:mb-16"
            style={{ paddingBottom: "6px" }}
          >
            <h2
              style={{
                fontFamily: "Poppins",
                fontSize: "clamp(24px, 6vw, 95px)",
                fontWeight: 600,
                background:
                  "linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient 3s linear infinite",
                letterSpacing: "-0.02em",
              }}
              className="uppercase inline-flex items-start"
            >
              OUR SOCIAL MEDIA
              <span className="text-[1.5em] md:text-[1em] ml-1">*</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-y-8 md:gap-y-16 gap-x-8 md:gap-x-12 lg:gap-x-24">
            {socialMedia.map((social) => (
              <div key={social.name} className="group cursor-pointer">
                <div
                  className="inline-block border-b border-cyan-400 pr-8 md:pr-12 transition-all duration-300 hover:pr-12 md:hover:pr-16"
                  style={{ paddingBottom: "6px" }}
                >
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "clamp(14px, 3.5vw, 38px)",
                      fontWeight: 400,
                      color: "#FFFFFF",
                    }}
                    className="tracking-tight"
                  >
                    {social.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT US SECTION */}
        <div>
          <div
            className="w-full border-b border-cyan-400 mb-12 md:mb-20"
            style={{ paddingBottom: "6px" }}
          >
            <h2
              style={{
                fontFamily: "Poppins",
                fontSize: "clamp(24px, 6vw, 95px)",
                fontWeight: 600,
                background:
                  "linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient 3s linear infinite",
                letterSpacing: "-0.02em",
              }}
              className="uppercase inline-flex items-start"
            >
              CONTACT US
              <span className="text-[1.5em] md:text-[1em] ml-1">*</span>
            </h2>
          </div>

          <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
            <div className="flex items-end gap-16 md:gap-24 lg:gap-40">
              <div className="border-b border-cyan-400 pb-1 w-[90px] md:w-[120px]">
                <h3
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(10px, 2.5vw, 38px)",
                    fontWeight: 400,
                    color: "#FFFFFF",
                  }}
                  className="uppercase tracking-wider"
                >
                  PHONE
                </h3>
              </div>
              <div className="border-b border-cyan-400 pb-1 inline-block">
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(10px, 2.5vw, 38px)",
                    fontWeight: 400,
                    color: "#FFFFFF",
                  }}
                  className="uppercase tracking-tight"
                >
                  +91 89758075789
                </span>
              </div>
            </div>

            <div className="flex items-end gap-16 md:gap-24 lg:gap-40">
              <div className="border-b border-cyan-400 pb-1 w-[90px] md:w-[120px]">
                <h3
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(10px, 2.5vw, 38px)",
                    fontWeight: 400,
                    color: "#FFFFFF",
                  }}
                  className="uppercase tracking-wider"
                >
                  EMAIL
                </h3>
              </div>
              <div className="border-b border-cyan-400 pb-1 inline-block">
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(10px, 2.5vw, 38px)",
                    fontWeight: 400,
                    color: "#FFFFFF",
                  }}
                  className="uppercase tracking-tight"
                >
                  INFO@CODESUNNY.IN
                </span>
              </div>
            </div>

            <div className="flex items-end gap-16 md:gap-24 lg:gap-40">
              <div className="border-b border-cyan-400 pb-1 w-[90px] md:w-[120px]">
                <h3
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(10px, 2.5vw, 38px)",
                    fontWeight: 400,
                    color: "#FFFFFF",
                  }}
                  className="uppercase tracking-wider"
                >
                  ADDRESS
                </h3>
              </div>
              <div className="border-b border-cyan-400 pb-1 inline-block">
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(10px, 2.5vw, 38px)",
                    fontWeight: 400,
                    color: "#FFFFFF",
                  }}
                  className="uppercase tracking-tight"
                >
                  NEAR SB ROAD, PUNE 411016
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialContact;
