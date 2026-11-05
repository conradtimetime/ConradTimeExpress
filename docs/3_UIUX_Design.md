# เอกสารการออกแบบ (UI / UX Design Document)

> **โครงการ:** Conrad Express — Static Marketing & Lead-Capture Site
> **เวอร์ชัน:** 1.1 — จาก codebase จริง
> **วันที่:** 2026-08-17
> **อ้างอิง:** [BRD](1_BRD_Business_Requirements.md) · [FRD](2_FRD_Functional_Requirements.md) · [TDD](4_TDD_Technical_Design.md)

---

## สารบัญ

1. Design Tokens & Brand
2. Typography
3. Component Inventory
4. Section Layout & Order
5. Responsive System
6. Motion & Interaction
7. Section-specific Notes
8. Accessibility

---

## 1. Design Tokens & Brand

แนวคิด: **luxury / editorial** — navy เข้ม + gold + cream, serif display + sans body

```css
/* Color (index.html :root) */
--navy:        #0f1e35;   /* base background (dark sections) */
--navy-mid:    #162440;
--navy-light:  #1d2f50;
--gold:        #e2b56f;   /* primary accent */
--gold-light:  #fff0c9;   /* hover / highlight */
--gold-pale:   #f9e5b8;
--gold-deep:   #c99752;
--gold-gradient: linear-gradient(135deg, gold-pale → gold → gold-light → gold-deep);
--cream:       #f9f6f0;   /* page background (light) */
--cream-dark:  #f0ebe0;
--text-dark:   #0d1a2e;
--text-mid:    #4a5568;
--text-light:  #8a9bb0;
--white:       #ffffff;
```

**Tweakable (runtime):** `accentColor` (gold), `navyColor` (navy) — ผ่าน tweaks panel

### Watermark
`body::before` — SVG 4-point star pattern (gold, opacity ~0.06–0.09) repeat ทั้งหน้า

### Scrollbar
width 4px, track navy, thumb gold radius 2px

---

## 2. Typography

| Role | Font | Note |
|---|---|---|
| Display / headings | **Cormorant Garamond** (serif) | 300–700, italics; hero + section titles |
| Body / UI | **Jost** (sans) | 300/400/500; ตัวหนังสือ, form, labels |

- Self-hosted `vendor/fonts/*.woff2` (latin + latin-ext) ผ่าน `fonts.css`
- Labels/eyebrows: `letter-spacing` กว้าง (0.1–0.22em), uppercase, gold
- ตัวเลข/ราคา: Cormorant สำหรับ display, Jost สำหรับรายละเอียด

---

## 3. Component Inventory

| Component | ไฟล์ | หน้าที่ |
|---|---|---|
| `Nav` | Nav.jsx | sticky nav + anchors + lang toggle + burger |
| `Hero` | Hero.jsx | full-screen hero, dark/light theme |
| `Brands` | sections/Brands.jsx | trust logos strip |
| `Services` | sections/Services.jsx | 10 service cards |
| `Testimonials` | sections/Testimonials.jsx | quotes + review cards carousel |
| `WhyUs` | sections/WhyUs.jsx | stats counters + pillars + image |
| `Process` | sections/Process.jsx | 4-step timeline + images |
| `Packages` | sections/Packages.jsx | 4 pricing cards |
| `Contact` | sections/Contact.jsx | form + details + footer + policy modal |
| `FloatingLine` | FloatingLine.jsx | speed-dial (LINE + track) |
| `StarIcon` | shared.jsx | brand 4-point star SVG |
| `PhotoPlaceholder` | shared.jsx | fallback ภาพ |
| `CardSwiper` | shared.jsx | mobile carousel (arrows + dots) |
| `SectionEyebrow` | shared.jsx | label ด้านบน heading |
| `TweaksPanel` + controls | tweaks-panel.jsx | edit-mode controls |

---

## 4. Section Layout & Order

ลำดับ render (จาก `app.jsx`):

