(function () {
  const { useEffect, useRef } = React;
  const { SITE_CONFIG } = window.CONRAD_EXPRESS_DATA;
  const { StarIcon } = window;

/* ── HERO ── */
/* ── HERO BACKGROUND ──
   Drop your photo into brand-images/ and set the path below.
   Recommended size: 2560 × 1440 px (16:9), JPG, ≤ 600 KB.
   The image is rendered object-fit:cover so it always fills the full-screen
   hero; keep the key subject toward the RIGHT half (the left side is covered
   by the headline + a dark scrim for legibility). */
const HERO_BG = SITE_CONFIG.heroBackground; // e.g. 'brand-images/hero.jpg' — leave '' to show the placeholder

function Hero({ c, gold, navy, layout }) {
  const isDark = layout === 'dark';
  const parallaxRef = useRef(null);

  /* Parallax — direct DOM, zero React re-renders */
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (el) el.style.transform = `translateY(${window.scrollY * 0.10}px)`;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

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
        /* Single animation per layer: X scroll + Y bob combined — pure 2D, max GPU perf */
        @keyframes waveA {
          0%    { transform:translate(0,       0px); }
          12.5% { transform:translate(-6.25%,  -8px); }
          25%   { transform:translate(-12.5%, -12px); }
          37.5% { transform:translate(-18.75%, -8px); }
          50%   { transform:translate(-25%,     0px); }
          62.5% { transform:translate(-31.25%,  8px); }
          75%   { transform:translate(-37.5%,  12px); }
          87.5% { transform:translate(-43.75%,  8px); }
          100%  { transform:translate(-50%,     0px); }
        }
        @keyframes waveB {
          0%    { transform:translate(0,        8px); }
          12.5% { transform:translate(-6.25%,  -4px); }
          25%   { transform:translate(-12.5%, -14px); }
          37.5% { transform:translate(-18.75%,-10px); }
          50%   { transform:translate(-25%,    -2px); }
          62.5% { transform:translate(-31.25%, 10px); }
          75%   { transform:translate(-37.5%,  16px); }
          87.5% { transform:translate(-43.75%, 12px); }
          100%  { transform:translate(-50%,     8px); }
        }
        @keyframes waveC {
          0%    { transform:translate(0,       -4px); }
          12.5% { transform:translate(-6.25%,   8px); }
          25%   { transform:translate(-12.5%,  14px); }
          37.5% { transform:translate(-18.75%, 10px); }
          50%   { transform:translate(-25%,    -2px); }
          62.5% { transform:translate(-31.25%, -12px); }
          75%   { transform:translate(-37.5%,  -18px); }
          87.5% { transform:translate(-43.75%,-12px); }
          100%  { transform:translate(-50%,    -4px); }
        }
        @keyframes lineGrow { from{width:0;opacity:0} to{width:48px;opacity:0.7} }
        @keyframes scrollPulse {
          0%,100%{opacity:.3;transform:scaleY(.8)} 50%{opacity:1;transform:scaleY(1)}
        }
        .h1{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .10s both}
        .h2{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .24s both}
        .h3{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .38s both}
        .h4{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .52s both}
        .h5{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .66s both}
        .h6{animation:heroFadeUp .7s cubic-bezier(.16,1,.3,1) .80s both}
        .hl{animation:lineGrow   .6s cubic-bezier(.16,1,.3,1) .38s both}
      `}</style>

      {/* ── BACKGROUND IMAGE (swap HERO_BG above to replace) ── */}
      <div ref={parallaxRef} style={{ position:'absolute', inset:'-6% 0 0 0', height:'112%', zIndex:1, willChange:'transform' }}>
        {HERO_BG ? (
          <img src={HERO_BG} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
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
              <rect x="2" y="6" width="28" height="20" rx="2" stroke="#b8976a" strokeWidth="1.4"/>
              <circle cx="16" cy="16" r="5" stroke="#b8976a" strokeWidth="1.4"/>
              <circle cx="24" cy="10" r="1.5" fill="#b8976a" opacity="0.6"/>
            </svg>
            <span style={{ fontSize:'11px', letterSpacing:'0.28em', color:'rgba(184,151,106,0.7)', fontFamily:'Jost', position:'relative' }}>
              HERO BACKGROUND IMAGE
            </span>
            <span style={{ fontSize:'10px', letterSpacing:'0.16em', color:'rgba(184,151,106,0.42)', fontFamily:'Jost', position:'relative' }}>
              2560 × 1440 px · 16:9 · JPG
            </span>
          </div>
        )}
      </div>

      {/* SCRIM — keeps the headline legible over any photo */}
      <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none',
        background: isDark
          ? `linear-gradient(100deg, ${navy}f7 0%, ${navy}e0 26%, ${navy}80 48%, ${navy}1a 66%, transparent 80%),
             linear-gradient(to top, ${navy}cc 0%, transparent 32%)`
          : `linear-gradient(100deg, #f9f6f0f5 0%, #f9f6f0d0 30%, #f9f6f088 50%, transparent 72%)`
      }} />

      {/* VERTICAL RULE */}
      <div style={{ position:'absolute', left:'48px', top:'22%', bottom:'22%', zIndex:3,
        width:'1px', background:'linear-gradient(to bottom, transparent, rgba(184,151,106,0.3), transparent)',
        pointerEvents:'none',
      }} />

      {/* ── TEXT CONTENT ── */}
      <div className="hero-content" style={{
        position:'absolute', top:0, left:0, bottom:0,
        width:'min(640px, 55%)', zIndex:5,
        display:'flex', flexDirection:'column', justifyContent:'center',
        padding:'120px 56px 80px 96px',
      }}>
        <div className="h1" style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'24px' }}>
          <StarIcon size={12} color='#b8976a' />
          <span style={{ fontSize:'10px', letterSpacing:'0.28em', color:'#b8976a', fontFamily:'Jost', fontWeight:400 }}>
            {c.hero.eyebrow.toUpperCase()}
          </span>
        </div>

        <h1 className="h2" style={{
          fontFamily:'Cormorant Garamond, serif',
          fontSize:'clamp(58px, 6vw, 100px)',
          lineHeight:0.9, fontWeight:300,
          color: isDark ? '#ffffff' : navy,
          marginBottom:'26px', letterSpacing:'-0.02em', whiteSpace:'pre-line',
          textShadow: isDark ? '0 2px 12px rgba(0,0,0,0.5)' : 'none',
        }}>{c.hero.title}</h1>

        <div className="hl" style={{ height:'1px', background:'#b8976a', marginBottom:'22px' }} />

        <p className="h3" style={{
          fontSize:'13.5px', lineHeight:1.85, letterSpacing:'0.03em',
          color: isDark ? 'rgba(255,255,255,0.48)' : 'rgba(15,30,53,0.6)',
          maxWidth:'340px', fontFamily:'Jost', fontWeight:300, whiteSpace:'pre-line', marginBottom:'40px',
        }}>{c.hero.sub}</p>

        <div className="h4" style={{ display:'flex', gap:'14px', alignItems:'center', marginBottom:'44px', flexWrap:'wrap' }}>
          <a href="#contact" style={{
            background:'#b8976a', color:navy,
            padding:'13px 28px', fontSize:'11px', letterSpacing:'0.14em',
            textDecoration:'none', fontFamily:'Jost', fontWeight:500, transition:'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background='#cead82'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(184,151,106,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='#b8976a'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
          >{c.hero.cta1.toUpperCase()}</a>
          <a href="#services" style={{
            color: isDark ? 'rgba(255,255,255,0.55)' : navy,
            fontSize:'11px', letterSpacing:'0.14em', textDecoration:'none',
            fontFamily:'Jost', fontWeight:400,
            display:'flex', alignItems:'center', gap:'10px', transition:'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color='#b8976a'}
          onMouseLeave={e => e.currentTarget.style.color= isDark ? 'rgba(255,255,255,0.55)' : navy}
          >
            {c.hero.cta2.toUpperCase()}
            <span style={{ display:'inline-block', width:'22px', height:'1px', background:'currentColor' }}></span>
          </a>
        </div>

        <div className="h5" style={{
          display:'flex', gap:'20px', flexWrap:'wrap',
          borderTop:'1px solid rgba(184,151,106,0.14)', paddingTop:'22px', marginBottom:'18px',
        }}>
          {c.trust.map((t, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'7px' }}>
              <StarIcon size={7} color='#b8976a' />
              <span style={{ fontSize:'9.5px', letterSpacing:'0.11em', color: isDark ? 'rgba(255,255,255,0.38)' : 'rgba(15,30,53,0.45)', fontFamily:'Jost' }}>
                {t.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <div className="h6" style={{
          display:'inline-flex', alignItems:'center', gap:'14px',
          padding:'12px 18px',
          background: isDark ? 'rgba(10,18,36,0.65)' : 'rgba(15,30,53,0.04)',
          border:'1px solid rgba(184,151,106,0.22)',
          backdropFilter:'blur(10px)',
          maxWidth:'fit-content',
        }}>
          <div>
            <div style={{ fontSize:'9px', letterSpacing:'0.2em', color:'rgba(184,151,106,0.75)', fontFamily:'Jost', marginBottom:'3px' }}>
              {c.pricing.label.toUpperCase()}
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:'5px' }}>
              <span style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'26px', fontWeight:300, color: isDark ? '#fff' : navy, lineHeight:1 }}>
                {c.pricing.price}
              </span>
              <span style={{ fontSize:'10px', color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(15,30,53,0.4)', fontFamily:'Jost' }}>
                {c.pricing.unit}
              </span>
            </div>
          </div>
          <div style={{ width:'1px', height:'30px', background:'rgba(184,151,106,0.22)' }} />
          <span style={{ fontSize:'10px', color: isDark ? 'rgba(255,255,255,0.32)' : 'rgba(15,30,53,0.4)', fontFamily:'Jost', fontWeight:300, maxWidth:'150px', lineHeight:1.5 }}>
            {c.pricing.note}
          </span>
        </div>
      </div>

      {/* TERRAIN LABEL */}
      <div className="hero-aside" style={{ position:'absolute', bottom:'48px', right:'48px', zIndex:5, textAlign:'right', pointerEvents:'none' }}>
        <div style={{ fontSize:'8px', letterSpacing:'0.28em', color:'rgba(184,151,106,0.45)', fontFamily:'Jost', marginBottom:'4px' }}>
          NO TERRAIN TOO DIFFICULT
        </div>
        <div style={{ fontSize:'7px', letterSpacing:'0.18em', color:'rgba(184,151,106,0.3)', fontFamily:'Jost' }}>
          WHITE-GLOVE · EVERY DESTINATION
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="hero-aside" style={{ position:'absolute', bottom:'32px', left:'96px', zIndex:5, display:'flex', alignItems:'center', gap:'10px', pointerEvents:'none' }}>
        <div style={{ width:'1px', height:'36px', background:'linear-gradient(to bottom, transparent, rgba(184,151,106,0.8))', animation:'scrollPulse 2s ease infinite' }} />
        <span style={{ fontSize:'9px', letterSpacing:'0.25em', color:'rgba(184,151,106,0.5)', fontFamily:'Jost' }}>SCROLL</span>
      </div>
    </section>
  );
}


  window.Hero = Hero;
})();
