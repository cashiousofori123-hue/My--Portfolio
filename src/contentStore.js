import { createContext, useContext } from "react";
import { DEFAULT_CONTENT } from "./content.js";

// The admin database (Supabase). Both values are public by design: the database rules decide who may change what.
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || "").trim().replace(/\/+$/, "");
export const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();
export const hasDatabase = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
export const IMAGE_BUCKET = "portfolio";

// The content saved in the admin page, read without the full Supabase library so the public page stays light.
export async function fetchSavedContent() {
  if (!hasDatabase) return null;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/portfolio?id=eq.1&select=content`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`The saved content could not be loaded (${res.status})`);
  const rows = await res.json();
  return rows[0] ? rows[0].content : null;
}

export const ContentContext = createContext(DEFAULT_CONTENT);
export const useContent = () => useContext(ContentContext);
