(function () {
  const { useEffect, useState } = React;
  const { REVIEW_CARDS, REVIEW_PHOTOS } = window.CONRAD_EXPRESS_DATA;
  const { PhotoPlaceholder, StarIcon, SectionEyebrow, CornerMarks } = window;

/* ── TESTIMONIALS ── */
function Testimonials({ c, gold, navy, language }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const reviews = language === 'th' ? REVIEW_CARDS.th : REVIEW_CARDS.en;
  const reviewPhotos = REVIEW_PHOTOS;
  const total = reviews.length;

  /* Shared auto-advance for both carousels */
  useEffect(() => {
    const t = setInterval(() => setActiveIdx(i => (i + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total]);

  /* Normalized offset for infinite loop */
  function normAdj(i, active, tot) {
    let a = ((i - active) % tot + tot) % tot;
    if (a > Math.floor(tot / 2)) a -= tot;
    return a;
  }

  /* Card dimensions — scale to the viewport so the 3D carousel never overflows */
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const CARD_W = Math.min(400, Math.round(vw * 0.78));
  const CARD_H = Math.round(CARD_W * 1.3);
  const H_STEP = Math.round(CARD_W * 0.82);

  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 2 — DARK 3D PHOTO CARD CAROUSEL
      ══════════════════════════════════════════ */}
      <section id="testimonials" style={{
        background:`radial-gradient(ellipse 55% 40% at 8% 5%, rgba(226,181,111,0.07) 0%, transparent 55%), radial-gradient(ellipse 45% 55% at 92% 95%, rgba(226,181,111,0.05) 0%, transparent 55%), ${navy}`,
        padding:'120px 0',
        minHeight:'100vh', boxSizing:'border-box',
        display:'flex', flexDirection:'column', justifyContent:'center',
        position:'relative',
        overflow:'hidden',
      }}>
        <div style={{ position:'absolute', right:'-10vw', top:'50%', transform:'translateY(-50%)', opacity:0.02, pointerEvents:'none' }}>
          <StarIcon size={560} color={gold} />
        </div>

        {/* Heading */}
        <div style={{ textAlign:'center', marginBottom:'52px', padding:'0 24px', position:'relative', zIndex:2 }}>
          <SectionEyebrow label={c.testimonials.label} gold={gold} centered style={{ marginBottom:'16px', justifyContent:'center' }} />
          <h2 style={{
            fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(36px, 4.5vw, 56px)',
            fontWeight:300, color:'#fff', lineHeight:1.1, margin:0, whiteSpace:'pre-line',
          }}>{c.testimonials.title}</h2>
        </div>

        {/* 3D COVERFLOW STAGE */}
        <div style={{
          position:'relative',
          height:`${CARD_H + 80}px`,
          perspective:'1100px',
          perspectiveOrigin:'50% 50%',
          willChange:'transform',
        }}>
          {reviews.map((rev, i) => {
            const adj    = normAdj(i, activeIdx, total);
            const absOff = Math.abs(adj);
            const isActive  = adj === 0;
            const isVisible = absOff <= 2;
            const tx = adj * H_STEP;
            const tz = -absOff * 80;
            const ry = -adj * 20;
            const sc = isActive ? 1.04 : absOff===1 ? 0.84 : 0.70;
            const op = isActive ? 1 : absOff===1 ? 0.70 : isVisible ? 0.28 : 0;
            const zi = 10 - absOff;

            return (
              <div
                key={i}
                onClick={() => !isActive && setActiveIdx(i)}
                style={{
                  position:'absolute',
                  width:`${CARD_W}px`,
                  height:`${CARD_H}px`,
                  left:`calc(50% - ${CARD_W / 2}px)`,
                  top:'50%',
                  transform:`translateY(-50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`,
                  transformOrigin:'center center',
                  backfaceVisibility:'hidden',
                  opacity: op,
                  zIndex: zi,
                  transition:'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s cubic-bezier(0.16,1,0.3,1)',
                  cursor: isActive ? 'default' : 'pointer',
                  overflow:'visible',
                  willChange:'transform, opacity',
                }}
              >
                {/* Offset shadow block — HOW IT WORKS style */}
                <div style={{
                  position:'absolute',
                  top:'12px', left:'12px', right:'-12px', bottom:'-12px',
                  border:`1px solid ${gold}25`,
                  background:'rgba(10,22,40,0.45)',
                  zIndex:0,
                  transition:'opacity 0.5s',
                  opacity: isActive ? 1 : 0.5,
                }} />

                {/* Main photo frame */}
                <div style={{
                  position:'relative', zIndex:1,
                  width:'100%', height:'100%',
                  overflow:'hidden',
                  boxShadow: isActive
                    ? `0 0 0 1px ${gold}60, 0 0 32px ${gold}25, 0 20px 60px rgba(0,0,0,0.6)`
                    : '0 8px 40px rgba(0,0,0,0.5)',
                  transition:'box-shadow 0.5s',
                }}>
                  {/* Placeholder sits behind — shows if the photo is missing */}
                  <div style={{ position:'absolute', inset:0, zIndex:0 }}>
                    <PhotoPlaceholder label={`PORTRAIT · ${rev.author.toUpperCase()}`} height="100%" />
                  </div>
                  {reviewPhotos[i] && (
                    <img
                      src={reviewPhotos[i]}
                      alt={rev.author}
                      onError={(e) => { e.target.style.display = 'none'; }}
                      style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 22%', display:'block', zIndex:1 }}
                    />
                  )}

                  {/* Inner gold inset border */}
                  <div style={{
                    position:'absolute', inset:'14px',
                    border:`1px solid ${gold}35`,
                    pointerEvents:'none', zIndex:3,
                  }} />

                  <CornerMarks size={22} gold={gold} opacity={isActive ? 0.9 : 0.4} zIndex={4} />

                  {/* Review number overlay */}
                  <div style={{
                    position:'absolute', top:'20px', left:'20px', zIndex:4,
                    fontFamily:'Cormorant Garamond, serif', fontSize:'64px', fontWeight:300,
                    color:`${gold}${isActive ? '30' : '18'}`, lineHeight:1,
                    transition:'color 0.5s',
                    userSelect:'none',
                  }}>
                    0{i + 1}
                  </div>

                  {/* Active gold top bar */}
                  {isActive && (
                    <div style={{
                      position:'absolute', top:0, left:'20px', right:'20px', height:'2px',
                      background:`linear-gradient(to right, transparent, ${gold}, transparent)`,
                      pointerEvents:'none', zIndex:4,
                    }} />
                  )}

                  {/* Bottom caption bar */}
                  <div style={{
                    position:'absolute', bottom:0, left:0, right:0, zIndex:3,
                    padding:'32px 20px 18px',
                    background:'linear-gradient(to top, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.5) 55%, transparent 100%)',
                    display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'12px',
                  }}>
                    <div style={{ minWidth:0 }}>
                      <div style={{
                        fontSize:'9px', letterSpacing:'0.14em', fontWeight:500,
                        color:`${gold}cc`, fontFamily:'Jost',
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                      }}>{rev.tags[0]}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* NAVIGATION */}
        <div style={{ display:'flex', justifyContent:'center', marginTop:'8px' }}>
          <div style={{ display:'flex', gap:'8px' }}>
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{
                width: activeIdx===i ? '28px' : '6px', height:'2px',
                border:'none', cursor:'pointer', padding:0,
                background: activeIdx===i ? gold : 'rgba(255,255,255,0.2)',
                transition:'all 0.35s',
              }} />
            ))}
          </div>
        </div>
      </section>

    </>
  );
}


  window.Testimonials = Testimonials;
})();
