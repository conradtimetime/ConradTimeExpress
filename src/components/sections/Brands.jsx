(function () {
  const { SectionEyebrow } = window;

/* ── BRANDS / PARTNERS ──
   Static, centered wordmark row of partner brands shown right after the Hero.
   Brand names are plain text (edit them in copy.js › brands.items). To use real
   logo images instead, swap the <span> wordmark for an <img> and drop the file
   into brand-images/. */
function Brands({ c, gold, navy }) {
  const brands = c.brands;
  if (!brands || !brands.items || !brands.items.length) return null;

  return (
    <section id="brands" className="brands-section" style={{
      background:'#fff',
      padding:'56px 96px 60px',
      boxSizing:'border-box',
      boxShadow:'inset 0 -1px 0 rgba(184,151,106,0.12), inset 0 1px 0 rgba(184,151,106,0.08)',
      overflow:'hidden',
    }}>
      <style>{`
        #brands.brands-section {
          padding:56px 96px 60px !important;
        }
        #brands .brands-inner {
          width:100%;
          max-width:1200px;
          margin:0 auto;
          text-align:center;
        }
        #brands .brands-title {
          font-family:'Cormorant Garamond', serif;
          font-size:clamp(24px, 2.6vw, 34px);
          font-weight:300;
          color:${navy};
          line-height:1.15;
          margin:0 0 34px;
        }
        #brands .brands-row {
          display:flex;
          flex-wrap:wrap;
          align-items:center;
          justify-content:center;
          gap:22px 54px;
        }
        #brands .brand-mark {
          font-family:'Cormorant Garamond', serif;
          font-size:clamp(20px, 2vw, 27px);
          font-weight:500;
          letter-spacing:0.04em;
          color:rgba(15,30,53,0.42);
          white-space:nowrap;
          transition:color 0.28s ease, opacity 0.28s ease;
          cursor:default;
        }
        #brands .brand-mark:hover {
          color:${navy};
        }
        #brands .brand-dot {
          width:5px;
          height:5px;
          border-radius:50%;
          background:${gold};
          opacity:0.5;
          flex:0 0 auto;
        }
        @media (max-width:1024px) {
          #brands.brands-section { padding:48px 40px 52px !important; }
          #brands .brands-row { gap:18px 40px; }
        }
        @media (max-width:767px) {
          #brands.brands-section { padding:40px 22px 44px !important; }
          #brands .brands-title { margin-bottom:26px; }
          #brands .brands-row { gap:16px 26px; }
          #brands .brand-dot { display:none; }
        }
      `}</style>
      <div className="brands-inner reveal">
        <SectionEyebrow label={brands.label} gold={gold} centered />
        {brands.title && <h2 className="brands-title">{brands.title}</h2>}
        <div className="brands-row">
          {brands.items.map((name, i) => (
            <React.Fragment key={name}>
              {i > 0 && <span className="brand-dot" aria-hidden="true" />}
              <span className="brand-mark">{name}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

  window.Brands = Brands;
})();
