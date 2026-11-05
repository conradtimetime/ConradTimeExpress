# Analytics & Tag Setup (Google Tag Manager)

เอกสารสำหรับใช้ตอนนัด Tag Implementation กับทีม Google และตอนเปิดใช้งานจริง

## สถานะปัจจุบัน

- Site มี code พร้อมแล้ว แต่ **ยังปิดอยู่** เพราะ `SITE_CONFIG.analytics.gtmId` ใน `src/data/config.js` ยังเป็นค่าว่าง
- ตอนปิดอยู่: ไม่โหลด Google script, ไม่ตั้ง cookie, ไม่แสดง cookie banner และ CSP เหมือนเดิมทุกตัว
- `dataLayer` และ event ทำงานตลอด (อยู่ในหน้าเว็บเท่านั้น ไม่ส่งออกไปไหน)

## เปิดใช้งาน

1. สร้าง container ที่ https://tagmanager.google.com (ประเภท Web) แล้ว copy ID รูปแบบ `GTM-XXXXXXX`
2. ใส่ใน `src/data/config.js`
   ```js
   analytics: {
     gtmId: "GTM-XXXXXXX",
   },
   ```
3. `npm run verify` (build จะใส่ ID ลง `index.html` และเปิด CSP ให้ Google tag hosts ให้เอง)
4. Deploy (Vercel)

ถ้าใส่ ID ผิดรูปแบบ build จะ fail ทันที

## โครงสร้าง

| ไฟล์ | หน้าที่ |
|---|---|
| `src/analytics.js` | โหลดแบบ sync ใน `<head>` ตั้ง Consent Mode default → โหลด GTM → ดัก click ปุ่มติดต่อ → expose `window.ConradAnalytics` |
| `src/components/ConsentBanner.jsx` | Cookie banner (PDPA) แสดงเฉพาะเมื่อมี GTM ID |
| `src/components/sections/Contact.jsx` | ยิง `generate_lead` เมื่อส่งฟอร์มสำเร็จ และมีปุ่ม "ตั้งค่าคุกกี้" ในส่วนท้าย |
| `scripts/build-static-bundle.mjs` | อ่าน `gtmId` → ใส่ `data-gtm-id` ใน `index.html` + สร้าง CSP |
| `scripts/verify-static-site.mjs` | เช็กว่า ID ตรงกัน และ CSP เปิดเฉพาะเมื่อมี ID |

## Events ใน dataLayer

| Event | ยิงเมื่อ | Parameters |
|---|---|---|
| `generate_lead` | ส่งฟอร์มติดต่อสำเร็จ (**conversion หลัก**) | `form_name` = `contact`, `shipment_type` (ชื่อบริการที่เลือก ตามภาษาที่แสดง), `form_language` (`th`/`en`) |
| `line_click` | คลิกลิงก์ LINE (`line.me` / `lin.ee`) | `cta_location`, `link_url`, `package_name` (เฉพาะปุ่มในแพ็กเกจ) |
| `phone_click` | คลิกเบอร์โทร (`tel:`) | `cta_location`, `link_url` |
| `email_click` | คลิก email (`mailto:`) | `cta_location`, `link_url` |
| `cta_click` | คลิกลิงก์อื่นที่มี `data-cta` | `cta_location`, `link_url` |
| `consent_update` | ผู้ใช้เลือกใน cookie banner | `consent_choice` (`granted`/`denied`) |

ค่า `cta_location`: `nav`, `nav_mobile`, `hero`, `package`, `floating_line`, `floating_track` (ปุ่ม "ติดตามพัสดุ" ตอนนี้ลิงก์ไป LINE เพราะ `trackUrl` ยังว่าง), `contact_details` (LINE OA / Email / Phone ใน section ติดต่อ)

ไม่มี PII (ชื่อ, เบอร์โทร, ข้อความ) ใน event ใดๆ

เพิ่มจุด track ใหม่: ใส่ `data-cta="ชื่อจุด"` ที่ `<a>` ลิงก์ LINE / tel / mailto จะถูกจับเองอัตโนมัติ

## Consent Mode v2

- Default: `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` = `denied` (`functionality_storage`, `security_storage` = `granted`, `wait_for_update` = 500ms), `ads_data_redaction` = true
- กด "ยอมรับทั้งหมด" → update เป็น `granted` ทั้ง 4 ตัว และจำค่าใน `localStorage` (`conrad-consent`)
- กด "เฉพาะที่จำเป็น" → คงเป็น `denied` ถ้าเคยยอมรับไว้แล้วถอนภายหลัง จะลบ cookie `_ga*`, `_gid`, `_gat*`, `_gcl*`, `_gac*` ให้ด้วย
- เป็นแบบ **Advanced consent mode**: GTM โหลดเสมอ Google tag ส่ง cookieless ping ตอนยังไม่ได้รับ consent (Google ใช้ทำ conversion modeling)

