'use strict';

const assert = require('node:assert/strict');
const { test, after } = require('node:test');
const contact = require('../api/contact.js');
const { validPhones, invalidPhones } = require('./helpers/phone-cases.cjs');
const originalFetch = global.fetch;
const originalUpstream = process.env.CONTACT_FORM_UPSTREAM;
after(() => {
  global.fetch = originalFetch;
  if (originalUpstream === undefined) delete process.env.CONTACT_FORM_UPSTREAM;
  else process.env.CONTACT_FORM_UPSTREAM = originalUpstream;
});

const lead = {
  name: 'Test customer', phone: '0812345678', type: 'นาฬิกาหรู',
  message: '=1+1', language: 'th', pageUrl: 'https://conradexpress.com/',
  userAgent: 'Test browser', submittedAt: '2026-11-05T00:00:00.000Z',
};

async function invoke(body = lead, method = 'POST', contentType = 'application/json') {
  const result = { headers: {} };
  const response = {
    setHeader: (name, value) => { result.headers[name] = value; },
    status: (code) => { result.status = code; return response; },
    json: (json) => { result.body = json; return response; },
  };
  await contact({ method, headers: { 'content-type': contentType }, body }, response);
  return result;
}

test('only an explicit storage acknowledgement returns success', async () => {
  let sent;
  global.fetch = async (url, options) => {
    sent = { url, options };
    return { ok: true, json: async () => ({ ok: true }) };
  };
  const response = await invoke({ ...lead, name: '  Test customer  ', unknown: 'discard me' });
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { ok: true });
  assert.equal(response.headers['Cache-Control'], 'no-store');
  assert.match(sent.url, /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/);
  assert.equal(sent.options.redirect, 'follow');
  assert.ok(sent.options.signal instanceof AbortSignal);
  assert.deepEqual(JSON.parse(sent.options.body), lead);
});

test('Sheets failure, opaque-like response, and non-JSON responses fail closed', async () => {
  for (const upstream of [
    { ok: true, json: async () => ({ ok: false, error: 'private sheet details' }) },
    { ok: false, status: 503, json: async () => ({ ok: true }) },
    { ok: false, status: 0 },
    { ok: true, json: async () => ({ ok: 'true' }) },
    { ok: true, json: async () => null },
    { ok: true, json: async () => { throw new SyntaxError('Google login HTML'); } },
  ]) {
    global.fetch = async () => upstream;
    const response = await invoke();
    assert.equal(response.status, 502);
    assert.deepEqual(response.body, { ok: false });
  }
});

test('network errors and timeouts never acknowledge a lead', async () => {
  for (const [name, status] of [['TypeError', 502], ['TimeoutError', 504], ['AbortError', 504]]) {
    global.fetch = async () => { throw Object.assign(new Error('network failed'), { name }); };
    const response = await invoke();
    assert.equal(response.status, status);
    assert.deepEqual(response.body, { ok: false });
  }
});

test('invalid methods, JSON bodies and field lengths do not reach Google', async () => {
  global.fetch = async () => { assert.fail('Invalid requests must not be forwarded'); };
  const methodResponse = await invoke(lead, 'GET');
  assert.equal(methodResponse.status, 405);
  assert.equal(methodResponse.headers.Allow, 'POST');
  assert.equal((await invoke(lead, 'POST', 'text/plain')).status, 415);
  for (const body of [null, [], '{', { ...lead, name: ' ' }, { ...lead, phone: 123 },
    { ...lead, message: 'x'.repeat(601) }, { ...lead, language: 'xx' }]) {
    assert.equal((await invoke(body)).status, 400);
  }
});

test('an invalid configured upstream does not forward customer data', async () => {
  process.env.CONTACT_FORM_UPSTREAM = 'https://example.com/';
  global.fetch = async () => { assert.fail('Untrusted upstream must not receive customer data'); };
  assert.equal((await invoke()).status, 503);
});

test('phone numbers follow the same format rule as the browser form', async () => {
  delete process.env.CONTACT_FORM_UPSTREAM;
  global.fetch = async () => { assert.fail('Invalid phone numbers must not be forwarded'); };
  for (const phone of [...invalidPhones, 'call me', '081-234-5678 ext 2', '<script>']) {
    assert.equal((await invoke({ ...lead, phone })).status, 400, `${JSON.stringify(phone)} must be rejected`);
  }
  const forwarded = [];
  global.fetch = async (url, options) => {
    forwarded.push(JSON.parse(options.body).phone);
    return { ok: true, json: async () => ({ ok: true }) };
  };
  for (const phone of validPhones) {
    assert.equal((await invoke({ ...lead, phone: ` ${phone} ` })).status, 200, `${phone} must be accepted`);
  }
  assert.deepEqual(forwarded, validPhones);
});
