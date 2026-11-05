'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { transformSync } = require('@babel/core');
const jsxPlugin = require('@babel/plugin-transform-react-jsx');

const root = path.resolve(__dirname, '..');
const analyticsSource = fs.readFileSync(path.join(root, 'src/analytics.js'), 'utf8');
const bannerSource = transformSync(fs.readFileSync(path.join(root, 'src/components/ConsentBanner.jsx'), 'utf8'), {
  plugins: [jsxPlugin], babelrc: false, configFile: false,
}).code;
const copySource = fs.readFileSync(path.join(root, 'src/data/copy.js'), 'utf8');
const plain = (value) => JSON.parse(JSON.stringify(value));
const consentKeys = ['ad_storage', 'ad_user_data', 'ad_personalization', 'analytics_storage'];
const eventKeys = ['cta_location', 'link_url', 'package_name', 'form_name', 'shipment_type', 'form_language', 'consent_choice'];

// Actual analytics/bootstrap and banner code run in an isolated browser-shaped
// VM. Script insertion, cookies and storage are observed; no network is used.
function boot({ id = 'GTM-WQMDLLGG', stored = null, blockedStorage = false,
  cookies = '_ga=ga-value; _gid=gid-value; _gcl_au=ads-value; essential=session' } = {}) {
  const store = new Map(stored === null ? [] : [['conrad-consent', stored]]);
  const insertedScripts = [];
  const cookieWrites = [];
  const dispatched = [];
  const documentListeners = new Map();
  const windowListeners = new Map();
  const atInsertion = [];
  const window = {
    location: { hostname: 'www.conradexpress.com' },
    localStorage: {
      getItem(key) { if (blockedStorage) throw new Error('Storage blocked'); return store.get(key) ?? null; },
      setItem(key, value) { if (blockedStorage) throw new Error('Storage blocked'); store.set(key, value); },
    },
    addEventListener(name, callback) {
      if (!windowListeners.has(name)) windowListeners.set(name, new Set());
      windowListeners.get(name).add(callback);
    },
    removeEventListener(name, callback) { windowListeners.get(name)?.delete(callback); },
    dispatchEvent(event) {
      dispatched.push(event);
      for (const callback of windowListeners.get(event.type) || []) callback(event);
    },
  };
  const document = {
    currentScript: { getAttribute(name) { return name === 'data-gtm-id' ? id : null; } },
    createElement(name) { assert.equal(name, 'script'); return {}; },
    head: { appendChild(script) { atInsertion.push(Array.from(window.dataLayer)); insertedScripts.push(script); } },
    addEventListener(name, callback, capture) { documentListeners.set(name, { callback, capture }); },
  };
  Object.defineProperty(document, 'cookie', {
    get: () => cookies,
    set: (value) => cookieWrites.push(value),
  });
  const context = vm.createContext({
    window, document,
    CustomEvent: class CustomEvent { constructor(type, options = {}) { this.type = type; this.detail = options.detail; } },
  });
  vm.runInContext(analyticsSource, context, { filename: 'src/analytics.js' });
  const api = window.ConradAnalytics;
  return {
    context, window, api, store, insertedScripts, cookieWrites, dispatched, documentListeners, atInsertion,
    commands: () => window.dataLayer.filter((entry) => typeof entry?.[0] === 'string').map((entry) => Array.from(entry)),
    events: () => window.dataLayer.filter((entry) => entry && typeof entry.event === 'string'),
    click({ href = 'https://line.me/ti/p/~@ConradExpress', cta = 'nav', packageName, nested = true } = {}) {
      const holder = cta === null ? null : { getAttribute: (name) => name === 'data-cta' ? cta : null };
      const link = {
        href: new URL(href, 'https://conradexpress.com/').href,
        getAttribute: (name) => name === 'href' ? href : name === 'data-package' ? packageName ?? null : null,
        closest: (selector) => selector === '[data-cta]' ? holder : selector === 'a[href]' ? link : null,
      };
      const target = nested ? { closest: (selector) => selector === 'a[href]' ? link : null } : link;
      documentListeners.get('click').callback({ target });
    },
  };
}

