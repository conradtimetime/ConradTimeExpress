# Conrad Express — Test Cases

วันที่จัดทำ: 5 พฤศจิกายน 2026 · ขอบเขต: โค้ดปัจจุบันใน workspace และเว็บทดสอบเฉพาะเครื่อง

เอกสารนี้กำหนดขั้นตอนและผลที่คาดหวังก่อนอ่านผลการรันจริงในรายงานการทดสอบ ไม่ใช่การรับรองว่า production ทุกส่วนทำงานแล้ว

## สภาพแวดล้อมและวิธีรันทดสอบ

- ใช้ dependencies ที่ติดตั้งจาก `package.json` และ Node.js ตาม `engines` ของโครงการ (`>=20 <25`; README แนะนำ `>=22.18.0`) รายงานผลจริงต้องระบุเวอร์ชันที่ใช้ด้วย
- Component tests รัน JSX จริงผ่าน Babel ใน VM พร้อม hooks, DOM, timer และ geometry จำลอง ตรวจพฤติกรรมและข้อมูลได้ แต่ไม่ได้แทน browser rendering จริง
- API tests เรียก handler จริงด้วย request/response และ upstream จำลอง ส่วน Apps Script tests จำลอง SpreadsheetApp, LockService และ MailApp ไม่มีการเขียนชีตหรือส่งอีเมลจริง
- Analytics tests ใช้ dataLayer, localStorage, cookie และ script insertion จำลอง ไม่มีการเรียก GTM/GA4/Ads จริงจาก unit tests
- Browser QA ใช้ `npm run qa:serve` ที่ `http://127.0.0.1:8755/` โดย `/api/contact` ใช้ production handler แต่ upstream ถูกแทนด้วย mock ภายในเครื่องเสมอ การส่งฟอร์มบนเซิร์ฟเวอร์นี้ไม่เขียน Google Sheets และไม่ส่งอีเมลจริง
- Browser QA ใช้ชื่อและเบอร์โทรจำลองเท่านั้น ไม่ใช้ข้อมูลส่วนบุคคลจากภาพหน้าจอ และตรวจปลายทาง CTA โดยไม่ส่งข้อความหรือจองบริการจริง
- `npm run qa:serve` จำลอง contact upstream และปิดเฉพาะ GTM network loader ใน script ที่เสิร์ฟให้ browser โดยคง consent และ local dataLayer ไว้ จึงไม่ส่ง test conversions ไปยัง production container; source/build production ไม่ถูกเปลี่ยนด้วย QA guard นี้

```sh
# Build, static verification, automated test cases ทั้งหมด และ CardSwiper
npm run verify

# รัน automated test cases โดยไม่ build ซ้ำ
npm test

# เปิดเว็บสำหรับ browser QA ด้วย contact upstream จำลอง
npm run qa:serve
```

ข้อความในฟอร์มใช้ควบคุม upstream จำลองได้: `[qa:fail]` = ไม่ยืนยันการบันทึก, `[qa:bad-json]` = response ไม่ใช่ JSON, `[qa:http-error]` = HTTP 503, `[qa:network-error]` = network error และ `[qa:slow]` = หน่วง 1.5 วินาทีเพื่อดูสถานะกำลังส่ง ถ้าไม่มี marker เหล่านี้จะตอบ `{ok:true}` จำลอง

## การนับและความหมายของผล

| ชุดทดสอบ | จำนวน `node:test` |
|---|---:|
| Sections: Nav, Hero, Brands, Services, Why Us, Process, Testimonials, Packages, Floating Contact | 22 |
| Contact form และ Policy | 21 |
| Contact API | 5 |
| Apps Script receiver | 7 |
| Analytics และ ConsentBanner | 16 |
| **รวม** | **71** |

CardSwiper เป็น standalone assertion suite อีก **5 สถานการณ์** ไม่ได้นับรวมใน 71 รายการของ `node:test` การตรวจ static assets/SEO/CSP และ browser QA รายงานแยกจากจำนวนนี้เช่นกัน หนึ่ง test case อาจตรวจหลายภาษา หลายค่า หรือหลาย failure variant โดยยังนับเป็นหนึ่งรายการตาม `test()` จริง

- **PASS:** ขั้นตอนรันสำเร็จและผลตรงกับ assertion/expected result ภายใต้ environment ที่ระบุ
- **FAIL:** รันทดสอบได้แต่ผลไม่ตรงกับ expected result ต้องบันทึก actual result และหลักฐาน
- **BLOCKED:** ยังทดสอบไม่ได้เพราะขาด environment, profile, สิทธิ์ หรือระบบภายนอก ห้ามนับเป็น PASS

