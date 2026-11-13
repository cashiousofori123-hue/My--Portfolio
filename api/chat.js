// POST /api/chat: the portfolio's chat assistant. Vercel runs this file as a server function.
// It answers with Google Gemini, using the free key from aistudio.google.com in the Vercel environment variable
// GOOGLE_GENERATIVE_AI_API_KEY. "gemini-flash-latest" always points to Google's newest fast model; set
// GEMINI_MODEL in Vercel to use another one. The facts it answers from are sent by the page (ChatBot.jsx).
import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";

const MODEL = process.env.GEMINI_MODEL || "gemini-flash-latest";
const SORRY = "Sorry, I can't answer right now. Please message on WhatsApp instead, using the button on this page.";

const rules = (name) => `You are ${name}, the friendly assistant on the portfolio website of the person described in the FACTS below.
Visitors are often small business owners in Ghana.

- Answer questions about the services, projects, the online shop offer, how to register and how to pay the deposit, using ONLY the FACTS.
- Encourage interested visitors to register in the "Get an online shop" section of the page, or to message on WhatsApp.
- Prices are agreed on WhatsApp: never invent a price, a timeline or a service that is not in the FACTS. If you do not know, say so and give the WhatsApp contact.
- Never ask for or accept Mobile Money PINs, card numbers or passwords.
- Keep answers short: one to four sentences of plain text, without markdown. Be friendly and professional, and reply in the visitor's language.
- Call the portfolio owner by their first name.
- If a question has nothing to do with the services, answer briefly if it is harmless, then offer help with a project.`;

// Only the latest part of the conversation, and only text, so one visitor cannot use up the free quota.
const cleanMessages = (messages) =>
  (Array.isArray(messages) ? messages : [])
    .slice(-12)
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({
      id: String(m.id || ""),
      role: m.role,
      parts: (Array.isArray(m.parts) ? m.parts : [])
        .filter((p) => p && p.type === "text")
        .map((p) => ({ type: "text", text: String(p.text || "").slice(0, 1500) })),
    }))
    .filter((m) => m.parts.length);

export async function POST(request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("The assistant is off: add GOOGLE_GENERATIVE_AI_API_KEY in Vercel -> Settings -> Environment Variables.");
    return Response.json({ error: SORRY }, { status: 503 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const messages = cleanMessages(body.messages);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return Response.json({ error: "Ask a question first" }, { status: 400 });
  }
  const name = String(body.name || "the assistant").slice(0, 40);
  const facts = String(body.context || "").slice(0, 8000);

  const result = streamText({
    model: google(MODEL),
    system: `${rules(name)}\n\nFACTS FROM THE WEBSITE:\n${facts}`,
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 500,
  });

  return result.toUIMessageStreamResponse({
    onError: (error) => {
      // The real reason shows in Vercel -> the project -> Logs; the visitor sees a friendly message.
      console.error("The assistant could not answer:", error);
      return SORRY;
    },
  });
}
