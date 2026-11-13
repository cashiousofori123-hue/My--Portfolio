// Small helpers for contacting you. Your email, WhatsApp numbers and payment details are in content.js
// (or the admin page, Contact and payments).

export const whatsappLink = (text, number) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
