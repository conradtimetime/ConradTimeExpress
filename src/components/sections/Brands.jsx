(function () {
  const { SectionEyebrow } = window;

/* ── BRANDS / PARTNERS ──
   Static, centered wordmark row of partner brands shown right after the Hero.
   Brand names are plain text (edit them in copy.js › brands.items). To use real
   logo images instead, swap the <span> wordmark for an <img> and drop the file
   into brand-images/. */
function Brands({ c, gold, navy }) {
  const brands = c.brands;
  const brandLogos = [
    { src: 'brand-images/Logo-Mesub-normalized.png', alt: 'Mesub' },
    { src: 'brand-images/Logo-Khunhua-normalized.png', alt: 'Khunhua' },
    { src: 'brand-images/Logo-Conradtime-normalized.png', alt: 'Conrad Time' },
    { src: 'brand-images/Logo-Timepiece-normalized.png', alt: 'Timepiece' },
    { src: 'brand-images/Logo-Voyage-normalized.png', alt: 'Voyage' },
  ];
  if (!brands || !brandLogos.length) return null;

  return (
    <section id="brands" className="brands-section" style={{
      background:'linear-gradient(135deg, #f9e5b8 0%, #e2b56f 42%, #fff0c9 58%, #c99752 100%)',
      padding:'56px 96px 40px',
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
          padding:56px 96px 40px !important;
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
          max-width:1500px;
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
          flex-wrap:nowrap;
          align-items:center;
          justify-content:center;
          gap:clamp(16px, 1.45vw, 28px);
          overflow-x:auto;
          padding:4px 2px 8px;
          scrollbar-width:none;
        }
        #brands .brands-row::-webkit-scrollbar {
          display:none;
        }
        #brands .brand-logo-card {
          flex:0 0 clamp(176px, 14vw, 244px);
          width:clamp(176px, 14vw, 244px);
          height:clamp(104px, 7.2vw, 126px);
          display:flex;
          align-items:center;
          justify-content:center;
          padding:12px 18px;
          border:1px solid rgba(15,30,53,0.18);
          border-radius:8px;
          background:rgba(255,255,255,0.28);
          box-shadow:0 1px 0 rgba(255,255,255,0.38) inset, 0 18px 42px rgba(70,43,12,0.13);
          backdrop-filter:blur(8px);
          transition:transform 0.28s ease, background 0.28s ease, box-shadow 0.28s ease;
          overflow:hidden;
        }
        #brands .brand-logo-card:hover {
          transform:translateY(-2px);
          background:rgba(255,255,255,0.38);
          box-shadow:0 1px 0 rgba(255,255,255,0.48) inset, 0 22px 48px rgba(70,43,12,0.18);
        }
        #brands .brand-logo {
          display:block;
          width:100%;
          height:100%;
          object-fit:contain;
          transform:scale(1.3);
          transform-origin:center;
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
          #brands .brands-inner { max-width:calc(100vw - 80px); }
          #brands .brands-row { justify-content:flex-start; gap:16px; }
          #brands .brand-logo-card { flex-basis:176px; width:176px; height:96px; }
        }
        @media (max-width:767px) {
          #brands.brands-section { padding:40px 22px 44px !important; }
          #brands .brands-title { font-size:clamp(30px, 10vw, 42px); margin-bottom:28px; }
          #brands .brands-inner { max-width:calc(100vw - 44px); }
          #brands .brands-row { gap:14px; padding-left:2px; padding-right:2px; }
          #brands .brand-logo-card { flex-basis:168px; width:168px; height:92px; padding:10px 14px; }
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
          {brandLogos.map((logo) => (
            <div className="brand-logo-card" key={logo.src}>
              <img className="brand-logo" src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

  window.Brands = Brands;
})();
