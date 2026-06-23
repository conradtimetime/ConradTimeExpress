(function () {
  const { StarIcon } = window;

/* ── FOOTER ── */
function Footer({ c, gold, navy }) {
  return (
    <footer style={{ background:'#060e1a', padding:'52px 96px', borderTop:`1px solid rgba(184,151,106,0.1)` }}>
      <div className="footer-inner" style={{ maxWidth:'1400px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <StarIcon size={16} color={gold} />
          <span style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'16px', letterSpacing:'0.15em', color:'rgba(255,255,255,0.4)' }}>
            CONRAD EXPRESS
          </span>
          <span style={{ color:`${gold}40`, margin:'0 8px' }}>·</span>
          <span style={{ fontSize:'11px', letterSpacing:'0.15em', color:`${gold}60`, fontFamily:'Jost' }}>
            {c.footer.tagline.toUpperCase()}
          </span>
        </div>

        <div style={{ display:'flex', gap:'24px', alignItems:'center', flexWrap:'wrap' }}>
          {[
            { label:'LINE', val:c.footer.line },
            { label:'TEL', val:c.footer.tel },
          ].map((item,i) => (
            <div key={i} style={{ display:'flex', gap:'8px', alignItems:'center' }}>
              <span style={{ fontSize:'9px', letterSpacing:'0.18em', color:`${gold}60`, fontFamily:'Jost' }}>{item.label}</span>
              <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)', fontFamily:'Jost', fontWeight:300 }}>{item.val}</span>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', gap:'28px', flexWrap:'wrap' }}>
          {c.footer.links.map((l, i) => (
            <a key={i} href="#" style={{
              fontSize:'11px', color:'rgba(255,255,255,0.3)', textDecoration:'none',
              letterSpacing:'0.1em', fontFamily:'Jost', transition:'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = gold}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >{l}</a>
          ))}
        </div>

        <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.25)', fontFamily:'Jost' }}>
          {c.footer.copy}
        </span>
      </div>
    </footer>
  );
}


  window.Footer = Footer;
})();
