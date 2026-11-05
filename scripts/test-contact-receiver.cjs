const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../integrations/google-sheets-contact.gs'), 'utf8');
const validLead = {
  name: 'Conrad Customer',
  phone: '0812345678',
  type: 'document',
  message: 'Please contact me',
  language: 'th',
  pageUrl: 'https://example.com/',
  userAgent: 'Receiver regression test',
};

// In-memory Apps Script services: these tests never write to a real Sheet or mail.
function receiver({ failAt, existingSheet = true } = {}) {
  const rows = [];
  const events = [];
  const mails = [];
  const errors = [];
  let locked = false;
  let sheetExists = existingSheet;
  const requireLock = () => assert.equal(locked, true, 'Sheet access must hold the script lock');
  const fail = (operation) => {
    if (failAt === operation) throw new Error(`${operation} failed`);
  };
  const writeValues = (row, column, values) => {
    for (let rowOffset = 0; rowOffset < values.length; rowOffset += 1) {
      const cells = rows[row + rowOffset - 1] || (rows[row + rowOffset - 1] = []);
      values[rowOffset].forEach((value, offset) => { cells[column + offset - 1] = value; });
    }
  };
  const sheet = {
    getLastRow() { requireLock(); return rows.length; },
    getRange(row, column, height = 1, width = 1) {
      requireLock();
      return {
        setValues(values) {
          requireLock();
          assert.equal(values.length, height);
          assert.equal(values[0].length, width);
          writeValues(row, column, values);
          return this;
        },
        setRichTextValues(values) {
          requireLock();
          fail('text');
          assert.equal(values.length, height);
          assert.equal(values[0].length, width);
          // A RichTextValue is a text-only sink, even for a leading '='.
          writeValues(row, column, values.map((cells) => cells.map((value) => value.getText())));
          events.push('text');
          return this;
        },
      };
    },
    appendRow(values) {
      requireLock();
      fail('append');
      // Untrusted formula-like strings must never reach this parsing API.
      assert.equal(values.some((value) => typeof value === 'string' && value.startsWith('=')), false);
      rows.push(Array.from(values));
      events.push('append');
      return this;
    },
    setFrozenRows(count) { requireLock(); assert.equal(count, 1); events.push('headers'); },
  };
  const context = vm.createContext({
    console: { error: (...args) => errors.push(args) },
    LockService: {
      getScriptLock: () => ({
        waitLock(timeout) {
          assert.equal(timeout, 10000);
          fail('lock');
          assert.equal(locked, false);
          locked = true;
          events.push('lock');
        },
        releaseLock() { requireLock(); locked = false; events.push('release'); },
      }),
    },
    SpreadsheetApp: {
      openById: () => {
        requireLock();
        fail('open');
        events.push('open');
        return {
          getSheetByName: () => { requireLock(); return sheetExists ? sheet : null; },
          insertSheet: () => { requireLock(); sheetExists = true; events.push('create'); return sheet; },
        };
      },
      newRichTextValue: () => {
        let text;
        return {
          setText(value) { assert.equal(typeof value, 'string'); text = value; return this; },
          build() { return { getText: () => text }; },
        };
      },
      flush() { requireLock(); fail('flush'); events.push('flush'); },
    },
    MailApp: {
      sendEmail(mail) {
        assert.equal(locked, false, 'Notification must run after the sheet lock is released');
        events.push('mail');
        fail('mail');
        mails.push(mail);
      },
    },
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput: (text) => ({ text, setMimeType(mimeType) { this.mimeType = mimeType; return this; } }),
    },
  });
  vm.runInContext(source, context, { filename: 'google-sheets-contact.gs' });
  function post(payload = validLead) {
    return event({ postData: { contents: JSON.stringify(payload) } });
  }
  function event(request) {
    const response = context.doPost(request);
    assert.equal(response.mimeType, 'application/json');
    return JSON.parse(response.text);
  }
  return { post, event, rows, events, mails, errors, isLocked: () => locked };
}

