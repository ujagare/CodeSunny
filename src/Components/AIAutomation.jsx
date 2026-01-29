import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  BarChart3,
  Workflow,
  Cpu,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import GradientText from "./GradientText";

// Import images
import n8nLogo from "../assets/images/n8n svg/n8n.svg";
import socialMediaImg from "../assets/images/social_media_automation_workflow.png";
import crmSyncImg from "../assets/images/crm_sync_workflow.png";

const BentoCard = ({
  title,
  description,
  icon: Icon,
  image,
  className,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02 }}
    className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-colors hover:bg-white/10 ${className}`}
  >
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br from-purple-500/20 to-cyan-500/20 blur-3xl"></div>

    {image && (
      <div className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-[#050515] via-[#050515]/80 to-transparent"></div>
      </div>
    )}

    <div className="relative z-10 flex h-full flex-col justify-between">
      <div>
        <div className="mb-4 inline-flex rounded-xl bg-white/10 p-3 text-cyan-400 ring-1 ring-white/20 backdrop-blur-md">
          <Icon size={24} />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-400">{description}</p>
      </div>
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
        Learn more <ArrowUpRight size={16} />
      </div>
    </div>
  </motion.div>
);

const AIAutomation = () => {
  return (
    <section className="relative overflow-hidden bg-[#050515] py-32">
      {/* Background Gradients */}
      <div className="absolute left-0 top-0 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute -left-[20%] top-[20%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]"></div>
        <div className="absolute -right-[20%] bottom-[20%] h-[500px] w-[500px] rounded-full bg-cyan-600/10 blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-cyan-400 mb-6"
          >
            <Sparkles size={14} />
            <span>AI-Powered Future</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            <GradientText
              colors={["#A855F7", "#22D3EE", "#A855F7", "#22D3EE"]}
              animationSpeed={4}
              showBorder={false}
              className="inline-block"
            >
              Next-Gen Automation
            </GradientText>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            Harness the power of artificial intelligence to streamline
            operations, enhance customer experiences, and drive unprecedented
            growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Large Card Left */}
          <BentoCard
            title="Intelligent Chatbots"
            description="Deploy 24/7 customer support agents that understand context, sentiment, and complex queries using advanced NLP."
            icon={Bot}
            image={socialMediaImg}
            className="md:col-span-2 md:row-span-2 min-h-[300px] group"
            delay={0.1}
          />

          {/* Small Card Right Top */}
          <BentoCard
            title="Predictive Analytics"
            description="Turn raw data into actionable insights with ML models that forecast trends."
            icon={BarChart3}
            image={crmSyncImg}
            className="md:col-span-1 group"
            delay={0.2}
          />

          {/* Small Card Right Bottom */}
          <BentoCard
            title="Workflow Orchestration"
            description="Connect disparate apps into a cohesive, self-healing automation ecosystem."
            icon={Workflow}
            image={n8nLogo}
            className="md:col-span-1 group"
            delay={0.3}
          />

          {/* Wide Card Bottom */}
          <BentoCard
            title="Neural Processing Units"
            description="Leverage dedicated AI hardware acceleration for real-time processing of video, audio, and large-scale data streams without latency."
            icon={Cpu}
            className="md:col-span-3 group"
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

export default AIAutomation;
