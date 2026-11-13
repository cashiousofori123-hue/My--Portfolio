# Cashious Ofori: portfolio

My portfolio, where businesses register for an online shop, pay their deposit and chat with my assistant.
React + Vite on Vercel, with an admin page (Supabase) and a chat assistant (Google Gemini).

```bash
npm install
npm run dev      # http://localhost:5173 (the admin page is http://localhost:5173/admin)
npm run build
```

## Changing what the portfolio says: the admin page

Open **your-site/admin** (for example `https://portfolio-efaristo.vercel.app/admin`), log in, change anything and press
**Save**. Refresh the site to see it. You can change:

- **Profile:** photo, name, role, the label on your photo, headline, about you, location, the pills under your bio
- **What I do:** add, remove and reorder skills; for each, a drawing or your own photo
- **Projects:** add, remove and reorder; a screenshot makes a project show big
- **Online shop offer:** the short and full lists, the steps, the choices in the register form
- **Contact and payments:** email, WhatsApp numbers, Paystack public key, Mobile Money details, the example shop link
- **Chat assistant:** on or off, its name, its first message, and extra things it should know
- **Welcome screen** and **Links** (GitHub, LinkedIn, Facebook)

Pictures are made smaller automatically before they upload. Until the admin page is set up (below), the site shows
the starting content written in `src/content.js`.

## Admin page: setting it up (once)

1. **Supabase:** go to **supabase.com**, create a free account and a **New project** (region closest to Ghana).
2. Open **SQL Editor → New query**, paste **all** of `supabase/setup.sql` and press **Run** ("Success").
   It creates the content table, the picture folder, and makes `cashiousofori123@gmail.com` the admin.
   To log in with another email, change it in the last line of the file first.
3. **Your login:** **Authentication → Users → Add user → Create new user**: your email and a strong password,
   with **Auto Confirm User** ticked.
4. **No strangers:** **Authentication → Sign In / Providers → Email**: switch off **Allow new users to sign up**
   (older dashboards: Authentication → Settings). Only you can then log in.
5. **Forgot password links:** **Authentication → URL Configuration**: Site URL = your portfolio address, and add
   `https://your-portfolio-address/admin` under Redirect URLs.
6. **Vercel:** your portfolio project → **Settings → Environment Variables**, add
   `VITE_SUPABASE_URL` (Project Settings → API → Project URL) and `VITE_SUPABASE_ANON_KEY` (the anon / publishable key),
   then **Deployments → ⋯ → Redeploy**. Never use the service_role / secret key here.
7. Open your-site/admin, log in, and press **Save** once: from then on the site shows what is saved there.

## Chat assistant: switching it on (once)

The chat button (bottom right) answers visitors with Google Gemini, using what is on your page plus the extra
facts you add in the admin page.

1. Go to **aistudio.google.com**, log in with a Google account, open **Get API key → Create API key** and copy it.
2. In Vercel, portfolio project → **Settings → Environment Variables**: add `GOOGLE_GENERATIVE_AI_API_KEY` with the key,
   then **Redeploy**. The key stays on Vercel's server; it is never in the website code.
3. Ask it something. If it says it cannot answer, look at Vercel → the project → **Logs** for the reason.

The same key works for Dracula on the Efaristo site: add the same variable to the **efaristo-tech-lab** project and redeploy.
The free key has daily limits, which are plenty for a portfolio. On the free plan, Google may use chats to improve
its products; do not ask visitors for private details in the chat. To run it on your computer, put
`GOOGLE_GENERATIVE_AI_API_KEY=...` in a `.env` file here (never commit it).

## How clients register and pay

1. **Register:** the form under *Get an online shop for your business* opens your WhatsApp Business with the
   client's details typed in. Nothing is stored on the website.
2. **Agree the price** on WhatsApp. Prices are not shown on the site.
3. **Send them a pay link** with their deposit (50%) and business name filled in, for example:
   `https://your-portfolio-address/?pay=1250&for=Ama%27s%20Beauty#pay`
   (`pay` = amount in GHS, `for` = business name; write spaces as `%20` and `'` as `%27`).
4. **They pay** in the *Pay your 50% deposit* section:
   - With a Paystack public key (admin page → Contact and payments): by Mobile Money prompt or card. The payment,
     with their name, business and phone, shows in your Paystack dashboard, and Paystack emails them a receipt.
   - Without a Paystack key: your Mobile Money number is shown, and they send you the transaction ID on WhatsApp.
   - With neither: a button asks you on WhatsApp how to pay.

Only the Paystack **public** key (`pk_…`) ever goes in the portfolio; the admin page refuses a secret key.

## Files

| File | What it is |
|---|---|
| `src/content.js` | The starting content (words and pictures) and how saved content is combined with it |
| `src/admin/Admin.jsx` | The admin page (your-site/admin) |
| `supabase/setup.sql` | The admin page's database, picture folder and who may edit |
| `api/chat.js` | The chat assistant's server function (Google Gemini) |
| `src/ChatBot.jsx`, `src/ChatPanel.jsx` | The chat button and window (the window loads on the first tap) |
| `src/App.jsx` | The page layout: profile, shop offer, What I do, Projects, footer |
| `src/GetAShop.jsx` | *Get an online shop* (what's included, register form, how it works) and *Pay your 50% deposit* |
| `src/Art.jsx` | The drawings on the skill cards (in the theme colour) |
| `src/App.css` | All styles; colours come from the theme picker (`data-palette` on `<html>`) |
| `vercel.json` | Opens the admin page at /admin, and gives the chat up to 30 seconds |
