'use strict';

// Server-side forwarding lets the browser read the Apps Script acknowledgement
// without relying on an opaque cross-origin response.
const DEFAULT_UPSTREAM = 'https://script.google.com/macros/s/AKfycbwSiEBlsmjYevzxkLyU25V2S4vJYpcnClHGJZnjqoGzPsG-CY0kwGj7286t7nQIVf8QWQ/exec';
const FIELD_LIMITS = {
  name: 80, phone: 32, type: 120, message: 600,
  language: 8, pageUrl: 2048, userAgent: 512, submittedAt: 64,
};

module.exports = async function contact(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ ok: false });
  }
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers['content-type'] || '')) {
    return response.status(415).json({ ok: false });
  }

  let payload;
  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
    payload = {};
    for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
      const value = body[field] === undefined ? '' : body[field];
      if (typeof value !== 'string' || value.length > limit) throw new Error('Invalid field');
      payload[field] = value.trim();
    }
    if (!payload.name || !payload.phone || !payload.type || !['th', 'en'].includes(payload.language)) {
      throw new Error('Missing required field');
    }
  } catch {
    return response.status(400).json({ ok: false });
  }

  const endpoint = process.env.CONTACT_FORM_UPSTREAM || DEFAULT_UPSTREAM;
  if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint)) {
    return response.status(503).json({ ok: false });
  }

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });
    if (!upstream.ok) throw new Error('Upstream HTTP error');
    const result = await upstream.json();
    if (result?.ok !== true) throw new Error('Lead was not acknowledged');
    return response.status(200).json({ ok: true });
  } catch (error) {
    // Do not log payloads or upstream bodies: they can contain customer details.
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError';
    return response.status(timedOut ? 504 : 502).json({ ok: false });
  }
};
