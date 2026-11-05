# เอกสารออกแบบทางเทคนิค (Technical Design Document — TDD)

> **โครงการ:** Conrad Express — Static Marketing & Lead-Capture Site
> **เวอร์ชัน:** 1.1 — จาก codebase จริง
> **วันที่:** 2026-08-17
> **อ้างอิง:** [BRD](1_BRD_Business_Requirements.md) · [FRD](2_FRD_Functional_Requirements.md) · [UI/UX](3_UIUX_Design.md)
> **กลุ่มเป้าหมาย:** Coding agent / developer

---

## สารบัญ

1. Tech Stack & Architecture
2. Repository Layout
3. Data Layer (`src/data/*`)
4. Component Map
5. Build Pipeline
6. Verification (QA)
7. SEO Generation
8. Contact Backend (Apps Script)
9. Configuration & Env
10. Security (CSP)
11. Deployment
12. Conventions & Constraints

---

## 1. Tech Stack & Architecture

| Layer | Tech | Note |
|---|---|---|
| UI runtime | React 18 UMD (production) + ReactDOM | vendor pinned + SRI, `defer` |
| Language | JSX (classic runtime) | pre-compiled ตอน build, ไม่มี runtime Babel |
| Styling | inline styles + `<style>` blocks ใน `index.html` | ไม่มี CSS framework |
| Fonts | Jost + Cormorant Garamond | self-hosted `.woff2` |
| Data | plain JS modules → `window.*` globals | ไม่มี state manager |
| Build | Node script (`@babel/core` + `terser`) | → `dist/conrad-express.bundle.js` |
| Backend | Google Apps Script Web App | contact form receiver |
| Hosting | Vercel (static output `.`) | domain `conradexpress.com` |

### Architecture Pattern — Data-driven static SPA
```
   ┌──────────────────────────────────────────────────────┐
   │  index.html (shell: CSP, styles, script order, root)  │
   │    <script defer> vendor react/react-dom              │
   │    <script defer> src/data/*.js  → window.CONRAD_*    │
   │    <script defer> dist/conrad-express.bundle.js       │
   └───────────────────────────┬──────────────────────────┘
                               │ window.CONRAD_EXPRESS_DATA
                               ▼
   ┌──────────────────────────────────────────────────────┐
   │  React tree (App) → Nav/Hero/…/Contact/FloatingLine   │
   └───────────────────────────┬──────────────────────────┘
                               │ JSON POST /api/contact (Vercel Function)
                               ▼
   ┌──────────────────────────────────────────────────────┐
   │  Apps Script Web App → Google Sheet + email notify    │
   └──────────────────────────────────────────────────────┘
```

**Load-order rule:** `src/data/*` ต้องโหลด **ก่อน** bundle เสมอ (verify enforce ลำดับ)

---

## 2. Repository Layout

```
conradexpress/
├── README.md                         ← handoff note
└── project/                          ← git repo root
    ├── index.html                    ← shell + global CSS + CSP + script order
    ├── package.json                  ← build / verify scripts
    ├── vercel.json                   ← install/build/output
    ├── .env.local                    ← NEXT_PUBLIC_SITE_URL
    ├── favicon.svg · og-image.jpg · robots.txt · sitemap.xml
    ├── vendor/
    │   ├── react.production.min.js
    │   ├── react-dom.production.min.js
    │   └── fonts/  (Jost, Cormorant Garamond .woff2 + fonts.css)
    ├── brand-images/                 ← hero, why, process, reviews, flags, logos
    ├── src/
    │   ├── app.jsx                   ← <App/> + scroll-reveal + counters
    │   ├── data/
    │   │   ├── config.js             → CONRAD_EXPRESS_CONFIG (contact, endpoint)
    │   │   ├── copy.js               → CONRAD_EXPRESS_COPY (en/th)
    │   │   ├── reviews.js            → CONRAD_EXPRESS_REVIEWS (en/th)
    │   │   ├── assets.js             → CONRAD_EXPRESS_ASSETS (photos)
    │   │   ├── policies.js           → CONRAD_EXPRESS_POLICIES (privacy/terms/insurance)
    │   │   ├── site-data.js          → aggregate → CONRAD_EXPRESS_DATA
    │   │   └── tweaks.js             → TWEAK_DEFAULTS
    │   └── components/
    │       ├── shared.jsx            (StarIcon, PhotoPlaceholder, CardSwiper, SectionEyebrow)
    │       ├── Nav.jsx · Hero.jsx · FloatingLine.jsx
    │       └── sections/
    │           ├── Brands.jsx · Services.jsx · WhyUs.jsx · Process.jsx
    │           ├── Testimonials.jsx · Packages.jsx · Contact.jsx
    ├── tweaks-panel.jsx              ← edit-mode UI + host messaging
    ├── scripts/
    │   ├── build-static-bundle.mjs   ← JSX→bundle + SEO gen
    │   └── verify-static-site.mjs    ← QA checks
    ├── integrations/
    │   └── google-sheets-contact.gs  ← Apps Script receiver
    └── dist/
        └── conrad-express.bundle.js  ← generated + committed
```

