(function () {
  const { useState } = React;
  const { SectionEyebrow } = window;

  const serviceImages = [
    'brand-images/service-card-watch.jpg',
    'brand-images/service-card-packaging.jpg',
    'brand-images/service-card-hero.jpg',
    'brand-images/service-card-hero.jpg',
    'brand-images/service-card-packaging.jpg',
    'brand-images/service-card-delivery.jpg',
  ];

  const serviceImagePositions = ['center 44%', 'center 54%', 'left center', 'left center', 'center 48%', 'center 52%'];

  /* On-brand line icon per category — shows until a photo is added. */
  const ServiceIcon = (i, gold) => {
    const p = { fill: 'none', stroke: gold, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
    const icons = [
      (<g {...p}><circle cx="32" cy="32" r="15" /><path d="M32 24v8l6 4" /><path d="M26 16l1.5-6h9l1.5 6M26 48l1.5 6h9l1.5-6" /></g>),
      (<g {...p}><rect x="15" y="16" width="34" height="32" rx="2" /><path d="M15 40l9-9 6 6 7-8 12 12" /><circle cx="40" cy="25" r="2.5" /></g>),
      (<g {...p}><path d="M22 20h20l8 9-18 19-18-19z" /><path d="M16 29h32M32 48L22 29M32 48l10-19M28 29l4-9 4 9" /></g>),
      (<g {...p}><path d="M20 27h24l3 24H17z" /><path d="M25 27c0-5 3-9 7-9s7 4 7 9" /><path d="M23 36h18M25 43h14" /></g>),
      (<g {...p}><path d="M19 15h21l7 7v27H19z" /><path d="M40 15v8h7" /><path d="M25 30h16M25 37h16M25 44h10" /></g>),
      (<g {...p}><rect x="16" y="23" width="32" height="24" rx="3" /><path d="M24 23l3-6h10l3 6" /><circle cx="32" cy="35" r="7" /><circle cx="45" cy="28" r="1.5" /></g>),
    ];
    return (
      <svg width="62" height="62" viewBox="0 0 64 64" style={{ opacity: 0.5 }}>{icons[i] || icons[0]}</svg>
    );
  };

/* ── SERVICES ── */
function Services({ c, gold, navy }) {
  const [activeService, setActiveService] = useState(null);
  const movingServices = [...c.services.items, ...c.services.items].map((service, index) => ({
    ...service,
    baseIndex: index % c.services.items.length,
    loopIndex: index,
  }));

  return (
    <section id="services" className="services-section" style={{
      background:'#fff',
      padding:'86px 0 76px',
      minHeight:'calc(100vh - 72px)',
      boxSizing:'border-box',
      display:'flex',
      alignItems:'center',
      scrollMarginTop:'72px',
      boxShadow:'inset 0 -1px 0 rgba(184,151,106,0.12), inset 0 1px 0 rgba(184,151,106,0.08)',
      overflow:'hidden',
    }}>
      <style>{`
        #services.services-section {
          padding:86px 0 76px !important;
          min-height:calc(100vh - 72px) !important;
        }
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

        @keyframes servicesMoveRight {
          from { transform:translate3d(calc(-50% - 9px), 0, 0); }
          to { transform:translate3d(0, 0, 0); }
        }

        #services .services-marquee {
          position:relative;
          width:100%;
          overflow:hidden;
          padding:0 0 10px;
        }

        #services .services-marquee::before,
        #services .services-marquee::after {
          content:'';
          position:absolute;
          top:0;
          bottom:0;
          width:9vw;
          min-width:72px;
          z-index:7;
          pointer-events:none;
        }

        #services .services-marquee::before {
          left:0;
          background:linear-gradient(to right, #fff 0%, rgba(255,255,255,0) 100%);
        }

        #services .services-marquee::after {
          right:0;
          background:linear-gradient(to left, #fff 0%, rgba(255,255,255,0) 100%);
        }

        #services .services-track {
          display:flex;
          width:max-content;
          gap:18px;
          animation:servicesMoveRight 32s linear infinite;
          transform:translate3d(0, 0, 0);
          backface-visibility:hidden;
          will-change:transform;
          contain:layout paint style;
        }

        #services .services-marquee:hover .services-track {
          animation-play-state:paused;
        }

        #services .services-marquee:focus-within .services-track {
          animation-play-state:paused;
        }

        #services .service-card {
          position:relative;
          flex:0 0 clamp(330px, 31vw, 470px);
          aspect-ratio:1 / 1.08;
          min-height:0;
          overflow:hidden;
          background:#0f1e35;
          border:1px solid rgba(184,151,106,0.28);
          box-shadow:0 10px 24px rgba(15,30,53,0.12);
          cursor:pointer;
          isolation:isolate;
          transition:transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
        }

        #services .service-card:hover {
          transform:translate3d(0, -5px, 0);
          border-color:rgba(184,151,106,0.68);
          box-shadow:0 16px 32px rgba(15,30,53,0.18);
        }

        #services .service-card:focus {
          outline:1px solid rgba(184,151,106,0.72);
          outline-offset:4px;
        }

        #services .service-photo {
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
          transition:transform 0.45s ease;
          z-index:1;
        }

        #services .service-card:hover .service-photo {
          transform:scale(1.045);
        }

        #services .service-fallback {
          position:absolute;
          inset:0;
          display:flex;
          align-items:center;
          justify-content:center;
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
          inset:18px;
          border:1px solid rgba(184,151,106,0.38);
          z-index:3;
          pointer-events:none;
        }

        #services .service-frame::before,
        #services .service-frame::after {
          content:'';
          position:absolute;
          width:44px;
          height:44px;
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
          left:30px;
          right:30px;
          bottom:30px;
          z-index:4;
          color:#fff;
        }

        #services .service-title {
          font-family:'Cormorant Garamond', serif;
          font-size:clamp(31px, 2.6vw, 42px);
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
          font-size:13.2px;
          line-height:1.62;
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
          max-height:260px;
          opacity:1;
          transform:translateY(0);
        }

        #services .service-icon-mark {
          position:absolute;
          right:30px;
          top:28px;
          z-index:4;
          opacity:0.82;
          transform:scale(0.82);
          transform-origin:top right;
        }

        @media (prefers-reduced-motion: reduce) {
          #services .services-track {
            animation:none;
            transform:none;
          }
          #services .service-card,
          #services .service-photo {
            transition:none;
          }
        }
        @media (max-width:1440px) {
          #services.services-section { padding:72px 0 58px !important; }
          #services .services-heading {
            padding-left:64px !important;
            padding-right:64px !important;
          }
          #services .services-heading { margin-bottom:36px !important; }
          #services .services-title { font-size:clamp(38px, 4.2vw, 56px) !important; }
          #services .services-sub { font-size:13.2px !important; line-height:1.68 !important; max-width:760px !important; }
          #services .service-card { flex-basis:clamp(310px, 32vw, 420px); }
          #services .service-copy { font-size:12.8px !important; line-height:1.56 !important; }
        }
        @media (max-height:820px) and (min-width:768px) {
          #services.services-section { padding:54px 0 40px !important; }
          #services .services-heading { margin-bottom:28px !important; }
          #services .services-kicker { margin-bottom:14px !important; }
          #services .services-title { font-size:clamp(34px, 4.2vw, 48px) !important; }
          #services .services-sub { margin-top:14px !important; font-size:12.2px !important; line-height:1.52 !important; max-width:720px !important; }
          #services .service-card { flex-basis:clamp(290px, 30vw, 380px); aspect-ratio:1 / 0.98; }
          #services .service-content { left:26px; right:26px; bottom:24px; }
          #services .service-title { font-size:clamp(28px, 2.4vw, 34px) !important; margin-bottom:10px !important; }
          #services .service-copy { font-size:12px !important; line-height:1.42 !important; }
        }
        @media (max-width:1024px) {
          #services.services-section {
            min-height:auto !important;
            padding:88px 0 72px !important;
            overflow:hidden !important;
          }
          #services .services-heading {
            padding-left:40px !important;
            padding-right:40px !important;
          }
          #services .services-sub { max-width:640px !important; }
          #services .services-marquee {
            overflow:visible;
            padding:0 40px 10px;
          }
          #services .services-marquee::before,
          #services .services-marquee::after {
            display:none;
          }
          #services .services-track {
            width:100%;
            display:grid;
            grid-template-columns:repeat(2, minmax(0, 1fr));
            gap:16px;
            animation:none !important;
            transform:none !important;
            contain:none;
            will-change:auto;
          }
          #services .service-card.is-duplicate {
            display:none;
          }
          #services .service-card {
            width:100%;
            flex:none;
            aspect-ratio:1 / 1.05;
          }
        }
        @media (max-width:767px) {
          #services.services-section { padding:72px 0 58px !important; }
          #services .services-heading {
            padding-left:22px !important;
            padding-right:22px !important;
          }
          #services .services-heading { margin-bottom:38px !important; }
          #services .services-title { font-size:clamp(40px, 12vw, 54px) !important; }
          #services .services-sub { font-size:13px !important; line-height:1.65 !important; }
          #services .services-marquee {
            padding:0 22px 10px;
          }
          #services .services-track {
            display:grid;
            grid-template-columns:1fr;
            gap:14px;
          }
          #services .service-card {
            width:100%;
            aspect-ratio:1 / 1.08;
          }
          #services .service-frame { inset:14px; }
          #services .service-icon-mark { right:24px; top:22px; transform:scale(0.72); }
          #services .service-content { left:24px; right:24px; bottom:24px; }
          #services .service-title { font-size:31px !important; }
          #services .service-copy { max-width:100%; font-size:12.4px !important; line-height:1.5 !important; }
        }
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
            {movingServices.map((s) => (
              <article key={`${s.title}-${s.loopIndex}`}
                className={`service-card${s.loopIndex >= c.services.items.length ? ' is-duplicate' : ''}${activeService === s.loopIndex ? ' is-active' : ''}`}
                tabIndex={s.loopIndex >= c.services.items.length ? '-1' : '0'}
                aria-hidden={s.loopIndex >= c.services.items.length ? 'true' : undefined}
                aria-expanded={s.loopIndex >= c.services.items.length ? undefined : activeService === s.loopIndex}
                aria-label={`${s.title}. ${s.desc}`}
                onClick={() => setActiveService(activeService === s.loopIndex ? null : s.loopIndex)}
                onFocus={() => setActiveService(s.loopIndex)}
                onBlur={() => setActiveService((current) => current === s.loopIndex ? null : current)}>
                <div className="service-fallback">
                  {ServiceIcon(s.baseIndex, gold)}
                </div>
                <img
                  className="service-photo"
                  src={serviceImages[s.baseIndex]}
                  alt={s.title}
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; }}
                  style={{ objectPosition:serviceImagePositions[s.baseIndex] || 'center center' }}
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
      </div>
    </section>
  );
}


  window.Services = Services;
})();
