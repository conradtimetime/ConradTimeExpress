(function () {
  "use strict";

const COPY = {
  en: {
    nav: { services: 'Services', about: 'About', process: 'Process', packages: 'Packages', contact: 'Contact', cta: 'Book a Service' },
    hero: {
      eyebrow: 'Conrad Time · Est. 2016',
      title: 'Conrad\nExpress',
      sub: 'Premium high-value goods delivery\nNationwide delivery within one day',
      cta1: 'Book a Service',
      cta2: 'Learn More',
    },
    trust: ['Insurance from 50K+', 'Beyond standard delivery', 'Real-Time Tracking'],
    brands: {
      label: 'Trusted By',
      title: 'Brands That Trust Us',
      items: ['Aurélien', 'Monteverde', 'Valmont & Co.', 'House of Sévigné', 'Lantana', 'Belmont Rowe'],
    },
    pricing: { label: 'Starting from', price: '฿500', unit: '/ shipment', note: '' },
    packages: {
      label: 'Service Packages',
      title: 'Pick the Plan\nThat Fits You',
      sub: '',
      priceNote: 'Pricing note: Prices may change depending on the declared item value and shipment date.',
      items: [
        {
          name: 'Standard',
          cornerTag: { label: 'Promotion', tone: 'promo', position: 'right' },
          fit: 'Best for one-off Bangkok & vicinity shipments',
          price: '฿500',
          original: '฿890+',
          unit: '',
          details: ['Pay per trip', 'Same-day delivery', 'Bangkok & vicinity delivery'],
          features: ['Maximum compensation for damages ฿50,000', 'Shipment tracking included'],
          cta: 'Book a Service',
        },
        {
          name: 'Other Provinces',
          fit: 'Best for one-off shipments outside Bangkok',
          price: '฿5,900+',
          details: ['Pay per trip', 'Same-day delivery','Nationwide delivery'],
          features: ['Maximum compensation for damages ฿50,000', 'Shipment tracking included'],
          cta: 'Book a Service',
        },
        {
          name: '5 Delivery',
          badge: 'MOST POPULAR',
          highlight: true,
          fit: 'Best for frequent monthly high-value deliveries',
          price: '฿3,900+',
          unit: '/month',
          details: ['Valid for 5 Deliveries/month', 'Same-day delivery', 'Bangkok & vicinity delivery'],
          features: ['Maximum compensation for damages ฿50,000', 'Shipment tracking included'],
          cta: 'Book a Service',
        },
        {
          name: 'Exclusive',
          fit: 'Best for teams with ongoing high-volume shipments',
          priceText: 'Contact Staff',
          priceTone: 'contact',
          details: ['Unlimited Deliveries', 'Custom Pricing', 'Same-day delivery', 'Nationwide delivery'],
          features: ['Maximum compensation for damages ฿50,000', 'Shipment tracking included'],
          cta: 'Book a Service',
        },
      ]
    },
    services: {
      label: 'Our Services',
      title: 'High-Value Shipment\nRequire Special Care',
      items: [
        { title: 'Luxury Watches', desc: 'Shock-proof packing, condition photos, and careful handover for single watches, full collections, or service-centre trips.' },
        { title: 'Fine Art', desc: 'Special handling for paintings, sculptures, framed works, and fragile art pieces, with careful pickup and direct handover.' },
        { title: 'Collectibles', desc: 'Dedicated care for rare books, limited editions, memorabilia, and display pieces that need controlled handling and clear proof of delivery.' },
        { title: 'Gemstones', desc: 'Secure delivery for diamonds, coloured stones, loose gems, and certified stones between homes, shops, banks, and showrooms.' },
        { title: 'Gold', desc: 'Discreet transport for gold bars, gold jewellery, bullion, and other precious metal items with verified pickup and recipient handover.' },
        { title: 'Luxury Fashion', desc: 'Protected delivery for designer bags, apparel, and shoes, with careful packing to preserve shape and condition.' },
        { title: 'Confidential', desc: 'Private hand delivery for deeds, passports, contracts, and cashier’s cheques, with real-time tracking and proof of handover.' },
        { title: 'Gadgets', desc: 'Safe delivery for cameras, lenses, drones, tablets, and premium devices using shock-resistant packing and close route tracking.' },
        { title: 'IT Equipment', desc: 'Careful transport for MacBooks, laptops, servers, storage devices, and sensitive office hardware that requires extra protection.' },
        { title: 'Other', desc: 'Special-care delivery for other urgent items outside these categories, planned case by case for safer handover.' },
      ]
    },
    why: {
      label: 'Why Conrad Express',
      title: 'Has extensive experience\nIn The Field of High-Value Delivery',
      items: [
        { num: '08', label: 'Years delivering luxury goods' },
        { num: '99.8%', label: 'On-time delivery rate' },
        { num: '10K+', label: 'Parcels delivered' },
        { num: '77', label: 'Provinces across Thailand' },
      ]
    },
    process: {
      label: 'How It Works',
      title: 'It’s easy to get started\nFrom Beginning to End',
      steps: [
        { n: '01', title: 'Talk to Us', desc: 'We chat about your item, where it’s going, and how to keep it safe.' },
        { n: '02', title: 'Pickup', desc: 'Our team comes to you with the right packing materials.' },
        { n: '03', title: 'On the Way', desc: 'Track it live by GPS and get status updates the whole way.' },
        { n: '04', title: 'Delivered', desc: 'We check the recipient, inspect the item, and confirm it with digital proof.' },
      ]
    },
    testimonials: {
      label: 'Client Groups',
      title: 'Clients We Have Served',
      items: [
        { quote: 'Every step was handled carefully and with real attention. Conrad Express is nothing like the delivery services I’ve used before.', author: 'Mr. James H.', role: 'Business Executive, London' },
        { quote: 'My jewellery was photographed, wrapped, and delivered without a single worry. Loved that they shot its condition before sending.', author: 'Khun Arisa V.', role: 'Private Collector, Bangkok' },
        { quote: 'They moved a big watch collection between safes with no fuss. The paperwork alone made choosing Conrad Express worth it.', author: 'Khun Pattarapong N.', role: 'Investment Director, Singapore' },
        { quote: 'The only service I trust to ship my gallery pieces overseas. They really do take good care — it’s not just talk.', author: 'Dr. Supaporn L.', role: 'Art Dealer, Chiang Mai' },
        { quote: 'They handled my Patek Philippe collection as carefully as I do. Great from the first call to the doorstep.', author: 'Khun Wanchai T.', role: 'Private Collector, Bangkok' },
      ]
    },
    contact: {
      label: 'Get In Touch',
      title: 'Start Shipping\nWith Us Now',
      sub: 'We’re here Mon–Sat, 9:00–18:00 ICT.\nNeed it urgent? Our hotline is open 24/7.',
      fields: { name: 'Full Name', phone: 'Phone Number', type: 'Shipment Type', message: 'Tell us about your item', cta: 'Send Request' },
      types: ['Other'],
    },
    footer: {
      tagline: 'Careful. Private. On time.',
      links: ['Privacy Policy', 'Terms of Service', 'Insurance Policy'],
      copy: '© 2026 Conrad Express. A Conrad Time Company.',
      line: '@ConradExpress',
      tel: '+66 2 016 9950',
    },
    pillars: {
      label: 'Our Standards',
      title: 'Four Things\nWe Promise You',
      items: [
        { icon: 'privacy', title: 'Privacy', sub: 'Protected shipment information', desc: 'Every shipment is kept confidential, with no details disclosed.' },
        { icon: 'time', title: 'Always On Time', sub: '99.8% on-time delivery', desc: 'On time, every time. We treat your schedule with the same care as your goods.' },
        { icon: 'expert', title: 'Expert Handling', sub: '8 years with luxury goods', desc: 'A trained team that knows high-value items and exactly how to keep them safe.' },
        { icon: 'coverage', title: 'Nationwide Coverage', sub: 'All 77 provinces', desc: 'Secure door-to-door delivery anywhere in Thailand, city or province.' },
        { icon: 'tracking', title: 'Status Tracking at Every Step', sub: 'Photographed & confirmed', desc: 'Shipments are tracked by GPS, with status updates from origin to destination.' },
        { icon: 'accountable', title: 'Responsible for every delivery', sub: '10K+ parcels delivered', desc: 'If any problems occur during delivery, our team will work closely to resolve them.' },
      ]
    },
    misc: {
      howItWorks: 'HOW IT WORKS',
    }
  },
  th: {
    nav: { services: 'บริการ', about: 'เกี่ยวกับเรา', process: 'ขั้นตอน', packages: 'แพ็กเกจ', contact: 'ติดต่อ', cta: 'จองการใช้บริการ' },
    hero: {
      eyebrow: 'Conrad Time · ก่อตั้ง 2016',
      title: 'Conrad\nExpress',
      sub: 'ขนส่งสินค้ามูลค่าสูงแบบพรีเมียม\nส่งทั่วไทย ถึงภายในหนึ่งวัน',
      cta1: 'จองการใช้บริการ',
      cta2: 'เรียนรู้เพิ่มเติม',
    },
    trust: ['ประกันภัยเริ่มต้น 50K+', 'บริการขนส่งที่เหนือกว่ามาตรฐานทั่วไป', 'ติดตามแบบเรียลไทม์'],
    brands: {
      label: 'ได้รับความไว้วางใจจาก',
      title: 'แบรนด์ที่ไว้วางใจเรา',
      items: ['Aurélien', 'Monteverde', 'Valmont & Co.', 'House of Sévigné', 'Lantana', 'Belmont Rowe'],
    },
    pricing: { label: 'เริ่มต้นที่', price: '฿500', unit: '/ การจัดส่ง', note: '' },
    packages: {
      label: 'แพ็กเกจบริการ',
      title: 'เลือกแพ็กเกจที่ใช่สำหรับคุณ',
      sub: 'ทุกแพ็กเกจดูแลของอย่างดี มีประกันครบ และมีทีมงานคอยช่วยคุณ',
      priceNote: 'หมายเหตุราคา: ราคาอาจมีการเปลี่ยนแปลงขึ้นอยู่กับมูลค่าสินค้าที่ส่งและวันที่ส่งสินค้า',
      items: [
        {
          name: 'Standard',
          cornerTag: { label: 'โปรโมชัน', tone: 'promo', position: 'right' },
          fit: 'เหมาะกับลูกค้าส่งในกทม. และปริมณฑลแบบรายครั้ง',
          price: '฿500',
          original: '฿890+',
          unit: '',
          details: ['จ่ายต่อรอบ', 'ส่งภายในวันเดียว','จัดส่งครอบคลุมในกทม. และปริมณฑล'],
          features: ['ค่าชดเชยความเสียหายสูงสุด ฿50,000', 'ติดตามการขนส่งได้'],
          cta: 'จองการใช้บริการ',
        },
        {
          name: 'Other Provinces',
          fit: 'เหมาะกับลูกค้าส่งต่างจังหวัดแบบรายครั้ง',
          price: '฿5,900+',
          details: ['จ่ายต่อรอบ', 'ส่งภายในวันเดียว','จัดส่งครอบคลุมทั่วประเทศ'],
          features: ['ค่าชดเชยความเสียหายสูงสุด ฿50,000', 'ติดตามการขนส่งได้'],
          cta: 'จองการใช้บริการ',
        },
        {
          name: '5 Delivery',
          badge: 'MOST POPULAR',
          highlight: true,
          fit: 'เหมาะกับธุรกิจที่ส่งของมูลค่าสูงรายเดือน',
          price: '฿3,900+',
          unit: '/เดือน',
          details: ['ใช้ได้ 5 รอบ/เดือน', 'ส่งภายในวันเดียว', 'ส่งในกทม. และปริมณฑล'],
          features: ['ค่าชดเชยความเสียหายสูงสุด ฿50,000', 'ติดตามการขนส่งได้'],
          cta: 'จองการใช้บริการ',
        },
        {
          name: 'Exclusive',
          fit: 'เหมาะกับทีมที่มีงานส่งต่อเนื่องจำนวนมาก',
          priceText: 'ติดต่อพนักงาน',
          priceTone: 'contact',
          details: ['การส่ง/เดือน ไม่จำกัด', 'ราคาตามตกลง', 'ส่งภายในวันเดียว','จัดส่งครอบคลุมทั่วประเทศ'],
          features: ['ค่าชดเชยความเสียหายตามตกลง', 'ติดตามการขนส่งได้'],
          cta: 'จองการใช้บริการ',
        },
      ]
    },
    services: {
      label: 'บริการของเรา',
      title: 'การจัดส่งสินค้ามูลค่าสูง\nต้องดูแลเป็นพิเศษ',
      items: [
        { title: 'นาฬิกาหรู', desc: 'แพ็กกันกระแทก ถ่ายรูปสภาพก่อนส่ง และส่งมอบอย่างระมัดระวัง ทั้งเรือนเดียว คอลเลกชัน หรือส่งเข้าศูนย์บริการ' },
        { title: 'งานศิลปะ', desc: 'ดูแลภาพวาด รูปปั้น งานกรอบ และชิ้นงานเปราะบางแบบส่งตรงถึงที่ พร้อมการรับและส่งมอบอย่างระมัดระวัง' },
        { title: 'ของสะสม', desc: 'ขนส่งหนังสือหายาก รุ่นลิมิเต็ด ของสะสม และชิ้นจัดแสดงที่ต้องดูแลเฉพาะทาง พร้อมหลักฐานการส่งมอบ' },
        { title: 'อัญมณี', desc: 'ส่งเพชร พลอย อัญมณีแยกเม็ด และหินมีใบรับรอง ระหว่างบ้าน ร้าน ธนาคาร หรือโชว์รูมอย่างปลอดภัย' },
        { title: 'ทอง', desc: 'ส่งทองคำแท่ง เครื่องประดับทอง โลหะมีค่า และสินทรัพย์ประเภททองแบบเป็นส่วนตัว พร้อมยืนยันผู้รับปลายทาง' },
        { title: 'แฟชั่นลักชัวรี', desc: 'ขนส่งกระเป๋า เสื้อผ้า และรองเท้าแบรนด์เนม ด้วยการแพ็กที่ช่วยป้องกันรอยและรักษาทรงจนถึงมือผู้รับ' },
        { title: 'เอกสารลับ', desc: 'ส่งโฉนด พาสปอร์ต สัญญา เช็คเงินสด และเอกสารลับแบบส่งถึงมือ พร้อมติดตามสถานะและหลักฐานส่งมอบ' },
        { title: 'แกดเจ็ต', desc: 'จัดส่งกล้อง เลนส์ โดรน แท็บเล็ต และอุปกรณ์พรีเมียม ด้วยแพ็กเกจจิ้งป้องกันแรงสั่นสะเทือน' },
        { title: 'ไอที', desc: 'ขนส่ง MacBook แล็ปท็อป เซิร์ฟเวอร์ อุปกรณ์จัดเก็บข้อมูล และฮาร์ดแวร์สำนักงานที่ต้องการการปกป้องเป็นพิเศษ' },
        { title: 'อื่นๆ', desc: 'บริการสำหรับสินค้าอื่นที่ไม่อยู่ในรายการ แต่ต้องการการดูแลพิเศษ วางแผนการรับส่งเป็นรายเคส' },
      ]
    },
    why: {
      label: 'ทำไมต้อง Conrad Express',
      title: 'มีประสบการณ์ยาวนาน\nด้านการส่งของมูลค่าสูง',
      items: [
        { num: '08', label: 'ปีที่ส่งของหรูมาแล้ว' },
        { num: '99.8%', label: 'อัตราส่งตรงเวลา' },
        { num: '10K+', label: 'ส่งพัสดุให้ลูกค้าสำเร็จ' },
        { num: '77', label: 'จังหวัดทั่วไทย' },
      ]
    },
    process: {
      label: 'ขั้นตอนการทำงาน',
      title: 'เริ่มต้นไม่ยุ่งยาก\nตั้งแต่ต้นจนจบ',
      steps: [
        { n: '01', title: 'คุยกับเรา', desc: 'เราคุยกับคุณเรื่องของที่จะส่ง ปลายทาง และวิธีดูแลให้ปลอดภัย' },
        { n: '02', title: 'มารับของ', desc: 'ทีมงานไปรับถึงที่ พร้อมอุปกรณ์แพ็กของให้เรียบร้อย' },
        { n: '03', title: 'กำลังส่ง', desc: 'ตามดูตำแหน่งแบบเรียลไทม์ และอัปเดตสถานะให้ตลอดทาง' },
        { n: '04', title: 'ส่งถึงมือ', desc: 'เช็กตัวผู้รับ ตรวจของ และยืนยันการส่งด้วยหลักฐานดิจิทัล' },
      ]
    },
    testimonials: {
      label: 'กลุ่มลูกค้า',
      title: 'ลูกค้าที่ได้รับบริการจากเรา',
      items: [
        { quote: 'ทุกขั้นตอนทำได้ละเอียดและใส่ใจมาก Conrad Express ต่างจากบริการส่งของที่ผมเคยใช้มาทั้งหมด', author: 'นาย James H.', role: 'นักธุรกิจ, ลอนดอน' },
        { quote: 'เครื่องประดับของฉันถูกถ่ายรูป ห่อ และส่งถึงแบบไม่ต้องห่วงเลย ชอบที่ถ่ายรูปสภาพของก่อนส่งมาก', author: 'คุณอริสา ว.', role: 'นักสะสมส่วนตัว กรุงเทพฯ' },
        { quote: 'ย้ายนาฬิกาชุดใหญ่ระหว่างตู้เซฟได้เรียบร้อย แค่เอกสารอย่างเดียวก็คุ้มที่เลือก Conrad Express แล้ว', author: 'คุณภัทรพงษ์ น.', role: 'ผู้อำนวยการฝ่ายลงทุน สิงคโปร์' },
        { quote: 'บริการเดียวที่ฉันไว้ใจให้ส่งของจากแกลเลอรีข้ามประเทศ ที่นี่ดูแลดีจริง ไม่ใช่แค่พูด', author: 'ดร.สุภาพร ล.', role: 'ผู้ค้างานศิลปะ เชียงใหม่' },
        { quote: 'Conrad Express ดูแลคอลเลกชัน Patek Philippe ของผมอย่างดีเหมือนที่ผมรักมัน ดีตั้งแต่โทรครั้งแรกจนส่งถึงบ้าน', author: 'คุณวันชัย ท.', role: 'นักสะสมส่วนตัว กรุงเทพฯ' },
      ]
    },
    contact: {
      label: 'ติดต่อเรา',
      title: 'เริ่มส่งของ\nกับเราเลย',
      sub: 'เราพร้อมช่วยคุณ จันทร์–เสาร์ 9:00–18:00 น.\nถ้าด่วน โทรสายด่วนได้ตลอด 24 ชั่วโมง',
      fields: { name: 'ชื่อ-นามสกุล', phone: 'หมายเลขโทรศัพท์', type: 'ประเภทการจัดส่ง', message: 'บอกเราเกี่ยวกับสินค้าของคุณ', cta: 'ส่งคำขอ' },
      types: ['อื่นๆ'],
    },
    footer: {
      tagline: 'แม่นยำ · ใส่ใจ · ส่งถึงมือ',
      links: ['นโยบายความเป็นส่วนตัว', 'ข้อกำหนดการใช้บริการ', 'นโยบายประกันภัย'],
      copy: '© 2026 Conrad Express บริษัทในเครือ Conrad Time',
      line: '@ConradExpress',
      tel: '+66 2 016 9950',
    },
    pillars: {
      label: 'มาตรฐานของเรา',
      title: 'สี่สิ่งที่เรา\nสัญญากับคุณ',
      items: [
        { icon: 'privacy', title: 'ความเป็นส่วนตัว', sub: 'ป้องกันข้อมูลการส่ง', desc: 'ทุกการส่งเก็บเป็นความลับ ไม่เปิดเผยรายละเอียด' },
        { icon: 'time', title: 'ตรงเวลาเสมอ', sub: 'ส่งตรงเวลา 99.8%', desc: 'ตรงเวลาทุกครั้ง เราใส่ใจเวลาของคุณเท่ากับของที่ส่ง' },
        { icon: 'expert', title: 'มืออาชีพดูแล', sub: 'ดูแลของหรูมา 8 ปี', desc: 'ทีมงานมืออาชีพ รู้จักของมูลค่าสูงและวิธีดูแลให้ปลอดภัย' },
        { icon: 'coverage', title: 'ครอบคลุมทั่วประเทศ', sub: 'ครบ 77 จังหวัด', desc: 'ส่งถึงหน้าประตูอย่างปลอดภัยทุกที่ในไทย ทั้งในเมืองและต่างจังหวัด' },
        { icon: 'tracking', title: 'ติดตามสถานะทุกขั้นตอน', sub: 'ถ่ายรูป+ยืนยันทุกขั้น', desc: 'มีการติดตามพัสดุด้วย GPS อัปเดตสถานะตั้งแต่ต้นทางถึงปลายทาง' },
        { icon: 'accountable', title: 'รับผิดชอบทุกการส่ง', sub: 'ส่งแล้วกว่า 10K+ ชิ้น', desc: 'ปัญหาใดๆ ระหว่างการจัดส่ง ทีมงานของเราจะร่วมมืออย่างใกล้ชิดเพื่อแก้ไขปัญหา' },
      ]
    },
    misc: {
      howItWorks: 'ขั้นตอนการทำงาน',
    }
  }
};

  window.CONRAD_EXPRESS_COPY = COPY;
})();