**Dependency rule:** components อ่าน data จาก `window.CONRAD_EXPRESS_DATA` เท่านั้น — ไม่ hardcode content

---

## 3. Data Layer (`src/data/*`)

แต่ละไฟล์เป็น IIFE ที่ attach ค่าเข้า `window.*`; `site-data.js` รวมทั้งหมด (throw ถ้าขาด module)

| Module | Global | โครงสร้างหลัก |
|---|---|---|
| config.js | `CONRAD_EXPRESS_CONFIG` | `{ heroBackground, contact:{email,lineUrl,trackUrl,formEndpoint} }` |
| copy.js | `CONRAD_EXPRESS_COPY` | `{ en:{...}, th:{...} }` — nav, hero, trust, brands, pricing, packages, services, why, process, testimonials, contact, footer, pillars, misc |
| reviews.js | `CONRAD_EXPRESS_REVIEWS` | `{ en:[…], th:[…] }` — review cards (type/date/headline/quote/tags/author/role) |
| assets.js | `CONRAD_EXPRESS_ASSETS` | `{ reviewPhotos[11], whyImage, processImages{0-3} }` |
| policies.js | `CONRAD_EXPRESS_POLICIES` | `{ order:[privacy,terms,insurance], ui:{en,th}, documents:{…sections/blocks} }` |
| site-data.js | `CONRAD_EXPRESS_DATA` | aggregate ทั้งหมด (source of truth ให้ components) |
| tweaks.js | `TWEAK_DEFAULTS` | `{ accentColor, navyColor, heroLayout, font, language }` |

**Policy block types:** `paragraph` · `list` · `ordered` · `table` (render ใน `Contact.jsx` → `PolicyBlock`)

---

## 4. Component Map

| Component | Props หลัก | หมายเหตุ |
|---|---|---|
| `App` | — | tweaks state, language state, scroll listener, ประกอบทุก section |
| `Nav` | c, gold, navy, scrolled, lang, setLang | anchors, lang toggle, burger ≤900px |
| `Hero` | c, gold, navy, layout | 100vh, dark/light, starting price |
| `Brands` | c, gold, navy | trust strip |
| `Services` | c, gold, navy | 10 cards |
| `Testimonials` | c, gold, navy, language | quotes + review carousel |
| `WhyUs` | c, gold, navy | stats counters + pillars + image |
| `Process` | c, gold, navy, language | 4-step + images |
| `Packages` | c, gold, navy | 4 pricing cards |
| `Contact` | c, gold, navy, language | form + details + footer + policy modal |
| `FloatingLine` | gold, lang | speed-dial |
| `TweaksPanel` | children | edit-mode overlay |

**Runtime globals ที่ component พึ่ง:** `React`, `ReactDOM`, `window.CONRAD_EXPRESS_DATA`, `window.TWEAK_DEFAULTS`, และ component ที่ประกาศไว้บน `window` (load order สำคัญ)

---

## 5. Build Pipeline

`scripts/build-static-bundle.mjs` (`npm run build`):

```
1. อ่าน jsxSources[] (13 ไฟล์ ตามลำดับ dependency)
2. transformJsx() ต่อไฟล์ — @babel/plugin-transform-react-jsx (runtime: classic), ตัด comments
3. รวมเป็น bundleSource ("use strict")
4. terser minify (compress passes:2, mangle) → dist/conrad-express.bundle.js (+ banner)
5. getSiteUrl() จาก env/.env.local (default vercel.app)
6. updateIndexSeo() — เขียน SEO meta block + CSP (hash JSON-LD) กลับ index.html
7. writeSeoFiles() — sitemap.xml + robots.txt
8. log ขนาด bundle (raw + gzip)
```

**jsxSources order:** tweaks-panel → shared → Nav → Hero → sections(Brands,Services,WhyUs,Process,Testimonials,Packages,Contact) → FloatingLine → app

---

## 6. Verification (QA)

`scripts/verify-static-site.mjs` (`npm run verify` = build + verify):

| กลุ่ม | เช็ค |
|---|---|
| Security | มี CSP + strict referrer; **ไม่มี** `unsafe-eval`, `@babel/standalone`, `type=text/babel`, react.development |
| SEO | SEO-META block, description, og:image, twitter card, JSON-LD, favicon link (ไม่ใช่ data URI) |
| Script order | local scripts ต้องเรียงตาม `expectedScriptOrder` (data → bundle) |
| Assets exist | ทุก local script + bundle (>1KB) + og-image + favicon + brand-images ที่อ้างถึง |
| Sitemap/robots | ตรงกับ `NEXT_PUBLIC_SITE_URL`; vercel.app → `Disallow` |
| Data integrity | รัน data modules ใน `vm` → COPY มี en+th, reviews en+th, review photos, policies ครบ 3, tweak defaults มี language |

fail → print รายการ + `process.exit(1)`

---

## 7. SEO Generation

