import React, { forwardRef, useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import ElectricBorder from "./ElectricBorder";
import GradientText from "./GradientText";
import gmailSvg from "../assets/images/n8n svg/gmail.svg";
import googleSheetsSvg from "../assets/images/n8n svg/googleSheets.svg";
import httpRequestSvg from "../assets/images/n8n svg/httprequest.svg";
import openAiSvg from "../assets/images/n8n svg/openAi.svg";
import postgresSvg from "../assets/images/n8n svg/postgres.svg";
import slackSvg from "../assets/images/n8n svg/slack.svg";
import webhookSvg from "../assets/images/n8n svg/webhook.svg";
import whatsappSvg from "../assets/images/n8n svg/whatsapp.svg";
import n8nSvg from "../assets/images/n8n svg/n8n.svg";

export const AnimatedBeam = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 2,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#60a5fa",
  gradientStopColor = "#34d399",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const gradientCoordinates = reverse
    ? {
        x1: ["90%", "-10%"],
        x2: ["100%", "0%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }
    : {
        x1: ["10%", "110%"],
        x2: ["0%", "100%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      };

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectA = fromRef.current.getBoundingClientRect();
        const rectB = toRef.current.getBoundingClientRect();

        const svgWidth = containerRect.width;
        const svgHeight = containerRect.height;
        setSvgDimensions({ width: svgWidth, height: svgHeight });

        const startX =
          rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        const startY =
          rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
        const endX =
          rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
        const endY =
          rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

        const controlY = startY - curvature;
        const d = `M ${startX},${startY} Q ${
          (startX + endX) / 2
        },${controlY} ${endX},${endY}`;
        setPathD(d);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updatePath();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    updatePath();

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none absolute left-0 top-0 transform-gpu stroke-2 ${className || ""}`}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      style={{ background: "transparent" }}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity="1"
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          className="transform-gpu"
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{
            x1: gradientCoordinates.x1[0],
            x2: gradientCoordinates.x2[0],
            y1: gradientCoordinates.y1[0],
            y2: gradientCoordinates.y2[0],
          }}
          animate={{
            x1: gradientCoordinates.x1,
            x2: gradientCoordinates.x2,
            y1: gradientCoordinates.y1,
            y2: gradientCoordinates.y2,
          }}
          transition={{
            delay,
            duration,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 0,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
};

const Circle = forwardRef(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={`z-10 flex size-12 items-center justify-center rounded-full bg-transparent p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] animated-circle ${className || ""}`}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

const circleStyles = `
  @property --gradient-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }
  
  .animated-circle {
    --gradient-angle: 0deg;
    position: relative;
    border: 2px solid transparent;
    background:
      linear-gradient(#000000, #000000) padding-box,
      conic-gradient(
        from var(--gradient-angle),
        transparent 0%,
        #1d4ed8 5%,
        #8484ff 15%,
        #1d4ed8 30%,
        transparent 40%,
        transparent 100%
      ) border-box;
    animation: border-spin 2.5s linear infinite;
  }
  
  @keyframes border-spin {
    to {
      --gradient-angle: 360deg;
    }
  }
`;

export function AnimatedBeamDemo({ className }) {
  const containerRef = React.useRef(null);
  const beamContainerRef = React.useRef(null);
  const div6Ref = React.useRef(null);
  const div7Ref = React.useRef(null);
  const div1Ref = React.useRef(null);
  const div2Ref = React.useRef(null);
  const div3Ref = React.useRef(null);
  const div4Ref = React.useRef(null);
  const div5Ref = React.useRef(null);

  return (
    <div className="w-full px-0 md:px-0">
      <div className="mb-8 md:mb-12 text-center px-0">
        <h2 className="text-2xl md:text-4xl lg:text-6xl font-medium tracking-tight mb-3">
          <GradientText
            colors={["#00CED1", "#1E90FF", "#00CED1", "#1E90FF"]}
            animationSpeed={3}
            showBorder={false}
            className="inline-block"
          >
            Powerful Integrations
          </GradientText>
        </h2>
        <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto">
          Connect your favorite tools and automate your workflow seamlessly
        </p>
      </div>
      <ElectricBorder
        color="#60a5fa"
        speed={0.1}
        chaos={0.01}
        borderRadius={18}
        className="h-full"
      >
        <div
          className={`relative flex flex-col md:flex-row h-auto min-h-[500px] md:h-[450px] lg:h-[550px] w-full items-center justify-start overflow-hidden rounded-lg bg-transparent gap-8 md:gap-12 lg:gap-20 p-6 md:p-6 lg:p-8 ${className || ""}`}
          ref={containerRef}
        >
          <style>{circleStyles}</style>
          <div className="flex flex-col justify-center items-center md:items-start flex-1 md:pl-6 lg:pl-20 text-center md:text-left py-4 md:py-0">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-4 md:mb-6">
              <img
                src={n8nSvg}
                alt="n8n"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16"
              />
              <h3 className="text-lg md:text-2xl lg:text-3xl font-semibold text-white">
                Workflow Automation
              </h3>
            </div>
            <p className="text-xs md:text-sm lg:text-base text-gray-400 mb-4 md:mb-6 lg:mb-8 max-w-xs md:max-w-md">
              Streamline your business processes with intelligent automation.
              Connect your favorite tools and eliminate manual work.
            </p>
            <style>{`
              @property --gradient-angle {
                syntax: "<angle>";
                initial-value: 0deg;
                inherits: false;
              }

              .shiny-cta-beam {
                --gradient-angle: 0deg;
                position: relative;
                overflow: hidden;
                border-radius: 9999px;
                padding: 0.75rem 1.5rem;
                font-size: 0.75rem;
                line-height: 1.2;
                font-weight: 500;
                color: #ffffff;
                background:
                  linear-gradient(#000000, #000000) padding-box,
                  conic-gradient(
                      from var(--gradient-angle),
                      transparent 0%,
                      #1d4ed8 5%,
                      #8484ff 15%,
                      #1d4ed8 30%,
                      transparent 40%,
                      transparent 100%
                    )
                    border-box;
                border: 2px solid transparent;
                box-shadow: inset 0 0 0 1px #1a1818;
                cursor: pointer;
                animation: border-spin 2.5s linear infinite;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
              }

              @media (min-width: 768px) {
                .shiny-cta-beam {
                  padding: 0.875rem 1.75rem;
                  font-size: 0.875rem;
                }
              }

              @keyframes border-spin {
                to {
                  --gradient-angle: 360deg;
                }
              }

              .shiny-cta-beam:active {
                transform: translateY(1px);
              }

              .shiny-cta-beam::before {
                content: "";
                pointer-events: none;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: calc(100% - 6px);
                height: calc(100% - 6px);
                background: radial-gradient(
                    circle at 2px 2px,
                    white 0.5px,
                    transparent 0
                  )
                  padding-box;
                background-size: 4px 4px;
                background-repeat: space;
                mask-image: conic-gradient(
                  from calc(var(--gradient-angle) + 45deg),
                  black,
                  transparent 10% 90%,
                  black
                );
                border-radius: inherit;
                opacity: 0.4;
              }

              .shiny-cta-beam::after {
                content: "";
                pointer-events: none;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                aspect-ratio: 1;
                background: linear-gradient(
                  -50deg,
                  transparent,
                  #1d4ed8,
                  transparent
                );
                mask-image: radial-gradient(
                  circle at bottom,
                  transparent 40%,
                  black
                );
                opacity: 0.6;
                animation: shimmer 4s linear infinite;
              }

              @keyframes shimmer {
                to {
                  transform: translate(-50%, -50%) rotate(360deg);
                }
              }

              .shiny-cta-beam span {
                position: relative;
                z-index: 2;
              }
            `}</style>
            <button className="shiny-cta-beam focus:outline-none">
              <span>Get Started</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: "relative", zIndex: 2 }}
                className="md:w-4 md:h-4"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {/* Horizontal line for mobile view */}
          <div className="block md:hidden w-full">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-30"></div>
          </div>

          <ElectricBorder
            color="#60a5fa"
            speed={0.1}
            chaos={0.01}
            borderRadius={0}
            className="h-full hidden md:block"
          >
            <div className="h-full w-0.5 bg-transparent"></div>
          </ElectricBorder>

          <div
            className="relative flex flex-1 flex-row items-stretch justify-between gap-6 md:gap-8 lg:gap-10 px-4 py-4 md:px-6 md:py-0 lg:px-8 pr-6 md:pr-12 lg:pr-20"
            ref={beamContainerRef}
          >
            <div className="flex flex-col justify-center gap-2 md:gap-2">
              <Circle ref={div1Ref} className="size-14 md:size-14 lg:size-12">
                <img
                  src={googleSheetsSvg}
                  alt="Google Sheets"
                  className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8"
                />
              </Circle>
              <Circle ref={div2Ref} className="size-14 md:size-14 lg:size-12">
                <img
                  src={slackSvg}
                  alt="Slack"
                  className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8"
                />
              </Circle>
              <Circle ref={div3Ref} className="size-14 md:size-14 lg:size-12">
                <img
                  src={postgresSvg}
                  alt="Postgres"
                  className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8"
                />
              </Circle>
              <Circle ref={div4Ref} className="size-14 md:size-14 lg:size-12">
                <img
                  src={httpRequestSvg}
                  alt="HTTP Request"
                  className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8"
                />
              </Circle>
              <Circle ref={div5Ref} className="size-14 md:size-14 lg:size-12">
                <img
                  src={webhookSvg}
                  alt="Webhook"
                  className="w-6 h-6 md:w-8 md:h-8 lg:w-8 lg:h-8"
                />
              </Circle>
            </div>
            <div className="flex flex-col justify-center">
              <Circle
                ref={div6Ref}
                className="size-20 md:size-20 lg:size-20 bg-white"
              >
                <img
                  src={openAiSvg}
                  alt="OpenAI"
                  className="w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12"
                  style={{ filter: "invert(1)" }}
                />
              </Circle>
            </div>
            <div className="flex flex-col justify-center">
              <Circle ref={div7Ref} className="size-16 md:size-16 lg:size-16">
                <img
                  src={whatsappSvg}
                  alt="WhatsApp"
                  className="w-7 h-7 md:w-9 md:h-9 lg:w-10 lg:h-10"
                />
              </Circle>
            </div>
            <AnimatedBeam
              containerRef={beamContainerRef}
              fromRef={div1Ref}
              toRef={div6Ref}
              duration={3}
              pathWidth={3}
              gradientStartColor="#60a5fa"
              gradientStopColor="#34d399"
            />
            <AnimatedBeam
              containerRef={beamContainerRef}
              fromRef={div2Ref}
              toRef={div6Ref}
              duration={3}
              delay={0.2}
              pathWidth={3}
              gradientStartColor="#60a5fa"
              gradientStopColor="#34d399"
            />
            <AnimatedBeam
              containerRef={beamContainerRef}
              fromRef={div3Ref}
              toRef={div6Ref}
              duration={3}
              delay={0.4}
              pathWidth={3}
              gradientStartColor="#60a5fa"
              gradientStopColor="#34d399"
            />
            <AnimatedBeam
              containerRef={beamContainerRef}
              fromRef={div4Ref}
              toRef={div6Ref}
              duration={3}
              delay={0.6}
              pathWidth={3}
              gradientStartColor="#60a5fa"
              gradientStopColor="#34d399"
            />
            <AnimatedBeam
              containerRef={beamContainerRef}
              fromRef={div5Ref}
              toRef={div6Ref}
              duration={3}
              delay={0.8}
              pathWidth={3}
              gradientStartColor="#60a5fa"
              gradientStopColor="#34d399"
            />
            <AnimatedBeam
              containerRef={beamContainerRef}
              fromRef={div7Ref}
              toRef={div6Ref}
              duration={3}
              pathWidth={4}
              pathOpacity={0.5}
              gradientStartColor="#60a5fa"
              gradientStopColor="#34d399"
            />
          </div>
        </div>
      </ElectricBorder>
    </div>
  );
}

export default AnimatedBeamDemo;
