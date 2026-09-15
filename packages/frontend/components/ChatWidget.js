"use client";

// AI chatbot widget — layout, colors, and theme from the ui-design-reference
// skill (Section 1). Backed by the Gemini-powered, schedule-aware /ai/chat
// endpoint. Renders as a floating launcher that opens a chat panel.

import { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";

const QUICK_REPLIES = ["When's my next shift?", "Request time off", "How do I swap a shift?"];

function ChatBubble({ from, children }) {
  const isUser = from === "user";
  return (
    <div
      className={[
        "max-w-[78%] px-4 py-2.5 text-sm leading-snug whitespace-pre-wrap",
        isUser
          ? "self-end bg-[#5B8DEF] text-white rounded-[18px_18px_6px_18px]"
          : "self-start bg-[#F1F2F6] text-[#1A1A2E] rounded-[18px_18px_18px_6px]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function ChatWidget({ company = "ShiftFlow", botName = "Flow" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hey! 👋 How can I help you with your shifts today?" },
  ]);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function send(text) {
    const msg = (text ?? value).trim();
    if (!msg || sending) return;
    setValue("");

    // history = prior turns in the Gemini {role, text} shape
    const history = messages.map((m) => ({
      role: m.from === "user" ? "user" : "model",
      text: m.text,
    }));

    setMessages((m) => [...m, { from: "user", text: msg }]);
    setSending(true);
    try {
      const { reply } = await api.chat(msg, history);
      setMessages((m) => [...m, { from: "bot", text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { from: "bot", text: "Sorry — I couldn't reach the assistant just now. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        title="Chat with Flow"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white text-2xl
                   grid place-items-center shadow-[0_10px_30px_rgba(91,141,239,0.5)]
                   hover:scale-110 transition-transform duration-200"
        style={{ background: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
      >
        ✦
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px]
                 max-h-[calc(100vh-3rem)] bg-[#F8F9FA] rounded-[28px] overflow-hidden
                 flex flex-col shadow-[0_24px_60px_rgba(26,26,46,0.18)]
                 animate-fade-in-up"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <span className="font-bold text-[#1A1A2E] text-[15px]">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #5B8DEF, #9B7BFF)" }}
          >
            ◈
          </span>{" "}
          {company}
        </span>
        <div className="flex gap-3.5 text-[#7A8194] text-lg">
          <button title="Reset" onClick={() => setMessages([{ from: "bot", text: "Fresh start! How can I help?" }])}>⟳</button>
          <button title="Close" onClick={() => setOpen(false)}>✕</button>
        </div>
      </div>

      {/* Intro */}
      <div className="text-center px-6 pb-3">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-3 shadow-[0_6px_20px_rgba(155,123,255,0.35)]"
          style={{ background: "conic-gradient(from 180deg, #5B8DEF, #9B7BFF, #E36AC9, #5BD4EF, #5B8DEF)" }}
        />
        <h2 className="text-[#1A1A2E] text-lg font-semibold">Hi, I'm {botName}</h2>
        <p className="text-[#8A8FA3] text-[13px]">Your AI assistant for shifts &amp; schedules.</p>
      </div>

      <div className="text-center text-[#8A8FA3] text-xs mb-2">Today</div>

      {/* Log */}
      <div ref={logRef} className="flex-1 overflow-y-auto px-[18px] flex flex-col gap-2.5">
        {messages.map((m, i) => (
          <ChatBubble key={i} from={m.from}>{m.text}</ChatBubble>
        ))}
        {sending && (
          <div className="self-start bg-[#F1F2F6] text-[#8A8FA3] px-4 py-2.5 rounded-[18px_18px_18px_6px] text-sm">
            Flow is typing…
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div className="flex flex-wrap gap-2 px-[18px] pt-2 pb-1">
        {QUICK_REPLIES.map((label) => (
          <button
            key={label}
            onClick={() => send(label)}
            disabled={sending}
            className="border border-accent/30 text-accent bg-white px-3.5 py-2
                       rounded-full text-[13px] hover:bg-accent/10 hover:border-accent/50
                       disabled:opacity-50 transition-all duration-200"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2.5 px-4 pt-2 pb-2">
        <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2.5 border border-[#E6E8EE]">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message…"
            className="flex-1 border-none outline-none text-sm text-[#1A1A2E] bg-transparent"
          />
        </div>
        <button
          onClick={() => send()}
          disabled={sending}
          title="Send"
          className="w-[42px] h-[42px] rounded-full bg-accent text-white text-lg grid place-items-center
                     disabled:opacity-50 hover:bg-accent-light transition-colors duration-200
                     shadow-[0_4px_12px_rgba(91,141,239,0.3)]"
        >
          ↑
        </button>
      </div>

      <div className="text-center text-[11px] text-[#8A8FA3] pb-3">Powered by {company}</div>
    </div>
  );
}