| Output | ที่มา |
|---|---|
| `<title>` / meta / OG / Twitter | `SEO` object ใน build script (bilingual title, description) |
| JSON-LD | `Organization` schema (name, url, areaServed TH) — hash เข้า CSP |
| `robots` meta | `vercel.app` → `noindex,nofollow`; live → `index,follow` |
| `sitemap.xml` | home URL + lastmod (today) |
| `robots.txt` | `Allow: /` (live) / `Disallow: /` (preview) + sitemap ref |
| canonical / og:url | จาก `siteUrl` |

Marker ใน index.html: `<!-- SEO-META-BEGIN --> … <!-- SEO-META-END -->` (idempotent replace)

---

## 8. Contact Backend (Apps Script)

`integrations/google-sheets-contact.gs` — deploy เป็น Web App (execute as Me, access Anyone)

```
doPost(e)
  → parsePayload_(e)      // validate string types, required fields, lengths, language
  → LockService.waitLock(10000)
  → getSheet_() + ensureHeaders_() + literal rich text write + flush // 8 cols
  → sendNotification_()  // MailApp → NOTIFY_EMAILS; log-only ถ้าส่งอีเมลไม่ได้
  → json_({ok:true})
```

| ค่า | รายละเอียด |
|---|---|
| `SHEET_ID` | `1Q1pP6...ro0s` |
| `SHEET_NAME` | `Customer_Inbox` |
| `NOTIFY_EMAILS` | `conradtime.time@gmail.com` |
| Headers | Timestamp, Name, Phone, Shipment Type, Message, Language, Page URL, User Agent |
| Browser endpoint | `src/data/config.js → contact.formEndpoint = /api/contact` |
| Apps Script endpoint | `CONTACT_FORM_UPSTREAM` ใน Vercel หรือ fallback ใน `api/contact.js` |

> Vercel function อ่าน JSON หลังตาม Content Service redirect; frontend แสดง success และนับ conversion เมื่อ HTTP สำเร็จและ `ok === true` เท่านั้น ถ้าไม่ได้รับคำยืนยันจะเก็บข้อมูลฟอร์มไว้ โดยไม่ retry อัตโนมัติ

---

## 9. Configuration & Env

| Key | ที่ | ค่า |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `.env.local` / Vercel env | `https://conradexpress.com` |
| contact.email | config.js | `conradtime.time@gmail.com` |
| contact.lineUrl | config.js | `https://line.me/ti/p/~@ConradExpress` |
| contact.trackUrl | config.js | (ว่าง → fallback LINE) |
| contact.formEndpoint | config.js | `/api/contact` |
| CONTACT_FORM_UPSTREAM | Vercel env (optional) | Apps Script `/exec` URL; fallback ใน `api/contact.js` |
| heroBackground | config.js | `brand-images/Section_Hero.jpg` |
| TWEAK_DEFAULTS | tweaks.js | gold `#e2b56f`, navy `#0f1e35`, hero `dark`, lang `th` |

---

## 10. Security (CSP)

meta `Content-Security-Policy` (generate ตอน build):

```
default-src 'self'; base-uri 'none'; object-src 'none';
img-src 'self' data:; font-src 'self';
style-src 'self' 'unsafe-inline';                 ← inline styles ยังใช้เยอะ
script-src 'self' 'sha256-<JSON-LD hash>';        ← ไม่มี unsafe-eval
connect-src 'self' https://script.google.com https://script.googleusercontent.com;
form-action 'self'
```

- React/ReactDOM = production UMD (pinned + SRI)
- ไม่มี runtime Babel / eval
- referrer: `strict-origin-when-cross-origin`

---

## 11. Deployment

### Vercel Settings
| ตั้งค่า | ค่า |
|---|---|
| Preset | Other |
| Install | `npm install` |
| Build | `npm run build` |
| Output | `.` |
| Root | repository root (`project/`) |

### Release Checklist
1. `npm install` → 0 vulnerabilities
2. `npm run verify` ผ่าน
3. Browser smoke test (hero, sections, lang switch, form, floating LINE)
4. index.html ไม่มี `type=text/babel` / `unsafe-eval`
5. ตรวจ contact details + external links
6. commit ทั้ง source + `dist/conrad-express.bundle.js`
7. `git status --short` clean

### GAS Constraints (backend)
| Constraint | Limit |
|---|---|
| Execution time | 6 min |
| LockService | `waitLock(10000)` |
| Access | Web App = Anyone; Vercel function เป็นตัวส่ง POST และอ่าน acknowledgement |

---

## 12. Conventions & Constraints

- **Content แก้ที่ `src/data/*` เท่านั้น** — component ห้าม hardcode copy/ราคา/รูป
- ทุก copy ต้องมี `en` + `th` (verify enforce)
- เพิ่ม/แก้ component → ต้อง update `jsxSources[]` ใน build script + component ต้อง attach บน `window`
- ห้าม access `window.CONRAD_EXPRESS_DATA` ก่อน data scripts โหลด (รักษา script order)
- ห้ามเพิ่ม external host ใน script/connect โดยไม่แก้ CSP (จะโดน verify/CSP block)
- Node.js `>=20 <25` (แนะนำ `>=22.18.0`) สำหรับ build
- Regenerate `dist/` ทุกครั้งที่แก้ JSX แล้ว commit ตาม
- `dist/conrad-express.bundle.js` = generated — ห้ามแก้มือ
