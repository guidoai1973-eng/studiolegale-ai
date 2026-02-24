# StudioLegale-AI.it - Deployment & Testing Guide

## 🚀 Features Implementate

### ✅ 1. Template Generator System
- **10 Template Legali Completi:**
  1. Contratto di Affitto
  2. NDA (Accordo Non Divulgazione)
  3. Privacy Policy GDPR
  4. Contratto Prestazione Occasionale
  5. Lettera di Diffida
  6. Comunicazione di Recesso
  7. Kit GDPR Compliance
  8. Contratto di Consulenza
  9. Liberatoria Uso Immagini
  10. Convenzione Separazione Beni

- **Route implementate:**
  - `/app/templates/page.tsx` - Lista template con search e filtri
  - `/app/templates/[slug]/page.tsx` - Form dinamico per compilazione
  - `/app/api/generate-template/route.ts` - API Claude AI + Stripe checkout

### ✅ 2. Pricing System
- **4 Tier implementati:**
  - Analisi AI: €19.90
  - Template Singolo: €9.90
  - Bundle 3 Template: €24.90 (risparmio €4.80)
  - Abbonamento Pro: €29/mese

- **Route:** `/app/pricing/page.tsx`
- **Features:** Toggle mensile/annuale, tabella comparativa, FAQ

### ✅ 3. Disclaimer Compliance
- ✅ Homepage: Warning box giallo prominente con disclaimer deontologico
- ✅ Footer globale su tutte le pagine con disclaimer legale completo
- ✅ PDF/DOCX watermark: "Documento informativo - non consulenza legale"
- ✅ Warning su ogni pagina template

### ✅ 4. Stripe Integration
- ✅ Checkout completo per tutti i pricing tiers
- ✅ Gestione pagamenti one-time e subscription
- ✅ Webhook `/app/api/webhook/route.ts` per delivery automatica
- ✅ Email notifications via Resend

### ✅ 5. Dashboard Utente
- **Route:** `/app/dashboard/page.tsx`
- **Features:**
  - Statistiche: spesa totale, template acquistati, analisi AI
  - Storico acquisti con filtri
  - Download PDF e DOCX
  - Quick actions
  - Supporto section

---

## 🔧 Setup Locale

### 1. Installa dipendenze
```bash
npm install
```

### 2. Configura variabili d'ambiente (.env.local)

Le chiavi già configurate:
- ✅ `ANTHROPIC_API_KEY` - Claude AI
- ✅ `STRIPE_SECRET_KEY` - Stripe (test mode)
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `TELEGRAM_BOT_TOKEN` e `TELEGRAM_ADMIN_CHAT_ID`

**Da configurare:**
```bash
# Resend API per email (https://resend.com)
RESEND_API_KEY=re_your_api_key_here

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Base URL (production)
NEXT_PUBLIC_BASE_URL=https://studiolegale-ai.vercel.app
```

### 3. Avvia dev server
```bash
npm run dev
```
Sito disponibile su: http://localhost:3001

---

## 🧪 Testing End-to-End

### Test 1: Homepage con Disclaimer
1. Vai su http://localhost:3001
2. ✅ Verifica warning giallo prominente deontologico in alto
3. ✅ Verifica header con link Template, Pricing, Dashboard
4. ✅ Verifica footer con disclaimer legale completo

### Test 2: Template List
1. Vai su http://localhost:3001/templates
2. ✅ Verifica 10 template visualizzati correttamente
3. ✅ Testa search bar
4. ✅ Testa filtro per categoria
5. ✅ Verifica disclaimer giallo in alto
6. ✅ Verifica banner bundle €24.90

### Test 3: Template Generation Flow
1. Clicca su un template (es: Contratto Affitto)
2. ✅ Form dinamico si carica con campi corretti
3. Compila tutti i campi obbligatori (*)
4. Clicca "Genera Documento"
5. ✅ Redirect a Stripe Checkout
6. Usa carta test Stripe: `4242 4242 4242 4242`, exp futuro, CVV qualsiasi
7. ✅ Completa pagamento
8. ✅ Redirect a /success
9. ✅ Email ricevuta con link download (se Resend configurato)
10. ✅ Dashboard aggiornata con acquisto