TC-API01–05 และ TC-GS01–07 เป็น ID อ้างอิงตามลำดับ `test()` ในไฟล์เดิม ซึ่งชื่อ test ภายในไฟล์ไม่ได้ขึ้นต้นด้วย ID ส่วน ID กลุ่มอื่นตรงกับชื่อ test ในไฟล์

## Navigation — 4 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-NAV01 | Mount Nav ทั้ง TH/EN; ตรวจ 5 section links และปุ่มจอง | Anchors เป็น services/why/process/packages/contact; CTA ชี้ LINE ที่ตั้งไว้ พร้อม `_blank`, `noopener noreferrer` และข้อความไม่ว่าง | `scripts/test-sections.cjs` |
| TC-NAV02 | เริ่ม TH กดปุ่ม English; เปลี่ยน props เป็น EN แล้วกด Thai | เรียก language callback เป็น `en` แล้ว `th` ตามลำดับ | `scripts/test-sections.cjs` |
| TC-NAV03 | เปิด hamburger; ตรวจ contact link ใน mobile panel; กดลิงก์นั้น | Panel เพิ่ม anchors ที่ตรงกับ desktop และปิดหลังเลือก | `scripts/test-sections.cjs` |
| TC-NAV04 | Mount ก่อน scroll; เปลี่ยน `scrolled` เป็น true | Nav เปลี่ยนจากโปร่งใสเป็นพื้นเข้มตาม theme | `scripts/test-sections.cjs` |

## Hero — 2 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-HR01 | Mount TH/EN; ตรวจ h1, background image, ราคา, trust labels และ 2 CTA | Copy ตรงภาษา; รูปมีจริง; ราคาเริ่มต้นตรง package แรก; CTA จองชี้ LINE และ Learn More ชี้ services | `scripts/test-sections.cjs` |
| TC-HR02 | Mount theme dark แล้วเปลี่ยนเป็น light | สี h1 เปลี่ยนขาว/กรมท่าตาม theme ที่กำหนด | `scripts/test-sections.cjs` |

## Brands — 1 case

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-BR01 | Mount TH/EN; ตรวจ partner cards, logos และ URLs ทั้งหมด | มี 5 แบรนด์; รูปมีจริง; alt/accessible label ไม่ว่าง; external links มี rel ปลอดภัยและ title ตรงภาษา | `scripts/test-sections.cjs` |

## Services — 2 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-SV01 | Mount TH/EN; ตรวจ IDs, การ์ด, title, description, photo และ CTA | มี 10 IDs ไม่ซ้ำและตรงกันทั้งสองภาษา; copy/alt ถูกต้อง; รูปมีจริง; card รับ focus ได้; CTA ชี้ contact | `scripts/test-sections.cjs` |
| TC-SV02 | เรียก onError ของรูปบริการหนึ่งใบ | ซ่อนรูปที่เสีย แต่ fallback, title และข้อมูลของทั้ง 10 บริการยังอยู่ | `scripts/test-sections.cjs` |

## Why Us — 2 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-WHY01 | Mount TH/EN; ตรวจ heading และ trust pillars | มี 6 pillars; title/subtitle/description ตรงข้อมูลแต่ละภาษา; CTA ชี้ contact | `scripts/test-sections.cjs` |
| TC-WHY02 | Hover pillar ที่สามแล้ว mouse leave | มี hover state เพียงหนึ่งใบและล้าง state หลังออก | `scripts/test-sections.cjs` |

## Process — 3 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-PR01 | Mount Process ครั้งแรก | มี 4 ขั้นตอน; step แรก active; progress 25%; รูปตรงขั้นแรกและมีไฟล์จริง; CTA ชี้ contact | `scripts/test-sections.cjs` |
| TC-PR02 | Mount TH/EN แล้วเลือกแต่ละ step 1–4 | Active เพียงหนึ่ง step; progress 25/50/75/100%; completed flags เท่าขั้นก่อนหน้า; รูปและ alt ตรง step/ภาษา | `scripts/test-sections.cjs` |
| TC-PR03 | เลือกขั้น 4 แล้วกลับขั้น 1 | Completed flags หายทั้งหมดและ progress กลับ 25% | `scripts/test-sections.cjs` |

