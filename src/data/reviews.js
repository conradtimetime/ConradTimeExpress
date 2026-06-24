(function () {
  "use strict";

const reviewsEN = [
  {
    type: 'Review', date: 'Jul 18, 2023',
    headline: 'The Gold Standard\nin Luxury Logistics',
    shortQuote: 'Every step was handled with precision and care. Conrad Express stands apart from any service I have used before.',
    tags: ['GOLD PLAN', 'INTERNATIONAL'],
    author: 'Mr. James H.', role: 'Business Executive, London',
    initials: 'JH', color: '#1e3a5f',
  },
  {
    type: 'Review', date: 'Sep 5, 2023',
    headline: 'Every Piece Treated\nLike Royalty',
    shortQuote: 'My jewellery was documented, wrapped, and delivered without a single concern. Condition photography was a brilliant touch.',
    tags: ['SILVER PLAN', 'JEWELLERY'],
    author: 'Khun Arisa V.', role: 'Private Collector, Bangkok',
    initials: 'AV', color: '#3d1f5c',
  },
  {
    type: 'Review', date: 'Nov 20, 2023',
    headline: 'Seamless Vault-to-Vault\nTransfer',
    shortQuote: 'The documentation alone was worth choosing Conrad Express for my significant watch portfolio transfer.',
    tags: ['PLATINUM PLAN', 'VAULT TRANSFER'],
    author: 'Khun Pattarapong N.', role: 'Investment Director, Singapore',
    initials: 'PN', color: '#1a3d2e',
  },
  {
    type: 'Review', date: 'Jan 8, 2024',
    headline: 'White-Glove Is Not\nMarketing Here',
    shortQuote: 'The only service I trust for international transfers of my gallery inventory. White-glove is a standard, not just a term.',
    tags: ['PLATINUM PLAN', 'ART & COLLECTIBLES'],
    author: 'Dr. Supaporn L.', role: 'Art Dealer, Chiang Mai',
    initials: 'SL', color: '#3d2a1a',
  },
  {
    type: 'Review', date: 'Mar 12, 2024',
    headline: 'Flawless from First Call\nto Delivery',
    shortQuote: 'Conrad Express handled my Patek Philippe collection with the same reverence I have for each piece. Truly flawless.',
    tags: ['GOLD PLAN', 'WATCHES'],
    author: 'Khun Wanchai T.', role: 'Private Collector, Bangkok',
    initials: 'WT', color: '#1e3a5f',
  },
];

const reviewsTH = [
  {
    type: 'รีวิว', date: '18 ก.ค. 2566',
    headline: 'มาตรฐานทองคำใน\nโลจิสติกส์หรู',
    shortQuote: 'ทุกขั้นตอนดำเนินการด้วยความแม่นยำ Conrad Express โดดเด่นจากทุกบริการที่ผมเคยใช้',
    tags: ['แผน GOLD', 'ระหว่างประเทศ'],
    author: 'นาย James H.', role: 'นักธุรกิจ, ลอนดอน',
    initials: 'JH', color: '#1e3a5f',
  },
  {
    type: 'รีวิว', date: '5 ก.ย. 2566',
    headline: 'ดูแลทุกชิ้น\nเหมือนของล้ำค่า',
    shortQuote: 'เครื่องประดับถูกบันทึก ห่อ และส่งถึงปลายทางอย่างสมบูรณ์แบบ การถ่ายภาพสภาพสินค้าเป็นสิ่งที่ยอดเยี่ยม',
    tags: ['แผน SILVER', 'เครื่องประดับ'],
    author: 'คุณอริสา ว.', role: 'นักสะสมส่วนตัว กรุงเทพฯ',
    initials: 'AV', color: '#3d1f5c',
  },
  {
    type: 'รีวิว', date: '20 พ.ย. 2566',
    headline: 'โอนย้ายระหว่างห้องนิรภัย\nได้อย่างราบรื่น',
    shortQuote: 'เอกสารเพียงอย่างเดียวก็คุ้มค่ากับการเลือก Conrad Express สำหรับการโอนย้ายพอร์ตโฟลิโอนาฬิกา',
    tags: ['แผน PLATINUM', 'ห้องนิรภัย'],
    author: 'คุณภัทรพงษ์ น.', role: 'ผู้อำนวยการฝ่ายลงทุน สิงคโปร์',
    initials: 'PN', color: '#1a3d2e',
  },
  {
    type: 'รีวิว', date: '8 ม.ค. 2567',
    headline: 'White-Glove ที่นี่\nไม่ใช่แค่คำโฆษณา',
    shortQuote: 'บริการเดียวที่ฉันไว้ใจสำหรับการโอนย้ายสินค้าคลังแกลเลอรีระหว่างประเทศ White-Glove คือมาตรฐาน',
    tags: ['แผน PLATINUM', 'งานศิลปะ'],
    author: 'ดร.สุภาพร ล.', role: 'ผู้ค้างานศิลปะ เชียงใหม่',
    initials: 'SL', color: '#3d2a1a',
  },
  {
    type: 'รีวิว', date: '12 มี.ค. 2567',
    headline: 'ไร้ที่ติตั้งแต่โทรครั้งแรก\nจนถึงส่งมอบ',
    shortQuote: 'Conrad Express ดูแลคอลเลกชัน Patek Philippe ด้วยความรักเช่นเดียวกับที่ผมมีต่อแต่ละชิ้น ไร้ที่ติจริงๆ',
    tags: ['แผน GOLD', 'นาฬิกา'],
    author: 'คุณวันชัย ท.', role: 'นักสะสมส่วนตัว กรุงเทพฯ',
    initials: 'WT', color: '#1e3a5f',
  },
];

  window.CONRAD_EXPRESS_REVIEWS = { en: reviewsEN, th: reviewsTH };
})();
