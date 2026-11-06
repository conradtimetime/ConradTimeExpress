# Conrad Express — ผลการปรับประสิทธิภาพ

วันที่: 6 พฤศจิกายน 2026

แก้ตามรายงานตรวจครั้งก่อนใน workspace แล้ว พร้อมสร้าง bundle สำหรับนำขึ้นเว็บ รอบนี้ยังไม่ได้ commit, push หรือ deploy ผล PageSpeed ของ production ในรายงานเดิมจึงยังเป็นผลก่อนแก้

## สิ่งที่แก้

- เตรียมภาพ WebP 73 ไฟล์ จากต้นฉบับ 26 รูป สำหรับ Hero, Services, Reviews และ Process มีหลายขนาดและชื่อไฟล์ตาม content hash เก็บ JPG ต้นฉบับไว้และไม่ขยายภาพเกินขนาดต้นฉบับ
- ใช้ `srcset` / `sizes` และขนาดภาพตามสัดส่วนจริง ให้ Hero โหลด eager/high เพียงจุดเดียว ภาพบริการ รีวิว และขั้นตอนโหลด lazy ด้วย priority ปกติ Hero preload สร้างจาก registry เดียวกับ component เพื่อเลือกไฟล์ตรงกัน
- ตั้ง cache ระยะยาวเฉพาะภาพชื่อ hash ใน `brand-images/optimized/` บน Vercel
- CardSwiper เปลี่ยนจาก `useLayoutEffect` เป็น `useEffect` วัดขนาดเฉพาะเมื่ออยู่ในโหมด carousel และใกล้หน้าจอ 200 px รวมคำขอวัดจาก resize ไว้ใน rAF เดียว และไม่สมัคร observers ใหม่เพียงเพราะ parent render
- Hero ใช้ fade 250 ms หน่วงสูงสุด 100 ms แทนจบช้าสุด 1.5 วินาที เส้นตกแต่งเปลี่ยนจาก width เป็น scaleX ส่วน reveal ใช้ 250–280 ms และ stagger สูงสุด 150 ms
- รีวิวใช้เงาคงที่และเคลื่อนด้วย transform/opacity บริการแสดงคำอธิบายด้วย transform/opacity แทนการเคลื่อนไหว margin/max-height
- รองรับ reduced motion รวมถึงหยุด autoplay รีวิวและเปลี่ยน carousel/back-to-top เป็นการเลื่อนทันที
- ปุ่มลอยใช้ IntersectionObserver เปิด scroll listener เฉพาะเมื่อ footer อยู่ในจอ เปลี่ยนตำแหน่งผ่าน CSS translation โดยไม่อัปเดต React state หรือ bottom ทุกจังหวะ พร้อม cleanup และกัน callback หลัง unmount
- Analytics เป็นสคริปต์ defer ตัวแรกก่อนแอป ลดการหยุด HTML parser โดยยังตั้งค่า consent ก่อนสร้าง GTM loader ไม่ได้อ้างว่าลดเวลาครบตาม estimate เดิม

## ขนาดไฟล์ก่อนและหลัง

หน่วย MB ฐานสิบ ตัวเลือกเริ่มต้นคือ `src` ใน registry ส่วนเบราว์เซอร์เลือกขนาดตาม `srcset` / หน้าจอ / DPR อีกครั้ง ตารางนี้เป็นผลรวมไฟล์ ไม่ใช่ขนาดรับส่งครั้งแรกหรือผลวัด FPS

| ชุดภาพ | JPG เดิม | ตัวเลือกเริ่มต้น | รวมตัวเลือกใหญ่สุดต่อภาพ |
|---|---:|---:|---:|
| ทั้ง 26 ภาพ | 23.558 MB | **2.060 MB (ลด 91.3%)** | 2.853 MB |
| รีวิวหนัก 3 รูป | 11.780 MB | **0.356 MB (ลด 97.0%)** | 0.707 MB |
| รีวิวที่ใช้จริง 6 รูป | 12.173 MB | 0.526 MB | 0.877 MB |
| บริการ 5 รูปแรก | 5.971 MB | 0.591 MB | 0.591 MB |
| Hero | 0.574 MB | 0.036 MB | 0.183 MB |

[ตัวเลขไบต์และผลตรวจ hash/preload](performance-evidence/2026-11-06/after/image-summary.json)

ไฟล์แอปหลัง build ประมาณ 133.7 KB หรือ 30.7 KB เมื่อ gzip จึงไม่มีการเพิ่มภาระ JavaScript ขนาดใหญ่จากการปรับครั้งนี้

## Test cases และผลทดสอบ

ใช้ Node **24.22.2** ซึ่งอยู่ในช่วงเวอร์ชันที่โครงการรองรับ การตรวจ build/static site ผ่าน และ automated tests ผ่าน **75/75 เคส** พร้อมชุดทดสอบ carousel แยกต่างหาก

คำสั่งที่ใช้ (รันด้วย Node 24):

```sh
node scripts/build-static-bundle.mjs
node scripts/verify-static-site.mjs
node --test scripts/test-*.cjs
node scripts/test-card-swiper.mjs
```

