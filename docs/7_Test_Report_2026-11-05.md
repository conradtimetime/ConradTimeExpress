# Conrad Express — ผลการทดสอบ 5 พฤศจิกายน 2026

## ผลรวม

จัดทำ **116 Test cases**: **ผ่าน108**, **ไม่ผ่าน5**, **BLOCKED3**. เป็นผลทดสอบโค้ดใน workspace รวมการแก้ Autofill และข้อความยืนยันค้างไว้จน refresh ที่ยังอยู่ใน working tree ไม่ใช่การรับรอง deployment production

| ระดับ | กรณี | ผ่าน | ไม่ผ่าน | BLOCKED |
|---|---:|---:|---:|---:|
| Node component/API/Apps Script/analytics tests | 71 | 71 | 0 | 0 |
| CardSwiper standalone scenarios | 5 | 5 | 0 | 0 |
| Browser UI / responsive / accessibility / manual integration | 40 | 32 | 5 | 3 |
| **รวม** | **116** | **108** | **5** | **3** |

Build และ static verification ผ่าน ทั้ง assets, SEO/CSP และลำดับ script; การผ่าน unit tests ไม่ได้ทำให้กรณี browser ที่ไม่ผ่านกลายเป็นผ่าน

## Environment และหลักฐาน

- วันที่: 5 พฤศจิกายน 2026, Asia/Bangkok
- Final automated run ใช้ **Node.js v24.22.1** ซึ่งอยู่ในช่วง engines `>=20 <25`; preliminary run ใช้ Node25.9.0 แล้วรันยืนยันซ้ำครบด้วย Node24
- Browser: ChatGPT in-app browser, URL `http://127.0.0.1:8755/`; ไม่ใช่ผล Chrome/Safari/Firefox ทุกตัว
- Viewports หลัก: 320×568, 375×667, 768×1024, 1024×768, 1280×600, 1440×900 และตรวจขอบ breakpoint เพิ่มที่901×700
- Contact API ใช้ handler จริง แต่ Apps Script upstream ถูกจำลอง จึงไม่มีแถวหรืออีเมลจริงจากการทดสอบฟอร์ม
- Unit tests จำลอง network/storage; QA server มี guard ปิด GTM network loader สำหรับการตรวจซ้ำโดยคง consent/local dataLayer. การรับ conversion ใน GA4/Ads production ไม่อยู่ในผลผ่านนี้
- [Test case catalog](6_Test_Cases.md), [Node TAP log](qa-evidence/2026-11-05/automated.tap), [ผล automated JSON](qa-evidence/2026-11-05/automated-results.json), [CardSwiper log](qa-evidence/2026-11-05/card-swiper.txt), [Browser results JSON](qa-evidence/2026-11-05/browser-results.json), [Run summary และ bundle hash](qa-evidence/2026-11-05/run-summary.json)

## จุดที่ไม่ผ่านและแนวทางแก้

