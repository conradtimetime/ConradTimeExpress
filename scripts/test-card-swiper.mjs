import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import { transformSync } from '@babel/core';
import jsxPlugin from '@babel/plugin-transform-react-jsx';

// Exercise the actual component with deterministic row geometry. Browser QA
// still checks CSS scroll snapping; these cases protect navigation and syncing.
const source = await fs.readFile(new URL('../src/components/shared.jsx', import.meta.url), 'utf8');
const { code } = transformSync(source, { plugins: [jsxPlugin] });

function mount({ count, width, gap, viewport }) {
  let cursor = 0;
  let dirty = false;
  let effects = [];
  let tree;
  let cards = Array.from({ length: count }, (_, i) => ({ key: i }));
  const slots = [];
  const observers = new Set();
  const listeners = new Map();
  const calls = [];
  const row = {
    scrollLeft: 0,
    clientLeft: 0,
    clientWidth: viewport,
    scrollWidth: count * width + (count - 1) * gap,
    getBoundingClientRect: () => ({ left: 40 }),
    scrollTo(options) {
      calls.push(options);
      this.scrollLeft = options.left;
      tree.props.children[0].props.onScroll();
    },
  };
  const setGeometry = (nextWidth, nextViewport, nextGap = gap) => {
    width = nextWidth;
    gap = nextGap;
    row.clientWidth = nextViewport;
    row.scrollWidth = count * width + (count - 1) * gap;
    row.scrollLeft = Math.min(row.scrollLeft, Math.max(0, row.scrollWidth - row.clientWidth));
    row.children = Array.from({ length: count }, (_, i) => ({
      getBoundingClientRect: () => ({ left: 40 + i * (width + gap) - row.scrollLeft }),
    }));
  };
  setGeometry(width, viewport);

  const React = {
    createElement(type, props, ...children) {
      return { type, props: { ...props, children: children.flat() } };
    },
    useRef(initial) {
      const i = cursor++;
      return slots[i] ||= { current: initial };
    },
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = initial;
      return [slots[i], (value) => {
        const next = typeof value === 'function' ? value(slots[i]) : value;
        if (!Object.is(next, slots[i])) {
          slots[i] = next;
          dirty = true;
        }
      }];
    },
    useLayoutEffect(effect, dependencies) {
      const i = cursor++;
      const previous = slots[i];
      if (!previous || dependencies.some((value, j) => !Object.is(value, previous.dependencies[j]))) {
        effects.push(() => {
          previous?.cleanup?.();
          slots[i] = { dependencies, cleanup: effect() };
        });
      }
    },
  };
  const context = { React, window: {
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
  }, ResizeObserver: class {
    constructor(callback) { this.callback = callback; observers.add(this); }
    observe() {}
    disconnect() { observers.delete(this); }
  } };
  vm.runInNewContext(code, context, { filename: 'shared.jsx' });
  const render = () => {
    let attempts = 0;
    do {
      assert.ok(attempts++ < 10, 'Component must settle after measurement');
      cursor = 0;
      dirty = false;
      effects = [];
      tree = context.window.CardSwiper({ children: cards, className: 'swipe' });
      tree.props.children[0].props.ref.current = row;
      effects.forEach((effect) => effect());
    } while (dirty);
  };
  render();
  const dots = () => tree.props.children[3].props.children;
  const click = (button) => { button.props.onClick(); render(); };
  return {
    row,
    calls,
    dots,
    next: () => click(tree.props.children[2]),
    prev: () => click(tree.props.children[1]),
    dot: (i) => click(dots()[i]),
    active: () => dots().findIndex((dot) => dot.props['aria-current'] === 'true'),
    swipe(left) { row.scrollLeft = left; tree.props.children[0].props.onScroll(); render(); },
    resize(nextWidth, nextViewport, nextGap) {
      setGeometry(nextWidth, nextViewport, nextGap);
      [...observers].forEach((observer) => observer.callback());
      render();
    },
    replaceChildren() { cards = cards.map((card) => ({ ...card, language: 'th' })); render(); },
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
assert.ok(tablet.calls.every((call) => !('top' in call)), 'Navigation only moves horizontally');

tablet.resize(354, 346);
assert.equal(tablet.dots().length, 10, 'Mobile Services keeps one dot per wide card');
tablet.dot(9);
tablet.next();
assert.equal(tablet.row.scrollLeft, 0, 'Mobile Services wraps from its last card');
tablet.replaceChildren();
assert.equal(tablet.dots().length, 10, 'Replacing translated cards remeasures safely');
tablet.resize(150, 1626, 14);
assert.equal(tablet.dots().length, 1, 'Desktop grid has no phantom scroll positions');

const packages = mount({ count: 4, width: 320, gap: 12, viewport: 320 });
assert.equal(packages.dots().length, 4, 'Mobile Packages keeps four positions');
packages.prev();
assert.equal(packages.active(), 3);
packages.next();
assert.equal(packages.active(), 0);

console.log('Card swiper regression checks passed.');
