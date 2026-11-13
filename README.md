# Cashious Ofori: portfolio

My portfolio, and where businesses register for an online shop and pay their deposit.
React + Vite, no server needed.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Changing what the portfolio says

Everything the page says is in **`src/content.js`**: your profile, the welcome screen, What I do, Projects and the
online shop offer. Open it in VS Code, change the words between the quotes, save, then push to GitHub; the live
site updates by itself. Keep the quotes `"..."` and the commas at the ends of the lines.

- **Your profile:** `PROFILE` (name, role, headline, bio, location, the label on your photo, the small pills).
- **A new profile photo:** put the picture in `src/assets/`, then change the first `import` line in `content.js`
  to its file name, for example `import profilePhoto from "./assets/me.jpg";`.
- **A new skill:** in `SKILLS`, copy one block from `{` to `},`, paste it below and change the words. For the
  picture, choose a drawing with `art:` (`shop`, `web`, `app`, `bot`, `automation`, `python`, `arduino`, `matlab`,
  `repair`), or use your own photo: put it in `src/assets/work/`, add a line at the top such as
  `import myRobot from "./assets/work/robot.jpg";`, and write `image: myRobot,` in the skill.
- **A new project:** same in `PROJECTS`. Add `image:` with a screenshot to show it big, with the picture beside the text.
- **To remove something:** delete its block from `{` to `},`.

To see your change before pushing: `npm run dev`, then open http://localhost:5173.
If the page goes blank, a quote or comma is usually missing: undo the last change (Ctrl+Z) and try again.

## How clients register and pay

1. **Register:** the form under *Get an online shop for your business* opens WhatsApp Business (`233554068969`)
   with the client's details typed in. Nothing is stored on the website.
2. **Agree the price** on WhatsApp. Prices are not shown on the site.
3. **Send them a pay link** with their deposit (50%) and business name filled in, for example:
   `https://your-portfolio-address/?pay=1250&for=Ama%27s%20Beauty#pay`
   (`pay` = amount in GHS, `for` = business name; write spaces as `%20` and `'` as `%27`).
4. **They pay** in the *Pay your 50% deposit* section:
   - With a Paystack key: by Mobile Money prompt or card. The payment, with their name, business and phone, shows in
     your Paystack dashboard, and Paystack emails them a receipt.
   - Without a Paystack key: your Mobile Money number is shown, and they send you the transaction ID on WhatsApp.
   - With neither: a button asks you on WhatsApp how to pay.

## Set up payments (once), in `src/business.js`

- `PAYSTACK_PUBLIC_KEY`: open a Paystack account for **your own** business (paystack.com, finish their verification),
  then **Settings → API Keys & Webhooks → Public Key**. Use `pk_test_…` first and pay with Paystack's test details;
  when that works, use `pk_live_…`. Only the public key goes here, never the secret key.
- `MOMO_NUMBER`, `MOMO_NAME`, `MOMO_NETWORK`: your Mobile Money account, shown while there is no Paystack key.
- `EXAMPLE_SHOP_URL`: the live example shop (Rabi's Chic Fashion Hub).

Then commit and push; the live site updates when it is rebuilt.

## Files

| File | What it is |
|---|---|
| `src/content.js` | **All the words and pictures**: profile, skills, projects, shop offer |
| `src/Art.jsx` | The drawings on the skill cards (in the theme colour) |
| `src/App.jsx` | The page layout: profile, shop offer, What I do, Projects, footer |
| `src/GetAShop.jsx` | *Get an online shop* (what's included, register form, how it works) and *Pay your 50% deposit* |
| `src/business.js` | Email, WhatsApp numbers, Paystack key, Mobile Money details |
| `src/App.css` | All styles; colours come from the theme picker (`data-palette` on `<html>`) |
