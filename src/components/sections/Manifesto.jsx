(function () {
  const { StarIcon } = window;

/* ── MANIFESTO ── */
function Manifesto({ c, gold, navy }) {
  return (
    <section style={{
      background: `linear-gradient(160deg, #060e1a 0%, ${navy} 60%, #060e1a 100%)`,
      padding:'100px 96px', position:'relative', overflow:'hidden',
      borderTop:`1px solid rgba(184,151,106,0.12)`,
      borderBottom:`1px solid rgba(184,151,106,0.12)`,
    }}>
      {/* Background star watermark large */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', opacity:0.03, pointerEvents:'none' }}>
        <StarIcon size={600} color={gold} />
      </div>
      {/* Bloom */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        background:`radial-gradient(ellipse 60% 70% at 50% 50%, rgba(184,151,106,0.07) 0%, transparent 65%)` }} />

      <div style={{ maxWidth:'900px', margin:'0 auto', textAlign:'center', position:'relative', zIndex:2 }}>
        <div className="reveal" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', marginBottom:'36px' }}>
          <div style={{ flex:1, height:'1px', background:`linear-gradient(to right, transparent, ${gold}50)` }} />
          <StarIcon size={16} color={gold} />
          <span style={{ fontSize:'11px', letterSpacing:'0.3em', color:gold, fontFamily:'Jost' }}>
            {c.manifesto.label.toUpperCase()}
          </span>
          <StarIcon size={16} color={gold} />
          <div style={{ flex:1, height:'1px', background:`linear-gradient(to left, transparent, ${gold}50)` }} />
        </div>

        <blockquote className="reveal" style={{
          fontFamily:'Cormorant Garamond, serif',
          fontSize:'clamp(22px, 3vw, 36px)', fontWeight:300,
          color:'#fff', lineHeight:1.5, fontStyle:'italic',
          marginBottom:'32px', letterSpacing:'0.01em',
          textShadow:`0 0 40px rgba(184,151,106,0.15)`,
        }}>
          "{c.manifesto.quote}"
        </blockquote>

        <p className="reveal" style={{
          fontSize:'14px', lineHeight:1.9, color:'rgba(255,255,255,0.45)',
          fontFamily:'Jost', fontWeight:300, maxWidth:'600px', margin:'0 auto',
        }}>{c.manifesto.sub}</p>

        <div className="reveal" style={{ marginTop:'48px', display:'flex', justifyContent:'center' }}>
          <a href="#contact" style={{
            border:`1px solid ${gold}50`, color:gold,
            padding:'12px 36px', fontSize:'11px', letterSpacing:'0.2em',
            textDecoration:'none', fontFamily:'Jost', fontWeight:400,
            transition:'all 0.25s', display:'inline-block',
          }}
          onMouseEnter={e => { e.currentTarget.style.background=gold; e.currentTarget.style.color=navy; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=gold; }}
          >BEGIN YOUR SHIPMENT</a>
        </div>
      </div>
    </section>
  );
}


  window.Manifesto = Manifesto;
})();
