// ============================================================================================
// EVERYTHING YOUR PORTFOLIO SAYS
//
// The easy way to change it: open your-site/admin, log in, edit and press Save.
// What you save there replaces what is written below. This file is the starting content, and what
// the site shows if the admin database is not connected.
//
// Editing here instead: change the words between the quotes "like this", save, then push to GitHub.
// Keep the quotes and the commas at the line ends.
//
// Pictures: "@profile", "@splash" and "@efaristo" are the pictures in src/assets/ (see IMAGES below).
// Pictures uploaded in the admin page are saved as web addresses instead.
// ============================================================================================

import profilePhoto from "./assets/profile.webp";
import splashPhoto from "./assets/splash.jpeg";
import efaristoShot from "./assets/work/efaristo.webp";

export const IMAGES = { profile: profilePhoto, splash: splashPhoto, efaristo: efaristoShot };
// "@profile" -> the picture from src/assets; an uploaded picture's address stays as it is.
export const imageUrl = (v) => (typeof v === "string" && v.startsWith("@") ? IMAGES[v.slice(1)] || "" : v || "");

// The drawings a skill can use (Art.jsx), with the names shown in the admin page.
export const ART_CHOICES = [
  ["shop", "Online shop"],
  ["web", "Website"],
  ["app", "App"],
  ["bot", "Chatbot"],
  ["automation", "Automation"],
  ["python", "Python code"],
  ["arduino", "Arduino board"],
  ["matlab", "Graph (MATLAB)"],
  ["repair", "Repair"],
];

