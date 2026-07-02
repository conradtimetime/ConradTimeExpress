(function () {
  const { useState } = React;
  const { StarIcon, SectionEyebrow, SECTION_FRAME, getSectionFrameStyle, getSectionFrameCss } = window;

  /* Line icons per feature, keyed by pillars.items[].icon. Stroke uses the gold accent. */
  const FeatureIcon = (key, color) => {
    const p = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
    const paths = {
      privacy: (<g {...p}><path d="M24 6l14 5v9c0 9-6 15-14 18-8-3-14-9-14-18v-9z" /><path d="M18 24l4 4 8-9" /></g>),
      time: (<g {...p}><circle cx="24" cy="24" r="16" /><path d="M24 14v10l7 4" /></g>),
      expert: (<g {...p}><path d="M14 10h20l8 10-18 20L6 20z" /><path d="M6 20h36M24 40 14 20l4-10M24 40l10-20-4-10M18 20l6-10 6 10" /></g>),
      coverage: (<g {...p}><path d="M24 42s12-11 12-20a12 12 0 1 0-24 0c0 9 12 20 12 20z" /><circle cx="24" cy="22" r="5" /></g>),
      tracking: (<g {...p}><circle cx="21" cy="21" r="12" /><path d="M30 30l10 10" /><path d="M21 15v6l4 3" /></g>),
      accountable: (<g {...p}><rect x="12" y="10" width="24" height="30" rx="2" /><path d="M18 10V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" /><path d="M17 24l4 4 8-9" /></g>),
    };
    return (
      <svg width="30" height="30" viewBox="0 0 48 48" aria-hidden="true">{paths[key] || paths.privacy}</svg>
    );
  };

/* ── WHY US ── */
function WhyUs({ c, gold, navy }) {
  const [hovered, setHovered] = useState(null);
  const features = c.pillars.items;

  return (
    <section id="why" className="why-section" style={getSectionFrameStyle({
      background: `linear-gradient(160deg, ${navy} 0%, #0a1628 100%)`,
      padding:SECTION_FRAME.padding.standard.desktop,
      position:'relative', overflow:'hidden',
      display:'flex', flexDirection:'column', justifyContent:'center',
      boxShadow:'inset 0 1px 0 rgba(226,181,111,0.1), inset 0 -1px 0 rgba(226,181,111,0.06)',
    })}>
      <style>{`
        #why .why-inner { width:100%; max-width:1240px; margin:0 auto; position:relative; z-index:2; }
        #why .why-header { text-align:center; margin-bottom:64px; }
        #why .why-heading {
          font-family:'Cormorant Garamond', serif;
          font-size:clamp(40px, 4vw, 60px);
          font-weight:300; color:#fff; line-height:1.1;
          white-space:pre-line; margin:0 auto;
        }
        #why .why-sub {
          margin:22px auto 0; max-width:640px;
          font-size:15px; line-height:1.8; font-weight:300;
          color:rgba(255,255,255,0.55); font-family:Jost;
        }
        #why .why-grid {
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          column-gap:52px;
          row-gap:52px;
        }
        #why .why-feature {
          text-align:left;
          padding-top:26px;
          border-top:1px solid rgba(226,181,111,0.16);
          transition:border-color 0.32s ease;
        }
        #why .why-feature.is-hover { border-top-color:${gold}; }
        #why .why-feature-icon {
          width:58px; height:58px;
          display:flex; align-items:center; justify-content:center;
          border:1px solid rgba(226,181,111,0.3);
          border-radius:12px;
          margin-bottom:22px;
          background:rgba(226,181,111,0.05);
          transition:border-color 0.32s ease, background 0.32s ease, box-shadow 0.32s ease;
        }
        #why .why-feature.is-hover .why-feature-icon {
          border-color:${gold};
          background:rgba(226,181,111,0.12);
          box-shadow:0 0 24px rgba(226,181,111,0.22);
        }
        #why .why-feature-title {
          font-family:'Cormorant Garamond', serif;
          font-size:25px; font-weight:500; line-height:1.2;
          color:#fff; margin:0 0 6px;
        }
        #why .why-feature-sub {
          font-family:Jost, sans-serif;
          font-size:13px; font-weight:500; letter-spacing:0.02em;
          color:${gold}; margin:0 0 12px;
        }
        #why .why-feature-desc {
          font-family:Jost, sans-serif;
          font-size:13.5px; line-height:1.68; font-weight:300;
          color:rgba(255,255,255,0.5); margin:0;
        }
        @media (max-width:1440px) {
          #why .why-header { margin-bottom:54px; }
          #why .why-grid { column-gap:44px; row-gap:46px; }
        }
        @media (max-width:1024px) {
          #why .why-header { margin-bottom:48px; }
          #why .why-grid { grid-template-columns:repeat(2, 1fr); column-gap:40px; row-gap:44px; }
        }
        @media (max-width:767px) {
          #why .why-header { margin-bottom:40px; }
          #why .why-heading { font-size:clamp(38px, 11vw, 52px); }
          #why .why-sub { font-size:14px; }
          #why .why-grid { grid-template-columns:1fr; row-gap:34px; }
          #why .why-feature { padding-top:22px; }
          #why .why-feature-icon { width:52px; height:52px; margin-bottom:18px; }
          #why .why-feature-title { font-size:23px; }
        }
        ${getSectionFrameCss('#why.why-section')}
      `}</style>

      <div style={{ position:'absolute', right:'-10vw', bottom:'-10vw', opacity:0.03, pointerEvents:'none' }}>
        <StarIcon size={800} color={gold} />
      </div>

      <div className="why-inner">
        <div className="reveal why-header">
          <SectionEyebrow label={c.why.label} gold={gold} centered />
          <h2 className="why-heading">{c.why.title}</h2>
        </div>

        <div className="reveal-stagger why-grid">
          {features.map((f, i) => (
            <div key={i}
              className={`why-feature${hovered === i ? ' is-hover' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}>
              <div className="why-feature-icon">{FeatureIcon(f.icon, gold)}</div>
              <h3 className="why-feature-title">{f.title}</h3>
              {f.sub && <p className="why-feature-sub">{f.sub}</p>}
              <p className="why-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


  window.WhyUs = WhyUs;
})();
