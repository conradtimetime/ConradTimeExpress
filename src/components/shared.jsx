(function () {
  const { useEffect, useRef, useState } = React;

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
   Wraps a card grid. The section CSS controls when it becomes a horizontal
   scroll-snap row and shows the navigation. Dots represent reachable scroll
   positions, including the final edge when multiple cards fit in the row. */
function CardSwiper({ className, style, children, mediaQuery = '(max-width:1024px)' }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);
  const [positions, setPositions] = useState([0]);
  const childCount = Array.isArray(children) ? children.length : children ? 1 : 0;

  const nearestPosition = (left, stops) => {
    return stops.reduce((nearest, stop, i) => (
      Math.abs(stop - left) < Math.abs(stops[nearest] - left) ? i : nearest
    ), 0);
  };

  // Geometry is needed only by a visible, horizontally scrolling row. A
  // passive effect keeps below-the-fold measurements out of the first paint;
  // matchMedia also avoids measuring a desktop grid that has no swipe UI.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const media = window.matchMedia?.(mediaQuery);
    let active = false;
    let disposed = false;
    let frame = 0;
    let resizeObserver = null;
    let mutationObserver = null;
    let intersectionObserver = null;

    const measure = () => {
      frame = 0;
      if (!active) return;
      const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      const stops = [0];
      if (maxLeft > 1) {
        const start = el.getBoundingClientRect().left + el.clientLeft;
        Array.from(el.children).forEach((child) => {
          const left = Math.min(maxLeft, Math.max(0, child.getBoundingClientRect().left - start + el.scrollLeft));
          if (left - stops[stops.length - 1] > 1) stops.push(left);
        });
      }
      // Several trailing cards share the clamped edge when multiple cards fit.
      // A card wider than the viewport still gets a single dot at its start.
      setPositions((previous) => (
        previous.length === stops.length && previous.every((stop, i) => Math.abs(stop - stops[i]) < 1)
          ? previous : stops
      ));
      setIdx(nearestPosition(el.scrollLeft, stops));
    };
    const schedule = () => {
      if (active && !frame) frame = requestAnimationFrame(measure);
    };
    const observeSizes = () => {
      resizeObserver?.disconnect();
      resizeObserver?.observe(el);
      Array.from(el.children).forEach((child) => resizeObserver?.observe(child));
    };
    const stopMeasuring = () => {
      active = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      resizeObserver = null;
      mutationObserver = null;
      window.removeEventListener('resize', schedule);
    };
    const startMeasuring = () => {
      if (active || disposed || (media && !media.matches)) return;
      active = true;
      resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
      observeSizes();
      // Translated titles can replace keyed cards without changing their
      // count. Observe replacements, rather than re-subscribing on every
      // parent render merely because the children array has a new identity.
      if (typeof MutationObserver !== 'undefined') {
        mutationObserver = new MutationObserver(() => { observeSizes(); schedule(); });
        mutationObserver.observe(el, { childList: true });
      }
      window.addEventListener('resize', schedule);
      schedule();
    };
    const syncMode = () => {
      intersectionObserver?.disconnect();
      intersectionObserver = null;
      stopMeasuring();
      if (media && !media.matches) {
        setPositions((previous) => previous.length === 1 ? previous : [0]);
        setIdx(0);
        return;
      }
      if (typeof IntersectionObserver === 'undefined') {
        startMeasuring();
      } else {
        intersectionObserver = new IntersectionObserver(([entry]) => {
          entry.isIntersecting ? startMeasuring() : stopMeasuring();
        }, { rootMargin: '200px 0px' });
        intersectionObserver.observe(el);
      }
    };

    syncMode();
    if (media?.addEventListener) media.addEventListener('change', syncMode);
    else media?.addListener?.(syncMode);
    return () => {
      disposed = true;
      intersectionObserver?.disconnect();
      stopMeasuring();
      if (media?.removeEventListener) media.removeEventListener('change', syncMode);
      else media?.removeListener?.(syncMode);
    };
  }, [className, mediaQuery, childCount]);

  /* Scroll only the row; scrollIntoView can also move the surrounding page. */
  const go = (i) => {
    const el = ref.current;
    if (!el || positions.length < 2) return;
    const t = ((i % positions.length) + positions.length) % positions.length;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: positions[t], behavior: reducedMotion ? 'auto' : 'smooth' });
  };
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setIdx(nearestPosition(el.scrollLeft, positions));
  };

  return (
    <div className="swipe-wrap">
      <div ref={ref} className={className} style={style} onScroll={onScroll}>
        {children}
      </div>
      <button className="swipe-nav swipe-prev" onClick={() => go(idx - 1)} aria-label="Previous">‹</button>
      <button className="swipe-nav swipe-next" onClick={() => go(idx + 1)} aria-label="Next">›</button>
      <div className="swipe-dots">
        {positions.map((_, i) => (
          <button key={i} className={'swipe-dot' + (i === idx ? ' on' : '')} onClick={() => go(i)} aria-label={'Go to slide ' + (i + 1)} aria-current={i === idx ? 'true' : undefined} />
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

function SectionCta({ label, gold, navy, className = '', style = {} }) {
  const lineGreen = '#06C755';
  const lineGreenHover = '#05b84f';
  return (
    <a
      href="#contact"
      className={className}
      style={{
        display:'inline-flex',
        alignItems:'center',
        justifyContent:'center',
        minHeight:'46px',
        minWidth:'220px',
        boxSizing:'border-box',
        padding:'0 28px',
        background:lineGreen,
        color:'#fff',
        border:`1px solid ${lineGreen}`,
        textDecoration:'none',
        fontSize:'12px',
        letterSpacing:'0.14em',
        fontFamily:'Jost, sans-serif',
        fontWeight:500,
        textTransform:'uppercase',
        boxShadow:'0 12px 28px rgba(6,199,85,0.24)',
        transition:'background 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = lineGreenHover;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 16px 34px rgba(6,199,85,0.34)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = lineGreen;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(6,199,85,0.24)';
      }}
    >
      {label}
    </a>
  );
}

/* ── STANDARD SECTION FRAME ──
   Shared spacing contract for the main non-hero content sections. Sections can
   still opt into a full-bleed variant when their cards/carousel need edge fade. */
const SECTION_FRAME = {
  navOffset: '72px',
  minHeight: 'calc(100vh - 72px)',
  maxWidth: '1400px',
  padding: {
    standard: {
      desktop: '88px 96px',
      laptop: '84px 64px',
      tablet: '72px 40px',
      mobile: '56px 22px',
      compact: '64px 64px 52px',
    },
    midPage: {
      desktop: '48px 96px',
      laptop: '48px 64px',
      tablet: '48px 40px',
      mobile: '48px 22px',
      compact: '48px 64px 40px',
    },
    fullBleed: {
      desktop: '88px 0',
      laptop: '84px 0',
      tablet: '72px 0',
      mobile: '56px 0',
      compact: '64px 0 52px',
    },
    midPageFullBleed: {
      desktop: '48px 0',
      laptop: '48px 0',
      tablet: '48px 0',
      mobile: '48px 0',
      compact: '48px 0 40px',
    },
  },
};

function getSectionFrameStyle(overrides = {}) {
  return {
    minHeight: SECTION_FRAME.minHeight,
    boxSizing: 'border-box',
    scrollMarginTop: SECTION_FRAME.navOffset,
    ...overrides,
  };
}

function getSectionFrameCss(selector, options = {}) {
  const variant = options.variant || 'standard';
  const base = SECTION_FRAME.padding[variant] || SECTION_FRAME.padding.standard;
  const desktop = options.desktop || base.desktop;
  const laptop = options.laptop || base.laptop;
  const tablet = options.tablet || base.tablet;
  const mobile = options.mobile || base.mobile;
  const compact = options.compact || base.compact;
  const tabletMinHeight = options.tabletMinHeight === undefined ? 'auto' : options.tabletMinHeight;
  const tabletMinHeightRule = tabletMinHeight
    ? `min-height:${tabletMinHeight} !important;`
    : '';

  return `
    ${selector} {
      min-height:${SECTION_FRAME.minHeight} !important;
      box-sizing:border-box !important;
      scroll-margin-top:${SECTION_FRAME.navOffset} !important;
      padding:${desktop} !important;
    }
    @media (max-width:1440px) {
      ${selector} { padding:${laptop} !important; }
    }
    @media (max-width:1024px) {
      ${selector} { padding:${tablet} !important; ${tabletMinHeightRule} }
    }
    @media (max-width:767px) {
      ${selector} { padding:${mobile} !important; }
    }
    @media (max-height:820px) and (min-width:768px) {
      ${selector} { padding:${compact} !important; }
    }
  `;
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


  Object.assign(window, {
    StarIcon,
    PhotoPlaceholder,
    CardSwiper,
    SectionEyebrow,
    SectionCta,
    SECTION_FRAME,
    getSectionFrameStyle,
    getSectionFrameCss,
    CornerMarks,
  });
})();
