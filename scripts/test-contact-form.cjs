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
vm.runInNewContext(fs.readFileSync(path.join(root, 'src/data/policies.js'), 'utf8'), copyContext);
const copy = copyContext.window.CONRAD_EXPRESS_COPY;
const policies = copyContext.window.CONRAD_EXPRESS_POLICIES;

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
  const listeners = new Map();
  let cursor = 0;
  let dirty = false;
  let effects = [];
  let tree;
  let nextTimer = 1;
  let clock = 0;
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
    document: { body: { style: { overflow: 'auto' } } },
    setTimeout(callback, delay = 0) {
      const id = nextTimer++;
      timers.set(id, { callback, due: clock + delay });
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
    async fetch(url, options) {
      requests.push({ url, options });
      return fetchResult ? fetchResult() : { ok: true, json: async () => ({ ok: true }) };
    },
    window: {
      CONRAD_EXPRESS_DATA: {
        SITE_CONFIG: { contact: { formEndpoint: endpoint } },
        POLICIES: policies,
      },
      SectionEyebrow() {},
      location: { href: pageUrl },
      navigator: { userAgent },
      addEventListener(name, handler) {
        if (!listeners.has(name)) listeners.set(name, new Set());
        listeners.get(name).add(handler);
      },
      removeEventListener(name, handler) { listeners.get(name)?.delete(handler); },
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
  const panel = () => find((node) => typeof node.type === 'function' && node.type.name === 'PolicyPanel');
  const policyTree = () => { const node = panel(); return node ? node.type(node.props) : null; };
  render();
  return {
    requests, events,
    get tree() { return tree; },
    field,
    button: () => find((node) => node.type === 'button' && node.props.type === 'submit'),
    values: () => Object.fromEntries(['name', 'phone', 'serviceType', 'message'].map((name) => [name, field(name).props.value])),
    status: () => text(find((node) => node.props.className === 'contact-status')),
    change(name, value) { field(name).props.onChange({ target: { value } }); render(); },
    language(value) { language = value; render(); },
    advance(milliseconds) {
      const until = clock + milliseconds;
      let iterations = 0;
      while (true) {
        const next = [...timers.entries()].filter(([, timer]) => timer.due <= until)
          .sort((a, b) => a[1].due - b[1].due)[0];
        if (!next) break;
        assert.ok(iterations++ < 100, 'Mock timers must settle');
        const [id, timer] = next;
        timers.delete(id);
        clock = timer.due;
        timer.callback();
        render();
      }
      clock = until;
      render();
    },
    policyTree,
    bodyOverflow: () => context.document.body.style.overflow,
    openPolicy(index) {
      const triggers = [...descendants(tree)].filter((node) => node.props['aria-haspopup'] === 'dialog');
      assert.equal(triggers[index].props.disabled, false);
      triggers[index].props.onClick();
      render();
    },
    closePolicy() {
      const close = [...descendants(policyTree())].find((node) => node.props.className === 'contact-policy-close');
      close.props.onClick();
      render();
    },
    clickPolicyOverlay() { policyTree().props.onClick(); render(); },
    clickPolicyContent() {
      let stopped = false;
      const dialog = [...descendants(policyTree())].find((node) => node.props.role === 'dialog');
      dialog.props.onClick({ stopPropagation() { stopped = true; } });
      render();
      return stopped;
    },
    dispatch(name, event = {}) { [...(listeners.get(name) || [])].forEach((handler) => handler(event)); render(); },
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

for (const [id, name, fetchResult] of [
  ['TC-CT01', 'backend rejects storage', async () => ({ ok: true, json: async () => ({ ok: false }) })],
  ['TC-CT02', 'backend returns non-JSON', async () => ({ ok: true, json: async () => { throw new SyntaxError('HTML response'); } })],
  ['TC-CT03', 'HTTP request fails', async () => ({ ok: false, json: async () => ({ ok: true }) })],
  ['TC-CT04', 'network request fails', async () => { throw new TypeError('Network unavailable'); }],
]) {
  test(`${id} ${name}: retain the form and do not record a lead`, async () => {
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

test('TC-CT05 a missing endpoint retains the form and cannot acknowledge a lead', async () => {
  const form = mount({ endpoint: '' });
  fill(form);
  await form.submit();
  assert.deepEqual(form.values(), filledValues);
  assert.match(form.status(), /Unable to submit/);
  assert.equal(form.requests.length, 0);
  assert.equal(form.events.length, 0);
});

test('TC-CT06 acknowledged storage clears the form and records one lead with a stable service ID', async () => {
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

test('TC-CT07 analytics errors do not undo an acknowledged submission', async () => {
  const form = mount({ analyticsThrows: true });
  fill(form);
  await form.submit();
  assert.deepEqual(form.values(), { name: '', phone: '', serviceType: '', message: '' });
  assert.match(form.status(), /Your request has been received/);
  assert.equal(form.events.length, 1);
});

test('TC-CT08 oversized browser metadata is capped without changing customer fields', async () => {
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

test('TC-CT09 changing language preserves selection and renders the translated service label once', () => {
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

test('TC-CT10 all four form fields have a unique ID and an associated visible label in both languages', () => {
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

test('TC-CT11 success survives more than two hours, language changes and typing; reload starts fresh', async () => {
  const form = mount({ language: 'th' });
  fill(form);
  await form.submit();
  form.advance(2 * 60 * 60 * 1000 + 1000);
  assert.match(form.status(), /รับคำขอของคุณแล้ว/);
  form.language('en');
  assert.match(form.status(), /Your request has been received/);
  form.change('name', 'Another draft');
  form.advance(10000);
  assert.match(form.status(), /Your request has been received/);
  assert.equal(form.requests.length, 1);
  const reloaded = mount();
  assert.equal(reloaded.status(), '');
  assert.deepEqual(reloaded.values(), { name: '', phone: '', serviceType: '', message: '' });
});

test('TC-CT12 an in-flight submission disables all fields and blocks a second submission', async () => {
  let finish;
  const response = new Promise((resolve) => { finish = resolve; });
  const form = mount({ fetchResult: () => response });
  fill(form);
  const pending = form.submit();
  assert.equal(form.requests.length, 1);
  for (const name of Object.keys(filledValues)) assert.equal(form.field(name).props.disabled, true);
  assert.equal(form.button().props.disabled, true);
  assert.match(text(form.button()), /SUBMITTING/);
  await form.submit();
  assert.equal(form.requests.length, 1);
  finish({ ok: true, json: async () => ({ ok: true }) });
  await pending;
  assert.equal(form.button().props.disabled, false);
  assert.match(form.status(), /Your request has been received/);
  assert.equal(form.events.length, 1);
});

test('TC-CT13 missing, whitespace-only and unknown required values never reach the endpoint', async () => {
  for (const [field, value] of [
    ['name', ''], ['name', '   '], ['phone', ''], ['phone', '\t '],
    ['serviceType', ''], ['serviceType', 'unknown-service'],
  ]) {
    const form = mount();
    fill(form);
    form.change(field, value);
    await form.submit();
    assert.equal(form.requests.length, 0, `${field}=${JSON.stringify(value)} must not be submitted`);
    assert.equal(form.events.length, 0);
    assert.equal(form.status(), '');
  }
});

test('TC-CT14 required constraints, input limits and autofill hints follow the form contract', () => {
  const form = mount();
  assert.equal(form.field('name').props.required, true);
  assert.equal(form.field('name').props.maxLength, 80);
  assert.equal(form.field('name').props.autoComplete, 'name');
  assert.equal(form.field('phone').props.required, true);
  assert.equal(form.field('phone').props.type, 'tel');
  assert.equal(form.field('phone').props.inputMode, 'tel');
  assert.equal(form.field('phone').props.maxLength, 32);
  assert.equal(form.field('phone').props.autoComplete, 'tel');
  assert.equal(form.field('serviceType').props.required, true);
  assert.equal(form.field('message').props.required, undefined);
  assert.equal(form.field('message').props.maxLength, 600);
});

test('TC-CT15 optional message can be empty and customer text is trimmed before submission', async () => {
  const form = mount();
  fill(form);
  form.change('name', '  Test customer  ');
  form.change('phone', '  0812345678 ');
  form.change('message', '   ');
  await form.submit();
  const payload = JSON.parse(form.requests[0].options.body);
  assert.equal(payload.name, filledValues.name);
  assert.equal(payload.phone, filledValues.phone);
  assert.equal(payload.message, '');
  assert.match(form.status(), /Your request has been received/);
});

for (const [index, policyId] of ['privacy', 'terms', 'insurance'].entries()) {
  test(`TC-PO0${index + 1} ${policyId} policy opens from its footer link and Close restores scrolling`, () => {
    const form = mount();
    assert.equal(form.bodyOverflow(), 'auto');
    form.openPolicy(index);
    const modal = form.policyTree();
    const dialog = [...descendants(modal)].find((node) => node.props.role === 'dialog');
    assert.ok(dialog, 'Policy must render a dialog');
    assert.equal(dialog.props['aria-modal'], 'true');
    const title = [...descendants(modal)].find((node) => node.props.id === dialog.props['aria-labelledby']);
    assert.equal(text(title), policies.documents[policyId].title);
    assert.equal(form.bodyOverflow(), 'hidden');
    form.closePolicy();
    assert.equal(form.policyTree(), null);
    assert.equal(form.bodyOverflow(), 'auto');
  });
}

test('TC-PO04 Escape closes the policy, restores scrolling and leaves normal keys alone', () => {
  const form = mount();
  form.openPolicy(0);
  form.dispatch('keydown', { key: 'a' });
  assert.ok(form.policyTree());
  form.dispatch('keydown', { key: 'Escape' });
  assert.equal(form.policyTree(), null);
  assert.equal(form.bodyOverflow(), 'auto');
  form.dispatch('keydown', { key: 'Escape' });
  assert.equal(form.bodyOverflow(), 'auto');
});

test('TC-PO05 a content click stays open while an overlay click closes the policy', () => {
  const form = mount();
  form.openPolicy(1);
  assert.equal(form.clickPolicyContent(), true, 'Dialog content must stop overlay propagation');
  assert.ok(form.policyTree());
  form.clickPolicyOverlay();
  assert.equal(form.policyTree(), null);
  assert.equal(form.bodyOverflow(), 'auto');
});

test('TC-PO06 consent policy event opens Privacy and invalid policy IDs are ignored', () => {
  const form = mount({ language: 'th' });
  form.dispatch('conrad:open-policy', { detail: { id: 'missing' } });
  assert.equal(form.policyTree(), null);
  form.dispatch('conrad:open-policy', { detail: { id: 'privacy' } });
  const title = [...descendants(form.policyTree())].find((node) => node.type === 'h3');
  assert.equal(text(title), policies.documents.privacy.title);
  form.closePolicy();
  assert.equal(form.bodyOverflow(), 'auto');
});
