# เอกสารความต้องการทางธุรกิจ (Business Requirements Document — BRD)

> **โครงการ:** Conrad Express — Static Marketing & Lead-Capture Site
> **เวอร์ชัน:** 1.1 — จาก codebase จริง
> **วันที่:** 2026-08-17
> **อ้างอิง:** [FRD](2_FRD_Functional_Requirements.md) · [UI/UX](3_UIUX_Design.md) · [TDD](4_TDD_Technical_Design.md)

---

## สารบัญ

1. ภาพรวมโครงการ
2. เป้าหมายธุรกิจ
3. ผู้มีส่วนได้ส่วนเสีย (Stakeholders)
4. ขอบเขตระบบ (Scope)
5. บริการและแพ็กเกจ (Product Offering)
6. Business Rules (BR)
7. ข้อกำหนดที่ไม่ใช่เชิงฟังก์ชัน (NFR)
8. Roadmap
9. Success Metrics

---

## 1. ภาพรวมโครงการ

Conrad Express คือแบรนด์บริการขนส่งสินค้ามูลค่าสูง (luxury / high-value logistics) ในไทย ในเครือ Conrad Time (ก่อตั้ง 2016) เว็บไซต์นี้เป็น **single-page marketing site** สองภาษา (TH/EN) ทำหน้าที่นำเสนอบริการ สร้างความน่าเชื่อถือ และเก็บ lead ผ่าน contact form

| รายการ | ค่า |
|---|---|
| ประเภท | Static landing page (one-page) |
| Platform | React 18 (UMD production) + static HTML/CSS |
| Build | `clasp`-free — pre-compile JSX → `dist/conrad-express.bundle.js` |
| Deploy | Vercel (`conradexpress.com`) |
| ภาษา | ไทย (default) + อังกฤษ, สลับได้ runtime |
| Backend | Google Apps Script Web App → Google Sheets (lead inbox) |
| ผู้ใช้งาน | ผู้เยี่ยมชมทั่วไป (prospect) + เจ้าของแบรนด์ (แก้ content) |
| สถานะปัจจุบัน | Production |

---

## 2. เป้าหมายธุรกิจ

| ID | เป้าหมาย | ตัวชี้วัด |
|---|---|---|
| BG-1 | สื่อสารความน่าเชื่อถือของแบรนด์ luxury logistics | trust badges, stats, testimonials, brand logos |
| BG-2 | เก็บ lead จากผู้สนใจใช้บริการ | contact form submit → Google Sheet |
| BG-3 | รองรับลูกค้าทั้งไทยและต่างชาติ | bilingual TH/EN สลับได้ |
| BG-4 | นำเสนอแพ็กเกจราคาชัดเจน | 4 tiers + priceNote |
| BG-5 | ให้ช่องทางติดต่อด่วน | LINE OA + phone + floating widget |
| BG-6 | SEO / discoverability | meta, OG, JSON-LD, sitemap, robots |
| BG-7 | Performance + security สูง | CSP strict, ไม่มี unsafe-eval, self-hosted assets |
| BG-8 | โปร่งใสด้านกฎหมาย | Privacy (PDPA) / Terms / Compensation policy |

---

## 3. ผู้มีส่วนได้ส่วนเสีย

| บทบาท | ความสนใจ |
|---|---|
| Prospect (ลูกค้าใหม่) | ดูบริการ ราคา ความน่าเชื่อถือ แล้วติดต่อ |
| Brand Owner | ยอด lead, ภาพลักษณ์แบรนด์, ความถูกต้องของ content |
| Content Editor | แก้ copy/ราคา/รูป ผ่าน `src/data/` + tweaks panel |
| Sales / CS | รับ lead จาก Google Sheet + email แล้วติดต่อกลับ |
| Developer | build, deploy, SEO, security, performance |
| Legal | Privacy/Terms/Compensation policy ตาม PDPA |

---

## 4. ขอบเขตระบบ (Scope)

### 4.1 อยู่ในขอบเขต (In Scope)

| รายการ | รายละเอียด |
|---|---|
| Landing sections | Nav, Hero, Brands, Services, Testimonials, Why Us, Process, Packages, Contact, Footer |
| Bilingual copy | TH/EN ทุก section ผ่าน `COPY` object |
| Contact form | name/phone/type/message → Apps Script → Sheet + email notify |
| Policy modals | Privacy / Terms / Compensation (in-page dialog) |
| Floating contact | speed-dial: LINE + track shipment |
| Edit mode | tweaks panel (สี, hero theme, ภาษา) — สำหรับ design handoff |
| SEO assets | title/meta/OG/JSON-LD/sitemap/robots สร้างตอน build |
| Reviews carousel | review cards + photos (bilingual) |

### 4.2 นอกขอบเขต (Out of Scope)

- ระบบ tracking พัสดุจริง (trackUrl fallback → LINE)
- ระบบชำระเงิน / จองออนไลน์แบบเต็ม (form เป็น lead เท่านั้น)
- User account / login
- CMS / admin dashboard (content แก้ผ่าน source file)
- Multi-page routing (เป็น single page + hash anchors)
- Native mobile app