## Testimonials — 4 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-RV01 | Mount TH/EN; ตรวจลำดับรูป, alt และปุ่มนำทาง | รูปลำดับ 9/10/11/2/4/5 มีจริง; alt ตรงชื่อลูกค้าตามภาษา; จำนวนปุ่มตรงจำนวนรูป; CTA ชี้ contact | `scripts/test-sections.cjs` |
| TC-RV02 | กดปุ่มนำทางทั้ง 6 ปุ่ม แล้วสลับภาษา | แต่ละปุ่มเลือกภาพของตัวเอง; เปลี่ยนภาษาแล้วยังเลือกตำแหน่งเดิม | `scripts/test-sections.cjs` |
| TC-RV03 | เดินเวลาจำลองเมื่ออยู่นอก viewport; เข้า viewport; ไปภาพสุดท้าย; ออกจาก viewport | นอกจอไม่หมุน; ในจอหมุนทุก 6 วินาที; ภาพสุดท้ายวนไปแรก; ออกจากจอแล้วหยุด | `scripts/test-sections.cjs` |
| TC-RV04 | เปลี่ยน viewport จำลองจาก desktop เป็นกว้าง 375px | Card คำนวณจาก 400px เป็น 293px และขนาดรวม scale ไม่เกิน viewport | `scripts/test-sections.cjs` |

## Packages — 2 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-PK01 | Mount TH/EN; ตรวจแต่ละ package และ price note | มี 4 tiers; ราคา/Contact Staff, features, promo และ note ตรงข้อมูล; recommended tier หนึ่งใบ | `scripts/test-sections.cjs` |
| TC-PK02 | ตรวจและกด CTA ของแต่ละ package แล้วคลิก section | CTA ชี้ LINE พร้อม data-package และ rel ปลอดภัย; เลือก card ได้หนึ่งใบ; คลิก section ล้าง selection | `scripts/test-sections.cjs` |

## Floating Contact — 2 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-FL01 | Mount; เดินเวลาถึง 1,199ms และ 1,200ms; เปิดเมนูแล้วเลือก LINE | Widget ปรากฏเมื่อครบ 1,200ms; เมนูแสดง 2 actions; เลือกแล้วปิด | `scripts/test-sections.cjs` |
| TC-FL02 | ตรวจ EN แล้วเปลี่ยน TH; ตรวจ Track fallback; กด Back to top | Label ตรงภาษา; Track ใช้ LINE เมื่อ URL ว่าง; external links ปลอดภัย; เรียก smooth scroll top=0 | `scripts/test-sections.cjs` |

## Contact Form — 15 cases

