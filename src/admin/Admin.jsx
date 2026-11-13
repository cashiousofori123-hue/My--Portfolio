import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import "../App.css";
import "./admin.css";
import Art from "../Art.jsx";
import { ART_CHOICES, DEFAULT_CONTENT, imageUrl, mergeContent } from "../content.js";
import { IMAGE_BUCKET, SUPABASE_ANON_KEY, SUPABASE_URL, hasDatabase } from "../contentStore.js";

// The admin page (your-site/admin): log in, change any part of the portfolio and press Save.
// Who may save is decided by the database (supabase/setup.sql): only emails in portfolio_admins.
const supabase = hasDatabase ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// ---------- Small form pieces ----------
const Text = ({ label, hint, value, onChange, ...rest }) => (
  <label className="field">
    {label}
    {hint && <small>{hint}</small>}
    <input className="input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />
  </label>
);
const Area = ({ label, hint, value, onChange, rows = 3, ...rest }) => (
  <label className="field">
    {label}
    {hint && <small>{hint}</small>}
    <textarea className="input" rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />
  </label>
);
// A list of sentences, edited one per line.
const Lines = ({ label, hint, value, onChange }) => (
  <Area label={label} hint={hint || "One per line."} rows={Math.min(12, Math.max(3, value.length + 1))} value={value.join("\n")} onChange={(v) => onChange(v.split("\n"))} />
);
// Tags edited as words separated by commas.
const Tags = ({ value, onChange }) => (
  <Text label="Tags" hint="Short words separated by commas, e.g. React, Python" value={value.join(",")} onChange={(v) => onChange(v.split(","))} />
);

function Section({ title, subtitle, children }) {
  return (
    <details className="adm-section" open>
      <summary>
        <span className="adm-section-title">{title}</span>
        {subtitle && <span className="adm-section-sub">{subtitle}</span>}
      </summary>
      <div className="adm-section-body">{children}</div>
    </details>
  );
}

// Moves, removes and adds items of a list (skills, projects, pills, steps).
function ListEditor({ items, onChange, make, addLabel, itemLabel, children }) {
  const move = (i, by) => {
    const next = items.slice();
    const [it] = next.splice(i, 1);
    next.splice(i + by, 0, it);
    onChange(next);
  };
  const update = (i) => (patch) => onChange(items.map((it, k) => (k === i ? (typeof patch === "function" ? patch(it) : { ...it, ...patch }) : it)));
  return (
    <div className="adm-list">
      {items.map((it, i) => (
        <div className="adm-item" key={i}>
          <div className="adm-item-bar">
            <b>{itemLabel(it, i)}</b>
            <span>
              <button type="button" className="adm-icon" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
              <button type="button" className="adm-icon" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">↓</button>
              <button type="button" className="adm-icon adm-danger" onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label="Remove">✕</button>
            </span>
          </div>
          {children(it, update(i), i)}
        </div>
      ))}
      <button type="button" className="btn-secondary adm-add" onClick={() => onChange([...items, make()])}>+ {addLabel}</button>
    </div>
  );
}

// Shrinks a picture in the browser (WebP), then uploads it to the "portfolio" picture folder in Supabase.
async function uploadImage(file, folder, maxSide) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose a picture (JPG, PNG or WebP).");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
  if (!blob) throw new Error("This picture could not be read. Try another one.");
  const ext = blob.type === "image/webp" ? "webp" : "png";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
  if (error) throw new Error(error.message.includes("row-level security") ? "This account is not allowed to upload pictures." : error.message);
  return supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

function ImageField({ label, value, onChange, folder, maxSide = 1600, original, optional }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const url = imageUrl(value);
  const pick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onChange(await uploadImage(file, folder, maxSide));
    } catch (er) {
      setError(er.message || "The upload did not work. Try again.");
    }
    setBusy(false);
  };
  return (
    <div className="field">
      {label}
      <div className="adm-image">
        {url ? <img src={url} alt="" /> : <div className="adm-noimg">No picture</div>}
        <div className="adm-image-actions">
          <label className="btn-secondary adm-small">
            {busy ? "Uploading…" : url ? "Change picture" : "Upload picture"}
            <input type="file" accept="image/*" hidden onChange={pick} disabled={busy} />
          </label>
          {original && value !== original && <button type="button" className="adm-link" onClick={() => onChange(original)}>Use the original picture</button>}
          {optional && value && <button type="button" className="adm-link" onClick={() => onChange("")}>Remove picture</button>}
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}

