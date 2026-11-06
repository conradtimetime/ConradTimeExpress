'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { transformSync } = require('@babel/core');
const jsxPlugin = require('@babel/plugin-transform-react-jsx');

const root = path.resolve(__dirname, '../..');
const sourcePaths = {
  Nav: 'src/components/Nav.jsx', Hero: 'src/components/Hero.jsx',
  Brands: 'src/components/sections/Brands.jsx', Services: 'src/components/sections/Services.jsx',
  WhyUs: 'src/components/sections/WhyUs.jsx', Process: 'src/components/sections/Process.jsx',
  Testimonials: 'src/components/sections/Testimonials.jsx', Packages: 'src/components/sections/Packages.jsx',
  FloatingLine: 'src/components/FloatingLine.jsx',
};
const compiled = new Map();
function jsx(relativePath) {
  if (!compiled.has(relativePath)) {
    compiled.set(relativePath, transformSync(fs.readFileSync(path.join(root, relativePath), 'utf8'), {
      plugins: [jsxPlugin], babelrc: false, configFile: false,
    }).code);
  }
  return compiled.get(relativePath);
}

function* descendants(node) {
  if (Array.isArray(node)) { for (const child of node) yield* descendants(child); return; }
  if (!node || typeof node !== 'object') return;
  yield node;
  for (const child of node.props?.children || []) yield* descendants(child);
}
function text(node) {
  if (Array.isArray(node)) return node.map(text).join('');
  if (node === undefined || node === null || node === false) return '';
  if (typeof node !== 'object') return String(node);
  return (node.props?.children || []).map(text).join('');
}
function hasClass(node, name) {
  return String(node.props?.className || '').split(/\s+/).includes(name);
}