ทุก case ใช้ component จริงกับ fetch/timers จำลอง ค่าเริ่มต้นเป็นชื่อ `Test customer`, เบอร์ `0812345678`, service ID `luxury-watches` และข้อความทดสอบ ไม่ส่งข้อมูลไป endpoint จริง

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-CT01 | กรอกครบ; mock HTTP สำเร็จแต่ JSON `{ok:false}`; submit | แสดง error; เก็บทั้ง 4 ช่อง; ไม่ยิง lead conversion; ปลดล็อกช่องหลังจบ | `scripts/test-contact-form.cjs` |
| TC-CT02 | กรอกครบ; mock response เป็นข้อมูลที่อ่าน JSON ไม่ได้; submit | แสดง error; ข้อมูลไม่หาย; ไม่ยิง conversion; ช่องกลับมาใช้งานได้ | `scripts/test-contact-form.cjs` |
| TC-CT03 | กรอกครบ; mock HTTP ไม่สำเร็จแม้ body มี `{ok:true}` | ไม่แสดง success; เก็บข้อมูล; ไม่ยิง conversion | `scripts/test-contact-form.cjs` |
| TC-CT04 | กรอกครบ; mock fetch throw network error | แสดง error; เก็บข้อมูล; ไม่ยิง conversion | `scripts/test-contact-form.cjs` |
| TC-CT05 | ตั้ง endpoint ว่าง; กรอกครบแล้ว submit | ไม่เรียก fetch; ไม่ยืนยันสำเร็จ; เก็บข้อมูลและแสดง error | `scripts/test-contact-form.cjs` |
| TC-CT06 | ใช้ภาษา TH; mock HTTP สำเร็จและ `{ok:true}`; submit | ส่ง JSON same-origin พร้อม label ไทย; ล้างฟอร์ม; success ภาษาไทย; conversion หนึ่งครั้งใช้ stable service ID โดยไม่มี PII | `scripts/test-contact-form.cjs` |
| TC-CT07 | Mock storage ACK สำเร็จ แต่ analytics.track throw | ยังแสดง success และล้างฟอร์ม เพราะบันทึกสำเร็จแล้ว | `scripts/test-contact-form.cjs` |
| TC-CT08 | ตั้ง page URL และ user agent ยาวเกิน limit; submit สำเร็จ | ตัดเฉพาะ metadata เป็น 2,048/512 ตัวอักษร; ข้อมูลลูกค้าและ label ไม่เปลี่ยน | `scripts/test-contact-form.cjs` |
| TC-CT09 | เลือก luxury-watches; เปลี่ยน EN → TH → EN | ค่า ID คงเดิม; label แปลตามภาษา; IDs ไม่ซ้ำและตรงกัน; Other หนึ่งรายการ | `scripts/test-contact-form.cjs` |
| TC-CT10 | ตรวจ name, phone, type, message ทั้ง TH/EN | ทุกช่องมี ID ไม่ซ้ำและ label ที่ผูกด้วย htmlFor เพียงหนึ่งอัน พร้อมข้อความไม่ว่าง | `scripts/test-contact-form.cjs` |
| TC-CT11 | ส่งสำเร็จ; เดินเวลาจำลองเกิน 2 ชั่วโมง; เปลี่ยนภาษาและพิมพ์ draft; mount ใหม่แทน reload | Success ไม่หายเองและเปลี่ยนภาษาตาม UI; ไม่ส่งซ้ำ; reload เริ่มไม่มีข้อความและฟอร์มว่าง | `scripts/test-contact-form.cjs` |
| TC-CT12 | ใช้ fetch pending; submit แล้วพยายาม submit ซ้ำ ก่อนปล่อย ACK | ทุกช่องและปุ่ม disabled; แสดงกำลังส่ง; เรียก endpoint เพียงครั้งเดียว; ACK แล้วปลดล็อกและนับหนึ่ง conversion | `scripts/test-contact-form.cjs` |
| TC-CT13 | ทดลอง name/phone ว่างหรือ whitespace และ type ว่าง/ไม่รู้จัก | ไม่เรียก endpoint และไม่ยิง conversion | `scripts/test-contact-form.cjs` |
| TC-CT14 | ตรวจ props ของช่องฟอร์ม | Name/phone/type required; name80/phone32/message600; phone type/inputMode tel; autocomplete name/tel; message optional | `scripts/test-contact-form.cjs` |
| TC-CT15 | ใส่ช่องว่างข้างชื่อ/เบอร์ และข้อความ optional เป็น whitespace; submit | ส่งชื่อ/เบอร์ที่ trim แล้วและ message ว่าง; ยืนยันสำเร็จได้ | `scripts/test-contact-form.cjs` |

## Policy Dialog — 6 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-PO01 | เปิด Privacy จาก footer แล้วกด Close | เปิด dialog ชื่อถูกต้อง มี aria-modal/labelledby; lock scroll; Close ปิดและคืน scroll | `scripts/test-contact-form.cjs` |
| TC-PO02 | เปิด Terms จาก footer แล้วกด Close | แสดง Terms ใน dialog และคืน scroll หลังปิด | `scripts/test-contact-form.cjs` |
| TC-PO03 | เปิด Compensation จาก footer แล้วกด Close | แสดง Compensation ใน dialog และคืน scroll หลังปิด | `scripts/test-contact-form.cjs` |
| TC-PO04 | เปิด policy; กดปุ่มตัวอักษรทั่วไปแล้ว Escape | ปุ่มทั่วไปไม่ปิด; Escape ปิดและคืน scroll; Escape ซ้ำไม่มีผลเสีย | `scripts/test-contact-form.cjs` |
| TC-PO05 | เปิด policy; คลิกเนื้อหา แล้วคลิก overlay | เนื้อหาหยุด propagation และยังเปิด; overlay ปิด dialog | `scripts/test-contact-form.cjs` |
| TC-PO06 | Dispatch policy event ด้วย ID ไม่รู้จัก แล้ว privacy | ID ไม่รู้จักไม่เปิดอะไร; privacy เปิดเอกสารถูกต้อง; ปิดแล้วคืน scroll | `scripts/test-contact-form.cjs` |

การมี aria-modal/labelledby ผ่านใน component test ไม่ถือว่า keyboard focus trap, focus return หรือ screen reader ใน browser จริงผ่านโดยอัตโนมัติ

