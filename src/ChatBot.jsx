import { Suspense, lazy, useState } from "react";

const ChatPanel = lazy(() => import("./ChatPanel.jsx"));

// The chat button at the bottom right. The chat window (and the AI library) loads on the first tap.
export default function ChatBot({ content }) {
  const { chat } = content;
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);

  const toggle = () => {
    setStarted(true);
    setOpen((o) => !o);
  };

  return (
    <>
      {started && (
        <Suspense fallback={null}>
          <ChatPanel content={content} open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
      <button type="button" className="chatbot-btn" onClick={toggle} aria-expanded={open} aria-label={open ? "Close chat" : `Chat with ${chat.name}`}>
        <span aria-hidden="true">{open ? "×" : "💬"}</span>
        {!open && <span className="chatbot-btn-label">Chat with {chat.name}</span>}
      </button>
    </>
  );
}
