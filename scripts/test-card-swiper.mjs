import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { transformSync } from '@babel/core';
import jsxPlugin from '@babel/plugin-transform-react-jsx';

// Exercise the real component's geometry, lifecycle and scheduling. CSS snap
// behavior and actual frame times are checked separately in the browser.
const source = await fs.readFile(new URL('../src/components/shared.jsx', import.meta.url), 'utf8');
const { code } = transformSync(source, { plugins: [jsxPlugin] });

function mount({ count, width, gap, viewport, screenWidth = viewport, nearby = true,
  mediaQuery, reducedMotion = false, flushInitially = true, observerSupport = true }) {
  let cursor = 0, dirty = false, effects = [], tree, reads = 0, effectRuns = 0;
  let frameId = 0, rowWidth = viewport, contentWidth;
  let cards = Array.from({ length: count }, (_, i) => ({ key: i }));
  const slots = [], resizeObservers = new Set(), intersectionObservers = new Set(), mutations = new Set();
  const listeners = new Map(), frames = new Map(), media = new Map(), calls = [];
  const row = {
    scrollLeft: 0,
    clientLeft: 0,
    get clientWidth() { reads++; return rowWidth; },
    get scrollWidth() { reads++; return contentWidth; },
    getBoundingClientRect() { reads++; return { left: 40 }; },
    scrollTo(options) {
      calls.push(options);
      this.scrollLeft = options.left;
      tree.props.children[0].props.onScroll();
    },
  };
  const setGeometry = (nextWidth, nextViewport, nextGap = gap) => {
    width = nextWidth;
    gap = nextGap;
    rowWidth = nextViewport;
    contentWidth = count * width + (count - 1) * gap;
    row.scrollLeft = Math.min(row.scrollLeft, Math.max(0, contentWidth - rowWidth));
    row.children = Array.from({ length: count }, (_, i) => ({
      getBoundingClientRect() { reads++; return { left: 40 + i * (width + gap) - row.scrollLeft }; },
    }));
  };
  setGeometry(width, viewport);
  function listen(name, callback) {
    if (!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name).add(callback);
  }
  const matchMedia = query => {
    if (!media.has(query)) {
      const callbacks = new Set();
      const value = {
        get matches() {
          if (query === '(prefers-reduced-motion: reduce)') return reducedMotion;
          return screenWidth <= Number(query.match(/max-width:\s*(\d+)px/)[1]);
        },
        addEventListener: (_event, callback) => callbacks.add(callback),
        removeEventListener: (_event, callback) => callbacks.delete(callback),
        callbacks,
      };
      media.set(query, value);
    }
    return media.get(query);
  };
  const React = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children: children.flat() } }),
    useRef(initial) { const i = cursor++; return slots[i] ||= { current: initial }; },
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], (value) => {
        const next = typeof value === 'function' ? value(slots[i]) : value;
        if (!Object.is(next, slots[i])) { slots[i] = next; dirty = true; }
      }];
    },
    useEffect(effect, dependencies) {
      const i = cursor++;
      const previous = slots[i];
      if (!previous || dependencies.some((value, j) => !Object.is(value, previous.dependencies[j]))) {
        effects.push(() => {
          effectRuns++;
          previous?.cleanup?.();
          slots[i] = { dependencies, cleanup: effect() };
        });
      }
    },
  };
  class ResizeObserver {
    constructor(callback) { this.callback = callback; this.targets = new Set(); }
    observe(target) { this.targets.add(target); resizeObservers.add(this); }
    disconnect() { this.targets.clear(); resizeObservers.delete(this); }
  }
  class IntersectionObserver {
    constructor(callback, options) { this.callback = callback; this.options = options; }
    observe() { intersectionObservers.add(this); }
    disconnect() { intersectionObservers.delete(this); }
  }
  class MutationObserver {
    constructor(callback) { this.callback = callback; }
    observe() { mutations.add(this); }
    disconnect() { mutations.delete(this); }
  }
  const context = {
    React, ResizeObserver, MutationObserver,
    ...(observerSupport ? { IntersectionObserver } : {}),
    window: {
      matchMedia,
      addEventListener: listen,
      removeEventListener: (name, callback) => listeners.get(name)?.delete(callback),
    },
    requestAnimationFrame(callback) { const id = ++frameId; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
  };
  vm.runInNewContext(code, context, { filename: 'shared.jsx' });
  const render = () => {
    let attempts = 0;
    do {
      assert.ok(attempts++ < 10, 'Component must settle');
      cursor = 0; dirty = false; effects = [];
      tree = context.window.CardSwiper({ children: cards, className: 'swipe', mediaQuery });
      tree.props.children[0].props.ref.current = row;
      effects.forEach(effect => effect());
    } while (dirty);
  };
  const flushFrames = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback());
    render();
  };
  const intersect = value => {
    [...intersectionObservers].forEach(observer => observer.callback([{ isIntersecting: value }]));
    render();
  };
  const resize = (nextWidth, nextViewport, nextGap = gap, nextScreenWidth = nextViewport, flush = true) => {
    const oldMatches = [...media].map(([query, value]) => [query, value.matches]);
    screenWidth = nextScreenWidth;
    setGeometry(nextWidth, nextViewport, nextGap);
    for (const [query, previous] of oldMatches) {
      const value = media.get(query);
      if (value.matches !== previous) [...value.callbacks].forEach(callback => callback());
    }
    [...resizeObservers].forEach(observer => observer.callback());
    listeners.get('resize')?.forEach(callback => callback());
    render();
    if (flush) flushFrames();
  };
  render();
  if (nearby) intersect(true);
  if (flushInitially) flushFrames();
  const dots = () => tree.props.children[3].props.children;
  const click = button => { button.props.onClick(); render(); };
  return {
    row, calls, dots, flushFrames, intersect, resize,
    next: () => click(tree.props.children[2]),
    prev: () => click(tree.props.children[1]),
    dot: i => click(dots()[i]),
    active: () => dots().findIndex(dot => dot.props['aria-current'] === 'true'),
    get reads() { return reads; },
    get frameCount() { return frames.size; },
    get effectRuns() { return effectRuns; },
    get observerCount() { return resizeObservers.size + intersectionObservers.size + mutations.size; },
    get mediaListenerCount() { return [...media.values()].reduce((n, item) => n + item.callbacks.size, 0); },
    get windowListenerCount() { return [...listeners.values()].reduce((n, items) => n + items.size, 0); },
    notifySizes() { [...resizeObservers].forEach(observer => observer.callback()); },
    swipe(left) { row.scrollLeft = left; tree.props.children[0].props.onScroll(); render(); },
    rerender() { cards = cards.map(card => ({ ...card })); render(); },
    replaceChildren() {
      cards = cards.map(card => ({ ...card, language: 'th' }));
      setGeometry(width, rowWidth);
      render();
      [...mutations].forEach(observer => observer.callback());
      flushFrames();
    },
    unmount() { slots.forEach(slot => slot?.cleanup?.()); },
  };
}