---

## 5. บริการและแพ็กเกจ (Product Offering)

### 5.1 ประเภทสินค้าที่รับส่ง (Services)

นาฬิกาหรู · งานศิลปะ · ของสะสม · อัญมณี · ทอง · แฟชั่นลักชัวรี · เอกสารลับ · แกดเจ็ต · อุปกรณ์ไอที · อื่นๆ (case by case)

### 5.2 แพ็กเกจ (Packages)

| Package | ราคา | เหมาะกับ | หมายเหตุ |
|---|---|---|---|
| Standard | ฿500 (จาก ฿990+) | ส่งใน กทม./ปริมณฑล รายครั้ง | โปรโมชัน, same-day |
| Other Provinces | ฿5,900+ | ส่งต่างจังหวัด รายครั้ง | ทั่วประเทศ, same-day |
| 5 Delivery | ฿3,900+/เดือน | ธุรกิจส่งมูลค่าสูงรายเดือน | **MOST POPULAR**, 5 รอบ/เดือน |
| Exclusive | ติดต่อพนักงาน | ทีมส่งจำนวนมากต่อเนื่อง | unlimited, custom pricing |

> ทุกแพ็กเกจ: ค่าชดเชยสูงสุด ฿50,000 + ติดตามการขนส่งได้ (Exclusive = custom ตามตกลง)
> ราคาอาจเปลี่ยนตามมูลค่าสินค้าและวันที่ส่ง

---

## 6. Business Rules (BR)

| ID | Rule |
|---|---|
| BR-01 | Content ทั้งหมดมาจาก `src/data/*` — ห้าม hardcode ใน component |
| BR-02 | ทุก copy ต้องมีทั้ง `en` และ `th` (verify enforce) |
| BR-03 | Contact form ต้องมี name + phone + type ก่อน submit |
| BR-04 | Shipment type dropdown = รายการ services + "อื่นๆ/Other" |
| BR-05 | Form ส่งแบบ fire-and-forget (`no-cors`) — success ถือว่าส่งแล้ว |
| BR-06 | ค่าชดเชยมาตรฐานสูงสุด ฿50,000 (ยกเว้น Exclusive = ตามตกลง) |
| BR-07 | Policy 3 ฉบับ (privacy/terms/insurance) ต้องมีครบ (verify enforce) |
| BR-08 | Domain `vercel.app` → `noindex,nofollow`; live domain → `index,follow` |
| BR-09 | ภาษาเริ่มต้น = ไทย (`th`) |
| BR-10 | ก่อน release ต้องรัน `npm run verify` ผ่าน + commit `dist/` bundle ด้วย |

---

## 7. ข้อกำหนดที่ไม่ใช่เชิงฟังก์ชัน (NFR)

| ID | หมวด | ข้อกำหนด |
|---|---|---|
| NFR-1 | Performance | React/ReactDOM production build (pinned + SRI), fonts + vendor self-hosted, hero image `preload` |
| NFR-2 | Security | CSP strict — ไม่มี `unsafe-eval`, ไม่มี runtime Babel |
| NFR-3 | Security | `connect-src` จำกัดเฉพาะ script.google.com (form endpoint) |
| NFR-4 | Privacy | referrer `strict-origin-when-cross-origin`; form no-cors |
| NFR-5 | SEO | title/meta/OG/JSON-LD/sitemap/robots generate ตอน build |
| NFR-6 | Responsive | breakpoints 768/1024/1440; mobile → swipe carousel |
| NFR-7 | Accessibility | policy modal มี `role=dialog`, `aria-modal`, ESC ปิด, focus trap พื้นฐาน |
| NFR-8 | Maintainability | data-driven; verify script กัน regression |
| NFR-9 | Runtime | Node.js `>=20 <25` (แนะนำ `>=22.18.0`) สำหรับ build |

---

## 8. Roadmap

### Phase 1 — Static Site ✅ Done
Landing sections ครบ, bilingual, contact form → Sheet, policies, SEO, responsive, floating widget

### Phase 2 — Enhancements (แนวทาง)
- ระบบ tracking พัสดุจริง (แทน trackUrl fallback → LINE)
- Analytics / conversion tracking (GA4 / Meta Pixel — ต้องปรับ CSP)
- Booking flow / payment integration
- Blog / SEO content pages (multi-page)
- A/B test hero + packages

---

## 9. Success Metrics

| Metric | เป้าหมาย |
|---|---|
| Lead submissions/เดือน | เพิ่มขึ้นต่อเนื่อง |
| Contact form completion rate | สูง (form สั้น, 4 fields) |
| Bounce rate | ต่ำ (hero + trust ชัด) |
| Page load (LCP) | < 2.5s (self-hosted assets) |
| SEO index status | live domain indexed |
| Verify pass ก่อน deploy | 100% |
