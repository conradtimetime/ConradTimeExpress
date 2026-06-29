(function () {
  const { useState } = React;
  const { StarIcon, SectionEyebrow, CornerMarks } = window;
  const { processImages } = window.CONRAD_EXPRESS_DATA.ASSETS;

/* ── PROCESS ── */
function Process({ c, gold, navy }) {
  const [active, setActive] = useState(0);
  const activeImage = processImages[active];

  return (
    <section id="process" className="process-section" style={{
      background:'var(--cream)',
      padding:'96px 96px 72px',
      minHeight:'100vh',
      height:'100vh',
      boxSizing:'border-box',
      display:'flex',
      alignItems:'flex-start',
      overflow:'hidden',
    }}>
      <style>{`
        #process.process-section { padding:96px 96px 72px !important; }
        #process .process-heading { margin-bottom:58px !important; }
        #process .process-grid { gap:72px !important; }
        #process .process-step { padding:23px 0 !important; }
        #process .process-visual-shell { width:86% !important; }
        @media (max-width:1440px) {
          #process.process-section { padding:92px 64px 64px !important; }
          #process .process-heading { margin-bottom:50px !important; }
          #process .process-grid { gap:64px !important; }
          #process .process-step { padding:22px 0 !important; }
          #process .process-visual-shell { width:84% !important; }
        }
        @media (max-height:820px) and (min-width:768px) {
          #process.process-section { padding:84px 64px 38px !important; }
          #process .process-heading { margin-bottom:34px !important; }
          #process .process-title { font-size:clamp(38px, 5vw, 54px) !important; }
          #process .process-grid { gap:54px !important; }
          #process .process-step { padding:17px 0 !important; gap:24px !important; }
          #process .process-step-title { font-size:20px !important; margin-bottom:6px !important; }
          #process .process-step-copy { font-size:12.5px !important; line-height:1.55 !important; max-height:56px !important; }
          #process .process-visual-shell { width:78% !important; }
        }
        @media (max-width:1024px) {
          #process.process-section {
            height:auto !important;
            min-height:100vh !important;
            padding:88px 40px 72px !important;
            overflow:visible !important;
          }
          #process .process-grid { grid-template-columns:1fr !important; gap:48px !important; }
          #process .process-visual-shell { width:min(620px, 88%) !important; }
        }
        @media (max-width:767px) {
          #process.process-section { padding:72px 22px 58px !important; }
          #process .process-heading { margin-bottom:36px !important; }
          #process .process-title { font-size:clamp(40px, 12vw, 54px) !important; }
          #process .process-step { padding:20px 0 !important; gap:18px !important; }
          #process .process-visual-shell { width:94% !important; }
        }
      `}</style>
      <div style={{ width:'100%', maxWidth:'1400px', margin:'0 auto' }}>
        <div className="process-heading" style={{ marginBottom:'58px', textAlign:'center' }}>
          <SectionEyebrow label={c.process.label} gold={gold} centered />
          <h2 className="process-title" style={{
            fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(40px, 5vw, 64px)',
            fontWeight:300, color:navy, lineHeight:1.1, whiteSpace:'pre-line', margin:'0 auto',
          }}>{c.process.title}</h2>
        </div>

        <div className="g-split process-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'72px', alignItems:'center' }}>
          {/* Steps list */}
          <div className="reveal-left" style={{ display:'flex', flexDirection:'column', gap:'0' }}>
            {c.process.steps.map((step, i) => (
              <div key={i}
                className="process-step"
                onClick={() => setActive(i)}
                style={{
                  padding:'23px 0', cursor:'pointer',
                  borderBottom:`1px solid rgba(15,30,53,0.1)`,
                  display:'flex', gap:'32px', alignItems:'flex-start',
                  transition:'all 0.3s',
                }}>
                <span style={{
                  fontFamily:'Cormorant Garamond, serif', fontSize:'14px',
                  color: active===i ? gold : 'rgba(15,30,53,0.3)',
                  fontStyle:'italic', minWidth:'28px', transition:'color 0.3s',
                }}>{step.n}</span>
                <div>
                  <h4 className="process-step-title" style={{
                    fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:400,
                    color: active===i ? navy : 'rgba(15,30,53,0.5)',
                    marginBottom:'8px', transition:'color 0.3s',
                  }}>{step.title}</h4>
                  <p className="process-step-copy" style={{
                    fontSize:'13px', lineHeight:1.7, fontFamily:'Jost', fontWeight:300,
                    color: active===i ? 'rgba(15,30,53,0.65)' : 'transparent',
                    maxHeight: active===i ? '80px' : '0', overflow:'hidden',
                    transition:'all 0.4s ease',
                  }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Active step visual container */}
          <div className="reveal-right" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div className="process-visual-shell" style={{ position:'relative', width:'86%' }}>

              {/* Offset shadow block */}
              <div style={{
                position:'absolute',
                top:'18px', left:'18px', right:'-18px', bottom:'-18px',
                border:`1px solid ${gold}25`,
                background:'rgba(10,34,62,0.18)',
                borderRadius:'8px',
                zIndex:0,
              }} />

              {/* Empty image frame */}
              <div style={{
                position:'relative', zIndex:1,
                aspectRatio:'4/3',
                overflow:'hidden',
                borderRadius:'8px',
                boxShadow:'0 18px 45px rgba(8,24,45,0.24)',
                background:`
                  radial-gradient(ellipse 58% 48% at 20% 18%, rgba(77,142,199,0.30) 0%, transparent 68%),
                  radial-gradient(ellipse 62% 54% at 76% 70%, rgba(184,151,106,0.14) 0%, transparent 62%),
                  linear-gradient(135deg, #07172d 0%, #0c2746 54%, #123a5d 100%)
                `,
              }}>
                <div style={{
                  position:'absolute', inset:0,
                  backgroundImage:`
                    linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)
                  `,
                  backgroundSize:'72px 48px',
                  opacity:0.50,
                  zIndex:0,
                }} />

                <div style={{
                  position:'absolute', inset:0,
                  backgroundImage:'repeating-linear-gradient(135deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 18px)',
                  opacity:0.35,
                  zIndex:0,
                }} />

                <div style={{
                  position:'absolute', inset:'22px',
                  border:`1px solid rgba(255,255,255,0.08)`,
                  boxShadow:`inset 0 0 0 1px rgba(184,151,106,0.08)`,
                  pointerEvents:'none',
                  zIndex:0,
                }} />

                <div style={{
                  position:'absolute',
                  right:'20px',
                  top:'16px',
                  zIndex:1,
                  opacity:0.10,
                  pointerEvents:'none',
                }}>
                  <StarIcon size={132} color="#ffffff" />
                </div>

                <div style={{
                  position:'absolute',
                  left:'26px',
                  bottom:'76px',
                  zIndex:1,
                  transform:'rotate(-90deg)',
                  transformOrigin:'left bottom',
                  fontSize:'8px',
                  letterSpacing:'0.34em',
                  color:'rgba(255,255,255,0.18)',
                  fontFamily:'Jost',
                  whiteSpace:'nowrap',
                  pointerEvents:'none',
                }}>
                  CONRAD EXPRESS
                </div>

                {activeImage && activeImage.fit === 'cover' && (
                  <img
                    src={activeImage.src}
                    alt={c.process.steps[active].title}
                    style={{
                      position:'absolute',
                      inset:0,
                      width:'100%',
                      height:'100%',
                      objectFit:'cover',
                      objectPosition:activeImage.objectPosition || 'center',
                      zIndex:1,
                      pointerEvents:'none',
                    }}
                  />
                )}

                {activeImage && activeImage.fit !== 'cover' && (
                  <div style={{
                      position:'absolute',
                      top:'clamp(12px, 4%, 18px)',
                      bottom:'clamp(54px, 16%, 64px)',
                      left:'18px',
                      right:'18px',
                      display:'flex',
                      alignItems:'center',
                      justifyContent:'center',
                      zIndex:2,
                      pointerEvents:'none',
                    }}>
                    <img
                      src={activeImage.src}
                      alt={c.process.steps[active].title}
                      style={{
                        height:'100%',
                        width:'auto',
                        maxWidth:activeImage.maxWidth,
                        objectFit:'contain',
                        objectPosition:'center',
                        display:'block',
                        filter:'drop-shadow(0 18px 26px rgba(15,30,53,0.18))',
                      }}
                    />
                  </div>
                )}

                {/* Subtle blue watermark veil over the visual */}
                <div style={{
                  position:'absolute',
                  inset:0,
                  zIndex:3,
                  pointerEvents:'none',
                  background:`
                    linear-gradient(120deg, rgba(4,18,34,0.18) 0%, transparent 34%, rgba(35,90,132,0.16) 100%),
                    repeating-linear-gradient(135deg, rgba(255,255,255,0.024) 0px, rgba(255,255,255,0.024) 1px, transparent 1px, transparent 22px)
                  `,
                  mixBlendMode:'soft-light',
                }} />

                <div style={{
                  position:'absolute',
                  right:'24px',
                  bottom:'58px',
                  zIndex:3,
                  fontSize:'9px',
                  letterSpacing:'0.24em',
                  color:'rgba(255,255,255,0.13)',
                  fontFamily:'Jost',
                  pointerEvents:'none',
                }}>
                  SECURE TRANSIT
                </div>

                {/* Inner gold inset border */}
                <div style={{
                  position:'absolute', inset:'16px',
                  border:`1px solid ${gold}35`,
                  pointerEvents:'none', zIndex:4,
                }} />

                <CornerMarks size={28} gold={gold} opacity={0.8} zIndex={5} />

                {/* Step number overlay */}
                <div style={{
                  position:'absolute', top:'24px', left:'24px', zIndex:5,
                  fontFamily:'Cormorant Garamond, serif', fontSize:'56px', fontWeight:300,
                  color:`${gold}30`, lineHeight:1,
                  textShadow:'0 2px 12px rgba(0,0,0,0.12)',
                }}>
                  {c.process.steps[active].n}
                </div>

                {/* Bottom caption bar */}
                <div style={{
                  position:'absolute', bottom:0, left:0, right:0, zIndex:4,
                  padding:'28px 20px 16px',
                  background:'linear-gradient(to top, rgba(10,22,40,0.88) 0%, transparent 100%)',
                  display:'flex', alignItems:'flex-end', justifyContent:'space-between',
                }}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:'11px', letterSpacing:'0.2em', color:`${gold}cc`, fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', marginBottom:'2px' }}>
                      {c.process.steps[active].title}
                    </div>
                    <div style={{ fontSize:'9px', letterSpacing:'0.15em', color:'rgba(255,255,255,0.45)', fontFamily:'Jost', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      {c.process.steps[active].desc.substring(0, 48)}…
                    </div>
                  </div>
                  <div style={{
                    width:'14px', height:'14px', flexShrink:0, marginLeft:'12px',
                    transform:'rotate(45deg)',
                    border:`1px solid ${gold}80`,
                    opacity:0.5,
                  }} />
                </div>
              </div>

              {/* Side label */}
              <div style={{
                position:'absolute', right:'-34px', top:'50%',
                transform:'translateY(-50%) rotate(90deg)',
                fontSize:'9px', letterSpacing:'0.3em',
                color:`${gold}40`, fontFamily:'Jost', whiteSpace:'nowrap', zIndex:5,
              }}>
                {c.misc.howItWorks}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


  window.Process = Process;
})();
