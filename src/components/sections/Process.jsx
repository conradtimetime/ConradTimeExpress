(function () {
  const { useState } = React;
  const { PhotoPlaceholder, StarIcon } = window;

/* ── PROCESS ── */
function Process({ c, gold, navy }) {
  const [active, setActive] = useState(0);
  return (
    <section id="process" style={{ background:'var(--cream)', padding:'120px 96px' }}>
      <div style={{ maxWidth:'1400px', margin:'0 auto' }}>
        <div style={{ marginBottom:'72px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
            <div style={{ width:'40px', height:'1px', background:gold }} />
            <span style={{ fontSize:'11px', letterSpacing:'0.25em', color:gold, fontFamily:'Jost' }}>
              {c.process.label.toUpperCase()}
            </span>
          </div>
          <h2 style={{
            fontFamily:'Cormorant Garamond, serif', fontSize:'clamp(40px, 5vw, 64px)',
            fontWeight:300, color:navy, lineHeight:1.1, whiteSpace:'pre-line',
          }}>{c.process.title}</h2>
        </div>

        <div className="g-split" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'80px', alignItems:'center' }}>
          {/* Steps list */}
          <div className="reveal-left" style={{ display:'flex', flexDirection:'column', gap:'0' }}>
            {c.process.steps.map((step, i) => (
              <div key={i}
                onClick={() => setActive(i)}
                style={{
                  padding:'28px 0', cursor:'pointer',
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
                  <h4 style={{
                    fontFamily:'Cormorant Garamond, serif', fontSize:'22px', fontWeight:400,
                    color: active===i ? navy : 'rgba(15,30,53,0.5)',
                    marginBottom:'8px', transition:'color 0.3s',
                  }}>{step.title}</h4>
                  <p style={{
                    fontSize:'13px', lineHeight:1.7, fontFamily:'Jost', fontWeight:300,
                    color: active===i ? 'rgba(15,30,53,0.65)' : 'transparent',
                    maxHeight: active===i ? '80px' : '0', overflow:'hidden',
                    transition:'all 0.4s ease',
                  }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Active step visual — luxury photo frame */}
          <div className="reveal-right" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ position:'relative', width:'88%' }}>

              {/* Offset shadow block */}
              <div style={{
                position:'absolute',
                top:'18px', left:'18px', right:'-18px', bottom:'-18px',
                border:`1px solid ${gold}25`,
                background:'rgba(15,30,53,0.06)',
                zIndex:0,
              }} />

              {/* Photo frame */}
              <div style={{
                position:'relative', zIndex:1,
                aspectRatio:'4/3',
                overflow:'hidden',
              }}>
                <PhotoPlaceholder label="PROCESS PHOTO" height="100%" />

                {/* Inner gold inset border */}
                <div style={{
                  position:'absolute', inset:'16px',
                  border:`1px solid ${gold}35`,
                  pointerEvents:'none', zIndex:3,
                }} />

                {/* Corner marks — top-left */}
                <div style={{ position:'absolute', top:'10px', left:'10px', zIndex:4, pointerEvents:'none' }}>
                  <div style={{ width:'28px', height:'2px', background:gold, opacity:0.8 }} />
                  <div style={{ width:'2px', height:'28px', background:gold, opacity:0.8, marginTop:'-2px' }} />
                </div>
                {/* Corner marks — top-right */}
                <div style={{ position:'absolute', top:'10px', right:'10px', zIndex:4, pointerEvents:'none', display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                  <div style={{ width:'28px', height:'2px', background:gold, opacity:0.8 }} />
                  <div style={{ width:'2px', height:'28px', background:gold, opacity:0.8, marginTop:'-2px', alignSelf:'flex-end' }} />
                </div>
                {/* Corner marks — bottom-left */}
                <div style={{ position:'absolute', bottom:'10px', left:'10px', zIndex:4, pointerEvents:'none', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                  <div style={{ width:'2px', height:'28px', background:gold, opacity:0.8 }} />
                  <div style={{ width:'28px', height:'2px', background:gold, opacity:0.8, marginTop:'-2px' }} />
                </div>
                {/* Corner marks — bottom-right */}
                <div style={{ position:'absolute', bottom:'10px', right:'10px', zIndex:4, pointerEvents:'none', display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'flex-end' }}>
                  <div style={{ width:'2px', height:'28px', background:gold, opacity:0.8, alignSelf:'flex-end' }} />
                  <div style={{ width:'28px', height:'2px', background:gold, opacity:0.8, marginTop:'-2px' }} />
                </div>

                {/* Step number overlay */}
                <div style={{
                  position:'absolute', top:'24px', left:'24px', zIndex:4,
                  fontFamily:'Cormorant Garamond, serif', fontSize:'56px', fontWeight:300,
                  color:`${gold}30`, lineHeight:1,
                  textShadow:`0 2px 12px rgba(0,0,0,0.3)`,
                }}>
                  {c.process.steps[active].n}
                </div>

                {/* Bottom caption bar */}
                <div style={{
                  position:'absolute', bottom:0, left:0, right:0, zIndex:3,
                  padding:'28px 20px 16px',
                  background:`linear-gradient(to top, rgba(10,22,40,0.88) 0%, transparent 100%)`,
                  display:'flex', alignItems:'flex-end', justifyContent:'space-between',
                }}>
                  <div>
                    <div style={{ fontSize:'11px', letterSpacing:'0.2em', color:`${gold}cc`, fontFamily:'Cormorant Garamond, serif', fontStyle:'italic', marginBottom:'2px' }}>
                      {c.process.steps[active].title}
                    </div>
                    <div style={{ fontSize:'9px', letterSpacing:'0.15em', color:`rgba(255,255,255,0.45)`, fontFamily:'Jost' }}>
                      {c.process.steps[active].desc.substring(0, 48)}…
                    </div>
                  </div>
                  <StarIcon size={14} color={gold} style={{ opacity:0.5, flexShrink:0, marginLeft:'12px' }} />
                </div>
              </div>

              {/* Side label */}
              <div style={{
                position:'absolute', right:'-52px', top:'50%',
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