### Test 4: Pricing Page
1. Vai su http://localhost:3001/pricing
2. ✅ Verifica 4 card pricing
3. ✅ Testa toggle Mensile/Annuale
4. ✅ Verifica disclaimer giallo
5. ✅ Verifica tabella comparativa
6. ✅ Verifica FAQ (accordion)
7. Clicca "Acquista Bundle" o "Abbonati"
8. ✅ Checkout Stripe si apre correttamente

### Test 5: Dashboard
1. Vai su http://localhost:3001/dashboard
2. ✅ Statistiche visualizzate (mock data)
3. ✅ Quick actions funzionanti
4. ✅ Tabs (Tutti, Template, Analisi) funzionano
5. ✅ Bottoni download PDF/DOCX presenti

### Test 6: Webhook Stripe (Production)
1. Configura webhook su Stripe Dashboard:
   - URL: `https://your-domain.vercel.app/api/webhook`
   - Eventi: `checkout.session.completed`, `payment_intent.succeeded`
2. Testa pagamento reale
3. ✅ Webhook riceve evento
4. ✅ Email inviata via Resend
5. ✅ Acquisto salvato (quando DB implementato)

---

## 📧 Email Templates (Resend)

### Email configurate:
1. **Analisi AI completata** - con disclaimer, link dashboard
2. **Template generato** - con avviso watermark, download links
3. **Subscription Welcome** - benvenuto Pro, feature list

**Test email:**
- Usa Resend test mode per verificare rendering
- Controlla spam folder
- Verifica disclaimer legale in footer

---

## 🌐 Deployment Production

### Vercel (Consigliato)
1. Connetti repo GitHub a Vercel
2. Configura variabili d'ambiente su Vercel Dashboard
3. Deploy automatico ad ogni push su `main`

```bash
# Verifica build locale prima di push
npm run build
```

### Configurazione DNS
Se dominio personalizzato:
- Aggiungi record CNAME su tuo DNS provider
- Punta a: `cname.vercel-dns.com`

### Post-Deployment Checklist
- [ ] Verifica HTTPS attivo
- [ ] Testa tutte le route pubbliche
- [ ] Configura webhook Stripe con URL production
- [ ] Testa pagamento reale con carta vera
- [ ] Verifica ricezione email
- [ ] Controlla analytics/logs

---

## 🔐 Sicurezza

### Stripe Webhook Security
Il webhook verifica la signature Stripe:
```typescript
stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
```

### Environment Variables
Mai committare `.env.local` - è già in `.gitignore`

### GDPR Compliance
- Privacy policy template inclusa
- Disclaimer su tutti i documenti
- Email opt-in gestito da Stripe

---

## 🐛 Troubleshooting

### Build Errors
```bash
# Pulisci cache Next.js
rm -rf .next
npm run build
```

### Stripe Test Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Webhook non riceve eventi
1. Verifica URL webhook su Stripe Dashboard
2. Controlla eventi inviati nella sezione "Logs"
3. Usa Stripe CLI per test locale:
```bash
stripe listen --forward-to localhost:3001/api/webhook
```

---

## 📊 Monitoring

### Metriche da monitorare:
- Conversion rate checkout Stripe
- Email delivery rate (Resend)
- Template generation success rate
- Subscription churn rate

### Logs
- Stripe Dashboard > Developers > Events
- Vercel Dashboard > Functions > Logs
- Resend Dashboard > Logs

---

## 🚀 Link Utili

- **Repository:** https://github.com/guidoai1973-eng/studiolegale-ai
- **Production URL:** (da configurare dopo deployment)
- **Stripe Dashboard:** https://dashboard.stripe.com
- **Resend Dashboard:** https://resend.com/dashboard
- **Anthropic Console:** https://console.anthropic.com

---

## 📝 TODO Future

- [ ] Database per salvare acquisti (PostgreSQL/Supabase)
- [ ] Sistema auth utenti (NextAuth.js)
- [ ] Admin panel per gestione template
- [ ] Analytics avanzate (Posthog/Mixpanel)
- [ ] A/B testing pricing
- [ ] Referral program
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## 💡 Note Legali

⚠️ **IMPORTANTE:** Tutti i documenti generati hanno valore informativo.
Verificare sempre con un avvocato prima dell'utilizzo legale.

Il watermark "Documento informativo - non consulenza legale" è obbligatorio
su tutti i PDF/DOCX generati.

---

**Developed by:** Avv. Guido Motti  
**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Stripe, Claude AI, Resend  
**Last Updated:** 2026-02-24