// Execute the real JSX and handlers. This is not a DOM/CSS or accessibility-tree
// emulator; browser tests separately verify geometry, keyboard, and rendering.
function mount(componentName, options = {}) {
  const slots = [];
  const listeners = new Map();
  const timers = new Map();
  const observers = new Set();
  const frames = new Map();
  const mediaQueries = new Map();
  const calls = { scroll: [], language: [], stateUpdates: 0 };
  let cursor = 0, dirty = false, effects = [], tree, clock = 0, nextTimer = 1;
  let language = options.language || 'en';
  let props = options.props || {};
  let nextFrame = 1;

  const React = {
    Fragment: Symbol('Fragment'),
    createElement(type, properties, ...children) {
      return { type, props: { ...properties, children: children.flat(Infinity) } };
    },
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], value => {
        calls.stateUpdates += 1;
        const next = typeof value === 'function' ? value(slots[index]) : value;
        if (!Object.is(next, slots[index])) { slots[index] = next; dirty = true; }
      }];
    },
    useRef(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = { current: initial };
      return slots[index];
    },
    useEffect(effect, dependencies) {
      const index = cursor++;
      const previous = slots[index];
      if (!previous || dependencies.some((value, i) => !Object.is(value, previous.dependencies[i]))) {
        effects.push(() => {
          previous?.cleanup?.();
          slots[index] = { dependencies, cleanup: effect() };
        });
      }
    },
  };
  React.useLayoutEffect = React.useEffect;
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.add(this); }
    observe(target) { this.targets.add(target); }
    disconnect() { observers.delete(this); this.targets.clear(); }
  }
  const timer = (callback, delay, interval) => {
    const id = nextTimer++;
    timers.set(id, { callback, due: clock + delay, interval });
    return id;
  };
  const context = {
    React, IntersectionObserver,
    setTimeout: (callback, delay) => timer(callback, delay, 0),
    clearTimeout: id => timers.delete(id),
    setInterval: (callback, delay) => timer(callback, delay, delay),
    clearInterval: id => timers.delete(id),
    requestAnimationFrame: callback => { const id = nextFrame++; frames.set(id, callback); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    // Only what components query: options.elements maps a selector to a stub.
    document: { querySelector: selector => options.elements?.[selector] || null },
    window: {
      innerWidth: options.width || 1440, innerHeight: options.height || 900, IntersectionObserver,
      matchMedia(query) {
        if (!mediaQueries.has(query)) {
          const callbacks = new Set();
          mediaQueries.set(query, {
            matches: query.includes('prefers-reduced-motion') ? Boolean(options.reducedMotion) : false,
            addEventListener: (_name, callback) => callbacks.add(callback),
            removeEventListener: (_name, callback) => callbacks.delete(callback),
            callbacks,
          });
        }
        return mediaQueries.get(query);
      },
      addEventListener(name, callback) {
        if (!listeners.has(name)) listeners.set(name, new Set());
        listeners.get(name).add(callback);
      },
      removeEventListener: (name, callback) => listeners.get(name)?.delete(callback),
      scrollTo: value => calls.scroll.push(value),
    },
  };
  vm.createContext(context);
  for (const file of ['config', 'copy', 'reviews', 'assets', 'policies', 'site-data']) {
    const relativePath = `src/data/${file}.js`;
    vm.runInContext(fs.readFileSync(path.join(root, relativePath), 'utf8'), context, { filename: relativePath });
  }
  vm.runInContext(jsx('src/components/shared.jsx'), context, { filename: 'shared.jsx' });
  // CardSwiper has its own geometry tests; keep its real section children and
  // props here without pretending to implement layout or scroll measurements.
  context.window.CardSwiper = properties => ({ type: 'div', props: properties });
  const relativePath = sourcePaths[componentName];
  assert.ok(relativePath, `Unknown section ${componentName}`);
  vm.runInContext(jsx(relativePath), context, { filename: relativePath });

  function expand(node) {
    if (Array.isArray(node)) return node.map(expand).flat(Infinity);
    if (!node || typeof node !== 'object') return node;
    if (typeof node.type === 'function') return expand(node.type(node.props));
    return { ...node, props: { ...node.props, children: (node.props.children || []).map(expand).flat(Infinity) } };
  }
  function render() {
    let attempts = 0;
    do {
      assert.ok(attempts++ < 20, 'Component must settle');
      dirty = false; cursor = 0; effects = [];
      const c = context.window.CONRAD_EXPRESS_DATA.COPY[language];
      tree = expand(context.window[componentName]({
        c, gold: '#e2b56f', navy: '#0f1e35', language, lang: language,
        layout: 'dark', scrolled: false, setLang: value => calls.language.push(value), ...props,
      }));
      for (const node of descendants(tree)) {
        if (node.props.ref && !node.props.ref.current) {
          const properties = new Map();
          node.props.ref.current = { id: node.props.id, tag: node.type, style: {
            setProperty: (key, value) => properties.set(key, value),
            getPropertyValue: key => properties.get(key) || '',
          } };
        }
      }
      effects.forEach(effect => effect());
    } while (dirty);
  }
  render();
  const flushFrames = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback(clock));
    render();
  };
  const all = predicate => [...descendants(tree)].filter(predicate);
  return {
    calls,
    get tree() { return tree; },
    get data() { return context.window.CONRAD_EXPRESS_DATA; },
    all,
    find: predicate => all(predicate)[0],
    fire(node, eventName = 'onClick', event = { stopPropagation() {} }) {
      assert.equal(typeof node?.props[eventName], 'function', `Missing ${eventName} handler`);
      node.props[eventName](event); render();
    },
    setLanguage(value) { language = value; render(); },
    setProps(value) { props = { ...props, ...value }; render(); },
    scroll() {
      listeners.get('scroll')?.forEach(callback => callback());
      flushFrames();
    },
    resize(width) {
      context.window.innerWidth = width;
      listeners.get('resize')?.forEach(callback => callback());
      flushFrames();
    },
    intersect(id, isIntersecting) {
      for (const observer of observers) {
        const target = [...observer.targets].find(target => target.id === id || target === options.elements?.[id]);
        if (target) observer.callback([{ target, isIntersecting }]);
      }
      flushFrames();
    },
    reducedMotion(matches) {
      for (const [query, media] of mediaQueries) {
        if (!query.includes('prefers-reduced-motion')) continue;
        media.matches = matches;
        media.callbacks.forEach(callback => callback(media));
      }
      render();
    },
    flushFrames,
    unmount() { slots.forEach(slot => slot?.cleanup?.()); },
    advanceTimers(milliseconds) {
      const end = clock + milliseconds;
      let runs = 0;
      while (true) {
        const due = [...timers].filter(([, value]) => value.due <= end).sort((a, b) => a[1].due - b[1].due)[0];
        if (!due) break;
        assert.ok(runs++ < 1000, 'Timer loop must be bounded');
        const [id, value] = due;
        clock = value.due;
        if (value.interval) value.due += value.interval;
        else timers.delete(id);
        value.callback();
        render();
      }
      clock = end;
      render();
    },
  };
}

module.exports = { mount, text, descendants, hasClass, root };
