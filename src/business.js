// Your contact and payment details in one place. Fill in the payment part once; the rest of the site reads it.

export const EMAIL = "cashiousofori123@gmail.com";
// WhatsApp numbers: country code + number, no + or spaces or leading 0
export const WHATSAPP_BUSINESS = "233554068969";
export const WHATSAPP_PERSONAL = "233546149938";

// PAYMENTS
// Paystack public key from YOUR Paystack account (dashboard -> Settings -> API Keys & Webhooks -> Public key).
// It starts with pk_live_ (or pk_test_ while testing). It is safe to be public; never put the secret key here.
// While it is empty, clients see the Mobile Money details below instead.
export const PAYSTACK_PUBLIC_KEY = "";
// Your Mobile Money account, shown when Paystack is not set up. Leave the number empty to hide it.
export const MOMO_NUMBER = "054 614 9938";
export const MOMO_NAME = "Grace Donkor";
export const MOMO_NETWORK = "MTN";

// The live example shop shown on the portfolio.
export const EXAMPLE_SHOP_URL = "https://rabis-chic-fashion-hub.vercel.app";

export const whatsappLink = (text, number = WHATSAPP_BUSINESS) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
