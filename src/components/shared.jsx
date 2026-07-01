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
        <rect x="2" y="6" width="28" height="20" rx="2" stroke="#e2b56f" strokeWidth="1.5"/>
        <circle cx="16" cy="16" r="5" stroke="#e2b56f" strokeWidth="1.5"/>
        <circle cx="24" cy="10" r="1.5" fill="#e2b56f" opacity="0.6"/>
      </svg>
      <span style={{ fontSize:'10px', letterSpacing:'0.2em', color:'rgba(226,181,111,0.4)', fontFamily:'Jost, sans-serif', textAlign:'center', padding:'0 12px', position:'relative' }}>
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


/* ── SECTION EYEBROW ──
   Renders the gold kicker line(s) + label above section headings.
   centered=true → lines on both sides (Services, Process, Packages, Testimonials)
   centered=false → single left line (WhyUs, Contact) */
function SectionEyebrow({ label, gold, centered = false, className = '', style = {} }) {
  const line = <div style={{ width: '40px', height: '1px', background: gold }} />;
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: centered ? 'center' : undefined,
        gap: '16px',
        marginBottom: '20px',
        ...style,
      }}
    >
      {line}
      <span style={{ fontSize: '11px', letterSpacing: '0.25em', color: gold, fontFamily: 'Jost' }}>
        {label.toUpperCase()}
      </span>
      {centered && line}
    </div>
  );
}


/* ── CORNER MARKS ──
   Four L-shaped gold corner marks — used in Process, Testimonials, WhyUs image frames. */
function CornerMarks({ size = 24, gold, opacity = 0.8, zIndex = 4 }) {
  const h = { display: 'block', width: `${size}px`, height: '2px', background: gold, opacity };
  const v = { display: 'block', width: '2px', height: `${size}px`, background: gold, opacity, marginTop: '-2px' };
  return (
    <>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex, pointerEvents: 'none' }}>
        <div style={h} /><div style={v} />
      </div>
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={h} /><div style={{ ...v, alignSelf: 'flex-end' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '10px', left: '10px', zIndex, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{ ...v, marginTop: 0 }} /><div style={{ ...h, marginTop: '-2px' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
        <div style={{ ...v, alignSelf: 'flex-end', marginTop: 0 }} /><div style={{ ...h, marginTop: '-2px' }} />
      </div>
    </>
  );
}


  Object.assign(window, { StarIcon, PhotoPlaceholder, CardSwiper, SectionEyebrow, CornerMarks });
})();
