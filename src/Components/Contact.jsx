import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";
import Footer from "./Footer";
import MetaTags from "./MetaTags";
import { GlowCard } from "./ui/spotlight-card";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  budget: "",
  timeline: "",
  message: "",
};

const services = [
  { value: "web-development", label: "Website Development" },
  { value: "ecommerce", label: "E-commerce Website" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "seo-optimization", label: "SEO Optimization" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "ai-solutions", label: "AI Solutions" },
  { value: "cloud-hosting", label: "Cloud and Hosting" },
  { value: "mobile-app", label: "Mobile App Development" },
];

const highlights = [
  { title: "Response Time", value: "< 24 hrs" },
  { title: "Project Kickoff", value: "Within 3 days" },
  { title: "Client Satisfaction", value: "98%" },
];

const Contact = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
          message:
            "Message sent successfully. We will get back to you within 24 hours.",
        });
        setFormData(initialFormData);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          "Failed to send message. Please email us at information@codesunny.in",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MetaTags
        title="Contact CodeSunny - Start Your Project"
        description="Talk to CodeSunny for web development, e-commerce, SEO, UI/UX and AI solutions."
        keywords="CodeSunny contact, website development, SEO agency, ecommerce development"
        url="https://codesunny.com/contact"
      />

      <div className="relative min-h-screen overflow-hidden bg-[#050515] text-slate-100">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-36 -left-28 h-[440px] w-[440px] rounded-full bg-cyan-400/20 blur-[130px]" />
          <div className="absolute top-52 -right-24 h-[460px] w-[460px] rounded-full bg-blue-500/20 blur-[140px]" />
          <div className="absolute bottom-0 left-1/3 h-[320px] w-[320px] rounded-full bg-fuchsia-500/15 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),rgba(255,255,255,0)_45%)]" />
        </div>

        <header className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-xl">
            <nav className="hidden md:block">
              <Navbar />
            </nav>
            <nav className="md:hidden">
              <MobileNavbar />
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-24">
          <section className="text-center">
            <span className="inline-flex items-center rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-1 text-xs tracking-[0.22em] text-cyan-200">
              CONTACT CODESUNNY
            </span>
            <h1
              className="mx-auto mt-6 max-w-5xl text-4xl leading-[1.05] sm:text-6xl md:text-7xl"
              style={{ fontFamily: "Oswald, sans-serif", fontWeight: 400 }}
            >
              Build faster.
              <span className="ml-3 bg-gradient-to-r from-cyan-200 via-blue-200 to-violet-200 bg-clip-text text-transparent">
                Launch smarter.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm text-slate-300 sm:text-lg">
              Share your business objective. We will send a clear execution
              plan, budget range, and realistic timeline.
            </p>
          </section>

          <section className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <GlowCard
                key={item.title}
                glowColor="blue"
                customSize={true}
                className="!p-0 !aspect-auto w-full !grid-rows-1"
              >
                <article className="rounded-2xl bg-transparent p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                    {item.title}
                  </p>
                  <p
                    className="mt-2 text-2xl text-white"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    {item.value}
                  </p>
                </article>
              </GlowCard>
            ))}
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.35fr]">
            <aside className="space-y-6">
              <GlowCard
                glowColor="purple"
                customSize={true}
                className="!p-0 !aspect-auto w-full !grid-rows-1"
              >
                <article className="rounded-3xl bg-transparent p-6">
                  <h2
                    className="text-xl text-white"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    Direct Contact
                  </h2>
                  <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <a
                      className="block transition hover:text-cyan-300"
                      href="tel:+918975807578"
                    >
                      +91 89758 07578
                    </a>
                    <a
                      className="block transition hover:text-cyan-300"
                      href="mailto:information@codesunny.in"
                    >
                      information@codesunny.in
                    </a>
                    <p>Near SB Road, Pune 411016, Maharashtra, India</p>
                    <p className="text-slate-400">
                      Mon - Sat, 10:00 AM to 7:00 PM
                    </p>
                  </div>
                </article>
              </GlowCard>

              <GlowCard
                glowColor="green"
                customSize={true}
                className="!p-0 !aspect-auto w-full !grid-rows-1"
              >
                <article className="rounded-3xl bg-transparent p-6">
                  <h3
                    className="text-lg text-white"
                    style={{ fontFamily: "Oswald, sans-serif" }}
                  >
                    Process After Form Submit
                  </h3>
                  <div className="mt-4 space-y-4 text-sm text-slate-300">
                    <p className="flex items-center gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300/20 text-cyan-200">
                        1
                      </span>
                      Requirement review and scope alignment
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300/20 text-cyan-200">
                        2
                      </span>
                      Budget and timeline shared with milestones
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300/20 text-cyan-200">
                        3
                      </span>
                      Consultation call and kickoff
                    </p>
                  </div>
                </article>
              </GlowCard>
            </aside>

            <GlowCard
              glowColor="blue"
              customSize={true}
              className="!p-0 !aspect-auto w-full !grid-rows-1"
            >
              <section
                id="contact-form"
                className="rounded-3xl bg-transparent p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2
                      className="text-2xl text-white sm:text-3xl"
                      style={{ fontFamily: "Oswald, sans-serif" }}
                    >
                      Send Your Project Brief
                    </h2>
                    <p className="mt-2 text-sm text-slate-300">
                      Required fields are marked with *.
                    </p>
                  </div>
                  <a
                    href="https://codesunny.com/book-call"
                    className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-xs font-medium tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-300/20"
                  >
                    BOOK CONSULTATION
                  </a>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name *"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.07]"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address *"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.07]"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.07]"
                    />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company Name"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.07]"
                    />
                  </div>

                  <select
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.07]"
                  >
                    <option value="">Service Required *</option>
                    {services.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.07]"
                    >
                      <option value="">Budget Range</option>
                      <option value="under-25k">Under Rs 25,000</option>
                      <option value="25k-50k">Rs 25,000 - Rs 50,000</option>
                      <option value="50k-100k">Rs 50,000 - Rs 1,00,000</option>
                      <option value="100k-plus">Above Rs 1,00,000</option>
                    </select>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.07]"
                    >
                      <option value="">Expected Timeline</option>
                      <option value="urgent">Urgent (2 weeks)</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="2-3-months">2 to 3 months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <textarea
                    name="message"
                    rows="5"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Project details *"
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-cyan-300/60 focus:bg-white/[0.07]"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-75"
                  >
                    <span className="relative z-10">
                      {isSubmitting ? "Sending..." : "Send Project Brief"}
                    </span>
                    <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100">
                      <span className="absolute -left-10 top-0 h-full w-10 -skew-x-12 bg-white/45 blur-md animate-[shine_1.6s_ease-in-out_infinite]" />
                    </span>
                  </button>

                  {submitStatus.message && (
                    <div
                      className={`rounded-xl border px-4 py-3 text-sm ${
                        submitStatus.type === "success"
                          ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                          : "border-red-400/40 bg-red-500/15 text-red-200"
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}
                </form>
              </section>
            </GlowCard>
          </section>
        </main>

        <Footer />

        <style>{`
          @keyframes shine {
            0% { transform: translateX(0); }
            100% { transform: translateX(430px); }
          }
        `}</style>
      </div>
    </>
  );
};

export default Contact;
