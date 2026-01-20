import React from "react";

const Leaders = () => {
  const leaders = [
    {
      name: "Harsh Sharma",
      role: "FOUNDER & CEO",
      image:
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/harshBhaiya_gIiC2DRXHp-10.png",
      width: "w-full md:w-[48%]",
      height: "aspect-[3/4]",
    },
    {
      name: "Adarsh Gupta",
      role: "MANAGING DIRECTOR & INSTR.",
      image:
        "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/dbd912b3-0ea1-419f-bea7-74bc04413eec-sheryians-com/assets/images/adarshBhaiya_gjPNHYWpm_-11.png",
      width: "w-full md:w-[48%]",
      height: "aspect-[1/1] md:aspect-[4/5]",
      alignSelf: "self-end",
      marginTop: "md:mt-40",
    },
    {
      name: "kumar dhotre",
      role: "UI/UX DESIGNER",
      image: new URL("../../assets/images/kumar.jpeg", import.meta.url).href,
      width: "w-full md:w-[48%]",
      height: "aspect-[3/4]",
    },
  ];

  return (
    <section className="text-white pt-[40px] md:pt-[120px] pb-10 px-[12vw] md:px-[8vw]">
      <div className="max-w-full">
        {/* Section Header */}
        <div className="mb-12 md:mb-20">
          <h2
            style={{
              fontFamily: "Poppins",
              fontSize: "clamp(32px, 8vw, 133px)",
              fontWeight: 500,
              background:
                "linear-gradient(90deg, #00CED1, #1E90FF, #00CED1, #1E90FF)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient 3s linear infinite",
              paddingBottom: "16px",
            }}
            className="uppercase tracking-tighter leading-[0.9] border-b border-cyan-400 inline-block w-full"
          >
            OUR LEADERS<span className="text-[1.5em] md:text-[1em]">*</span>
          </h2>
        </div>

        {/* Leaders Grid - Manual layout to match the asymmetrical design */}
        <div className="flex flex-col gap-12 md:gap-24">
          {/* First Row: Harsh (Left) and Adarsh (Right offset) */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-0">
            {/* Harsh Sharma */}
            <div className="w-full md:w-[48%]">
              <div className="relative aspect-[3/4] w-full border border-white/20 mb-4 md:mb-6">
                <img
                  src={leaders[0].image}
                  alt={leaders[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="flex flex-row justify-between items-end border-b border-cyan-400 gap-2"
                style={{ paddingBottom: "12px" }}
              >
                <h3
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(12px, 3vw, 28.5px)",
                    fontWeight: 300,
                    color: "#D1D5DB",
                  }}
                  className="uppercase"
                >
                  {leaders[0].name}
                </h3>
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(12px, 3vw, 28.5px)",
                    fontWeight: 300,
                    color: "#D1D5DB",
                  }}
                >
                  {leaders[0].role}
                </span>
              </div>
            </div>

            {/* Adarsh Gupta - Offset down */}
            <div className="w-full md:w-[45%] md:mt-40">
              <div className="relative aspect-[4/5] w-full border border-white/20 mb-4 md:mb-6 mt-12 md:mt-48">
                <img
                  src={leaders[1].image}
                  alt={leaders[1].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="flex flex-row justify-between items-end border-b border-cyan-400 gap-2"
                style={{ paddingBottom: "12px" }}
              >
                <h3
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(12px, 3vw, 28.5px)",
                    fontWeight: 300,
                    color: "#D1D5DB",
                  }}
                  className="uppercase"
                >
                  {leaders[1].name}
                </h3>
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(12px, 3vw, 28.5px)",
                    fontWeight: 300,
                    color: "#D1D5DB",
                  }}
                  className="text-right"
                >
                  {leaders[1].role}
                </span>
              </div>
            </div>
          </div>

          {/* Second Row: Dhanesh (Left-aligned) */}
          <div className="flex flex-col md:flex-row justify-start">
            <div className="w-full md:w-[48%]">
              <div className="relative aspect-[3/4] w-full border border-white/20 mb-4 md:mb-6">
                <img
                  src={leaders[2].image}
                  alt={leaders[2].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="flex flex-row justify-between items-end border-b border-cyan-400 gap-2"
                style={{ paddingBottom: "12px" }}
              >
                <h3
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(12px, 3vw, 28.5px)",
                    fontWeight: 300,
                    color: "#D1D5DB",
                  }}
                  className="uppercase"
                >
                  {leaders[2].name}
                </h3>
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "clamp(12px, 3vw, 28.5px)",
                    fontWeight: 300,
                    color: "#D1D5DB",
                  }}
                >
                  {leaders[2].role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leaders;
