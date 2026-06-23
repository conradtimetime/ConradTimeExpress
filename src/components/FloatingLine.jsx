(function () {
  const { useEffect, useState } = React;
  const { SITE_CONFIG } = window.CONRAD_EXPRESS_DATA;

/* ── FLOATING LINE BUTTON ── */
function FloatingLine({ gold, navy }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position:'fixed', bottom:'32px', right:'32px', zIndex:200,
      display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'12px',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)',
    }}>
      {/* LINE button */}
      <a href={SITE_CONFIG.contact.lineUrl} target="_blank" rel="noopener noreferrer"
        title="Chat on LINE"
        style={{
          width:'52px', height:'52px', borderRadius:'50%',
          background:'#06C755', display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 4px 20px rgba(6,199,85,0.4), 0 2px 8px rgba(0,0,0,0.2)',
          transition:'all 0.25s', textDecoration:'none',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform='scale(1.1)'; e.currentTarget.style.boxShadow='0 6px 28px rgba(6,199,85,0.55), 0 4px 12px rgba(0,0,0,0.2)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(6,199,85,0.4), 0 2px 8px rgba(0,0,0,0.2)'; }}
      >
        {/* LINE logo */}
        <svg width="26" height="26" viewBox="0 0 40 40" fill="white">
          <path d="M20 4C11.163 4 4 10.03 4 17.5c0 4.787 2.87 9.01 7.245 11.56-.317 1.18-1.145 4.284-1.31 4.944-.2.796.29 1.154.96.84.525-.248 6.854-4.537 9.625-6.38.49.044.983.066 1.48.066C29.837 28.53 36 22.5 36 15.03 36 7.56 28.837 1.53 20 4z"/>
        </svg>
      </a>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
        style={{
          width:'44px', height:'44px',
          background:`rgba(15,30,53,0.9)`, border:`1px solid ${gold}40`,
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', color:gold, fontSize:'16px',
          backdropFilter:'blur(8px)',
          transition:'all 0.25s',
          boxShadow:`0 4px 16px rgba(0,0,0,0.3), 0 0 12px ${gold}15`,
        }}
        onMouseEnter={e => { e.currentTarget.style.background=gold; e.currentTarget.style.color='#0f1e35'; }}
        onMouseLeave={e => { e.currentTarget.style.background='rgba(15,30,53,0.9)'; e.currentTarget.style.color=gold; }}
      >↑</button>
    </div>
  );
}


  window.FloatingLine = FloatingLine;
})();
