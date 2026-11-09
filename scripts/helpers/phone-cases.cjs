'use strict';

// Shared by the form and API suites so the browser and server phone rules
// cannot drift apart unnoticed.
const validPhones = [
  '0812345678', '081-234-5678', '081 234 5678', '081.234.5678', '0612345678', '0912345678',
  '021234567', '(02) 123-4567', '053 123 456', '076-123-456',
  '+66812345678', '+66 81 234 5678', '+66 (0)81 234 5678', '+66 2 123 4567',
  '+44 20 7946 0958', '+1 415 555 2671',
];

// Values that only contain phone characters, so they survive input
// sanitising and must be rejected by the format check itself.
const invalidPhones = [
  '12345', '0812345', '08123456789', '0123456789', '0012345678', '0000000000',
  '+66 1234 5678', '+66 81 234 567', '+0812345678', '+12', '1+0812345678', '--- ---',
];

module.exports = { validPhones, invalidPhones };
