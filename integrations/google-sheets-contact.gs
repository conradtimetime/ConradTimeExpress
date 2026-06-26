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
 * 5. Copy the Web App URL into src/data/config.js:
 *    contact.formEndpoint = "https://script.google.com/macros/s/.../exec"
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

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const row = [
      new Date(),
      payload.name || '',
      payload.phone || '',
      payload.type || '',
      payload.message || '',
      payload.language || '',
      payload.pageUrl || '',
      payload.userAgent || '',
    ];

    const sheet = getSheet_();
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      ensureHeaders_(sheet);
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    sendNotification_(payload);
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

  const payload = JSON.parse(e.postData.contents);
  if (!payload.name || !payload.phone || !payload.type) {
    throw new Error('Missing required fields');
  }

  return payload;
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