test('stores formula-like strings, phone zeros and apostrophes as exact text in the eight-column contract', () => {
  const app = receiver({ existingSheet: false });
  const lead = {
    name: "  '=1+1  ",
    phone: '  0012345678  ',
    type: '  =1+1  ',
    message: '  =IMPORTXML("https://example.com", "//title")\n+66 -123 @text  ',
    language: ' en ',
    pageUrl: ' =1+1 ',
    userAgent: ' =1+1 ',
  };
  assert.deepEqual(app.post(lead), { ok: true });
  assert.equal(app.rows.length, 2);
  assert.equal(app.rows[0].length, 8);
  assert.equal(app.rows[1].length, 8);
  assert.equal(Object.prototype.toString.call(app.rows[1][0]), '[object Date]');
  assert.deepEqual(app.rows[1].slice(1), Object.values(lead).map((value) => value.trim()));
  assert.deepEqual(app.events, ['lock', 'open', 'create', 'headers', 'append', 'text', 'flush', 'release', 'mail']);
  assert.equal(app.isLocked(), false);
  assert.equal(app.mails.length, 1);
  assert.ok(app.mails[0].body.includes('Phone: 0012345678'));
});

test('preserves international phone prefixes and appends without duplicating headers', () => {
  const app = receiver();
  assert.deepEqual(app.post({ ...validLead, phone: '+66812345678' }), { ok: true });
  assert.deepEqual(app.post({ ...validLead, phone: '-012345', message: "'literal" }), { ok: true });
  assert.equal(app.rows.length, 3);
  assert.equal(app.rows[1][2], '+66812345678');
  assert.equal(app.rows[2][2], '-012345');
  assert.equal(app.rows[2][4], "'literal");
  assert.equal(app.events.filter((event) => event === 'headers').length, 1);
});

test('optional fields default to empty text', () => {
  const app = receiver();
  assert.deepEqual(app.post({ name: '  Customer ', phone: ' 0812345678 ', type: ' documents ' }), { ok: true });
  assert.deepEqual(app.rows[1].slice(1), ['Customer', '0812345678', 'documents', '', '', '', '']);
});

test('rejects malformed JSON, non-object payloads, blank required fields and non-string fields before side effects', () => {
  const invalid = [null, [], true, 123, 'text', {}, { ...validLead, name: ' \t\n' },
    ...Object.keys(validLead).flatMap((field) => [null, 123, {}, [], false].map((value) => ({ ...validLead, [field]: value }))),
    { ...validLead, language: 'ja' },
  ];
  for (const payload of invalid) {
    const app = receiver();
    assert.equal(app.post(payload).ok, false, JSON.stringify(payload));
    assert.deepEqual(app.events, []);
    assert.deepEqual(app.rows, []);
    assert.deepEqual(app.mails, []);
  }
  for (const request of [undefined, {}, { postData: {} }, { postData: { contents: '{' } }]) {
    const app = receiver();
    assert.equal(app.event(request).ok, false);
    assert.deepEqual(app.events, []);
  }
});

test('enforces field limits without silently truncating customer data', () => {
  const limits = { name: 80, phone: 32, type: 120, message: 600, pageUrl: 2048, userAgent: 512 };
  for (const [field, limit] of Object.entries(limits)) {
    const exact = receiver();
    assert.equal(exact.post({ ...validLead, [field]: 'a'.repeat(limit) }).ok, true, field);
    const oversized = receiver();
    assert.equal(oversized.post({ ...validLead, [field]: 'a'.repeat(limit + 1) }).ok, false, field);
    assert.deepEqual(oversized.events, []);
  }
  const app = receiver();
  assert.equal(app.post({ ...validLead, language: 'a'.repeat(9) }).ok, false);
  assert.deepEqual(app.events, []);
});

test('acknowledges a saved lead even when email notification fails', () => {
  const app = receiver({ failAt: 'mail' });
  assert.deepEqual(app.post(), { ok: true });
  assert.equal(app.rows.length, 2);
  assert.deepEqual(app.rows[1].slice(1), Object.values(validLead));
  assert.equal(app.errors.length, 1);
  assert.equal(app.errors[0][0], 'Lead saved; notification failed:');
  assert.equal(app.isLocked(), false);
});

test('never acknowledges or emails a lead whose sheet write or flush fails; always releases an acquired lock', () => {
  for (const failAt of ['lock', 'open', 'append', 'text', 'flush']) {
    const app = receiver({ failAt });
    assert.equal(app.post().ok, false, failAt);
    assert.equal(app.mails.length, 0, failAt);
    assert.equal(app.events.includes('mail'), false, failAt);
    assert.equal(app.isLocked(), false, failAt);
    assert.equal(app.events.includes('release'), failAt !== 'lock', failAt);
  }
});