## ตั้งค่าใน GTM (ทำตอนนัดกับทีม Google)

**Variables** (ประเภท Data Layer Variable): `cta_location`, `package_name`, `shipment_type`, `form_language`

**Triggers** (ประเภท Custom Event):
- `CE - generate_lead` → Event name `generate_lead`
- `CE - line_click` → Event name `line_click`
- `CE - phone_click` → Event name `phone_click`

**Tags**:
1. **Google Tag** (GA4 Measurement ID `G-...` และ/หรือ Google Ads `AW-...`) → trigger **Initialization - All Pages**
2. **Conversion Linker** → trigger **Initialization - All Pages**
3. **Google Ads Conversion Tracking** (conversion "ส่งฟอร์มติดต่อ") → trigger `CE - generate_lead`
4. **Google Ads Conversion Tracking** (conversion "คลิก LINE", ถ้าต้องการ) → trigger `CE - line_click`
5. **Google Ads Conversion Tracking** (conversion "คลิกโทร", ถ้าต้องการ) → trigger `CE - phone_click`
6. **GA4 Event** `generate_lead` / `line_click` / `phone_click` พร้อม parameters ข้างบน → mark เป็น key event ใน GA4

ไม่ต้องตั้ง consent เพิ่มใน tag: Google tag อ่าน Consent Mode จาก site เอง (built-in consent checks)

## ข้อจำกัดจาก CSP (สำคัญ บอกทีม Google ด้วย)

Site ใช้ Content-Security-Policy เข้ม (ไม่มี `'unsafe-inline'` / `'unsafe-eval'` ใน `script-src`) ผลคือ

- ✅ ใช้ได้: tag template ที่ GTM มีให้ (Google Tag, Google Ads Conversion, Conversion Linker, GA4 Event) และ GTM Preview / Tag Assistant
- ❌ ใช้ไม่ได้: **Custom HTML tag** และ **Custom JavaScript variable**
- ❌ tag ของเจ้าอื่น (Meta Pixel, TikTok ฯลฯ) จะถูก block จนกว่าจะเพิ่ม host ใน `GOOGLE_TAG_CSP` / `buildCsp()` ใน `scripts/build-static-bundle.mjs`

ถ้า tag ไหนไม่ยิง ให้เปิด DevTools → Console ดูว่ามี error `Refused to load ... Content Security Policy` ไหม

## ทดสอบ

1. GTM → **Preview** → ใส่ URL site → เปิด Tag Assistant
2. กด "ยอมรับทั้งหมด" ใน banner → ดู consent state ใน Tag Assistant (tab Consent) เปลี่ยนเป็น Granted
3. คลิกปุ่ม LINE → ต้องเห็น event `line_click` พร้อม `cta_location`
4. ส่งฟอร์ม (ใช้ข้อมูลทดสอบ เพราะเข้า Google Sheet จริง) → ต้องเห็น `generate_lead` และ Google Ads conversion tag fired
5. GA4 → Admin → DebugView ดู event เข้า

## เรื่องที่ยังต้องตัดสินใจ / ทำต่อ

- **Privacy Policy**: ร่างเรื่อง Google แล้วใน `src/data/policies.js` (ข้อ 4, 5, 6, 7 และข้อ 8 คุกกี้ ซึ่งมีตารางชื่อคุกกี้) **ยังต้องให้ที่ปรึกษากฎหมายตรวจ** และต้องทำให้ตรงกับของจริง:
  - GA4 → Admin → Data collection and modification → Data retention ตั้งเป็น **14 months** ให้ตรงกับข้อ 7
  - รายชื่อคุกกี้ในข้อ 8 อิงจาก Google Tag + Conversion Linker ถ้าทีม Google เพิ่ม tag อื่น (เช่น Remarketing / Floodlight) ต้องเพิ่มคุกกี้ในตาราง
  - ถ้าเปิด Enhanced Conversions ต้องแก้ประโยค "ข้อมูลที่ส่งให้ Google ไม่รวมชื่อ หมายเลขโทรศัพท์..." ในข้อ 8
- **Enhanced Conversions**: ทีม Google มักแนะนำ (ส่งเบอร์โทรแบบ hash ไป Google Ads ช่วยให้วัด conversion แม่นขึ้น) ยังไม่ได้ทำ ต้องแก้ code ให้ส่งเบอร์ใน dataLayer ตอน `generate_lead` และต้องระบุใน Privacy Policy
- ฟอร์มส่งผ่าน same-origin `/api/contact`; `generate_lead` ยิงเฉพาะเมื่อ HTTP สำเร็จและ Apps Script ยืนยัน `ok:true` หลังบันทึก Google Sheets แล้ว ข้อผิดพลาดและ timeout ไม่ถูกนับเป็น conversion
