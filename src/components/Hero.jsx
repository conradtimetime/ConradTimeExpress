(function () {
  const { SITE_CONFIG } = window.CONRAD_EXPRESS_DATA;
  const { StarIcon } = window;

/* ── HERO ── */
/* ── HERO BACKGROUND ──
   Drop your photo into brand-images/ and set the path below.
   Recommended size: 2560 × 1440 px (16:9), JPG, ≤ 600 KB.
   The image is rendered object-fit:cover so it always fills the full-screen
   hero; keep the key subject toward the LEFT/CENTER half (the right side is
   covered by the headline + a controlled scrim for legibility). */
const HERO_BG = SITE_CONFIG.heroBackground || 'brand-images/Section_Hero.jpg';

function Hero({ c, gold, navy, layout }) {
  const isDark = layout === 'dark';
  const sameDayPackage = c.packages.items.find((pkg) => pkg.name === 'Same Day') || c.packages.items[0];
  const startingPrice = sameDayPackage?.price || c.pricing.price;
  const lineUrl = SITE_CONFIG.contact.lineUrl;

  return (
    <section id="hero" style={{
      height:'100vh', minHeight:'640px',
      background: isDark
        ? `linear-gradient(150deg, ${navy} 0%, #0b1a31 55%, #162440 100%)`
        : 'linear-gradient(150deg, #f9f6f0 0%, #f0ebe0 100%)',
      position:'relative', overflow:'hidden',
    }}>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes lineGrow { from{width:0;opacity:0} to{width:48px;opacity:0.7} }
        .h1{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .10s both}
        .h2{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .24s both}
        .h3{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .38s both}
        .h4{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .52s both}
        .h5{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .66s both}
        .h6{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .80s both}
        .hl{animation:lineGrow   .6s cubic-bezier(.16,1,.3,1) .38s both}
        .hero-sub{
          font-size:30px;
          line-height:1.32;
          letter-spacing:0;
        }
        @media (max-width:767px){
          .hero-sub{
            font-size:23px;
            line-height:1.38;
          }
        }
      `}</style>

      {/* ── BACKGROUND IMAGE (swap HERO_BG above to replace) ── */}
      <div style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:1 }}>
        {HERO_BG ? (
          <img src={HERO_BG} alt="" style={{
            width:'100%', height:'100%',
            objectFit:'cover', objectPosition:'center center',
            display:'block',
            transform:'scaleX(-1)',
          }} />
        ) : (
          <div style={{
            width:'100%', height:'100%', background:'#13203a',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px',
            position:'relative', overflow:'hidden',
          }}>
            {/* stripe texture */}
            <div style={{ position:'absolute', inset:0,
              backgroundImage:'repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 14px)' }} />
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" style={{ opacity:0.3, position:'relative' }}>
              <rect x="2" y="6" width="28" height="20" rx="2" stroke="#e2b56f" strokeWidth="1.4"/>
              <circle cx="16" cy="16" r="5" stroke="#e2b56f" strokeWidth="1.4"/>
              <circle cx="24" cy="10" r="1.5" fill="#e2b56f" opacity="0.6"/>
            </svg>
            <span style={{ fontSize:'11px', letterSpacing:'0.28em', color:'rgba(226,181,111,0.7)', fontFamily:'Jost', position:'relative' }}>
              HERO BACKGROUND IMAGE
            </span>
            <span style={{ fontSize:'10px', letterSpacing:'0.16em', color:'rgba(226,181,111,0.42)', fontFamily:'Jost', position:'relative' }}>
              2560 × 1440 px · 16:9 · JPG
            </span>
          </div>
        )}
      </div>

      {/* SCRIM — keeps the headline legible over any photo */}
      <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
        background: isDark
          ? `linear-gradient(90deg, ${navy}f7 0%, ${navy}e0 26%, ${navy}80 48%, ${navy}1a 66%, transparent 80%),
             linear-gradient(to top, ${navy}cc 0%, transparent 32%)`
          : `linear-gradient(90deg, #f9f6f0f2 0%, #f9f6f0c8 30%, #f9f6f060 52%, transparent 76%)`
      }} />

      {/* VERTICAL RULE */}
      <div style={{ position:'absolute', left:'48px', top:'22%', bottom:'22%', zIndex:4,
        width:'1px', background:'linear-gradient(to bottom, transparent, rgba(226,181,111,0.36), transparent)',
        pointerEvents:'none',
      }} />

      {/* ── TEXT CONTENT ── */}
      <div className="hero-content" style={{
        position:'absolute', top:0, left:0, bottom:0,
        width:'min(640px, 55%)', zIndex:5,
        display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start',
        padding:'120px 56px 80px 96px',
        textAlign:'left',
      }}>
        {c.hero.eyebrow && (
          <div className="h1" style={{ display:'flex', alignItems:'center', justifyContent:'flex-start', gap:'14px', marginBottom:'24px' }}>
            <StarIcon size={12} color='#e2b56f' />
            <span style={{ fontSize:'10px', letterSpacing:'0.28em', color:'#e2b56f', fontFamily:'Jost', fontWeight:400 }}>
              {c.hero.eyebrow.toUpperCase()}
            </span>
          </div>
        )}

        <h1 className="h2" style={{
          fontFamily:'Cormorant Garamond, serif',
          fontSize:'clamp(58px, 6vw, 100px)',
          lineHeight:0.9, fontWeight:300,
          color: isDark ? '#ffffff' : navy,
          marginBottom:'26px', letterSpacing:'-0.02em', whiteSpace:'pre-line',
          textShadow: isDark ? '0 3px 18px rgba(0,0,0,0.42), 0 0 42px rgba(226,181,111,0.12)' : 'none',
        }}>{c.hero.title}</h1>

        <div className="hl" style={{ height:'1px', background:'#e2b56f', marginBottom:'22px', alignSelf:'flex-start' }} />

        <p className="h3 hero-sub" style={{
          color: isDark ? '#fff5dd' : navy,
          maxWidth:'620px', fontFamily:'Jost', fontWeight:600, whiteSpace:'pre-line', marginBottom:'36px',
          textShadow: isDark ? '0 3px 20px rgba(0,0,0,0.55)' : 'none',
        }}>{c.hero.sub}</p>

        <div className="h4" style={{ display:'flex', gap:'14px', alignItems:'center', justifyContent:'flex-start', marginBottom:'44px', flexWrap:'wrap' }}>
          <a href={lineUrl} target="_blank" rel="noopener noreferrer" style={{
            background:'#e2b56f', color:navy,
            padding:'13px 28px', fontSize:'11px', letterSpacing:'0.14em',
            textDecoration:'none', fontFamily:'Jost', fontWeight:500, transition:'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='#fff0c9'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(226,181,111,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='#e2b56f'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
          >{c.hero.cta1.toUpperCase()}</a>
          <a href="#services" style={{
            color: isDark ? 'rgba(255,255,255,0.68)' : navy,
            fontSize:'11px', letterSpacing:'0.14em', textDecoration:'none',
            fontFamily:'Jost', fontWeight:400,
            display:'flex', alignItems:'center', gap:'10px', transition:'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color='#e2b56f'}
          onMouseLeave={e => e.currentTarget.style.color= isDark ? 'rgba(255,255,255,0.68)' : navy}
          >
            {c.hero.cta2.toUpperCase()}
            <span style={{ display:'inline-block', width:'22px', height:'1px', background:'currentColor' }}></span>
          </a>
        </div>

        <div className="h5" style={{
          display:'flex', gap:'20px', flexWrap:'wrap',
          justifyContent:'flex-start',
          borderTop:'1px solid rgba(226,181,111,0.14)', paddingTop:'22px', marginBottom:'18px',
        }}>
          {c.trust.map((t, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'7px' }}>
              <StarIcon size={7} color='#e2b56f' />
              <span style={{ fontSize:'9.5px', letterSpacing:'0.11em', color: isDark ? 'rgba(255,255,255,0.52)' : 'rgba(15,30,53,0.45)', fontFamily:'Jost' }}>
                {t.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <div className="h6 hero-price-card" style={{
          display:'inline-grid', gridTemplateColumns:'42px 1fr', alignItems:'center', columnGap:'16px',
          padding:'18px 24px',
          background: isDark
            ? 'linear-gradient(145deg, rgba(7,15,29,0.95) 0%, rgba(15,30,53,0.9) 58%, rgba(226,181,111,0.14) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(250,246,236,0.9) 58%, rgba(226,181,111,0.16) 100%)',
          border:'1px solid rgba(226,181,111,0.72)',
          borderRadius:'6px',
          boxShadow: isDark
            ? '0 24px 58px rgba(0,0,0,0.46), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 18px 42px rgba(15,30,53,0.16), inset 0 1px 0 rgba(255,255,255,0.82)',
          maxWidth:'min(100%, 420px)',
          minWidth:'min(100%, 360px)',
          boxSizing:'border-box',
          position:'relative', overflow:'hidden',
        }}>
          <span aria-hidden="true" style={{
            position:'absolute', top:0, left:'18px', right:'18px', height:'1px',
            background:'linear-gradient(90deg, transparent, rgba(255,240,201,0.86), transparent)',
          }} />
          <div style={{
            width:'42px', height:'42px', display:'flex', alignItems:'center', justifyContent:'center',
            border:'1px solid rgba(226,181,111,0.58)',
            background:'rgba(226,181,111,0.08)',
            boxShadow:'inset 0 0 18px rgba(226,181,111,0.08)',
          }}>
            <StarIcon size={18} color="#e2b56f" style={{ opacity:0.95 }} />
          </div>
          <div>
            <div style={{
              fontSize:'10px', letterSpacing:'0.24em', color:'#e2b56f',
              fontFamily:'Jost', fontWeight:600, marginBottom:'6px',
            }}>
              {c.pricing.label.toUpperCase()}
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
              <span style={{
                fontFamily:'Cormorant Garamond, serif', fontSize:'58px', fontWeight:600,
                color: isDark ? '#fff7df' : navy, lineHeight:0.9,
                textShadow: isDark ? '0 0 24px rgba(226,181,111,0.22)' : 'none',
              }}>
                {startingPrice}
              </span>
              <span style={{
                fontSize:'12px',
                color: isDark ? 'rgba(255,255,255,0.64)' : 'rgba(15,30,53,0.62)',
                fontFamily:'Jost', fontWeight:500,
              }}>
                {c.pricing.unit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="hero-aside" style={{ position:'absolute', bottom:'32px', left:'96px', zIndex:5, display:'flex', alignItems:'center', gap:'10px', pointerEvents:'none' }}>
        <div style={{ width:'1px', height:'36px', background:'linear-gradient(to bottom, transparent, rgba(226,181,111,0.8))', opacity:0.7 }} />
        <span style={{ fontSize:'9px', letterSpacing:'0.25em', color:'rgba(226,181,111,0.5)', fontFamily:'Jost' }}>SCROLL</span>
      </div>
    </section>
  );
}


  window.Hero = Hero;
})();
