'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { transformSync } = require('@babel/core');
const jsxPlugin = require('@babel/plugin-transform-react-jsx');

// Run the shipped component and its real event handlers without a browser or
// live endpoint. The small renderer retains hook state across prop changes.
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/components/sections/Contact.jsx'), 'utf8');
const { code } = transformSync(source, {
  plugins: [jsxPlugin], babelrc: false, configFile: false,
});
const copyContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'src/data/copy.js'), 'utf8'), copyContext);
const copy = copyContext.window.CONRAD_EXPRESS_COPY;

function* descendants(node) {
  if (!node || typeof node !== 'object') return;
  yield node;
  for (const child of node.props?.children || []) yield* descendants(child);
}

function text(node) {
  if (node === null || node === undefined || node === false) return '';
  if (typeof node !== 'object') return String(node);
  return (node.props.children || []).map(text).join('');
}

function mount({
  fetchResult, language = 'en', analyticsThrows = false, endpoint = '/api/contact',
  pageUrl = 'https://conradexpress.com/', userAgent = 'Contact regression test',
} = {}) {
  const slots = [];
  const requests = [];
  const events = [];
  const timers = new Map();
  let cursor = 0;
  let dirty = false;
  let effects = [];
  let tree;
  let nextTimer = 1;
  const React = {
    createElement(type, props, ...children) {
      return { type, props: { ...props, children: children.flat(Infinity) } };
    },
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], (value) => {
        const next = typeof value === 'function' ? value(slots[index]) : value;
        if (!Object.is(next, slots[index])) {
          slots[index] = next;
          dirty = true;
        }
      }];
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
  const context = {
    React,
    ReactDOM: { createPortal: (node) => node },
    document: { body: { style: {} } },
    setTimeout(callback) { const id = nextTimer++; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); },
    async fetch(url, options) {
      requests.push({ url, options });
      return fetchResult ? fetchResult() : { ok: true, json: async () => ({ ok: true }) };
    },
    window: {
      CONRAD_EXPRESS_DATA: {
        SITE_CONFIG: { contact: { formEndpoint: endpoint } },
        POLICIES: { order: [] },
      },
      SectionEyebrow() {},
      location: { href: pageUrl },
      navigator: { userAgent },
      addEventListener() {},
      removeEventListener() {},
      ConradAnalytics: {
        enabled: true,
        track(name, parameters) {
          events.push({ name, parameters });
          if (analyticsThrows) throw new Error('Analytics unavailable');
        },
      },
    },
  };
  vm.runInNewContext(code, context, { filename: 'Contact.jsx' });
  function render() {
    let attempts = 0;
    do {
      assert.ok(attempts++ < 10, 'Component effects must settle');
      cursor = 0;
      dirty = false;
      effects = [];
      tree = context.window.Contact({ c: copy[language], gold: '#e2b56f', navy: '#07101e', language });
      effects.forEach((effect) => effect());
    } while (dirty);
  }
  const find = (predicate) => [...descendants(tree)].find(predicate);
  const field = (name) => find((node) => node.props.name === name);
  render();
  return {
    requests, events,
    get tree() { return tree; },
    field,
    values: () => Object.fromEntries(['name', 'phone', 'serviceType', 'message'].map((name) => [name, field(name).props.value])),
    status: () => text(find((node) => node.props.className === 'contact-status')),
    change(name, value) { field(name).props.onChange({ target: { value } }); render(); },
    language(value) { language = value; render(); },
    async submit() {
      let prevented = false;
      const result = find((node) => node.type === 'form').props.onSubmit({ preventDefault() { prevented = true; } });
      assert.equal(prevented, true);
      render();
      await result;
      render();
    },
  };
}

const filledValues = {
  name: 'Test customer', phone: '0812345678', serviceType: 'luxury-watches', message: 'Please call before pickup.',
};
function fill(form) {
  for (const [name, value] of Object.entries(filledValues)) form.change(name, value);
}

for (const [name, fetchResult] of [
  ['backend rejects storage', async () => ({ ok: true, json: async () => ({ ok: false }) })],
  ['backend returns non-JSON', async () => ({ ok: true, json: async () => { throw new SyntaxError('HTML response'); } })],
  ['HTTP request fails', async () => ({ ok: false, json: async () => ({ ok: true }) })],
  ['network request fails', async () => { throw new TypeError('Network unavailable'); }],
]) {
  test(`${name}: retain the form and do not record a lead`, async () => {
    const form = mount({ fetchResult });
    fill(form);
    await form.submit();
    assert.deepEqual(form.values(), filledValues);
    assert.match(form.status(), /Unable to submit/);
    assert.equal(form.events.length, 0);
    assert.equal(form.requests.length, 1);
    for (const name of Object.keys(filledValues)) assert.equal(form.field(name).props.disabled, false);
  });
}

