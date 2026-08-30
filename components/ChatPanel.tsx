"use client";

import { useState, useRef, useEffect } from "react";

const initialMessages = [
  { id: 1, user: "slop_fan", text: "a purple dragon in a shopping mall", me: false },
  { id: 2, user: "ai_streamer", text: "generating next scene...", me: false, system: true },
  { id: 3, user: "anon42", text: "make it rain neon", me: false },
  { id: 4, user: "levelsio", text: "🔥", me: false },
];

export default function ChatPanel() {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "you", text: input.trim(), me: true },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-zinc-900/80 shadow-xl ring-1 ring-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          Live chat
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-zinc-400 hover:text-white"
          aria-label={open ? "Collapse chat" : "Expand chat"}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <>
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto p-4"
            role="log"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div key={m.id} className="text-sm">
                <span
                  className={`font-semibold ${
                    m.me
                      ? "text-[#C5156B]"
                      : m.system
                      ? "text-zinc-500"
                      : "text-[#8E2DE2]"
                  }`}
                >
                  {m.user}
                </span>
                <span className="text-zinc-400">: </span>
                <span className="text-zinc-200">{m.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="border-t border-white/10 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type anything and AI will generate next"
              className="w-full rounded-full bg-black/50 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none ring-1 ring-white/10 focus:ring-[#C5156B]"
            />
          </form>
        </>
      )}
    </div>
  );
}
