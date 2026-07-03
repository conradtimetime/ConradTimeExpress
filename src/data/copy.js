(function () {
  "use strict";

const COPY = {
  en: {
    nav: { services: 'Services', about: 'About', process: 'Process', packages: 'Packages', contact: 'Contact', cta: 'Book a Service' },
    hero: {
      eyebrow: 'Conrad Time · Est. 2016',
      title: 'Conrad\nExpress',
      sub: 'Door-to-door delivery for high-value parcels, with complete peace of mind from over 8 years of experience and meticulous care at every step, so your assets reach their destination safely, on time, and professionally.',
      cta1: 'Book a Service',
      cta2: 'Learn More',
    },
    trust: ['Insurance from 50K+', 'Beyond standard delivery', 'Real-Time Tracking'],
    brands: {
      label: 'Trusted By',
      title: 'Brands That Trust Us',
      items: ['Aurélien', 'Monteverde', 'Valmont & Co.', 'House of Sévigné', 'Lantana', 'Belmont Rowe'],
    },
    pricing: { label: 'Starting from', price: '฿500', unit: '/ shipment', note: 'All plans include insurance and real-time tracking' },
    packages: {
      label: 'Service Packages',
      title: 'Pick the Plan\nThat Fits You',
      sub: '',
      priceRegions: [
        { label: 'Bangkok & vicinity' },
        { label: 'Other provinces' },
      ],
      items: [
        {
          name: 'Standard',
          cornerTag: { label: 'Promotion', tone: 'promo', position: 'right' },
          fit: 'Best for one-off shipments or first-time customers',
          price: '฿500',
          prices: [
            { label: 'Bangkok & vicinity', amount: '฿500', unit: '', original: '฿890' },
            { label: 'Other provinces', amount: '฿6,900', unit: '', original: '฿9,900' },
          ],
          details: ['Pay per trip', 'Same-day delivery'],
          features: ['Insured up to ฿50,000', 'Shipment tracking included'],
          cta: 'Choose This Plan',
        },
        {
          name: 'Silver',
          fit: 'Best for light monthly senders up to 10 trips',
          price: '฿4,005',
          prices: [
            { label: 'Bangkok & vicinity', amount: '฿4,005', unit: '/month' },
            { label: 'Other provinces', amount: '฿44,550', unit: '/month' },
          ],
          details: ['Up to 10 trips/month', '10% discount'],
          features: ['Insurance ฿50,000++ based on actual value', 'Same-day delivery', 'Shipment tracking included'],
          cta: 'Choose This Plan',
        },
        {
          name: 'Gold',
          badge: 'MOST POPULAR',
          highlight: true,
          fit: 'Best for frequent high-value deliveries',
          price: '฿11,350',
          prices: [
            { label: 'Bangkok & vicinity', amount: '฿11,350', unit: '/month' },
            { label: 'Other provinces', amount: '฿126,225', unit: '/month' },
          ],
          details: ['Up to 15 trips/month', '15% discount'],
          features: ['Insurance ฿50,000++ based on actual value', 'Same-day delivery', 'Shipment tracking included'],
          cta: 'Choose This Plan',
        },
        {
          name: 'Platinum',
          fit: 'Best for teams with ongoing high-volume shipments',
          price: '฿14,240',
          prices: [
            { label: 'Bangkok & vicinity', amount: '฿14,240', unit: '/month' },
            { label: 'Other provinces', amount: '฿158,400', unit: '/month' },
          ],
          details: ['Up to 20 trips/month', '20% discount'],
          features: ['Insurance ฿50,000++ based on actual value', 'Same-day delivery', 'Shipment tracking included'],
          cta: 'Choose This Plan',
        },
      ]
    },
    services: {
      label: 'Our Services',
      title: 'High-Value Shipment\nRequire Special Care',
      items: [
        { title: 'Luxury Watches', desc: 'We move watches in shock-proof packing, handle them gently, and photograph their condition before sending. Great for a single watch, a full collection, or a trip to the service centre.' },
        { title: 'Art & Collectibles', desc: 'Temperature-controlled transport with custom crates for sculptures, paintings, rare books, and art — museum-level care, door to door.' },
        { title: 'Jewellery & Gems', desc: 'Safe transport for diamond jewellery, gems, gold, and accessories — between shops, homes, safes, banks, and showrooms, tracked every step of the way.' },
        { title: 'Luxury Fashion', desc: 'Secure transport for luxury handbags, apparel, and shoes, protected from scratches and humidity with careful packing and suitable temperature control to preserve shape and condition until handover.' },
        { title: 'Confidential Documents', desc: 'Confidential delivery for private documents, land deeds, passports, purchase agreements, and cashier’s cheques, with real-time status tracking and secure hand delivery to the recipient.' },
        { title: 'Gadgets & IT', desc: 'Delivery for professional cameras, high-value lenses, cinema drones, MacBooks, iPads, and premium gadgets, using shock-resistant packing, secure car transport, or express motorcycle delivery with a locked rear box.' },
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
      label: 'Client Voices',
      title: 'What Our Customers Say',
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
      types: ['Watches & Jewellery', 'Art & Collectibles', 'Vault Transfer', 'International Express', 'Other'],
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
        { icon: 'privacy', title: 'Total Privacy', sub: 'Discreet, unmarked handling', desc: 'Every shipment stays private — no labels, no shared details, no exceptions.' },
        { icon: 'time', title: 'Always On Time', sub: '99.8% on-time delivery', desc: 'On time, every time. We treat your schedule with the same care as your goods.' },
        { icon: 'expert', title: 'Expert Handling', sub: '8 years with luxury goods', desc: 'A trained team that knows high-value items and exactly how to keep them safe.' },
        { icon: 'coverage', title: 'Nationwide Coverage', sub: 'All 77 provinces', desc: 'Secure door-to-door delivery anywhere in Thailand, city or province.' },
        { icon: 'tracking', title: 'Real-Time Tracking', sub: '10K+ parcels delivered', desc: 'Follow your shipment live by GPS with status updates from pickup to handover.' },
        { icon: 'accountable', title: 'Full Accountability', sub: 'Photographed & confirmed', desc: 'We track each item, record its condition, and confirm delivery — every time.' },
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
      sub: 'บริการจัดส่งพัสดุมูลค่าสูงแบบส่งตรงถึงมือ อุ่นใจขั้นสุดด้วยประสบการณ์มากกว่า 8 ปีและการดูแลอย่างพิถีพิถันทุกขั้นตอน เพื่อให้ทรัพย์สินของคุณถึงปลายทางอย่างปลอดภัยและตรงเวลาอย่างมืออาชีพ',
      cta1: 'จองการใช้บริการ',
      cta2: 'เรียนรู้เพิ่มเติม',
    },
    trust: ['ประกันภัยเริ่มต้น 50K+', 'บริการขนส่งที่เหนือกว่ามาตรฐานทั่วไป', 'ติดตามแบบเรียลไทม์'],
    brands: {
      label: 'ได้รับความไว้วางใจจาก',
      title: 'แบรนด์ที่ไว้วางใจเรา',
      items: ['Aurélien', 'Monteverde', 'Valmont & Co.', 'House of Sévigné', 'Lantana', 'Belmont Rowe'],
    },
    pricing: { label: 'เริ่มต้นที่', price: '฿500', unit: '/ การจัดส่ง', note: 'ทุกแพ็กเกจมีประกันและติดตามการขนส่งได้' },
    packages: {
      label: 'แพ็กเกจบริการ',
      title: 'เลือกแพ็กเกจที่ใช่สำหรับคุณ',
      sub: 'ทุกแพ็กเกจดูแลของอย่างดี มีประกันครบ และมีทีมงานคอยช่วยคุณ',
      priceRegions: [
        { label: 'กทม. & ปริมณฑล' },
        { label: 'ต่างจังหวัด' },
      ],
      items: [
        {
          name: 'Standard',
          cornerTag: { label: 'โปรโมชัน', tone: 'promo', position: 'right' },
          fit: 'เหมาะกับลูกค้าส่งครั้งเดียวหรือทดลองใช้',
          price: '฿500',
          prices: [
            { label: 'ราคา กทม. & ปริมณฑล', amount: '฿500', unit: '', original: '฿890' },
            { label: 'ราคา ต่างจังหวัด', amount: '฿6,900', unit: '', original: '฿9,900' },
          ],
          details: ['จ่ายต่อรอบ', 'ส่งภายในวันเดียว'],
          features: ['ประกันสูงสุด ฿50,000', 'ติดตามการขนส่งได้'],
          cta: 'เลือกแพ็กเกจนี้',
        },
        {
          name: 'Silver',
          fit: 'เหมาะกับลูกค้าส่งประจำเบาๆ ไม่เกิน 5 รอบ',
          price: '฿4,005',
          prices: [
            { label: 'ราคา กทม. & ปริมณฑล', amount: '฿4,005', unit: '/เดือน' },
            { label: 'ราคา ต่างจังหวัด', amount: '฿44,550', unit: '/เดือน' },
          ],
          details: ['สูงสุด 5 รอบ/เดือน', 'ส่วนลด 10%'],
          features: ['ประกัน ฿50,000++ ตามมูลค่าจริง', 'ส่งภายในวันเดียว', 'ติดตามการขนส่งได้'],
          cta: 'เลือกแพ็กเกจนี้',
        },
        {
          name: 'Gold',
          badge: 'MOST POPULAR',
          highlight: true,
          fit: 'เหมาะกับธุรกิจที่ส่งของมูลค่าสูงบ่อย',
          price: '฿11,350',
          prices: [
            { label: 'ราคา กทม. & ปริมณฑล', amount: '฿11,350', unit: '/เดือน' },
            { label: 'ราคา ต่างจังหวัด', amount: '฿126,225', unit: '/เดือน' },
          ],
          details: ['สูงสุด 15 รอบ/เดือน', 'ส่วนลด 15%'],
          features: ['ประกัน ฿50,000++ ตามมูลค่าจริง', 'ส่งภายในวันเดียว', 'ติดตามการขนส่งได้'],
          cta: 'เลือกแพ็กเกจนี้',
        },
        {
          name: 'Platinum',
          fit: 'เหมาะกับทีมที่มีงานส่งต่อเนื่องจำนวนมาก',
          price: '฿14,240',
          prices: [
            { label: 'ราคา กทม. & ปริมณฑล', amount: '฿14,240', unit: '/เดือน' },
            { label: 'ราคา ต่างจังหวัด', amount: '฿158,400', unit: '/เดือน' },
          ],
          details: ['สูงสุด 20 รอบ/เดือน', 'ส่วนลด 20%'],
          features: ['ประกัน ฿50,000++ ตามมูลค่าจริง', 'ส่งภายในวันเดียว', 'ติดตามการขนส่งได้'],
          cta: 'เลือกแพ็กเกจนี้',
        },
      ]
    },
    services: {
      label: 'บริการของเรา',
      title: 'การจัดส่งสินค้ามูลค่าสูง\nต้องดูแลเป็นพิเศษ',
      items: [
        { title: 'นาฬิกาหรู', desc: 'ส่งนาฬิกาด้วยกล่องกันกระแทก จับด้วยความระมัดระวัง และถ่ายรูปสภาพก่อนส่ง เหมาะทั้งนาฬิกาเรือนเดียว คอลเลกชันสะสม หรือส่งเข้าศูนย์บริการ' },
        { title: 'งานศิลปะและของสะสม', desc: 'ส่งในอุณหภูมิควบคุม พร้อมลังไม้ทำพิเศษ สำหรับรูปปั้น ภาพวาด หนังสือหายาก และงานศิลป์ ดูแลถึงที่' },
        { title: 'จิวเวลรี่และอัญมณี', desc: 'ส่งเครื่องประดับ เพชร พลอย ทอง และของมีค่า ระหว่างร้าน บ้าน ตู้เซฟ ธนาคาร หรือโชว์รูม ตามดูได้ทุกขั้นตอน' },
        { title: 'แฟชั่นลักชัวรี', desc: 'ขนส่งกระเป๋า เสื้อผ้า และรองเท้าแบรนด์เนมระดับลักชัวรี ป้องกันรอยขีดข่วนและความชื้นด้วยการแพ็กและควบคุมอุณหภูมิที่เหมาะสม เพื่อรักษาทรงและสภาพของสินค้าให้สมบูรณ์แบบที่สุดจนถึงมือผู้รับ' },
        { title: 'เอกสารสำคัญ', desc: 'บริการจัดส่งเอกสารลับ โฉนดที่ดิน พาสปอร์ต สัญญาซื้อขาย หรือเช็คเงินสด ที่ประเมินค่าไม่ได้ ด้วยระบบติดตามสถานะแบบเรียลไทม์ และการส่งมอบตรงถึงมือผู้รับอย่างปลอดภัย (Confidential & Express)' },
        { title: 'แกดเจ็ตและไอที', desc: 'จัดส่งกล้องถ่ายภาพระดับมืออาชีพ เลนส์ราคาสูง โดรนถ่ายภาพยนตร์ หรือ MacBook/iPad รุ่นท็อป แพ็กเกจจิ้งแน่นหนาป้องกันแรงสั่นสะเทือน จัดส่งด้วยรถยนต์เพื่อความปลอดภัย หรือส่งด่วนด้วยมอเตอร์ไซค์พร้อมกล่องท้ายนิรภัยล็อกมิดชิด' },
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
      label: 'เสียงจากลูกค้า',
      title: 'ลูกค้าพูดถึงเรายังไง',
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
      types: ['นาฬิกาและเครื่องประดับ', 'งานศิลปะและของสะสม', 'โอนย้ายระหว่างห้องนิรภัย', 'ด่วนระหว่างประเทศ', 'อื่นๆ'],
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
        { icon: 'privacy', title: 'เป็นความลับสุดๆ', sub: 'ดูแลแบบไม่ระบุตัวตน', desc: 'ทุกการส่งเป็นความลับ ไม่มีป้ายกำกับ ไม่เปิดเผยรายละเอียดให้ใครรู้' },
        { icon: 'time', title: 'ตรงเวลาเสมอ', sub: 'ส่งตรงเวลา 99.8%', desc: 'ตรงเวลาทุกครั้ง เราใส่ใจเวลาของคุณเท่ากับของที่ส่ง' },
        { icon: 'expert', title: 'มืออาชีพดูแล', sub: 'ดูแลของหรูมา 8 ปี', desc: 'ทีมงานมืออาชีพ รู้จักของมูลค่าสูงและวิธีดูแลให้ปลอดภัย' },
        { icon: 'coverage', title: 'ครอบคลุมทั่วประเทศ', sub: 'ครบ 77 จังหวัด', desc: 'ส่งถึงหน้าประตูอย่างปลอดภัยทุกที่ในไทย ทั้งในเมืองและต่างจังหวัด' },
        { icon: 'tracking', title: 'ติดตามแบบเรียลไทม์', sub: 'ส่งแล้วกว่า 10K+ ชิ้น', desc: 'ตามพัสดุแบบ live ด้วย GPS อัปเดตสถานะตั้งแต่รับจนถึงมือผู้รับ' },
        { icon: 'accountable', title: 'รับผิดชอบเต็มที่', sub: 'ถ่ายรูป+ยืนยันทุกขั้น', desc: 'ตามของทุกชิ้น บันทึกสภาพ และยืนยันการส่งให้ทุกครั้ง' },
      ]
    },
    misc: {
      howItWorks: 'ขั้นตอนการทำงาน',
    }
  }
};

  window.CONRAD_EXPRESS_COPY = COPY;
})();
