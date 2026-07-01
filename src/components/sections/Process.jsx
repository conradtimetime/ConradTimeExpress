(function () {
  const { useState } = React;
  const { StarIcon, SectionEyebrow, CornerMarks } = window;
  const { processImages } = window.CONRAD_EXPRESS_DATA.ASSETS;

/* ── PROCESS ── */
function Process({ c, gold, navy, language }) {
  const [active, setActive] = useState(0);
  const activeImage = processImages[active];
  const totalSteps = c.process.steps.length;
  const progressValue = totalSteps ? ((active + 1) / totalSteps) * 100 : 0;
  const progressText = language === 'th'
    ? `ขั้นตอน ${active + 1}/${totalSteps}`
    : `Step ${active + 1}/${totalSteps}`;

  return (
    <section id="process" className="process-section" style={{
      background:'#fff',
      padding:'42px 96px 58px',
      minHeight:'calc(100vh - 72px)',
      scrollMarginTop:'72px',
      boxSizing:'border-box',
      display:'flex',
      alignItems:'flex-start',
      overflow:'hidden',
      boxShadow:'inset 0 -1px 0 rgba(184,151,106,0.12), inset 0 1px 0 rgba(184,151,106,0.08)',
    }}>
      <style>{`
        #process.process-section {
          background:#fff !important;
          scroll-margin-top:72px !important;
          padding:42px 96px 58px !important;
          min-height:calc(100vh - 72px) !important;
          height:auto !important;
          align-items:stretch !important;
        }
        #process > div { display:flex; flex-direction:column; justify-content:space-between; }
        #process .process-heading {
          height:176px !important;
          margin-bottom:24px !important;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-start;
        }
        #process .process-title {
          min-height:124px !important;
          max-width:760px;
          display:flex;
          align-items:center;
          justify-content:center;
        }
        #process .process-grid { gap:56px !important; align-items:center !important; }
        #process .process-onboarding {
          max-width:560px;
          width:100%;
          height:526px;
          margin-right:auto;
          display:flex;
          flex-direction:column;
        }
        #process .process-progress-row {
          display:flex;
          align-items:center;
          justify-content:flex-end;
          gap:18px;
          height:24px;
          margin-bottom:20px;
        }
        #process .process-progress-track {
          width:148px;
          height:6px;
          border-radius:999px;
          background:rgba(15,30,53,0.10);
          overflow:hidden;
        }
        #process .process-progress-fill {
          height:100%;
          border-radius:inherit;
          background:var(--gold);
          transition:width 0.35s cubic-bezier(0.16,1,0.3,1);
        }
        #process .process-step-list {
          list-style:none;
          display:flex;
          flex-direction:column;
          gap:14px;
          margin:0;
          padding:0;
        }
        #process .process-step-card {
          width:100%;
          height:110px;
          min-height:110px;
          text-align:left;
          border-radius:8px;
          border:1px solid rgba(15,30,53,0.12);
          background:rgba(255,255,255,0.76);
          padding:18px 20px;
          cursor:pointer;
          transition:border-color 0.25s ease, background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        #process .process-step-card:hover,
        #process .process-step-card:focus-visible {
          border-color:rgba(184,151,106,0.54);
          background:#fff;
          outline:none;
          transform:translateY(-1px);
        }
        #process .process-step-card.is-active {
          border-color:rgba(15,30,53,0.22);
          background:#fff;
          box-shadow:0 18px 38px rgba(15,30,53,0.08);
        }
        #process .process-step-inner { display:flex; align-items:flex-start; gap:20px; }
        #process .process-step-marker {
          width:48px;
          height:44px;
          flex:0 0 48px;
          display:flex;
          align-items:flex-start;
          justify-content:flex-start;
          font-family:'Cormorant Garamond', serif;
          font-size:28px;
          line-height:1;
          font-weight:500;
          color:rgba(15,30,53,0.58);
        }
        #process .process-step-check {
          width:34px;
          height:34px;
          flex:0 0 48px;
          color:var(--gold);
        }
        #process .process-step-title {
          font-family:'Cormorant Garamond', serif;
          font-size:22px;
          font-weight:500;
          color:rgba(15,30,53,0.62);
          margin:0 0 6px;
          transition:color 0.25s ease, opacity 0.25s ease;
        }
        #process .process-step-copy {
          font-size:13px;
          line-height:1.62;
          font-family:'Jost';
          font-weight:300;
          color:rgba(15,30,53,0.62);
          margin:0;
          display:-webkit-box;
          -webkit-line-clamp:2;
          -webkit-box-orient:vertical;
          overflow:hidden;
        }
        #process .process-step-card.is-active .process-step-title { color:var(--navy); }
        #process .process-step-card.is-active .process-step-marker { color:var(--gold); }
        #process .process-step-card.is-complete .process-step-title {
          color:rgba(15,30,53,0.42);
          text-decoration:line-through;
          text-decoration-thickness:1px;
          text-decoration-color:rgba(184,151,106,0.58);
        }
        #process .process-step-card.is-complete .process-step-copy { color:rgba(15,30,53,0.46); }
        #process .process-visual-shell {
          width:100% !important;
          max-width:560px;
          height:526px;
          margin-left:auto;
        }
        #process .process-visual-frame { height:100% !important; aspect-ratio:auto !important; }
        @media (max-width:1440px) {
          #process.process-section { padding:40px 64px 54px !important; }
          #process .process-heading { height:176px !important; margin-bottom:22px !important; }
          #process .process-title { min-height:124px !important; }
          #process .process-grid { gap:44px !important; }
        }
        @media (max-height:820px) and (min-width:768px) {
          #process.process-section { padding:26px 64px 0 !important; }
          #process .process-heading { height:148px !important; margin-bottom:14px !important; }
          #process .process-title { min-height:96px !important; font-size:clamp(38px, 5vw, 54px) !important; }
          #process .process-grid { gap:54px !important; }
          #process .process-onboarding { height:430px !important; max-width:520px !important; }
          #process .process-progress-row { margin-bottom:12px !important; }
          #process .process-step-list { gap:8px !important; }
          #process .process-step-card { height:90px !important; min-height:90px !important; padding:13px 16px !important; }
          #process .process-step-marker { width:42px !important; flex-basis:42px !important; font-size:24px !important; }
          #process .process-step-check { flex-basis:42px !important; }
          #process .process-step-title { font-size:20px !important; margin-bottom:6px !important; }
          #process .process-step-copy { font-size:12.5px !important; line-height:1.55 !important; }
          #process .process-visual-shell { max-width:520px !important; height:430px !important; }
        }
        @media (max-width:1024px) {
          #process.process-section {
            height:auto !important;
            min-height:auto !important;
            scroll-margin-top:72px !important;
            padding:58px 40px 58px !important;
            overflow:visible !important;
          }
          #process > div { display:block !important; }
          #process .process-heading { height:auto !important; min-height:166px !important; margin-bottom:32px !important; }
          #process .process-title { min-height:118px !important; }
          #process .process-grid { grid-template-columns:1fr !important; gap:48px !important; }
          #process .process-onboarding { max-width:620px !important; height:auto !important; margin:0 auto !important; }
          #process .process-visual-shell {
            width:min(620px, 88%) !important;
            max-width:620px !important;
            height:auto !important;
            margin:0 auto !important;
          }
          #process .process-visual-frame { height:auto !important; aspect-ratio:4/3 !important; }
        }
        @media (max-width:767px) {
          #process.process-section { scroll-margin-top:72px !important; padding:46px 22px 48px !important; }
          #process .process-heading { min-height:148px !important; margin-bottom:28px !important; }
          #process .process-title { min-height:104px !important; font-size:clamp(38px, 11vw, 52px) !important; }
          #process .process-progress-row { justify-content:space-between !important; gap:14px !important; }
          #process .process-progress-track { width:128px !important; }
          #process .process-step-card { height:auto !important; min-height:116px !important; padding:16px 16px !important; }
          #process .process-step-inner { gap:14px !important; }
          #process .process-step-marker { width:42px !important; flex-basis:42px !important; font-size:24px !important; }
          #process .process-step-check { width:30px !important; height:30px !important; flex-basis:42px !important; }
          #process .process-step-title { font-size:21px !important; }
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
          <div className="reveal-right process-onboarding" style={{ order:2 }}>
            <div className="process-progress-row">
              <span style={{
                fontFamily:'Jost',
                fontSize:'13px',
                letterSpacing:'0.12em',
                textTransform:'uppercase',
                color:'rgba(15,30,53,0.74)',
                fontWeight:500,
                whiteSpace:'nowrap',
              }}>
                {progressText}
              </span>
              <div className="process-progress-track" aria-hidden="true">
                <div className="process-progress-fill" style={{ width:`${progressValue}%` }} />
              </div>
            </div>

            <ul className="process-step-list">
              {c.process.steps.map((step, i) => {
                const isComplete = i < active;
                const isActive = i === active;

                return (
                  <li key={i}>
                    <button
                      type="button"
                      className={[
                        'process-step-card',
                        isActive ? 'is-active' : '',
                        isComplete ? 'is-complete' : '',
                      ].filter(Boolean).join(' ')}
                      onClick={() => setActive(i)}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      <div className="process-step-inner">
                        {isComplete ? (
                          <svg className="process-step-check" viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.58 7.72-5.35 5.35a1 1 0 0 1-1.42 0l-2.39-2.4a1 1 0 1 1 1.41-1.41l1.69 1.69 4.65-4.65a1 1 0 0 1 1.41 1.42Z"
                            />
                          </svg>
                        ) : (
                          <span className="process-step-marker" aria-hidden="true">{step.n}.</span>
                        )}
                        <div>
                          <h4 className="process-step-title">{step.title}</h4>
                          <p className="process-step-copy">{step.desc}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="reveal-left" style={{ order:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div className="process-visual-shell" style={{ position:'relative', width:'86%' }}>
              <div style={{
                position:'absolute',
                top:'18px', left:'18px', right:'-18px', bottom:'-18px',
                border:`1px solid ${gold}25`,
                background:'rgba(10,34,62,0.18)',
                borderRadius:'8px',
                zIndex:0,
              }} />

              <div className="process-visual-frame" style={{
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

                <div style={{
                  position:'absolute', inset:'16px',
                  border:`1px solid ${gold}35`,
                  pointerEvents:'none', zIndex:4,
                }} />

                <CornerMarks size={28} gold={gold} opacity={0.8} zIndex={5} />

                <div style={{
                  position:'absolute', top:'26px', left:'26px', zIndex:5,
                  fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(72px, 7vw, 98px)', fontWeight:400,
                  color:`${gold}8f`, lineHeight:0.9,
                  textShadow:'0 5px 18px rgba(0,0,0,0.24)',
                }}>
                  {c.process.steps[active].n}
                </div>

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