export const DEFAULT_CONTENT = {
  // ---------- ABOUT YOU (the big card at the top) ----------
  profile: {
    firstName: "Cashious",
    lastName: "Ofori",
    role: "Computer Engineer",
    photo: "@profile",
    status: "Open to work", // the small label on your photo; "" hides it
    headline: "I build online shops, websites, apps and AI chatbots for businesses.",
    bio: "I design and build web experiences, apps and AI-powered tools, and I program hardware with Arduino and Python, with a focus on clean code and thoughtful design.",
    location: "Based in Ghana",
    // The small pills under your bio: [bold word, normal words]
    badges: [
      ["React", "Vite"],
      ["Next.js", "Vercel AI SDK"],
      ["Python", "Arduino"],
      ["Paystack", "Supabase"],
      ["Efaristo", "Tech Lab"],
    ],
  },

  // The welcome screen shown once when someone opens the site.
  welcome: {
    photo: "@splash",
    title: "Welcome to my",
    titleHighlight: "portfolio", // shown in your theme colour
    text: "Thank you for visiting. Take a look at my work in computer engineering and software development.",
  },

  links: {
    github: "https://github.com/cashiousofori123-hue",
    linkedin: "https://www.linkedin.com/in/cashious-ofori-2a8721351",
    facebook: "https://www.facebook.com/share/18D2aXvo5g/",
  },

  // ---------- CONTACT AND PAYMENTS ----------
  contact: {
    email: "cashiousofori123@gmail.com",
    // WhatsApp numbers: country code + number, no + or spaces or leading 0
    whatsappBusiness: "233554068969",
    whatsappPersonal: "233546149938",
    // Paystack PUBLIC key (pk_live_… or pk_test_…), never the secret key. Empty = clients see the MoMo details.
    paystackPublicKey: "",
    momoNumber: "054 614 9938",
    momoName: "Grace Donkor",
    momoNetwork: "MTN",
    exampleShopUrl: "https://rabis-chic-fashion-hub.vercel.app",
  },

  // ---------- THE CHAT ASSISTANT (bottom right) ----------
  chat: {
    enabled: true,
    name: "Cashious AI",
    greeting: "Hi! 👋 I'm Cashious's assistant. Ask me about websites, online shops, apps, chatbots, Arduino or Python projects, or how to get started.",
    // Anything else the assistant should know, for example how long a project takes. One fact per line.
    facts: "",
  },

  // ---------- WHAT I DO ----------
  // art: the drawing (see ART_CHOICES above), or image: a picture ("@name" or a web address) shown instead.
  skills: [
    {
      art: "shop",
      title: "Online shops for businesses",
      text: "A complete shop website with Mobile Money and card payments, order tracking and an admin portal the owner runs from their phone.",
      tags: ["React", "Supabase", "Paystack"],
    },
    {
      art: "web",
      title: "Web development",
      text: "Fast, responsive websites for businesses and people, with dark and light modes, smooth interactions and clean design.",
      tags: ["React", "Next.js", "Vite"],
    },
    {
      art: "app",
      title: "App development",
      text: "Apps for phones, like the Efaristo Calculator Android app, and web apps customers install, with accounts, notifications and admin dashboards.",
      tags: ["Android", "Web apps", "Dashboards"],
    },
    {
      art: "bot",
      title: "AI chatbots and bot integration",
      text: "Chat assistants that answer customers for you, like Dracula on the Efaristo site, added to your website and connected to your business.",
      tags: ["AI SDK", "Gemini", "Integration"],
    },
    {
      art: "automation",
      title: "Business automation",
      text: "Assistants that read online forms, explain what is needed and help fill them in, for Google Forms and other websites.",
      tags: ["Next.js", "Automation", "Forms"],
    },
    {
      art: "python",
      title: "Python programming",
      text: "Scripts and tools that save time: automating tasks, working with data and files, and connecting systems together.",
      tags: ["Python", "Scripts", "Data"],
    },
    {
      art: "arduino",
      title: "Arduino and electronics",
      text: "Smart devices and prototypes with sensors, LEDs, motors and displays, programmed with Arduino.",
      tags: ["Arduino", "C++", "Sensors"],
    },
    {
      art: "matlab",
      title: "MATLAB",
      text: "Engineering calculations, simulations and clear graphs to understand and present data.",
      tags: ["MATLAB", "Simulation", "Graphs"],
    },
    {
      art: "repair",
      title: "Computer engineering and repair",
      text: "Solid hardware and software foundations, and running Efaristo Fix Tech Lab, a phone and laptop repair lab in Accra and Assin Fosu.",
      tags: ["Hardware", "Software", "Device repair"],
    },
  ],

  // ---------- PROJECTS ----------
  // image: a screenshot (optional). A project with a picture takes a whole row, with the picture beside the text.
  projects: [
    {
      icon: "🛍️",
      title: "Rabi’s Chic Fashion Hub",
      text: "Online shop for a fashion boutique. Customers order and pay by Mobile Money prompt or card, track their orders and get invoices; the owner adds products and confirms payments from an admin portal.",
      tags: ["React", "Supabase", "Paystack"],
      href: "https://rabis-chic-fashion-hub.vercel.app",
      cta: "Visit the shop",
      image: "",
    },
    {
      icon: "🤖",
      title: "Dracula AI assistant",
      text: "A chat assistant on the Efaristo site that answers customer questions about services and prices.",
      tags: ["Next.js", "AI SDK", "Gemini"],
      href: "https://efaristo-tech-lab.vercel.app",
      cta: "See it on the site",
      image: "",
    },
    {
      icon: "🔧",
      title: "Efaristo Fix Tech Lab website",
      text: "Website for a phone repair lab in Accra and Assin Fosu, showing services, prices and contact details.",
      tags: ["Next.js", "Tailwind", "Vercel"],
      href: "https://efaristo-tech-lab.vercel.app",
      cta: "Visit site",
      image: "@efaristo",
    },
  ],

  // ---------- THE ONLINE SHOP OFFER ----------
  shop: {
    // The short list on the card next to your profile.
    highlights: [
      "Customers order and pay by Mobile Money or card",
      "Payments confirmed automatically, straight to your account",
      "Add products and manage orders from your phone",
      "Your name, logo and colours",
    ],
    // The full list under "What you get".
    features: [
      "Your own shop website with your name, logo and colours",
      "Customers pay by Mobile Money prompt, card, bank transfer or on delivery",
      "Online payments are confirmed automatically (Paystack), straight to your account",
      "An admin portal on your phone: add products with photos, sizes and colours, see and confirm orders",
      "Invoices, order tracking and email updates for your customers",
      "Discount codes, banners and announcements with phone notifications",
      "Customer accounts, saved items and a WhatsApp chat button",
      "Secure admin login with two-step verification",
    ],
    // "How it works": [title, text]
    steps: [
      ["Register", "Fill in the form above and tell me about your business."],
      ["Agree the price", "I contact you on WhatsApp, explain what is included and give you a price."],
      ["Pay a 50% deposit", "Pay half here by Mobile Money or card to book your shop."],
      ["I build your shop", "Your name, colours, products and payment details, ready to sell."],
      ["Go live", "You pay the rest when the shop is live, and I show you how to run it."],
    ],
    // The choices under "What do you sell?" in the register form.
    kinds: ["Fashion and clothing", "Beauty and skincare", "Food and drinks", "Phones and electronics", "Other"],
  },
};

// Saved content from the admin page, on top of the starting content above (missing parts keep their default).
export function mergeContent(saved) {
  const s = saved && typeof saved === "object" ? saved : {};
  const out = { ...DEFAULT_CONTENT };
  for (const key of Object.keys(DEFAULT_CONTENT)) {
    const d = DEFAULT_CONTENT[key];
    const v = s[key];
    if (v == null) continue;
    if (Array.isArray(d)) out[key] = Array.isArray(v) ? v : d;
    else out[key] = typeof v === "object" && !Array.isArray(v) ? { ...d, ...v } : d;
  }
  return out;
}
