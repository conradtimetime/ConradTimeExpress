(function () {
  const { useState } = React;

/* ── PILLARS ── */
function Pillars({ c, gold, navy }) {
  const [hovered, setHovered] = useState(null);
  return (
    <section style={{ background:'var(--cream)', padding:'100px 96px' }}>
      <div style={{ maxWidth:'1400px', margin:'0 auto' }}>
        <div className="reveal" style={{ textAlign:'center', marginBottom:'64px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', marginBottom:'16px' }}>
            <div style={{ width:'40px', height:'1px', background:gold }} />
            <span style={{ fontSize:'11px', letterSpacing:'0.25em', color:gold, fontFamily:'Jost' }}>
              {c.pillars.label.toUpperCase()}
            </span>
            <div style={{ width:'40px', height:'1px', background:gold }} />
          </div>
          <h2 style={{
            fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(36px,4vw,56px)',
            fontWeight:300, color:navy, lineHeight:1.1, whiteSpace:'pre-line',
          }}>{c.pillars.title.replace('\\n','\n')}</h2>
        </div>

        <div className="reveal-stagger" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'2px' }}>
          {c.pillars.items.map((p,i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding:'48px 36px', textAlign:'center',
                background: hovered===i ? navy : '#fff',
                borderTop: hovered===i ? `2px solid ${gold}` : '2px solid transparent',
                transition:'all 0.35s ease',
                boxShadow: hovered===i
                  ? `0 8px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)`
                  : '0 1px 0 rgba(255,255,255,0.9) inset, 0 2px 8px rgba(0,0,0,0.04)',
              }}>
              <div style={{
                fontFamily:'Cormorant Garamond, serif', fontSize:'40px',
                color: hovered===i ? gold : `${gold}70`,
                marginBottom:'20px', transition:'all 0.35s',
                textShadow: hovered===i ? `0 0 20px ${gold}60` : 'none',
              }}>{p.icon}</div>
              <h3 style={{
                fontFamily:'Cormorant Garamond, serif', fontSize:'20px', fontWeight:400,
                color: hovered===i ? '#fff' : navy,
                marginBottom:'12px', transition:'color 0.3s',
                letterSpacing:'0.03em',
              }}>{p.title}</h3>
              <p style={{
                fontSize:'13px', lineHeight:1.75, fontWeight:300,
                color: hovered===i ? 'rgba(255,255,255,0.55)' : 'rgba(15,30,53,0.55)',
                fontFamily:'Jost', transition:'color 0.3s',
              }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


  window.Pillars = Pillars;
})();