| ID | สิ่งที่ตรวจ / ผลที่คาดหวัง | ผลสุดท้าย |
|---|---|---|
| PF-01 | WebP ทั้ง 73 ไฟล์อ่านได้ ขนาดตรง descriptor ไม่ upscale และ hash ตรงเนื้อหา | ผ่าน — ตรวจตอนเตรียมภาพ และตรวจ hash ซ้ำก่อนส่งมอบ |
| PF-02 | Hero preload ตรงกับ src/srcset/sizes ที่ component ใช้ | ผ่าน |
| PF-03 | Hero eager/high; Services/Reviews/Process lazy และแสดง WebP ตามหน้าจอ | ผ่าน — ตรวจ source และ DOM ในเบราว์เซอร์ |
| PF-04 | Desktop และ carousel ที่อยู่นอกจอไม่มี geometry reads; resize หลายครั้งรวมเป็นหนึ่ง frame | ผ่าน — regression harness ของ component จริง |
| PF-05 | เปลี่ยนภาษา/resize แล้ว dots และ next/previous/wrap ยังทำงาน พร้อม cleanup observers | ผ่าน — regression harness และ browser checks |
| PF-06 | บริการแสดงชื่อและคำอธิบายเมื่อ focus บน desktop ทั้งไทย/อังกฤษ โดยไม่ขยับ layout ระหว่าง animation | ผ่าน — ตรวจภาพและขอบเขตข้อความบนหน้าจอ 1276 px |
| PF-07 | Tablet 900 px เลือกบริการท้ายแถวได้ | ผ่าน — dot 10, scrollLeft 3470 = max 3470 |
| PF-08 | Mobile 390 px เลือกบริการท้ายและ Next กลับต้นแถวได้ ไม่มี page overflow | ผ่าน — dot 10 แล้วกลับ dot 1 / scrollLeft 0 |
| PF-09 | Mobile Packages มี 4 dots และไปแพ็กเกจสุดท้ายได้ | ผ่าน — dot 4, scrollLeft 1062 = max 1062 |
| PF-10 | ภาพรีวิวทั้ง 6 รูปโหลดสำเร็จและปุ่มเลือกภาพยังทำงาน | ผ่าน — browser ใช้ WebP 800/600 px แทน JPG ต้นฉบับ |
| PF-11 | reduced motion หยุด autoplay ทั้งตั้งแต่เปิดหน้าและเปลี่ยนค่าระหว่างใช้งาน แต่เลือกรีวิวเองได้ | ผ่าน — automated regression |
| PF-12 | ปุ่มลอยไม่อ่าน footer นอกจอ ไม่เรียก React state setter ระหว่าง scroll และหลบ footer เมื่อ scroll/resize | ผ่าน — regression; browser มือถือมีระยะห่างประมาณ 30 px |
| PF-13 | กด Cookie Settings ที่ท้ายหน้าได้และปิดด้วย Essential Only ได้ | ผ่าน — browser |
| PF-14 | ฟอร์มติดต่อ สถานะสำเร็จค้างจน reload, API/receiver, ภาษา, policy และ consent/analytics ไม่ถดถอย | ผ่าน — รวมอยู่ใน automated 75 เคส ใช้ mocks ไม่ส่งข้อมูลจริง |
| PF-15 | Browser console ไม่มี error ที่ถูกบันทึกระหว่างการทดสอบ | ผ่าน |

[Browser checks JSON](performance-evidence/2026-11-06/after/browser-checks.json)

## ภาพตรวจหลังแก้

[บริการภาษาไทย](performance-evidence/2026-11-06/after/desktop-services-th.jpg) · [บริการภาษาอังกฤษ](performance-evidence/2026-11-06/after/desktop-services-en.jpg) · [บริการมือถือ](performance-evidence/2026-11-06/after/mobile-services-first.jpg) · [แพ็กเกจมือถือ](performance-evidence/2026-11-06/after/mobile-packages.jpg) · [รีวิว](performance-evidence/2026-11-06/after/desktop-reviews.jpg) · [footer มือถือ](performance-evidence/2026-11-06/after/mobile-footer.jpg)

## ขอบเขตของผลที่ยืนยันได้

ยืนยันการลดขนาดภาพ การเลือกไฟล์จริงในเบราว์เซอร์ การลดงานวัดที่ไม่จำเป็นในชุดทดสอบ และพฤติกรรมใช้งานหลังแก้ได้ ยังไม่ได้วัด PageSpeed บน production รุ่นใหม่หรือบันทึก FPS ระหว่างเลื่อน จึงยังไม่ระบุตัวเลขความเร็ว/FPS ที่เพิ่มขึ้น

Browser QA ใช้เซิร์ฟเวอร์ในเครื่องที่จำลอง contact upstream และปิด GTM network loader จึงไม่มีการเขียน Google Sheets ส่งอีเมล หรือส่ง conversion จริง ผลช่วงโหลดของ QA ไม่สามารถใช้แทน production ที่โหลด third-party tags ได้

หลัง deploy ควรวัด PageSpeed ซ้ำด้วยเงื่อนไขเดิม และบันทึก frame time ขณะเลื่อนผ่าน Services, Reviews และ footer เพื่อยืนยันผลบนอุปกรณ์จริง

การอัปเดตภาพครั้งต่อไป: เปลี่ยน JPG ต้นฉบับ → `npm run images:optimize` → `npm run verify` แล้วนำ source, registry, WebP และ bundle ขึ้นพร้อมกัน
