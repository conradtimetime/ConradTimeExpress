(function () {
  const { useEffect, useState } = React;
  const { COPY } = window.CONRAD_EXPRESS_DATA;
  const {
    Nav, Hero, Brands, Services, WhyUs, Process, Testimonials, Packages, Contact,
    FloatingLine,
  } = window;
  const TWEAK_DEFAULTS = window.TWEAK_DEFAULTS;

/* ── MAIN APP ── */
function App() {
  const { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakRadio } = window;

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState(tweaks.language || 'th');

  const gold = tweaks.accentColor;
  const navy = tweaks.navyColor;
  const c = COPY[language] || COPY.en;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLangChange = (l) => {
    setLanguage(l);
    setTweak('language', l);
  };

  return (
    <>
      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); font-family: Jost, sans-serif; }
        option { background: #0f1e35; }
        /* Responsive layout rules live in the document <head> style block. */
      `}</style>

      <Nav c={c} gold={gold} navy={navy} scrolled={scrolled} lang={language} setLang={handleLangChange} />
      <Hero c={c} gold={gold} navy={navy} layout={tweaks.heroLayout} />
      <Brands c={c} gold={gold} navy={navy} />
      <Services c={c} gold={gold} navy={navy} />
      <WhyUs c={c} gold={gold} navy={navy} />
      <Process c={c} gold={gold} navy={navy} language={language} />
      <Testimonials c={c} gold={gold} navy={navy} language={language} />
      <Packages c={c} gold={gold} navy={navy} />
      <Contact c={c} gold={gold} navy={navy} language={language} />
      <FloatingLine gold={gold} lang={language} />

      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakColor label="Gold Accent" value={tweaks.accentColor} onChange={v => setTweak('accentColor', v)} />
        <TweakColor label="Navy Background" value={tweaks.navyColor} onChange={v => setTweak('navyColor', v)} />
        <TweakSection label="Hero" />
        <TweakRadio label="Theme" value={tweaks.heroLayout} options={['dark','light']} onChange={v => setTweak('heroLayout', v)} />
        <TweakSection label="Language" />
        <TweakRadio label="Lang" value={language} options={['en','th']} onChange={v => handleLangChange(v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

// ── Scroll Reveal Observer ──
(function() {
  function initReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
    if (!els.length) { setTimeout(initReveal, 300); return; }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => observer.observe(el));

    // ── Animated number counters ──
    const counterEls = document.querySelectorAll('[data-counter]');
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const raw = el.dataset.counter;
        // Split into prefix + number + suffix so currency symbols ('฿2B+') and
        // leading zeros ('08') survive the animation instead of being mangled.
        const m = raw.match(/^(\D*)(\d[\d.]*)(\D*)$/);
        const num = m ? parseFloat(m[2]) : NaN;
        if (m && !isNaN(num) && num > 0) {
          const prefix = m[1], numStr = m[2], suffix = m[3];
          const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;
          const intWidth = numStr.split('.')[0].length; // preserve leading zeros
          const dur = 1800;
          const start = performance.now();
          function tick(now) {
            const p = Math.min((now - start) / dur, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - p, 3);
            const parts = (num * ease).toFixed(decimals).split('.');
            parts[0] = parts[0].padStart(intWidth, '0');
            el.textContent = prefix + parts.join('.') + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counterEls.forEach(el => counterObs.observe(el));
  }
  setTimeout(initReveal, 800);
})();

})();
