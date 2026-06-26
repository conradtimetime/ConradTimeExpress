(function () {
  const { useState } = React;
  const { CardSwiper, SectionEyebrow } = window;

/* ── SERVICES ── */
function Services({ c, gold, navy }) {
  const [hovered, setHovered] = useState(null);
  return (
    <section id="services" className="services-section" style={{
      background:'#fff',
      padding:'88px 96px 76px',
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
          padding:88px 96px 76px !important;
          min-height:calc(100vh - 72px) !important;
        }
        #services .services-inner { max-width:1450px !important; }
        #services .services-kicker { margin-bottom:18px !important; }
        #services .services-heading { margin-bottom:44px !important; }
        #services .services-sub { margin-top:20px !important; }
        #services .service-card {
          padding:36px 40px !important;
          min-height:224px;
          display:flex;
          flex-direction:column;
        }
        #services .service-number { margin-bottom:14px !important; }
        #services .service-title { margin-bottom:12px !important; }
        #services .service-copy { line-height:1.62 !important; }
        @media (max-width:1440px) {
          #services.services-section { padding:72px 64px 58px !important; }
          #services .services-heading { margin-bottom:36px !important; }
          #services .services-title { font-size:clamp(38px, 4.2vw, 56px) !important; }
          #services .services-sub { font-size:13.2px !important; line-height:1.68 !important; max-width:760px !important; }
          #services .service-card { padding:30px 32px !important; min-height:214px; }
          #services .service-title { font-size:25px !important; }
          #services .service-copy { font-size:12.8px !important; line-height:1.55 !important; }
        }
        @media (max-height:820px) and (min-width:768px) {
          #services.services-section { padding:54px 64px 40px !important; }
          #services .services-heading { margin-bottom:28px !important; }
          #services .services-kicker { margin-bottom:14px !important; }
          #services .services-title { font-size:clamp(34px, 4.2vw, 48px) !important; }
          #services .services-sub { margin-top:14px !important; font-size:12.2px !important; line-height:1.52 !important; max-width:720px !important; }
          #services .service-card { padding:24px 28px !important; min-height:190px; }
          #services .service-number { margin-bottom:8px !important; }
          #services .service-title { font-size:23px !important; margin-bottom:8px !important; }
          #services .service-copy { font-size:12.2px !important; line-height:1.45 !important; }
        }
        @media (max-width:1024px) {
          #services.services-section {
            min-height:auto !important;
            padding:88px 40px 72px !important;
            overflow:visible !important;
          }
          #services .services-sub { max-width:640px !important; }
        }
        @media (max-width:767px) {
          #services.services-section { padding:72px 22px 58px !important; }
          #services .services-heading { margin-bottom:38px !important; }
          #services .services-title { font-size:clamp(40px, 12vw, 54px) !important; }
          #services .services-sub { font-size:13px !important; line-height:1.65 !important; }
          #services .service-card { padding:32px 28px !important; min-height:auto; }
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

        <CardSwiper className="services-grid g-2 swipe" style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'2px' }}>
          {c.services.items.map((s, i) => (
            <div key={i}
              className="service-card"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding:'44px 42px', cursor:'default',
                background: hovered === i ? navy : 'var(--cream)',
                transition:'all 0.4s ease',
                borderLeft: hovered === i ? `3px solid ${gold}` : '3px solid transparent',
                boxShadow: hovered === i ? `0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)` : '0 1px 0 rgba(255,255,255,0.8) inset, 0 1px 4px rgba(0,0,0,0.04)',
              }}>
              <div className="service-number" style={{
                fontSize:'11px', letterSpacing:'0.2em', color: hovered===i ? gold : 'rgba(15,30,53,0.35)',
                fontFamily:'Jost', marginBottom:'20px', transition:'color 0.3s',
              }}>0{i+1}</div>
              <h3 className="service-title" style={{
                fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:400,
                color: hovered===i ? '#fff' : navy, marginBottom:'16px', transition:'color 0.3s',
              }}>{s.title}</h3>
              <p className="service-copy" style={{
                fontSize:'14px', lineHeight:1.8, fontWeight:300,
                color: hovered===i ? 'rgba(255,255,255,0.65)' : 'rgba(15,30,53,0.6)',
                fontFamily:'Jost', transition:'color 0.3s',
              }}>{s.desc}</p>
            </div>
          ))}
        </CardSwiper>
      </div>
    </section>
  );
}


  window.Services = Services;
})();
