(function () {
  const { useState } = React;
  const { CardSwiper, StarIcon } = window;

/* ── WHY US ── */
function WhyUs({ c, gold, navy }) {
  const [hoveredPillar, setHoveredPillar] = useState(null);
  return (
    <section id="why" style={{
      background: `linear-gradient(160deg, ${navy} 0%, #0a1628 100%)`,
      padding:'120px 96px', position:'relative', overflow:'hidden',
      boxShadow:'inset 0 1px 0 rgba(184,151,106,0.1), inset 0 -1px 0 rgba(184,151,106,0.06)',
    }}>
      <div style={{
        position:'absolute', right:'-10vw', bottom:'-10vw',
        opacity:0.03,
      }}>
        <StarIcon size={800} color={gold} />
      </div>

      <div style={{ maxWidth:'1400px', margin:'0 auto', position:'relative', zIndex:2 }}>

        {/* ── ROW 1: Title + Stats ── */}
        <div className="g-split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'96px', alignItems:'start', marginBottom:'80px' }}>
          <div className="reveal-left">
            <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
              <div style={{ width:'40px', height:'1px', background:gold }} />
              <span style={{ fontSize:'11px', letterSpacing:'0.25em', color:gold, fontFamily:'Jost' }}>
                {c.why.label.toUpperCase()}
              </span>
            </div>
            <h2 style={{
              fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(40px, 4vw, 60px)',
              fontWeight:300, color:'#fff', lineHeight:1.1, whiteSpace:'pre-line',
            }}>{c.why.title}</h2>

            <div style={{ marginTop:'40px', width:'48px', height:'1px', background:gold, opacity:0.4 }} />
            <p style={{ marginTop:'32px', fontSize:'14px', lineHeight:1.9, color:'rgba(255,255,255,0.5)', fontFamily:'Jost', fontWeight:300, maxWidth:'380px' }}>
              {c.misc.whyAbout}
            </p>
          </div>

          <div className="reveal-stagger reveal-right" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px' }}>
            {c.why.items.map((item, i) => (
              <div key={i} style={{
                padding:'40px 36px',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(184,151,106,0.07)',
                borderTop:`1px solid rgba(184,151,106,0.12)`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.12)',
              }}>
                <div style={{
                  fontFamily:'Cormorant Garamond, serif', fontSize:'48px', fontWeight:300,
                  color:gold, lineHeight:1, marginBottom:'12px',
                  textShadow:`0 0 18px ${gold}70, 0 0 45px ${gold}28`,
                }} data-counter={item.num}>{item.num}</div>
                <div style={{ fontSize:'12px', lineHeight:1.6, color:'rgba(255,255,255,0.5)', fontFamily:'Jost', fontWeight:300 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="reveal" style={{
          display:'flex', alignItems:'center', gap:'24px', marginBottom:'72px',
        }}>
          <div style={{ flex:1, height:'1px', background:`linear-gradient(to right, rgba(184,151,106,0.25), rgba(184,151,106,0.06))` }} />
          <StarIcon size={10} color={gold} style={{ opacity:0.5 }} />
          <span style={{ fontSize:'10px', letterSpacing:'0.28em', color:`${gold}70`, fontFamily:'Jost' }}>
            {c.pillars.label.toUpperCase()}
          </span>
          <StarIcon size={10} color={gold} style={{ opacity:0.5 }} />
          <div style={{ flex:1, height:'1px', background:`linear-gradient(to left, rgba(184,151,106,0.25), rgba(184,151,106,0.06))` }} />
        </div>

        {/* ── ROW 2: Four Pillars ── */}
        <CardSwiper className="reveal-stagger g-4 swipe" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'2px' }}>
          {c.pillars.items.map((p, i) => (
            <div key={i}
              onMouseEnter={() => setHoveredPillar(i)}
              onMouseLeave={() => setHoveredPillar(null)}
              style={{
                padding:'40px 36px',
                background: hoveredPillar === i
                  ? 'rgba(184,151,106,0.12)'
                  : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
                borderTop: `2px solid ${hoveredPillar === i ? gold : 'rgba(184,151,106,0.12)'}`,
                transition:'all 0.35s ease',
                cursor:'default',
              }}>
              {/* Icon */}
              <div style={{
                fontSize:'22px', color: hoveredPillar === i ? gold : `${gold}60`,
                marginBottom:'20px', lineHeight:1,
                transition:'color 0.3s',
                textShadow: hoveredPillar === i ? `0 0 16px ${gold}80` : 'none',
              }}>{p.icon}</div>
              {/* Title */}
              <h4 style={{
                fontFamily:'Cormorant Garamond, serif', fontSize:'20px', fontWeight:400,
                color: hoveredPillar === i ? '#fff' : 'rgba(255,255,255,0.75)',
                marginBottom:'14px', lineHeight:1.3,
                transition:'color 0.3s',
              }}>{p.title}</h4>
              {/* Desc */}
              <p style={{
                fontSize:'13px', lineHeight:1.8, fontFamily:'Jost', fontWeight:300,
                color: hoveredPillar === i ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.38)',
                transition:'color 0.3s',
              }}>{p.desc}</p>
            </div>
          ))}
        </CardSwiper>

      </div>
    </section>
  );
}


  window.WhyUs = WhyUs;
})();
