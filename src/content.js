// ============================================================================================
// EVERYTHING YOUR PORTFOLIO SAYS, IN ONE PLACE
//
// To change something: edit the words between the quotes "like this", save the file, then push
// to GitHub (the live site updates by itself). Keep the quotes and the commas at the line ends.
//
// To change a picture: put the new picture in src/assets/ (or src/assets/work/), then change the
// file name in the matching "import" line just below. Example: to use a new profile photo called
// me.jpg, put it in src/assets/ and change the first line to:  import profilePhoto from "./assets/me.jpg";
//
// Contact numbers, email and payment details are in business.js.
// ============================================================================================

import profilePhoto from "./assets/profile.webp";
import splashPhoto from "./assets/splash.jpeg";
import efaristoShot from "./assets/work/efaristo.webp";
import { EXAMPLE_SHOP_URL } from "./business.js";

// ---------- ABOUT YOU (the big card at the top) ----------
export const PROFILE = {
  firstName: "Cashious",
  lastName: "Ofori",
  role: "Computer Engineer",
  photo: profilePhoto,
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
};

// The welcome screen shown once when someone opens the site.
export const WELCOME = {
  photo: splashPhoto,
  title: "Welcome to my", // the last word below is shown in your theme colour
  titleHighlight: "portfolio",
  text: "Thank you for visiting. Take a look at my work in computer engineering and software development.",
};

export const LINKS = {
  github: "https://github.com/cashiousofori123-hue",
  linkedin: "https://www.linkedin.com/in/cashious-ofori-2a8721351",
  facebook: "https://www.facebook.com/share/18D2aXvo5g/",
  efaristo: "https://efaristo-tech-lab.vercel.app",
};

// ---------- WHAT I DO ----------
// art: the drawing shown on the card. Choose one of:
//   shop, web, app, bot, automation, python, arduino, matlab, repair
// image: your own photo instead of the drawing (import it at the top, then write  image: myPhoto,)
// To add a skill, copy one block from { to }, paste it, and change the words.
export const SKILLS = [
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
    text: "Web apps that customers install on their phones, with accounts, notifications and admin dashboards to run the business.",
    tags: ["Web apps", "Mobile", "Dashboards"],
  },
  {
    art: "bot",
    title: "AI chatbots and bot integration",
    text: "Chat assistants that answer customers for you, like Dracula on the Efaristo site, added to your website and connected to your business.",
    tags: ["Vercel AI SDK", "Chatbots", "Integration"],
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
];

// ---------- PROJECTS ----------
// image: a screenshot (optional). A project with a picture takes a whole row, with the picture beside the text.
export const PROJECTS = [
  {
    icon: "🛍️",
    title: "Rabi’s Chic Fashion Hub",
    text: "Online shop for a fashion boutique. Customers order and pay by Mobile Money prompt or card, track their orders and get invoices; the owner adds products and confirms payments from an admin portal.",
    tags: ["React", "Supabase", "Paystack"],
    href: EXAMPLE_SHOP_URL,
    cta: "Visit the shop",
  },
  {
    icon: "🤖",
    title: "Dracula AI assistant",
    text: "A chat assistant on the Efaristo site that answers customer questions about services and prices.",
    tags: ["Next.js", "Vercel AI SDK", "Chat UI"],
    href: LINKS.efaristo,
    cta: "See it on the site",
  },
  {
    icon: "🔧",
    title: "Efaristo Fix Tech Lab website",
    text: "Website for a phone repair lab in Accra and Assin Fosu, showing services, prices and contact details.",
    tags: ["Next.js", "Tailwind", "Vercel"],
    href: LINKS.efaristo,
    cta: "Visit site",
    image: efaristoShot,
  },
];

// ---------- THE ONLINE SHOP OFFER ----------
export const SHOP = {
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
};
