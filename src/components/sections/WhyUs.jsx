(function () {
  const { useState, useEffect } = React;
  const { CardSwiper, StarIcon, SectionEyebrow, CornerMarks } = window;
  const { whyImage: WHY_IMAGE } = window.CONRAD_EXPRESS_DATA.ASSETS;

/* ── WHY US ── */
function WhyUs({ c, gold, navy }) {
  const [hoveredPillar, setHoveredPillar] = useState(null);
  const [activeShowcase, setActiveShowcase] = useState('stats');
  const showingStats = activeShowcase === 'stats';

  // Auto-swap between the stats panel and the image every 10 seconds.
  useEffect(() => {
    const t = setInterval(() => {
      setActiveShowcase(s => (s === 'stats' ? 'image' : 'stats'));
    }, 10000);
    return () => clearInterval(t);
  }, []);
  return (
    <section id="why" className="why-section" style={{
      background: `linear-gradient(160deg, ${navy} 0%, #0a1628 100%)`,
      padding:'92px 96px 72px', position:'relative', overflow:'hidden',
      minHeight:'calc(100vh - 72px)', boxSizing:'border-box',
      display:'flex', flexDirection:'column', justifyContent:'flex-start',
      scrollMarginTop:'72px',
      boxShadow:'inset 0 1px 0 rgba(184,151,106,0.1), inset 0 -1px 0 rgba(184,151,106,0.06)',
    }}>
      <style>{`
        #why.why-section {
          padding:92px 96px 72px !important;
          min-height:calc(100vh - 72px) !important;
        }
        #why .why-inner { width:100%; max-width:1500px; }
        #why .why-main {
          display:grid;
          grid-template-columns:minmax(320px, 0.82fr) minmax(0, 1.18fr);
          gap:64px;
          align-items:center;
          margin-bottom:38px;
        }
        #why .why-showcase {
          height:clamp(440px, 44vh, 560px);
          min-height:0;
          align-self:center;
          width:100%;
        }
        #why .why-stats { height:100%; }
        #why .why-stat { min-height:0; }
        #why .why-heading { font-size:clamp(42px, 3.6vw, 58px) !important; }
        #why .why-eyebrow { margin-bottom:16px !important; }
        #why .why-copy-rule { margin-top:30px !important; }
        #why .why-about { margin-top:24px !important; line-height:1.82 !important; }
        #why .why-stat { padding:26px 28px !important; }
        #why .why-stat-number { font-size:44px !important; }
        #why .why-divider { margin-bottom:28px !important; }
        #why .swipe-wrap { max-width:100%; overflow:hidden; }
        #why .swipe { max-width:100%; }
        #why .why-pillar { padding:22px 24px !important; min-height:154px; }
        #why .why-pillar-icon { font-size:19px !important; margin-bottom:12px !important; }
        #why .why-pillar-title { font-size:18px !important; margin-bottom:8px !important; }
        #why .why-pillar-desc { font-size:12px !important; line-height:1.55 !important; }
        @media (max-width:1440px) {
          #why.why-section { padding:72px 64px 58px !important; }
          #why .why-main { gap:52px; margin-bottom:30px; }
          #why .why-showcase { height:clamp(380px, 42vh, 470px); }
          #why .why-heading { font-size:clamp(40px, 3.4vw, 54px) !important; }
          #why .why-stat-number { font-size:40px !important; }
          #why .why-stat { padding:22px 24px !important; }
          #why .why-divider { margin-bottom:24px !important; }
          #why .why-pillar { padding:22px 24px !important; min-height:150px; }
          #why .why-pillar-icon { margin-bottom:12px !important; }
          #why .why-pillar-title { font-size:18px !important; margin-bottom:9px !important; }
          #why .why-pillar-desc { font-size:11.8px !important; line-height:1.56 !important; }
        }
        @media (max-height:820px) and (min-width:768px) {
          #why.why-section { padding-top:56px !important; padding-bottom:48px !important; }
          #why .why-main { margin-bottom:26px; }
          #why .why-showcase { height:clamp(370px, 52vh, 430px); }
          #why .why-heading { font-size:clamp(38px, 3.2vw, 50px) !important; }
          #why .why-about { font-size:13px !important; line-height:1.72 !important; }
          #why .why-divider { margin-bottom:22px !important; }
          #why .why-pillar { min-height:138px; padding:20px 22px !important; }
          #why .why-pillar-desc { line-height:1.5 !important; }
        }
        @media (max-width:1180px) {
          #why .why-main { grid-template-columns:1fr 1fr; }
          #why .why-stats { grid-template-columns:1fr 1fr !important; }
          #why .why-showcase { height:420px; }
        }
        @media (max-width:1024px) {
          #why.why-section { padding:64px 40px 52px !important; min-height:auto !important; }
          #why .why-main { grid-template-columns:1fr; }
          #why .why-stats { grid-template-columns:repeat(2, 1fr) !important; }
          #why .why-copy { max-width:640px !important; }
          #why .why-showcase { width:min(720px, 100%) !important; height:440px; justify-self:center; }
        }
        @media (max-width:767px) {
          #why.why-section { padding:56px 22px 46px !important; min-height:auto !important; }
          #why .reveal-left,
          #why .reveal-right { transform:translateY(24px); }
          #why .reveal-left.visible,
          #why .reveal-right.visible { transform:translateY(0); }
          #why .why-main { gap:20px; margin-bottom:24px; }
          #why .why-heading { font-size:clamp(40px, 12vw, 54px) !important; }
          #why .why-showcase { width:100% !important; height:360px; }
          #why .swipe { width:100%; }
          #why .why-stats { grid-template-columns:1fr 1fr !important; }
          #why .why-stat { padding:24px 20px !important; min-height:116px; }
          #why .why-divider { margin-bottom:20px !important; gap:12px !important; }
          #why .why-pillar { min-height:auto; }
        }
        @media (max-width:520px) {
          #why .why-showcase { height:340px; }
          #why .why-stats { grid-template-columns:1fr !important; }
          #why .why-stat { min-height:94px; }
        }
      `}</style>
      <div style={{
        position:'absolute', right:'-10vw', bottom:'-10vw',
        opacity:0.03,
      }}>
        <StarIcon size={800} color={gold} />
      </div>

      <div className="why-inner" style={{ maxWidth:'1500px', margin:'0 auto', position:'relative', zIndex:2 }}>

        {/* ── ROW 1: Title + Stats + Image ── */}
        <div className="why-main">
          <div className="reveal-left why-copy">
            <SectionEyebrow label={c.why.label} gold={gold} className="why-eyebrow" style={{ marginBottom:'16px' }} />
            <h2 className="why-heading" style={{
              fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(42px, 3.6vw, 58px)',
              fontWeight:300, color:'#fff', lineHeight:1.1, whiteSpace:'pre-line',
            }}>{c.why.title}</h2>

            <div className="why-copy-rule" style={{ marginTop:'22px', width:'48px', height:'1px', background:gold, opacity:0.4 }} />
            <p className="why-about" style={{ marginTop:'18px', fontSize:'14px', lineHeight:1.72, color:'rgba(255,255,255,0.5)', fontFamily:'Jost', fontWeight:300, maxWidth:'410px' }}>
              {c.misc.whyAbout}
            </p>
          </div>

          <div className="reveal-right why-showcase" style={{ position:'relative' }}>
            <div style={{ position:'absolute', top:'14px', right:'16px', zIndex:20, display:'flex', gap:'8px' }}>
              {[
                { key:'stats', label:'Show stats' },
                { key:'image', label:'Show image' },
              ].map((mode) => {
                const active = activeShowcase === mode.key;
                return (
                  <button
                    key={mode.key}
                    className="why-showcase-toggle"
                    type="button"
                    aria-label={mode.label}
                    aria-pressed={active}
                    onClick={() => setActiveShowcase(mode.key)}
                    style={{
                      width:active ? '28px' : '9px',
                      height:'9px',
                      borderRadius:'999px',
                      border:`1px solid ${active ? gold : 'rgba(255,255,255,0.24)'}`,
                      background:active ? gold : 'rgba(255,255,255,0.14)',
                      padding:0,
                      cursor:'pointer',
                      transition:'all 0.25s ease',
                    }}
                  />
                );
              })}
            </div>

            <div className="why-stats-panel" style={{
              position:'absolute',
              inset:0,
              opacity:showingStats ? 1 : 0,
              pointerEvents:showingStats ? 'auto' : 'none',
              transition:'opacity 0.42s ease',
            }}>
              <div className="reveal-stagger why-stats" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gridAutoRows:'1fr', gap:'2px' }}>
                {c.why.items.map((item, i) => (
                  <div key={i} className="why-stat" style={{
                    padding:'26px 28px',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(184,151,106,0.07)',
                    borderTop:`1px solid rgba(184,151,106,0.12)`,
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.12)',
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                  }}>
                    <div className="why-stat-number" style={{
                      fontFamily:'Cormorant Garamond, serif', fontSize:'44px', fontWeight:300,
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

            <div className="why-image-panel" style={{
              position:'absolute',
              inset:0,
              opacity:showingStats ? 0 : 1,
              pointerEvents:showingStats ? 'none' : 'auto',
              transition:'opacity 0.42s ease',
            }}>
              <div style={{
                position:'absolute',
                top:'14px', left:'14px', right:'-14px', bottom:'-14px',
                border:`1px solid ${gold}25`,
                background:'rgba(10,34,62,0.18)',
                borderRadius:'8px',
                zIndex:0,
              }} />

              <div style={{
                position:'absolute', inset:0, zIndex:1,
                overflow:'hidden',
                borderRadius:'8px',
                boxShadow:'0 18px 45px rgba(0,0,0,0.26)',
                background:'#071320',
              }}>
                <div style={{
                  position:'absolute', inset:0,
                  backgroundImage:`
                    linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
                  `,
                  backgroundSize:'72px 48px',
                  opacity:0.22,
                  zIndex:0,
                }} />

                <img
                  src={WHY_IMAGE}
                  alt="Conrad Express pickup service vehicle"
                  loading="lazy"
                  style={{
                    position:'absolute',
                    inset:0,
                    width:'100%',
                    height:'100%',
                    objectFit:'cover',
                    objectPosition:'center 58%',
                    filter:'brightness(1.16) contrast(1.03) saturate(1.02)',
                    transform:'scale(1.02)',
                    transformOrigin:'center 58%',
                    zIndex:1,
                    pointerEvents:'none',
                  }}
                />

                <div style={{
                  position:'absolute',
                  inset:0,
                  zIndex:2,
                  pointerEvents:'none',
                  background:`
                    linear-gradient(90deg, rgba(4,18,34,0.14) 0%, rgba(4,18,34,0.02) 44%, rgba(4,18,34,0.12) 100%),
                    linear-gradient(180deg, rgba(4,18,34,0.08) 0%, transparent 38%, rgba(4,18,34,0.12) 100%),
                    repeating-linear-gradient(135deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 22px)
                  `,
                  mixBlendMode:'normal',
                }} />

                <div style={{
                  position:'absolute', inset:'16px',
                  border:`1px solid ${gold}35`,
                  pointerEvents:'none', zIndex:3,
                }} />

                <CornerMarks size={24} gold={gold} opacity={0.78} zIndex={4} />
              </div>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="reveal why-divider" style={{
          display:'flex', alignItems:'center', gap:'24px', marginBottom:'30px',
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
              className="why-pillar"
              onMouseEnter={() => setHoveredPillar(i)}
              onMouseLeave={() => setHoveredPillar(null)}
              style={{
                padding:'22px 24px',
                background: hoveredPillar === i
                  ? 'rgba(184,151,106,0.12)'
                  : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
                borderTop: `2px solid ${hoveredPillar === i ? gold : 'rgba(184,151,106,0.12)'}`,
                transition:'all 0.35s ease',
                cursor:'default',
              }}>
              {/* Icon */}
              <div className="why-pillar-icon" style={{
                fontSize:'19px', color: hoveredPillar === i ? gold : `${gold}60`,
                marginBottom:'12px', lineHeight:1,
                transition:'color 0.3s',
                textShadow: hoveredPillar === i ? `0 0 16px ${gold}80` : 'none',
              }}>{p.icon}</div>
              {/* Title */}
              <h4 className="why-pillar-title" style={{
                fontFamily:'Cormorant Garamond, serif', fontSize:'19px', fontWeight:400,
                color: hoveredPillar === i ? '#fff' : 'rgba(255,255,255,0.75)',
                marginBottom:'8px', lineHeight:1.25,
                transition:'color 0.3s',
              }}>{p.title}</h4>
              {/* Desc */}
              <p className="why-pillar-desc" style={{
                fontSize:'12px', lineHeight:1.55, fontFamily:'Jost', fontWeight:300,
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