const tablet = mount({ count: 10, width: 314, gap: 14, viewport: 944 });
assert.equal(tablet.dots().length, 9, 'Tablet dots cover unique reachable stops');
for (let i = 0; i < tablet.dots().length; i++) {
  tablet.dot(i);
  assert.equal(tablet.active(), i, `Tablet dot ${i + 1} can become active`);
}
assert.equal(tablet.row.scrollLeft, tablet.row.scrollWidth - tablet.row.clientWidth);
tablet.next();
assert.equal(tablet.row.scrollLeft, 0, 'Next wraps from the actual tablet edge');
tablet.prev();
assert.equal(tablet.active(), tablet.dots().length - 1, 'Previous wraps to the tablet edge');
tablet.swipe(660);
assert.equal(tablet.active(), 2, 'Touch scroll updates the nearest dot');
tablet.next();
assert.equal(tablet.active(), 3, 'Next continues from a manually swiped position');
assert.ok(tablet.calls.every(call => !('top' in call)), 'Navigation only moves horizontally');

tablet.resize(354, 346);
assert.equal(tablet.dots().length, 10, 'Mobile Services keeps one dot per wide card');
tablet.dot(9);
tablet.next();
assert.equal(tablet.row.scrollLeft, 0, 'Mobile Services wraps from its last card');
const previousRuns = tablet.effectRuns;
const previousReads = tablet.reads;
tablet.rerender();
assert.equal(tablet.effectRuns, previousRuns, 'Parent rerenders do not re-subscribe observers');
assert.equal(tablet.reads, previousReads, 'New children array identity does not remeasure');
tablet.replaceChildren();
assert.equal(tablet.dots().length, 10, 'Translated keyed cards keep working after replacement');
assert.equal(tablet.effectRuns, previousRuns, 'Card replacements do not recreate the effect');
const beforeDesktop = tablet.reads;
tablet.resize(150, 1626);
assert.equal(tablet.dots().length, 1, 'Desktop grid has no phantom scroll positions');
assert.equal(tablet.reads, beforeDesktop, 'Entering desktop mode reads no layout');
assert.equal(tablet.observerCount, 0, 'Desktop mode removes all geometry observers');
tablet.resize(314, 944);
assert.equal(tablet.dots().length, 1, 'Returning to swipe mode waits for intersection');
tablet.intersect(true);
tablet.flushFrames();
assert.equal(tablet.dots().length, 9, 'Visible carousel reactivates after desktop resize');

