import { useEffect, useState } from "react";
import "./App.css";
import splashImg from "./assets/splash.jpeg";
import profileImg from "./assets/profile.png";

const FIRST_NAME = "Cashious";
const LAST_NAME = "Ofori";
const ROLE = "Computer Engineer";

// CONTACT LINKS
const EMAIL = "cashiousofori123@gmail.com";
const GITHUB_URL = "https://github.com/cashiousofori123-hue";
const LINKEDIN_URL = "https://www.linkedin.com/in/cashious-ofori-2a8721351";
const FACEBOOK_URL = "https://www.facebook.com/share/18D2aXvo5g/";
// WhatsApp numbers: country code + number, no + or spaces or leading 0
const WHATSAPP_BUSINESS = "233554068969";
const WHATSAPP_PERSONAL = "233546149938";
const WORK_URL = "https://efaristo-tech-lab.vercel.app";

// Theme colors shown in the "Choose a theme" picker
const PALETTES = [
  { id: "blue", name: "Tech Blue", color: "#0A84FF" },
  { id: "emerald", name: "Emerald", color: "#00C853" },
  { id: "purple", name: "Royal Purple", color: "#7B2FFF" },
  { id: "orange", name: "Sunset Orange", color: "#FF6D00" },
  { id: "pink", name: "Lucid Pink", color: "#FF2D75" },
  { id: "cyan", name: "Lucid Cyan", color: "#00BCD4" },
];

// Social icons (16x16 SVG paths, Bootstrap Icons, MIT license)
const ICON_PATHS = {
  whatsapp: "M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232",
  whatsappBusiness: "M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zM5.8 4.6h2.7c1.4 0 2.3.7 2.3 1.7 0 .7-.4 1.2-1 1.5.9.2 1.5.8 1.5 1.7 0 1.2-1 1.9-2.5 1.9H5.8zM7.3 5.8v1.5h1c.5 0 .8-.3.8-.75s-.3-.75-.8-.75zm0 2.6v1.8h1.2c.6 0 1-.3 1-.9s-.4-.9-1-.9z",
  linkedin: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z",
  github: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8",
  email: "M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z",
  facebook: "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951",
};

// Brand colors for social icons (GitHub stays theme-colored via currentColor)
const ICON_COLORS = {
  whatsapp: "#25D366",
  whatsappBusiness: "#25D366",
  linkedin: "#0A66C2",
  email: "#1512dca5",
  facebook: "#1877F2",
};

const SOCIALS = [
  {
    label: "WhatsApp Business",
    icon: "whatsappBusiness",
    href: `https://wa.me/${WHATSAPP_BUSINESS}?text=${encodeURIComponent("Hello, I found you through your portfolio.")}`,
  },
  {
    label: "WhatsApp Personal",
    icon: "whatsapp",
    href: `https://wa.me/${WHATSAPP_PERSONAL}?text=${encodeURIComponent("Hello, I found you through your portfolio.")}`,
  },
  { label: "LinkedIn", icon: "linkedin", href: LINKEDIN_URL },
  { label: "GitHub", icon: "github", href: GITHUB_URL },
  { label: "Email", icon: "email", href: `mailto:${EMAIL}` },
  { label: "Facebook", icon: "facebook", href: FACEBOOK_URL },
];

const SocialIcon = ({ name }) => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill={ICON_COLORS[name] || "currentColor"} aria-hidden="true">
    <path d={ICON_PATHS[name]} fillRule={name === "whatsappBusiness" ? "evenodd" : "nonzero"} />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const SKILLS = [
  {
    icon: "💻",
    title: "Frontend development",
    text: "Fast, responsive interfaces with dark and light modes, theme pickers and smooth interactions, built with React and Vite.",
    tags: ["React", "Vite", "Responsive UI"],
  },
  {
    icon: "🤖",
    title: "AI chatbots",
    text: "Conversational assistants like Dracula for the Efaristo Fix Tech Lab website, built with Next.js and the Vercel AI SDK.",
    tags: ["Next.js", "Vercel AI SDK", "Chat UI"],
  },
  {
    icon: "📋",
    title: "Business automation",
    text: "Building assistants that read online forms, explain what is needed and help fill them in, for Google Forms and other websites.",
    tags: ["Next.js", "Automation", "Forms"],
  },
  {
    icon: "🖥️",
    title: "Computer engineering",
    text: "Solid hardware and software foundations, from web apps to running Efaristo Fix Tech Lab, a phone repair lab in Accra and Assin Fosu.",
    tags: ["Hardware", "Software", "Device repair"],
  },
];

