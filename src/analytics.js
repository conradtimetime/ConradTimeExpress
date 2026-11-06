/*
 * Conrad Express analytics bootstrap.
 *
 * The first deferred script in <head>, before the app. This avoids blocking
 * HTML parsing; Consent Mode defaults below still enter the dataLayer before
 * this bootstrap creates the only GTM loader on the page.
 *
 * - GTM container ID comes from the `data-gtm-id` attribute on this script tag.
 *   The build script stamps it from SITE_CONFIG.analytics.gtmId
 *   (src/data/config.js). Empty ID = GTM is not loaded, nothing leaves the page.
 * - Consent Mode v2: everything non-essential is denied until the visitor
 *   accepts in the consent banner (PDPA). The choice is kept in localStorage.
 * - Conversion events are pushed to window.dataLayer. Never put PII (name,
 *   phone, message) in event params.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  var rawId = (script && script.getAttribute('data-gtm-id')) || '';
  var GTM_ID = /^GTM-[A-Z0-9]{4,12}$/.test(rawId) ? rawId : '';

  var STORAGE_KEY = 'conrad-consent';
  var CONSENT_VERSION = 1;
  var DENIED = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  };
  var GRANTED = {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  };
  // Keys used by our events. Each push resets them so values from an earlier
  // event (e.g. package_name) don't leak into the next one in GTM's data model.
  var EVENT_KEYS = ['cta_location', 'link_url', 'package_name', 'form_name', 'shipment_type', 'form_language', 'consent_choice'];

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function readConsent() {
    try {
      var stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null');
      if (stored && stored.version === CONSENT_VERSION && (stored.choice === 'granted' || stored.choice === 'denied')) {
        return stored.choice;
      }
    } catch (error) { /* storage blocked or corrupt: treat as no choice */ }
    return null;
  }

  function writeConsent(choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: CONSENT_VERSION,
        choice: choice,
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) { /* storage blocked: choice lasts for this page view only */ }
  }

  // Remove Google Analytics / Ads cookies after consent is withdrawn.
  function clearGoogleCookies() {
    var host = window.location.hostname;
    var parts = host.split('.');
    var domains = [''];
    for (var i = 0; i < parts.length - 1; i += 1) {
      domains.push('; domain=.' + parts.slice(i).join('.'));
    }
    document.cookie.split(';').forEach(function (pair) {
      var name = pair.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat|_gcl|_gac)/.test(name)) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + domain;
      });
    });
  }

  function track(eventName, params) {
    var payload = { event: eventName };
    EVENT_KEYS.forEach(function (key) { payload[key] = undefined; });
    Object.keys(params || {}).forEach(function (key) { payload[key] = params[key]; });
    window.dataLayer.push(payload);
  }

  var consent = readConsent();

  gtag('consent', 'default', Object.assign({}, DENIED, {
    functionality_storage: 'granted',
    security_storage: 'granted',
    wait_for_update: 500,
  }));
  gtag('set', 'ads_data_redaction', true);
  if (consent === 'granted') gtag('consent', 'update', GRANTED);

  function setConsent(choice) {
    if (choice !== 'granted' && choice !== 'denied') return;
    var previous = consent;
    consent = choice;
    writeConsent(choice);
    gtag('consent', 'update', choice === 'granted' ? GRANTED : DENIED);
    if (choice === 'denied' && previous === 'granted') clearGoogleCookies();
    track('consent_update', { consent_choice: choice });
    window.dispatchEvent(new CustomEvent('conrad:consent-change', { detail: { choice: choice } }));
  }

  window.ConradAnalytics = {
    enabled: Boolean(GTM_ID),
    gtmId: GTM_ID,
    track: track,
    getConsent: function () { return consent; },
    setConsent: setConsent,
    openConsentSettings: function () {
      window.dispatchEvent(new CustomEvent('conrad:open-consent'));
    },
  };

  // Outbound contact clicks. Capture phase so handlers that stop propagation
  // (e.g. package cards) can't hide the click. `data-cta` on the link (or a
  // parent) names where on the page it was clicked.
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link) return;

    var href = link.getAttribute('href') || '';
    var holder = link.closest('[data-cta]');
    var params = {
      cta_location: holder ? holder.getAttribute('data-cta') : 'unknown',
      link_url: link.href,
    };
    var packageName = link.getAttribute('data-package');
    if (packageName) params.package_name = packageName;

    if (/^https?:\/\/(line\.me|lin\.ee)\//i.test(link.href)) {
      track('line_click', params);
    } else if (/^tel:/i.test(href)) {
      track('phone_click', params);
    } else if (/^mailto:/i.test(href)) {
      track('email_click', params);
    } else if (holder) {
      track('cta_click', params);
    }
  }, true);

  if (GTM_ID) {
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var gtm = document.createElement('script');
    gtm.async = true;
    gtm.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID);
    document.head.appendChild(gtm);
  }
})();
