(function () {
  const { useState } = React;
  const { CardSwiper } = window;

/* ── SERVICES ── */
function Services({ c, gold, navy }) {
  const [hovered, setHovered] = useState(null);
  return (
    <section id="services" className="services-section" style={{
      background:'#fff',
      padding:'96px 96px 72px',
      minHeight:'100vh',
      height:'100vh',
      boxSizing:'border-box',
      display:'flex',
      alignItems:'center',
      boxShadow:'inset 0 -1px 0 rgba(184,151,106,0.12), inset 0 1px 0 rgba(184,151,106,0.08)',
      overflow:'hidden',
    }}>
      <style>{`
        #services.services-section { padding:96px 96px 72px !important; }
        #services .services-kicker { margin-bottom:20px !important; }
        #services .services-heading { margin-bottom:60px !important; }
        #services .service-card { padding:44px 42px !important; }
        @media (max-width:1440px) {
          #services.services-section { padding:92px 64px 64px !important; }
          #services .services-heading { margin-bottom:52px !important; }
          #services .service-card { padding:40px 38px !important; }
        }
        @media (max-height:820px) and (min-width:768px) {
          #services.services-section { padding:84px 64px 38px !important; }
          #services .services-heading { margin-bottom:36px !important; }
          #services .services-title { font-size:clamp(38px, 5vw, 54px) !important; }
          #services .service-card { padding:28px 36px !important; }
          #services .service-number { margin-bottom:10px !important; }
          #services .service-title { font-size:25px !important; margin-bottom:9px !important; }
          #services .service-copy { font-size:13px !important; line-height:1.55 !important; }
        }
        @media (max-width:1024px) {
          #services.services-section {
            height:auto !important;
            min-height:100vh !important;
            padding:88px 40px 72px !important;
            overflow:visible !important;
          }
        }
        @media (max-width:767px) {
          #services.services-section { padding:72px 22px 58px !important; }
          #services .services-heading { margin-bottom:38px !important; }
          #services .services-title { font-size:clamp(40px, 12vw, 54px) !important; }
          #services .service-card { padding:32px 28px !important; }
        }
      `}</style>
      <div style={{ width:'100%', maxWidth:'1400px', margin:'0 auto' }}>
        <div className="reveal services-heading" style={{ marginBottom:'60px' }}>
          <div className="services-kicker" style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
            <div style={{ width:'40px', height:'1px', background:gold }} />
            <span style={{ fontSize:'11px', letterSpacing:'0.25em', color:gold, fontFamily:'Jost', fontWeight:400 }}>
              {c.services.label.toUpperCase()}
            </span>
          </div>
          <h2 className="services-title" style={{
            fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(40px, 5vw, 64px)',
            fontWeight:300, color:navy, lineHeight:1.1, whiteSpace:'pre-line',
          }}>{c.services.title}</h2>
        </div>

        <CardSwiper className="g-2 swipe" style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'2px' }}>
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
