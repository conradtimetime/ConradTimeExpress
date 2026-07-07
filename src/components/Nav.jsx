(function () {
  const { useState } = React;
  const { COPY } = window.CONRAD_EXPRESS_DATA;

/* ── NAV ── */
function Nav({ c, gold, navy, scrolled, lang, setLang }) {
  const [menuOpen, setMenuOpen] = useState(false);
  /* Each link carries BOTH languages so its box can size to the wider of the two —
     guarantees the navbar never reflows / shifts when language changes. */
  const links = [
    { en: COPY.en.nav.services, th: COPY.th.nav.services, href: '#services' },
    { en: COPY.en.nav.about,    th: COPY.th.nav.about,    href: '#why' },
    { en: COPY.en.nav.process,  th: COPY.th.nav.process,  href: '#process' },
    { en: COPY.en.nav.packages, th: COPY.th.nav.packages, href: '#packages' },
    { en: COPY.en.nav.contact,  th: COPY.th.nav.contact,  href: '#contact' },
  ];
  const nextLanguage = lang === 'en'
    ? { code:'th', label:'Switch to Thai', flag:'brand-images/flag-th.svg' }
    : { code:'en', label:'Switch to English', flag:'brand-images/flag-us.svg' };
  const flagStyle = {
    width:'44px',
    height:'29px',
    display:'block',
    objectFit:'cover',
  };
  const languageButtonStyle = {
    background:'transparent',
    border:'none',
    padding:0,
    width:'44px',
    height:'29px',
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    cursor:'pointer',
    transition:'opacity 0.2s, transform 0.2s',
  };
  return (
    <nav className="ce-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 48px',
      height: '72px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? `${navy}f2` : 'transparent',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
      borderBottom: scrolled ? `1px solid rgba(226,181,111,0.18)` : 'none',
      boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(226,181,111,0.12) inset' : 'none',
      transition: 'all 0.4s ease',
    }}>
      {/* Logo */}
      <a href="#" style={{ display:'flex', alignItems:'center', textDecoration:'none' }}>
        <span style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'18px', letterSpacing:'0.18em', color:'#fff', fontWeight:500 }}>
          CONRAD EXPRESS
        </span>
      </a>

      {/* Desktop Links */}
      <div className="nav-links" style={{ display:'flex', alignItems:'center', gap:'36px' }}>
        {links.map(l => (
          <a key={l.href} href={l.href} style={{
            color:'rgba(255,255,255,0.75)', textDecoration:'none',
            fontSize:'12px', letterSpacing:'0.15em', fontWeight:400,
            transition:'color 0.2s', display:'grid', placeItems:'center',
          }}
          onMouseEnter={e => e.currentTarget.style.color = gold}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
          >
            {['en','th'].map(L => (
              <span key={L} style={{
                gridArea:'1 / 1', whiteSpace:'nowrap', color:'inherit',
                visibility: lang===L ? 'visible' : 'hidden',
              }}>{l[L].toUpperCase()}</span>
            ))}
          </a>
        ))}

        {/* Language toggle */}
        <button
          type="button"
          onClick={() => setLang(nextLanguage.code)}
          aria-label={nextLanguage.label}
          title={nextLanguage.label}
          style={languageButtonStyle}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.78'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <img src={nextLanguage.flag} alt="" aria-hidden="true" style={flagStyle} />
        </button>

        <a href="#contact" style={{
          background: gold, color: navy,
          padding: '10px 24px', fontSize: '11px', letterSpacing: '0.12em',
          textDecoration: 'none', fontWeight: 500,
          transition: 'all 0.2s', display:'grid', placeItems:'center',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#fff0c9'; }}
        onMouseLeave={e => { e.currentTarget.style.background = gold; }}
        >
          {['en','th'].map(L => (
            <span key={L} style={{
              gridArea:'1 / 1', whiteSpace:'nowrap',
              visibility: lang===L ? 'visible' : 'hidden',
            }}>{COPY[L].nav.cta.toUpperCase()}</span>
          ))}
        </a>
      </div>

      {/* Mobile hamburger */}
      <button className="nav-burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu" style={{
        background:'transparent', border:'none', cursor:'pointer',
        flexDirection:'column', justifyContent:'center', alignItems:'center', gap:'5px',
        width:'42px', height:'42px', padding:'8px',
      }}>
        <span style={{ display:'block', width:'22px', height:'1.5px', background:gold, transition:'transform 0.3s, opacity 0.3s', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
        <span style={{ display:'block', width:'22px', height:'1.5px', background:gold, opacity: menuOpen ? 0 : 1, transition:'opacity 0.2s' }} />
        <span style={{ display:'block', width:'22px', height:'1.5px', background:gold, transition:'transform 0.3s, opacity 0.3s', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
      </button>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div style={{
          position:'absolute', top:'72px', left:0, right:0,
          background:`${navy}f7`, backdropFilter:'blur(16px) saturate(180%)',
          borderBottom:`1px solid rgba(226,181,111,0.2)`,
          boxShadow:'0 14px 36px rgba(0,0,0,0.45)',
          display:'flex', flexDirection:'column', padding:'10px 22px 22px',
        }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{
              color:'rgba(255,255,255,0.82)', textDecoration:'none',
              fontSize:'13px', letterSpacing:'0.14em', padding:'15px 4px',
              borderBottom:'1px solid rgba(255,255,255,0.06)',
            }}>{l[lang].toUpperCase()}</a>
          ))}
          <div style={{ display:'flex', gap:'12px', alignItems:'center', marginTop:'18px' }}>
            <button
              type="button"
              onClick={() => setLang(nextLanguage.code)}
              aria-label={nextLanguage.label}
              title={nextLanguage.label}
              style={languageButtonStyle}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.78'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
            >
              <img src={nextLanguage.flag} alt="" aria-hidden="true" style={flagStyle} />
            </button>
            <a href="#contact" onClick={() => setMenuOpen(false)} style={{
              flex:1, textAlign:'center', background:gold, color:navy,
              padding:'13px 20px', fontSize:'11px', letterSpacing:'0.12em',
              textDecoration:'none', fontWeight:500, fontFamily:'Jost, sans-serif',
            }}>{COPY[lang].nav.cta.toUpperCase()}</a>
          </div>
        </div>
      )}
    </nav>
  );
}


  window.Nav = Nav;
})();
