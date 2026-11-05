# เอกสารข้อกำหนดเชิงฟังก์ชัน (Functional Requirements Document — FRD)

> **โครงการ:** Conrad Express — Static Marketing & Lead-Capture Site
> **เวอร์ชัน:** 1.1 — จาก codebase จริง
> **วันที่:** 2026-08-17
> **อ้างอิง:** [BRD](1_BRD_Business_Requirements.md) · [UI/UX](3_UIUX_Design.md) · [TDD](4_TDD_Technical_Design.md)

---

## สารบัญ

1. Actor Matrix
2. Page Flow Overview
3. Module A — Navigation & Hero
4. Module B — Content Sections
5. Module C — Packages & Pricing
6. Module D — Contact & Lead Capture
7. Module E — Policy Documents
8. Module F — Floating Contact Widget
9. Module G — Internationalization (i18n)
10. Module H — Edit Mode (Tweaks Panel)
11. Business Rules Summary
12. State / Interaction Flows

---

## 1. Actor Matrix

| Actor | สิ่งที่ทำได้ |
|---|---|
| Visitor (Prospect) | เลื่อนดูทุก section, สลับภาษา, กรอก contact form, เปิด policy, กด LINE/Phone |
| Sales / CS | รับ lead จาก Google Sheet `Customer_Inbox` + email notification |
| Content Editor | แก้ copy/ราคา/รูป ใน `src/data/*`, ปรับ tweaks panel |
| Developer | build, verify, deploy, จัดการ SEO/CSP |

---

## 2. Page Flow Overview

```
SINGLE PAGE (hash anchors)
  Nav ─► Hero ─► Brands ─► Services ─► Testimonials ─► Why Us
      ─► Process ─► Packages ─► Contact (+ Footer) ─► FloatingLine (overlay)

NAV ANCHORS
  #services · #why (about) · #process · #packages · #contact

LEAD FLOW
  Contact form ─► fetch(no-cors) ─► Apps Script Web App ─► Google Sheet + email
```

---

## 3. Module A — Navigation & Hero

