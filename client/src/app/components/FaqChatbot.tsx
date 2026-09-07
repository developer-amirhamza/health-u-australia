"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BsChatDotsFill } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { faqEntries } from "../data/faq";
import { matchFaq } from "../../utils/faqMatcher";

interface Message {
  role: "user" | "bot";
  text: string;
  link?: { href: string; label: string };
}

const GREETING: Message = {
  role: "bot",
  text: "Hi! I'm the Health U FAQ assistant. Ask me a question about our services, NDIS, SIL housing, or how to get in touch — or tap a suggestion below.",
};

const FALLBACK: Message = {
  role: "bot",
  text: "I don't have an answer for that yet. For anything specific, our team is happy to help directly.",
  link: { href: "/contact-us", label: "Contact Us" },
};

const SUGGESTED_IDS = ["what-is-ndis", "services-overview", "what-is-sil", "referral", "contact-details"];
const suggestedQuestions = SUGGESTED_IDS.map(
  (id) => faqEntries.find((entry) => entry.id === id)!
).filter(Boolean);

export default function FaqChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const ask = (question: string) => {
    if (!question.trim()) return;
    const match = matchFaq(question, faqEntries);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      match ? { role: "bot", text: match.answer, link: match.link } : FALLBACK,
    ]);
    setInputValue("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    ask(inputValue);
  };

  return (
    <div className="fixed bottom-22 right-9 z-50 flex flex-col items-start gap-3">
      {isOpen && (
        <div className="w-[min(90vw,340px)] h-[min(70vh,480px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-primary text-white px-4 py-3 font-semibold">Health U FAQ Assistant</div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-snug ${message.role === "user"
                    ? "self-end bg-primary text-white"
                    : "self-start bg-white text-gray-800 border border-gray-200"
                  }`}
              >
                <p>{message.text}</p>
                {message.link && (
                  <Link
                    href={message.link.href}
                    className="inline-block mt-1.5 text-xs font-semibold text-secondary underline"
                  >
                    {message.link.label} →
                  </Link>
                )}
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-col gap-1.5 mt-1">
                {suggestedQuestions.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => ask(entry.question)}
                    className="text-left text-xs px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-secondary/10 hover:border-secondary transition-colors"
                  >
                    {entry.question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-gray-200 p-2">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask a question..."
              className="flex-1 outline-none text-sm px-3 py-2 rounded-full border border-gray-200 focus:border-secondary"
            />
            <button
              type="submit"
              aria-label="Send"
              className="sm:w-9 sm:h-9 w-7 h-7 shrink-0 rounded-full bg-primary text-white flex items-center justify-center hover:bg-[#be0505] transition-colors"
            >
              <IoSend size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open FAQ chat"
        className="w-12 h-12 rounded-full bg-primary text-white shadow-xl flex items-center justify-center hover:bg-[#be0505] transition-colors"
      >
        {isOpen ? <AiOutlineClose size={22} /> : <BsChatDotsFill size={22} />}
      </button>
    </div>
  );
}
