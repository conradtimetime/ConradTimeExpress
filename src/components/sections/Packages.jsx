(function () {
  const { useState } = React;
  const { CardSwiper, StarIcon } = window;

/* ── PACKAGES ── */
function Packages({ c, gold, navy }) {
  const [activeIdx, setActiveIdx] = useState(1); // Gold selected by default
  const tierAccent = ['#a8a8a8', gold, '#e5e4e2'];

  return (
    <section id="packages" style={{ background:'#fff', padding:'120px 96px',
      boxShadow:'inset 0 -1px 0 rgba(184,151,106,0.12), inset 0 1px 0 rgba(184,151,106,0.08)' }}>
      <div style={{ maxWidth:'1400px', margin:'0 auto' }}>

        {/* Header */}
        <div className="reveal" style={{ textAlign:'center', marginBottom:'72px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'16px', marginBottom:'20px' }}>
            <div style={{ width:'40px', height:'1px', background:gold }} />
            <span style={{ fontSize:'11px', letterSpacing:'0.25em', color:gold, fontFamily:'Jost' }}>
              {c.packages.label.toUpperCase()}
            </span>
            <div style={{ width:'40px', height:'1px', background:gold }} />
          </div>
          <h2 style={{
            fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(40px, 5vw, 64px)',
            fontWeight:300, color:navy, lineHeight:1.1, whiteSpace:'pre-line', marginBottom:'20px',
          }}>{c.packages.title}</h2>
          <p style={{ fontSize:'14px', color:'rgba(15,30,53,0.5)', fontFamily:'Jost', fontWeight:300, maxWidth:'480px', margin:'0 auto', lineHeight:1.8 }}>
            {c.packages.sub}
          </p>
        </div>

        {/* Cards grid */}
        <CardSwiper className='reveal-stagger g-3 swipe' style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px' }}>
          {c.packages.items.map((pkg, i) => {
            const isActive = activeIdx === i;
            const isGold   = i === 1;
            return (
              <div key={i}
                onClick={() => setActiveIdx(i)}
                style={{
                  position:'relative', padding:'52px 44px 44px',
                  background: isActive
                    ? (isGold ? `${gold}14` : 'rgba(15,30,53,0.03)')
                    : 'var(--cream)',
                  border: isActive
                    ? `1px solid ${gold}80`
                    : `1px solid rgba(15,30,53,0.08)`,
                  borderTop: isActive
                    ? `2px solid ${gold}`
                    : `1px solid rgba(15,30,53,0.08)`,
                  boxShadow: isActive
                    ? `0 0 0 1px ${gold}30, 0 0 26px ${gold}40, 0 12px 40px rgba(0,0,0,0.10), inset 0 1px 0 rgba(184,151,106,0.25)`
                    : '0 1px 4px rgba(0,0,0,0.04)',
                  transition:'all 0.45s cubic-bezier(0.16,1,0.3,1)',
                  cursor:'pointer',
                  display:'flex', flexDirection:'column',
                }}>

                {/* Popular badge */}
                {pkg.badge && (
                  <div style={{
                    position:'absolute', top:'-1px', left:'50%', transform:'translateX(-50%)',
                    background:gold, color:navy,
                    fontSize:'9px', letterSpacing:'0.2em', fontFamily:'Jost', fontWeight:500,
                    padding:'4px 16px',
                  }}>{pkg.badge.toUpperCase()}</div>
                )}

                {/* Tier name */}
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'28px' }}>
                  <StarIcon size={12} color={tierAccent[i]} style={{ opacity: isActive ? 1 : 0.5 }} />
                  <span style={{
                    fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:400,
                    letterSpacing:'0.15em',
                    color: isActive && isGold ? gold : isActive ? navy : 'rgba(15,30,53,0.5)',
                    transition:'color 0.4s',
                  }}>{pkg.name.toUpperCase()}</span>
                </div>

                {/* Price */}
                <div style={{ marginBottom:'8px' }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
                    <span style={{
                      fontFamily:'Cormorant Garamond, serif',
                      fontSize: pkg.price === 'Custom' || pkg.price === 'กำหนดเอง' ? '36px' : '48px',
                      fontWeight:300, color:navy, lineHeight:1,
                    }}>{pkg.price}</span>
                    {pkg.unit && (
                      <span style={{ fontSize:'12px', color:'rgba(15,30,53,0.4)', fontFamily:'Jost' }}>{pkg.unit}</span>
                    )}
                  </div>
                </div>

                {/* Desc */}
                <p style={{
                  fontSize:'13px', lineHeight:1.7,
                  color: isActive ? 'rgba(15,30,53,0.6)' : 'rgba(15,30,53,0.4)',
                  fontFamily:'Jost', fontWeight:300, marginBottom:'32px',
                  paddingBottom:'28px', borderBottom:'1px solid rgba(15,30,53,0.1)',
                  transition:'color 0.4s',
                }}>{pkg.desc}</p>

                {/* Features */}
                <div style={{ display:'flex', flexDirection:'column', gap:'12px', flex:1 }}>
                  {pkg.features.map((f, fi) => (
                    <div key={fi} style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                      <div style={{
                        width:'14px', height:'14px', flexShrink:0, marginTop:'1px',
                        border:`1px solid ${isActive && isGold ? gold : isActive ? 'rgba(15,30,53,0.4)' : 'rgba(15,30,53,0.18)'}`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        transition:'border-color 0.4s',
                      }}>
                        <div style={{ width:'6px', height:'6px', background: isActive && isGold ? gold : isActive ? 'rgba(15,30,53,0.5)' : 'rgba(15,30,53,0.22)', transition:'background 0.4s' }} />
                      </div>
                      <span style={{
                        fontSize:'13px', fontFamily:'Jost', fontWeight:300, lineHeight:1.5,
                        color: isActive ? 'rgba(15,30,53,0.7)' : 'rgba(15,30,53,0.45)',
                        transition:'color 0.4s',
                      }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a href="#contact" style={{
                  display:'block', textAlign:'center', marginTop:'36px',
                  padding:'13px 24px', fontSize:'11px', letterSpacing:'0.15em',
                  fontFamily:'Jost', fontWeight:500, textDecoration:'none',
                  background: isActive && isGold ? gold : 'transparent',
                  color: isActive && isGold ? navy : isActive ? navy : 'rgba(15,30,53,0.4)',
                  border: isActive && isGold ? `1px solid ${gold}` : `1px solid ${isActive ? 'rgba(15,30,53,0.3)' : 'rgba(15,30,53,0.12)'}`,
                  transition:'all 0.3s',
                }}
                onMouseEnter={e => {
                  if (!isActive) return;
                  if (!isGold) { e.currentTarget.style.borderColor = gold; e.currentTarget.style.color = gold; }
                  else { e.currentTarget.style.background = '#cead82'; }
                }}
                onMouseLeave={e => {
                  if (!isActive) return;
                  if (!isGold) { e.currentTarget.style.borderColor = 'rgba(15,30,53,0.3)'; e.currentTarget.style.color = navy; }
                  else { e.currentTarget.style.background = gold; }
                }}
                >{pkg.cta.toUpperCase()}</a>
              </div>
            );
          })}
        </CardSwiper>
      </div>
    </section>
  );
}


  window.Packages = Packages;
})();
