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
      background:'linear-gradient(135deg, #f9e5b8 0%, #e2b56f 42%, #fff0c9 58%, #c99752 100%)',
      padding:'56px 96px 60px',
      boxSizing:'border-box',
      boxShadow:'inset 0 1px 0 rgba(255,255,255,0.48), inset 0 -1px 0 rgba(15,30,53,0.18), 0 18px 54px rgba(226,181,111,0.2)',
      overflow:'hidden',
      position:'relative',
      isolation:'isolate',
    }}>
      <style>{`
        #brands.brands-section {
          background:
            linear-gradient(115deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.12) 24%, rgba(255,255,255,0) 42%),
            repeating-linear-gradient(135deg, rgba(255,255,255,0.13) 0 1px, rgba(255,255,255,0) 1px 24px),
            linear-gradient(135deg, #f9e5b8 0%, #e2b56f 42%, #fff0c9 58%, #c99752 100%) !important;
          padding:56px 96px 60px !important;
        }
        #brands.brands-section::before {
          content:'';
          position:absolute;
          inset:-20% -30%;
          z-index:0;
          pointer-events:none;
          background:linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.34) 45%, rgba(255,255,255,0.16) 54%, transparent 68%);
          transform:translateX(-115%) skewX(-14deg);
          animation:brandsSheen 7.5s ease-in-out infinite;
        }
        #brands.brands-section::after {
          content:'';
          position:absolute;
          inset:10px 16px;
          z-index:0;
          pointer-events:none;
          border-top:1px solid rgba(15,30,53,0.18);
          border-bottom:1px solid rgba(255,255,255,0.28);
        }
        @keyframes brandsSheen {
          0%, 34% { opacity:0; transform:translateX(-115%) skewX(-14deg); }
          48%, 62% { opacity:1; }
          78%, 100% { opacity:0; transform:translateX(115%) skewX(-14deg); }
        }
        #brands .brands-inner {
          position:relative;
          z-index:1;
          width:100%;
          max-width:1200px;
          margin:0 auto;
          text-align:center;
        }
        #brands .brands-title {
          font-family:'Cormorant Garamond', serif;
          font-size:clamp(34px, 4vw, 58px);
          font-weight:400;
          color:${navy};
          line-height:1.05;
          margin:0 0 38px;
          text-shadow:0 1px 0 rgba(255,255,255,0.34), 0 14px 34px rgba(70,43,12,0.18);
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
          color:rgba(15,30,53,0.74);
          white-space:nowrap;
          text-shadow:0 1px 0 rgba(255,255,255,0.24);
          transition:color 0.28s ease, opacity 0.28s ease, transform 0.28s ease;
          cursor:default;
        }
        #brands .brand-mark:hover {
          color:${navy};
          transform:translateY(-2px);
        }
        #brands .brand-dot {
          width:5px;
          height:5px;
          border-radius:50%;
          background:${navy};
          opacity:0.35;
          flex:0 0 auto;
        }
        @media (max-width:1024px) {
          #brands.brands-section { padding:48px 40px 52px !important; }
          #brands .brands-row { gap:18px 40px; }
        }
        @media (max-width:767px) {
          #brands.brands-section { padding:40px 22px 44px !important; }
          #brands .brands-title { font-size:clamp(30px, 10vw, 42px); margin-bottom:28px; }
          #brands .brands-row { gap:16px 26px; }
          #brands .brand-dot { display:none; }
        }
        @media (prefers-reduced-motion: reduce) {
          #brands.brands-section::before {
            animation:none;
            opacity:0.16;
            transform:none;
          }
        }
      `}</style>
      <div className="brands-inner reveal">
        <SectionEyebrow label={brands.label} gold={navy} centered />
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