| Bug | Test case | ระดับ | ผลจริง / ผลกระทบ | ตำแหน่งและแนวทางแก้ |
|---|---|---|---|---|
| BUG-01 | RESP-04 | P2 | ที่901×700 เมนู desktop และ CTA กว้างเกินจอ ขอบCTAเกินประมาณ26px | [index.html:238](../index.html#L238), [Nav.jsx](../src/components/Nav.jsx): ขยาย breakpoint หรือปรับ spacing ให้ fit ก่อนแสดง desktop nav |
| BUG-02 | RESP-02 | P2 | ที่320×568 ปุ่ม Back to top ลอยบัง Cookie Settings ใน footer | [FloatingLine.jsx](../src/components/FloatingLine.jsx), Contact footer: เว้นพื้นที่ด้านล่างหรือย้าย/ยก widget เมื่อถึง footer; ตรวจ hit target ซ้ำ |
| BUG-03 | PO-UI02 | P2 | เปิด modal แล้ว keyboard focus ยังอยู่บน footer ด้านหลัง | [Contact.jsx](../src/components/sections/Contact.jsx): ย้ายfocusเข้าปุ่มClose/หัวข้อใน modal, trap Tab และคืนfocusเมื่อปิด |
| BUG-04 | I18N-02 | P2 | หน้าเป็นENแต่ html lang ยังเป็นth ทำให้ screen reader เลือกภาษาไม่ตรง | [app.jsx](../src/app.jsx): sync document.documentElement.lang กับ state ภาษา |
| BUG-05 | RV-UI02 | P2 | ปุ่มนำทางรูปรีวิว6ปุ่มไม่มี accessible name | [Testimonials.jsx](../src/components/sections/Testimonials.jsx): เพิ่ม aria-label ที่แปลภาษา และ aria-current เพื่อบอกปุ่มที่เลือก |

รอบนี้เพิ่มชุดทดสอบและรายงาน; ยังไม่ได้แก้5ข้อที่ค้นพบใหม่หรือ deploy production

### ภาพหลักฐาน

เมนูขนาด901px — CTA ชิดขอบและถูกตัดทางขวา:

![Navigation901px](qa-evidence/2026-11-05/navigation-header-901x700.jpg)

Footer320px — ปุ่มลอยอยู่ทับบริเวณ Cookie Settings:

![Footer320px](qa-evidence/2026-11-05/footer-fab-320x568.jpg)

## ผลรายส่วน

| ส่วน | ผลสำคัญ |
|---|---|
| Nav/Hero | anchors, booking/learn-more, title, background, ราคา และเปลี่ยนภาษาทำงาน; พบCTAล้นที่901px |
| Brands | 5โลโก้โหลดได้ ลิงก์และชื่อครบ; ไม่เปิดปลายทางเพื่อทำรายการจริง |
| Services | 10บริการครบสองภาษา รูปและfallbackผ่าน; tablet carousel9stops วนกลับต้นได้ |
| Testimonials | 6รูปโหลดและเลือกได้; auto-advance/visibility/resizeผ่าน component tests; ชื่อปุ่มไม่ผ่าน |
| Why Us | 6จุดเด่นและคำอธิบายครบ |
| Process | เลือก1–4เปลี่ยนรูปและprogress25/50/75/100%ถูกต้อง |
| Packages | 4แพ็กเกจ ราคาfeatures/promotion/ชื่อpackageในCTAถูก; carouselมือถือวนได้ |
| Contact | required validation, errorเก็บข้อมูล, successล้างฟอร์ม, stable service ID, labels, inputlimitsผ่าน |
| Confirmation | browserยังเห็นข้อความหลัง28.5วินาที; VMเลื่อนเวลาเกิน2ชั่วโมงแล้วยังแสดง; refreshเริ่มใหม่ |
| Autofill | CSSสองselectorsและdarkสีตัวอักษรโหลดถูก; native saved-profileAutofillยังBLOCKED |
| Policy | 3เอกสารเปิดปิดและESC/scrolllockผ่าน; keyboardfocusไม่ผ่าน |
| Consent/Analytics | defaults/savedchoice/revoke/event attributionผ่าน16unitcases; bannerใน320×568ยังอยู่ในviewport; ปุ่มSettingsโดนwidgetบังแยกเป็นBUG-02 |
| Floating contact | เปิดปิด/LINE/trackingfallback/backtotopผ่าน; ต้องแก้การบังfooter |
| Backend | explicitACK, failures/nonJSON/network/timeout/validation, literaltext, leadingzeros, mailfailureหลังsaveผ่านmock |

## Browser results

สถานะจากการรัน40กรณี (รายละเอียดค่าDOMและกรณีretestอยู่ในJSON):

| ID | ส่วน | ผล | Actual result |
|---|---|---|---|
| UI-01 | Page | PASS | {"footer":true,"h1":1,"ids":["hero","brands","services","testimonials","why","process","packages","contact"]} |
| HR-01 | Hero | PASS | {"links":["https://line.me/ti/p/~@ConradExpress","#services"],"price":"฿500","title":"Conrad Express\nส่งสินค้ามูลค่าสูงพรีเมียม\nทั่วไทยภายในหนึ่งวัน"} |
| NAV-01 | Navigation | PASS | ["#services","#why","#process","#packages","#contact"] |
| CT-UI01 | Contact | PASS | {"invalid":["name","phone","serviceType"],"status":null} |
| CT-UI02 | Contact | PASS | {"labels":[{"count":1,"name":"name"},{"count":1,"name":"phone"},{"count":1,"name":"serviceType"},{"count":1,"name":"message"}],"links":["https://line.me/ti/p/~@ConradExpress","mailto:conr… |
| I18N-01 | Language | PASS | {"label":"Luxury Watches","other":1,"value":"luxury-watches"} |
| I18N-02 | Accessibility | FAIL | หน้าจอเป็น EN แต่ html lang ยังคง th |
| CT-UI03 | Contact | PASS | {"message":"[qa:fail]","name":"Conrad QA Local","status":"Unable to submit. Please try again or contact us via LINE OA.","type":"luxury-watches"} |
| CT-UI04 | Contact | PASS | {"empty":true,"status":"✓ Your request has been received. We will respond within 2 hours."} |
| PO-UI01 | Policies | PASS | {"modal":"true","overflow":"hidden","title":"นโยบายความเป็นส่วนตัว (Privacy Policy)"} |
| PO-UI02 | Accessibility | FAIL | activeElement ยังเป็นปุ่ม Privacy Policy ใน footer ด้านหลัง dialog |
| PO-UI03 | Policies | PASS | {"dialog":false,"overflow":""} |
| PO-UI04 | Policies | PASS | [{"sections":18,"title":"ข้อกำหนดการใช้บริการ (Terms of Service)"},{"sections":11,"title":"นโยบายชดเชยสินค้า (Product Compensation Policy)"}] |
| CT-UI05 | Contact | PASS | {"elapsedMs":28501,"status":"✓ Your request has been received. We will respond within 2 hours."} |
| BR-UI01 | Brands | PASS | [{"href":"https://www.facebook.com/visaservicebymesub/?locale=th_TH","loaded":true,"name":"Visit Mesub"},{"href":"https://www.khunhuagroup.com/#","loaded":true,"name":"Visit Khunhua"},{"h… |
| SV-UI01 | Services | PASS | {"cards":10,"loaded":true,"titles":["Luxury Watches","Fine Art","Collectibles","Gemstones","Gold","Luxury Fashion","Confidential","Gadgets","IT Equipment","Other"]} |
| RV-UI01 | Testimonials | PASS | {"count":6,"fourth":"28px","loaded":true} |
| RV-UI02 | Accessibility | FAIL | ปุ่มทั้ง 6 ไม่มีข้อความและไม่มี aria-label |
| WHY-UI01 | Why Us | PASS | {"count":6,"descriptions":[98,86,77,68,93,103],"titles":["Responsible for every delivery","Status Tracking at Every Step","Always On Time","Nationwide Coverage","Privacy","Expert Handling"]} |
| PR-UI01 | Process | PASS | [{"active":0,"image":"brand-images/How-it-work-1.jpg","progress":"25%"},{"active":1,"image":"brand-images/How-it-work-2.jpg","progress":"50%"},{"active":2,"image":"brand-images/How-it-wor… |
| PK-UI01 | Packages | PASS | {"count":4,"cta":[{"href":"https://line.me/ti/p/~@ConradExpress","package":"Standard"},{"href":"https://line.me/ti/p/~@ConradExpress","package":"Other Provinces"},{"href":"https://line.me… |
| AN-UI01 | Consent | PASS | {"banner":false,"empty":true,"status":false} |
| CT-UI06 | Contact | PASS | {"banner":false,"empty":true,"status":false} |
| AN-UI02 | Consent responsive | PASS | {"banner":{"bottom":552,"height":416.75,"left":16,"right":300,"top":135.25,"width":284,"x":16,"y":135.25},"buttons":[{"rect":{"bottom":419,"height":17.5,"left":39,"right":117.984375,"top"… |
| AN-UI03 | Consent | PASS | {"acceptedOnMobile":true,"reopenedAndRevokedOnDesktop":true} |
| RESP-01 | Responsive | PASS | {"burger":"flex","page":316,"viewport":320} |
| RESP-02 | Footer/Floating contact | FAIL | จุดกึ่งกลาง Cookie Settings ชนปุ่ม Back to top; กดด้วยเมาส์/สัมผัสไม่ได้ตามจุดปกติ |
| AN-UI04 | QA isolation | PASS | {"scripts":["src/analytics.js?v=qa-local-no-tags","vendor/react.production.min.js","vendor/react-dom.production.min.js","src/data/config.js?v=20261105-contact-fixes","src/data/copy.js?v=2… |
| FL-UI01 | Floating contact | PASS | {"actions":[{"href":"https://line.me/ti/p/~@ConradExpress","text":"ติดตามสถานะการขนส่ง"},{"href":"https://line.me/ti/p/~@ConradExpress","text":"แชทผ่าน LINE"}],"expanded":"true"} |
| FL-UI02 | Floating contact | PASS | {"before":-5583,"top":0} |
| RESP-03 | Responsive | PASS | [{"burger":"flex","footerGap":38,"height":568,"packageDots":4,"pageWidth":316,"servicesDots":10,"width":320},{"burger":"flex","footerGap":38,"height":667,"packageDots":4,"pageWidth":371,"… |
| SV-UI02 | Services carousel | PASS | {"before":72.0078125,"end":{"active":"Go to slide 9","top":-113.9921875},"start":{"active":"Go to slide 1","top":33.0078125}} |
| NAV-UI02 | Mobile navigation | PASS | {"hash":"#contact","visibleLinks":0} |
| CT-UI07 | Contact | PASS | {"autofillRules":["#contact .contact-form :is(input, select, textarea):-webkit-autofill { caret-color: rgb(255, 255, 255); -webkit-text-fill-color: rgb(255, 255, 255) !important; box-shad… |
| PK-UI02 | Packages carousel | PASS | {"lastReached":true,"wrappedToFirst":true} |
| RESP-04 | Navigation responsive | FAIL | CTA ขอบขวา 927.07px เกิน viewport 901px ประมาณ26px |
| ASSET-UI01 | Assets | PASS | {"broken":[],"count":24,"pending":[]} |
| MAN-01 | Native Autofill | BLOCKED | BLOCKED: environmentนี้ไม่ได้มีsaved dummy contact; การfillธรรมดาไม่activate :autofill จึงยืนยันเฉพาะCSSที่โหลดในCT-UI07 |
| MAN-02 | Cross-browser | BLOCKED | BLOCKED: รอบนี้ใช้in-app browserเท่านั้น ยังไม่ได้รันbrowserอื่นหรือhardwareจริง |
| MAN-03 | Production integrations | BLOCKED | BLOCKED: ใช้mock upstreamและไม่ส่งข้อมูลจริง; ต้องแยกintegration runที่อนุญาตside effects |

## การตรวจซ้ำและข้อจำกัด

```sh
npm run verify
npm run qa:serve
```

`npm run verify` รันเฉพาะ build/static/automated suites ไม่ได้ควบคุม browser หรือเปลี่ยน5browser failuresเป็นpassโดยอัตโนมัติ Browser casesต้องทำตามcatalogและตรวจสถานะ/geometryจริง พร้อมตั้งviewportตามแต่ละcase

1. MAN-01: ใช้saved dummycontactในChrome/Safariเพื่อactivate `:autofill` จริง ตรวจก่อนfocus/ขณะfocus/หลังblur การfillข้อความธรรมดาไม่ยืนยันเคสนี้
2. MAN-02: รันChrome/Safari/Firefoxและอุปกรณ์iOS/Androidจริง รวมscreenreaderจริงก่อนอ้างcross-browser/a11yครบ
3. MAN-03: เมื่ออนุญาตผลข้างเคียงแล้วจึงตรวจintegrationกับSheet/email/GA4/Adsจริง โดยใช้leadทดสอบที่ระบุชัด แยกจากผลmockนี้

การสังเกตช่วงแรกบางเคสอ่านก่อนReactpaintหรือใช้ชื่อปุ่มไม่ตรง ได้แก้precondition/selectorและรันทดสอบซ้ำด้วยactive selectorแล้ว เก็บinitialObservation/noteไว้ในbrowser JSON; ไม่ได้นับเป็นproduct failure กรณีcarouselให้automationเลื่อนปุ่มเข้าviewportจึงไม่ใช้ความต่างscrollYจากlocator clickตัดสินว่าimplementationทำหน้าเลื่อนเอง
