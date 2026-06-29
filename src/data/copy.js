(function () {
  "use strict";

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
    pricing: { label: 'Starting from', price: '฿500', unit: '/ shipment', note: 'All plans include full insurance & real-time tracking' },
    packages: {
      label: 'Service Packages',
      title: 'Choose Your\nLevel of Care',
      sub: 'Every tier includes white-glove handling, full insurance, and dedicated support.',
      items: [
        {
          name: 'Same Day', badge: 'Fastest',
          original: 'From ฿999', promoLabel: 'Promo',
          price: '฿500', unit: '',
          desc: 'Same-day pickup & delivery within Bangkok and the metropolitan area.',
          features: ['Same-day pickup & delivery', 'Bangkok & metro area only', 'Insurance up to ฿50,000', 'Shipment status updates', 'Door-to-door pickup', 'Free packaging'],
          cta: 'Select This Package',
        },
        {
          name: 'Thailand Express', badge: 'Nationwide',
          price: '฿6,900', unit: '',
          desc: 'Secure transport for high-value goods across Thailand.',
          features: ['Delivered within 1–2 days', 'Coverage across Thailand', 'Insurance up to ฿50,000', 'Shipment status updates', 'Door-to-door pickup', 'Free packaging'],
          cta: 'Select This Package',
        },
        {
          name: 'Saver Package', badge: 'Best Value',
          price: '฿1,390', unit: '',
          desc: 'A great-value bundle for customers who ship frequently.',
          features: ['Up to 5 shipments', 'Bangkok & metro area only', 'Valid for 30 days', 'Shipment status updates', 'Door-to-door pickup', 'Free packaging'],
          cta: 'Select This Package',
        },
      ]
    },
    services: {
      label: 'Our Services',
      title: 'Every Shipment\nDeserves Reverence',
      sub: 'Specialized handling for high-value personal assets, from collectible watches to sensitive technology, fine jewellery, and fragile works that demand documented care.',
      items: [
        { title: 'Luxury Watches', desc: 'Dedicated watch transport with shock-conscious packing, soft-touch handling, and condition photography before dispatch. Suitable for single timepieces, collector sets, and service-center transfers.' },
        { title: 'Art & Collectibles', desc: 'Climate-controlled transport with custom crating for sculptures, paintings, rare books, and fine art. Museum-grade care from door to door.' },
        { title: 'Information Technology', desc: 'Priority delivery for high-value technology including laptops, MacBook, iPad, professional cameras, and sensitive IT equipment. Protective packing, serial-number records, customs support, and direct handoff are available.' },
        { title: 'Jewellery & Gem', desc: 'Secure movement for diamond jewellery, gemstones, gold pieces, and precious accessories between boutiques, private homes, safes, banks, and showrooms with strict chain-of-custody control.' },
      ]
    },
    why: {
      label: 'Why Conrad Express',
      title: 'Built on a Legacy\nof Precision',
      items: [
        { num: '08', label: 'Years of luxury logistics expertise' },
        { num: '99.8%', label: 'On-time delivery rate' },
        { num: '10K+', label: 'Parcels delivered successfully' },
        { num: '77', label: 'Provinces across Thailand' },
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
      title: 'Trust Built Over Time',
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
    pricing: { label: 'เริ่มต้นที่', price: '฿500', unit: '/ การจัดส่ง', note: 'ทุกแพ็กเกจรวมประกันเต็มมูลค่าและติดตามแบบเรียลไทม์' },
    packages: {
      label: 'แพ็กเกจบริการ',
      title: 'เลือกระดับ\nการดูแลของคุณ',
      sub: 'ทุกระดับรวมบริการ White-Glove การประกันภัยครบถ้วน และทีมสนับสนุนเฉพาะของคุณ',
      items: [
        {
          name: 'Same Day', badge: 'ด่วนสุด',
          original: 'เริ่มต้น ฿999', promoLabel: 'โปรโมชั่น',
          price: '฿500', unit: '',
          desc: 'รับ-ส่งด่วนภายในวันเดียวกัน ในกรุงเทพฯ และปริมณฑล',
          features: ['รับ-ส่งภายในวันเดียวกัน', 'เฉพาะกรุงเทพฯ และปริมณฑล', 'ประกันสินค้า 50,000 บาท', 'แจ้งสถานะการขนส่ง', 'บริการรับถึงหน้าบ้าน', 'แพ็คสินค้าฟรี'],
          cta: 'เลือกแพ็กเกจนี้',
        },
        {
          name: 'Thailand Express', badge: 'ด่วนทั่วไทย',
          price: '฿6,900', unit: '',
          desc: 'ขนส่งสินค้ามูลค่าสูงอย่างปลอดภัย ทั่วประเทศไทย',
          features: ['ส่งถึงปลายทางภายใน 1-2 วัน', 'ครอบคลุมทั่วประเทศไทย', 'ประกันสินค้า 50,000 บาท', 'แจ้งสถานะการขนส่ง', 'บริการรับถึงหน้าบ้าน', 'แพ็คสินค้าฟรี'],
          cta: 'เลือกแพ็กเกจนี้',
        },
        {
          name: 'Saver Package', badge: 'คุ้มค่า',
          price: '฿1,390', unit: '',
          desc: 'แพ็กเกจคุ้มค่าสำหรับลูกค้าที่ใช้บริการหลายครั้ง',
          features: ['ใช้บริการได้ 5 ครั้ง', 'เฉพาะกรุงเทพฯ และปริมณฑล', 'ใช้ได้ภายใน 30 วัน', 'แจ้งสถานะการขนส่ง', 'บริการรับถึงหน้าบ้าน', 'แพ็คสินค้าฟรี'],
          cta: 'เลือกแพ็กเกจนี้',
        },
      ]
    },
    services: {
      label: 'บริการของเรา',
      title: 'ทุกการจัดส่ง\nคู่ควรแก่ความพิถีพิถัน',
      sub: 'บริการขนส่งเฉพาะทางสำหรับสินค้ามูลค่าสูง ตั้งแต่นาฬิกาสะสม อุปกรณ์เทคโนโลยี เครื่องประดับ ไปจนถึงงานสะสมที่ต้องการการดูแลพร้อมเอกสารครบถ้วน',
      items: [
        { title: 'นาฬิกาหรู', desc: 'ขนส่งนาฬิกาด้วยบรรจุภัณฑ์ที่ลดแรงกระแทก การจับถืออย่างพิถีพิถัน และบันทึกภาพสภาพก่อนจัดส่ง เหมาะสำหรับนาฬิกาเรือนเดียว คอลเลกชันสะสม หรือการส่งเข้าศูนย์บริการ' },
        { title: 'งานศิลปะและของสะสม', desc: 'ขนส่งในอุณหภูมิควบคุมพร้อมลังไม้ศิลปะสำหรับประติมากรรม ภาพวาด หนังสือหายาก และงานศิลปะชั้นสูง' },
        { title: 'เทคโนโลยีสารสนเทศ', desc: 'ขนส่งอุปกรณ์เทคโนโลยีมูลค่าสูง เช่น laptop, MacBook, iPad, กล้องมืออาชีพ และอุปกรณ์ IT สำคัญ พร้อมบรรจุภัณฑ์ป้องกัน บันทึก serial number เอกสารประกอบ และส่งมอบโดยตรงถึงผู้รับ' },
        { title: 'เครื่องประดับเพชรพลอยและอัญมณี', desc: 'ขนส่ง Jewellery เครื่องประดับเพชร พลอย ทองคำ และแอ็กเซสซอรีมูลค่าสูง ระหว่างบูติก บ้านส่วนตัว ตู้เซฟ ธนาคาร หรือโชว์รูม พร้อมควบคุม chain-of-custody ทุกขั้นตอน' },
      ]
    },
    why: {
      label: 'ทำไมต้อง Conrad Express',
      title: 'สร้างบนมรดก\nแห่งความแม่นยำ',
      items: [
        { num: '08', label: 'ปีแห่งความเชี่ยวชาญด้านโลจิสติกส์หรู' },
        { num: '99.8%', label: 'อัตราส่งตรงเวลา' },
        { num: '10K+', label: 'ส่งพัสดุให้ลูกค้าสำเร็จ' },
        { num: '77', label: 'จังหวัดทั่วไทย' },
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
      title: 'ความไว้วางใจสร้างจากเวลา',
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

  window.CONRAD_EXPRESS_COPY = COPY;
})();