## Contact API — 5 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-API01 | POST JSON ที่ถูกต้อง มีชื่อเว้นขอบและ field ไม่รู้จัก; mock upstream `{ok:true}` | HTTP200 `{ok:true}`, no-store; trim/allowlist payload; Google endpoint ถูกต้อง; ตั้ง redirect follow และ timeout signal | `scripts/test-contact-api.cjs` |
| TC-API02 | Mock upstream เป็น `{ok:false}`, HTTP503, opaque-like status0, `ok:'true'`, null และ non-JSON ทีละแบบ | ทุกแบบตอบ HTTP502 `{ok:false}`; ไม่ส่งรายละเอียดชีตกลับผู้ใช้ | `scripts/test-contact-api.cjs` |
| TC-API03 | Mock network TypeError, TimeoutError และ AbortError | Network ตอบ502; timeout/abort ตอบ504; ไม่มีกรณีตอบ ACK สำเร็จ | `scripts/test-contact-api.cjs` |
| TC-API04 | ส่ง GET, content type ไม่รองรับ, JSON/body/field types/required/length/language ที่ผิด | ตอบ405 พร้อม Allow POST, 415 หรือ400ตามกรณี; ไม่เรียก Google | `scripts/test-contact-api.cjs` |
| TC-API05 | ตั้ง upstream เป็น URL นอก Apps Script ที่อนุญาต; POST valid | ตอบ503 และไม่ส่งข้อมูลลูกค้าไป URL นั้น | `scripts/test-contact-api.cjs` |

## Apps Script Receiver — 7 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-GS01 | ชีตยังไม่มี; ส่งข้อความคล้ายสูตร, apostrophe, phone นำศูนย์และ whitespace | สร้าง header+ข้อมูลตาม 8 คอลัมน์; เก็บข้อความหลัง trim ตรงตัวผ่าน RichTextValue; lock ครอบ lookup/create/write/flush; mail หลัง release | `scripts/test-contact-receiver.cjs` |
| TC-GS02 | ส่งสองครั้งพร้อม phone `+66...`, `-012345` และ apostrophe | เก็บ prefix/ข้อความตรงตัวและเพิ่มแถวโดยไม่สร้าง header ซ้ำ | `scripts/test-contact-receiver.cjs` |
| TC-GS03 | ส่งเฉพาะ required name/phone/type | บันทึกได้; optional fields กลายเป็นข้อความว่าง | `scripts/test-contact-receiver.cjs` |
| TC-GS04 | ส่ง malformed JSON, primitive/array/null, required ว่าง, field ไม่ใช่ string และภาษาผิด | ตอบ `ok:false` ก่อน lock/เปิดชีต/เขียนข้อมูล/ส่งอีเมล | `scripts/test-contact-receiver.cjs` |
| TC-GS05 | ส่งแต่ละ field ที่ limit พอดีและเกินหนึ่งตัว พร้อม language เกินกำหนด | ที่ limit ผ่าน; เกิน limit ปฏิเสธก่อน side effect โดยไม่ตัดข้อมูลลูกค้าเงียบ ๆ | `scripts/test-contact-receiver.cjs` |
| TC-GS06 | Mock mail ล้มเหลวหลังเขียนและ flush | ข้อมูลยังถูกบันทึก; ตอบ `ok:true`; log notification failure แยก; lock ถูกปล่อย | `scripts/test-contact-receiver.cjs` |
| TC-GS07 | Mock failure ที่ lock/open/append/text write/flush ทีละจุด | ไม่ ACK และไม่ส่ง mail; acquired lock ถูก release แม้ล้มเหลว | `scripts/test-contact-receiver.cjs` |

