import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedBeam } from "./AnimatedBeam";
import GradientText from "./GradientText";
import { Zap, Globe, Database, MessageSquare, Share2, ArrowRight } from "lucide-react";

// Import generated assets
import n8nLogo from "../assets/images/n8n_logo_3d.png";
import socialMediaImg from "../assets/images/social_media_automation_workflow.png";
import crmSyncImg from "../assets/images/crm_sync_workflow.png";

const WorkflowCard = ({ title, description, image, icon: Icon, tags }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
  <motion.div 
    whileHover={{ y: -10, scale: 1.02 }}
    className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
  >
    <div className="aspect-video overflow-hidden relative">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-linear-to-t from-[#050515] to-transparent opacity-60"></div>
      <div className="absolute top-4 left-4">
        <div className="p-2 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-lg">
          <Icon className="w-5 h-5 text-blue-400" />
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, i) => (
          <span key={i} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
            {tag}
          </span>
        ))}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        {description}
      </p>
      <button className="w-full py-3 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 text-white font-medium flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
        Get Workflow <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);

const N8NWorkflows = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const workflows = [
    {
      title: "Social Media Automation",
      description: "Automatically post, engage, and analyze across all platforms from a single n8n hub.",
      image: socialMediaImg,
      icon: Share2,
      tags: ["Marketing", "Social", "n8n"]
    },
    {
      title: "CRM & Data Sync",
      description: "Keep your Salesforce, HubSpot, and Google Sheets in perfect harmony with real-time sync.",
      image: crmSyncImg,
      icon: Database,
      tags: ["Sales", "Data", "Automation"]
    },
    {
      title: "AI Customer Support",
      description: "Integrate ChatGPT with your helpdesk to automate 80% of customer inquiries instantly.",
      image: socialMediaImg, // Placeholder for now
      icon: MessageSquare,
      tags: ["AI", "Support", "Efficiency"]
    }
  ];

  return (
    <div ref={containerRef} className="relative bg-[#050515] overflow-hidden">
      {/* 3D Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity, scale }} className="relative z-10 text-center px-4">
          <div className="mb-8 relative inline-block">
            <motion.div 
              animate={{ 
                rotateY: [0, 360],
                y: [0, -20, 0]
              }}
              transition={{ 
                rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-32 h-32 md:w-48 md:h-48 relative z-20"
            >
              <img src={n8nLogo} alt="n8n 3D Logo" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]" />
            </motion.div>
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full -z-10"></div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            <GradientText
              colors={["#10b981", "#3b82f6", "#10b981", "#3b82f6"]}
              animationSpeed={5}
              showBorder={false}
              className="inline-block"
            >
              n8n Workflows
            </GradientText>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Supercharge your business with our premium, ready-to-deploy automation workflows. 
            Built for scale, designed for excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-emerald-400 transition-colors flex items-center gap-2">
              Explore Workflows <Zap className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-colors">
              Custom Automation
            </button>
          </div>
        </motion.div>

        {/* Background 3D Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[150px] rounded-full animate-pulse delay-1000"></div>
          <div className="floor-grid opacity-20"></div>
        </div>
      </section>

      {/* Workflow Gallery */}
      <section className="relative py-24 px-4 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-emerald-400 font-mono text-sm uppercase tracking-[0.3em] mb-4 block">
                Premium_Solutions
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Automate Everything. <br /> 
                <span className="text-slate-500">Scale Everywhere.</span>
              </h2>
            </div>
            <p className="text-slate-400 max-w-sm">
              Our workflows are tested, optimized, and ready to integrate with your existing tech stack in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflows.map((workflow, index) => (
              <WorkflowCard key={index} {...workflow} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default N8NWorkflows;
