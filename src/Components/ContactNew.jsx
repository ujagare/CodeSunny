import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import Footer from "./Footer";
import MetaTags from "./MetaTags";

const ContactNew = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    budget: "",
    timeline: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Scroll Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: "", message: "" });
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "";
      const leadMessage = [
        formData.message ? `Project details: ${formData.message}` : "",
        formData.phone ? `Phone: ${formData.phone}` : "",
        formData.company ? `Company: ${formData.company}` : "",
        formData.service ? `Service: ${formData.service}` : "",
        formData.budget ? `Budget: ${formData.budget}` : "",
        formData.timeline ? `Timeline: ${formData.timeline}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const response = await axios.post(
        `${apiUrl}/api/mcp/lead`,
        {
          name: formData.name,
          email: formData.email,
          message: leadMessage,
        },
        { validateStatus: () => true },
      );

      if (response.status >= 200 && response.status < 300) {
        setSubmitStatus({
          type: "success",
          message: "✅ Message sent successfully! We'll get back to you within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          service: "",
          budget: "",
          timeline: "",
          message: "",
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "❌ Failed to send message. Please email us at information@codesunny.in",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MetaTags
        title="Contact CodeSunny - Get in Touch"
        description="Contact CodeSunny for web development, design, and digital marketing services. Let's discuss your project."
        keywords="contact, web development agency, digital marketing, design services"
        url="https://codesunny.com/contact"
      />

      <div className="antialiased text-slate-100 bg-[#000000] min-h-screen">
        {/* Background */}
        <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full"></div>
        </div>

        {/* Header */}
        <header className="sticky top-4 z-50 animate-enter px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur">
              <div className="flex items-center justify-between rounded-2xl border border-[#ffffff]/10 bg-[#000000]/40 p-3">
                <nav className="hidden md:block w-full">
                  <Navbar />
                </nav>
                <nav className="md:hidden w-full">
                  <MobileNavbar />
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="animate-enter-delay-2 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-0 max-w-7xl mr-auto ml-auto pt-16 pb-20">
              {/* Floating Labels */}
              <div className="pointer-events-none relative select-none z-10">
                <span className="float-cursor float-chip-1 absolute left-[65%] -top-12 -translate-x-1/2 -translate-y-8 sm:-top-16">
                  <span className="block whitespace-nowrap rounded-full bg-cyan-400/10 border border-cyan-400/20 px-4 py-1.5 text-xs font-semibold text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                    #1 Web Solutions Provider
                  </span>
                </span>
              </div>

              {/* Headline */}
              <div className="text-center relative z-10">
                <h1 className="sm:text-6xl md:text-7xl text-5xl font-semibold text-white tracking-tight max-w-5xl mr-auto ml-auto">
                  Let's Build Your
                  <span className="relative inline-block mt-2">
                    <span className="absolute -inset-1 rounded-lg bg-blue-500/20 blur-2xl"></span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 relative">
                      Digital Future
                    </span>
                  </span>
                </h1>
                <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400">
                  Ready to transform your business with cutting-edge web solutions? Get in touch with our team and let's create something extraordinary together ⚡️
                </p>

                {/* CTAs */}
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <a
                    href="#contact-form"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-black hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    <span>Start Your Project</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a
                    href="tel:+918975807578"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