test('a missing endpoint retains the form and cannot acknowledge a lead', async () => {
  const form = mount({ endpoint: '' });
  fill(form);
  await form.submit();
  assert.deepEqual(form.values(), filledValues);
  assert.match(form.status(), /Unable to submit/);
  assert.equal(form.requests.length, 0);
  assert.equal(form.events.length, 0);
});

test('acknowledged storage clears the form and records one lead with a stable service ID', async () => {
  const form = mount({ language: 'th' });
  fill(form);
  await form.submit();
  assert.deepEqual(form.values(), { name: '', phone: '', serviceType: '', message: '' });
  assert.match(form.status(), /รับคำขอของคุณแล้ว/);
  assert.equal(form.requests.length, 1);
  const { url, options } = form.requests[0];
  assert.equal(url, '/api/contact');
  assert.equal(options.method, 'POST');
  assert.equal(options.mode, 'same-origin');
  assert.equal(options.headers['Content-Type'], 'application/json');
  const payload = JSON.parse(options.body);
  assert.equal(payload.name, filledValues.name);
  assert.equal(payload.phone, filledValues.phone);
  assert.equal(payload.message, filledValues.message);
  assert.equal(payload.type, 'นาฬิกาหรู');
  assert.equal(payload.language, 'th');
  assert.equal(form.events.length, 1);
  assert.equal(form.events[0].name, 'generate_lead');
  assert.deepEqual(Object.keys(form.events[0].parameters).sort(), ['form_language', 'form_name', 'shipment_type']);
  assert.equal(form.events[0].parameters.shipment_type, 'luxury-watches');
});

test('analytics errors do not undo an acknowledged submission', async () => {
  const form = mount({ analyticsThrows: true });
  fill(form);
  await form.submit();
  assert.deepEqual(form.values(), { name: '', phone: '', serviceType: '', message: '' });
  assert.match(form.status(), /Your request has been received/);
  assert.equal(form.events.length, 1);
});

test('oversized browser metadata is capped without changing customer fields', async () => {
  const pageUrl = `https://conradexpress.com/?campaign=${'x'.repeat(3000)}`;
  const userAgent = `Contact regression browser ${'y'.repeat(1000)}`;
  const form = mount({ pageUrl, userAgent });
  fill(form);
  await form.submit();
  assert.match(form.status(), /Your request has been received/);
  assert.equal(form.events.length, 1);
  const payload = JSON.parse(form.requests[0].options.body);
  assert.equal(payload.pageUrl, pageUrl.slice(0, 2048));
  assert.equal(payload.pageUrl.length, 2048);
  assert.equal(payload.userAgent, userAgent.slice(0, 512));
  assert.equal(payload.userAgent.length, 512);
  assert.equal(payload.name, filledValues.name);
  assert.equal(payload.phone, filledValues.phone);
  assert.equal(payload.message, filledValues.message);
  assert.equal(payload.type, 'Luxury Watches');
});

test('changing language preserves selection and renders the translated service label once', () => {
  const englishIds = Array.from(copy.en.services.items, (service) => service.id);
  const thaiIds = Array.from(copy.th.services.items, (service) => service.id);
  assert.deepEqual(englishIds, thaiIds);
  assert.equal(new Set(englishIds).size, englishIds.length);
  assert.equal(englishIds.filter((id) => id === 'other').length, 1);
  const form = mount();
  form.change('serviceType', 'luxury-watches');
  const selectedLabel = () => text(form.field('serviceType').props.children.find((option) => option.props.value === form.field('serviceType').props.value));
  assert.equal(selectedLabel(), 'Luxury Watches');
  form.language('th');
  assert.equal(form.field('serviceType').props.value, 'luxury-watches');
  assert.equal(selectedLabel(), 'นาฬิกาหรู');
  const options = form.field('serviceType').props.children;
  assert.equal(options.filter((option) => option.props.value === 'other').length, 1);
  form.language('en');
  assert.equal(form.field('serviceType').props.value, 'luxury-watches');
  assert.equal(selectedLabel(), 'Luxury Watches');
});

test('all four form fields have a unique ID and an associated visible label in both languages', () => {
  const form = mount();
  for (const language of ['en', 'th']) {
    form.language(language);
    const labels = [...descendants(form.tree)].filter((node) => node.type === 'label');
    const ids = [];
    for (const name of Object.keys(filledValues)) {
      const id = form.field(name).props.id;
      assert.ok(id, `${name} needs an ID`);
      ids.push(id);
      const associated = labels.filter((label) => label.props.htmlFor === id);
      assert.equal(associated.length, 1, `${name} needs one associated label`);
      assert.ok(text(associated[0]).trim(), `${name} needs visible label text`);
    }
    assert.equal(new Set(ids).size, 4);
  }
});