const packages = mount({ count: 4, width: 320, gap: 12, viewport: 320, mediaQuery: '(max-width:767px)' });
assert.equal(packages.dots().length, 4, 'Mobile Packages keeps four positions');
packages.prev();
assert.equal(packages.active(), 3);
packages.next();
assert.equal(packages.active(), 0);
const packageGrid = mount({ count: 4, width: 320, gap: 12, viewport: 900, mediaQuery: '(max-width:767px)' });
assert.equal(packageGrid.reads, 0, 'Packages does not measure its tablet grid');

const belowFold = mount({ count: 10, width: 314, gap: 14, viewport: 944, nearby: false });
assert.equal(belowFold.reads, 0, 'Below-the-fold carousel has no geometry reads');
belowFold.resize(300, 900);
assert.equal(belowFold.reads, 0, 'Offscreen resize does not measure');
belowFold.intersect(true);
assert.equal(belowFold.reads, 0, 'Intersection schedules work instead of synchronous layout');
assert.equal(belowFold.frameCount, 1);
belowFold.notifySizes();
belowFold.notifySizes();
assert.equal(belowFold.frameCount, 1, 'ResizeObserver notifications share one frame');
belowFold.flushFrames();
assert.ok(belowFold.reads > 0, 'Nearby carousel measures on its scheduled frame');
const once = belowFold.reads;
belowFold.notifySizes();
belowFold.intersect(false);
assert.equal(belowFold.frameCount, 0, 'Leaving viewport cancels pending geometry');
belowFold.flushFrames();
assert.equal(belowFold.reads, once, 'Offscreen carousel remains idle');

const desktop = mount({ count: 10, width: 150, gap: 14, viewport: 1626 });
assert.equal(desktop.reads, 0, 'Desktop initial render reads no layout');
assert.equal(desktop.observerCount, 0, 'Desktop creates no layout observers');
const deferred = mount({ count: 4, width: 320, gap: 12, viewport: 320, flushInitially: false });
assert.equal(deferred.reads, 0, 'Initial passive effect does not synchronously read geometry');
assert.equal(deferred.frameCount, 1);
deferred.unmount();
assert.equal(deferred.frameCount, 0, 'Unmount cancels pending animation frame');
assert.equal(deferred.observerCount, 0, 'Unmount disconnects every observer');
assert.equal(deferred.mediaListenerCount + deferred.windowListenerCount, 0, 'Unmount removes all listeners');
deferred.flushFrames();
assert.equal(deferred.reads, 0, 'Unmounted component never measures');

const reduced = mount({ count: 4, width: 320, gap: 12, viewport: 320, reducedMotion: true });
reduced.next();
assert.equal(reduced.calls[0].behavior, 'auto', 'Reduced motion avoids smooth scrolling');
const fallback = mount({ count: 4, width: 320, gap: 12, viewport: 320, observerSupport: false });
assert.equal(fallback.dots().length, 4, 'Navigation works without IntersectionObserver');

console.log('Card swiper navigation, scheduling, visibility and cleanup checks passed.');
