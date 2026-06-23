(function () {
  "use strict";

  const SITE_CONFIG = {
    heroBackground: "",
    contact: {
      email: "conradtime.time@gmail.com",
      lineUrl: "https://line.me/ti/p/~@ConradExpress",
    },
  };

/* ── COPY ── */
const COPY = {
  en: {
    nav: { services: 'Services', about: 'About', process: 'Process', packages: 'Packages', contact: 'Contact', cta: 'Request Pickup' },
    hero: {
      eyebrow: 'Conrad Time · Est. 2016',
      title: 'Conrad\nExpress',
      sub: 'Dedicated logistics for luxury timepieces\nand high-value collectibles',
      cta1: 'Schedule a Pickup',
      cta2: 'Learn More',
    },
    trust: ['Fully Insured', 'White-Glove Handling', 'Real-Time Tracking', 'Discreet Packaging'],
    pricing: { label: 'Starting from', price: '฿1,500', unit: '/ shipment', note: 'All plans include full insurance & real-time tracking' },
    packages: {
      label: 'Service Packages',
      title: 'Choose Your\nLevel of Care',
      sub: 'Every tier includes white-glove handling, full insurance, and dedicated support.',
      items: [
        {
          name: 'Silver', badge: '',
          price: '฿1,500', unit: '/shipment',
          desc: 'Ideal for single watches and small jewellery pieces within Bangkok.',
          features: ['Same-day pickup', 'Full insurance up to ฿500,000', 'Real-time tracking', 'Discreet packaging', 'Digital proof of delivery'],
          cta: 'Get Started',
        },
        {
          name: 'Gold', badge: 'MOST POPULAR',
          price: '฿4,500', unit: '/shipment',
          desc: 'For multiple pieces or high-value shipments across Thailand.',
          features: ['Priority scheduling', 'Full insurance up to ฿5,000,000', 'Dedicated advisor', 'Condition photography', 'Custom crating', 'White-glove unpacking'],
          cta: 'Get Started',
        },
        {
          name: 'Platinum', badge: '',
          price: 'Custom', unit: '',
          desc: 'Vault-to-vault, international, and ultra-high-value collections.',
          features: ['24/7 priority line', 'Unlimited insurance value', 'Armed escort available', 'International customs support', 'Freeport & bonded transit', 'Dedicated relationship manager'],
          cta: 'Contact Us',
        },
      ]
    },
    services: {
      label: 'Our Services',
      title: 'Every Shipment\nDeserves Reverence',
      items: [
        { title: 'Watch & Jewellery', desc: 'Purpose-built cases with precision cushioning for horological and gem-set pieces. Each item is individually documented with condition photography before dispatch.' },
        { title: 'Art & Collectibles', desc: 'Climate-controlled transport with custom crating for sculptures, paintings, rare books, and fine art. Museum-grade care from door to door.' },
        { title: 'International Express', desc: 'Priority courier with diplomatic discretion across 80+ countries. Full customs documentation, Carnet ATA assistance, and bonded transit where required.' },
        { title: 'Vault-to-Vault', desc: 'Secure transfer between private vaults, banks, and freeports. Armed escort available. Zero-gap chain of custody with tamper-evident seals.' },
      ]
    },
    why: {
      label: 'Why Conrad Express',
      title: 'Built on a Legacy\nof Precision',
      items: [
        { num: '08', label: 'Years of luxury logistics expertise' },
        { num: '99.8%', label: 'On-time delivery rate' },
        { num: '฿2B+', label: 'In high-value goods transported' },
        { num: '80+', label: 'Countries served worldwide' },
      ]
    },
    process: {
      label: 'How It Works',
      title: 'A Seamless\nEnd-to-End Experience',
      steps: [
        { n: '01', title: 'Consultation', desc: 'A dedicated advisor assesses your item, destination, and security requirements.' },
        { n: '02', title: 'Collection', desc: 'Our white-glove team arrives at your location with custom packaging materials.' },
        { n: '03', title: 'Transit', desc: 'Real-time GPS tracking with proactive status updates throughout the journey.' },
        { n: '04', title: 'Delivery', desc: 'Recipient identity verified, item inspected, and handoff confirmed with digital proof.' },
      ]
    },
    testimonials: {
      label: 'Client Voices',
      title: 'Trust Built\nOver Time',
      items: [
        { quote: 'Every step was handled with precision and the utmost care. Conrad Express stands entirely apart from any logistics service I have used before.', author: 'Mr. James H.', role: 'Business Executive, London' },
        { quote: 'My jewellery was documented, wrapped, and delivered without a single concern. The condition photography before dispatch was a brilliant, reassuring touch.', author: 'Khun Arisa V.', role: 'Private Collector, Bangkok' },
        { quote: 'Seamless vault-to-vault transfer of a significant watch portfolio. The documentation alone was worth choosing Conrad Express.', author: 'Khun Pattarapong N.', role: 'Investment Director, Singapore' },
        { quote: 'The only service I trust for international transfers of my gallery inventory. White-glove is not a marketing term here — it is a standard.', author: 'Dr. Supaporn L.', role: 'Art Dealer, Chiang Mai' },
        { quote: 'Conrad Express handled my Patek Philippe collection with the same reverence I have for each piece. Flawless from first call to delivery.', author: 'Khun Wanchai T.', role: 'Private Collector, Bangkok' },
      ]
    },
    contact: {
      label: 'Get In Touch',
      title: 'Begin Your\nShipment',
      sub: 'Our advisors are available Monday–Saturday, 9:00–18:00 ICT.\nFor urgent requests, our priority line operates 24/7.',
      fields: { name: 'Full Name', phone: 'Phone Number', type: 'Shipment Type', message: 'Tell us about your item', cta: 'Submit Request' },
      types: ['Watches & Jewellery', 'Art & Collectibles', 'Vault Transfer', 'International Express', 'Other'],
    },
    footer: {
      tagline: 'Precision. Discretion. Delivery.',
      links: ['Privacy Policy', 'Terms of Service', 'Insurance Policy'],
      copy: '© 2026 Conrad Express. A Conrad Time Company.',
      address: '546 Ratchada One Building, 10th Floor, Ratchadaphisek Rd, Chatuchak, Bangkok 10900',
      line: '@ConradExpress',
      tel: '+66 2 016 9950',
    },
    manifesto: {
      label: 'Our Mission',
      quote: 'Total solution for high-value logistics — encapsulating a comprehensive array of services meticulously designed to exceed the highest standards of precision, discretion, and trust.',
      sub: 'From the moment you engage with us, expect nothing short of unparalleled sophistication and seamless execution at every touchpoint of your journey.',
    },
    pillars: {
      label: 'Our Standards',
      title: 'Four Pillars of\nExceptional Service',
      items: [
        { icon: '◈', title: 'Absolute Discretion', desc: 'Every shipment is handled with the utmost privacy. No markings, no disclosures, no exceptions.' },
        { icon: '◇', title: 'Precision & Timing', desc: 'Punctuality is non-negotiable. We respect the value of your time as much as the value of your goods.' },
        { icon: '◻', title: 'Expert Handling', desc: 'Trained specialists with deep knowledge of luxury goods, proper handling techniques, and security protocols.' },
        { icon: '◯', title: 'Total Accountability', desc: 'Chain-of-custody documentation, condition photography, and digital proof of delivery on every shipment.' },
      ]
    },
    misc: {
      whyAbout: 'Since 2016, Conrad Time has set the benchmark for luxury watch authentication and sales. Conrad Express extends that same discipline into every shipment we handle.',
      trustedBy: 'TRUSTED BY',
      howItWorks: 'HOW IT WORKS',
    }
  },
  th: {
    nav: { services: 'บริการ', about: 'เกี่ยวกับเรา', process: 'ขั้นตอน', packages: 'แพ็กเกจ', contact: 'ติดต่อ', cta: 'นัดรับสินค้า' },
    hero: {
      eyebrow: 'Conrad Time · ก่อตั้ง 2016',
      title: 'Conrad\nExpress',
      sub: 'โลจิสติกส์เฉพาะทางสำหรับนาฬิกาหรูหราและของสะสมมูลค่าสูง',
      cta1: 'นัดหมายรับสินค้า',
      cta2: 'เรียนรู้เพิ่มเติม',
    },
    trust: ['ประกันเต็มมูลค่า', 'บริการ White-Glove', 'ติดตามแบบเรียลไทม์', 'บรรจุภัณฑ์ระดับพรีเมียม'],
    pricing: { label: 'เริ่มต้นที่', price: '฿1,500', unit: '/ การจัดส่ง', note: 'ทุกแพ็กเกจรวมประกันเต็มมูลค่าและติดตามแบบเรียลไทม์' },
    packages: {
      label: 'แพ็กเกจบริการ',
      title: 'เลือกระดับ\nการดูแลของคุณ',
      sub: 'ทุกระดับรวมบริการ White-Glove การประกันภัยครบถ้วน และทีมสนับสนุนเฉพาะของคุณ',
      items: [
        {
          name: 'Silver', badge: '',
          price: '฿1,500', unit: '/การจัดส่ง',
          desc: 'เหมาะสำหรับนาฬิกาชิ้นเดียวและเครื่องประดับชิ้นเล็กในกรุงเทพฯ',
          features: ['รับสินค้าภายในวันเดียวกัน', 'ประกันสูงสุด ฿500,000', 'ติดตามแบบเรียลไทม์', 'บรรจุภัณฑ์เฉพาะทาง', 'หลักฐานการส่งมอบดิจิทัล'],
          cta: 'เริ่มต้นใช้บริการ',
        },
        {
          name: 'Gold', badge: 'ยอดนิยม',
          price: '฿4,500', unit: '/การจัดส่ง',
          desc: 'สำหรับหลายชิ้นหรือสินค้ามูลค่าสูงทั่วประเทศไทย',
          features: ['กำหนดเวลาลำดับความสำคัญ', 'ประกันสูงสุด ฿5,000,000', 'ที่ปรึกษาเฉพาะ', 'ถ่ายภาพสภาพสินค้า', 'ลังไม้เฉพาะทาง', 'แกะกล่องแบบ White-Glove'],
          cta: 'เริ่มต้นใช้บริการ',
        },
        {
          name: 'Platinum', badge: '',
          price: 'กำหนดเอง', unit: '',
          desc: 'โอนย้ายระหว่างห้องนิรภัย ระหว่างประเทศ และคอลเลกชันมูลค่าสูงพิเศษ',
          features: ['สายด่วน 24/7', 'ประกันไม่จำกัดมูลค่า', 'ผู้คุ้มกันติดอาวุธ', 'สนับสนุนศุลกากรระหว่างประเทศ', 'ฟรีพอร์ตและการขนส่งแบบ Bonded', 'ผู้จัดการความสัมพันธ์เฉพาะ'],
          cta: 'ติดต่อเรา',
        },
      ]
    },
    services: {
      label: 'บริการของเรา',
      title: 'ทุกการจัดส่ง\nคู่ควรแก่ความพิถีพิถัน',
      items: [
        { title: 'นาฬิกาและเครื่องประดับ', desc: 'กล่องเฉพาะทางพร้อมระบบกันสั่นสะเทือนสำหรับชิ้นงานนาฬิกาและอัญมณี พร้อมบันทึกภาพสภาพทุกชิ้นก่อนจัดส่ง' },
        { title: 'งานศิลปะและของสะสม', desc: 'ขนส่งในอุณหภูมิควบคุมพร้อมลังไม้ศิลปะสำหรับประติมากรรม ภาพวาด หนังสือหายาก และงานศิลปะชั้นสูง' },
        { title: 'บริการด่วนระหว่างประเทศ', desc: 'ผู้ส่งสารลำดับความสำคัญด้วยความรอบคอบทางการทูตใน 80+ ประเทศ พร้อมเอกสารศุลกากรครบถ้วน' },
        { title: 'โอนย้ายระหว่างห้องนิรภัย', desc: 'การโอนย้ายที่ปลอดภัยระหว่างห้องนิรภัยส่วนตัว ธนาคาร และฟรีพอร์ต พร้อมระบบตรวจสอบการเปิดซองบรรจุ' },
      ]
    },
    why: {
      label: 'ทำไมต้อง Conrad Express',
      title: 'สร้างบนมรดก\nแห่งความแม่นยำ',
      items: [
        { num: '08', label: 'ปีแห่งความเชี่ยวชาญด้านโลจิสติกส์หรู' },
        { num: '99.8%', label: 'อัตราส่งตรงเวลา' },
        { num: '2B+', label: 'บาทในสินค้ามูลค่าสูงที่ขนส่งแล้ว' },
        { num: '80+', label: 'ประเทศทั่วโลก' },
      ]
    },
    process: {
      label: 'ขั้นตอนการทำงาน',
      title: 'ประสบการณ์\nที่ราบรื่นตลอดเส้นทาง',
      steps: [
        { n: '01', title: 'ปรึกษา', desc: 'ที่ปรึกษาเฉพาะของคุณประเมินสินค้า ปลายทาง และข้อกำหนดด้านความปลอดภัย' },
        { n: '02', title: 'รับสินค้า', desc: 'ทีม White-Glove ของเราเดินทางถึงสถานที่ของคุณพร้อมวัสดุบรรจุภัณฑ์เฉพาะ' },
        { n: '03', title: 'ขนส่ง', desc: 'ติดตาม GPS แบบเรียลไทม์พร้อมอัปเดตสถานะเชิงรุกตลอดการเดินทาง' },
        { n: '04', title: 'ส่งมอบ', desc: 'ยืนยันตัวตนผู้รับ ตรวจสอบสินค้า และยืนยันการส่งมอบด้วยหลักฐานดิจิทัล' },
      ]
    },
    testimonials: {
      label: 'เสียงจากลูกค้า',
      title: 'ความไว้วางใจ\nสร้างจากเวลา',
      items: [
        { quote: 'ทุกขั้นตอนดำเนินการด้วยความแม่นยำและความรอบคอบสูงสุด Conrad Express โดดเด่นจากทุกบริการโลจิสติกส์ที่ผมเคยใช้มา', author: 'นาย James H.', role: 'นักธุรกิจ, ลอนดอน' },
        { quote: 'คอลเลกชันเครื่องประดับของฉันถูกบันทึก ห่อ และส่งถึงปลายทางอย่างสมบูรณ์แบบ การถ่ายภาพสภาพสินค้าก่อนจัดส่งเป็นสิ่งที่น่าประทับใจมาก', author: 'คุณอริสา ว.', role: 'นักสะสมส่วนตัว กรุงเทพฯ' },
        { quote: 'การโอนย้ายระหว่างห้องนิรภัยของพอร์ตโฟลิโอนาฬิกาที่มีมูลค่าสำคัญ เอกสารเพียงอย่างเดียวก็คุ้มค่ากับการเลือก Conrad Express', author: 'คุณภัทรพงษ์ น.', role: 'ผู้อำนวยการฝ่ายลงทุน สิงคโปร์' },
        { quote: 'บริการเดียวที่ฉันไว้ใจสำหรับการโอนย้ายสินค้าคลังแกลเลอรีระหว่างประเทศ White-Glove ที่นี่ไม่ใช่แค่คำโฆษณา แต่คือมาตรฐาน', author: 'ดร.สุภาพร ล.', role: 'ผู้ค้างานศิลปะ เชียงใหม่' },
        { quote: 'Conrad Express ดูแลคอลเลกชัน Patek Philippe ของผมด้วยความรักเช่นเดียวกับที่ผมมีต่อแต่ละชิ้น ไร้ที่ติตั้งแต่โทรครั้งแรกจนถึงการส่งมอบ', author: 'คุณวันชัย ท.', role: 'นักสะสมส่วนตัว กรุงเทพฯ' },
      ]
    },
    contact: {
      label: 'ติดต่อเรา',
      title: 'เริ่มต้น\nการจัดส่งของคุณ',
      sub: 'ที่ปรึกษาของเราพร้อมให้บริการจันทร์–เสาร์ 9:00–18:00 น. ICT\nสำหรับคำขอเร่งด่วน สายด่วนของเราเปิดตลอด 24 ชั่วโมง',
      fields: { name: 'ชื่อ-นามสกุล', phone: 'หมายเลขโทรศัพท์', type: 'ประเภทการจัดส่ง', message: 'บอกเราเกี่ยวกับสินค้าของคุณ', cta: 'ส่งคำขอ' },
      types: ['นาฬิกาและเครื่องประดับ', 'งานศิลปะและของสะสม', 'โอนย้ายระหว่างห้องนิรภัย', 'ด่วนระหว่างประเทศ', 'อื่นๆ'],
    },
    footer: {
      tagline: 'ความแม่นยำ · ความรอบคอบ · การส่งมอบ',
      links: ['นโยบายความเป็นส่วนตัว', 'ข้อกำหนดการใช้บริการ', 'นโยบายประกันภัย'],
      copy: '© 2026 Conrad Express บริษัทในเครือ Conrad Time',
      address: '546 อาคารรัชดาวัน ชั้น 10 ถนนรัชดาภิเษก จตุจักร กรุงเทพฯ 10900',
      line: '@ConradExpress',
      tel: '+66 2 016 9950',
    },
    manifesto: {
      label: 'พันธกิจของเรา',
      quote: 'โซลูชันครบวงจรสำหรับโลจิสติกส์มูลค่าสูง — ครอบคลุมบริการที่ออกแบบมาเพื่อยกระดับมาตรฐานสูงสุดด้านความแม่นยำ ความรอบคอบ และความไว้วางใจ',
      sub: 'ตั้งแต่ช่วงเวลาที่คุณเริ่มต้นกับเรา คาดหวังได้ถึงความซับซ้อนที่เหนือชั้นและการดำเนินงานที่ราบรื่นในทุกจุดสัมผัสของการเดินทาง',
    },
    pillars: {
      label: 'มาตรฐานของเรา',
      title: 'สี่เสาหลักแห่ง\nการบริการที่เป็นเลิศ',
      items: [
        { icon: '◈', title: 'ความรอบคอบสูงสุด', desc: 'ทุกการจัดส่งดำเนินการด้วยความเป็นส่วนตัวสูงสุด ไม่มีการระบุ ไม่มีการเปิดเผย' },
        { icon: '◇', title: 'ความแม่นยำและเวลา', desc: 'การตรงต่อเวลาไม่สามารถต่อรองได้ เราให้ความสำคัญกับเวลาของคุณเท่ากับมูลค่าสินค้า' },
        { icon: '◻', title: 'ความเชี่ยวชาญในการดูแล', desc: 'ผู้เชี่ยวชาญที่ผ่านการฝึกอบรมด้านสินค้าหรู เทคนิคการจัดการ และโปรโตคอลความปลอดภัย' },
        { icon: '◯', title: 'ความรับผิดชอบครบถ้วน', desc: 'เอกสารสายโซ่การดูแล ถ่ายภาพสภาพสินค้า และหลักฐานการส่งมอบดิจิทัลทุกครั้ง' },
      ]
    },
    misc: {
      whyAbout: 'ตั้งแต่ปี 2559 Conrad Time ได้วางมาตรฐานสูงสุดในการรับรองและจำหน่ายนาฬิกาหรูหรา Conrad Express นำวินัยเดียวกันนั้นมาสู่ทุกการจัดส่ง',
      trustedBy: 'พาร์ทเนอร์ของเรา',
      howItWorks: 'ขั้นตอนการทำงาน',
    }
  }
};

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

/* ── Real client review photos ──
   Drop the photos into brand-images/ with these exact names.
   Leave a slot '' to fall back to the placeholder. */
const reviewPhotos = [
  'brand-images/review-1.jpg',
  'brand-images/review-2.jpg',
  'brand-images/review-3.jpg',
  'brand-images/review-4.jpg',
  'brand-images/review-5.jpg',
];

  window.CONRAD_EXPRESS_DATA = {
    SITE_CONFIG,
    COPY,
    REVIEW_CARDS: { en: reviewsEN, th: reviewsTH },
    REVIEW_PHOTOS: reviewPhotos,
  };
})();