## Analytics และ ConsentBanner — 16 cases

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-AN01 | Bootstrap โดยมี GTM ID ถูกต้องและยังไม่เลือก consent | ตั้ง 4 nonessential keys denied พร้อม security/functionality granted และ redaction ก่อนแทรก GTM async script | `scripts/test-analytics.cjs` |
| TC-AN02 | Bootstrap พร้อม saved granted เวอร์ชัน1 | ตั้ง safe defaults ก่อน restore granted และก่อนแทรก GTM | `scripts/test-analytics.cjs` |
| TC-AN03 | Bootstrap พร้อม saved denied เวอร์ชัน1 | คง denied และไม่ออกคำสั่ง grant | `scripts/test-analytics.cjs` |
| TC-AN04 | ทดลอง storage JSON เสีย, versionเก่า, choiceไม่รองรับ และ storage ถูกบล็อก | ถือว่ายังไม่เลือกและคง safe defaults โดยไม่ crash | `scripts/test-analytics.cjs` |
| TC-AN05 | ตั้ง GTM ID ว่าง/ผิดรูปแบบ/อักษรไม่ถูกต้อง | Analytics disabled; ไม่แทรก script และไม่มี gtm.js startup event | `scripts/test-analytics.cjs` |
| TC-AN06 | เรียก setConsent granted | Grant ครบ 4 keys; เก็บ version/choice/timestamp; push consent_update และ dispatch change | `scripts/test-analytics.cjs` |
| TC-AN07 | เริ่ม saved granted แล้วเลือก denied | Deny ครบ; expire Google cookies ตาม host/domain scopes; ไม่ลบ essential cookie; บันทึก denied | `scripts/test-analytics.cjs` |
| TC-AN08 | ส่ง invalid consent choice; ทดสอบ grant เมื่อ storage ถูกบล็อก | Invalid ไม่มีผล; storage บล็อกไม่ crash และ choice ยังอยู่ตลอด page session | `scripts/test-analytics.cjs` |
| TC-AN09 | คลิก child ใน package LINE link แล้วคลิก LINE อีกตำแหน่ง | Capture phase มองเห็น click; event/location/package ถูก; reset params ไม่ให้ package/form ค้าง | `scripts/test-analytics.cjs` |
| TC-AN10 | คลิก phone, email, internal CTA และ LINE ไม่มี attribution ทีละแบบ | Event เป็น phone_click/email_click/cta_click/line_click; URL/location ถูก; ไม่มี customer name/phone/message/userAgent fields เพิ่ม | `scripts/test-analytics.cjs` |
| TC-AN11 | คลิก external link ทั่วไปที่ไม่มี data-cta และ target ที่ไม่ใช่ link | ไม่สร้าง conversion event เพิ่ม | `scripts/test-analytics.cjs` |
| TC-AN12 | Mount banner สำหรับผู้ใช้ใหม่, analytics disabled และ saved granted/denied | แสดง region พร้อมชื่อให้ผู้ใช้ใหม่; ไม่แสดงเมื่อ disabled หรือเลือกไว้แล้ว | `scripts/test-analytics.cjs` |
| TC-AN13 | กด reject และ accept จาก banner แยก session | เก็บ denied/granted ตรงกับปุ่มและปิด banner | `scripts/test-analytics.cjs` |
| TC-AN14 | เริ่ม saved granted; เปิด Cookie Settings; กด reject | เปิด banner ซ้ำได้; ถอน consent เป็น denied; expire Google cookies จำลองและปิด banner | `scripts/test-analytics.cjs` |
| TC-AN15 | กด Privacy Policy ใน banner | Dispatch เปิด privacy โดยไม่เปลี่ยน consent และไม่ปิด bannerเอง | `scripts/test-analytics.cjs` |
| TC-AN16 | เปลี่ยน banner TH → EN แล้วกด reject | ชื่อ region/copy เปลี่ยนตามภาษาและ control ยังเลือก denied ได้ | `scripts/test-analytics.cjs` |

## CardSwiper — standalone suite 5 สถานการณ์

| Case ID | เงื่อนไขและขั้นตอน | ผลที่คาดหวัง | Automation file |
|---|---|---|---|
| TC-SW01 | Services จำลอง10 cards, width314/gap14/viewport944; เลื่อนไปขอบท้ายแล้ว Next; ที่ต้นแล้ว Previous | Next วนไป0; Previous วนขอบท้ายจริง แม้เห็นหลาย cards พร้อมกัน | `scripts/test-card-swiper.mjs` |
| TC-SW02 | กดทุก dot ใน tablet geometry | มี9 reachable stops; ทุก dot active ได้และ dot สุดท้ายตรง max scroll | `scripts/test-card-swiper.mjs` |
| TC-SW03 | จำลอง swipe ไป left660 แล้วกด Next | Dot sync ตำแหน่งใกล้สุด; Next ต่อจากตำแหน่งปัจจุบัน; navigation ไม่ส่ง top จนหน้าเลื่อนแนวตั้ง | `scripts/test-card-swiper.mjs` |
| TC-SW04 | Resize Services เป็น mobile; เลือกท้ายแล้ววน; เปลี่ยน children ภาษา; resize เป็น desktop | Mobileมี10 stopsและวนได้; เปลี่ยนภาษาคำนวณใหม่; desktopเหลือ1 stopไม่สร้างตำแหน่งหลอก | `scripts/test-card-swiper.mjs` |
| TC-SW05 | Packages4 cards width320/gap12/viewport320; Previous ที่แรกแล้ว Next | มี4 stops; Previous ไปใบ4 และ Next วนกลับใบ1 | `scripts/test-card-swiper.mjs` |

