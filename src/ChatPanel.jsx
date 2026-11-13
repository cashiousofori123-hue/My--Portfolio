import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const SUGGESTIONS = ["What do you build?", "How much is an online shop?", "How do I pay the deposit?", "Can you build an Arduino project?"];

// What the assistant knows, written from the live content, so it changes when the site is edited.
function siteFacts({ profile, skills, projects, shop, contact, chat }) {
  return [
    `Name: ${profile.firstName} ${profile.lastName}`,
    `Role: ${profile.role}. ${profile.location}.`,
    `Headline: ${profile.headline}`,
    `About: ${profile.bio}`,
    "",
    "Services:",
    ...skills.map((s) => `- ${s.title}: ${s.text}`),
    "",
    "Projects:",
    ...projects.map((p) => `- ${p.title}: ${p.text}${p.href ? ` (${p.href})` : ""}`),
    "",
    "Online shop offer, what the client gets:",
    ...shop.features.map((t) => `- ${t}`),
    "How it works:",
    ...shop.steps.map(([title, text], i) => `${i + 1}. ${title}: ${text}`),
    "Prices are not listed on the site: the price is agreed on WhatsApp, then the client pays a 50% deposit in the 'Pay your 50% deposit' section of this page, and the rest when the shop is live.",
    contact.exampleShopUrl && `A live example shop to try: ${contact.exampleShopUrl}`,
    "To register: the 'Register for your shop' form in the 'Get an online shop' section of this page sends the details on WhatsApp.",
    contact.paystackPublicKey
      ? "Deposit payment: by Mobile Money prompt or card through Paystack, on this page."
      : contact.momoNumber
        ? `Deposit payment: Mobile Money to ${contact.momoNumber} (${contact.momoNetwork}), name ${contact.momoName}, then send the transaction ID on WhatsApp.`
        : "Deposit payment: ask on WhatsApp.",
    "",
    "Contact:",
    contact.whatsappBusiness && `- WhatsApp Business: +${contact.whatsappBusiness} (https://wa.me/${contact.whatsappBusiness})`,
    contact.email && `- Email: ${contact.email}`,
    chat.facts && `\nMore facts:\n${chat.facts}`,
  ]
    .filter((line) => typeof line === "string")
    .join("\n");
}

const URL_RE = /(https?:\/\/[^\s)]+)/g;
// Plain text with clickable links (the assistant is asked not to use formatting; any **bold** marks are removed).
function Message({ text }) {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .split(URL_RE)
    .map((part, i) => (i % 2 ? <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a> : part));
}

// The chat window. ChatBot.jsx loads this file the first time the chat button is tapped, so visitors who never
// open the chat do not download the AI library. It stays mounted when closed, so the conversation is kept.
export default function ChatPanel({ content, open, onClose }) {
  const { chat, contact } = content;
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const facts = useMemo(() => siteFacts(content), [content]);
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status, error } = useChat({ transport });
  // After an error the chat stays usable, so the visitor can simply ask again.
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, status]);

  const ask = (text) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t }, { body: { context: facts, name: chat.name } });
    setInput("");
  };

  return (
    <div className="chatbot-panel" role="dialog" aria-label={`Chat with ${chat.name}`} hidden={!open}>
      <div className="chatbot-head">
        <span className="chatbot-avatar" aria-hidden="true">🤖</span>
        <div>
          <p className="chatbot-name">{chat.name}</p>
          <p className="chatbot-sub">Usually answers in seconds</p>
        </div>
        <button type="button" className="chatbot-close" onClick={onClose} aria-label="Close chat">×</button>
      </div>

      <div className="chatbot-list" ref={listRef}>
        <div className="chatbot-msg bot">{chat.greeting}</div>
        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          if (!text) return null;
          return (
            <div key={m.id} className={`chatbot-msg ${m.role === "user" ? "me" : "bot"}`}>
              <Message text={text} />
            </div>
          );
        })}
        {status === "submitted" && (
          <div className="chatbot-msg bot chatbot-typing" aria-label="Typing">
            <span /><span /><span />
          </div>
        )}
        {error && !busy && (
          <div className="chatbot-msg bot">
            Sorry, I couldn&apos;t answer just now. Try again, or{" "}
            <a href={`https://wa.me/${contact.whatsappBusiness}`} target="_blank" rel="noopener noreferrer">message me on WhatsApp</a>.
          </div>
        )}
        {messages.length === 0 && (
          <div className="chatbot-chips">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => ask(s)}>{s}</button>
            ))}
          </div>
        )}
      </div>

      <form
        className="chatbot-form"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question…" maxLength={500} aria-label="Your question" />
        <button type="submit" className="chatbot-send" disabled={busy || !input.trim()} aria-label="Send">➤</button>
      </form>
    </div>
  );
}
