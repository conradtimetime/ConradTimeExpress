(function () {
  const { useState } = React;
  const { SectionEyebrow, SectionCta, SECTION_FRAME, getSectionFrameStyle, getSectionFrameCss } = window;

  const serviceImages = [
    'brand-images/services/luxury-watches.jpg',
    'brand-images/services/art-collectibles.jpg',
    'brand-images/services/art-collectibles.jpg',
    'brand-images/services/jewellery-gems.jpg',
    'brand-images/services/jewellery-gems.jpg',
    'brand-images/services/luxury-fashion.jpg',
    'brand-images/services/confidential-documents.jpg',
    'brand-images/services/gadgets-it.jpg',
    'brand-images/services/gadgets-it.jpg',
    'brand-images/services/nationwide-same-day.jpg',
  ];

  const serviceImagePositions = ['center center', 'center center', 'center center', 'center center', 'center center', 'center center', 'center center', 'center center', 'center center', 'center center'];

  /* On-brand line icon per category — shows until a photo is added. */
  const ServiceIcon = (i, gold) => {
    const p = { fill: 'none', stroke: gold, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
    const icons = [
      (<g {...p}><circle cx="32" cy="32" r="15" /><path d="M32 24v8l6 4" /><path d="M26 16l1.5-6h9l1.5 6M26 48l1.5 6h9l1.5-6" /></g>),
      (<g {...p}><rect x="15" y="16" width="34" height="32" rx="2" /><path d="M15 40l9-9 6 6 7-8 12 12" /><circle cx="40" cy="25" r="2.5" /></g>),
      (<g {...p}><rect x="17" y="20" width="30" height="28" rx="3" /><path d="M23 20v-4h18v4" /><path d="M22 31h20M22 38h15" /><circle cx="44" cy="44" r="5" /></g>),
      (<g {...p}><path d="M22 20h20l8 9-18 19-18-19z" /><path d="M16 29h32M32 48L22 29M32 48l10-19M28 29l4-9 4 9" /></g>),
      (<g {...p}><path d="M20 26h24v22H20z" /><path d="M24 20h16l4 6H20z" /><path d="M24 33h16M24 39h16M24 45h16" /></g>),
      (<g {...p}><path d="M20 27h24l3 24H17z" /><path d="M25 27c0-5 3-9 7-9s7 4 7 9" /><path d="M23 36h18M25 43h14" /></g>),
      (<g {...p}><path d="M19 15h21l7 7v27H19z" /><path d="M40 15v8h7" /><path d="M25 30h16M25 37h16M25 44h10" /></g>),
      (<g {...p}><rect x="16" y="23" width="32" height="24" rx="3" /><path d="M24 23l3-6h10l3 6" /><circle cx="32" cy="35" r="7" /><circle cx="45" cy="28" r="1.5" /></g>),
      (<g {...p}><rect x="17" y="20" width="30" height="24" rx="3" /><path d="M22 44h20M27 50h10" /><path d="M23 27h18M23 34h18" /><circle cx="43" cy="23" r="2" /></g>),
      (<g {...p}><path d="M16 45c8-14 24-14 32-28" /><path d="M18 45h28" /><path d="M46 17l3 10-10-3" /><circle cx="18" cy="45" r="4" /><circle cx="46" cy="17" r="4" /></g>),
    ];
    const icon = icons[i % icons.length] || icons[0];
    return (
      <svg width="58" height="58" viewBox="0 0 64 64" style={{ opacity: 0.5 }}>{icon}</svg>
    );
  };

/* ── SERVICES ── */
function Services({ c, gold, navy }) {
  const [activeService, setActiveService] = useState(null);
  const serviceCards = c.services.items.map((service, index) => ({
    ...service,
    baseIndex: index,
    assetIndex: index % serviceImages.length,
  }));

  return (
    <section id="services" className="services-section" style={getSectionFrameStyle({
      background:'#fff',
      padding:SECTION_FRAME.padding.fullBleed.desktop,
      display:'flex',
      alignItems:'center',
      boxShadow:'inset 0 -1px 0 rgba(226,181,111,0.12), inset 0 1px 0 rgba(226,181,111,0.08)',
      overflow:'hidden',
    })}>
      <style>{`
        #services .services-inner { max-width:100% !important; }
        #services .services-heading {
          max-width:1450px !important;
          margin-left:auto !important;
          margin-right:auto !important;
          padding-left:96px !important;
          padding-right:96px !important;
        }
        #services .services-kicker { margin-bottom:18px !important; }
        #services .services-heading { margin-bottom:44px !important; }
        #services .services-sub { margin-top:20px !important; }

        #services .services-marquee {
          position:relative;
          width:100%;
          overflow:visible;
          padding:0 72px 10px;
        }

        #services .services-track {
          display:grid;
          grid-template-columns:repeat(5, minmax(0, 1fr));
          width:100%;
          max-width:1320px;
          margin:0 auto;
          gap:14px;
          contain:layout paint style;
        }

        #services .service-card {
          position:relative;
          width:100%;
          aspect-ratio:1 / 0.92;
          min-height:0;
          overflow:hidden;
          background:#0f1e35;
          border:1px solid rgba(226,181,111,0.28);
          box-shadow:0 8px 18px rgba(15,30,53,0.1);
          cursor:pointer;
          isolation:isolate;
          contain:layout paint;
          transition:box-shadow 0.2s ease, border-color 0.2s ease;
        }

        #services .service-card:hover {
          border-color:rgba(226,181,111,0.68);
          box-shadow:0 10px 22px rgba(15,30,53,0.14);
        }

        #services .service-card:focus {
          outline:1px solid rgba(226,181,111,0.72);
          outline-offset:4px;
        }

        #services .service-photo {
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          z-index:1;
        }

        #services .service-fallback {
          position:absolute;
          inset:0;
          background:linear-gradient(135deg, #172741 0%, #08172d 100%);
          z-index:0;
        }

        #services .service-shade {
          position:absolute;
          inset:0;
          background:
            linear-gradient(to top, rgba(7,15,30,0.78) 0%, rgba(7,15,30,0.42) 34%, rgba(7,15,30,0.12) 68%, rgba(7,15,30,0.06) 100%),
            linear-gradient(135deg, rgba(15,30,53,0.42) 0%, rgba(15,30,53,0.03) 55%);
          z-index:2;
          pointer-events:none;
        }

        #services .service-shade::after {
          content:'';
          position:absolute;
          inset:0;
          background:
            linear-gradient(to top, rgba(7,15,30,0.92) 0%, rgba(7,15,30,0.76) 38%, rgba(7,15,30,0.22) 74%, rgba(7,15,30,0.1) 100%),
            linear-gradient(135deg, rgba(15,30,53,0.58) 0%, rgba(15,30,53,0.05) 55%);
          opacity:0;
          transition:opacity 0.26s ease;
        }

        #services .service-card:hover .service-shade::after,
        #services .service-card.is-active .service-shade::after,
        #services .service-card:focus .service-shade::after {
          opacity:1;
        }

        #services .service-frame {
          position:absolute;
          inset:15px;
          border:1px solid rgba(226,181,111,0.38);
          z-index:3;
          pointer-events:none;
        }

        #services .service-frame::before,
        #services .service-frame::after {
          content:'';
          position:absolute;
          width:34px;
          height:34px;
          border-color:${gold};
          opacity:0.78;
        }

        #services .service-frame::before {
          top:-1px;
          left:-1px;
          border-top:2px solid;
          border-left:2px solid;
        }

        #services .service-frame::after {
          right:-1px;
          bottom:-1px;
          border-right:2px solid;
          border-bottom:2px solid;
        }

        #services .service-content {
          position:absolute;
          left:24px;
          right:24px;
          bottom:24px;
          z-index:4;
          color:#fff;
        }

        #services .service-title {
          font-family:'Cormorant Garamond', serif;
          font-size:clamp(25px, 2.05vw, 32px);
          line-height:1.05;
          font-weight:400;
          color:#fff;
          margin:0;
          text-shadow:0 2px 18px rgba(0,0,0,0.55);
          transition:margin 0.26s ease;
        }

        #services .service-copy {
          font-family:Jost, sans-serif;
          max-width:92%;
          max-height:0;
          overflow:hidden;
          opacity:0;
          font-size:12px;
          line-height:1.5;
          font-weight:300;
          color:rgba(255,255,255,0.78);
          text-shadow:0 1px 10px rgba(0,0,0,0.55);
          transform:translateY(12px);
          transition:opacity 0.26s ease, max-height 0.32s ease, transform 0.26s ease;
        }

        #services .service-card:hover .service-title,
        #services .service-card.is-active .service-title,
        #services .service-card:focus .service-title {
          margin-bottom:14px;
        }

        #services .service-card:hover .service-copy,
        #services .service-card.is-active .service-copy,
        #services .service-card:focus .service-copy {
          max-height:190px;
          opacity:1;
          transform:translateY(0);
        }

        #services .service-icon-mark {
          position:absolute;
          right:24px;
          top:22px;
          z-index:4;
          opacity:0.82;
          transform:scale(0.72);
          transform-origin:top right;
        }

        #services .services-cta-row {
          display:flex;
          justify-content:center;
          margin-top:34px;
          padding:0 24px;
        }

        @media (max-width:1180px) {
          #services .services-track {
            grid-template-columns:repeat(4, minmax(0, 1fr));
          }
        }
        @media (prefers-reduced-motion: reduce) {
          #services .service-card,
          #services .service-photo {
            transition:none;
          }
        }
        @media (max-width:1440px) {
          #services .services-heading {
            padding-left:64px !important;
            padding-right:64px !important;
          }
          #services .services-heading { margin-bottom:36px !important; }
          #services .services-title { font-size:clamp(38px, 4.2vw, 56px) !important; }
          #services .services-sub { font-size:13.2px !important; line-height:1.68 !important; max-width:760px !important; }
          #services .services-marquee { padding-left:56px; padding-right:56px; }
          #services .service-copy { font-size:11.8px !important; line-height:1.46 !important; }
        }
        @media (max-height:820px) and (min-width:768px) {
          #services .services-heading { margin-bottom:28px !important; }
          #services .services-kicker { margin-bottom:14px !important; }
          #services .services-title { font-size:clamp(34px, 4.2vw, 48px) !important; }
          #services .services-sub { margin-top:14px !important; font-size:12.2px !important; line-height:1.52 !important; max-width:720px !important; }
          #services .service-card { aspect-ratio:1 / 0.86; }
          #services .service-content { left:22px; right:22px; bottom:21px; }
          #services .service-title { font-size:clamp(24px, 2.2vw, 29px) !important; margin-bottom:9px !important; }
          #services .service-copy { font-size:11.4px !important; line-height:1.38 !important; }
        }
        @media (max-width:1024px) {
          #services.services-section {
            overflow:hidden !important;
          }
          #services .services-heading {
            padding-left:40px !important;
            padding-right:40px !important;
          }
          #services .services-sub { max-width:640px !important; }
          #services .services-marquee {
            overflow-x:auto;
            overflow-y:visible;
            padding:0 40px 14px;
            scroll-snap-type:x mandatory;
            scroll-padding-left:40px;
            -webkit-overflow-scrolling:touch;
            overscroll-behavior-x:contain;
            scrollbar-width:thin;
            scrollbar-color:rgba(226,181,111,0.48) rgba(15,30,53,0.08);
          }
          #services .services-marquee::-webkit-scrollbar {
            height:6px;
          }
          #services .services-marquee::-webkit-scrollbar-track {
            background:rgba(15,30,53,0.08);
            border-radius:999px;
          }
          #services .services-marquee::-webkit-scrollbar-thumb {
            background:rgba(226,181,111,0.5);
            border-radius:999px;
          }
          #services .services-track {
            width:max-content;
            max-width:none;
            display:flex;
            gap:14px;
            contain:layout paint;
          }
          #services .service-card {
            width:auto;
            flex:0 0 calc((100vw - 82px) / 3);
            aspect-ratio:1 / 0.88;
            scroll-snap-align:start;
            scroll-snap-stop:always;
          }
        }
        @media (max-width:900px) {
          #services .service-card {
            flex-basis:calc((100vw - 68px) / 2);
          }
        }
        @media (max-width:767px) {
          #services .services-heading {
            padding-left:22px !important;
            padding-right:22px !important;
          }
          #services .services-heading { margin-bottom:38px !important; }
          #services .services-title { font-size:clamp(40px, 12vw, 54px) !important; }
          #services .services-sub { font-size:13px !important; line-height:1.65 !important; }
          #services .services-marquee {
            padding:0 22px 14px;
            scroll-padding-left:22px;
          }
          #services .services-cta-row { margin-top:28px; }
          #services .services-track {
            display:flex;
            gap:14px;
          }
          #services .service-card {
            width:auto;
            flex-basis:calc(100vw - 36px);
            aspect-ratio:1 / 0.86;
          }
          #services .service-frame { inset:13px; }
          #services .service-icon-mark { right:22px; top:20px; transform:scale(0.68); }
          #services .service-content { left:22px; right:22px; bottom:22px; }
          #services .service-title { font-size:28px !important; }
          #services .service-copy { max-width:100%; font-size:12px !important; line-height:1.46 !important; }
        }
        ${getSectionFrameCss('#services.services-section', { variant:'fullBleed' })}
      `}</style>
      <div className="services-inner" style={{ width:'100%', maxWidth:'1450px', margin:'0 auto' }}>
        <div className="reveal services-heading" style={{ marginBottom:'60px', textAlign:'center' }}>
          <SectionEyebrow label={c.services.label} gold={gold} centered className="services-kicker" />
          <h2 className="services-title" style={{
            fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(40px, 5vw, 64px)',
            fontWeight:300, color:navy, lineHeight:1.1, whiteSpace:'pre-line', margin:'0 auto',
          }}>{c.services.title}</h2>
          {c.services.sub && (
            <p className="services-sub" style={{
              margin:'20px auto 0', maxWidth:'780px',
              fontSize:'14px', lineHeight:1.75, fontWeight:300,
              color:'rgba(15,30,53,0.52)', fontFamily:'Jost',
            }}>{c.services.sub}</p>
          )}
        </div>

        <div className="services-marquee" aria-label={c.services.label}>
          <div className="services-track">
            {serviceCards.map((s, index) => (
              <article key={s.title}
                className={`service-card${activeService === index ? ' is-active' : ''}`}
                tabIndex="0"
                aria-expanded={activeService === index}
                aria-label={`${s.title}. ${s.desc}`}
                onClick={() => setActiveService(activeService === index ? null : index)}>
                <div className="service-fallback" />
                <img
                  className="service-photo"
                  src={serviceImages[s.assetIndex]}
                  alt={s.title}
                  loading={index < 5 ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={index < 5 ? 'high' : 'low'}
                  onError={(e) => { e.target.style.display = 'none'; }}
                  style={{ objectPosition:serviceImagePositions[s.assetIndex] || 'center center' }}
                />
                <div className="service-shade" />
                <div className="service-frame" />
                <div className="service-icon-mark">{ServiceIcon(s.baseIndex, gold)}</div>
                <div className="service-content">
                  <h3 className="service-title">{s.title}</h3>
                  <p className="service-copy">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="services-cta-row">
          <SectionCta label={c.nav.cta} gold={gold} navy={navy} />
        </div>
      </div>
    </section>
  );
}


  window.Services = Services;
})();