### 3.1 Nav (`Nav.jsx`)
| ฟังก์ชัน | เงื่อนไข |
|---|---|
| Anchor links | Services / About(#why) / Process / Packages / Contact |
| Scrolled state | `window.scrollY > 60` → เปลี่ยนพื้นหลัง nav (rAF-throttled) |
| Language toggle | ปุ่มธง TH/US สลับภาษา (`setLang`) |
| CTA "Book a Service" | เปิด LINE OA |
| Hamburger | `≤900px` → collapse เป็น mobile menu |
| No-reflow trick | ทุก link เก็บทั้ง en+th เพื่อ size ให้กว้างสุด ไม่ shift ตอนสลับภาษา |

### 3.2 Hero (`Hero.jsx`)
| ฟังก์ชัน | เงื่อนไข |
|---|---|
| Full-screen hero | `100vh`, background image `Section_Hero.jpg` (object-fit cover) |
| Theme | `dark` / `light` (จาก tweaks `heroLayout`) |
| Title | multiline (`\n`), starting price, trust badges |
| CTA | Book a Service (LINE) + Learn More (scroll) |
| Animations | `heroFadeUp` keyframes แบบ stagger |

---

## 4. Module B — Content Sections

| Section | ไฟล์ | เนื้อหา |
|---|---|---|
| Brands | `Brands.jsx` | "Brands That Trust Us" + brand names/logos |
| Services | `Services.jsx` | 10 ประเภทสินค้า (title + desc) |
| Testimonials | `Testimonials.jsx` | 5 quote (author/role) + review cards/photos, mobile carousel |
| Why Us | `WhyUs.jsx` | stats (08 ปี, 99.8%, 10K+, 77 จังหวัด) + pillars (6 มาตรฐาน) + image |
| Process | `Process.jsx` | 4 ขั้นตอน (Talk → Pickup → On the way → Delivered) + รูปแต่ละ step |

**Data sources:** `COPY[lang].{brands, services, testimonials, why, pillars, process}`, `REVIEW_CARDS`, `ASSETS`

**Animated counters:** element `[data-counter]` → นับเลขขึ้นแบบ ease-out cubic เมื่อ scroll เข้า viewport (รองรับ prefix/suffix เช่น `฿2B+`, `08`)

---

## 5. Module C — Packages & Pricing

### 5.1 Packages (`Packages.jsx`)
| ฟังก์ชัน | เงื่อนไข |
|---|---|
| Package cards | 4 tiers จาก `COPY[lang].packages.items` |
| Highlight | `highlight:true` + badge "MOST POPULAR" (5 Delivery) |
| Corner tag | `cornerTag` (เช่น "โปรโมชัน") ตำแหน่ง right |
| Price display | `price` / `original` (ขีดฆ่า) / `priceText` (เช่น "ติดต่อพนักงาน") |
| Price note | `packages.priceNote` — ราคาเปลี่ยนตามมูลค่า/วันที่ |
| CTA | "จองการใช้บริการ" → LINE |
| Details/Features | list ต่อ card (รอบ, พื้นที่, ค่าชดเชย, tracking) |

---

## 6. Module D — Contact & Lead Capture

### 6.1 Contact Form (`Contact.jsx`)
| Field | เงื่อนไข |
|---|---|
| Name | required, maxLength 80, autoComplete `name` |
| Phone | required, `inputMode=tel`, maxLength 32 |
| Shipment Type | required, select = services + "อื่นๆ/Other" |
| Message | optional, maxLength 600 |

| ฟังก์ชัน | เงื่อนไข |
|---|---|
| Validate | ต้องมี name + phone + type (trim) ก่อนส่ง |
| Submit | `fetch(endpoint, {method:POST, mode:'no-cors', text/plain})` |
| Payload | name, phone, type, message, language, pageUrl, submittedAt, userAgent |
| States | `idle → submitting → success/error` (success reset form + auto-clear 5s) |
| Success msg | "รับคำขอแล้ว จะติดต่อกลับใน 2 ชม." (bilingual) |
| Contact details | LINE OA `@ConradExpress`, email, phone `+66 2 016 9950` |

### 6.2 Backend Receiver (`integrations/google-sheets-contact.gs`)
| ฟังก์ชัน | เงื่อนไข |
|---|---|
| `doPost(e)` | parse JSON → append row → email notify |
| `parsePayload_(e)` | throw ถ้าไม่มี name/phone/type |
| Sheet | `Customer_Inbox` (8 cols): Timestamp, Name, Phone, Shipment Type, Message, Language, Page URL, User Agent |
| Concurrency | `LockService.waitLock(10000)` ก่อน append |
| Notify | `MailApp.sendEmail` → `conradtime.time@gmail.com` |

---

## 7. Module E — Policy Documents

### 7.1 Policy Modal (`Contact.jsx` → `PolicyPanel`)
| ฟังก์ชัน | เงื่อนไข |
|---|---|
| Trigger | footer links (Privacy / Terms / Compensation) |
| Data | `POLICIES.documents[id]` — sections + blocks |
| Block types | `paragraph` / `list` / `ordered` / `table` |
| Inline markup | `**bold**` → `<strong>` |
| Render | `createPortal` → `document.body` |
| A11y | `role=dialog`, `aria-modal`, `aria-labelledby`, ESC ปิด, lock body scroll |
| Order | `POLICIES.order = [privacy, terms, insurance]` (ต้องครบ 3) |

**Policy content:** ไทย, อ้าง PDPA (พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562)

---

## 8. Module F — Floating Contact Widget

### 8.1 FloatingLine (`FloatingLine.jsx`)
| ฟังก์ชัน | เงื่อนไข |
|---|---|
| Appear | หลังโหลด 1200ms (`visible`) |
| Speed-dial | กดเปิด → actions: Track Shipment + Chat on LINE |
| Track URL | `SITE_CONFIG.contact.trackUrl` fallback → lineUrl |
| Labels | bilingual (`LABELS[lang]`) |

---

## 9. Module G — Internationalization (i18n)

| ฟังก์ชัน | เงื่อนไข |
|---|---|
| Language state | `App` useState, default จาก tweaks (`th`) |
| Copy select | `c = COPY[language] || COPY.en` |
| Persist | `setTweak('language', l)` |
| Coverage | ทุก section + form + policy + widget เป็น bilingual |
| Fallback | ไม่มีภาษา → `en` |

---

## 10. Module H — Edit Mode (Tweaks Panel)

### 10.1 Tweaks (`tweaks-panel.jsx`, `src/data/tweaks.js`)
| Control | ค่า |
|---|---|
| Gold Accent | color (`accentColor` default `#e2b56f`) |
| Navy Background | color (`navyColor` default `#0f1e35`) |
| Hero Theme | radio `dark`/`light` |
| Language | radio `en`/`th` |

> ใช้สำหรับ design handoff (Claude Design host messaging); defaults อยู่ระหว่าง marker `/*EDITMODE-BEGIN*/ ... /*EDITMODE-END*/`

---

## 11. Business Rules Summary

ดูรายละเอียดใน [BRD §6](1_BRD_Business_Requirements.md#6-business-rules-br)

| ID | Rule (สรุป) |
|---|---|
| BR-01 | Content จาก `src/data/*` เท่านั้น |
| BR-02 | ทุก copy มี en + th |
| BR-03 | Contact form ต้องมี name+phone+type |
| BR-05 | Form submit แบบ no-cors (fire-and-forget) |
| BR-07 | Policy ครบ 3 ฉบับ |
| BR-08 | vercel.app → noindex |

---

## 12. State / Interaction Flows

### Contact Form
```
idle ──(submit valid)──► submitting ──► success ──(5s)──► idle
                                    └──► error (คง form ไว้ให้แก้)
```

### Policy Modal
```
closed ──(click footer link)──► open (portal, body locked)
   └──(ESC / click overlay / Close)──► closed
```

### Language
```
th (default) ◄──► en   (nav flag toggle → persist to tweaks)
```

### Scroll Reveal
```
element (.reveal*) ──IntersectionObserver(0.12)──► add .visible
  fallback: ไม่มี IO → reveal ทั้งหมดทันที
```