const PROJECTS = [
  {
    icon: "🔧",
    title: "Efaristo Fix Tech Lab website",
    text: "Website for a phone repair lab in Accra and Assin Fosu, showing services, prices and contact details.",
    tags: ["Next.js", "Tailwind", "Vercel"],
    href: WORK_URL,
    cta: "Visit site",
  },
  {
    icon: "🤖",
    title: "Dracula AI assistant",
    text: "A chat assistant on the Efaristo site that answers customer questions about services and prices.",
    tags: ["Next.js", "Vercel AI SDK", "Chat UI"],
    href: WORK_URL,
    cta: "See it on the site",
  },
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [palette, setPalette] = useState("blue");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: -1000, y: -1000 });

  // Splash: 3s visible + 0.8s fade (matches the CSS animation), then remove it
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 3800);
    return () => clearTimeout(t);
  }, []);

  // Theme + palette live on <html> so the CSS variables switch everywhere
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-palette", palette);
  }, [theme, palette]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setPhotoOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Smooth scrolling for the nav links (About, Projects, Contact)
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  useEffect(() => {
    const move = (e) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Style for the "What I do" and "Projects" headings
  const headingStyle = {
    margin: "6px 0 -4px",
    fontSize: 20,
    textAlign: "left",
  };

  return (
    <>
      {/* Hides the About / Projects / Contact links on small phones */}
      <style>{`@media (max-width: 640px) { .nav-links { display: none; } }`}</style>

      {showSplash && (
        <div className="splash" role="status" aria-live="polite">
          <div className="splash-content">
            <img className="splash-img" src={splashImg} alt={`${FIRST_NAME} ${LAST_NAME}`} />
            <h1>
              Welcome to my <span>portfolio</span>
            </h1>
            <p>Thank you for visiting. Take a look at my work in computer engineering and software development.</p>
            <div className="splash-bar" />
          </div>
        </div>
      )}

      {photoOpen && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Full profile photo"
          onClick={() => setPhotoOpen(false)}
        >
          <button className="lightbox-close" onClick={() => setPhotoOpen(false)} aria-label="Close photo">
            ×
          </button>
          <img
            src={profileImg}
            alt={`${FIRST_NAME} ${LAST_NAME}`}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="portfolio">
        <div className="mouse-glow" style={{ left: mouse.x, top: mouse.y }} />

        <nav className="nav">
          <div className="logo">
            {FIRST_NAME}
            <span>.</span>
          </div>
          <div className="nav-links" style={{ display: "flex", gap: 22 }}>
            {[
              ["About", "#about"],
              ["Projects", "#projects"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={label} href={href} style={{ color: "inherit", textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
                {label}
              </a>
            ))}
          </div>
          <div className="nav-tools">
            <button
              className="icon-btn"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              className="themes-btn"
              onClick={() => setPaletteOpen((o) => !o)}
              aria-expanded={paletteOpen}
            >
              <span aria-hidden="true">🎨</span> Themes
            </button>
          </div>

          {paletteOpen && (
            <div className="theme-popup" role="dialog" aria-label="Choose a theme">
              <div className="theme-head">
                <h2>Choose a theme</h2>
                <button className="theme-close" onClick={() => setPaletteOpen(false)} aria-label="Close">
                  ×
                </button>
              </div>

              <div className="theme-grid">
                {PALETTES.map((p) => (
                  <button
                    key={p.id}
                    className={`theme-item ${palette === p.id ? "active" : ""}`}
                    onClick={() => setPalette(p.id)}
                  >
                    <span className="theme-dot" style={{ background: p.color }} />
                    <span className="theme-name">{p.name}</span>
                  </button>
                ))}
              </div>

              <button
                className="theme-mode"
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                Switch to {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          )}
        </nav>

        <header className="hero">
          <div className="profile-card">
            <div className="profile-img-wrap">
              <button
                type="button"
                className="profile-img-btn"
                onClick={() => setPhotoOpen(true)}
                aria-label="View full profile photo"
                title="Tap to view full photo"
              >
                <img className="profile-img" src={profileImg} alt={`${FIRST_NAME} ${LAST_NAME}`} />
              </button>
              <span className="live">Open to work</span>
            </div>

            <h1>
              {FIRST_NAME} <span>{LAST_NAME}</span>
            </h1>
            <p className="role">{ROLE}</p>
            <p className="bio" style={{ fontWeight: 600, marginBottom: 8 }}>
              I build websites and AI chatbots for businesses.
            </p>
            <p className="bio">
              I design and build web experiences and AI-powered tools, from React interfaces to
              chatbots, with a focus on clean code and thoughtful design.
            </p>

            <div className="hardware">
              <span><b>React</b> Vite</span>
              <span><b>Next.js</b> Vercel AI SDK</span>
              <span><b>Efaristo</b> Tech Lab</span>
            </div>

            <div className="connect" id="contact">
              <h2 className="connect-title">👋 Let&apos;s connect</h2>
              <p className="connect-text">
                Have a project or an idea in mind? Tap any icon below to reach me directly. For
                business enquiries, use the WhatsApp Business icon.
              </p>
              <p className="connect-text" style={{ marginTop: 6 }}>📍 Based in Ghana</p>
            </div>

            <div className="socials">
              {SOCIALS.map((item) => {
                const external = item.href.startsWith("http");
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    title={item.label}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <SocialIcon name={item.icon} />
                    {item.badge && <span className="social-badge">{item.badge}</span>}
                  </a>
                );
              })}
            </div>

            <div className="cta-row">
              <a
                className="btn-primary"
                href={`mailto:${EMAIL}?subject=${encodeURIComponent("Hello from your portfolio")}`}
              >
                Contact me
              </a>
              <a className="btn-secondary" href="#projects">
                View my work
              </a>
            </div>
          </div>

          <section className="skills">
            <h2 id="about" style={{ ...headingStyle, marginTop: 0 }}>What I do</h2>
            {SKILLS.map((s) => (
              <div className="skill" key={s.title}>
                <h3>
                  <span aria-hidden="true">{s.icon}</span> {s.title}
                </h3>
                <p>{s.text}</p>
                <div className="hardware" style={{ justifyContent: "center", marginTop: 12 }}>
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            ))}

            <h2 id="projects" style={headingStyle}>Projects</h2>
            {PROJECTS.map((p) => (
              <div className="skill" key={p.title}>
                <h3>
                  <span aria-hidden="true">{p.icon}</span> {p.title}
                </h3>
                <p>{p.text}</p>
                <div className="hardware" style={{ justifyContent: "center", marginTop: 12 }}>
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <a
                  className="btn-secondary"
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: 14 }}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </section>
        </header>
      </div>
    </>
  );
}
