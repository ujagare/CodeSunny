import React, { useMemo, useState } from "react";

const initialMessages = [
  {
    role: "assistant",
    text: "Hi! I can help with services, pricing, and project ideas. How can I help you today?",
  },
];

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const [lead, setLead] = useState({ name: "", email: "", message: "" });
  const [leadStatus, setLeadStatus] = useState("");

  const canSend = input.trim().length > 0 && !sending;

  const sendChat = async () => {
    if (!canSend) return;
    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setSending(true);
    try {
      const res = await fetch("/api/mcp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      console.log("Chat API Response:", data); // Debug log

      // Handle both formats: {reply: "..."} or {content: [{text: "..."}]}
      let reply;
      if (data?.reply) {
        reply = data.reply;
      } else if (data?.content?.[0]?.text) {
        // Parse the nested JSON if it's in MCP format
        try {
          const parsed = JSON.parse(data.content[0].text);
          reply = parsed.reply || data.content[0].text;
        } catch {
          reply = data.content[0].text;
        }
      } else if (data?.error) {
        reply = data.error;
      } else {
        reply = res.ok
          ? "Sorry, I couldn't respond right now."
          : "Chat service is temporarily unavailable.";
      }

      console.log("Final reply:", reply); // Debug final reply
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);

      // Auto-detect if AI is suggesting to connect with team
      const connectKeywords = [
        "connect you with our team",
        "share your name and email",
        "reach out to you",
        "get in touch",
        "contact form",
      ];

      const shouldShowLeadForm = connectKeywords.some((keyword) =>
        reply.toLowerCase().includes(keyword.toLowerCase()),
      );

      if (shouldShowLeadForm) {
        // Auto-switch to lead tab after a short delay
        setTimeout(() => {
          setTab("lead");
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: "👉 Please fill out the form on the 'Contact' tab so our team can reach out to you!",
            },
          ]);
        }, 1500);
      }
    } catch (_err) {
      console.error("Chat error:", _err); // Debug log
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const runSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setSearching(true);
    try {
      const res = await fetch("/api/mcp/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setSearchResults(data?.results || []);
    } catch (_err) {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const submitLead = async (event) => {
    event.preventDefault();
    setLeadStatus("");
    if (!lead.name.trim() || !lead.email.trim()) {
      setLeadStatus("Please enter your name and email.");
      return;
    }
    try {
      const res = await fetch("/api/mcp/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      const data = await res.json();
      if (data?.status === "received") {
        setLeadStatus("Thanks! We'll get back to you shortly.");
        setLead({ name: "", email: "", message: "" });
      } else {
        setLeadStatus("Something went wrong. Please try again.");
      }
    } catch (_err) {
      setLeadStatus("Something went wrong. Please try again.");
    }
  };

  const headerTitle = useMemo(() => {
    if (tab === "search") return "Smart Search";
    if (tab === "lead") return "Lead Capture";
    return "AI Support";
  }, [tab]);

  return (
    <>
      {/* Floating Chat Button with Pulse Animation */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[1200] group"
        aria-label="Open support"
      >
        <div className="relative">
          {/* Pulse rings */}
          {!open && (
            <>
              <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-75"></span>
              <span className="absolute inset-0 rounded-full bg-blue-500 animate-pulse opacity-50"></span>
            </>
          )}
          {/* Button */}
          <div className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-3.5 text-sm font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
            {open ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>Close</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <span>Chat with AI</span>
              </>
            )}
          </div>
        </div>
      </button>

      {/* Chat Widget with Glassmorphism */}
      {open && (
        <section className="fixed bottom-24 right-6 z-[1200] w-[92vw] max-w-md rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl text-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"></div>

          {/* Header */}
          <header className="relative px-5 py-4 border-b border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                    CodeSunny AI
                  </p>
                  <h3 className="text-base font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    {headerTitle}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs text-green-400">Online</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 bg-white/5 rounded-full p-1">
              <button
                type="button"
                onClick={() => setTab("chat")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  tab === "chat"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                💬 Chat
              </button>
              <button
                type="button"
                onClick={() => setTab("search")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  tab === "search"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                🔍 Search
              </button>
              <button
                type="button"
                onClick={() => setTab("lead")}
                className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  tab === "lead"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                📧 Contact
              </button>
            </div>
          </header>

          {tab === "chat" && (
            <div className="relative flex flex-col h-[450px]">
              {/* Messages Area with Custom Scrollbar */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <div
                    key={`${msg.role}-${idx}`}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "bg-white/10 backdrop-blur-sm text-white border border-white/10"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/10">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
                        <span
                          className="w-2 h-2 rounded-full bg-purple-400 animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></span>
                        <span
                          className="w-2 h-2 rounded-full bg-pink-400 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-white/10 backdrop-blur-sm px-4 py-4">
                <div className="flex items-center gap-2 bg-white/5 rounded-full p-1.5 border border-white/10">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendChat();
                      }
                    }}
                    className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none placeholder:text-slate-400"
                    placeholder="Ask anything about our services..."
                  />
                  <button
                    type="button"
                    onClick={sendChat}
                    disabled={!canSend}
                    className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2.5 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                  Powered by AI • Instant responses
                </p>
              </div>
            </div>
          )}

          {tab === "search" ? (
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
                  placeholder="Search services, pages..."
                />
                <button
                  type="button"
                  onClick={runSearch}
                  className="rounded-full bg-white text-black px-3 py-2 text-xs font-semibold"
                >
                  {searching ? "..." : "Go"}
                </button>
              </div>
              <div className="space-y-2">
                {searchResults.length === 0 && !searching ? (
                  <p className="text-xs text-slate-400">
                    No results yet. Try a keyword like “SEO” or “E-commerce”.
                  </p>
                ) : null}
                {searchResults.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {tab === "lead" && (
            <form onSubmit={submitLead} className="relative p-5 space-y-4">
              <div className="space-y-3">
                <div className="relative">
                  <input
                    value={lead.name}
                    onChange={(e) => setLead({ ...lead, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="Your name"
                  />
                  <svg
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                <div className="relative">
                  <input
                    value={lead.email}
                    onChange={(e) =>
                      setLead({ ...lead, email: e.target.value })
                    }
                    type="email"
                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="Email address"
                  />
                  <svg
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <textarea
                  value={lead.message}
                  onChange={(e) =>
                    setLead({ ...lead, message: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                  placeholder="Tell us about your project (optional)"
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Submit Lead
              </button>

              {leadStatus && (
                <div className="text-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-sm text-slate-200">{leadStatus}</p>
                </div>
              )}
            </form>
          )}

          {tab === "search" && (
            <div className="relative p-5 space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                    className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="Search services, pages..."
                  />
                  <svg
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={runSearch}
                  disabled={searching}
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 text-sm font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                {searchResults.length === 0 && !searching && (
                  <div className="text-center py-8">
                    <svg
                      className="w-12 h-12 mx-auto text-slate-600 mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-sm text-slate-400">
                      Try searching for "SEO", "E-commerce", or "Web
                      Development"
                    </p>
                  </div>
                )}
                {searchResults.map((item, idx) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {item.url}
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default ChatWidget;