```
┌──────────────────────────────────────────────────┐
│ Nav (sticky, transparent → solid on scroll)      │
├──────────────────────────────────────────────────┤
│ Hero (#hero, 100vh)                              │
│   headline + starting price + trust badges + CTA │
├──────────────────────────────────────────────────┤
│ Brands — "Brands That Trust Us"                  │
│ Services (#services) — 10 cards grid             │
│ Testimonials — quote cards + review carousel     │
│ Why Us (#why) — stats + pillars + image (g-split)│
│ Process (#process) — 4 steps + images            │
│ Packages (#packages) — 4 pricing cards           │
│ Contact (#contact, ~100vh) — form + details      │
│   └─ Footer (in-section, dark #060e1a)         │
├──────────────────────────────────────────────────┤
│ FloatingLine (fixed overlay, bottom)             │
└──────────────────────────────────────────────────┘
```

### Contact Layout (canonical two-column)
```
┌───────────────────────────────┬───────────────────────────────┐
│  Copy (reveal-left)           │  Form (reveal-right)          │
│  • Eyebrow + Title            │  • Name                       │
│  • Sub (hours / hotline)      │  • Phone                      │
│  • Contact details:           │  • Shipment Type (select)     │
│    LINE OA / Email / Phone    │  • Message (textarea)         │
│                               │  • [Send Request] (gold btn)  │
├───────────────────────────────┴───────────────────────────────┤
│  Footer: brand · tagline · policy links · © copy              │
└───────────────────────────────────────────────────────────────┘
```

---

## 5. Responsive System

Breakpoints (index.html + inline `!important` overrides):

| Class | Device | ≤1440 | ≤1024 | ≤767 | ≤560 |
|---|---|---|---|---|---|
| Section padding | — | `84px 64px` | `72px 40px` | `56px 22px` | — |
| `.g-3` | grid | 3col | 1col | 1col | 1col |
| `.g-4` | grid | 4col | 2col | 2col | 1col |
| `.g-2` / `.g-split` | grid | 2col | 2col (gap↓) | 1col | 1col |
| Nav | — | full | full | burger (≤900) | burger |
| Hero | — | full | width 70% | width 100%, aside hidden | — |

### Mobile Carousel (`.swipe`)
`≤767px` → card grid กลายเป็น horizontal scroll-snap (1 card/view) + `.swipe-nav` arrows + `.swipe-dots` (จาก `CardSwiper`)

---

## 6. Motion & Interaction

| Effect | รายละเอียด |
|---|---|
| Scroll reveal | `.reveal / -left / -right / -scale / -stagger` → `.visible` ผ่าน IntersectionObserver (threshold 0.12) |
| Stagger | children delay 120ms ต่อชิ้น (nth-child 1–6) |
| Hero entrance | `heroFadeUp` keyframes, delay ทีละ 0.10/0.24/0.38s |
| Number counters | `[data-counter]` นับขึ้น ease-out cubic 1800ms, preserve prefix/suffix/leading-zero |
| Nav scroll | `scrollY > 60` → solid bg (rAF-throttled, passive) |
| Button hover | gold → gold-light + `translateY(-2px)` |
| Form underline | focus → border-bottom gold |
| Easing | `cubic-bezier(0.16,1,0.3,1)` เป็นหลัก |
| Selection | `::selection` gold bg / navy text |

---

## 7. Section-specific Notes

### Hero
- Background left/center focus (ขวาถูก headline + scrim บัง)
- แนะนำภาพ 2560×1440 JPG ≤600KB
- Dark theme = navy gradient; Light = cream gradient

### Packages
- Highlight card ("5 Delivery") ยกเด่น + badge
- Corner tag "โปรโมชัน" มุมขวา, ราคาเดิมขีดฆ่า
- Exclusive → "ติดต่อพนักงาน" แทนราคา

### Testimonials
- 5 quotes + review cards (bilingual, tags เช่น GOLD/PLATINUM PLAN)
- review photos 11 รูป (`brand-images/review-*.jpg`)

### Policy Modal
- Overlay blur + gold border, gradient navy panel
- Table แบบ scroll-x, gold header

---

## 8. Accessibility

| ประเด็น | การจัดการ |
|---|---|
| Policy modal | `role=dialog`, `aria-modal`, `aria-labelledby`, ESC close, body scroll lock |
| Form status | `aria-live=polite` |
| Language toggle | `aria-label` "Switch to Thai/English" |
| Reduced-motion fallback | ไม่มี IO → reveal ทันที (ไม่ค้าง opacity:0) |
| Contrast | gold บน navy, text บน cream ผ่านเกณฑ์อ่านง่าย |
| Reflow guard | nav links เก็บ 2 ภาษา กัน layout shift |