function* nodes(node) {
  if (!node || typeof node !== 'object') return;
  yield node;
  for (const child of node.props?.children || []) yield* nodes(child);
}
const text = (node) => node == null || node === false ? '' : typeof node !== 'object'
  ? String(node) : (node.props?.children || []).map(text).join('');

function mountBanner(runtime, language = 'th') {
  const slots = [];
  let cursor = 0;
  let effects = [];
  let tree;
  const React = {
    createElement: (type, props, ...children) => ({ type, props: { ...props, children: children.flat(Infinity) } }),
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
      return [slots[index], (next) => { slots[index] = typeof next === 'function' ? next(slots[index]) : next; }];
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
  runtime.context.React = React;
  vm.runInContext(copySource, runtime.context, { filename: 'src/data/copy.js' });
  vm.runInContext(bannerSource, runtime.context, { filename: 'ConsentBanner.jsx' });
  const render = () => {
    cursor = 0;
    effects = [];
    tree = runtime.window.ConsentBanner({ c: runtime.window.CONRAD_EXPRESS_COPY[language], gold: '#e2b56f', navy: '#0f1e35' });
    effects.forEach((effect) => effect());
  };
  render();
  return {
    get tree() { return tree; },
    get copy() { return runtime.window.CONRAD_EXPRESS_COPY[language].consent; },
    click(label) {
      const button = [...nodes(tree)].find((node) => node.type === 'button' && text(node) === label);
      assert.ok(button, `Expected a visible banner button: ${label}`);
      button.props.onClick();
      render();
    },
    reopen() { runtime.api.openConsentSettings(); render(); },
    language(value) { language = value; render(); },
  };
}

test('TC-AN01 defaults deny nonessential storage before loading the configured GTM container', () => {
  const runtime = boot();
  assert.equal(runtime.api.enabled, true);
  assert.equal(runtime.api.getConsent(), null);
  assert.equal(runtime.insertedScripts.length, 1);
  const { src, async } = runtime.insertedScripts[0];
  assert.equal(src, 'https://www.googletagmanager.com/gtm.js?id=GTM-WQMDLLGG');
  assert.equal(async, true);
  const initial = runtime.atInsertion[0][0];
  assert.deepEqual(Array.from(initial).slice(0, 2), ['consent', 'default']);
  consentKeys.forEach((key) => assert.equal(initial[2][key], 'denied'));
  assert.equal(initial[2].security_storage, 'granted');
  assert.equal(initial[2].functionality_storage, 'granted');
  assert.equal(initial[2].wait_for_update, 500);
  assert.deepEqual(plain(runtime.commands()[1]), ['set', 'ads_data_redaction', true]);
});

test('TC-AN02 restores a saved granted choice after applying safe defaults', () => {
  const runtime = boot({ stored: JSON.stringify({ version: 1, choice: 'granted' }) });
  assert.equal(runtime.api.getConsent(), 'granted');
  const commands = runtime.commands();
  assert.deepEqual(commands[2].slice(0, 2), ['consent', 'update']);
  consentKeys.forEach((key) => assert.equal(commands[2][2][key], 'granted'));
  assert.ok(runtime.atInsertion[0].includes(runtime.window.dataLayer[2]), 'Saved update precedes tag loading');
});

test('TC-AN03 restores a denied choice without granting any nonessential storage', () => {
  const runtime = boot({ stored: JSON.stringify({ version: 1, choice: 'denied' }) });
  assert.equal(runtime.api.getConsent(), 'denied');
  assert.equal(runtime.commands().filter((command) => command[0] === 'consent' && command[1] === 'update').length, 0);
  consentKeys.forEach((key) => assert.equal(runtime.commands()[0][2][key], 'denied'));
});

test('TC-AN04 corrupt, unsupported and unavailable storage safely behaves as no consent choice', () => {
  for (const options of [
    { stored: '{' }, { stored: JSON.stringify({ version: 0, choice: 'granted' }) },
    { stored: JSON.stringify({ version: 1, choice: 'unknown' }) }, { blockedStorage: true },
  ]) {
    const runtime = boot(options);
    assert.equal(runtime.api.getConsent(), null);
    assert.equal(runtime.commands().length, 2);
    assert.equal(runtime.commands()[0][2].analytics_storage, 'denied');
  }
});

test('TC-AN05 empty or invalid GTM IDs never insert a network-loading script', () => {
  for (const id of ['', 'not-a-container', 'GTM-<script>', 'GTM-abc123']) {
    const runtime = boot({ id });
    assert.equal(runtime.api.enabled, false);
    assert.equal(runtime.api.gtmId, '');
    assert.equal(runtime.insertedScripts.length, 0);
    assert.equal(runtime.events().some((event) => event.event === 'gtm.js'), false);
  }
});

test('TC-AN06 granting consent updates all consent keys, persists version and dispatches the change event', () => {
  const runtime = boot();
  runtime.api.setConsent('granted');
  assert.equal(runtime.api.getConsent(), 'granted');
  const stored = JSON.parse(runtime.store.get('conrad-consent'));
  assert.equal(stored.version, 1);
  assert.equal(stored.choice, 'granted');
  assert.ok(Number.isFinite(Date.parse(stored.updatedAt)));
  const update = runtime.commands().at(-1);
  consentKeys.forEach((key) => assert.equal(update[2][key], 'granted'));
  assert.equal(runtime.events().at(-1).event, 'consent_update');
  assert.equal(runtime.events().at(-1).consent_choice, 'granted');
  assert.equal(runtime.dispatched.at(-1).type, 'conrad:consent-change');
  assert.deepEqual(plain(runtime.dispatched.at(-1).detail), { choice: 'granted' });
});

test('TC-AN07 withdrawing consent denies storage and clears Google cookies for host/domain scopes only', () => {
  const runtime = boot({ stored: JSON.stringify({ version: 1, choice: 'granted' }) });
  runtime.api.setConsent('denied');
  assert.equal(runtime.api.getConsent(), 'denied');
  consentKeys.forEach((key) => assert.equal(runtime.commands().at(-1)[2][key], 'denied'));
  for (const cookieName of ['_ga', '_gid', '_gcl_au']) {
    for (const domain of ['', '; domain=.www.conradexpress.com', '; domain=.conradexpress.com']) {
      assert.ok(runtime.cookieWrites.includes(`${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`));
    }
  }
  assert.equal(runtime.cookieWrites.some((cookie) => cookie.startsWith('essential=')), false);
  assert.equal(JSON.parse(runtime.store.get('conrad-consent')).choice, 'denied');
});

test('TC-AN08 invalid choices do nothing and blocked storage still permits a page-lifetime choice', () => {
  const runtime = boot();
  const count = runtime.window.dataLayer.length;
  for (const choice of ['yes', undefined, null, true]) runtime.api.setConsent(choice);
  assert.equal(runtime.window.dataLayer.length, count);
  assert.equal(runtime.store.size, 0);
  const blocked = boot({ blockedStorage: true });
  assert.doesNotThrow(() => blocked.api.setConsent('granted'));
  assert.equal(blocked.api.getConsent(), 'granted');
  assert.equal(blocked.dispatched.at(-1).detail.choice, 'granted');
});

test('TC-AN09 nested LINE/package links retain CTA attribution and clear stale parameters on subsequent clicks', () => {
  const runtime = boot();
  assert.equal(runtime.documentListeners.get('click').capture, true);
  runtime.click({ cta: 'packages', packageName: 'Standard' });
  const packageEvent = runtime.events().at(-1);
  assert.equal(packageEvent.event, 'line_click');
  assert.equal(packageEvent.package_name, 'Standard');
  assert.equal(packageEvent.cta_location, 'packages');
  runtime.click({ href: 'https://lin.ee/test-link', cta: 'floating_line' });
  const next = runtime.events().at(-1);
  assert.equal(next.event, 'line_click');
  assert.equal(next.cta_location, 'floating_line');
  eventKeys.forEach((key) => assert.equal(Object.hasOwn(next, key), true));
  assert.equal(next.package_name, undefined);
  assert.equal(next.form_name, undefined);
});

test('TC-AN10 phone, email, internal CTA and unattributed LINE clicks produce the expected event names', () => {
  const runtime = boot();
  for (const [options, expected, location] of [
    [{ href: 'tel:+6620169950', cta: 'contact_details' }, 'phone_click', 'contact_details'],
    [{ href: 'mailto:conradtime.time@gmail.com', cta: 'contact_details' }, 'email_click', 'contact_details'],
    [{ href: '#contact', cta: 'hero' }, 'cta_click', 'hero'],
    [{ href: 'https://line.me/ti/p/~@ConradExpress', cta: null }, 'line_click', 'unknown'],
  ]) {
    runtime.click(options);
    const event = runtime.events().at(-1);
    assert.equal(event.event, expected);
    assert.equal(event.cta_location, location);
    assert.equal(event.link_url, new URL(options.href, 'https://conradexpress.com/').href);
    for (const privateField of ['name', 'phone', 'message', 'userAgent']) assert.equal(Object.hasOwn(event, privateField), false);
  }
});

test('TC-AN11 unrelated external links and non-link targets do not create conversions', () => {
  const runtime = boot();
  const count = runtime.events().length;
  runtime.click({ href: 'https://example.com/', cta: null });
  runtime.documentListeners.get('click').callback({ target: { closest: () => null } });
  runtime.documentListeners.get('click').callback({ target: null });
  assert.equal(runtime.events().length, count);
});

test('TC-AN12 consent banner is visible for a new visitor and hidden for disabled analytics or a saved choice', () => {
  const fresh = mountBanner(boot());
  assert.ok(fresh.tree);
  assert.equal(fresh.tree.props.role, 'region');
  assert.equal(fresh.tree.props['aria-label'], fresh.copy.title);
  assert.equal(mountBanner(boot({ id: '' })).tree, null);
  for (const choice of ['granted', 'denied']) {
    assert.equal(mountBanner(boot({ stored: JSON.stringify({ version: 1, choice }) })).tree, null);
  }
});

test('TC-AN13 rejecting or accepting from the banner persists the matching choice and dismisses the banner', () => {
  for (const [button, choice] of [['reject', 'denied'], ['accept', 'granted']]) {
    const runtime = boot();
    const banner = mountBanner(runtime);
    banner.click(banner.copy[button]);
    assert.equal(banner.tree, null);
    assert.equal(runtime.api.getConsent(), choice);
    assert.equal(JSON.parse(runtime.store.get('conrad-consent')).choice, choice);
  }
});

test('TC-AN14 cookie settings reopens a saved-choice banner and permits revoking previous consent', () => {
  const runtime = boot({ stored: JSON.stringify({ version: 1, choice: 'granted' }) });
  const banner = mountBanner(runtime);
  assert.equal(banner.tree, null);
  banner.reopen();
  assert.ok(banner.tree);
  banner.click(banner.copy.reject);
  assert.equal(runtime.api.getConsent(), 'denied');
  assert.equal(banner.tree, null);
  assert.ok(runtime.cookieWrites.length > 0);
});

test('TC-AN15 banner privacy control requests the privacy dialog without changing the consent choice', () => {
  const runtime = boot();
  const banner = mountBanner(runtime);
  banner.click(banner.copy.policy);
  assert.equal(runtime.dispatched.at(-1).type, 'conrad:open-policy');
  assert.deepEqual(plain(runtime.dispatched.at(-1).detail), { id: 'privacy' });
  assert.equal(runtime.api.getConsent(), null);
  assert.ok(banner.tree);
});

test('TC-AN16 banner copy changes between Thai and English while keeping its consent controls usable', () => {
  const runtime = boot();
  const banner = mountBanner(runtime, 'th');
  const thaiTitle = banner.tree.props['aria-label'];
  banner.language('en');
  assert.notEqual(banner.tree.props['aria-label'], thaiTitle);
  assert.equal(banner.tree.props['aria-label'], runtime.window.CONRAD_EXPRESS_COPY.en.consent.title);
  banner.click(banner.copy.reject);
  assert.equal(runtime.api.getConsent(), 'denied');
});