// ---------- Before saving: tidy lists, then check ----------
const words = (list) => list.map((t) => String(t).trim()).filter(Boolean);
const pairs = (list) => list.map(([a, b]) => [String(a || "").trim(), String(b || "").trim()]).filter(([a, b]) => a || b);
function tidy(c) {
  return {
    ...c,
    profile: { ...c.profile, badges: pairs(c.profile.badges) },
    contact: {
      ...c.contact,
      whatsappBusiness: c.contact.whatsappBusiness.replace(/\D/g, ""),
      whatsappPersonal: c.contact.whatsappPersonal.replace(/\D/g, ""),
      paystackPublicKey: c.contact.paystackPublicKey.trim(),
    },
    skills: c.skills.map((s) => ({ ...s, tags: words(s.tags) })).filter((s) => s.title.trim()),
    projects: c.projects.map((p) => ({ ...p, tags: words(p.tags) })).filter((p) => p.title.trim()),
    shop: { ...c.shop, highlights: words(c.shop.highlights), features: words(c.shop.features), kinds: words(c.shop.kinds), steps: pairs(c.shop.steps) },
  };
}
function problemWith(c) {
  if (!c.profile.firstName.trim()) return "Your first name is empty (Profile).";
  const key = c.contact.paystackPublicKey;
  if (key.startsWith("sk_")) return "That is your Paystack SECRET key. Never put it here: use the PUBLIC key (pk_…).";
  if (key && !key.startsWith("pk_")) return "The Paystack key must start with pk_live_ or pk_test_.";
  for (const [label, n] of [["WhatsApp Business", c.contact.whatsappBusiness], ["WhatsApp personal", c.contact.whatsappPersonal]]) {
    if (n && !/^\d{10,15}$/.test(n)) return `${label}: write the number with the country code, e.g. 233554068969.`;
    if (n && n.startsWith("0")) return `${label}: start with the country code (233), not 0.`;
  }
  if (c.contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.contact.email.trim())) return "Check your email address (Contact and payments).";
  return "";
}

