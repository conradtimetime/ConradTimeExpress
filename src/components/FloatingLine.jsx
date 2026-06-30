(function () {
  const { useEffect, useState } = React;
  const { SITE_CONFIG } = window.CONRAD_EXPRESS_DATA;

  const LABELS = {
    en: { line: 'Chat on LINE', track: 'Track Shipment' },
    th: { line: 'แชทผ่าน LINE', track: 'ติดตามสถานะการขนส่ง' },
  };

/* ── FLOATING CONTACT WIDGET ── */
function FloatingLine({ gold, navy, lang }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const L = LABELS[lang] || LABELS.en;
  const lineUrl = SITE_CONFIG.contact.lineUrl;
  const trackUrl = SITE_CONFIG.contact.trackUrl || lineUrl;

  return (
    <div className="fab-stack" style={{
      position:'fixed', bottom:'32px', right:'28px', zIndex:200,
      display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'14px',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition:'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <style>{`
        .fab-stack .fab-btn {
          display:flex; align-items:center; justify-content:flex-end;
          height:54px; border-radius:27px; text-decoration:none; cursor:pointer;
          overflow:hidden; border:none; padding:0;
          transition:box-shadow 0.25s ease, transform 0.25s ease;
        }
        .fab-stack .fab-btn:hover { transform:translateY(-2px); }
        .fab-stack .fab-label {
          max-width:0; opacity:0; white-space:nowrap; overflow:hidden;
          font-family:'Jost', sans-serif; font-size:13px; font-weight:500; letter-spacing:0.02em;
          transition:max-width 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease, padding 0.4s ease;
          padding:0;
        }
        .fab-stack .fab-btn:hover .fab-label,
        .fab-stack .fab-btn:focus-visible .fab-label { max-width:260px; opacity:1; padding:0 6px 0 18px; }
        .fab-stack .fab-ic {
          width:54px; height:54px; flex:0 0 54px;
          display:flex; align-items:center; justify-content:center;
        }
        .fab-stack .fab-top {
          width:44px; height:44px; display:flex; align-items:center; justify-content:center;
          cursor:pointer; font-size:16px; border:1px solid ${gold}40;
          background:rgba(15,30,53,0.9); color:${gold};
          backdrop-filter:blur(8px); transition:all 0.25s ease;
          box-shadow:0 4px 16px rgba(0,0,0,0.3), 0 0 12px ${gold}15;
        }
        .fab-stack .fab-top:hover { background:${gold}; color:#0f1e35; }
      `}</style>

      {/* Track shipment */}
      <a href={trackUrl} target="_blank" rel="noopener noreferrer"
        className="fab-btn" title={L.track}
        style={{ background:`linear-gradient(135deg, ${navy} 0%, #0c1830 100%)`, color:gold,
          boxShadow:`0 6px 22px rgba(15,30,53,0.34), 0 0 0 1px ${gold}40` }}>
        <span className="fab-label">{L.track}</span>
        <span className="fab-ic">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
            <circle cx="12" cy="10" r="2.4" />
          </svg>
        </span>
      </a>

      {/* LINE */}
      <a href={lineUrl} target="_blank" rel="noopener noreferrer"
        className="fab-btn" title={L.line}
        style={{ background:'#06C755', color:'#fff',
          boxShadow:'0 6px 22px rgba(6,199,85,0.42), 0 2px 8px rgba(0,0,0,0.18)' }}>
        <span className="fab-label">{L.line}</span>
        <span className="fab-ic">
          <svg width="27" height="27" viewBox="0 0 40 40" fill="white">
            <path d="M20 4C11.163 4 4 10.03 4 17.5c0 4.787 2.87 9.01 7.245 11.56-.317 1.18-1.145 4.284-1.31 4.944-.2.796.29 1.154.96.84.525-.248 6.854-4.537 9.625-6.38.49.044.983.066 1.48.066C29.837 28.53 36 22.5 36 15.03 36 7.56 28.837 1.53 20 4z" />
          </svg>
        </span>
      </a>

      {/* Scroll to top */}
      <button className="fab-top" aria-label="Back to top"
        onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}>↑</button>
    </div>
  );
}


  window.FloatingLine = FloatingLine;
})();