## ข้อจำกัดและสิ่งที่ต้องตรวจเพิ่มเติม

- Tests ที่ผ่านใน VM ไม่ยืนยัน layout, clipping, overflow, native required validation หรือ keyboard focus ใน browser จริง ต้องใช้ browser cases เสริม
- การใช้ `.fill()` ไม่ทำให้ element เข้าสถานะ native `:autofill` จึงไม่ถือว่า Chrome Autofill ถูกตรวจจริง แม้ CSS rule และสี input จะมีอยู่แล้ว
- ยังไม่อ้างผลสำหรับ Safari/iOS/Android browser จริง, native Autofill profile, screen reader จริง หรือ production GTM/GA4/Ads event delivery
- Apps Script mock ตรวจลำดับ API calls และ literal text contract ไม่ใช่การตรวจชีต/สิทธิ์/lock concurrency/notification บน Google production
- ผล browser ที่ทำได้และกรณี BLOCKED ต้องบันทึกแยกพร้อม viewport, ขั้นตอน และหลักฐานในรายงานการทดสอบ

## Browser test cases — 40 cases

รันใน in-app browser จริงผ่าน QA server: 37 กรณีรันได้ และ 3 กรณี BLOCKED ต้องตรวจ environment จริงเพิ่มเติม ดูผลแยกใน [รายงาน](7_Test_Report_2026-11-05.md)