// ---------- The editor ----------
function Editor({ session }) {
  const [draft, setDraft] = useState(null);
  const [savedJson, setSavedJson] = useState("");
  const [state, setState] = useState({ busy: false, msg: "", error: "" });

  useEffect(() => {
    supabase
      .from("portfolio")
      .select("content")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        const c = mergeContent(data && data.content);
        setDraft(c);
        setSavedJson(JSON.stringify(c));
        if (error) setState({ error: `The saved content could not be loaded: ${error.message}. Has supabase/setup.sql been run? (see README)` });
      });
  }, []);

  const changed = draft && JSON.stringify(draft) !== savedJson;
  useEffect(() => {
    const warn = (e) => {
      if (!changed) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changed]);

  if (!draft) return <Shell><p className="form-help">Loading your content…</p></Shell>;

  const part = (key) => (patch) => setDraft((d) => ({ ...d, [key]: { ...d[key], ...patch } }));
  const list = (key) => (items) => setDraft((d) => ({ ...d, [key]: items }));
  const { profile, welcome, links, contact, chat, skills, projects, shop } = draft;
  const setProfile = part("profile");
  const setWelcome = part("welcome");
  const setLinks = part("links");
  const setContact = part("contact");
  const setChat = part("chat");
  const setShop = part("shop");

  const save = async () => {
    const next = tidy(draft);
    const problem = problemWith(next);
    if (problem) return setState({ error: problem });
    setState({ busy: true });
    const { data, error } = await supabase
      .from("portfolio")
      .update({ content: next, updated_at: new Date().toISOString() })
      .eq("id", 1)
      .select("id");
    if (error) return setState({ error: error.message });
    if (!data || !data.length) return setState({ error: `Not saved: ${session.user.email} is not allowed to edit. Add it to portfolio_admins in Supabase (see README).` });
    setDraft(next);
    setSavedJson(JSON.stringify(next));
    setState({ msg: "Saved. Refresh your site to see the changes." });
    return undefined;
  };

  return (
    <Shell
      bar={
        <>
          <span className={changed ? "adm-dot on" : "adm-dot"}>{changed ? "Unsaved changes" : "All changes saved"}</span>
          <button type="button" className="btn-primary" onClick={save} disabled={state.busy || !changed}>{state.busy ? "Saving…" : "Save"}</button>
        </>
      }
      email={session.user.email}
    >
      {(state.msg || state.error) && <p className={state.error ? "form-error adm-banner" : "notice adm-banner"} role="status">{state.error || state.msg}</p>}

      <Section title="Profile" subtitle="The big card at the top">
        <ImageField label="Your photo" value={profile.photo} onChange={(v) => setProfile({ photo: v })} folder="profile" maxSide={900} original={DEFAULT_CONTENT.profile.photo} />
        <div className="form-row">
          <Text label="First name" value={profile.firstName} onChange={(v) => setProfile({ firstName: v })} maxLength={40} />
          <Text label="Last name" value={profile.lastName} onChange={(v) => setProfile({ lastName: v })} maxLength={40} />
        </div>
        <div className="form-row">
          <Text label="Role" value={profile.role} onChange={(v) => setProfile({ role: v })} maxLength={60} />
          <Text label="Label on your photo" hint="Empty hides it" value={profile.status} onChange={(v) => setProfile({ status: v })} maxLength={30} />
        </div>
        <Text label="Headline" value={profile.headline} onChange={(v) => setProfile({ headline: v })} maxLength={140} />
        <Area label="About you" value={profile.bio} onChange={(v) => setProfile({ bio: v })} rows={4} maxLength={600} />
        <Text label="Location" value={profile.location} onChange={(v) => setProfile({ location: v })} maxLength={60} />
        <div className="field">
          Pills under your bio
          <small>The first word is shown bold, in your theme colour.</small>
        </div>
        <ListEditor items={profile.badges} onChange={(v) => setProfile({ badges: v })} make={() => ["", ""]} addLabel="Add a pill" itemLabel={([a, b]) => `${a} ${b}`.trim() || "New pill"}>
          {([a, b], up) => (
            <div className="form-row">
              <Text label="Bold word" value={a} onChange={(v) => up(() => [v, b])} maxLength={20} />
              <Text label="Other words" value={b} onChange={(v) => up(() => [a, v])} maxLength={30} />
            </div>
          )}
        </ListEditor>
      </Section>

      <Section title="What I do" subtitle="Your skills and services">
        <ListEditor
          items={skills}
          onChange={list("skills")}
          make={() => ({ art: "web", title: "", text: "", tags: [], image: "" })}
          addLabel="Add a skill"
          itemLabel={(s, i) => s.title || `Skill ${i + 1}`}
        >
          {(s, up) => (
            <>
              <Text label="Title" value={s.title} onChange={(v) => up({ title: v })} maxLength={60} />
              <Area label="What you do" value={s.text} onChange={(v) => up({ text: v })} maxLength={300} />
              <Tags value={s.tags} onChange={(v) => up({ tags: v })} />
              <div className="adm-art-row">
                <label className="field">
                  Drawing
                  <select className="input" value={s.art} onChange={(e) => up({ art: e.target.value })}>
                    {ART_CHOICES.map(([key, name]) => <option key={key} value={key}>{name}</option>)}
                  </select>
                </label>
                <div className="adm-art-preview"><Art name={s.art} /></div>
              </div>
              <ImageField label="Your own photo instead of the drawing (optional)" value={s.image || ""} onChange={(v) => up({ image: v })} folder="skills" optional />
            </>
          )}
        </ListEditor>
      </Section>

      <Section title="Projects" subtitle="A project with a picture is shown big">
        <ListEditor
          items={projects}
          onChange={list("projects")}
          make={() => ({ icon: "⭐", title: "", text: "", tags: [], href: "", cta: "Visit site", image: "" })}
          addLabel="Add a project"
          itemLabel={(p, i) => p.title || `Project ${i + 1}`}
        >
          {(p, up) => (
            <>
              <div className="form-row adm-icon-row">
                <Text label="Icon" hint="One emoji" value={p.icon} onChange={(v) => up({ icon: v })} maxLength={4} />
                <Text label="Title" value={p.title} onChange={(v) => up({ title: v })} maxLength={80} />
              </div>
              <Area label="About the project" value={p.text} onChange={(v) => up({ text: v })} maxLength={400} />
              <Tags value={p.tags} onChange={(v) => up({ tags: v })} />
              <div className="form-row">
                <Text label="Link" hint="https://…" value={p.href} onChange={(v) => up({ href: v })} maxLength={300} />
                <Text label="Button words" value={p.cta} onChange={(v) => up({ cta: v })} maxLength={30} />
              </div>
              <ImageField label="Screenshot (optional)" value={p.image || ""} onChange={(v) => up({ image: v })} folder="projects" optional />
            </>
          )}
        </ListEditor>
      </Section>

      <Section title="Online shop offer" subtitle="The 'Get an online shop' part of the page">
        <Lines label="Short list next to your profile" value={shop.highlights} onChange={(v) => setShop({ highlights: v })} />
        <Lines label="What you get (full list)" value={shop.features} onChange={(v) => setShop({ features: v })} />
        <div className="field">How it works (the steps)</div>
        <ListEditor items={shop.steps} onChange={(v) => setShop({ steps: v })} make={() => ["", ""]} addLabel="Add a step" itemLabel={([a], i) => `${i + 1}. ${a || "New step"}`}>
          {([a, b], up) => (
            <>
              <Text label="Step" value={a} onChange={(v) => up(() => [v, b])} maxLength={40} />
              <Area label="Explanation" value={b} onChange={(v) => up(() => [a, v])} rows={2} maxLength={200} />
            </>
          )}
        </ListEditor>
        <Lines label="Choices under 'What do you sell?'" value={shop.kinds} onChange={(v) => setShop({ kinds: v })} />
      </Section>

      <Section title="Contact and payments" subtitle="How clients reach and pay you">
        <Text label="Email" type="email" value={contact.email} onChange={(v) => setContact({ email: v })} />
        <div className="form-row">
          <Text label="WhatsApp Business" hint="With 233, no + or spaces" value={contact.whatsappBusiness} onChange={(v) => setContact({ whatsappBusiness: v })} inputMode="numeric" />
          <Text label="WhatsApp personal" hint="With 233, or empty" value={contact.whatsappPersonal} onChange={(v) => setContact({ whatsappPersonal: v })} inputMode="numeric" />
        </div>
        <Text
          label="Paystack public key"
          hint="Paystack → Settings → API Keys & Webhooks → Public Key (pk_live_…). Never the secret key. Empty = clients see your MoMo details."
          value={contact.paystackPublicKey}
          onChange={(v) => setContact({ paystackPublicKey: v })}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="form-row adm-three">
          <Text label="MoMo number" value={contact.momoNumber} onChange={(v) => setContact({ momoNumber: v })} />
          <Text label="Name on the MoMo account" value={contact.momoName} onChange={(v) => setContact({ momoName: v })} />
          <label className="field">
            Network
            <select className="input" value={contact.momoNetwork} onChange={(e) => setContact({ momoNetwork: e.target.value })}>
              {["MTN", "Telecel", "AirtelTigo"].map((n) => <option key={n}>{n}</option>)}
            </select>
          </label>
        </div>
        <Text label="Example shop link" hint="The 'Try a live example shop' button" value={contact.exampleShopUrl} onChange={(v) => setContact({ exampleShopUrl: v })} />
      </Section>

      <Section title="Chat assistant" subtitle="The chat button at the bottom right">
        <label className="adm-check">
          <input type="checkbox" checked={!!chat.enabled} onChange={(e) => setChat({ enabled: e.target.checked })} /> Show the chat assistant
        </label>
        <Text label="Its name" value={chat.name} onChange={(v) => setChat({ name: v })} maxLength={30} />
        <Area label="First message" value={chat.greeting} onChange={(v) => setChat({ greeting: v })} rows={2} maxLength={300} />
        <Area
          label="Extra things it should know"
          hint="It already knows everything on your page. Add more here, one per line, e.g. 'An online shop takes about one week to set up.'"
          value={chat.facts}
          onChange={(v) => setChat({ facts: v })}
          rows={4}
          maxLength={2000}
        />
      </Section>

      <Section title="Welcome screen" subtitle="Shown once when someone opens the site">
        <ImageField label="Picture" value={welcome.photo} onChange={(v) => setWelcome({ photo: v })} folder="welcome" maxSide={1200} original={DEFAULT_CONTENT.welcome.photo} />
        <div className="form-row">
          <Text label="Title" value={welcome.title} onChange={(v) => setWelcome({ title: v })} maxLength={40} />
          <Text label="Last word (in colour)" value={welcome.titleHighlight} onChange={(v) => setWelcome({ titleHighlight: v })} maxLength={20} />
        </div>
        <Area label="Text" value={welcome.text} onChange={(v) => setWelcome({ text: v })} rows={2} maxLength={200} />
      </Section>

      <Section title="Links" subtitle="The icons under your profile">
        <Text label="GitHub" value={links.github} onChange={(v) => setLinks({ github: v })} />
        <Text label="LinkedIn" value={links.linkedin} onChange={(v) => setLinks({ linkedin: v })} />
        <Text label="Facebook" value={links.facebook} onChange={(v) => setLinks({ facebook: v })} />
      </Section>
    </Shell>
  );
}

