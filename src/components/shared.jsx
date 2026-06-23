(function () {
  const { useRef, useState } = React;

/* ── STAR LOGO SVG ── */
const StarIcon = ({ size = 24, color = 'currentColor', style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={style}>
    <path d="M20 2 L21.5 18.5 L38 20 L21.5 21.5 L20 38 L18.5 21.5 L2 20 L18.5 18.5 Z"
      fill={color} />
  </svg>
);


/* ── PHOTO PLACEHOLDER ── */
function PhotoPlaceholder({ label, width='100%', height='100%', style={} }) {
  return (
    <div style={{
      width, height, background:'#1a2540',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      gap:'12px', position:'relative', overflow:'hidden',
      ...style,
    }}>
      {/* Subtle stripe texture */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 12px)',
      }} />
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{opacity:0.25}}>
        <rect x="2" y="6" width="28" height="20" rx="2" stroke="#b8976a" strokeWidth="1.5"/>
        <circle cx="16" cy="16" r="5" stroke="#b8976a" strokeWidth="1.5"/>
        <circle cx="24" cy="10" r="1.5" fill="#b8976a" opacity="0.6"/>
      </svg>
      <span style={{ fontSize:'10px', letterSpacing:'0.2em', color:'rgba(184,151,106,0.4)', fontFamily:'Jost, sans-serif', textAlign:'center', padding:'0 12px', position:'relative' }}>
        {label}
      </span>
    </div>
  );
}


/* ── CARD SWIPER ──
   Wraps a card grid. On phones (≤767, where the grid becomes a horizontal
   scroll-snap row) it shows prev/next arrows + dots so cards are navigable by
   click as well as touch-swipe. On larger screens the grid renders untouched
   and the controls stay hidden via CSS. */
function CardSwiper({ className, style, children }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const count = React.Children.count(children);

  const stepWidth = () => {
    const el = ref.current;
    if (!el || !el.children[0]) return el ? el.clientWidth : 1;
    const a = el.children[0].getBoundingClientRect();
    const b = el.children[1] ? el.children[1].getBoundingClientRect() : null;
    return b ? Math.abs(b.left - a.left) : a.width;
  };
  /* Navigate to card t, wrapping around both ends (infinite loop). Uses
     scrollIntoView on the actual child — robust against snap/step rounding. */
  const go = (i) => {
    const el = ref.current;
    if (!el || count === 0) return;
    const t = ((i % count) + count) % count;
    const child = el.children[t];
    if (child) child.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
  };
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setIdx(Math.round(el.scrollLeft / (stepWidth() || 1)));
  };

  return (
    <div className="swipe-wrap">
      <div ref={ref} className={className} style={style} onScroll={onScroll}>
        {children}
      </div>
      <button className="swipe-nav swipe-prev" onClick={() => go(idx - 1)} aria-label="Previous">‹</button>
      <button className="swipe-nav swipe-next" onClick={() => go(idx + 1)} aria-label="Next">›</button>
      <div className="swipe-dots">
        {Array.from({ length: count }).map((_, i) => (
          <button key={i} className={'swipe-dot' + (i === idx ? ' on' : '')} onClick={() => go(i)} aria-label={'Go to card ' + (i + 1)} />
        ))}
      </div>
    </div>
  );
}


  Object.assign(window, { StarIcon, PhotoPlaceholder, CardSwiper });
})();
