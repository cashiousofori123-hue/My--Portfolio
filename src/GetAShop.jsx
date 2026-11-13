import { useState } from "react";
import { whatsappLink } from "./business.js";

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const digits = (v) => v.replace(/\D/g, "");

// The amount and business can come from a link you send a client, e.g. …/?pay=1250&for=Ama%27s%20Beauty#pay
const fromLink = () => {
  try {
    const q = new URLSearchParams(window.location.search);
    const amount = Number(q.get("pay"));
    return { amount: amount > 0 ? String(amount) : "", business: q.get("for") || "" };
  } catch {
    return { amount: "", business: "" };
  }
};

let paystackScript = null;
const loadPaystack = () => {
  if (window.PaystackPop) return Promise.resolve(window.PaystackPop);
  if (!paystackScript) {
    paystackScript = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://js.paystack.co/v2/inline.js";
      s.onload = () => resolve(window.PaystackPop);
      s.onerror = () => {
        paystackScript = null;
        reject(new Error("Paystack did not load"));
      };
      document.head.appendChild(s);
    });
  }
  return paystackScript;
};

// Your contact and payment details and the offer come from the live content (content.js or the admin page).
export function ShopOffer({ content }) {
  const { shop, contact, profile } = content;
  const [f, setF] = useState({ name: "", business: "", phone: "", email: "", kind: shop.kinds[0] || "", note: "" });
  const [error, setError] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const register = (e) => {
    e.preventDefault();
    if (!f.name.trim() || !f.business.trim()) return setError("Please enter your name and your business name.");
    if (digits(f.phone).length < 9) return setError("Please enter a phone or WhatsApp number I can reach you on.");
    if (f.email.trim() && !isEmail(f.email)) return setError("Please check your email address.");
    setError("");
    const text = [
      `Hello ${profile.firstName}, I want an online shop for my business.`,
      `Name: ${f.name.trim()}`,
      `Business: ${f.business.trim()}`,
      `What we sell: ${f.kind}`,
      `Phone: ${f.phone.trim()}`,
      f.email.trim() && `Email: ${f.email.trim()}`,
      f.note.trim() && `Note: ${f.note.trim()}`,
    ].filter(Boolean).join("\n");
    window.open(whatsappLink(text, contact.whatsappBusiness), "_blank", "noopener");
  };

  return (
    <section className="section" id="shop">
      <div className="section-head">
        <p className="eyebrow">For businesses</p>
        <h2>Get an online shop for your business</h2>
        <p>
          Sell online without the stress of DMs and checking payments by hand. Your customers order and pay on your
          own website, and you manage everything from your phone.
        </p>
      </div>

      <div className="order-grid">
        <div className="offer">
          <h3>What you get</h3>
          <ul className="ticks">
            {shop.features.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <a className="btn-secondary" href={contact.exampleShopUrl} target="_blank" rel="noopener noreferrer" style={{ marginTop: 20 }}>
            Try a live example shop
          </a>
        </div>

        <form className="form-card" onSubmit={register} noValidate>
          <h3>Register for your shop</h3>
          <p className="form-help">Send your details and I will reply on WhatsApp with the price and next steps.</p>
          <div className="form-row">
            <label className="field">Your name<input className="input" value={f.name} onChange={set("name")} autoComplete="name" maxLength={80} /></label>
            <label className="field">Business name<input className="input" value={f.business} onChange={set("business")} autoComplete="organization" maxLength={80} /></label>
          </div>
          <div className="form-row">
            <label className="field">Phone or WhatsApp<input className="input" type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="024 123 4567" maxLength={20} /></label>
            <label className="field">Email <small>(optional)</small><input className="input" type="email" value={f.email} onChange={set("email")} autoComplete="email" maxLength={120} /></label>
          </div>
          <label className="field">What do you sell?
            <select className="input" value={f.kind} onChange={set("kind")}>
              {shop.kinds.map((k) => <option key={k}>{k}</option>)}
            </select>
          </label>
          <label className="field">Anything else? <small>(optional)</small>
            <textarea className="input" value={f.note} onChange={set("note")} maxLength={600} placeholder="For example: how many products you have, or a date you want to start selling" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" className="btn-primary">Send on WhatsApp</button>
          <p className="form-help">
            No WhatsApp? Email me at <a href={`mailto:${contact.email}?subject=${encodeURIComponent("Online shop for my business")}`}>{contact.email}</a>.
          </p>
        </form>
      </div>

      <h3 className="sub-head">How it works</h3>
      <ol className="steps">
        {shop.steps.map(([title, text]) => (
          <li key={title}><b>{title}</b>{text}</li>
        ))}
      </ol>
    </section>
  );
}

export function PayDeposit({ content }) {
  const { contact, profile } = content;
  const wa = (text) => whatsappLink(text, contact.whatsappBusiness);
  const [f, setF] = useState(() => ({ ...fromLink(), name: "", email: "", phone: "" }));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [paid, setPaid] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const amount = Number(String(f.amount).replace(/,/g, ""));

  const check = () => {
    if (!(amount > 0)) return "Please enter the deposit amount I sent you.";
    if (!f.name.trim() || !f.business.trim()) return "Please enter your name and your business name.";
    if (!isEmail(f.email)) return "Please enter your email address; Paystack sends your receipt there.";
    if (digits(f.phone).length < 9) return "Please enter your phone number.";
    return "";
  };

  const pay = async (e) => {
    e.preventDefault();
    const problem = check();
    setError(problem);
    if (problem) return;
    setBusy(true);
    try {
      const PaystackPop = await loadPaystack();
      new PaystackPop().newTransaction({
        key: contact.paystackPublicKey,
        email: f.email.trim(),
        amount: Math.round(amount * 100),
        currency: "GHS",
        channels: ["mobile_money", "card"],
        metadata: {
          custom_fields: [
            { display_name: "Name", variable_name: "name", value: f.name.trim() },
            { display_name: "Business", variable_name: "business", value: f.business.trim() },
            { display_name: "Phone", variable_name: "phone", value: f.phone.trim() },
            { display_name: "For", variable_name: "for", value: "50% deposit: online shop" },
          ],
        },
        onSuccess: (tx) => {
          setPaid({ reference: tx.reference, amount });
          setBusy(false);
        },
        onCancel: () => setBusy(false),
        onError: () => {
          setError("The payment could not start. Please try again, or pay by Mobile Money below.");
          setBusy(false);
        },
      });
    } catch {
      setError("Paystack could not load. Check your internet connection and try again.");
      setBusy(false);
    }
  };

  const money = `GHS ${amount > 0 ? amount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "…"}`;
  const momoMessage = [
    `Hello ${profile.firstName}, I have paid my 50% deposit by Mobile Money.`,
    `Name: ${f.name.trim()}`,
    `Business: ${f.business.trim()}`,
    `Amount: ${money}`,
    "Transaction ID: ",
  ].join("\n");

  return (
    <section className="section" id="pay">
      <div className="section-head">
        <p className="eyebrow">Already agreed a price?</p>
        <h2>Pay your 50% deposit</h2>
        <p>Enter the deposit amount I sent you on WhatsApp. Your shop is booked as soon as the payment arrives.</p>
      </div>

      {paid ? (
        <div className="notice pay-card" role="status">
          <h3>Thank you, your deposit is paid</h3>
          <p>
            <b>{`GHS ${paid.amount.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`}</b> received. Your reference
            is <b>{paid.reference}</b>, and Paystack has emailed you a receipt.
          </p>
          <a className="btn-primary" style={{ marginTop: 16 }} target="_blank" rel="noopener noreferrer"
            href={wa(`Hello ${profile.firstName}, I have paid my deposit for ${f.business.trim()}. Reference: ${paid.reference}`)}>
            Tell me on WhatsApp
          </a>
        </div>
      ) : (
        <form className="form-card pay-card" onSubmit={pay} noValidate>
          <div className="form-row">
            <label className="field">Deposit amount (GHS)<input className="input" inputMode="decimal" value={f.amount} onChange={set("amount")} placeholder="e.g. 1250" maxLength={10} /></label>
            <label className="field">Business name<input className="input" value={f.business} onChange={set("business")} autoComplete="organization" maxLength={80} /></label>
          </div>
          <div className="form-row">
            <label className="field">Your name<input className="input" value={f.name} onChange={set("name")} autoComplete="name" maxLength={80} /></label>
            <label className="field">Phone<input className="input" type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" maxLength={20} /></label>
          </div>
          <label className="field">Email <small>(your receipt goes here)</small><input className="input" type="email" value={f.email} onChange={set("email")} autoComplete="email" maxLength={120} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}

          {contact.paystackPublicKey ? (
            <>
              <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Opening Paystack…" : `Pay ${money}`}</button>
              <p className="form-help">Secure payment by Mobile Money or card through Paystack. This site never sees your PIN or card details.</p>
            </>
          ) : contact.momoNumber ? (
            <div className="notice">
              <p>Send <b>{money}</b> by Mobile Money to:</p>
              <p style={{ marginTop: 8 }}><b>{contact.momoNumber}</b> ({contact.momoNetwork}), name: <b>{contact.momoName}</b></p>
              <p style={{ marginTop: 8 }}>Use your business name as the reference, then send me the transaction ID.</p>
              <a className="btn-primary" style={{ marginTop: 14 }} target="_blank" rel="noopener noreferrer" href={wa(momoMessage)}
                onClick={(e) => { const problem = check(); setError(problem); if (problem) e.preventDefault(); }}>
                I have paid: send the transaction ID
              </a>
            </div>
          ) : (
            <a className="btn-primary" target="_blank" rel="noopener noreferrer"
              href={wa(`Hello ${profile.firstName}, I am ready to pay my deposit${f.business.trim() ? ` for ${f.business.trim()}` : ""}. How do I pay?`)}>
              Ask me how to pay on WhatsApp
            </a>
          )}
        </form>
      )}
    </section>
  );
}