// ---------- Log in, new password, not connected ----------
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error: er } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (er) setError(er.message === "Invalid login credentials" ? "Wrong email or password." : er.message);
  };
  const forgot = async () => {
    setError("");
    if (!email.trim()) return setError("Type your email first, then tap “Forgot password?”.");
    const { error: er } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/admin` });
    if (er) setError(er.message);
    else setNote("Check your email: the link there lets you set a new password.");
    return undefined;
  };

  return (
    <form className="form-card adm-login" onSubmit={submit}>
      <h3>Log in to edit your portfolio</h3>
      <Text label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" required />
      <Text label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" required />
      {error && <p className="form-error" role="alert">{error}</p>}
      {note && <p className="notice">{note}</p>}
      <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      <button type="button" className="adm-link" onClick={forgot}>Forgot password?</button>
    </form>
  );
}

function NewPassword({ onDone }) {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (a.length < 10) return setError("Use at least 10 characters.");
    if (a !== b) return setError("The two passwords are not the same.");
    const { error: er } = await supabase.auth.updateUser({ password: a });
    if (er) return setError(er.message);
    onDone();
    return undefined;
  };
  return (
    <form className="form-card adm-login" onSubmit={submit}>
      <h3>Set a new password</h3>
      <Text label="New password" type="password" value={a} onChange={setA} autoComplete="new-password" />
      <Text label="Type it again" type="password" value={b} onChange={setB} autoComplete="new-password" />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="btn-primary">Save new password</button>
    </form>
  );
}

function Shell({ children, bar, email }) {
  return (
    <div className="adm">
      <header className="adm-top">
        <div className="logo">Portfolio<span>.</span> <small>admin</small></div>
        <div className="adm-top-tools">
          {bar}
          <a className="btn-secondary adm-small" href="/" target="_blank" rel="noopener noreferrer">View site</a>
          {email && <button type="button" className="adm-link" onClick={() => supabase.auth.signOut()} title={email}>Log out</button>}
        </div>
      </header>
      <main className="adm-main">{children}</main>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined while checking
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    document.title = "Edit my portfolio";
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (!supabase) {
    return (
      <Shell>
        <div className="notice adm-login">
          <h3>The admin page is not connected yet</h3>
          <p style={{ marginTop: 8 }}>
            Create the free Supabase project and add <b>VITE_SUPABASE_URL</b> and <b>VITE_SUPABASE_ANON_KEY</b> in Vercel
            (see “Admin page: setting it up” in the README), then redeploy.
          </p>
        </div>
      </Shell>
    );
  }
  if (session === undefined) return <Shell><p className="form-help">Loading…</p></Shell>;
  if (recovery && session) return <Shell><NewPassword onDone={() => setRecovery(false)} /></Shell>;
  if (!session) return <Shell><Login /></Shell>;
  return <Editor session={session} />;
}
