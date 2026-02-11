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
      const reply = data?.reply || "Sorry, I couldn't respond right now.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (_err) {
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
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 z-[1200] inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition"
        aria-label="Open support"
      >
        {open ? "Close" : "Chat"}
      </button>

      {open ? (
        <section className="fixed bottom-20 right-5 z-[1200] w-[92vw] max-w-sm rounded-2xl border border-white/10 bg-[#0b0f1a] text-white shadow-2xl overflow-hidden">
          <header className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                CodeSunny
              </p>
              <h3 className="text-lg font-semibold">{headerTitle}</h3>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab("chat")}
                className={`px-2.5 py-1 rounded-full text-xs ${
                  tab === "chat"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white"
                }`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setTab("search")}
                className={`px-2.5 py-1 rounded-full text-xs ${
                  tab === "search"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white"
                }`}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setTab("lead")}
                className={`px-2.5 py-1 rounded-full text-xs ${
                  tab === "lead"
                    ? "bg-white text-black"
                    : "bg-white/10 text-white"
                }`}
              >
                Lead
              </button>
            </div>
          </header>

          {tab === "chat" ? (
            <div className="flex flex-col h-[420px]">
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={`${msg.role}-${idx}`}
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "ml-auto bg-white text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 px-3 py-3 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendChat();
                  }}
                  className="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
                  placeholder="Ask about services, pricing, timelines..."
                />
                <button
                  type="button"
                  onClick={sendChat}
                  disabled={!canSend}
                  className="rounded-full bg-white text-black px-3 py-2 text-xs font-semibold disabled:opacity-50"
                >
                  {sending ? "..." : "Send"}
                </button>
              </div>
            </div>
          ) : null}

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

          {tab === "lead" ? (
            <form onSubmit={submitLead} className="p-4 space-y-3">
              <input
                value={lead.name}
                onChange={(e) => setLead({ ...lead, name: e.target.value })}
                className="w-full bg-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
                placeholder="Your name"
              />
              <input
                value={lead.email}
                onChange={(e) => setLead({ ...lead, email: e.target.value })}
                className="w-full bg-white/10 rounded-full px-4 py-2 text-sm focus:outline-none"
                placeholder="Email address"
              />
              <textarea
                value={lead.message}
                onChange={(e) => setLead({ ...lead, message: e.target.value })}
                className="w-full bg-white/10 rounded-2xl px-4 py-2 text-sm focus:outline-none"
                placeholder="Tell us about your project (optional)"
                rows={3}
              />
              <button
                type="submit"
                className="w-full rounded-full bg-white text-black px-4 py-2 text-sm font-semibold"
              >
                Submit
              </button>
              {leadStatus ? (
                <p className="text-xs text-slate-300">{leadStatus}</p>
              ) : null}
            </form>
          ) : null}
        </section>
      ) : null}
    </>
  );
};

export default ChatWidget;
