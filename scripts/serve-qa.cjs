'use strict';

// Local browser QA only. The production API runs unchanged, but every upstream
// request is intercepted here: this server cannot send emails or write Sheets.
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const contact = require('../api/contact.js');
const port = Number(process.env.CONRAD_QA_PORT || 8755);

global.fetch = async (_url, options) => {
  const { message = '' } = JSON.parse(options.body);
  if (message.includes('[qa:slow]')) await new Promise((resolve) => setTimeout(resolve, 1500));
  if (message.includes('[qa:network-error]')) throw new TypeError('Simulated upstream network error');
  if (message.includes('[qa:http-error]')) return { ok: false, status: 503 };
  if (message.includes('[qa:bad-json]')) {
    return { ok: true, json: async () => { throw new SyntaxError('Simulated upstream HTML'); } };
  }
  return { ok: true, json: async () => ({ ok: !message.includes('[qa:fail]') }) };
};

const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2',
};

http.createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Conrad-QA', 'mock-upstream-only');
  try {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    if (url.pathname === '/api/contact') {
      let body = '';
      for await (const chunk of request) {
        body += chunk;
        if (Buffer.byteLength(body) > 16000) { response.writeHead(413).end(); return; }
      }
      try { request.body = JSON.parse(body); } catch { request.body = null; }
      response.status = (code) => { response.statusCode = code; return response; };
      response.json = (value) => {
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(value));
      };
      await contact(request, response);
      return;
    }
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
    const requested = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const file = path.resolve(root, '.' + requested);
    if (!file.startsWith(root + path.sep) || requested.split('/').some((part) => part.startsWith('.'))) {
      response.writeHead(403).end(); return;
    }
    let bytes = await fs.readFile(file);
    // Keep local consent/dataLayer behavior available for UI checks while
    // preventing test conversions from loading the production GTM container.
    if (url.pathname === '/src/analytics.js') {
      const source = bytes.toString('utf8');
      const loader = "  if (GTM_ID) {\n    window.dataLayer.push({ 'gtm.start':";
      if (!source.includes(loader)) throw new Error('Analytics QA guard needs updating');
      bytes = Buffer.from(source.replace(loader, "  if (false && GTM_ID) {\n    window.dataLayer.push({ 'gtm.start':"));
    } else if (url.pathname === '/' || url.pathname === '/index.html') {
      bytes = Buffer.from(bytes.toString('utf8').replace(/src\/analytics\.js\?[^"\s]+/, 'src/analytics.js?v=qa-local-no-tags'));
    }
    response.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch {
    if (!response.headersSent) response.writeHead(404);
    response.end();
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Conrad QA: http://127.0.0.1:${port} — MOCK upstream only; no emails or Sheets writes.`);
});
