(function () {
  const { useEffect, useState } = React;
  const { SITE_CONFIG } = window.CONRAD_EXPRESS_DATA;

  const LABELS = {
    en: { line: 'Chat on LINE', track: 'Track Shipment', menu: 'Contact us' },
    th: { line: 'แชทผ่าน LINE', track: 'ติดตามสถานะการขนส่ง', menu: 'ติดต่อเรา' },
  };

/* ── FLOATING CONTACT WIDGET (expandable speed-dial) ── */
function FloatingLine({ gold, lang }) {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const L = LABELS[lang] || LABELS.en;
  const lineUrl = SITE_CONFIG.contact.lineUrl;
  const trackUrl = SITE_CONFIG.contact.trackUrl || lineUrl;

  const actions = [
    {
      key: 'track', label: L.track, href: trackUrl,
      icon: (
        <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#16263f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" /><circle cx="12" cy="10" r="2.4" />
        </svg>
      ),
    },
    {
      key: 'line', label: L.line, href: lineUrl,
      icon: (
        <svg width="26" height="26" viewBox="0 0 40 40" fill="#06C755">
          <path d="M20 4C11.163 4 4 10.03 4 17.5c0 4.787 2.87 9.01 7.245 11.56-.317 1.18-1.145 4.284-1.31 4.944-.2.796.29 1.154.96.84.525-.248 6.854-4.537 9.625-6.38.49.044.983.066 1.48.066C29.837 28.53 36 22.5 36 15.03 36 7.56 28.837 1.53 20 4z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fabx" style={{
      position:'fixed', bottom:'30px', right:'28px', zIndex:200,
      display:'flex', flexDirection:'column', alignItems:'flex-end',
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition:'opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <style>{`
        @keyframes fabxPulse {
          0%   { box-shadow:0 8px 26px rgba(6,199,85,0.5), 0 0 0 0 rgba(6,199,85,0.34); }
          70%  { box-shadow:0 8px 26px rgba(6,199,85,0.5), 0 0 0 14px rgba(6,199,85,0); }
          100% { box-shadow:0 8px 26px rgba(6,199,85,0.5), 0 0 0 0 rgba(6,199,85,0); }
        }
        .fabx-actions { position:absolute; right:5px; bottom:74px; display:flex; flex-direction:column; align-items:flex-end; gap:14px; }
        .fabx-act { display:flex; align-items:center; gap:12px; text-decoration:none;
          opacity:0; transform:translateY(16px) scale(0.8); pointer-events:none;
          transition:opacity 0.26s ease, transform 0.34s cubic-bezier(0.16,1,0.3,1); }
        .fabx-act.is-open { opacity:1; transform:translateY(0) scale(1); pointer-events:auto; }
        .fabx-label { background:#fff; color:#16263f; font-family:'Jost', sans-serif; font-size:13px; font-weight:500;
          letter-spacing:0.01em; padding:9px 15px; border-radius:9px; white-space:nowrap;
          box-shadow:0 8px 22px rgba(15,30,53,0.18); }
        .fabx-circle { width:50px; height:50px; border-radius:50%; background:#fff; flex:0 0 50px;
          display:flex; align-items:center; justify-content:center; box-shadow:0 8px 22px rgba(15,30,53,0.24);
          transition:transform 0.22s ease; }
        .fabx-act:hover .fabx-circle { transform:scale(1.08); }
        .fabx-base { display:flex; align-items:center; gap:12px; }
        .fabx-top { width:42px; height:42px; border-radius:50%; border:1px solid ${gold}44;
          background:rgba(15,30,53,0.9); color:${gold}; cursor:pointer; font-size:15px;
          display:flex; align-items:center; justify-content:center; backdrop-filter:blur(8px);
          box-shadow:0 4px 16px rgba(0,0,0,0.3); transition:all 0.25s ease; }
        .fabx-top:hover { background:${gold}; color:#0f1e35; }
        .fabx-main { width:62px; height:62px; border-radius:50%; border:none; cursor:pointer; position:relative;
          background:linear-gradient(135deg, #0bd968 0%, #06C755 100%); color:#fff;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 26px rgba(6,199,85,0.5); transition:transform 0.3s ease, box-shadow 0.25s ease;
          animation:fabxPulse 2.6s ease-out infinite; }
        .fabx-main:hover { transform:scale(1.06); }
        .fabx-main.is-open { animation:none; box-shadow:0 8px 26px rgba(15,30,53,0.4); transform:rotate(0deg); }
        .fabx-main .fabx-ic { position:absolute; display:flex; transition:opacity 0.25s ease, transform 0.3s ease; }
        .fabx-main .fabx-ic-chat { opacity:1; transform:scale(1); }
        .fabx-main .fabx-ic-close { opacity:0; transform:scale(0.6) rotate(-90deg); }
        .fabx-main.is-open .fabx-ic-chat { opacity:0; transform:scale(0.6) rotate(90deg); }
        .fabx-main.is-open .fabx-ic-close { opacity:1; transform:scale(1) rotate(0deg); }
      `}</style>

      {/* Expandable actions */}
      <div className="fabx-actions">
        {actions.map((a, i) => (
          <a key={a.key} href={a.href} target="_blank" rel="noopener noreferrer"
            className={'fabx-act' + (open ? ' is-open' : '')} title={a.label}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${i * 60}ms` : `${(actions.length - 1 - i) * 45}ms` }}>
            <span className="fabx-label">{a.label}</span>
            <span className="fabx-circle">{a.icon}</span>
          </a>
        ))}
      </div>

      {/* Base row: back-to-top + main toggle */}
      <div className="fabx-base">
        <button className="fabx-top" aria-label="Back to top"
          onClick={() => window.scrollTo({ top:0, behavior:'smooth' })}>↑</button>

        <button className={'fabx-main' + (open ? ' is-open' : '')}
          aria-label={L.menu} aria-expanded={open}
          onClick={() => setOpen(o => !o)}>
          <span className="fabx-ic fabx-ic-chat">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
              <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9.5L4 21v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              <circle cx="8.5" cy="11" r="1.4" fill="#06C755" /><circle cx="12" cy="11" r="1.4" fill="#06C755" /><circle cx="15.5" cy="11" r="1.4" fill="#06C755" />
            </svg>
          </span>
          <span className="fabx-ic fabx-ic-close">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}


  window.FloatingLine = FloatingLine;
})();
