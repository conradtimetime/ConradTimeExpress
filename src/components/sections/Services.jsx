(function () {
  const { useState } = React;
  const { CardSwiper } = window;

/* ── SERVICES ── */
function Services({ c, gold, navy }) {
  const [hovered, setHovered] = useState(null);
  return (
    <section id="services" style={{ background:'#fff', padding:'120px 96px',
      boxShadow:'inset 0 -1px 0 rgba(184,151,106,0.12), inset 0 1px 0 rgba(184,151,106,0.08)' }}>
      <div style={{ maxWidth:'1400px', margin:'0 auto' }}>
        <div className="reveal" style={{ marginBottom:'72px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
            <div style={{ width:'40px', height:'1px', background:gold }} />
            <span style={{ fontSize:'11px', letterSpacing:'0.25em', color:gold, fontFamily:'Jost', fontWeight:400 }}>
              {c.services.label.toUpperCase()}
            </span>
          </div>
          <h2 style={{
            fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(40px, 5vw, 64px)',
            fontWeight:300, color:navy, lineHeight:1.1, whiteSpace:'pre-line',
          }}>{c.services.title}</h2>
        </div>

        <CardSwiper className="g-2 swipe" style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'2px' }}>
          {c.services.items.map((s, i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding:'52px 48px', cursor:'default',
                background: hovered === i ? navy : 'var(--cream)',
                transition:'all 0.4s ease',
                borderLeft: hovered === i ? `3px solid ${gold}` : '3px solid transparent',
                boxShadow: hovered === i ? `0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)` : '0 1px 0 rgba(255,255,255,0.8) inset, 0 1px 4px rgba(0,0,0,0.04)',
              }}>
              <div style={{
                fontSize:'11px', letterSpacing:'0.2em', color: hovered===i ? gold : 'rgba(15,30,53,0.35)',
                fontFamily:'Jost', marginBottom:'20px', transition:'color 0.3s',
              }}>0{i+1}</div>
              <h3 style={{
                fontFamily:'Cormorant Garamond, serif', fontSize:'28px', fontWeight:400,
                color: hovered===i ? '#fff' : navy, marginBottom:'16px', transition:'color 0.3s',
              }}>{s.title}</h3>
              <p style={{
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
