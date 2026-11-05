/*
 * Conrad Express contact form receiver
 *
 * Setup:
 * 1. Create a Google Sheet for contact leads.
 * 2. Open Extensions > Apps Script.
 * 3. Paste this file into Code.gs.
 * 4. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Set the hosting environment variable CONTACT_FORM_UPSTREAM to the Web App
 *    URL (or update DEFAULT_UPSTREAM in api/contact.js), then redeploy the site.
 *    The browser form posts to the same-origin /api/contact proxy.
 */

const SHEET_ID = '1Q1pP6LvdgRp9jOhQ08AFBYJNSnopjqAyyoDeYSdro0s';
const SHEET_NAME = 'Customer_Inbox';
const NOTIFY_EMAILS = [
  'conradtime.time@gmail.com',
];

const HEADERS = [
  'Timestamp',
  'Name',
  'Phone',
  'Shipment Type',
  'Message',
  'Language',
  'Page URL',
  'User Agent',
];

const FIELD_LIMITS = {
  name: 80,
  phone: 32,
  type: 120,
  message: 600,
  language: 8,
  pageUrl: 2048,
  userAgent: 512,
};

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      // Sheet lookup/creation must share the same lock as row allocation.
      const sheet = getSheet_();
      ensureHeaders_(sheet);
      appendLead_(sheet, payload);
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    // A mail quota/outage must not turn an already saved lead into a failure.
    try {
      sendNotification_(payload);
    } catch (error) {
      console.error('Lead saved; notification failed:', error);
    }
    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: error.message || String(error) });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Missing request body');
  }

  const input = JSON.parse(e.postData.contents);
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('Invalid request body');
  }

  const payload = {};
  Object.keys(FIELD_LIMITS).forEach(function (field) {
    const value = input[field] === undefined ? '' : input[field];
    if (typeof value !== 'string') {
      throw new Error('Invalid field: ' + field);
    }
    payload[field] = value.trim();
    if (payload[field].length > FIELD_LIMITS[field]) {
      throw new Error('Field too long: ' + field);
    }
  });

  if (!payload.name || !payload.phone || !payload.type) {
    throw new Error('Missing required fields');
  }
  if (payload.language && payload.language !== 'en' && payload.language !== 'th') {
    throw new Error('Invalid field: language');
  }

  return payload;
}

function appendLead_(sheet, payload) {
  const fields = ['name', 'phone', 'type', 'message', 'language', 'pageUrl', 'userAgent'];
  const textValues = fields.map(function (field) {
    return SpreadsheetApp.newRichTextValue().setText(payload[field]).build();
  });

  // Only the server-generated Date goes through appendRow. User text is written
  // as RichTextValue so '=1+1', leading apostrophes and phone zeros stay literal.
  // https://developers.google.com/apps-script/reference/spreadsheet/range#setRichTextValues(RichTextValue)
  sheet.appendRow([new Date(), '', '', '', '', '', '', '']);
  sheet.getRange(sheet.getLastRow(), 2, 1, fields.length).setRichTextValues([textValues]);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
}

function sendNotification_(payload) {
  const recipients = NOTIFY_EMAILS.filter(Boolean).join(',');
  if (!recipients) return;

  const subject = `New Conrad Express request: ${payload.name}`;
  const body = [
    'New contact request from Conrad Express website',
    '',
    `Name: ${payload.name || '-'}`,
    `Phone: ${payload.phone || '-'}`,
    `Shipment Type: ${payload.type || '-'}`,
    `Message: ${payload.message || '-'}`,
    `Language: ${payload.language || '-'}`,
    `Page URL: ${payload.pageUrl || '-'}`,
    '',
    'This lead has been recorded in Google Sheets.',
  ].join('\n');

  MailApp.sendEmail({
    to: recipients,
    subject,
    body,
  });
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