| Case ID | ส่วน | ขั้นตอน / Preconditions | ผลที่คาดหวัง |
|---|---|---|---|
| UI-01 | Page | เปิดหน้าเว็บ desktop | มีทุก section และ H1 เดียว |
| HR-01 | Hero | ตรวจหัวข้อ ราคา และ CTA | หัวข้อไม่ว่าง ราคา500 และลิงก์จอง/เรียนรู้ถูกต้อง |
| NAV-01 | Navigation | กดลิงก์เมนูทั้ง5ส่วน | URL hash ตรงกับ section ทุกอัน |
| CT-UI01 | Contact | กดส่งโดยไม่กรอกข้อมูล | native required validation ไม่ผ่านและไม่มีข้อความสำเร็จ |
| CT-UI02 | Contact | ตรวจชื่อช่องกรอกและข้อมูลติดต่อ | label เชื่อมครบ4ช่อง และ LINE/email/phone เป็นลิงก์ |
| I18N-01 | Language | เลือกนาฬิกาหรูแล้วสลับ TH→EN | ID ที่เลือกคงเดิมและ label เปลี่ยนเป็น Luxury Watches |
| I18N-02 | Accessibility | สลับหน้าเว็บเป็น EN แล้วตรวจ html lang | document language ต้องเป็น en เพื่อให้ screen reader อ่านถูกภาษา |
| CT-UI03 | Contact | กรอกข้อความ [qa:fail] แล้วส่ง | แสดง error และเก็บข้อมูลครบ4ช่อง |
| CT-UI04 | Contact | ลบ marker failure แล้วส่งข้อมูลจำลอง | ได้ success และล้างฟอร์มทั้ง4ช่อง |
| PO-UI01 | Policies | เปิด Privacy Policy จาก footer | แสดง dialog มีชื่อ และล็อก scroll ด้านหลัง |
| PO-UI02 | Accessibility | เปิด dialog แล้วตรวจ keyboard focus | focus ย้ายเข้าภายใน dialog |
| PO-UI03 | Policies | กด Escape | ปิด dialog และปลดล็อก body scroll |
| PO-UI04 | Policies | เปิด Terms และ Compensation แล้วกด Close | แสดงเนื้อหาครบและปิดได้ทั้ง2ฉบับ |
| CT-UI05 | Contact | รอหลังส่งสำเร็จเกิน5วินาทีระหว่างตรวจนโยบาย | ข้อความสำเร็จยังแสดงอยู่ |
| BR-UI01 | Brands | เลื่อนไปส่วนแบรนด์และตรวจโลโก้ | โลโก้5รูปโหลดได้และลิงก์ปลายทางมีชื่อ |
| SV-UI01 | Services | เลื่อนไปบริการบน desktop | การ์ด10ใบมีภาพและหัวข้อครบ |
| RV-UI01 | Testimonials | เลื่อนให้หยุดที่ส่วนรีวิว กดจุดนำทางรูปที่4 และรอ active selector | รูป6รูปโหลดได้และปุ่มที่4เป็นสถานะ active |
| RV-UI02 | Accessibility | ตรวจชื่อปุ่มนำทางรีวิว | ทุกปุ่มมี accessible name |
| WHY-UI01 | Why Us | เลื่อนไปจุดเด่น | แสดงจุดเด่น6ข้อและคำอธิบายครบ |
| PR-UI01 | Process | กดขั้นตอน1ถึง4ตามลำดับ | aria-current รูป และ progress ตรงกับขั้นตอนที่เลือก |
| PK-UI01 | Packages | เปิดแพ็กเกจและตรวจราคา/CTA | มี4แพ็กเกจ ราคาเริ่ม500 และทุกCTAไปLINEพร้อมชื่อแพ็กเกจ |
| AN-UI01 | Consent | เปิด Cookie Settings แล้วกด Essential Only จากนั้น reload | banner เปิดได้ ปิดหลังเลือก และไม่กลับมาหลัง reload |
| CT-UI06 | Contact | reload หลังเคยส่งสำเร็จ | ข้อความยืนยันหายและฟอร์มเริ่มใหม่ |
| AN-UI02 | Consent responsive | เปิด Cookie Settings ภาษาENที่320×568 | banner และปุ่มยินยอมทั้งสองอยู่ใน viewport |
| AN-UI03 | Consent | กด Accept All แล้วเปิดSettingsเพื่อถอน | เลือกได้ ปิด banner และเปิดใหม่เพื่อเปลี่ยนเป็น Essential Only |
| RESP-01 | Responsive | ตรวจหน้า320×568หลังปิดbanner | ไม่มี horizontal page overflow และใช้ hamburger menu |
| RESP-02 | Footer/Floating contact | ที่320×568ตรวจตำแหน่งปุ่ม Cookie Settings | จุดกดตรงกลางปุ่มไม่ถูก floating widget บัง |
| AN-UI04 | QA isolation | โหลดหน้าเว็บผ่าน QA server | ไม่มี script GTM/GA4 ในDOM แต่ consent controls ยังมี |
| FL-UI01 | Floating contact | เปิดและปิดปุ่มติดต่อแบบลอย | aria-expanded สลับและมีลิงก์Tracking/LINEที่ถูกต้อง |
| FL-UI02 | Floating contact | กด Back to top จากด้านล่างแล้วรอหน้าเลื่อนหยุด | กลับถึงส่วนHero |
| RESP-03 | Responsive | ตรวจขนาด320×568,375×667,768×1024,1024×768,1280×600,1440×900 | หน้าไม่ล้นแนวนอนและปุ่มส่งไม่ทับfooterทุกขนาด |
| SV-UI02 | Services carousel | ที่1024×768 กดจุดสุดท้ายแล้ว Next | จุดสุดท้าย active และ Next วนกลับจุดแรก |
| NAV-UI02 | Mobile navigation | เปิด hamburger แล้วเลือกContact | เมนูปิดและURLเปลี่ยนเป็น#contact |
| CT-UI07 | Contact | ตรวจสีช่องกรอกปกติและCSSautofillที่โหลด | ช่องกรอกใช้ dark color-scheme ตัวอักษรขาว และมีทั้งautofill selectors |
| PK-UI02 | Packages carousel | บน375×667กดslide4แล้วNext | แพ็กเกจมี4จุดและวนกลับจุดแรกได้ |
| RESP-04 | Navigation responsive | ใช้ภาษาENที่901×700ก่อนhamburger breakpoint | ทุกเมนูและCTAอยู่ในviewportและไม่ทับโลโก้ |
| ASSET-UI01 | Assets | ตรวจภาพที่มีอยู่ในDOMหลังเปิดครบทุกส่วน | ไม่มีภาพที่โหลดแล้วแต่เสีย |
| MAN-01 | Native Autofill | ใช้saved dummy contactในChrome/Safariกรอกอัตโนมัติ โฟกัสและblurช่องชื่อ/เบอร์ | พื้นหลังเข้ม ตัวอักษรขาวทุกสถานะ |
| MAN-02 | Cross-browser | รันชุดbrowserในChrome Safari Firefoxและมือถือจริง | พฤติกรรมและlayoutเท่ากัน |
| MAN-03 | Production integrations | ส่งleadเข้าApps Scriptจริง ตรวจSheet emailและGA4/Ads | บันทึก1แถว ส่งemail1ครั้ง conversion1ครั้ง |
