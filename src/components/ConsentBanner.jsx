(function () {
  const { useEffect, useState } = React;

/* ── COOKIE CONSENT (PDPA) ──
 * Renders only when a GTM container is configured (ConradAnalytics.enabled).
 * Shows until the visitor picks a choice; "Cookie Settings" in the footer
 * reopens it via the `conrad:open-consent` window event.
 */
function ConsentBanner({ c, gold, navy }) {
  const analytics = window.ConradAnalytics;
  const enabled = Boolean(analytics && analytics.enabled);
  const [open, setOpen] = useState(() => enabled && !analytics.getConsent());

  useEffect(() => {
    if (!enabled) return undefined;
    const reopen = () => setOpen(true);
    window.addEventListener('conrad:open-consent', reopen);
    return () => window.removeEventListener('conrad:open-consent', reopen);
  }, [enabled]);

  if (!enabled || !open || !c.consent) return null;

  const copy = c.consent;
  const choose = (choice) => {
    analytics.setConsent(choice);
    setOpen(false);
  };
  const openPrivacy = () => {
    window.dispatchEvent(new CustomEvent('conrad:open-policy', { detail: { id: 'privacy' } }));
  };

  const buttonBase = {
    flex:'1 1 0', minWidth:0, padding:'12px 16px', fontSize:'11px', letterSpacing:'0.12em',
    fontFamily:'Jost, sans-serif', fontWeight:500, cursor:'pointer', transition:'all 0.2s',
    borderRadius:0,
  };

  return (
    <section className="consent-banner" role="region" aria-label={copy.title} style={{
      position:'fixed', left:'28px', bottom:'30px', zIndex:300,
      width:'min(420px, calc(100vw - 56px))', boxSizing:'border-box',
      padding:'24px 24px 22px',
      background:navy, border:`1px solid ${gold}45`,
      boxShadow:'0 18px 48px rgba(0,0,0,0.45)',
      color:'rgba(255,255,255,0.72)', fontFamily:'Jost, sans-serif',
    }}>
      <style>{`
        @media (max-width: 640px) {
          .consent-banner { left:16px !important; right:16px !important; bottom:16px !important; width:auto !important; padding:20px !important; }
        }
      `}</style>
      <h2 style={{
        fontFamily:'Cormorant Garamond, serif', fontSize:'20px', fontWeight:500,
        letterSpacing:'0.04em', color:gold, margin:'0 0 10px',
      }}>{copy.title}</h2>
      <p style={{ fontSize:'13px', lineHeight:1.75, fontWeight:300, margin:'0 0 12px' }}>
        {copy.body}
      </p>
      <button type="button" onClick={openPrivacy} aria-haspopup="dialog" style={{
        background:'transparent', border:'none', padding:0, marginBottom:'18px', cursor:'pointer',
        fontSize:'12px', letterSpacing:'0.06em', color:gold, textDecoration:'underline',
        textUnderlineOffset:'3px', fontFamily:'Jost, sans-serif',
      }}>{copy.policy}</button>
      <div style={{ display:'flex', gap:'10px' }}>
        <button type="button" onClick={() => choose('denied')} style={{
          ...buttonBase, background:'transparent', color:gold, border:`1px solid ${gold}70`,
        }}>{copy.reject}</button>
        <button type="button" onClick={() => choose('granted')} style={{
          ...buttonBase, background:gold, color:navy, border:`1px solid ${gold}`,
        }}>{copy.accept}</button>
      </div>
    </section>
  );
}

  window.ConsentBanner = ConsentBanner;
})();
