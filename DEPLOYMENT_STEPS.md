# Deployment Guide — Kornuty.sk to Vercel

Presne podľa toho postupuj:

## 📋 Kroky

### 1️⃣ Stripe Setup (5 min)

```
1. Navštív https://dashboard.stripe.com/register
2. Vyplň detaily a vyber "Slovensko"
3. Dokončí email verifikáciu
4. V Dashboard klikni "Developers" → "API keys"
5. Skopíruj dve veci:
   - Publishable key (začína pk_test_...)
   - Secret key (začína sk_test_...)
```

### 2️⃣ .env.local Setup (2 min)

V `/Users/michalbenko/kornuty/` vytvoríš súbor `.env.local`:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

(SK domain si môžeš zatiaľ nahradiť s `https://kornuty.vercel.app`)

### 3️⃣ Local Test (3 min)

```bash
cd /Users/michalbenko/kornuty
npm install
npm run dev
```

Otvor http://localhost:3000 a otestuj:
- Vyber ingrediencie ✅
- Všetko sa počíta správne ✅
- Checkout je dostupný ✅

### 4️⃣ GitHub Setup (5 min)

```bash
cd /Users/michalbenko/kornuty
git init
git add .
git commit -m "Initial commit: Kornuty.sk with Stripe"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kornuty-sk.git
git push -u origin main
```

(Nahraď YOUR_USERNAME svojím GitHub username-om)

### 5️⃣ Vercel Deploy (2 min)

```
1. Navštív https://vercel.com
2. Klikni "New Project"
3. Vyber svoj GitHub repo (kornuty-sk)
4. Klikni "Import"
5. Framework = Next.js (auto-detekuje)
6. Klikni "Environment Variables"
7. Pridaj 3 premenné:
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_xxxxx
   - STRIPE_SECRET_KEY = sk_test_xxxxx
   - NEXT_PUBLIC_BASE_URL = https://kornuty.vercel.app
8. Klikni "Deploy"
9. Čakaj ~2 minúty...
10. "Visit" → Live! 🎉
```

### 6️⃣ Domain Setup (5 min, NESKÔR)

Keď máš domain (napr. kornuty.sk):

```
1. V Vercel → Project Settings → Domains
2. Pridaj domain: kornuty.sk
3. Skopíruj CNAME value
4. V registrátore (GoDaddy, Namecheap...) pridaj DNS CNAME záznam
5. Počkaj 24h
6. Aktualizuj .env na server:
   NEXT_PUBLIC_BASE_URL=https://kornuty.sk
7. Redeploy
```

### 7️⃣ Production Stripe Keys (KEĎ SI READY NA PENIAZE)

```
1. V Stripe Dashboard klikni "Activate your account"
2. Vyplň business info
3. Keď bude aktivny, zmeniš API keys z test na live
4. (live = pk_live_... a sk_live_...)
5. Aktualizuj .env na Vereceli
6. Redeploy
```

---

## 🐛 Debug

Ak niečo nefunguje:

**Local issues:**
```bash
npm install  # Znova
npm run dev  # Check console for errors
```

**Vercel issues:**
1. Vercel Dashboard → Project → Deployments → poslední deploy
2. Klikni "View Logs"
3. Hľadaj červené error správy

**Stripe issues:**
- Publishable key musí byť v `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (bez secret!)
- Secret key musí byť v `STRIPE_SECRET_KEY` (nikdy nie public)
- Test vs Live keys si neplieš

---

## ✅ Checklist

- [ ] Stripe account vytvorený
- [ ] API keys skopírované
- [ ] .env.local vyplnený
- [ ] `npm install` a `npm run dev` funguje
- [ ] GitHub repo vytvorený a pushed
- [ ] Vercel project created
- [ ] Environment variables v Vereceli nastavené
- [ ] Deploy successful (zelená checkmark)
- [ ] Web je live na Vereceli
- [ ] Stripe checkout funguje (test mode)

---

## 🎯 Ďalšie kroky (NESKÔR)

- [ ] Domain (kornuty.sk)
- [ ] Obrázky produktov (images.json)
- [ ] Live Stripe keys
- [ ] Backend na spracovanie objednávok (email, databáza...)
