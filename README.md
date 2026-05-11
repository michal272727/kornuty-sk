# Kornuty.sk — Interactive Cornute Configurator

Interactive web app na Vereceli s Stripe platbami.

## Setup

### 1. Stripe account
- Vytvor account: https://dashboard.stripe.com/register
- Vyber "Slovensko"
- V Dashboard → API keys skopíruj:
  - **Publishable key** (pk_...)
  - **Secret key** (sk_...)

### 2. Environment variables
```bash
cp .env.local.example .env.local
```

Vyplň v `.env.local`:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

### 3. Local dev
```bash
npm install
npm run dev
```

Otvor http://localhost:3000

### 4. Deploy na Vercel

**Option A: Web UI (najrýchlejšie)**
1. Pushni repo na GitHub
2. Navštív https://vercel.com
3. Klikni "New Project"
4. Vyber svoj GitHub repo
5. Vercel auto-detekuje Next.js
6. V Settings → Environment Variables pridaj:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_BASE_URL`
7. Klikni Deploy ✅

**Option B: CLI**
```bash
npm install -g vercel
vercel login
vercel --prod
```

### 5. Doména
V Vercel → Project Settings → Domains:
- Pridaj svoju doménu
- Skopíruj CNAME záznam
- V domain registrátore pridaj CNAME

## Štruktúra

```
/kornuty
  /pages
    /api
      checkout.js       ← Stripe API
    _app.jsx            ← Next.js app wrapper
    index.jsx           ← main page
  /public
    images/             ← assets (neskôr)
  app.jsx               ← React app logic
  data.js               ← Product catalog
  style.css             ← Styling
  package.json
  vercel.json
```

## TODO

- [ ] Stripe keys vložiť do .env.local
- [ ] `npm install` lokálne
- [ ] `npm run dev` a otestovať
- [ ] Git init + push na GitHub
- [ ] Vercel deploy
- [ ] Domain setup
- [ ] Obrázky produktov (images.json)

## Support

Ak čokoľvek nefunguje, check:
1. Console errors (`npm run dev` output)
2. Vercel Logs (Vercel Dashboard → Deployments)
3. Stripe API keys sú správne v .env.local
